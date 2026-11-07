import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ClassSchema, type ClassDefinition } from '../src/schemas/skill.schema.js';
import {
  BRACKET_BUDGETS,
  ENEMY_ARCHETYPES,
  MATERIAL_TIER_SPECS,
  POSTURE_PROFILES,
  WEAPON_ARCHETYPE_SPECS,
  buildAffixLoadoutBudget,
  buildMaterialTierBudget,
  buildWeaponArchetypeBudget,
  resolveClassStatsForBracket,
  resolvePostureProfile,
} from '../src/sim/archetypes.js';
import {
  applyTargetMitigation,
  buildHotbarLoadout,
  computeAutoAttackRawDamage,
  computeCritChance,
  computeHitChance,
  computeParryAndAvoidanceChance,
  computeSkillBaseOutput,
  computeSwingIntervalMs,
  evaluateHotbarAutoTrigger,
  resolveDeterministicRoll,
  resolveEffectiveCooldownMs,
  resolveHotbarHealTriggerPct,
  resolveSkillResourceCost,
  runGearAndWaveSuite,
  simulateMultiWavePull,
  simulateScenarioDetailed,
} from '../src/sim/engine.js';

const ROOT_DIR = process.cwd();

function loadClass(relPath: string): ClassDefinition {
  const raw = JSON.parse(fs.readFileSync(path.resolve(ROOT_DIR, relPath), 'utf8'));
  return ClassSchema.parse(raw);
}

interface TestCase {
  name: string;
  fn: () => void;
}

const tests: TestCase[] = [];
function test(name: string, fn: () => void): void {
  tests.push({ name, fn });
}

const warrior = loadClass('data/live-classes/warrior.json');
const mage = loadClass('data/live-classes/mage.json');
const ranger = loadClass('data/live-classes/ranger.json');
const samurai = loadClass('design/drop-in/samurai.json');
const ninja = loadClass('design/drop-in/ninja.json');

// 1. Deterministic accumulator roll invariants
test('resolveDeterministicRoll accumulates exact probability and clamps bounds', () => {
  let acc = 0.0;
  let hits = 0;
  for (let i = 0; i < 100; i++) {
    const [didHit, next] = resolveDeterministicRoll(acc, 0.25);
    acc = next;
    if (didHit) hits++;
  }
  assert.equal(hits, 25, 'Expected exactly 25 hits out of 100 at p=0.25');

  const [zeroHit, zeroAcc] = resolveDeterministicRoll(0.5, -0.5);
  assert.equal(zeroHit, false);
  assert.equal(zeroAcc, 0.5);

  const [alwaysHit, oneAcc] = resolveDeterministicRoll(0.2, 2.5);
  assert.equal(alwaysHit, true);
  assert.ok(Math.abs(oneAcc - 0.2) < 1e-9);
});

// 2. Custom skill 2,000ms server cooldown floor
test('resolveEffectiveCooldownMs enforces 2,000ms floor on Custom skills', () => {
  const customSkill = samurai.abilities.find((s) => s.kind === 'Custom')!;
  assert.ok(customSkill, 'Expected at least one Custom skill on Samurai');
  const mutatedShort = { ...customSkill, cooldownMs: 500, customCooldownMs: 500 };
  assert.equal(resolveEffectiveCooldownMs(mutatedShort), 2000);
});

