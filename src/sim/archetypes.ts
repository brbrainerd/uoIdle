import type {
  AffixLoadoutId,
  BracketBudget,
  BracketId,
  CanonicalPostureId,
  ClassDefinition,
  EnemyArchetype,
  EnemyArchetypeId,
  MaterialTierId,
  PostureId,
  PostureProfile,
  ResolvedClassStats,
  WeaponArchetypeId,
} from './types.js';

export interface MaterialTierSpec {
  tierId: MaterialTierId;
  stepIndex: number;
  levelReq: number;
  statBonusBudget: number;
  hue: number;
  /** Canonical +8% weapon damage per material step (`[[resources]] C2`). */
  weaponStepMultiplier: number;
  /** Canonical +12% armor resistance/durability per material step (`[[resources]] C2`). */
  armorStepMultiplier: number;
}

export const MATERIAL_TIER_SPECS: readonly MaterialTierSpec[] = [
  { tierId: 'Iron', stepIndex: 0, levelReq: 1, statBonusBudget: 0, hue: 0, weaponStepMultiplier: 1.0, armorStepMultiplier: 1.0 },
  { tierId: 'DullCopper', stepIndex: 1, levelReq: 8, statBonusBudget: 6, hue: 2419, weaponStepMultiplier: 1.08, armorStepMultiplier: 1.12 },
  { tierId: 'ShadowIron', stepIndex: 2, levelReq: 15, statBonusBudget: 12, hue: 2406, weaponStepMultiplier: 1.16, armorStepMultiplier: 1.24 },
  { tierId: 'Copper', stepIndex: 3, levelReq: 22, statBonusBudget: 18, hue: 2413, weaponStepMultiplier: 1.24, armorStepMultiplier: 1.36 },
  { tierId: 'Bronze', stepIndex: 4, levelReq: 30, statBonusBudget: 24, hue: 2418, weaponStepMultiplier: 1.32, armorStepMultiplier: 1.48 },
  { tierId: 'Gold', stepIndex: 5, levelReq: 38, statBonusBudget: 32, hue: 2213, weaponStepMultiplier: 1.40, armorStepMultiplier: 1.60 },
  { tierId: 'Agapite', stepIndex: 6, levelReq: 45, statBonusBudget: 42, hue: 2425, weaponStepMultiplier: 1.48, armorStepMultiplier: 1.72 },
  { tierId: 'Verite', stepIndex: 7, levelReq: 52, statBonusBudget: 54, hue: 2207, weaponStepMultiplier: 1.56, armorStepMultiplier: 1.84 },
  { tierId: 'Valorite', stepIndex: 8, levelReq: 60, statBonusBudget: 68, hue: 2219, weaponStepMultiplier: 1.64, armorStepMultiplier: 1.96 },
] as const;

/**
 * Canonical Hunting Bot combat postures (`[huntpostura` in `_raw/bundle/i18n-en-abilities.js:1574-1579`,
 * `[[hunting-bot-and-dungeons]] C4`, `[[simulator-fidelity-audit]] C2`).
 */
export const POSTURE_PROFILES: Record<CanonicalPostureId, PostureProfile> = {
  agressivo: {
    id: 'agressivo',
    label: 'Aggressive (+20% Dmg Dealt / +40% Dmg Taken)',
    outgoingDamageMultiplier: 1.2,
    incomingDamageMultiplier: 1.4,
    bonusHciPct: 0,
    bonusCritPct: 0,
  },
  equilibrado: {
    id: 'equilibrado',
    label: 'Balanced (1.0x Dmg Dealt / 1.0x Dmg Taken)',
    outgoingDamageMultiplier: 1.0,
    incomingDamageMultiplier: 1.0,
    bonusHciPct: 0,
    bonusCritPct: 0,
  },
  defensivo: {
    id: 'defensivo',
    label: 'Defensive (-40% Dmg Dealt / -20% Dmg Taken)',
    outgoingDamageMultiplier: 0.6,
    incomingDamageMultiplier: 0.8,
    bonusHciPct: 0,
    bonusCritPct: 0,
  },
};

export function resolvePostureProfile(posture: PostureId): PostureProfile {
  switch (posture) {
    case 'agressivo':
    case 'Attack':
      return POSTURE_PROFILES.agressivo;
    case 'defensivo':
    case 'Defensive':
      return POSTURE_PROFILES.defensivo;
    case 'Precision':
      return {
        ...POSTURE_PROFILES.equilibrado,
        bonusHciPct: 10,
        bonusCritPct: 5,
      };
    case 'equilibrado':
    default:
      return POSTURE_PROFILES.equilibrado;
  }
}

