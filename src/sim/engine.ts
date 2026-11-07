import {
  BASE_ENEMY_HP,
  BRACKET_BUDGETS,
  BRACKET_ENEMY_SCALE,
  ENEMY_ARCHETYPES,
  MATERIAL_TIER_SPECS,
  buildAffixLoadoutBudget,
  buildMaterialTierBudget,
  buildWeaponArchetypeBudget,
  resolveClassStatsForBracket,
  resolvePostureProfile,
} from './archetypes.js';
import {
  AFFIX_LOADOUT_IDS,
  ARCHETYPE_IDS,
  BRACKET_IDS,
  WEAPON_ARCHETYPE_IDS,
  type ActiveStatusInstance,
  type AffixLoadoutPoint,
  type BracketBudget,
  type BracketId,
  type ClassBracketSummary,
  type ClassDefinition,
  type ClassMultiWaveRun,
  type ClassRotationTimeline,
  type CombatState,
  type DamageChannelBreakdown,
  type EffectDefinition,
  type EnemyArchetype,
  type EnemyArchetypeId,
  type GearAndWavesArtifact,
  type MaterialTierPoint,
  type ResolvedClassStats,
  type RotationTimelineEvent,
  type SimBaselineArtifact,
  type SimImplementationMode,
  type SimTelemetry,
  type SkillDefinition,
  type WavePullTelemetryPoint,
  type WeaponArchetypePoint,
} from './types.js';

export const TICK_MS = 100;

const AOE_REGEX =
  /whirl|storm|thunder|explosion|meteor|chain|nova|cleave|quake|blizzard|fire.?field|mass_|blade_storm|flurry|aoe|area|multishot|volley|momentum|shuriken/i;

function clamp(val: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, val));
}

function round2(val: number): number {
  return Math.round(val * 100) / 100;
}

export function resolveDeterministicRoll(
  acc: number,
  probability: number
): [boolean, number] {
  const p = clamp(probability, 0, 1);
  const next = acc + p;
  if (next >= 1.0 - 1e-9) {
    return [true, next - 1.0];
  }
  return [false, next];
}

function getSkillUnlockTier(skill: SkillDefinition): number {
  return skill.progressionTreeLevel ?? skill.unlockLevel ?? 999;
}

function isAoeOrCleaveSkill(skill: SkillDefinition): boolean {
  if (AOE_REGEX.test(skill.id) || AOE_REGEX.test(skill.name)) {
    return true;
  }
  if ((skill.scalingFormula.splashRatio ?? 0) > 0) {
    return true;
  }
  return false;
}

function isStrictMultiTargetOnlySkill(skill: SkillDefinition): boolean {
  const id = skill.id.toLowerCase();
  if (id === 'samurai_frenzied_whirlwind') {
    return false;
  }
  return (
    id.includes('whirlwind') ||
    id.includes('chain_lightning') ||
    id.includes('meteor') ||
    id.includes('multishot') ||
    id.includes('bolt_volley')
  );
}

/**
 * Resolves the exact HP % auto-trigger threshold for heal spells and potions
 * from UO Idle's hotbar priority loop `ro(e)` (`_raw/bundle/abilities-loader-and-hotbar.js:627-695`,
 * `[[tick-and-cooldowns]] C10-C12`, `[[simulator-fidelity-audit]] C6`).
 */
export function resolveHotbarHealTriggerPct(abilityId: string): number {
  const id = abilityId.toLowerCase();
  if (id === 'greater_heal_potion') return 18;
  if (id === 'heal_potion') return 32;
  if (id === 'lesser_heal_potion') return 50;
  if (id.includes('greater_heal') || id.endsWith('_gh')) return 40;
  if (id === 'mage_heal') return 50;
  return 55;
}

/**
 * Evaluates whether a hotbar skill is eligible to fire on the current tick per `ro(e)`
 * (`_raw/bundle/abilities-loader-and-hotbar.js:627-695`, `[[tick-and-cooldowns]] C10-C13`).
 */
export function evaluateHotbarAutoTrigger(
  skill: SkillDefinition,
  hpPct: number,
  primaryTargetHpPct: number,
  aliveTargetCount: number,
  selfBuffs: ActiveStatusInstance[],
  targetDebuffs: ActiveStatusInstance[],
  mode: SimImplementationMode,
  deathStrikeSwingsRemaining: number
): boolean {
  if (skill.effectType === 'heal') {
    const triggerPct = resolveHotbarHealTriggerPct(skill.id);
    if (hpPct > triggerPct) {
      return false;
    }
  }
  const execThreshold = skill.scalingFormula.executeThresholdHpPct ?? 0;
  if (execThreshold > 0 && primaryTargetHpPct > execThreshold) {
    return false;
  }
  if (isStrictMultiTargetOnlySkill(skill) && aliveTargetCount < 2) {
    return false;
  }
  if (
    skill.effectType === 'self_buff' &&
    skill.statusEffect &&
    selfBuffs.some((b) => b.id === skill.statusEffect?.id)
  ) {
    return false;
  }
  if (
    skill.effectType === 'debuff' &&
    skill.statusEffect &&
    targetDebuffs.some((d) => d.id === skill.statusEffect?.id)
  ) {
    return false;
  }
  if (
    skill.effectType === 'dot' &&
    skill.statusEffect &&
    targetDebuffs.some((d) => d.id === skill.statusEffect?.id)
  ) {
    return false;
  }
  if (
    mode === 'mode_b' &&
    (skill.id.includes('death') || skill.id.includes('twin_shadow')) &&
    deathStrikeSwingsRemaining > 0
  ) {
    return false;
  }
  return true;
}

/**
 * Selects up to 6 active hotbar skills unlocked at or below bracket.level,
 * ordered by UO Idle's hotbar priority conventions (ro(e)):
 * 1. Active heal skill (when HP threshold reached)
 * 2. Active execute finisher (when enemy HP <= executeThresholdHpPct)
 * 3. Active debuff (when not active on target)
 * 4. Active self_buff / summon / dot maintenance (when not active on self/target)
 * 5. AoE / Cleave skill (prioritized when fighting multi-target pack)
 * 6. Highest-tier direct offensive skills
 */
export function buildHotbarLoadout(
  classDef: ClassDefinition,
  bracket: BracketBudget
): {
  passives: SkillDefinition[];
  hotbar: SkillDefinition[];
} {
  const unlocked = classDef.abilities.filter((skill) => {
    const tier = getSkillUnlockTier(skill);
    return tier <= bracket.level && skill.inCatalog !== false;
  });

  const passives = unlocked.filter((s) => s.kind === 'Passive');
  const actives = unlocked.filter(
    (s) => s.kind !== 'Passive' && !s.id.endsWith('_cure') && !s.id.includes('_provoke')
  );

  const heals = actives
    .filter((s) => s.effectType === 'heal')
    .sort((a, b) => getSkillUnlockTier(b) - getSkillUnlockTier(a));
  const executes = actives
    .filter((s) => (s.scalingFormula.executeThresholdHpPct ?? 0) > 0)
    .sort((a, b) => getSkillUnlockTier(b) - getSkillUnlockTier(a));
  const debuffs = actives
    .filter((s) => s.effectType === 'debuff')
    .sort((a, b) => getSkillUnlockTier(b) - getSkillUnlockTier(a));
  const buffsAndDots = actives
    .filter((s) => s.effectType === 'self_buff' || s.effectType === 'dot')
    .sort((a, b) => getSkillUnlockTier(b) - getSkillUnlockTier(a));
  const aoeSkills = actives
    .filter((s) => isAoeOrCleaveSkill(s))
    .sort((a, b) => getSkillUnlockTier(b) - getSkillUnlockTier(a));
  const directOffense = actives
    .filter(
      (s) =>
        s.effectType === 'direct_damage' &&
        (s.scalingFormula.executeThresholdHpPct ?? 0) === 0
    )
    .sort((a, b) => getSkillUnlockTier(b) - getSkillUnlockTier(a));

  const selected: SkillDefinition[] = [];
  const seen = new Set<string>();
  const tryAdd = (skill: SkillDefinition | undefined): void => {
    if (!skill || seen.has(skill.id) || selected.length >= 6) {
      return;
    }
    seen.add(skill.id);
    selected.push(skill);
  };

  tryAdd(heals[0]);
  tryAdd(executes[0]);
  tryAdd(debuffs[0]);
  tryAdd(buffsAndDots[0]);
  tryAdd(aoeSkills[0]);
  if (aoeSkills.length > 1) {
    tryAdd(aoeSkills[1]);
  }
  for (const skill of directOffense) {
    tryAdd(skill);
  }
  for (const skill of buffsAndDots.slice(1)) {
    tryAdd(skill);
  }
  for (const skill of debuffs.slice(1)) {
    tryAdd(skill);
  }

  return { passives, hotbar: selected };
}

function sumModifierStat(
  instances: ActiveStatusInstance[],
  passiveEffects: EffectDefinition[],
  statName: string
): number {
  let total = 0;
  for (const eff of passiveEffects) {
    for (const mod of eff.modifiers) {
      if (mod.stat === statName) {
        total += mod.value;
      }
    }
  }
  for (const inst of instances) {
    for (const mod of inst.effect.modifiers) {
      if (mod.stat === statName) {
        total += mod.value;
      }
    }
  }
  return total;
}

/**
 * Evaluates effective cooldown in ms enforcing the 2,000ms server floor for Custom skills
 * ([[resources]] C14, [[tick-and-cooldowns]]).
 */
export function resolveEffectiveCooldownMs(skill: SkillDefinition): number {
  if (skill.kind === 'Custom') {
    return Math.max(2000, skill.cooldownMs || skill.customCooldownMs || 2000);
  }
  return Math.max(1000, skill.cooldownMs || 2000);
}

/**
 * Evaluates runtime mana and stamina cost, enforcing:
 * - Warrior's 0-mana override (`tI`, `[[resources]] C15`)
 * - Lower Mana Cost (`LMC`) cap of 40% (`_raw/bundle/i18n-en-abilities.js:2616`, `[[equipment-affixes]] C10`).
 */