// 3. Zero-mana physical conversion on Warrior vs hybrid Mana+Stamina & 40% LMC cap on Samurai/Ninja/Mage
test('resolveSkillResourceCost enforces Warrior 0-mana invariant and 40% LMC hard cap', () => {
  const warriorSkill = warrior.abilities.find((s) => s.kind !== 'Passive')!;
  const wCost = resolveSkillResourceCost(warrior, warriorSkill, BRACKET_BUDGETS.L60);
  assert.equal(wCost.manaCost, 0, 'Warrior active skills must cost 0 mana at runtime');
  assert.ok(wCost.staminaCost > 0, 'Warrior active skills must convert cost to stamina');

  const confidence = samurai.abilities.find((s) => s.id === 'samurai_confidence')!;
  const sCostBase = resolveSkillResourceCost(samurai, confidence);
  assert.equal(sCostBase.manaCost, 8, 'Samurai Confidence base mana cost is 8');

  const meteor = mage.abilities.find((s) => s.id === 'mage_meteor_swarm' || s.manaCost >= 20)!;
  const zeroLmc = resolveSkillResourceCost(mage, meteor, {
    ...BRACKET_BUDGETS.L60,
    lowerManaCostPct: 0,
  });
  const cap40Lmc = resolveSkillResourceCost(mage, meteor, {
    ...BRACKET_BUDGETS.L60,
    lowerManaCostPct: 40,
  });
  const overCap80Lmc = resolveSkillResourceCost(mage, meteor, {
    ...BRACKET_BUDGETS.L60,
    lowerManaCostPct: 80,
  });
  assert.ok(cap40Lmc.manaCost < zeroLmc.manaCost, '40% LMC must reduce mana cost');
  assert.equal(
    overCap80Lmc.manaCost,
    cap40Lmc.manaCost,
    'LMC above 40% must clamp to 40% (i18n-en-abilities.js:2616)'
  );
});

// 4. Weapon swing speed 60% gear SSI cap vs treeSpeedPct stacking and 1,000ms hard floor
test('computeSwingIntervalMs enforces 60% gear SSI cap while allowing treeSpeedPct to stack down to 1,000ms', () => {
  const l60 = BRACKET_BUDGETS.L60;
  const ssi60NoTree = computeSwingIntervalMs(
    { ...l60, swingSpeedIncreasePct: 60, treeSpeedPct: 0 },
    20,
    0
  );
  const ssi95NoTree = computeSwingIntervalMs(
    { ...l60, swingSpeedIncreasePct: 95, treeSpeedPct: 0 },
    20,
    0
  );
  assert.equal(
    ssi95NoTree,
    ssi60NoTree,
    'Gear SSI above 60% must be clamped at 60% when treeSpeedPct is 0'
  );

  const ssi60WithTree = computeSwingIntervalMs(
    { ...l60, swingSpeedIncreasePct: 60, treeSpeedPct: 25 },
    20,
    0
  );
  assert.ok(
    ssi60WithTree < ssi60NoTree,
    'Progression tree Speed must stack past the 60% gear SSI cap'
  );

  const hyperSwing = computeSwingIntervalMs(l60, 500, 300);
  assert.equal(hyperSwing, 1000, 'Swing interval must never drop below 1,000ms');
});

// 5. Hit chance, defender DCI + Surprise Attack shred, and crit chance caps
test('computeHitChance and computeCritChance respect 5%..95%, defender DCI shred, and 50% caps', () => {
  const l60 = BRACKET_BUDGETS.L60;
  const stats = resolveClassStatsForBracket(samurai, l60);
  const boss = ENEMY_ARCHETYPES.high_def_boss;
  assert.equal(computeHitChance(l60, stats, boss, true, 0), 0.95, 'Spells have 95% hit cap');
  assert.equal(computeHitChance(l60, stats, boss, false, 500), 0.95, 'Physical hit capped at 95%');
  assert.equal(computeCritChance(l60, stats, 200), 0.5, 'Crit chance capped at 50%');

  const hitVsDci = computeHitChance(l60, stats, boss, false, 0, 0);
  const hitAfterSurpriseShred = computeHitChance(l60, stats, boss, false, 0, -15);
  assert.ok(
    hitAfterSurpriseShred > hitVsDci,
    'Surprise Attack defender DCI shred (-15%) must increase attacker hit chance'
  );
});