/**
 * Builds an L60 material-tier budget applying the server's +8% weapon damage per step
 * and +12% armor resistance/durability per step (`[[resources]] C2`, `changelog-server-dev.md:58`).
 */
export function buildMaterialTierBudget(tier: MaterialTierSpec): BracketBudget {
  const baseL60 = BRACKET_BUDGETS.L60;
  const step = tier.stepIndex ?? Math.round((tier.statBonusBudget / 68) * 8);
  const weaponStepMult = tier.weaponStepMultiplier ?? Number((1 + 0.08 * step).toFixed(2));
  const armorStepMult = tier.armorStepMultiplier ?? Number((1 + 0.12 * step).toFixed(2));
  const ratio = step / 8;

  const ironBaseWeaponDmg = 28.0;
  const ironBasePhysResist = 31.5;
  const ironBaseElemResist = 28.0;

  return {
    ...baseL60,
    weaponAvgDmg: Math.min(46, Math.round(ironBaseWeaponDmg * weaponStepMult * 100) / 100),
    armorPhysResistPct: Math.min(68, Math.round(ironBasePhysResist * armorStepMult * 100) / 100),
    armorElemResistPct: Math.min(62, Math.round(ironBaseElemResist * armorStepMult * 100) / 100),
    damageIncreasePct: Math.round((15 + 50 * ratio) * 100) / 100,
    spellDamageIncreasePct: Math.min(50, Math.round((12 + 38 * ratio) * 100) / 100),
    swingSpeedIncreasePct: Math.round((6 + 24 * ratio) * 100) / 100,
    treeSpeedPct: Math.round(8 * ratio * 100) / 100,
    lowerManaCostPct: Math.round((4 + 16 * ratio) * 100) / 100,
    enhancePotionsPct: Math.round(15 * ratio * 100) / 100,
    reflectPhysicalPct: Math.round(8 * ratio * 100) / 100,
    critChancePct: Math.round((3 + 12 * ratio) * 100) / 100,
    hitChanceIncreasePct: Math.round((6 + 26 * ratio) * 100) / 100,
    defenseChanceIncreasePct: Math.round((6 + 26 * ratio) * 100) / 100,
    bonusHP: Math.round(15 + 85 * ratio),
    bonusStamina: Math.round(12 + 58 * ratio),
    bonusMana: Math.round(12 + 58 * ratio),
    hpRegenAffix: Math.round((0.6 + 2.9 * ratio) * 100) / 100,
    staminaRegenAffix: Math.round((0.6 + 2.9 * ratio) * 100) / 100,
    manaRegenAffix: Math.round((0.6 + 2.9 * ratio) * 100) / 100,
  };
}

