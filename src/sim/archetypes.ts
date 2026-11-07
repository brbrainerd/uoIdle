import type {
  AffixLoadoutId,
  BracketBudget,
  BracketId,
  ClassDefinition,
  EnemyArchetype,
  EnemyArchetypeId,
  MaterialTierId,
  PostureId,
  ResolvedClassStats,
} from './types.js';

export interface MaterialTierSpec {
  tierId: MaterialTierId;
  levelReq: number;
  statBonusBudget: number;
  hue: number;
}

export const MATERIAL_TIER_SPECS: readonly MaterialTierSpec[] = [
  { tierId: 'Iron', levelReq: 1, statBonusBudget: 0, hue: 0 },
  { tierId: 'DullCopper', levelReq: 8, statBonusBudget: 6, hue: 2419 },
  { tierId: 'ShadowIron', levelReq: 15, statBonusBudget: 12, hue: 2406 },
  { tierId: 'Copper', levelReq: 22, statBonusBudget: 18, hue: 2413 },
  { tierId: 'Bronze', levelReq: 30, statBonusBudget: 24, hue: 2418 },
  { tierId: 'Gold', levelReq: 38, statBonusBudget: 32, hue: 2213 },
  { tierId: 'Agapite', levelReq: 45, statBonusBudget: 42, hue: 2425 },
  { tierId: 'Verite', levelReq: 52, statBonusBudget: 54, hue: 2207 },
  { tierId: 'Valorite', levelReq: 60, statBonusBudget: 68, hue: 2219 },
] as const;

export function buildMaterialTierBudget(tier: MaterialTierSpec): BracketBudget {
  const baseL60 = BRACKET_BUDGETS.L60;
  const ratio = tier.statBonusBudget / 68;
  return {
    ...baseL60,
    weaponAvgDmg: Math.round((14 + 32 * ratio) * 100) / 100,
    armorPhysResistPct: Math.round((18 + 44 * ratio) * 100) / 100,
    armorElemResistPct: Math.round((12 + 43 * ratio) * 100) / 100,
    damageIncreasePct: Math.round((10 + 55 * ratio) * 100) / 100,
    spellDamageIncreasePct: Math.round((10 + 55 * ratio) * 100) / 100,
    swingSpeedIncreasePct: Math.round((5 + 25 * ratio) * 100) / 100,
    critChancePct: Math.round((2 + 13 * ratio) * 100) / 100,
    hitChanceIncreasePct: Math.round((5 + 27 * ratio) * 100) / 100,
    defenseChanceIncreasePct: Math.round((5 + 27 * ratio) * 100) / 100,
    bonusHP: Math.round(10 + 90 * ratio),
    bonusStamina: Math.round(10 + 60 * ratio),
    bonusMana: Math.round(10 + 60 * ratio),
    hpRegenAffix: Math.round((0.5 + 3.0 * ratio) * 100) / 100,
    staminaRegenAffix: Math.round((0.5 + 3.0 * ratio) * 100) / 100,
    manaRegenAffix: Math.round((0.5 + 3.0 * ratio) * 100) / 100,
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
          weaponAvgDmg: 34,
          damageIncreasePct: 15,
          spellDamageIncreasePct: 15,
          swingSpeedIncreasePct: 5,
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
          spellDamageIncreasePct: 45,
          swingSpeedIncreasePct: 38,
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
          damageIncreasePct: 80,
          spellDamageIncreasePct: 80,
          swingSpeedIncreasePct: 22,
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
          spellDamageIncreasePct: 50,
          swingSpeedIncreasePct: 24,
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
          damageIncreasePct: 85,
          spellDamageIncreasePct: 85,
          swingSpeedIncreasePct: 38,
          critChancePct: 20,
          hitChanceIncreasePct: 40,
          defenseChanceIncreasePct: 40,
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
    spellDamageIncreasePct: 45,
    swingSpeedIncreasePct: 20,
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
    spellDamageIncreasePct: 65,
    swingSpeedIncreasePct: 30,
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
    enemyPreMitigationDpsPerTarget: 8,
    enemyAttackIntervalMs: 2000,
  },
};

export function resolveClassStatsForBracket(
  classDef: ClassDefinition,
  bracket: BracketBudget
): ResolvedClassStats {
  let str = bracket.primaryStat;
  let dex = bracket.secondaryStat;
  let int = bracket.tertiaryStat;
  let posture: PostureId = 'Attack';

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
    posture = 'Attack';
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
    posture = 'Precision';
  } else {
    str = bracket.primaryStat;
    dex = bracket.secondaryStat;
    int = bracket.tertiaryStat;
    posture = 'Attack';
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

  return {
    str,
    dex,
    int,
    posture,
    maxHP,
    maxStamina,
    maxMana,
    levelFactor,
  };
}