// 6. Hard affix caps on DI (100%), Weapon Skill >100 flattening, and SDI (50% + INT/10)
test('computeAutoAttackRawDamage and computeSkillBaseOutput enforce DI<=100%, Skill<=100 flattening, and SDI<=50% + INT/10', () => {
  const l60 = BRACKET_BUDGETS.L60;
  const warStats = resolveClassStatsForBracket(warrior, l60);

  const di100 = computeAutoAttackRawDamage(
    { ...l60, damageIncreasePct: 100, skillLevel: 100 },
    warStats,
    0,
    0
  );
  const di160Skill120 = computeAutoAttackRawDamage(
    { ...l60, damageIncreasePct: 160, skillLevel: 120 },
    warStats,
    0,
    0
  );
  assert.equal(
    di160Skill120,
    di100,
    'Gear DI > 100% and weapon skill > 100 must flatten at 100% and 100 respectively'
  );

  const mageStatsLowInt = { ...resolveClassStatsForBracket(mage, l60), int: 80 };
  const mageStatsHighInt = { ...mageStatsLowInt, int: 120 };
  const ebolt = mage.abilities.find((s) => s.id.includes('energy_bolt') || s.kind === 'Spell')!;

  const sdi50 = computeSkillBaseOutput(
    mage,
    ebolt,
    { ...l60, spellDamageIncreasePct: 50 },
    mageStatsLowInt,
    100,
    1,
    0,
    0
  );
  const sdi90 = computeSkillBaseOutput(
    mage,
    ebolt,
    { ...l60, spellDamageIncreasePct: 90 },
    mageStatsLowInt,
    100,
    1,
    0,
    0
  );
  assert.equal(
    sdi90.rawDamagePerHit,
    sdi50.rawDamagePerHit,
    'Gear SDI above 50% must clamp to 50% (i18n-en-abilities.js:2616)'
  );

  const highIntOut = computeSkillBaseOutput(
    mage,
    ebolt,
    { ...l60, spellDamageIncreasePct: 50 },
    mageStatsHighInt,
    100,
    1,
    0,
    0
  );
  assert.ok(
    highIntOut.rawDamagePerHit > sdi50.rawDamagePerHit,
    'Higher INT must increase spell damage via both INT/100 and +1% SDI per 10 INT'
  );
});

// 7. Canonical Hunting Bot postures (`agressivo`, `equilibrado`, `defensivo`)
test('resolvePostureProfile applies canonical +20%/+40%, 1.0x/1.0x, and -40%/-20% Hunting Bot posture multipliers', () => {
  assert.equal(POSTURE_PROFILES.agressivo.outgoingDamageMultiplier, 1.2);
  assert.equal(POSTURE_PROFILES.agressivo.incomingDamageMultiplier, 1.4);
  assert.equal(POSTURE_PROFILES.equilibrado.outgoingDamageMultiplier, 1.0);
  assert.equal(POSTURE_PROFILES.equilibrado.incomingDamageMultiplier, 1.0);
  assert.equal(POSTURE_PROFILES.defensivo.outgoingDamageMultiplier, 0.6);
  assert.equal(POSTURE_PROFILES.defensivo.incomingDamageMultiplier, 0.8);

  const l60 = BRACKET_BUDGETS.L60;
  const balStats = resolveClassStatsForBracket(samurai, l60, 'equilibrado');
  const aggStats = resolveClassStatsForBracket(samurai, l60, 'agressivo');
  const defStats = resolveClassStatsForBracket(samurai, l60, 'defensivo');

  const balDmg = computeAutoAttackRawDamage(l60, balStats, 0, 0);
  const aggDmg = computeAutoAttackRawDamage(l60, aggStats, 0, 0);
  const defDmg = computeAutoAttackRawDamage(l60, defStats, 0, 0);

  assert.ok(Math.abs(aggDmg / balDmg - 1.2) < 1e-6, 'Aggressive posture must deal +20% damage');
  assert.ok(Math.abs(defDmg / balDmg - 0.6) < 1e-6, 'Defensive posture must deal -40% damage');
  assert.equal(resolvePostureProfile('Precision').bonusHciPct, 10);
});