export function buildAffixLoadoutBudget(loadoutId: AffixLoadoutId): {
  name: string;
  budget: BracketBudget;
} {
  const base = BRACKET_BUDGETS.L60;
  switch (loadoutId) {
    case 'clean_base':
      return {
        name: 'Un-Affixed Base Gear',
        budget: {
          ...base,
          weaponAvgDmg: 32,
          damageIncreasePct: 12,
          spellDamageIncreasePct: 10,
          swingSpeedIncreasePct: 5,
          treeSpeedPct: 0,
          lowerManaCostPct: 0,
          enhancePotionsPct: 0,
          reflectPhysicalPct: 0,
          critChancePct: 4,
          hitChanceIncreasePct: 10,
          defenseChanceIncreasePct: 10,
          armorPhysResistPct: 45,
          armorElemResistPct: 38,
          bonusHP: 40,
          hpRegenAffix: 1.0,
          staminaRegenAffix: 1.0,
          manaRegenAffix: 1.0,
        },
      };
    case 'speed_crit':
      return {
        name: 'Swift Tempo & Keen Edge (+SSI/+Crit)',
        budget: {
          ...base,
          weaponAvgDmg: 42,
          damageIncreasePct: 45,
          spellDamageIncreasePct: 38,
          swingSpeedIncreasePct: 45,
          treeSpeedPct: 10,
          lowerManaCostPct: 18,
          enhancePotionsPct: 15,
          reflectPhysicalPct: 5,
          critChancePct: 20,
          hitChanceIncreasePct: 34,
          defenseChanceIncreasePct: 22,
        },
      };
    case 'power_lethality':
      return {
        name: 'Heavy Execution & Spell Power (+DI/+SDI)',
        budget: {
          ...base,
          weaponAvgDmg: 48,
          damageIncreasePct: 85,
          spellDamageIncreasePct: 50,
          swingSpeedIncreasePct: 22,
          treeSpeedPct: 6,
          lowerManaCostPct: 20,
          enhancePotionsPct: 15,
          reflectPhysicalPct: 8,
          critChancePct: 14,
          hitChanceIncreasePct: 30,
          defenseChanceIncreasePct: 22,
        },
      };
    case 'bastion_parry':
      return {
        name: 'Tokuno Bastion & Parry (+DCI/+Resist/+Regen)',
        budget: {
          ...base,
          weaponAvgDmg: 42,
          damageIncreasePct: 50,
          spellDamageIncreasePct: 42,
          swingSpeedIncreasePct: 24,
          treeSpeedPct: 6,
          lowerManaCostPct: 22,
          enhancePotionsPct: 25,
          reflectPhysicalPct: 18,
          critChancePct: 12,
          hitChanceIncreasePct: 28,
          defenseChanceIncreasePct: 45,
          armorPhysResistPct: 70,
          armorElemResistPct: 65,
          bonusHP: 145,
          hpRegenAffix: 5.5,
          staminaRegenAffix: 5.0,
          manaRegenAffix: 5.0,
        },
      };
    case 'valorite_bis':
      return {
        name: 'Grandmaster Valorite BiS (Full Affix Cap)',
        budget: {
          ...base,
          weaponAvgDmg: 50,
          damageIncreasePct: 100,
          spellDamageIncreasePct: 50,
          swingSpeedIncreasePct: 60,
          treeSpeedPct: 15,
          lowerManaCostPct: 40,
          castSpeedBonus: 2,
          castRecoveryBonus: 6,
          enhancePotionsPct: 35,
          reflectPhysicalPct: 15,
          critChancePct: 20,
          hitChanceIncreasePct: 45,
          defenseChanceIncreasePct: 45,
          armorPhysResistPct: 68,
          armorElemResistPct: 62,
          bonusHP: 130,
          bonusStamina: 90,
          bonusMana: 90,
          hpRegenAffix: 4.8,
          staminaRegenAffix: 4.8,
          manaRegenAffix: 4.8,
        },
      };
  }
}

export const BASE_ENEMY_HP = 180;

export const BRACKET_ENEMY_SCALE: Record<BracketId, number> = {
  L10: 1.0,
  L25: 2.8,
  L45: 6.5,
  L60: 11.0,
};

