import type {
  ClassDefinition,
  EffectDefinition,
  SkillDefinition,
} from '../schemas/skill.schema.js';

export type { ClassDefinition, EffectDefinition, SkillDefinition };

export type BracketId = 'L10' | 'L25' | 'L45' | 'L60';

export const BRACKET_IDS: readonly BracketId[] = ['L10', 'L25', 'L45', 'L60'] as const;

export type EnemyArchetypeId =
  | 'fast_trash'
  | 'low_def_boss'
  | 'high_def_boss'
  | 'multi_target_pack';

export const ARCHETYPE_IDS: readonly EnemyArchetypeId[] = [
  'fast_trash',
  'low_def_boss',
  'high_def_boss',
  'multi_target_pack',
] as const;

export type PostureId = 'Attack' | 'Defensive' | 'Precision';

export type SimImplementationMode = 'mode_a' | 'mode_b';

export interface BracketBudget {
  bracketId: BracketId;
  level: 10 | 25 | 45 | 60;
  primaryStat: number;
  secondaryStat: number;
  tertiaryStat: number;
  skillLevel: number;
  abilityRank: 1 | 2 | 3;
  weaponAvgDmg: number;
  baseWeaponSpeedMs: number;
  armorPhysResistPct: number;
  armorElemResistPct: number;
  damageIncreasePct: number;
  spellDamageIncreasePct: number;
  swingSpeedIncreasePct: number;
  critChancePct: number;
  hitChanceIncreasePct: number;
  defenseChanceIncreasePct: number;
  bonusHP: number;
  bonusStamina: number;
  bonusMana: number;
  hpRegenAffix: number;
  staminaRegenAffix: number;
  manaRegenAffix: number;
}

export interface EnemyArchetype {
  archetypeId: EnemyArchetypeId;
  name: string;
  targetCount: 1 | 3;
  waveCount: number;
  fightHorizonMs: number;
  hpMultiplier: number;
  physResistPct: number;
  elemResistPct: number;
  defenseSkill: number;
  enemyPreMitigationDpsPerTarget: number;
  enemyAttackIntervalMs: number;
}

export interface ResolvedClassStats {
  str: number;
  dex: number;
  int: number;
  posture: PostureId;
  maxHP: number;
  maxStamina: number;
  maxMana: number;
  levelFactor: number;
}

export interface ActiveStatusInstance {
  id: string;
  sourceSkillId: string;
  effect: EffectDefinition;
  remainingMs: number;
  nextTickCountdownMs: number;
  dotDamagePerTick: number;
  isElemental: boolean;
}

export interface CombatState {
  tick: number;
  elapsedMs: number;
  hp: number;
  maxHP: number;
  stamina: number;
  maxStamina: number;
  mana: number;
  maxMana: number;
  swingCooldownMs: number;
  potionCooldownMs: number;
  bandageCooldownMs: number;
  skillCooldownsMs: Map<string, number>;
  selfBuffs: ActiveStatusInstance[];
  targetDebuffs: ActiveStatusInstance[];
  targetHpPools: number[];
  targetMaxHp: number;
  perfectionStreakBonusPct: number;
  cloneStacks: number;
  cloneIcdMs: number;
  counterStanceRemainingMs: number;
  counterIcdMs: number;
  deathStrikeSwingsRemaining: number;
  deathStrikePendingDamage: number;
  hitAcc: number;
  critAcc: number;
  parryAcc: number;
  procAcc: number;
}

export interface SimTelemetry {
  classId: string;
  bracketId: BracketId;
  archetypeId: EnemyArchetypeId;
  mode: SimImplementationMode;
  sustainedDps: number;
  rawDps: number;
  trashTtkSec: number;
  overkillWastePct: number;
  netManaDeltaPerMin: number;
  netStaminaDeltaPerMin: number;
  ehpPerSec: number;
  totalCasts: number;
  totalSwings: number;
  totalHits: number;
  totalCrits: number;
  parryCount: number;
  cloneInterceptions: number;
  oomTicks: number;
}