// 8. Complete 1H (48,000), 2H (41,140), and Shield (400) CheckParry math + low-DEX penalty
test('computeParryAndAvoidanceChance models 1H (48,000), 2H (41,140), Shield (400), and Bushido shield penalty', () => {
  const l60 = { ...BRACKET_BUDGETS.L60, defenseChanceIncreasePct: 0 };
  const sam1H = { ...resolveClassStatsForBracket(samurai, l60), hasShield: false, isTwoHanded: false, dex: 95 };
  const sam2H = { ...sam1H, isTwoHanded: true };
  const samShield = { ...sam1H, hasShield: true };
  const samLowDex = { ...sam1H, dex: 50 };

  const p1H = computeParryAndAvoidanceChance(samurai, l60, sam1H, 0);
  const p2H = computeParryAndAvoidanceChance(samurai, l60, sam2H, 0);
  const pShieldBushido = computeParryAndAvoidanceChance(samurai, l60, samShield, 0);
  const pLowDex = computeParryAndAvoidanceChance(samurai, l60, samLowDex, 0);

  // At 100 Parry & 100 Bushido: 1H = 10000/48000 + 0.05 = 0.25833; 2H = 10000/41140 + 0.05 = 0.29307
  assert.ok(Math.abs(p1H - (10000 / 48000 + 0.05)) < 1e-5, '1H Bushido parry must use 48,000 divisor');
  assert.ok(Math.abs(p2H - (10000 / 41140 + 0.05)) < 1e-5, '2H Bushido parry must use 41,140 divisor');
  assert.ok(p2H > p1H, '2H No-Dachi/Lajatang parry chance must exceed 1H Katana parry chance');
  assert.ok(
    pShieldBushido < p1H,
    'Equipping a shield with Bushido must invert parry scaling ((parry - bushido) / 400)'
  );
  assert.ok(pLowDex < p1H, 'DEX < 80 must apply ModernUO low-DEX parry penalty');

  const warShield = { ...resolveClassStatsForBracket(warrior, l60), hasShield: true, isTwoHanded: false, dex: 95 };
  const pWarShield = computeParryAndAvoidanceChance(warrior, l60, warShield, 0);
  assert.ok(Math.abs(pWarShield - (100 / 400 + 0.05)) < 1e-5, 'Pure Parry with shield must use 400 divisor (30% at GM)');
});

// 9. Hotbar ro(e) auto-trigger HP thresholds and secondary-target splashRatio
test('resolveHotbarHealTriggerPct and computeSkillBaseOutput enforce ro(e) heal thresholds and splashRatio', () => {
  assert.equal(resolveHotbarHealTriggerPct('lesser_heal_potion'), 50);
  assert.equal(resolveHotbarHealTriggerPct('heal_potion'), 32);
  assert.equal(resolveHotbarHealTriggerPct('greater_heal_potion'), 18);
  assert.equal(resolveHotbarHealTriggerPct('mage_heal'), 50);
  assert.equal(resolveHotbarHealTriggerPct('mage_greater_heal'), 40);
  assert.equal(resolveHotbarHealTriggerPct('samurai_confidence'), 55);

  const confidence = samurai.abilities.find((s) => s.id === 'samurai_confidence')!;
  assert.equal(
    evaluateHotbarAutoTrigger(confidence, 60, 100, 1, [], [], 'mode_b', 0),
    false,
    'Confidence must not auto-trigger at 60% HP (> 55% threshold)'
  );
  assert.equal(
    evaluateHotbarAutoTrigger(confidence, 50, 100, 1, [], [], 'mode_b', 0),
    true,
    'Confidence must auto-trigger at 50% HP (<= 55% threshold)'
  );

  const l60 = BRACKET_BUDGETS.L60;
  const samStats = resolveClassStatsForBracket(samurai, l60);
  const whirlwind = samurai.abilities.find((s) => s.id === 'samurai_frenzied_whirlwind')!;
  const wwOut = computeSkillBaseOutput(samurai, whirlwind, l60, samStats, 100, 3, 0, 0);
  assert.equal(wwOut.targetsHit, 3);
  assert.equal(wwOut.splashRatio, 0.5, 'Frenzied Whirlwind must carry 0.5 secondary splashRatio');
});