export const BRACKET_BUDGETS: Record<BracketId, BracketBudget> = {
  L10: {
    bracketId: 'L10',
    level: 10,
    primaryStat: 45,
    secondaryStat: 30,
    tertiaryStat: 20,
    skillLevel: 35,
    abilityRank: 1,
    weaponAvgDmg: 12,
    baseWeaponSpeedMs: 2500,
    armorPhysResistPct: 18,
    armorElemResistPct: 12,
    damageIncreasePct: 10,
    spellDamageIncreasePct: 10,
    swingSpeedIncreasePct: 5,
    treeSpeedPct: 0,
    lowerManaCostPct: 4,
    enhancePotionsPct: 0,
    reflectPhysicalPct: 0,
    critChancePct: 2,
    hitChanceIncreasePct: 5,
    defenseChanceIncreasePct: 5,
    bonusHP: 15,
    bonusStamina: 10,
    bonusMana: 10,
    hpRegenAffix: 0.5,
    staminaRegenAffix: 0.5,
    manaRegenAffix: 0.5,
  },
  L25: {
    bracketId: 'L25',
    level: 25,
    primaryStat: 70,
    secondaryStat: 50,
    tertiaryStat: 30,
    skillLevel: 60,
    abilityRank: 1,
    weaponAvgDmg: 22,
    baseWeaponSpeedMs: 2500,
    armorPhysResistPct: 32,
    armorElemResistPct: 25,
    damageIncreasePct: 25,
    spellDamageIncreasePct: 25,
    swingSpeedIncreasePct: 12,
    treeSpeedPct: 2,
    lowerManaCostPct: 8,
    enhancePotionsPct: 5,
    reflectPhysicalPct: 2,
    critChancePct: 5,
    hitChanceIncreasePct: 12,
    defenseChanceIncreasePct: 12,
    bonusHP: 35,
    bonusStamina: 25,
    bonusMana: 25,
    hpRegenAffix: 1.2,
    staminaRegenAffix: 1.2,
    manaRegenAffix: 1.2,
  },
  L45: {
    bracketId: 'L45',
    level: 45,
    primaryStat: 100,
    secondaryStat: 75,
    tertiaryStat: 45,
    skillLevel: 85,
    abilityRank: 2,
    weaponAvgDmg: 34,
    baseWeaponSpeedMs: 2500,
    armorPhysResistPct: 48,
    armorElemResistPct: 40,
    damageIncreasePct: 45,
    spellDamageIncreasePct: 42,
    swingSpeedIncreasePct: 20,
    treeSpeedPct: 5,
    lowerManaCostPct: 12,
    enhancePotionsPct: 10,
    reflectPhysicalPct: 5,
    critChancePct: 10,
    hitChanceIncreasePct: 22,
    defenseChanceIncreasePct: 22,
    bonusHP: 65,
    bonusStamina: 45,
    bonusMana: 45,
    hpRegenAffix: 2.2,
    staminaRegenAffix: 2.2,
    manaRegenAffix: 2.2,
  },
  L60: {
    bracketId: 'L60',
    level: 60,
    primaryStat: 125,
    secondaryStat: 95,
    tertiaryStat: 60,
    skillLevel: 100,
    abilityRank: 3,
    weaponAvgDmg: 46,
    baseWeaponSpeedMs: 2500,
    armorPhysResistPct: 62,
    armorElemResistPct: 55,
    damageIncreasePct: 65,
    spellDamageIncreasePct: 50,
    swingSpeedIncreasePct: 30,
    treeSpeedPct: 8,
    lowerManaCostPct: 16,
    enhancePotionsPct: 15,
    reflectPhysicalPct: 8,
    critChancePct: 15,
    hitChanceIncreasePct: 32,
    defenseChanceIncreasePct: 32,
    bonusHP: 100,
    bonusStamina: 70,
    bonusMana: 70,
    hpRegenAffix: 3.5,
    staminaRegenAffix: 3.5,
    manaRegenAffix: 3.5,
  },
};

export const ENEMY_ARCHETYPES: Record<EnemyArchetypeId, EnemyArchetype> = {
  fast_trash: {
    archetypeId: 'fast_trash',
    name: 'Fast Trash Wave',
    targetCount: 1,
    waveCount: 10,
    fightHorizonMs: 60000,
    hpMultiplier: 0.45,
    physResistPct: 10,
    elemResistPct: 10,
    defenseSkill: 25,
    defenderDciPct: 0,
    enemyPreMitigationDpsPerTarget: 8,
    enemyAttackIntervalMs: 2000,
  },
  low_def_boss: {
    archetypeId: 'low_def_boss',
    name: 'Low-Defense Boss',
    targetCount: 1,
    waveCount: 1,
    fightHorizonMs: 60000,
    hpMultiplier: 12.0,
    physResistPct: 15,
    elemResistPct: 15,
    defenseSkill: 45,
    defenderDciPct: 5,
    enemyPreMitigationDpsPerTarget: 18,
    enemyAttackIntervalMs: 2000,
  },
  high_def_boss: {
    archetypeId: 'high_def_boss',
    name: 'High-Defense Boss',
    targetCount: 1,
    waveCount: 1,
    fightHorizonMs: 60000,
    hpMultiplier: 10.0,
    physResistPct: 55,
    elemResistPct: 50,
    defenseSkill: 65,
    defenderDciPct: 15,
    enemyPreMitigationDpsPerTarget: 32,
    enemyAttackIntervalMs: 2000,
  },
  multi_target_pack: {
    archetypeId: 'multi_target_pack',
    name: 'Multi-Target Pack (3 targets)',
    targetCount: 3,
    waveCount: 1,
    fightHorizonMs: 60000,
    hpMultiplier: 1.2,
    physResistPct: 25,
    elemResistPct: 20,
    defenseSkill: 40,
    defenderDciPct: 5,
    enemyPreMitigationDpsPerTarget: 8,
    enemyAttackIntervalMs: 2000,
  },
};