export function resolveSkillResourceCost(
  classDef: ClassDefinition,
  skill: SkillDefinition,
  bracket?: BracketBudget
): { manaCost: number; staminaCost: number } {
  if (classDef.resourceProfile.primaryResource === 'zero-mana-physical') {
    const convertedStam =
      skill.staminaCost > 0 ? skill.staminaCost : Math.max(0, skill.manaCost);
    return { manaCost: 0, staminaCost: convertedStam };
  }
  const effectiveLmcPct = clamp(bracket?.lowerManaCostPct ?? 0, 0, 40);
  const rawMana = Math.max(0, skill.manaCost);
  const discountedMana =
    rawMana > 0 ? Math.max(1, Math.round(rawMana * (1 - effectiveLmcPct / 100))) : 0;
  return {
    manaCost: discountedMana,
    staminaCost: Math.max(0, skill.staminaCost),
  };
}

/**
 * Weapon swing interval `Sg` (`[[tick-and-cooldowns]]`, `[[damage-and-defense]]`, `[[equipment-affixes]] C7`):
 * - Gear Swing Speed Increase (`SSI`) is capped at 60% (`Math.min(60, bracket.swingSpeedIncreasePct)`).
 * - Progression tree `Speed` (`bracket.treeSpeedPct`) and active haste buffs (`buffAttackSpeedPct`) stack above the 60% gear cap.
 * - Minimum swing interval is hard-clamped at 1,000ms (`1.0s`).
 */
export function computeSwingIntervalMs(
  bracket: BracketBudget,
  currentStamina: number,
  buffAttackSpeedPct: number,
  baseWeaponSpeedOverrideMs?: number
): number {
  const cappedGearSsi = clamp(bracket.swingSpeedIncreasePct, 0, 60);
  const treeSpeed = Math.max(0, bracket.treeSpeedPct ?? 0);
  const effectiveSsi = cappedGearSsi + treeSpeed + buffAttackSpeedPct;
  const speedDivisor = 1 + currentStamina / 200 + effectiveSsi / 100;
  const baseSpeed = baseWeaponSpeedOverrideMs ?? bracket.baseWeaponSpeedMs;
  return Math.max(1000, Math.floor(baseSpeed / Math.max(0.25, speedDivisor)));
}

/**
 * Hit chance `vq/Gs` (`[[damage-and-defense]] C4`, `[[equipment-affixes]] C8-C9`):
 * - Attacker `HCI` gear cap is 45% (`Math.min(45, bracket.hitChanceIncreasePct)`), plus posture/skill accuracy bonus.
 * - Defender `DCI` (`archetype.defenderDciPct`, capped at 45%) reduced by active target defense-chance shred (`Surprise Attack`).
 */
export function computeHitChance(
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  archetype: EnemyArchetype,
  isSpell: boolean,
  accuracyBonusPct: number,
  defenderDciDeltaPct = 0
): number {
  if (isSpell) {
    return 0.95;
  }
  const postureProfile = resolvePostureProfile(stats.posture);
  const effectiveHci =
    clamp(bracket.hitChanceIncreasePct, 0, 45) +
    postureProfile.bonusHciPct +
    accuracyBonusPct;
  const baseDefenderDci = clamp(archetype.defenderDciPct ?? 0, 0, 45);
  const effectiveDci = Math.max(0, baseDefenderDci + defenderDciDeltaPct);
  const effectiveAttackSkill = Math.min(100, bracket.skillLevel);
  const rawHit =
    ((effectiveAttackSkill + 20) * (100 + effectiveHci)) /
    ((archetype.defenseSkill + 20) * 2 * (100 + effectiveDci));
  return clamp(rawHit, 0.05, 0.95);
}

/**
 * Critical hit chance `yq` (`[[damage-and-defense]] C7`):
 * - `DEX / 500 + (critChancePct + postureCrit + buffCritPct) / 100`, hard-capped at 50%.
 */
export function computeCritChance(
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  buffCritPct: number
): number {
  const postureProfile = resolvePostureProfile(stats.posture);
  const rawCrit =
    stats.dex / 500 +
    (bracket.critChancePct + postureProfile.bonusCritPct + buffCritPct) / 100;
  return clamp(rawCrit, 0, 0.5);
}

/**
 * Base physical auto-attack damage `fj/Zo` (`[[damage-and-defense]] C5`, `[[equipment-affixes]] C6`, `[[simulator-fidelity-audit]] C2-C3`):
 * - Weapon skill bonus flattens above 100 (`Math.min(100, bracket.skillLevel)`).
 * - Gear Damage Increase (`DI`) is capped at 100% (`Math.min(100, bracket.damageIncreasePct)`).
 * - Hunting Bot posture outgoing damage multiplier (`agressivo` 1.2x, `equilibrado` 1.0x, `defensivo` 0.6x) scales output.
 */
export function computeAutoAttackRawDamage(
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  buffDamagePct: number,
  perfectionBonusPct: number
): number {
  const postureProfile = resolvePostureProfile(stats.posture);
  const effectiveWeaponSkill = Math.min(100, bracket.skillLevel);
  const cappedGearDi = clamp(bracket.damageIncreasePct, 0, 100);
  const multiplier =
    1 +
    effectiveWeaponSkill / 100 +
    effectiveWeaponSkill / 200 +
    (stats.str * 0.3) / 100 +
    (cappedGearDi + buffDamagePct + perfectionBonusPct) / 100;
  return (
    bracket.weaponAvgDmg *
    multiplier *
    stats.levelFactor *
    postureProfile.outgoingDamageMultiplier
  );
}

/**
 * Complete 1H (`48,000`), 2H (`41,140`), and Shield (`400`) `CheckParry` + `DCI` avoidance formula
 * (`_raw/modernuo/BaseWeapon.cs:1505-1570`, `[[modernuo-bushido]] C10-C12`, `[[simulator-fidelity-audit]] C4`):
 * - Shield + Bushido penalty: `(parry - bushido) / 400` (clamped >= 0).
 * - Shield without Bushido (pure Parry): `parry / 400 + (parry >= 100 ? 0.05 : 0)`.
 * - Weapon parry without shield: `Math.max((parry * bushido) / divisor, parry / 800) + GM 5% bonus`,
 *   where `divisor = isTwoHanded ? 41140 : 48000`.
 * - Low-DEX penalty when `DEX < 80`: `chance * (20 + DEX) / 100`.
 */
export function computeParryAndAvoidanceChance(
  classDef: ClassDefinition,
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  buffEvasionPct: number
): number {
  const hasParrySkill = classDef.starterSkills.some((s) => s.skillKey === 'parry');
  const hasBushidoSkill = classDef.starterSkills.some((s) => s.skillKey === 'bushido');
  const parry = hasParrySkill || hasBushidoSkill ? bracket.skillLevel : 0;
  const bushido = hasBushidoSkill ? bracket.skillLevel : 0;

  let baseParryChance = 0;
  if (parry > 0 || bushido > 0) {
    const gmBonus = parry >= 100 || bushido >= 100 ? 0.05 : 0;
    if (stats.hasShield) {
      if (bushido > 0) {
        baseParryChance = Math.max(0, (parry - bushido) / 400) + gmBonus;
      } else {
        baseParryChance = parry / 400 + (parry >= 100 ? 0.05 : 0);
      }
    } else {
      const divisor = stats.isTwoHanded ? 41140 : 48000;
      const bushidoWeaponParry = (parry * bushido) / divisor + gmBonus;
      const legacyWeaponParry = parry / 800 + (parry >= 100 ? 0.05 : 0);
      baseParryChance = Math.max(bushidoWeaponParry, legacyWeaponParry);
    }

    if (stats.dex < 80) {
      baseParryChance *= (20 + stats.dex) / 100;
    }
  }

  const cappedDci = clamp(bracket.defenseChanceIncreasePct, 0, 45);
  const dciAvoidance = cappedDci / (2 * (100 + cappedDci));
  return clamp(baseParryChance + buffEvasionPct / 100 + dciAvoidance, 0, 0.65);
}

/**
 * Evaluates active skill raw damage, hit count, AoE target count, secondary-target `splashRatio`,
 * and elemental vs physical channel implementing `Aq/Mq` (spells) and `Cq` (physical/hybrid abilities)
 * from `[[damage-and-defense]] C6`, `[[equipment-affixes]] C5`, and `[[simulator-fidelity-audit]] C3/C5`.
 */