// 10. Target resistance mitigation, 70% cap, Armor Ignore, and Armor Break / Surprise Attack shred
test('applyTargetMitigation enforces 70% resist cap, armor ignore penetration, and defense shred', () => {
  const highDef = { ...ENEMY_ARCHETYPES.high_def_boss, physResistPct: 90 };
  const mitigatedCap = applyTargetMitigation(100, highDef, false, 0, 0);
  assert.ok(Math.abs(mitigatedCap - 30) < 1e-9, '90% physical resist must clamp to 70% (leaving 30 damage)');

  const fullIgnore = applyTargetMitigation(100, ENEMY_ARCHETYPES.high_def_boss, false, 100, 0);
  assert.equal(fullIgnore, 100, '100% Armor Ignore must bypass all physical resistance');

  const halfIgnore = applyTargetMitigation(100, ENEMY_ARCHETYPES.high_def_boss, false, 50, 0);
  const noIgnore = applyTargetMitigation(100, ENEMY_ARCHETYPES.high_def_boss, false, 0, 0);
  assert.ok(halfIgnore > noIgnore, '50% Armor Ignore must deal more damage than 0%');

  const shredded = applyTargetMitigation(100, ENEMY_ARCHETYPES.high_def_boss, false, 0, -20);
  assert.ok(shredded > noIgnore, '-20% defense debuff must increase post-mitigation damage');
});

// 11. Execute threshold activation for Honorable Execution & Kensei's Judgment
test('computeSkillBaseOutput applies executeMultiplier only at or below executeThresholdHpPct', () => {
  const l60 = BRACKET_BUDGETS.L60;
  const stats = resolveClassStatsForBracket(samurai, l60);
  const kensei = samurai.abilities.find((s) => s.id === 'samurai_kensei_judgment')!;

  const aboveThresh = computeSkillBaseOutput(samurai, kensei, l60, stats, 80, 1, 0, 0);
  const belowThresh = computeSkillBaseOutput(samurai, kensei, l60, stats, 30, 1, 0, 0);
  assert.ok(
    Math.abs(belowThresh.rawDamagePerHit / aboveThresh.rawDamagePerHit - 1.95) < 1e-6,
    'Expected 1.95x execute multiplier when target HP <= 35%'
  );
});

// 12. Mode B Samurai synergies: Perfection streak, Counter/Iaido proc channel, and parry sustain
test('Samurai Mode B activates Perfection streak, Parry Riposte proc channel, and Inner Calm sustain', () => {
  const noReflectBudget = { ...BRACKET_BUDGETS.L60, reflectPhysicalPct: 0 };
  const outA = simulateScenarioDetailed(samurai, 'L60', 'high_def_boss', 'mode_a', noReflectBudget);
  const outB = simulateScenarioDetailed(samurai, 'L60', 'high_def_boss', 'mode_b', noReflectBudget);

  assert.ok(outB.telemetry.parryCount > 0, 'Samurai must register parries against high_def_boss');
  assert.ok(
    outB.breakdown.procCounterDps > 0,
    'Samurai Mode B must record positive procCounterDps from CounterAttack / Iaido Flash Riposte'
  );
  assert.equal(
    outA.breakdown.procCounterDps,
    0,
    'Samurai Mode A (with 0% ReflectPhysical) must not trigger Mode B reactive parry ripostes'
  );
  assert.ok(
    outB.telemetry.ehpPerSec >= outA.telemetry.ehpPerSec,
    'Confidence Inner Calm parry sustain must keep Mode B EHP/s >= Mode A'
  );
});

// 13. Mode B Ninja synergies: Clone interception, 5th-step Death Strike detonation, and Kitsune/Wolf Spirit Claw
test('Ninja Mode B activates Mirror Image clone interceptions, Death Strike detonation, and Spirit Claw procs', () => {
  const l25B = simulateScenarioDetailed(ninja, 'L25', 'low_def_boss', 'mode_b', undefined, 20000);
  assert.ok(
    l25B.breakdown.procCounterDps > 0,
    'Ninja L25 Mode B (with Animal Form active) must deal Spirit Claw proc damage'
  );
  assert.ok(
    l25B.breakdown.executeDps > 0,
    'Ninja L25 Mode B must record executeDps from Death Strike delayed detonations'
  );

  const l60HighDef = simulateScenarioDetailed(ninja, 'L60', 'high_def_boss', 'mode_b', undefined, 20000);
  assert.ok(
    l60HighDef.telemetry.cloneInterceptions > 0,
    'Ninja L60 Mode B must intercept incoming boss hits with shadow clones'
  );

  const l60LowDef = simulateScenarioDetailed(ninja, 'L60', 'low_def_boss', 'mode_b', undefined, 60000);
  assert.ok(
    l60LowDef.breakdown.executeDps > 0,
    'Ninja L60 Mode B must record executeDps from Twin Shadow / Death Strike detonations'
  );
  assert.ok(
    l60LowDef.timelineEvents.some((e) => e.kind === 'detonate'),
    'Ninja L60 timeline must include a delayed Detonation event'
  );
});