export interface WeaponArchetypeSpec {
  weaponArchetypeId: WeaponArchetypeId;
  nameByClass: Record<string, string>;
  baseWeaponSpeedMs: number;
  weaponDamageMultiplier: number;
  isTwoHanded: boolean;
  /** Whether a shield-capable class (`warrior`) equips a shield in this weapon archetype. */
  allowShieldOnParryClasses: boolean;
}

/**
 * Canonical UO / ModernUO (`BaseWeapon.cs:1356-1489`) weapon speed & base damage trade-off families:
 * - `fast_1h` (`2,250ms` ML speed): Kryss / Tekagi / Wakizashi / Shortbow (`0.90x` per-hit damage, highest swing frequency for on-hit procs, Perfection ramp, and 5-step DeathStrike detonation).
 * - `balanced_1h` (`2,500ms` ML speed): Katana / Scepter / Composite Bow (`1.00x` per-hit damage, standard baseline).
 * - `heavy_2h` (`3,250ms` ML speed): No-Dachi / Lajatang / Tetsubo / Heavy Crossbow / Halberd (`1.30x` per-hit damage, two-handed `41,140` Bushido parry divisor, no shield on Warrior).
 */
export const WEAPON_ARCHETYPE_SPECS: Record<WeaponArchetypeId, WeaponArchetypeSpec> = {
  fast_1h: {
    weaponArchetypeId: 'fast_1h',
    nameByClass: {
      warrior: 'Broadsword & Heater Shield (2.25s 1H)',
      mage: 'Spellweaver Wand (2.25s 1H)',
      ranger: 'Yumi / Repeating Bow (2.25s Fast)',
      samurai: 'Wakizashi / Kama (2.25s 1H)',
      ninja: 'Kryss / Tekagi Claws (2.25s 1H)',
    },
    baseWeaponSpeedMs: 2250,
    weaponDamageMultiplier: 0.9,
    isTwoHanded: false,
    allowShieldOnParryClasses: true,
  },
  balanced_1h: {
    weaponArchetypeId: 'balanced_1h',
    nameByClass: {
      warrior: 'Scepter & Order Shield (2.50s 1H)',
      mage: 'Gnarled Staff (2.50s 2H)',
      ranger: 'Composite Bow (2.50s 2H)',
      samurai: 'Katana / Bokuto (2.50s 1H)',
      ninja: 'Sai / Kama Pair (2.50s 1H)',
    },
    baseWeaponSpeedMs: 2500,
    weaponDamageMultiplier: 1.0,
    isTwoHanded: false,
    allowShieldOnParryClasses: true,
  },
  heavy_2h: {
    weaponArchetypeId: 'heavy_2h',
    nameByClass: {
      warrior: 'Halberd / War Hammer (3.25s 2H)',
      mage: 'Black Staff (3.25s 2H)',
      ranger: 'Heavy Crossbow (3.25s 2H)',
      samurai: 'No-Dachi / Lajatang (3.25s 2H)',
      ninja: 'Fukiya & Heavy Kama (3.25s 2H)',
    },
    baseWeaponSpeedMs: 3250,
    weaponDamageMultiplier: 1.3,
    isTwoHanded: true,
    allowShieldOnParryClasses: false,
  },
};

export function buildWeaponArchetypeBudget(
  classId: string,
  weaponArchetypeId: WeaponArchetypeId,
  baseBracket: BracketBudget = BRACKET_BUDGETS.L60
): { weaponName: string; spec: WeaponArchetypeSpec; budget: BracketBudget } {
  const spec = WEAPON_ARCHETYPE_SPECS[weaponArchetypeId];
  const defaultProfile = CLASS_WEAPON_PROFILES[classId] ?? {
    baseWeaponSpeedMs: 2500,
    hasShield: false,
    isTwoHanded: false,
  };
  const isTwoHanded =
    weaponArchetypeId === 'heavy_2h'
      ? true
      : weaponArchetypeId === 'fast_1h'
        ? false
        : defaultProfile.isTwoHanded;
  const hasShield =
    spec.allowShieldOnParryClasses && !isTwoHanded ? defaultProfile.hasShield : false;

  return {
    weaponName: spec.nameByClass[classId] ?? `${weaponArchetypeId} (${spec.baseWeaponSpeedMs}ms)`,
    spec,
    budget: {
      ...baseBracket,
      baseWeaponSpeedMs: spec.baseWeaponSpeedMs,
      weaponAvgDmg: Math.round(baseBracket.weaponAvgDmg * spec.weaponDamageMultiplier * 100) / 100,
      weaponArchetypeId,
      isTwoHandedOverride: isTwoHanded,
      hasShieldOverride: hasShield,
    },
  };
}