export function computeSkillBaseOutput(
  classDef: ClassDefinition,
  skill: SkillDefinition,
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  targetHpPct: number,
  activeTargetCount: number,
  buffDamagePct: number,
  perfectionBonusPct: number
): {
  rawDamagePerHit: number;
  hits: number;
  targetsHit: number;
  splashRatio: number;
  isElemental: boolean;
  armorIgnorePct: number;
} {
  const id = skill.id.toLowerCase();
  const rank = bracket.abilityRank;
  const tactics = Math.min(100, bracket.skillLevel);
  const magery = Math.min(100, bracket.skillLevel);
  const evalInt = Math.min(100, bracket.skillLevel);
  const postureProfile = resolvePostureProfile(stats.posture);

  let isElemental =
    skill.kind === 'Spell' ||
    skill.scalingFormula.stat === 'magery' ||
    skill.scalingFormula.stat === 'int' ||
    skill.scalingFormula.stat === 'necromancy' ||
    skill.scalingFormula.stat === 'spellweaving' ||
    id.includes('lightning_arrow') ||
    id.includes('meteor') ||
    id.includes('chain_lightning');

  // Bushido spells CounterAttack/Confidence/Evasion are stance/heal spells, while MomentumStrike is physical
  if (skill.scalingFormula.stat === 'bushido') {
    isElemental = false;
  }

  let armorIgnorePct = 0;
  if (skill.weaponAbilityRef === 1 || id.includes('piercing') || id.includes('charged_shot')) {
    armorIgnorePct = 100;
  } else if (id.includes('lightning') || id.includes('frenzied_whirlwind')) {
    armorIgnorePct = 25;
  }
  if (skill.statusEffect) {
    for (const mod of skill.statusEffect.modifiers) {
      if (mod.stat === 'armor_ignore_pct') {
        armorIgnorePct = Math.max(armorIgnorePct, mod.value);
      }
    }
  }

  let hits = skill.scalingFormula.hits ?? 1;
  if (id.includes('multishot') || id.includes('bolt_volley') || id.includes('flurry')) {
    hits = Math.max(hits, 2 + rank);
  }

  let targetsHit = 1;
  if (activeTargetCount > 1 && isAoeOrCleaveSkill(skill)) {
    if (id.includes('momentum')) {
      targetsHit = Math.min(2, activeTargetCount);
    } else {
      targetsHit = activeTargetCount;
    }
  }

  const configuredSplash = skill.scalingFormula.splashRatio ?? 0;
  const splashRatio =
    configuredSplash > 0 && configuredSplash <= 1 ? configuredSplash : 1.0;

  const autoRaw = computeAutoAttackRawDamage(
    bracket,
    stats,
    buffDamagePct,
    perfectionBonusPct
  );

  let rawDamagePerHit = autoRaw;

  if (isElemental) {
    // Aq(id, magery, evalInt) * Mq(id) scaled by INT (+1% per 10 INT), capped SDI (<= 50%), and server x80 caster levelFactor
    const s = magery * 0.5 + evalInt * 0.3;
    const schoolMult = skill.scalingFormula.schoolMultiplier ?? 1.75;
    const minMult = skill.scalingFormula.minMultiplier ?? 0.12;
    const maxMult = skill.scalingFormula.maxMultiplier ?? 0.18;

    let baseMin = 12 + s * minMult;
    let baseMax = 24 + s * maxMult;
    if (id.includes('magic_arrow')) {
      baseMin = 3 + s * 0.05;
      baseMax = 8 + s * 0.08;
    } else if (id.includes('harm')) {
      baseMin = 6 + s * 0.08;
      baseMax = 14 + s * 0.12;
    } else if (id.includes('fireball')) {
      baseMin = 10 + s * 0.1;
      baseMax = 20 + s * 0.15;
    } else if (id.includes('lightning') && !id.includes('chain')) {
      baseMin = 14 + s * 0.12;
      baseMax = 28 + s * 0.18;
    } else if (id.includes('energy_bolt')) {
      baseMin = 14 + s * 0.12;
      baseMax = 28 + s * 0.18;
    } else if (id.includes('explosion') || id.includes('flamestrike') || id.includes('flame_strike')) {
      baseMin = 20 + s * 0.15;
      baseMax = 40 + s * 0.22;
    } else if (id.includes('chain_lightning')) {
      baseMin = 16 + 5 * rank + s * 0.12;
      baseMax = 24 + 5 * rank + s * 0.18;
    } else if (id.includes('meteor')) {
      baseMin = 26 + stats.int * 0.6;
      baseMax = 42 + stats.int * 0.9;
    }

    const avgSpellBase = ((baseMin + baseMax) / 2) * schoolMult;
    const cappedGearSdi = clamp(bracket.spellDamageIncreasePct, 0, 50);
    const intBonusSdiPct = Math.floor(stats.int / 10);
    const casterBonus =
      1 +
      evalInt / 100 +
      stats.int / 100 +
      (cappedGearSdi + intBonusSdiPct + buffDamagePct) / 100;
    rawDamagePerHit =
      avgSpellBase *
      casterBonus *
      stats.levelFactor *
      postureProfile.outgoingDamageMultiplier;
  } else {
    // Physical / Bushido / Ninjitsu ability scaling (Cq + weapon multiplier)
    const minMult = skill.scalingFormula.minMultiplier ?? 1.0;
    const maxMult = skill.scalingFormula.maxMultiplier ?? minMult;
    const avgMult = (minMult + maxMult) / 2;
    const postureMult = postureProfile.outgoingDamageMultiplier;

    if (id.includes('execution') || id.includes('deadeye') || id.includes('kensei_judgment')) {
      const cqBase = Math.floor(tactics * 0.6) + 20 * rank;
      rawDamagePerHit =
        autoRaw * 1.15 + cqBase * stats.levelFactor * postureMult;
    } else if (id.includes('shield_bash') || id.includes('earthshaker')) {
      const cqBase = 13 + 5 * rank + Math.floor(tactics * 0.15);
      rawDamagePerHit =
        autoRaw * 0.85 + cqBase * stats.levelFactor * postureMult;
    } else if (id.includes('heavy_strike') || id.includes('crushing')) {
      const cqBase = 14 + Math.floor(tactics * 0.25);
      rawDamagePerHit =
        autoRaw * 1.25 + cqBase * stats.levelFactor * postureMult;
    } else if (id.includes('multishot') || id.includes('bolt_volley')) {
      const perHitCq = 10 + 5 * rank;
      rawDamagePerHit =
        autoRaw * 0.55 + perHitCq * stats.levelFactor * postureMult;
    } else if (id.includes('double_strike')) {
      rawDamagePerHit = autoRaw * (avgMult * 0.6);
    } else {
      rawDamagePerHit = autoRaw * Math.max(0.85, avgMult);
    }
  }

  // Apply execute multiplier when target HP % is at or below threshold
  const execThreshold = skill.scalingFormula.executeThresholdHpPct ?? 0;
  const execMult = skill.scalingFormula.executeMultiplier ?? 1.0;
  if (execThreshold > 0 && targetHpPct <= execThreshold && execMult > 1.0) {
    rawDamagePerHit *= execMult;
  }

  return {
    rawDamagePerHit,
    hits,
    targetsHit,
    splashRatio,
    isElemental,
    armorIgnorePct,
  };
}

/**
 * Applies target resistance mitigation (Zo, capped at 70% resist per [[damage-and-defense]]).
 */
export function applyTargetMitigation(
  rawDamage: number,
  archetype: EnemyArchetype,
  isElemental: boolean,
  armorIgnorePct: number,
  targetDefenseDeltaPct: number
): number {
  const baseResist = isElemental ? archetype.elemResistPct : archetype.physResistPct;
  // targetDefenseDeltaPct is negative when Armor Break (-20) is active on enemy
  const effectiveResist = clamp(
    baseResist + targetDefenseDeltaPct - (baseResist * clamp(armorIgnorePct, 0, 100)) / 100,
    0,
    70
  );
  return Math.max(1, rawDamage * (1 - effectiveResist / 100));
}

function upsertStatusInstance(
  list: ActiveStatusInstance[],
  sourceSkillId: string,
  effect: EffectDefinition,
  dotDamagePerTick: number,
  isElemental: boolean
): void {
  const existingIdx = list.findIndex((inst) => inst.id === effect.id);
  const newInst: ActiveStatusInstance = {
    id: effect.id,
    sourceSkillId,
    effect,
    remainingMs: Math.max(1000, effect.durationMs),
    nextTickCountdownMs: effect.tickIntervalMs > 0 ? effect.tickIntervalMs : 1000,
    dotDamagePerTick,
    isElemental,
  };

  if (existingIdx >= 0) {
    if (effect.stackingRule === 'stack' || effect.stackingRule === 'independent') {
      list.push(newInst);
    } else {
      list[existingIdx] = newInst;
    }
  } else {
    if (effect.stackingRule === 'exclusive_posture') {
      for (let i = list.length - 1; i >= 0; i--) {
        if (list[i].effect.stackingRule === 'exclusive_posture') {
          list.splice(i, 1);
        }
      }
    }
    list.push(newInst);
  }
}

type DamageChannel = 'auto' | 'special' | 'execute' | 'dot' | 'proc';

interface UnifiedKernelContext {
  classDef: ClassDefinition;
  bracket: BracketBudget;
  archetype: EnemyArchetype;
  stats: ResolvedClassStats;
  mode: SimImplementationMode;
  hotbar: SkillDefinition[];
  passiveEffects: EffectDefinition[];
  enemyScale: number;
  manaRegenPerSec: number;
  staminaRegenPerSec: number;
  hpRegenPerSec: number;
  hasBandageInHotbar: boolean;
  hasManaPotionInHotbar: boolean;
  timelineHorizonMs: number;
  state: CombatState;
  enemyAttackTimerMs: number;
  totalEffectiveDamage: number;
  totalRawDamage: number;
  autoAttackEffectiveDmg: number;
  specialMoveEffectiveDmg: number;
  executeEffectiveDmg: number;
  dotEffectiveDmg: number;
  procCounterEffectiveDmg: number;
  totalCasts: number;
  totalSwings: number;
  totalHits: number;
  totalCrits: number;
  parryCount: number;
  cloneInterceptions: number;
  oomTicks: number;
  totalManaSpent: number;
  totalManaRegenerated: number;
  totalStaminaSpent: number;
  totalStaminaRegenerated: number;
  totalHpHealedOrRegenerated: number;
  totalIncomingDamageMitigated: number;
  timelineEvents: RotationTimelineEvent[];
  onTargetKilled?: (targetIdx: number) => void;
}