// 14. Material tier (+8% weapon / +12% armor per step) progression & Tokuno affix loadout curves
test('Material tiers (Iron..Valorite +8% weapon / +12% armor) and Tokuno affix loadouts scale monotonically', () => {
  assert.equal(MATERIAL_TIER_SPECS[0].weaponStepMultiplier, 1.0);
  assert.equal(MATERIAL_TIER_SPECS[8].weaponStepMultiplier, 1.64);
  assert.equal(MATERIAL_TIER_SPECS[8].armorStepMultiplier, 1.96);

  const allClasses = [warrior, mage, ranger, samurai, ninja];
  const suite = runGearAndWaveSuite(allClasses);

  assert.equal(suite.materialTierCurves.length, 5 * MATERIAL_TIER_SPECS.length);
  assert.equal(suite.affixLoadoutCurves.length, 5 * 5);

  for (const cls of allClasses) {
    const tiers = suite.materialTierCurves.filter((t) => t.classId === cls.id);
    for (let i = 1; i < tiers.length; i++) {
      assert.ok(
        tiers[i].lowDefBossDps > tiers[i - 1].lowDefBossDps,
        `${cls.id} DPS must increase from ${tiers[i - 1].tierId} to ${tiers[i].tierId}`
      );
      assert.ok(
        tiers[i].ehpPerSec > tiers[i - 1].ehpPerSec,
        `${cls.id} EHP/s must increase from ${tiers[i - 1].tierId} to ${tiers[i].tierId}`
      );
    }

    const clean = buildAffixLoadoutBudget('clean_base').budget;
    const bis = buildAffixLoadoutBudget('valorite_bis').budget;
    const cleanSim = simulateScenarioDetailed(cls, 'L60', 'low_def_boss', 'mode_b', clean);
    const bisSim = simulateScenarioDetailed(cls, 'L60', 'low_def_boss', 'mode_b', bis);
    assert.ok(
      bisSim.telemetry.sustainedDps > cleanSim.telemetry.sustainedDps * 1.4,
      `${cls.id} Valorite BiS loadout must exceed Clean Base DPS by >40%`
    );
  }
});

// 15. Multi-wave dungeon pull endurance & unified kernel invariants
test('All 5 classes survive 10 consecutive dungeon waves on the unified combat tick kernel', () => {
  const allClasses = [warrior, mage, ranger, samurai, ninja];
  for (const cls of allClasses) {
    const loadout = buildHotbarLoadout(cls, BRACKET_BUDGETS.L60);
    assert.ok(loadout.hotbar.length <= 6 && loadout.hotbar.length >= 5);
    assert.ok(cls.progression.length >= 10, 'Each class must have at least 10 progression milestones');

    const waveRun = simulateMultiWavePull(cls, 'L60', 10, 1500);
    assert.equal(waveRun.waves.length, 10, `${cls.id} must complete all 10 dungeon waves`);
    assert.ok(waveRun.minHpPct > 20, `${cls.id} must maintain >20% HP across 10 waves`);
    assert.ok(waveRun.averageWaveDps > 150, `${cls.id} must sustain >150 average wave DPS at L60`);
  }

  for (const tierSpec of MATERIAL_TIER_SPECS) {
    const b = buildMaterialTierBudget(tierSpec);
    assert.ok(b.weaponAvgDmg >= 14 && b.weaponAvgDmg <= 46);
  }
});