export const CLASS_WEAPON_PROFILES: Record<
  string,
  { baseWeaponSpeedMs: number; hasShield: boolean; isTwoHanded: boolean }
> = {
  warrior: { baseWeaponSpeedMs: 2500, hasShield: true, isTwoHanded: false },
  mage: { baseWeaponSpeedMs: 2500, hasShield: false, isTwoHanded: true },
  ranger: { baseWeaponSpeedMs: 2500, hasShield: false, isTwoHanded: true },
  samurai: { baseWeaponSpeedMs: 2500, hasShield: false, isTwoHanded: false },
  ninja: { baseWeaponSpeedMs: 2500, hasShield: false, isTwoHanded: false },
};

export function resolveClassStatsForBracket(
  classDef: ClassDefinition,
  bracket: BracketBudget,
  postureOverride?: PostureId
): ResolvedClassStats {
  let str = bracket.primaryStat;
  let dex = bracket.secondaryStat;
  let int = bracket.tertiaryStat;
  let posture: PostureId = postureOverride ?? 'equilibrado';

  if (
    classDef.role === 'magic' ||
    classDef.id === 'mage' ||
    classDef.id === 'necromancer' ||
    classDef.id === 'mystic' ||
    classDef.id === 'spellweaver' ||
    (classDef.baseStats.int > classDef.baseStats.str &&
      classDef.baseStats.int > classDef.baseStats.dex)
  ) {
    int = bracket.primaryStat;
    dex = bracket.secondaryStat;
    str = bracket.tertiaryStat;
  } else if (
    classDef.role === 'ranged' ||
    classDef.id === 'ranger' ||
    classDef.id === 'ninja' ||
    classDef.id === 'assassin' ||
    classDef.id === 'duelist' ||
    (classDef.baseStats.dex >= classDef.baseStats.str && classDef.id !== 'warrior')
  ) {
    dex = bracket.primaryStat;
    str = bracket.secondaryStat;
    int = bracket.tertiaryStat;
    if (!postureOverride) {
      posture = 'Precision';
    }
  } else {
    str = bracket.primaryStat;
    dex = bracket.secondaryStat;
    int = bracket.tertiaryStat;
  }

  const maxHP = 50 + Math.floor(str / 2) + bracket.bonusHP + bracket.level * 2;
  const maxStamina = dex + bracket.bonusStamina;
  const maxMana =
    classDef.resourceProfile.primaryResource === 'zero-mana-physical'
      ? 0
      : classDef.resourceProfile.startingManaMax + int + bracket.bonusMana;

  // Server level power scaling factor ([[resources]] C1: casters x80, physical x60)
  const isCaster = classDef.role === 'magic' || classDef.id === 'mage';
  const levelFactor = 1 + (bracket.level * (isCaster ? 0.8 : 0.6)) / 60;

  const weaponProfile = CLASS_WEAPON_PROFILES[classDef.id] ?? {
    baseWeaponSpeedMs: bracket.baseWeaponSpeedMs,
    hasShield: classDef.starterSkills.some((s) => s.skillKey === 'parry'),
    isTwoHanded: false,
  };
  const resolvedBaseWeaponSpeedMs =
    bracket.weaponArchetypeId !== undefined || bracket.baseWeaponSpeedMs !== 2500
      ? bracket.baseWeaponSpeedMs
      : weaponProfile.baseWeaponSpeedMs;
  const resolvedIsTwoHanded =
    bracket.isTwoHandedOverride !== undefined
      ? bracket.isTwoHandedOverride
      : weaponProfile.isTwoHanded;
  const resolvedHasShield =
    bracket.hasShieldOverride !== undefined
      ? bracket.hasShieldOverride
      : weaponProfile.hasShield;

  return {
    str,
    dex,
    int,
    posture,
    maxHP,
    maxStamina,
    maxMana,
    levelFactor,
    hasShield: resolvedHasShield,
    isTwoHanded: resolvedIsTwoHanded,
    baseWeaponSpeedMs: resolvedBaseWeaponSpeedMs,
  };
}