function createUnifiedKernelContext(
  classDef: ClassDefinition,
  bracket: BracketBudget,
  archetype: EnemyArchetype,
  mode: SimImplementationMode,
  initialTargets: number[],
  singleTargetMaxHp: number,
  enemyScale: number,
  timelineHorizonMs = 0,
  onTargetKilled?: (targetIdx: number) => void
): UnifiedKernelContext {
  const stats = resolveClassStatsForBracket(classDef, bracket);
  const { passives, hotbar } = buildHotbarLoadout(classDef, bracket);
  const passiveEffects: EffectDefinition[] = [];
  for (const p of passives) {
    if (p.statusEffect) {
      passiveEffects.push(p.statusEffect);
    }
  }

  const hasMeditation =
    classDef.resourceProfile.meditationCap > 0 &&
    classDef.starterSkills.some((s) => s.skillKey === 'meditation');
  const meditationSkill = hasMeditation ? Math.min(100, bracket.skillLevel) : 0;
  const focusSkill = Math.min(100, bracket.skillLevel);

  const manaRegenPerSec =
    classDef.resourceProfile.primaryResource === 'zero-mana-physical'
      ? 0
      : 1.0 + (meditationSkill / 100) * 2.5 + focusSkill / 200 + bracket.manaRegenAffix;
  const staminaRegenPerSec = 1.8 + (focusSkill / 100) * 2.4 + bracket.staminaRegenAffix;
  const hpRegenPerSec = 0.8 + bracket.hpRegenAffix;

  const hasBandageInHotbar = classDef.seededHotbar.some((s) => s.abilityId === 'bandage');
  const hasManaPotionInHotbar =
    classDef.resourceProfile.primaryResource !== 'zero-mana-physical' &&
    classDef.seededHotbar.some((s) => s.abilityId.includes('mana_potion'));

  const state: CombatState = {
    tick: 0,
    elapsedMs: 0,
    hp: stats.maxHP,
    maxHP: stats.maxHP,
    stamina: stats.maxStamina,
    maxStamina: stats.maxStamina,
    mana: stats.maxMana,
    maxMana: stats.maxMana,
    swingCooldownMs: 0,
    potionCooldownMs: 0,
    bandageCooldownMs: 0,
    skillCooldownsMs: new Map<string, number>(),
    selfBuffs: [],
    targetDebuffs: [],
    targetHpPools: [...initialTargets],
    targetMaxHp: singleTargetMaxHp,
    perfectionStreakBonusPct: 0,
    cloneStacks: 0,
    cloneIcdMs: 0,
    counterStanceRemainingMs: 0,
    counterIcdMs: 0,
    deathStrikeSwingsRemaining: 0,
    deathStrikePendingDamage: 0,
    hitAcc: 0.5,
    critAcc: 0.25,
    parryAcc: 0.35,
    procAcc: 0.4,
  };

  return {
    classDef,
    bracket,
    archetype,
    stats,
    mode,
    hotbar,
    passiveEffects,
    enemyScale,
    manaRegenPerSec,
    staminaRegenPerSec,
    hpRegenPerSec,
    hasBandageInHotbar,
    hasManaPotionInHotbar,
    timelineHorizonMs,
    state,
    enemyAttackTimerMs: archetype.enemyAttackIntervalMs,
    totalEffectiveDamage: 0,
    totalRawDamage: 0,
    autoAttackEffectiveDmg: 0,
    specialMoveEffectiveDmg: 0,
    executeEffectiveDmg: 0,
    dotEffectiveDmg: 0,
    procCounterEffectiveDmg: 0,
    totalCasts: 0,
    totalSwings: 0,
    totalHits: 0,
    totalCrits: 0,
    parryCount: 0,
    cloneInterceptions: 0,
    oomTicks: 0,
    totalManaSpent: 0,
    totalManaRegenerated: 0,
    totalStaminaSpent: 0,
    totalStaminaRegenerated: 0,
    totalHpHealedOrRegenerated: 0,
    totalIncomingDamageMitigated: 0,
    timelineEvents: [],
    onTargetKilled,
  };
}

function dealKernelDamageToTarget(
  ctx: UnifiedKernelContext,
  targetIdx: number,
  mitigatedDmg: number,
  channel: DamageChannel = 'special'
): number {
  const { state, mode } = ctx;
  const currentHp = state.targetHpPools[targetIdx] ?? 0;
  if (currentHp <= 0) {
    return 0;
  }
  const clampedDmg = Math.max(1, mitigatedDmg);
  ctx.totalRawDamage += clampedDmg;
  const effective = Math.min(currentHp, clampedDmg);
  ctx.totalEffectiveDamage += effective;

  if (channel === 'auto') {
    ctx.autoAttackEffectiveDmg += effective;
  } else if (channel === 'execute') {
    ctx.executeEffectiveDmg += effective;
  } else if (channel === 'dot') {
    ctx.dotEffectiveDmg += effective;
  } else if (channel === 'proc') {
    ctx.procCounterEffectiveDmg += effective;
  } else {
    ctx.specialMoveEffectiveDmg += effective;
  }

  const nextHp = currentHp - effective;
  if (mode === 'mode_b' && nextHp <= 0) {
    state.perfectionStreakBonusPct = 0;
  }
  state.targetHpPools[targetIdx] = nextHp;
  if (nextHp <= 0 && ctx.onTargetKilled) {
    ctx.onTargetKilled(targetIdx);
  }
  return effective;
}

/**
 * Advances cooldowns, buffs, passive regeneration, and consumable sustain slots by 100ms (`TICK_MS`).
 * Used on every tick (both active combat ticks and inter-wave travel ticks).
 */
function stepKernelTimersAndSustain(ctx: UnifiedKernelContext, tick: number): void {
  const { state, bracket } = ctx;
  state.tick = tick;
  state.elapsedMs = tick * TICK_MS;

  // 1. Advance cooldown timers
  state.swingCooldownMs = Math.max(0, state.swingCooldownMs - TICK_MS);
  state.potionCooldownMs = Math.max(0, state.potionCooldownMs - TICK_MS);
  state.bandageCooldownMs = Math.max(0, state.bandageCooldownMs - TICK_MS);
  state.cloneIcdMs = Math.max(0, state.cloneIcdMs - TICK_MS);
  state.counterStanceRemainingMs = Math.max(0, state.counterStanceRemainingMs - TICK_MS);
  state.counterIcdMs = Math.max(0, state.counterIcdMs - TICK_MS);

  state.skillCooldownsMs.forEach((rem, key) => {
    if (rem <= TICK_MS) {
      state.skillCooldownsMs.delete(key);
    } else {
      state.skillCooldownsMs.set(key, rem - TICK_MS);
    }
  });

  // 2. Tick active self buffs & HoTs (e.g. Confidence Inner Calm regeneration)
  for (let i = state.selfBuffs.length - 1; i >= 0; i--) {
    const buff = state.selfBuffs[i];
    buff.remainingMs -= TICK_MS;
    if (buff.effect.effectType === 'heal' && buff.effect.tickIntervalMs > 0) {
      buff.nextTickCountdownMs -= TICK_MS;
      if (buff.nextTickCountdownMs <= 0) {
        buff.nextTickCountdownMs += buff.effect.tickIntervalMs;
        const skillCap = Math.min(100, bracket.skillLevel);
        const hotHeal = Math.max(2, Math.floor((15 + (skillCap * skillCap) / 576) / 4));
        state.hp = Math.min(state.maxHP, state.hp + hotHeal);
        ctx.totalHpHealedOrRegenerated += hotHeal;
      }
    }
    if (buff.remainingMs <= 0) {
      state.selfBuffs.splice(i, 1);
    }
  }

  // 3. Every 1,000ms: apply passive resource regeneration (Eq)
  if (state.elapsedMs % 1000 === 0) {
    state.hp = Math.min(state.maxHP, state.hp + ctx.hpRegenPerSec);
    ctx.totalHpHealedOrRegenerated += ctx.hpRegenPerSec;

    state.stamina = Math.min(state.maxStamina, state.stamina + ctx.staminaRegenPerSec);
    ctx.totalStaminaRegenerated += ctx.staminaRegenPerSec;

    if (state.maxMana > 0) {
      state.mana = Math.min(state.maxMana, state.mana + ctx.manaRegenPerSec);
      ctx.totalManaRegenerated += ctx.manaRegenPerSec;
    }
  }

  // 4. Consumable sustain slots (`ro(e)` potion & bandage triggers + `EnhancePotions` cap 50%)
  const hpPct = (state.hp / state.maxHP) * 100;
  const manaPct = state.maxMana > 0 ? (state.mana / state.maxMana) * 100 : 100;
  const enhancePotionsMult = 1 + clamp(bracket.enhancePotionsPct ?? 0, 0, 50) / 100;

  if (hpPct <= 50 && state.potionCooldownMs <= 0) {
    const basePotionFraction = hpPct <= 18 ? 0.35 : hpPct <= 32 ? 0.25 : 0.15;
    const potionHeal = state.maxHP * basePotionFraction * enhancePotionsMult;
    state.hp = Math.min(state.maxHP, state.hp + potionHeal);
    ctx.totalHpHealedOrRegenerated += potionHeal;
    state.potionCooldownMs = 10000;
  } else if (
    ctx.hasManaPotionInHotbar &&
    state.maxMana > 0 &&
    manaPct <= 40 &&
    state.potionCooldownMs <= 0
  ) {
    const manaRestore = state.maxMana * 0.25 * enhancePotionsMult;
    state.mana = Math.min(state.maxMana, state.mana + manaRestore);
    ctx.totalManaRegenerated += manaRestore;
    state.potionCooldownMs = 10000;
  }

  if (ctx.hasBandageInHotbar && hpPct <= 80 && state.bandageCooldownMs <= 0) {
    const skillCap = Math.min(100, bracket.skillLevel);
    const minBandage = skillCap / 8 + skillCap / 5 + 4;
    const maxBandage = skillCap / 6 + skillCap / 2.5 + 4;
    const avgBandage = (minBandage + maxBandage) / 2;
    state.hp = Math.min(state.maxHP, state.hp + avgBandage);
    ctx.totalHpHealedOrRegenerated += avgBandage;
    state.bandageCooldownMs = 8000;
  }
}

/**
 * Resolves DoT ticks, active hotbar priority queue `ro(e)`, passive auto-attacks (`Sg`),
 * and incoming enemy attacks (Clone interception, 1H/2H/Shield `CheckParry`, armor resist, posture incoming mult, and `ReflectPhysical`).
 */