export type SimScenarioResult = SimTelemetry;

export interface ClassBracketSummary {
  classId: string;
  bracketId: BracketId;
  sustainedBossDps: number;
  highDefBossDps: number;
  multiTargetDps: number;
  trashTtkSec: number;
  overkillWastePct: number;
  netManaDeltaPerMin: number;
  netStaminaDeltaPerMin: number;
  ehpPerSec: number;
}

export interface SimBaselineArtifact {
  version: '0.99.0';
  tickMs: 100;
  classes: string[];
  brackets: BracketId[];
  archetypes: EnemyArchetypeId[];
  scenarios: SimTelemetry[];
  summaryByClassBracket: ClassBracketSummary[];
}

export type MaterialTierId =
  | 'Iron'
  | 'DullCopper'
  | 'ShadowIron'
  | 'Copper'
  | 'Bronze'
  | 'Gold'
  | 'Agapite'
  | 'Verite'
  | 'Valorite';

export const MATERIAL_TIER_IDS: readonly MaterialTierId[] = [
  'Iron',
  'DullCopper',
  'ShadowIron',
  'Copper',
  'Bronze',
  'Gold',
  'Agapite',
  'Verite',
  'Valorite',
] as const;

export type AffixLoadoutId =
  | 'clean_base'
  | 'speed_crit'
  | 'power_lethality'
  | 'bastion_parry'
  | 'valorite_bis';

export const AFFIX_LOADOUT_IDS: readonly AffixLoadoutId[] = [
  'clean_base',
  'speed_crit',
  'power_lethality',
  'bastion_parry',
  'valorite_bis',
] as const;

export interface DamageChannelBreakdown {
  classId: string;
  bracketId: BracketId;
  archetypeId: EnemyArchetypeId;
  mode: SimImplementationMode;
  autoAttackDps: number;
  specialMoveDps: number;
  executeDps: number;
  dotDps: number;
  procCounterDps: number;
  totalDps: number;
}

export interface MaterialTierPoint {
  classId: string;
  tierId: MaterialTierId;
  levelReq: number;
  statBonusBudget: number;
  hue: number;
  lowDefBossDps: number;
  highDefBossDps: number;
  multiTargetDps: number;
  ehpPerSec: number;
}

export interface AffixLoadoutPoint {
  classId: string;
  loadoutId: AffixLoadoutId;
  loadoutName: string;
  lowDefBossDps: number;
  highDefBossDps: number;
  multiTargetDps: number;
  ehpPerSec: number;
  netManaDeltaPerMin: number;
  netStaminaDeltaPerMin: number;
}

export interface WavePullTelemetryPoint {
  waveIndex: number;
  waveClearTimeSec: number;
  cumulativeTimeSec: number;
  waveDps: number;
  endingHpPct: number;
  endingManaPct: number;
  endingStaminaPct: number;
  parriesInWave: number;
  clonesOrStreakEnd: number;
}

export interface ClassMultiWaveRun {
  classId: string;
  totalClearTimeSec: number;
  averageWaveDps: number;
  minHpPct: number;
  minManaPct: number;
  totalParries: number;
  totalCloneInterceptions: number;
  waves: WavePullTelemetryPoint[];
}

export interface RotationTimelineEvent {
  timeMs: number;
  kind: 'cast' | 'swing' | 'dot' | 'proc' | 'detonate';
  label: string;
  damage: number;
  isCrit: boolean;
}

export interface ClassRotationTimeline {
  classId: string;
  bracketId: BracketId;
  horizonMs: number;
  events: RotationTimelineEvent[];
}

export interface GearAndWavesArtifact {
  version: '1.1.0';
  tickMs: 100;
  classes: string[];
  damageBreakdowns: DamageChannelBreakdown[];
  materialTierCurves: MaterialTierPoint[];
  affixLoadoutCurves: AffixLoadoutPoint[];
  multiWaveRuns: ClassMultiWaveRun[];
  rotationTimelines: ClassRotationTimeline[];
}