// 16. Weapon swing speed archetypes (2.25s fast_1h vs 2.50s balanced_1h vs 3.25s heavy_2h):
// cadence, 1,000ms floor clipping, Bushido 1H/2H parry divisor (48,000 vs 41,140), Warrior shield loss, and SpecialMove scaling
test('Weapon speed archetypes (fast_1h 2.25s, balanced_1h 2.50s, heavy_2h 3.25s) enforce cadence, floor clipping, and handedness coupling', () => {
  assert.equal(Object.keys(WEAPON_ARCHETYPE_SPECS).length, 3);

  const fastSamuraiBudget = buildWeaponArchetypeBudget('samurai', 'fast_1h').budget;
  const heavySamuraiBudget = buildWeaponArchetypeBudget('samurai', 'heavy_2h').budget;
  const fastSamuraiStats = resolveClassStatsForBracket(samurai, fastSamuraiBudget);
  const heavySamuraiStats = resolveClassStatsForBracket(samurai, heavySamuraiBudget);

  assert.equal(fastSamuraiStats.baseWeaponSpeedMs, 2250);
  assert.equal(fastSamuraiStats.isTwoHanded, false);
  assert.equal(heavySamuraiStats.baseWeaponSpeedMs, 3250);
  assert.equal(heavySamuraiStats.isTwoHanded, true);

  // Samurai 2H (41,140 divisor) yields higher Bushido parry than 1H (48,000 divisor)
  const parry1H = computeParryAndAvoidanceChance(samurai, fastSamuraiBudget, fastSamuraiStats, 0);
  const parry2H = computeParryAndAvoidanceChance(samurai, heavySamuraiBudget, heavySamuraiStats, 0);
  assert.ok(parry2H > parry1H, 'Samurai heavy_2h (41,140 divisor) must have higher parry chance than fast_1h (48,000 divisor)');

  // Warrior loses shield parry when switching from fast_1h/balanced_1h (hasShield: true) to heavy_2h (hasShield: false)
  const fastWarriorBudget = buildWeaponArchetypeBudget('warrior', 'fast_1h').budget;
  const heavyWarriorBudget = buildWeaponArchetypeBudget('warrior', 'heavy_2h').budget;
  const fastWarriorStats = resolveClassStatsForBracket(warrior, fastWarriorBudget);
  const heavyWarriorStats = resolveClassStatsForBracket(warrior, heavyWarriorBudget);
  const wParryShield = computeParryAndAvoidanceChance(warrior, fastWarriorBudget, fastWarriorStats, 0);
  const wParry2H = computeParryAndAvoidanceChance(warrior, heavyWarriorBudget, heavyWarriorStats, 0);
  assert.ok(wParryShield > wParry2H, 'Warrior 1H+Shield must have higher parry chance than 2H Halberd without shield');

  // Ninja fast_1h (2,250ms) reaches the 1,000ms hard floor at L60 and delivers significantly more swings than heavy_2h (3,250ms)
  const fastNinjaSim = simulateScenarioDetailed(ninja, 'L60', 'low_def_boss', 'mode_b', buildWeaponArchetypeBudget('ninja', 'fast_1h').budget);
  const heavyNinjaSim = simulateScenarioDetailed(ninja, 'L60', 'low_def_boss', 'mode_b', buildWeaponArchetypeBudget('ninja', 'heavy_2h').budget);
  assert.ok(
    fastNinjaSim.telemetry.totalSwings > heavyNinjaSim.telemetry.totalSwings + 10,
    'Ninja fast_1h (2.25s) must land >10 more swings in 60s than heavy_2h (3.25s)'
  );
  assert.ok(
    heavyNinjaSim.telemetry.sustainedDps > fastNinjaSim.telemetry.sustainedDps,
    'Heavy 2H (1.30x weapon damage without 1,000ms haste clipping) must scale fixed-cooldown SpecialMoves higher than clipped fast_1h'
  );
});

let passed = 0;
const failures: string[] = [];

for (const t of tests) {
  try {
    t.fn();
    passed++;
  } catch (err) {
    failures.push(`${t.name}: ${err instanceof Error ? err.message : String(err)}`);
  }
}

if (failures.length > 0) {
  process.stdout.write(`${JSON.stringify({ ok: false, passed, failed: failures.length, failures })}\n`);
  process.exit(1);
}

process.stdout.write(`${JSON.stringify({ ok: true, passed, failed: 0 })}\n`);