function stepKernelCombatActions(ctx: UnifiedKernelContext): void {
  const {
    classDef,
    bracket,
    archetype,
    stats,
    mode,
    hotbar,
    passiveEffects,
    state,
    timelineHorizonMs,
    timelineEvents,
  } = ctx;

  const targetDefenseDeltaPct = sumModifierStat(state.targetDebuffs, [], 'defense_pct');
  const targetDciDeltaPct = sumModifierStat(state.targetDebuffs, [], 'defense_chance_pct');

  // 1. Tick target debuffs and DoTs
  for (let i = state.targetDebuffs.length - 1; i >= 0; i--) {
    const debuff = state.targetDebuffs[i];
    debuff.remainingMs -= TICK_MS;
    if (debuff.dotDamagePerTick > 0) {
      debuff.nextTickCountdownMs -= TICK_MS;
      if (debuff.nextTickCountdownMs <= 0) {
        debuff.nextTickCountdownMs +=
          debuff.effect.tickIntervalMs > 0 ? debuff.effect.tickIntervalMs : 1000;
        const dotMitigated = applyTargetMitigation(
          debuff.dotDamagePerTick,
          archetype,
          debuff.isElemental,
          0,
          targetDefenseDeltaPct
        );
        const primaryIdx = state.targetHpPools.findIndex((hp) => hp > 0);
        if (primaryIdx >= 0) {
          const eff = dealKernelDamageToTarget(ctx, primaryIdx, dotMitigated, 'dot');
          if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs && eff > 0) {
            timelineEvents.push({
              timeMs: state.elapsedMs,
              kind: 'dot',
              label: debuff.effect.name,
              damage: round2(eff),
              isCrit: false,
            });
          }
        }
      }
    }
    if (debuff.remainingMs <= 0) {
      state.targetDebuffs.splice(i, 1);
    }
  }

  const aliveIndices = state.targetHpPools
    .map((hp, idx) => (hp > 0 ? idx : -1))
    .filter((idx) => idx >= 0);

  if (aliveIndices.length === 0) {
    return;
  }

  const hpPct = (state.hp / state.maxHP) * 100;
  const primaryTargetIdx = aliveIndices[0];
  const primaryTargetHpPct =
    (state.targetHpPools[primaryTargetIdx] / state.targetMaxHp) * 100;

  const buffDamagePct = sumModifierStat(
    state.selfBuffs,
    passiveEffects,
    'damage_dealt_pct'
  );
  const buffAttackSpeedPct = sumModifierStat(
    state.selfBuffs,
    passiveEffects,
    'attack_speed_pct'
  );
  const buffCritPct = sumModifierStat(state.selfBuffs, passiveEffects, 'crit_chance_pct');
  const buffPerfectionPct = sumModifierStat(
    state.selfBuffs,
    passiveEffects,
    'perfection_streak_pct'
  );
  const totalPerfectionBonus =
    mode === 'mode_b'
      ? Math.max(state.perfectionStreakBonusPct, buffPerfectionPct)
      : buffPerfectionPct;

  // 2. Evaluate 6-slot active hotbar priority queue ro(e) (at most 1 active skill fires per tick)
  let castSkillThisTick = false;
  let anySkillOffCooldownButOom = false;

  for (const skill of hotbar) {
    if ((state.skillCooldownsMs.get(skill.id) ?? 0) > 0) {
      continue;
    }

    if (
      !evaluateHotbarAutoTrigger(
        skill,
        hpPct,
        primaryTargetHpPct,
        aliveIndices.length,
        state.selfBuffs,
        state.targetDebuffs,
        mode,
        state.deathStrikeSwingsRemaining
      )
    ) {
      continue;
    }

    const { manaCost, staminaCost } = resolveSkillResourceCost(classDef, skill, bracket);
    if (state.mana < manaCost || state.stamina < staminaCost) {
      anySkillOffCooldownButOom = true;
      continue;
    }

    // Deduct resources and set cooldown
    state.mana -= manaCost;
    ctx.totalManaSpent += manaCost;
    state.stamina -= staminaCost;
    ctx.totalStaminaSpent += staminaCost;
    state.skillCooldownsMs.set(skill.id, resolveEffectiveCooldownMs(skill));
    ctx.totalCasts++;
    castSkillThisTick = true;

    // Resolve skill effect
    if (skill.effectType === 'heal') {
      const healFraction = skill.id.includes('greater') ? 0.35 : 0.15;
      const healAmount = state.maxHP * healFraction;
      state.hp = Math.min(state.maxHP, state.hp + healAmount);
      ctx.totalHpHealedOrRegenerated += healAmount;
      if (skill.statusEffect) {
        upsertStatusInstance(state.selfBuffs, skill.id, skill.statusEffect, 0, true);
      }
      if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs) {
        timelineEvents.push({
          timeMs: state.elapsedMs,
          kind: 'cast',
          label: skill.name,
          damage: 0,
          isCrit: false,
        });
      }
    } else if (skill.effectType === 'self_buff') {
      if (skill.statusEffect) {
        upsertStatusInstance(state.selfBuffs, skill.id, skill.statusEffect, 0, false);
        for (const mod of skill.statusEffect.modifiers) {
          if (mod.stat === 'clone_stacks') {
            state.cloneStacks = Math.min(3, Math.max(1, Math.round(mod.value)));
          }
        }
      }
      if (
        mode === 'mode_b' &&
        (skill.id.includes('mirror') || skill.id.includes('fukiya_barrage'))
      ) {
        state.cloneStacks =
          skill.id.endsWith('_r2') || skill.id.includes('fukiya_barrage') ? 2 : 1;
      }
      // Mode B idle synergy: Smoke Bomb (Vanish & Volley) accelerates Shuriken readiness
      if (mode === 'mode_b' && skill.id === 'ninja_smoke_bomb') {
        const shurikenRem = state.skillCooldownsMs.get('ninja_shuriken') ?? 0;
        if (shurikenRem > 0) {
          if (shurikenRem <= 2500) {
            state.skillCooldownsMs.delete('ninja_shuriken');
          } else {
            state.skillCooldownsMs.set('ninja_shuriken', shurikenRem - 2500);
          }
        }
      }
      if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs) {
        timelineEvents.push({
          timeMs: state.elapsedMs,
          kind: 'cast',
          label: skill.name,
          damage: 0,
          isCrit: false,
        });
      }
    } else if (skill.effectType === 'debuff') {
      if (skill.statusEffect) {
        upsertStatusInstance(state.targetDebuffs, skill.id, skill.statusEffect, 0, false);
      }
      let castDmg = 0;
      if (skill.kind === 'WeaponAbility' || skill.kind === 'SpecialMove') {
        const out = computeSkillBaseOutput(
          classDef,
          skill,
          bracket,
          stats,
          primaryTargetHpPct,
          aliveIndices.length,
          buffDamagePct,
          totalPerfectionBonus
        );
        const mitigated = applyTargetMitigation(
          out.rawDamagePerHit,
          archetype,
          out.isElemental,
          out.armorIgnorePct,
          targetDefenseDeltaPct
        );
        castDmg = dealKernelDamageToTarget(ctx, primaryTargetIdx, mitigated, 'special');
      }
      if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs) {
        timelineEvents.push({
          timeMs: state.elapsedMs,
          kind: 'cast',
          label: skill.name,
          damage: round2(castDmg),
          isCrit: false,
        });
      }
    } else if (skill.effectType === 'dot') {
      const out = computeSkillBaseOutput(
        classDef,
        skill,
        bracket,
        stats,
        primaryTargetHpPct,
        aliveIndices.length,
        buffDamagePct,
        totalPerfectionBonus
      );
      const tickCount = Math.max(1, skill.statusEffect?.tickCount ?? 5);
      const dotPerTick = (out.rawDamagePerHit * 0.45) / Math.min(6, tickCount);
      if (skill.statusEffect) {
        upsertStatusInstance(
          state.targetDebuffs,
          skill.id,
          skill.statusEffect,
          dotPerTick,
          out.isElemental
        );
      }
      if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs) {
        timelineEvents.push({
          timeMs: state.elapsedMs,
          kind: 'cast',
          label: skill.name,
          damage: 0,
          isCrit: false,
        });
      }
    } else {
      // direct_damage (including primary 100% + secondary splashRatio scaling)
      const out = computeSkillBaseOutput(
        classDef,
        skill,
        bracket,
        stats,
        primaryTargetHpPct,
        aliveIndices.length,
        buffDamagePct,
        totalPerfectionBonus
      );
      const accuracyBonus =
        skill.id.includes('lightning') || skill.id.includes('frenzied_whirlwind') ? 50 : 10;
      const hitProb = computeHitChance(
        bracket,
        stats,
        archetype,
        out.isElemental,
        accuracyBonus,
        targetDciDeltaPct
      );
      const critProb = computeCritChance(bracket, stats, buffCritPct);
      const isExecSkill = (skill.scalingFormula.executeThresholdHpPct ?? 0) > 0;
      let castTotalDmg = 0;
      let castAnyCrit = false;

      const targetIndicesToHit = aliveIndices.slice(0, out.targetsHit);
      for (let targetOffset = 0; targetOffset < targetIndicesToHit.length; targetOffset++) {
        const tIdx = targetIndicesToHit[targetOffset];
        const targetSplashScale = targetOffset === 0 ? 1.0 : out.splashRatio;
        for (let h = 0; h < out.hits; h++) {
          const [didHit, nextHitAcc] = resolveDeterministicRoll(state.hitAcc, hitProb);
          state.hitAcc = nextHitAcc;
          if (!didHit) {
            if (mode === 'mode_b' && classDef.id === 'samurai') {
              state.perfectionStreakBonusPct = Math.max(
                0,
                state.perfectionStreakBonusPct - 25
              );
            }
            continue;
          }
          ctx.totalHits++;
          const [didCrit, nextCritAcc] = resolveDeterministicRoll(
            state.critAcc,
            critProb
          );
          state.critAcc = nextCritAcc;
          const critMult = didCrit ? 1.5 : 1.0;
          if (didCrit) {
            ctx.totalCrits++;
            castAnyCrit = true;
          }

          if (mode === 'mode_b' && classDef.id === 'samurai' && bracket.skillLevel >= 50) {
            state.perfectionStreakBonusPct = Math.min(
              12,
              state.perfectionStreakBonusPct + Math.max(2, Math.floor(bracket.skillLevel / 25))
            );
          }

          const mitigated = applyTargetMitigation(
            out.rawDamagePerHit * targetSplashScale * critMult,
            archetype,
            out.isElemental,
            out.armorIgnorePct,
            targetDefenseDeltaPct
          );
          castTotalDmg += dealKernelDamageToTarget(
            ctx,
            tIdx,
            mitigated,
            isExecSkill ? 'execute' : 'special'
          );
        }
      }

      if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs) {
        timelineEvents.push({
          timeMs: state.elapsedMs,
          kind: 'cast',
          label: skill.name,
          damage: round2(castTotalDmg),
          isCrit: castAnyCrit,
        });
      }

      if (
        skill.statusEffect &&
        !(
          mode === 'mode_b' &&
          (skill.id.includes('death') || skill.id.includes('twin_shadow'))
        )
      ) {
        if (skill.statusEffect.effectType === 'self_buff') {
          upsertStatusInstance(state.selfBuffs, skill.id, skill.statusEffect, 0, false);
        } else {
          const dotPerTick =
            skill.statusEffect.effectType === 'dot' ? out.rawDamagePerHit * 0.25 : 0;
          upsertStatusInstance(
            state.targetDebuffs,
            skill.id,
            skill.statusEffect,
            dotPerTick,
            out.isElemental
          );
        }
      }

      if (mode === 'mode_b' && skill.id.includes('counter')) {
        state.counterStanceRemainingMs = 7000;
      }

      if (
        mode === 'mode_b' &&
        (skill.id.includes('death') || skill.id.includes('twin_shadow'))
      ) {
        state.deathStrikeSwingsRemaining = 3;
        state.deathStrikePendingDamage = out.rawDamagePerHit * 0.45;
      }
    }

    break;
  }

  if (!castSkillThisTick && anySkillOffCooldownButOom) {
    ctx.oomTicks++;
  }

  // 3. Passive Weapon Auto-Attack Loop (Sg)
  if (state.swingCooldownMs <= 0) {
    const currentAlive = state.targetHpPools
      .map((hp, idx) => (hp > 0 ? idx : -1))
      .filter((idx) => idx >= 0);

    if (currentAlive.length > 0) {
      const swingTargetIdx = currentAlive[0];
      state.swingCooldownMs = computeSwingIntervalMs(
        bracket,
        state.stamina,
        buffAttackSpeedPct,
        stats.baseWeaponSpeedMs
      );
      ctx.totalSwings++;

      const hitProb = computeHitChance(
        bracket,
        stats,
        archetype,
        false,
        0,
        targetDciDeltaPct
      );
      const [didHit, nextHitAcc] = resolveDeterministicRoll(state.hitAcc, hitProb);
      state.hitAcc = nextHitAcc;

      if (didHit) {
        ctx.totalHits++;
        const critProb = computeCritChance(bracket, stats, buffCritPct);
        const [didCrit, nextCritAcc] = resolveDeterministicRoll(
          state.critAcc,
          critProb
        );
        state.critAcc = nextCritAcc;
        if (didCrit) {
          ctx.totalCrits++;
        }

        if (mode === 'mode_b' && classDef.id === 'samurai' && bracket.skillLevel >= 50) {
          state.perfectionStreakBonusPct = Math.min(
            12,
            state.perfectionStreakBonusPct + Math.max(2, Math.floor(bracket.skillLevel / 25))
          );
        }

        const rawSwing =
          computeAutoAttackRawDamage(
            bracket,
            stats,
            buffDamagePct,
            totalPerfectionBonus
          ) * (didCrit ? 1.5 : 1.0);
        const mitigatedSwing = applyTargetMitigation(
          rawSwing,
          archetype,
          false,
          0,
          targetDefenseDeltaPct
        );
        const effSwing = dealKernelDamageToTarget(ctx, swingTargetIdx, mitigatedSwing, 'auto');
        if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs && effSwing > 0) {
          timelineEvents.push({
            timeMs: state.elapsedMs,
            kind: 'swing',
            label: 'Auto-Attack',
            damage: round2(effSwing),
            isCrit: didCrit,
          });
        }

        // Mode B: Animal Form (Kitsune & Wolf Aspect) 3rd-swing Spirit Claw slash
        if (
          mode === 'mode_b' &&
          classDef.id === 'ninja' &&
          ctx.totalHits % 3 === 0 &&
          state.selfBuffs.some((b) => b.id === 'ninja_animal_aspect')
        ) {
          const spiritRaw =
            computeAutoAttackRawDamage(bracket, stats, buffDamagePct, 0) * 0.12;
          const spiritMitigated = applyTargetMitigation(
            spiritRaw,
            archetype,
            false,
            25,
            targetDefenseDeltaPct
          );
          const effSpirit = dealKernelDamageToTarget(ctx, swingTargetIdx, spiritMitigated, 'proc');
          if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs && effSpirit > 0) {
            timelineEvents.push({
              timeMs: state.elapsedMs,
              kind: 'proc',
              label: 'Kitsune & Wolf Spirit Claw',
              damage: round2(effSpirit),
              isCrit: false,
            });
          }
        }

        // Mode B: DeathStrike delayed detonation counter
        if (mode === 'mode_b' && state.deathStrikeSwingsRemaining > 0) {
          state.deathStrikeSwingsRemaining--;
          if (state.deathStrikeSwingsRemaining === 0 && state.deathStrikePendingDamage > 0) {
            const detDmg = applyTargetMitigation(
              state.deathStrikePendingDamage,
              archetype,
              false,
              50,
              targetDefenseDeltaPct
            );
            const effDet = dealKernelDamageToTarget(ctx, swingTargetIdx, detDmg, 'execute');
            if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs && effDet > 0) {
              timelineEvents.push({
                timeMs: state.elapsedMs,
                kind: 'detonate',
                label: 'Death Strike 5th-Step Detonation',
                damage: round2(effDet),
                isCrit: false,
              });
            }
            state.deathStrikePendingDamage = 0;
          }
        }
      } else if (mode === 'mode_b' && classDef.id === 'samurai') {
        state.perfectionStreakBonusPct = Math.max(
          0,
          state.perfectionStreakBonusPct - 25
        );
      }
    }
  }

  // 4. Enemy incoming attack resolution & EHP/sustain accounting
  ctx.enemyAttackTimerMs -= TICK_MS;
  if (ctx.enemyAttackTimerMs <= 0) {
    ctx.enemyAttackTimerMs += archetype.enemyAttackIntervalMs;

    const enemyStunnedOrParalyzed = state.targetDebuffs.some((d) =>
      d.effect.modifiers.some(
        (m) => m.stat === 'stun' || m.stat === 'paralyze' || m.stat === 'disarm'
      )
    );

    const livingEnemyCount = Math.max(
      1,
      state.targetHpPools.filter((hp) => hp > 0).length
    );
    const rawEnemyHit =
      archetype.enemyPreMitigationDpsPerTarget *
      ctx.enemyScale *
      (archetype.enemyAttackIntervalMs / 1000) *
      livingEnemyCount *
      (enemyStunnedOrParalyzed ? 0.65 : 1.0);

    // Check Mirror Image clone interception (Mode B or clone_stacks buff)
    let interceptedByClone = false;
    let effectiveEnemyHit = rawEnemyHit;
    if (state.cloneStacks > 0 && state.cloneIcdMs <= 0) {
      const cloneInterceptChance =
        mode === 'mode_b'
          ? clamp(bracket.skillLevel / 300, 0.1, 0.25)
          : clamp(bracket.skillLevel / 150, 0.25, 0.75);
      const [didIntercept, nextProcAcc] = resolveDeterministicRoll(
        state.procAcc,
        cloneInterceptChance
      );
      state.procAcc = nextProcAcc;
      if (didIntercept) {
        state.cloneStacks--;
        state.cloneIcdMs = mode === 'mode_b' ? 10000 : 1500;
        ctx.cloneInterceptions++;
        if (mode === 'mode_b') {
          const absorbed = effectiveEnemyHit * 0.35;
          ctx.totalIncomingDamageMitigated += absorbed;
          effectiveEnemyHit -= absorbed;
        } else {
          interceptedByClone = true;
          ctx.totalIncomingDamageMitigated += effectiveEnemyHit;
        }
      }
    }

    if (!interceptedByClone) {
      const buffEvasionPct = sumModifierStat(
        state.selfBuffs,
        passiveEffects,
        'evasion_pct'
      );
      const avoidChance = computeParryAndAvoidanceChance(
        classDef,
        bracket,
        stats,
        buffEvasionPct
      );

      const [didParry, nextParryAcc] = resolveDeterministicRoll(
        state.parryAcc,
        avoidChance
      );
      state.parryAcc = nextParryAcc;

      if (didParry) {
        ctx.parryCount++;
        ctx.totalIncomingDamageMitigated += effectiveEnemyHit;

        // Mode B: Confidence (Inner Calm) on-parry vitality & stamina restoration
        if (
          mode === 'mode_b' &&
          state.selfBuffs.some((b) => b.id === 'samurai_confidence_calm')
        ) {
          state.hp = Math.min(state.maxHP, state.hp + 2);
          ctx.totalHpHealedOrRegenerated += 2;
          state.stamina = Math.min(state.maxStamina, state.stamina + 2);
          ctx.totalStaminaRegenerated += 2;
        }

        // Mode B: CounterAttack or Evasion Iaido Riposte reactive swing on parry
        const hasEvasionStance = state.selfBuffs.some(
          (b) => b.id === 'samurai_evasion_stance'
        );
        if (
          mode === 'mode_b' &&
          (state.counterStanceRemainingMs > 0 || hasEvasionStance) &&
          state.counterIcdMs <= 0
        ) {
          state.counterIcdMs = 6000;
          const counterTargetIdx = state.targetHpPools.findIndex((hp) => hp > 0);
          if (counterTargetIdx >= 0) {
            const hasCounterStanceBuff = state.selfBuffs.some(
              (b) => b.id === 'samurai_counter_stance'
            );
            const counterMult =
              state.counterStanceRemainingMs > 0
                ? hasCounterStanceBuff
                  ? 0.35
                  : 0.75
                : 0.12;
            const rawCounter =
              computeAutoAttackRawDamage(
                bracket,
                stats,
                buffDamagePct,
                totalPerfectionBonus
              ) * counterMult;
            const mitigatedCounter = applyTargetMitigation(
              rawCounter,
              archetype,
              false,
              0,
              targetDefenseDeltaPct
            );
            ctx.totalSwings++;
            ctx.totalHits++;
            const effCounter = dealKernelDamageToTarget(
              ctx,
              counterTargetIdx,
              mitigatedCounter,
              'proc'
            );
            if (timelineHorizonMs > 0 && state.elapsedMs <= timelineHorizonMs && effCounter > 0) {
              timelineEvents.push({
                timeMs: state.elapsedMs,
                kind: 'proc',
                label:
                  state.counterStanceRemainingMs > 0
                    ? 'Counter Attack Riposte'
                    : 'Iaido Flash Riposte',
                damage: round2(effCounter),
                isCrit: false,
              });
            }
          }
        }
      } else {
        // Mitigate incoming damage by armor physical/elemental resistance + defensive stances + Hunting Bot posture incoming mult
        const buffDefensePct = sumModifierStat(
          state.selfBuffs,
          passiveEffects,
          'defense_pct'
        );
        const buffDamageTakenPct = sumModifierStat(
          state.selfBuffs,
          passiveEffects,
          'damage_taken_pct'
        );
        const enemyDamagePenaltyPct = sumModifierStat(
          state.targetDebuffs,
          [],
          'damage_dealt_pct'
        );
        const postureProfile = resolvePostureProfile(stats.posture);

        const effectiveArmorResist = clamp(
          bracket.armorPhysResistPct * 0.7 +
            bracket.armorElemResistPct * 0.3 +
            buffDefensePct,
          0,
          75
        );
        const stanceMult = clamp(
          (1 + buffDamageTakenPct / 100) *
            (1 + enemyDamagePenaltyPct / 100) *
            postureProfile.incomingDamageMultiplier,
          0.35,
          1.6
        );

        const damageTaken = Math.max(
          1,
          effectiveEnemyHit * (1 - effectiveArmorResist / 100) * stanceMult
        );
        const mitigatedAmount = Math.max(0, effectiveEnemyHit - damageTaken);
        ctx.totalIncomingDamageMitigated += mitigatedAmount;

        state.hp = Math.max(1, state.hp - damageTaken);

        // ReflectPhysical item affix reflects a percentage of physical damage taken back onto the primary target
        const reflectPct = clamp(bracket.reflectPhysicalPct ?? 0, 0, 50);
        if (reflectPct > 0) {
          const reflectTargetIdx = state.targetHpPools.findIndex((hp) => hp > 0);
          if (reflectTargetIdx >= 0) {
            const reflectedDmg = Math.max(1, damageTaken * (reflectPct / 100));
            dealKernelDamageToTarget(ctx, reflectTargetIdx, reflectedDmg, 'proc');
          }
        }
      }
    }
  }
}

