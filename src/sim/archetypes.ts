import type {
  BracketBudget,
  BracketId,
  ClassDefinition,
  EnemyArchetype,
  EnemyArchetypeId,
  PostureId,
  ResolvedClassStats,
} from './types.js';

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
