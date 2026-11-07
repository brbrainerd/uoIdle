import {
  BASE_ENEMY_HP,
  BRACKET_BUDGETS,
  BRACKET_ENEMY_SCALE,
  ENEMY_ARCHETYPES,
  resolveClassStatsForBracket,
} from './archetypes.js';
import {
  ARCHETYPE_IDS,
  BRACKET_IDS,
  type ActiveStatusInstance,
  type BracketBudget,
  type BracketId,
  type ClassBracketSummary,
  type ClassDefinition,
  type CombatState,
  type EffectDefinition,
  type EnemyArchetype,
  type EnemyArchetypeId,
  type ResolvedClassStats,
  type SimBaselineArtifact,
  type SimImplementationMode,
  type SimTelemetry,
  type SkillDefinition,
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
  return (
    id.includes('whirlwind') ||
    id.includes('chain_lightning') ||
    id.includes('meteor') ||
    id.includes('multishot') ||
    id.includes('bolt_volley')
  );
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
 * Evaluates runtime mana and stamina cost, enforcing Warrior's 0-mana override (tI, [[resources]] C15).
 */
export function resolveSkillResourceCost(
  classDef: ClassDefinition,
  skill: SkillDefinition
): { manaCost: number; staminaCost: number } {
  if (classDef.resourceProfile.primaryResource === 'zero-mana-physical') {
    const convertedStam =
      skill.staminaCost > 0 ? skill.staminaCost : Math.max(0, skill.manaCost);
    return { manaCost: 0, staminaCost: convertedStam };
  }
  return {
    manaCost: Math.max(0, skill.manaCost),
    staminaCost: Math.max(0, skill.staminaCost),
  };
}

/**
 * Weapon swing interval Sg ([[tick-and-cooldowns]], [[damage-and-defense]]).
 */
export function computeSwingIntervalMs(
  bracket: BracketBudget,
  currentStamina: number,
  buffAttackSpeedPct: number
): number {
  const effectiveSsi = bracket.swingSpeedIncreasePct + buffAttackSpeedPct;
  const speedDivisor = 1 + currentStamina / 200 + effectiveSsi / 100;
  return Math.max(1000, Math.floor(bracket.baseWeaponSpeedMs / Math.max(0.25, speedDivisor)));
}

/**
 * Hit chance vq/Gs ([[damage-and-defense]]).
 */
export function computeHitChance(
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  archetype: EnemyArchetype,
  isSpell: boolean,
  accuracyBonusPct: number
): number {
  if (isSpell) {
    return 0.95;
  }
  const postureHci = stats.posture === 'Precision' ? 10 : 0;
  const effectiveHci = Math.min(45, bracket.hitChanceIncreasePct + postureHci) + accuracyBonusPct;
  const effectiveDci = 0;
  const rawHit =
    ((bracket.skillLevel + 20) * (100 + effectiveHci)) /
    ((archetype.defenseSkill + 20) * 2 * (100 + effectiveDci));
  return clamp(rawHit, 0.05, 0.95);
}

/**
 * Critical hit chance yq ([[damage-and-defense]]).
 */
export function computeCritChance(
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  buffCritPct: number
): number {
  const postureCrit = stats.posture === 'Precision' ? 5 : 0;
  const rawCrit = stats.dex / 500 + (bracket.critChancePct + postureCrit + buffCritPct) / 100;
  return clamp(rawCrit, 0, 0.5);
}

/**
 * Base physical auto-attack damage fj/Zo ([[damage-and-defense]]).
 */
export function computeAutoAttackRawDamage(
  bracket: BracketBudget,
  stats: ResolvedClassStats,
  buffDamagePct: number,
  perfectionBonusPct: number
): number {
  const postureDmg = stats.posture === 'Attack' ? 15 : stats.posture === 'Defensive' ? -10 : 0;
  const multiplier =
    1 +
    bracket.skillLevel / 100 +
    bracket.skillLevel / 200 +
    (stats.str * 0.3) / 100 +
    (bracket.damageIncreasePct + postureDmg + buffDamagePct + perfectionBonusPct) / 100;
  return bracket.weaponAvgDmg * multiplier * stats.levelFactor;
}

/**
 * Evaluates active skill raw damage, hit count, AoE target count, and elemental vs physical channel
 * implementing Aq/Mq (spells) and Cq (physical/hybrid abilities) from [[damage-and-defense]].
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
  isElemental: boolean;
  armorIgnorePct: number;
} {
  const id = skill.id.toLowerCase();
  const rank = bracket.abilityRank;
  const tactics = bracket.skillLevel;
  const magery = bracket.skillLevel;
  const evalInt = bracket.skillLevel;
  const postureDmg = stats.posture === 'Attack' ? 15 : stats.posture === 'Defensive' ? -10 : 0;

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
  } else if (id.includes('lightning')) {
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

  const autoRaw = computeAutoAttackRawDamage(
    bracket,
    stats,
    buffDamagePct,
    perfectionBonusPct
  );

  let rawDamagePerHit = autoRaw;

  if (isElemental) {
    // Aq(id, magery, evalInt) * Mq(id) scaled by INT, SDI, and server x80 caster levelFactor
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
    const casterBonus =
      1 +
      evalInt / 100 +
      stats.int / 100 +
      (bracket.spellDamageIncreasePct + postureDmg + buffDamagePct) / 100;
    rawDamagePerHit = avgSpellBase * casterBonus * stats.levelFactor;
  } else {
    // Physical / Bushido / Ninjitsu ability scaling (Cq + weapon multiplier)
    const minMult = skill.scalingFormula.minMultiplier ?? 1.0;
    const maxMult = skill.scalingFormula.maxMultiplier ?? minMult;
    const avgMult = (minMult + maxMult) / 2;

    if (id.includes('execution') || id.includes('deadeye')) {
      const cqBase = Math.floor(tactics * 0.6) + 20 * rank;
      rawDamagePerHit = autoRaw * 1.15 + cqBase * stats.levelFactor;
    } else if (id.includes('shield_bash') || id.includes('earthshaker')) {
      const cqBase = 13 + 5 * rank + Math.floor(tactics * 0.15);
      rawDamagePerHit = autoRaw * 0.85 + cqBase * stats.levelFactor;
    } else if (id.includes('heavy_strike') || id.includes('crushing')) {
      const cqBase = 14 + Math.floor(tactics * 0.25);
      rawDamagePerHit = autoRaw * 1.25 + cqBase * stats.levelFactor;
    } else if (id.includes('multishot') || id.includes('bolt_volley')) {
      const perHitCq = 10 + 5 * rank;
      rawDamagePerHit = autoRaw * 0.55 + perHitCq * stats.levelFactor;
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

/**
 * Runs a deterministic 100ms-tick combat simulation for a single (classDef, bracketId, archetypeId, mode) scenario.
 */
export function simulateScenario(
  classDef: ClassDefinition,
  bracketId: BracketId,
  archetypeId: EnemyArchetypeId,
  mode: SimImplementationMode = 'mode_a'
): SimTelemetry {
  const bracket = BRACKET_BUDGETS[bracketId];
  const archetype = ENEMY_ARCHETYPES[archetypeId];
  const stats = resolveClassStatsForBracket(classDef, bracket);
  const { passives, hotbar } = buildHotbarLoadout(classDef, bracket);

  const passiveEffects: EffectDefinition[] = [];
  for (const p of passives) {
    if (p.statusEffect) {
      passiveEffects.push(p.statusEffect);
    }
  }

  const enemyScale = BRACKET_ENEMY_SCALE[bracketId];
  const singleTargetMaxHp = Math.max(
    25,
    Math.round(BASE_ENEMY_HP * enemyScale * archetype.hpMultiplier)
  );

  const spawnTargetWave = (): number[] =>
    Array.from({ length: archetype.targetCount }, () => singleTargetMaxHp);

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
    targetHpPools: spawnTargetWave(),
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

  const maxTicks = Math.max(100, Math.floor(archetype.fightHorizonMs / TICK_MS));

  let totalEffectiveDamage = 0;
  let totalRawDamage = 0;
  let totalCasts = 0;
  let totalSwings = 0;
  let totalHits = 0;
  let totalCrits = 0;
  let parryCount = 0;
  let cloneInterceptions = 0;
  let oomTicks = 0;
  let wavesCompleted = 0;
  let totalManaSpent = 0;
  let totalManaRegenerated = 0;
  let totalStaminaSpent = 0;
  let totalStaminaRegenerated = 0;
  let totalHpHealedOrRegenerated = 0;
  let totalIncomingDamageMitigated = 0;

  // Passive regeneration rates per second ([[resources]] Eq)
  const hasMeditation =
    classDef.resourceProfile.meditationCap > 0 &&
    classDef.starterSkills.some((s) => s.skillKey === 'meditation');
  const meditationSkill = hasMeditation ? bracket.skillLevel : 0;
  const focusSkill = bracket.skillLevel;

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

  let enemyAttackTimerMs = archetype.enemyAttackIntervalMs;

  const dealDamageToTarget = (targetIdx: number, mitigatedDmg: number): void => {
    const currentHp = state.targetHpPools[targetIdx] ?? 0;
    if (currentHp <= 0) {
      return;
    }
    const clampedDmg = Math.max(1, mitigatedDmg);
    totalRawDamage += clampedDmg;
    const effective = Math.min(currentHp, clampedDmg);
    totalEffectiveDamage += effective;
    const nextHp = currentHp - effective;
    if (nextHp <= 0 && archetypeId !== 'fast_trash') {
      wavesCompleted++;
      state.targetHpPools[targetIdx] = state.targetMaxHp;
    } else {
      state.targetHpPools[targetIdx] = nextHp;
    }
  };

  for (let tick = 1; tick <= maxTicks; tick++) {
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

    // 2. Tick active self buffs and target debuffs/DoTs
    const targetDefenseDeltaPct = sumModifierStat(state.targetDebuffs, [], 'defense_pct');

    for (let i = state.selfBuffs.length - 1; i >= 0; i--) {
      const buff = state.selfBuffs[i];
      buff.remainingMs -= TICK_MS;
      if (buff.effect.effectType === 'heal' && buff.effect.tickIntervalMs > 0) {
        buff.nextTickCountdownMs -= TICK_MS;
        if (buff.nextTickCountdownMs <= 0) {
          buff.nextTickCountdownMs += buff.effect.tickIntervalMs;
          const hotHeal = Math.max(2, Math.floor((15 + (bracket.skillLevel * bracket.skillLevel) / 576) / 4));
          state.hp = Math.min(state.maxHP, state.hp + hotHeal);
          totalHpHealedOrRegenerated += hotHeal;
        }
      }
      if (buff.remainingMs <= 0) {
        state.selfBuffs.splice(i, 1);
      }
    }

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
            dealDamageToTarget(primaryIdx, dotMitigated);
          }
        }
      }
      if (debuff.remainingMs <= 0) {
        state.targetDebuffs.splice(i, 1);
      }
    }

    // 3. Every 1,000ms: apply passive resource regeneration (Eq)
    if (state.elapsedMs % 1000 === 0) {
      state.hp = Math.min(state.maxHP, state.hp + hpRegenPerSec);
      totalHpHealedOrRegenerated += hpRegenPerSec;

      state.stamina = Math.min(state.maxStamina, state.stamina + staminaRegenPerSec);
      totalStaminaRegenerated += staminaRegenPerSec;

      if (state.maxMana > 0) {
        state.mana = Math.min(state.maxMana, state.mana + manaRegenPerSec);
        totalManaRegenerated += manaRegenPerSec;
      }
    }

    // 4. Consumable sustain slots (Heal Potion, Mana Potion, Bandage per [[tick-and-cooldowns]] C6, [[resources]] C10)
    const hpPct = (state.hp / state.maxHP) * 100;
    if (hpPct <= 65 && state.potionCooldownMs <= 0) {
      const potionHeal = state.maxHP * 0.25;
      state.hp = Math.min(state.maxHP, state.hp + potionHeal);
      totalHpHealedOrRegenerated += potionHeal;
      state.potionCooldownMs = 10000;
    } else if (
      hasManaPotionInHotbar &&
      state.maxMana > 0 &&
      (state.mana / state.maxMana) * 100 <= 35 &&
      state.potionCooldownMs <= 0
    ) {
      const manaRestore = state.maxMana * 0.25;
      state.mana = Math.min(state.maxMana, state.mana + manaRestore);
      totalManaRegenerated += manaRestore;
      state.potionCooldownMs = 10000;
    }

    if (hasBandageInHotbar && hpPct <= 80 && state.bandageCooldownMs <= 0) {
      const minBandage = bracket.skillLevel / 8 + bracket.skillLevel / 5 + 4;
      const maxBandage = bracket.skillLevel / 6 + bracket.skillLevel / 2.5 + 4;
      const avgBandage = (minBandage + maxBandage) / 2;
      state.hp = Math.min(state.maxHP, state.hp + avgBandage);
      totalHpHealedOrRegenerated += avgBandage;
      state.bandageCooldownMs = 8000;
    }

    // Refresh living targets if needed before player offensive actions
    let aliveIndices = state.targetHpPools
      .map((hp, idx) => (hp > 0 ? idx : -1))
      .filter((idx) => idx >= 0);

    if (aliveIndices.length === 0) {
      wavesCompleted++;
      if (archetypeId === 'fast_trash' && wavesCompleted >= archetype.waveCount) {
        break;
      }
      state.targetHpPools = spawnTargetWave();
      state.targetDebuffs = [];
      aliveIndices = state.targetHpPools.map((_, idx) => idx);
    }

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
        ? state.perfectionStreakBonusPct + buffPerfectionPct
        : buffPerfectionPct;

    // 5. Evaluate 6-slot active hotbar priority queue ro(e) (at most 1 active skill fires per tick)
    let castSkillThisTick = false;
    let anySkillOffCooldownButOom = false;

    for (const skill of hotbar) {
      if ((state.skillCooldownsMs.get(skill.id) ?? 0) > 0) {
        continue;
      }

      // Check trigger condition predicates (ro(e))
      if (skill.effectType === 'heal' && hpPct > 65) {
        continue;
      }
      const execThreshold = skill.scalingFormula.executeThresholdHpPct ?? 0;
      if (execThreshold > 0 && primaryTargetHpPct > execThreshold) {
        continue;
      }
      if (isStrictMultiTargetOnlySkill(skill) && aliveIndices.length < 2) {
        continue;
      }
      if (
        skill.effectType === 'self_buff' &&
        skill.statusEffect &&
        state.selfBuffs.some((b) => b.id === skill.statusEffect?.id)
      ) {
        continue;
      }
      if (
        skill.effectType === 'debuff' &&
        skill.statusEffect &&
        state.targetDebuffs.some((d) => d.id === skill.statusEffect?.id)
      ) {
        continue;
      }
      if (
        skill.effectType === 'dot' &&
        skill.statusEffect &&
        state.targetDebuffs.some((d) => d.id === skill.statusEffect?.id)
      ) {
        continue;
      }

      const { manaCost, staminaCost } = resolveSkillResourceCost(classDef, skill);
      if (state.mana < manaCost || state.stamina < staminaCost) {
        anySkillOffCooldownButOom = true;
        continue;
      }

      // Deduct resources and set cooldown
      state.mana -= manaCost;
      totalManaSpent += manaCost;
      state.stamina -= staminaCost;
      totalStaminaSpent += staminaCost;
      state.skillCooldownsMs.set(skill.id, resolveEffectiveCooldownMs(skill));
      totalCasts++;
      castSkillThisTick = true;

      // Resolve skill effect
      if (skill.effectType === 'heal') {
        // Server authoritative 15% / 35% MaxHP rule for Magery heals ([[resources]] C11)
        const healFraction = skill.id.includes('greater') ? 0.35 : 0.15;
        const healAmount = state.maxHP * healFraction;
        state.hp = Math.min(state.maxHP, state.hp + healAmount);
        totalHpHealedOrRegenerated += healAmount;
        if (skill.statusEffect) {
          upsertStatusInstance(state.selfBuffs, skill.id, skill.statusEffect, 0, true);
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
        if (mode === 'mode_b' && skill.id.includes('counter')) {
          state.counterStanceRemainingMs = 8000;
        }
        if (mode === 'mode_b' && skill.id.includes('mirror')) {
          state.cloneStacks = Math.max(state.cloneStacks, 2);
        }
      } else if (skill.effectType === 'debuff') {
        if (skill.statusEffect) {
          upsertStatusInstance(state.targetDebuffs, skill.id, skill.statusEffect, 0, false);
        }
        // WeaponAbility debuffs (e.g. warrior_disarm) also land a weapon strike
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
          dealDamageToTarget(primaryTargetIdx, mitigated);
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
      } else {
        // direct_damage
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
        const accuracyBonus = skill.id.includes('lightning') ? 50 : 10;
        const hitProb = computeHitChance(
          bracket,
          stats,
          archetype,
          out.isElemental,
          accuracyBonus
        );
        const critProb = computeCritChance(bracket, stats, buffCritPct);

        const targetIndicesToHit = aliveIndices.slice(0, out.targetsHit);
        for (const tIdx of targetIndicesToHit) {
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
            totalHits++;
            const [didCrit, nextCritAcc] = resolveDeterministicRoll(
              state.critAcc,
              critProb
            );
            state.critAcc = nextCritAcc;
            const critMult = didCrit ? 1.5 : 1.0;
            if (didCrit) {
              totalCrits++;
            }

            if (mode === 'mode_b' && classDef.id === 'samurai' && bracket.skillLevel >= 50) {
              state.perfectionStreakBonusPct = Math.min(
                100,
                state.perfectionStreakBonusPct + Math.floor(bracket.skillLevel / 10)
              );
            }

            const mitigated = applyTargetMitigation(
              out.rawDamagePerHit * critMult,
              archetype,
              out.isElemental,
              out.armorIgnorePct,
              targetDefenseDeltaPct
            );
            dealDamageToTarget(tIdx, mitigated);
          }
        }

        if (skill.statusEffect) {
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

        if (mode === 'mode_b' && skill.id.includes('death')) {
          state.deathStrikeSwingsRemaining = 5;
          state.deathStrikePendingDamage = out.rawDamagePerHit * 1.35;
        }
      }

      break;
    }

    if (!castSkillThisTick && anySkillOffCooldownButOom) {
      oomTicks++;
    }

    // 6. Passive Weapon Auto-Attack Loop (Sg)
    if (state.swingCooldownMs <= 0) {
      const currentAlive = state.targetHpPools
        .map((hp, idx) => (hp > 0 ? idx : -1))
        .filter((idx) => idx >= 0);

      if (currentAlive.length > 0) {
        const swingTargetIdx = currentAlive[0];
        state.swingCooldownMs = computeSwingIntervalMs(
          bracket,
          state.stamina,
          buffAttackSpeedPct
        );
        totalSwings++;

        const hitProb = computeHitChance(bracket, stats, archetype, false, 0);
        const [didHit, nextHitAcc] = resolveDeterministicRoll(state.hitAcc, hitProb);
        state.hitAcc = nextHitAcc;

        if (didHit) {
          totalHits++;
          const critProb = computeCritChance(bracket, stats, buffCritPct);
          const [didCrit, nextCritAcc] = resolveDeterministicRoll(
            state.critAcc,
            critProb
          );
          state.critAcc = nextCritAcc;
          if (didCrit) {
            totalCrits++;
          }

          if (mode === 'mode_b' && classDef.id === 'samurai' && bracket.skillLevel >= 50) {
            state.perfectionStreakBonusPct = Math.min(
              100,
              state.perfectionStreakBonusPct + Math.floor(bracket.skillLevel / 10)
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
          dealDamageToTarget(swingTargetIdx, mitigatedSwing);

          // Mode B: 5-swing DeathStrike delayed detonation counter
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
              dealDamageToTarget(swingTargetIdx, detDmg);
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

    // Check if wave was killed by offensive actions on this tick
    const remainingAfterOffense = state.targetHpPools.filter((hp) => hp > 0).length;
    if (remainingAfterOffense === 0) {
      wavesCompleted++;
      if (archetypeId === 'fast_trash' && wavesCompleted >= archetype.waveCount) {
        break;
      }
      state.targetHpPools = spawnTargetWave();
      state.targetDebuffs = [];
    }

    // 7. Enemy incoming attack resolution & EHP/sustain accounting
    enemyAttackTimerMs -= TICK_MS;
    if (enemyAttackTimerMs <= 0) {
      enemyAttackTimerMs += archetype.enemyAttackIntervalMs;

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
        enemyScale *
        (archetype.enemyAttackIntervalMs / 1000) *
        livingEnemyCount *
        (enemyStunnedOrParalyzed ? 0.65 : 1.0);

      // Check Mirror Image clone interception (Mode B or clone_stacks buff)
      let interceptedByClone = false;
      if (state.cloneStacks > 0 && state.cloneIcdMs <= 0) {
        const cloneInterceptChance = clamp(bracket.skillLevel / 150, 0.25, 0.75);
        const [didIntercept, nextProcAcc] = resolveDeterministicRoll(
          state.procAcc,
          cloneInterceptChance
        );
        state.procAcc = nextProcAcc;
        if (didIntercept) {
          interceptedByClone = true;
          state.cloneStacks--;
          state.cloneIcdMs = 1500;
          cloneInterceptions++;
          totalIncomingDamageMitigated += rawEnemyHit;
        }
      }

      if (!interceptedByClone) {
        // Check Parry / Evasion
        const hasParry = classDef.starterSkills.some(
          (s) => s.skillKey === 'parry' || s.skillKey === 'bushido'
        );
        const buffEvasionPct = sumModifierStat(
          state.selfBuffs,
          passiveEffects,
          'evasion_pct'
        );
        const baseParryChance = hasParry
          ? (bracket.skillLevel * bracket.skillLevel) / 48000 +
            (bracket.skillLevel >= 100 ? 0.05 : 0)
          : 0;
        const avoidChance = clamp(
          baseParryChance +
            buffEvasionPct / 100 +
            Math.min(45, bracket.defenseChanceIncreasePct) / 200,
          0,
          0.65
        );

        const [didParry, nextParryAcc] = resolveDeterministicRoll(
          state.parryAcc,
          avoidChance
        );
        state.parryAcc = nextParryAcc;

        if (didParry) {
          parryCount++;
          totalIncomingDamageMitigated += rawEnemyHit;

          // Mode B: CounterAttack reactive free weapon swing on parry
          if (
            mode === 'mode_b' &&
            state.counterStanceRemainingMs > 0 &&
            state.counterIcdMs <= 0
          ) {
            state.counterIcdMs = 2000;
            const counterTargetIdx = state.targetHpPools.findIndex((hp) => hp > 0);
            if (counterTargetIdx >= 0) {
              const rawCounter = computeAutoAttackRawDamage(
                bracket,
                stats,
                buffDamagePct,
                totalPerfectionBonus
              );
              const mitigatedCounter = applyTargetMitigation(
                rawCounter,
                archetype,
                false,
                0,
                targetDefenseDeltaPct
              );
              totalSwings++;
              totalHits++;
              dealDamageToTarget(counterTargetIdx, mitigatedCounter);
            }
          }
        } else {
          // Mitigate incoming damage by armor physical/elemental resistance + defensive stances
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

          const effectiveArmorResist = clamp(
            (bracket.armorPhysResistPct * 0.7 + bracket.armorElemResistPct * 0.3) +
              buffDefensePct,
            0,
            75
          );
          const stanceMult = clamp(
            (1 + buffDamageTakenPct / 100) * (1 + enemyDamagePenaltyPct / 100),
            0.35,
            1.4
          );

          const damageTaken = Math.max(
            1,
            rawEnemyHit * (1 - effectiveArmorResist / 100) * stanceMult
          );
          const mitigatedAmount = Math.max(0, rawEnemyHit - damageTaken);
          totalIncomingDamageMitigated += mitigatedAmount;

          state.hp = Math.max(1, state.hp - damageTaken);
        }
      }
    }
  }

  const elapsedSec = Math.max(0.1, state.elapsedMs / 1000);
  const sustainedDps = round2(totalEffectiveDamage / elapsedSec);
  const rawDps = round2(totalRawDamage / elapsedSec);

  const effectiveWavesKilled =
    archetypeId === 'fast_trash'
      ? Math.max(1, wavesCompleted || totalEffectiveDamage / singleTargetMaxHp)
      : Math.max(0.01, totalEffectiveDamage / singleTargetMaxHp);
  const trashTtkSec = round2(elapsedSec / effectiveWavesKilled);

  const overkillWastePct =
    totalRawDamage > 0
      ? round2(
          Math.max(0, ((totalRawDamage - totalEffectiveDamage) / totalRawDamage) * 100)
        )
      : 0;

  const netManaDeltaPerMin =
    classDef.resourceProfile.primaryResource === 'zero-mana-physical'
      ? 0
      : round2(((totalManaRegenerated - totalManaSpent) / elapsedSec) * 60);

  const netStaminaDeltaPerMin = round2(
    ((totalStaminaRegenerated - totalStaminaSpent) / elapsedSec) * 60
  );

  // Effective HP per second combines EHP pool resilience, active/passive healing amplified by mitigation, and mitigated/parried incoming DPS
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
      (totalHpHealedOrRegenerated * ehpMultiplier + totalIncomingDamageMitigated) /
        elapsedSec
  );

  return {
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
    totalCasts,
    totalSwings,
    totalHits,
    totalCrits,
    parryCount,
    cloneInterceptions,
    oomTicks:
      classDef.resourceProfile.primaryResource === 'zero-mana-physical' ? 0 : oomTicks,
  };
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