export interface DetailedScenarioOutput {
  telemetry: SimTelemetry;
  breakdown: DamageChannelBreakdown;
  timelineEvents: RotationTimelineEvent[];
}

/**
 * Runs a deterministic 100ms-tick combat simulation for a single (classDef, bracketId, archetypeId, mode) scenario,
 * powered by the unified single-wave & multi-wave tick kernel (`SIM-08`).
 */
export function simulateScenarioDetailed(
  classDef: ClassDefinition,
  bracketId: BracketId,
  archetypeId: EnemyArchetypeId,
  mode: SimImplementationMode = 'mode_a',
  budgetOverride?: BracketBudget,
  timelineHorizonMs = 0
): DetailedScenarioOutput {
  const bracket = budgetOverride ?? BRACKET_BUDGETS[bracketId];
  const archetype = ENEMY_ARCHETYPES[archetypeId];
  const enemyScale = BRACKET_ENEMY_SCALE[bracketId];
  const singleTargetMaxHp = Math.max(
    25,
    Math.round(BASE_ENEMY_HP * enemyScale * archetype.hpMultiplier)
  );

  const spawnTargetWave = (): number[] =>
    Array.from({ length: archetype.targetCount }, () => singleTargetMaxHp);

  let wavesCompleted = 0;

  const ctx = createUnifiedKernelContext(
    classDef,
    bracket,
    archetype,
    mode,
    spawnTargetWave(),
    singleTargetMaxHp,
    enemyScale,
    timelineHorizonMs,
    (targetIdx) => {
      if (archetypeId !== 'fast_trash') {
        wavesCompleted++;
        ctx.state.targetHpPools[targetIdx] = ctx.state.targetMaxHp;
      }
    }
  );

  const maxTicks = Math.max(100, Math.floor(archetype.fightHorizonMs / TICK_MS));

  for (let tick = 1; tick <= maxTicks; tick++) {
    stepKernelTimersAndSustain(ctx, tick);

    if (ctx.state.targetHpPools.every((hp) => hp <= 0)) {
      wavesCompleted++;
      if (archetypeId === 'fast_trash' && wavesCompleted >= archetype.waveCount) {
        break;
      }
      ctx.state.targetHpPools = spawnTargetWave();
      ctx.state.targetDebuffs = [];
    }

    stepKernelCombatActions(ctx);

    if (ctx.state.targetHpPools.every((hp) => hp <= 0)) {
      wavesCompleted++;
      if (archetypeId === 'fast_trash' && wavesCompleted >= archetype.waveCount) {
        break;
      }
      ctx.state.targetHpPools = spawnTargetWave();
      ctx.state.targetDebuffs = [];
    }
  }

  const { state, stats } = ctx;
  const elapsedSec = Math.max(0.1, state.elapsedMs / 1000);
  const sustainedDps = round2(ctx.totalEffectiveDamage / elapsedSec);
  const rawDps = round2(ctx.totalRawDamage / elapsedSec);

  const effectiveWavesKilled =
    archetypeId === 'fast_trash'
      ? Math.max(1, wavesCompleted || ctx.totalEffectiveDamage / singleTargetMaxHp)
      : Math.max(0.01, ctx.totalEffectiveDamage / singleTargetMaxHp);
  const trashTtkSec = round2(elapsedSec / effectiveWavesKilled);

  const overkillWastePct =
    ctx.totalRawDamage > 0
      ? round2(
          Math.max(
            0,
            ((ctx.totalRawDamage - ctx.totalEffectiveDamage) / ctx.totalRawDamage) * 100
          )
        )
      : 0;

  const netManaDeltaPerMin =
    classDef.resourceProfile.primaryResource === 'zero-mana-physical'
      ? 0
      : round2(((ctx.totalManaRegenerated - ctx.totalManaSpent) / elapsedSec) * 60);

  const netStaminaDeltaPerMin = round2(
    ((ctx.totalStaminaRegenerated - ctx.totalStaminaSpent) / elapsedSec) * 60
  );

  const avgResistFraction = clamp(
    (bracket.armorPhysResistPct * 0.65 +
      bracket.armorElemResistPct * 0.35 +
      Math.min(45, bracket.defenseChanceIncreasePct) * 0.4) /
      100,
    0.1,
    0.8
  );
  const ehpMultiplier = 1 / (1 - avgResistFraction);
  const ehpPerSec = round2(
    (stats.maxHP * ehpMultiplier) / 60 +
      (ctx.totalHpHealedOrRegenerated * ehpMultiplier +
        ctx.totalIncomingDamageMitigated) /
        elapsedSec
  );

  const telemetry: SimTelemetry = {
    classId: classDef.id,
    bracketId,
    archetypeId,
    mode,
    sustainedDps,
    rawDps,
    trashTtkSec,
    overkillWastePct,
    netManaDeltaPerMin,
    netStaminaDeltaPerMin,
    ehpPerSec,
    totalCasts: ctx.totalCasts,
    totalSwings: ctx.totalSwings,
    totalHits: ctx.totalHits,
    totalCrits: ctx.totalCrits,
    parryCount: ctx.parryCount,
    cloneInterceptions: ctx.cloneInterceptions,
    oomTicks:
      classDef.resourceProfile.primaryResource === 'zero-mana-physical'
        ? 0
        : ctx.oomTicks,
  };

  const breakdown: DamageChannelBreakdown = {
    classId: classDef.id,
    bracketId,
    archetypeId,
    mode,
    autoAttackDps: round2(ctx.autoAttackEffectiveDmg / elapsedSec),
    specialMoveDps: round2(ctx.specialMoveEffectiveDmg / elapsedSec),
    executeDps: round2(ctx.executeEffectiveDmg / elapsedSec),
    dotDps: round2(ctx.dotEffectiveDmg / elapsedSec),
    procCounterDps: round2(ctx.procCounterEffectiveDmg / elapsedSec),
    totalDps: sustainedDps,
  };

  return { telemetry, breakdown, timelineEvents: ctx.timelineEvents };
}

/**
 * Runs a deterministic 100ms-tick combat simulation for a single (classDef, bracketId, archetypeId, mode) scenario.
 */
export function simulateScenario(
  classDef: ClassDefinition,
  bracketId: BracketId,
  archetypeId: EnemyArchetypeId,
  mode: SimImplementationMode = 'mode_a'
): SimTelemetry {
  return simulateScenarioDetailed(classDef, bracketId, archetypeId, mode).telemetry;
}

/**
 * Runs all (classes × 4 brackets × 4 archetypes) scenarios and builds the SimBaselineArtifact.
 */
export function runClassBaselineSuite(
  classes: ClassDefinition[],
  mode: SimImplementationMode = 'mode_a'
): SimBaselineArtifact {
  const scenarios: SimTelemetry[] = [];
  const summaryByClassBracket: ClassBracketSummary[] = [];

  for (const classDef of classes) {
    for (const bracketId of BRACKET_IDS) {
      const bracketResults = new Map<EnemyArchetypeId, SimTelemetry>();
      for (const archetypeId of ARCHETYPE_IDS) {
        const result = simulateScenario(classDef, bracketId, archetypeId, mode);
        scenarios.push(result);
        bracketResults.set(archetypeId, result);
      }

      const fastTrash = bracketResults.get('fast_trash')!;
      const lowDefBoss = bracketResults.get('low_def_boss')!;
      const highDefBoss = bracketResults.get('high_def_boss')!;
      const multiTarget = bracketResults.get('multi_target_pack')!;

      summaryByClassBracket.push({
        classId: classDef.id,
        bracketId,
        sustainedBossDps: lowDefBoss.sustainedDps,
        highDefBossDps: highDefBoss.sustainedDps,
        multiTargetDps: multiTarget.sustainedDps,
        trashTtkSec: fastTrash.trashTtkSec,
        overkillWastePct: fastTrash.overkillWastePct,
        netManaDeltaPerMin: lowDefBoss.netManaDeltaPerMin,
        netStaminaDeltaPerMin: lowDefBoss.netStaminaDeltaPerMin,
        ehpPerSec: highDefBoss.ehpPerSec,
      });
    }
  }

  return {
    version: '0.99.0',
    tickMs: 100,
    classes: classes.map((c) => c.id),
    brackets: [...BRACKET_IDS],
    archetypes: [...ARCHETYPE_IDS],
    scenarios,
    summaryByClassBracket,
  };
}

/**
 * Simulates a 10-wave consecutive dungeon pull at L60 with a 1,500ms inter-wave travel/spawn gap,
 * using the unified combat tick kernel (`SIM-08`) so single-wave and multi-wave simulations share 100% of their math.
 */
export function simulateMultiWavePull(
  classDef: ClassDefinition,
  bracketId: BracketId = 'L60',
  waveCount = 10,
  interWaveDelayMs = 1500
): ClassMultiWaveRun {
  const bracket = BRACKET_BUDGETS[bracketId];
  const archetype: EnemyArchetype = {
    archetypeId: 'multi_target_pack',
    name: 'Elite Dungeon Pull (2 targets)',
    targetCount: 3,
    waveCount,
    fightHorizonMs: 180000,
    hpMultiplier: 0.85,
    physResistPct: 30,
    elemResistPct: 25,
    defenseSkill: 45,
    defenderDciPct: 10,
    enemyPreMitigationDpsPerTarget: 2.2,
    enemyAttackIntervalMs: 2000,
  };

  const enemyScale = BRACKET_ENEMY_SCALE[bracketId];
  const singleTargetMaxHp = Math.max(
    40,
    Math.round(BASE_ENEMY_HP * enemyScale * archetype.hpMultiplier)
  );
  const spawnWave = (): number[] => [singleTargetMaxHp, singleTargetMaxHp];

  const ctx = createUnifiedKernelContext(
    classDef,
    bracket,
    archetype,
    'mode_b',
    spawnWave(),
    singleTargetMaxHp,
    enemyScale
  );

  let currentWaveIdx = 1;
  let waveStartElapsedMs = 0;
  let waveStartEffectiveDamage = 0;
  let waveStartParries = 0;
  let interWaveRemainingMs = 0;
  let minHpPct = 100;
  let minManaPct = 100;
  const waves: WavePullTelemetryPoint[] = [];

  const maxTicks = 1800; // up to 180s
  for (let tick = 1; tick <= maxTicks; tick++) {
    stepKernelTimersAndSustain(ctx, tick);

    const hpPct = (ctx.state.hp / ctx.state.maxHP) * 100;
    const manaPct =
      ctx.state.maxMana > 0 ? (ctx.state.mana / ctx.state.maxMana) * 100 : 100;
    minHpPct = Math.min(minHpPct, hpPct);
    minManaPct = Math.min(minManaPct, manaPct);

    // Handle inter-wave travel/spawn transition
    if (interWaveRemainingMs > 0) {
      interWaveRemainingMs -= TICK_MS;
      if (interWaveRemainingMs <= 0) {
        ctx.state.targetHpPools = spawnWave();
        ctx.state.targetDebuffs = [];
        waveStartElapsedMs = ctx.state.elapsedMs;
        waveStartEffectiveDamage = ctx.totalEffectiveDamage;
        waveStartParries = ctx.parryCount;
      }
      continue;
    }

    stepKernelCombatActions(ctx);

    // Check if wave cleared
    if (ctx.state.targetHpPools.every((hp) => hp <= 0)) {
      const waveSec = Math.max(0.5, (ctx.state.elapsedMs - waveStartElapsedMs) / 1000);
      const effectiveWaveWindowSec =
        waveSec + (currentWaveIdx > 1 ? interWaveDelayMs / 1000 : 0);
      const waveDamage = ctx.totalEffectiveDamage - waveStartEffectiveDamage;
      const waveParries = ctx.parryCount - waveStartParries;

      waves.push({
        waveIndex: currentWaveIdx,
        waveClearTimeSec: round2(waveSec),
        cumulativeTimeSec: round2(ctx.state.elapsedMs / 1000),
        waveDps: round2(waveDamage / effectiveWaveWindowSec),
        endingHpPct: round2((ctx.state.hp / ctx.state.maxHP) * 100),
        endingManaPct:
          ctx.state.maxMana > 0
            ? round2((ctx.state.mana / ctx.state.maxMana) * 100)
            : 100,
        endingStaminaPct: round2((ctx.state.stamina / ctx.state.maxStamina) * 100),
        parriesInWave: waveParries,
        clonesOrStreakEnd:
          classDef.id === 'samurai'
            ? ctx.state.perfectionStreakBonusPct
            : ctx.state.cloneStacks,
      });

      if (currentWaveIdx >= waveCount) {
        break;
      }
      currentWaveIdx++;
      interWaveRemainingMs = interWaveDelayMs;
    }
  }

  const totalSec =
    waves.length > 0
      ? waves[waves.length - 1].cumulativeTimeSec
      : round2(ctx.state.elapsedMs / 1000);
  const avgDps =
    waves.length > 0
      ? round2(waves.reduce((acc, w) => acc + w.waveDps, 0) / waves.length)
      : 0;

  return {
    classId: classDef.id,
    totalClearTimeSec: totalSec,
    averageWaveDps: avgDps,
    minHpPct: round2(minHpPct),
    minManaPct: round2(minManaPct),
    totalParries: ctx.parryCount,
    totalCloneInterceptions: ctx.cloneInterceptions,
    waves,
  };
}

/**
 * Generates the comprehensive Gear, Affix, Damage-Breakdown, Rotation Timeline & Multi-Wave artifact (`SIM-04` / `SIM-08`).
 */
export function runGearAndWaveSuite(classes: ClassDefinition[]): GearAndWavesArtifact {
  const damageBreakdowns: DamageChannelBreakdown[] = [];
  const materialTierCurves: MaterialTierPoint[] = [];
  const affixLoadoutCurves: AffixLoadoutPoint[] = [];
  const weaponArchetypeCurves: WeaponArchetypePoint[] = [];
  const multiWaveRuns: ClassMultiWaveRun[] = [];
  const rotationTimelines: ClassRotationTimeline[] = [];

  for (const classDef of classes) {
    // 1. Damage channel breakdowns across all brackets & archetypes (mode_b) + 20s L60 rotation timeline
    for (const bracketId of BRACKET_IDS) {
      for (const archetypeId of ARCHETYPE_IDS) {
        const captureTimeline = bracketId === 'L60' && archetypeId === 'low_def_boss' ? 20000 : 0;
        const detailed = simulateScenarioDetailed(
          classDef,
          bracketId,
          archetypeId,
          'mode_b',
          undefined,
          captureTimeline
        );
        damageBreakdowns.push(detailed.breakdown);
        if (captureTimeline > 0) {
          rotationTimelines.push({
            classId: classDef.id,
            bracketId: 'L60',
            horizonMs: captureTimeline,
            events: detailed.timelineEvents,
          });
        }
      }
    }

    // 2. Material Tier curves (Iron -> Valorite at L60)
    for (const tierSpec of MATERIAL_TIER_SPECS) {
      const budget = buildMaterialTierBudget(tierSpec);
      const lowDef = simulateScenarioDetailed(classDef, 'L60', 'low_def_boss', 'mode_b', budget).telemetry;
      const highDef = simulateScenarioDetailed(classDef, 'L60', 'high_def_boss', 'mode_b', budget).telemetry;
      const multi = simulateScenarioDetailed(classDef, 'L60', 'multi_target_pack', 'mode_b', budget).telemetry;
      materialTierCurves.push({
        classId: classDef.id,
        tierId: tierSpec.tierId,
        levelReq: tierSpec.levelReq,
        statBonusBudget: tierSpec.statBonusBudget,
        hue: tierSpec.hue,
        lowDefBossDps: lowDef.sustainedDps,
        highDefBossDps: highDef.sustainedDps,
        multiTargetDps: multi.sustainedDps,
        ehpPerSec: highDef.ehpPerSec,
      });
    }

    // 3. Tokuno Affix Loadout curves at L60
    for (const loadoutId of AFFIX_LOADOUT_IDS) {
      const { name, budget } = buildAffixLoadoutBudget(loadoutId);
      const lowDef = simulateScenarioDetailed(classDef, 'L60', 'low_def_boss', 'mode_b', budget).telemetry;
      const highDef = simulateScenarioDetailed(classDef, 'L60', 'high_def_boss', 'mode_b', budget).telemetry;
      const multi = simulateScenarioDetailed(classDef, 'L60', 'multi_target_pack', 'mode_b', budget).telemetry;
      affixLoadoutCurves.push({
        classId: classDef.id,
        loadoutId,
        loadoutName: name,
        lowDefBossDps: lowDef.sustainedDps,
        highDefBossDps: highDef.sustainedDps,
        multiTargetDps: multi.sustainedDps,
        ehpPerSec: highDef.ehpPerSec,
        netManaDeltaPerMin: lowDef.netManaDeltaPerMin,
        netStaminaDeltaPerMin: lowDef.netStaminaDeltaPerMin,
      });
    }

    // 4. Weapon Speed & Handedness Archetype curves at L60 (`fast_1h` 2.25s, `balanced_1h` 2.50s, `heavy_2h` 3.25s)
    for (const weaponArchetypeId of WEAPON_ARCHETYPE_IDS) {
      const { weaponName, spec, budget } = buildWeaponArchetypeBudget(classDef.id, weaponArchetypeId);
      const stats = resolveClassStatsForBracket(classDef, budget);
      const effectiveSwingIntervalMs = computeSwingIntervalMs(
        budget,
        stats.maxStamina,
        0,
        stats.baseWeaponSpeedMs
      );
      const lowDefDetailed = simulateScenarioDetailed(classDef, 'L60', 'low_def_boss', 'mode_b', budget);
      const highDefDetailed = simulateScenarioDetailed(classDef, 'L60', 'high_def_boss', 'mode_b', budget);
      const multiDetailed = simulateScenarioDetailed(classDef, 'L60', 'multi_target_pack', 'mode_b', budget);

      weaponArchetypeCurves.push({
        classId: classDef.id,
        weaponArchetypeId,
        weaponName,
        baseWeaponSpeedMs: spec.baseWeaponSpeedMs,
        effectiveSwingIntervalMs,
        weaponDamageMultiplier: spec.weaponDamageMultiplier,
        isTwoHanded: Boolean(stats.isTwoHanded),
        hasShield: Boolean(stats.hasShield),
        lowDefBossDps: lowDefDetailed.telemetry.sustainedDps,
        highDefBossDps: highDefDetailed.telemetry.sustainedDps,
        multiTargetDps: multiDetailed.telemetry.sustainedDps,
        autoAttackDps: lowDefDetailed.breakdown.autoAttackDps,
        procCounterDps: highDefDetailed.breakdown.procCounterDps,
        executeDps: lowDefDetailed.breakdown.executeDps,
        totalSwings: lowDefDetailed.telemetry.totalSwings,
        parryCount: highDefDetailed.telemetry.parryCount,
        ehpPerSec: highDefDetailed.telemetry.ehpPerSec,
      });
    }

    // 5. 10-Wave Consecutive Dungeon Pull at L60
    multiWaveRuns.push(simulateMultiWavePull(classDef, 'L60', 10, 1500));
  }

  return {
    version: '1.1.0',
    tickMs: 100,
    classes: classes.map((c) => c.id),
    damageBreakdowns,
    materialTierCurves,
    affixLoadoutCurves,
    weaponArchetypeCurves,
    multiWaveRuns,
    rotationTimelines,
  };
}
