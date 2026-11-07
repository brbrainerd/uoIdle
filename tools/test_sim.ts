import * as assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { ClassSchema, type ClassDefinition } from '../src/schemas/skill.schema.js';
import {
  BRACKET_BUDGETS,
  ENEMY_ARCHETYPES,
  MATERIAL_TIER_SPECS,
  buildAffixLoadoutBudget,
  buildMaterialTierBudget,
  resolveClassStatsForBracket,
} from '../src/sim/archetypes.js';
import {
  applyTargetMitigation,
  buildHotbarLoadout,
  computeCritChance,
  computeHitChance,
  computeSkillBaseOutput,
  computeSwingIntervalMs,
  resolveDeterministicRoll,
  resolveEffectiveCooldownMs,
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

// 3. Zero-mana physical conversion on Warrior vs hybrid Mana+Stamina on Samurai/Ninja
test('resolveSkillResourceCost enforces Warrior 0-mana invariant and preserves Samurai/Ninja hybrid costs', () => {
  const warriorSkill = warrior.abilities.find((s) => s.kind !== 'Passive')!;
  const wCost = resolveSkillResourceCost(warrior, warriorSkill);
  assert.equal(wCost.manaCost, 0, 'Warrior active skills must cost 0 mana at runtime');
  assert.ok(wCost.staminaCost > 0, 'Warrior active skills must convert cost to stamina');

  const confidence = samurai.abilities.find((s) => s.id === 'samurai_confidence')!;
  const sCost = resolveSkillResourceCost(samurai, confidence);
  assert.ok(sCost.manaCost > 0, 'Samurai Confidence uses Mana');

  const animalForm = ninja.abilities.find((s) => s.id === 'ninja_animal_form')!;
  const nCost = resolveSkillResourceCost(ninja, animalForm);
  assert.ok(nCost.manaCost > 0, 'Ninja Animal Form uses Mana');
});

// 4. Weapon swing speed 1,000ms hard floor
test('computeSwingIntervalMs enforces 1,000ms hard minimum swing interval', () => {
  const l60 = BRACKET_BUDGETS.L60;
  const normalSwing = computeSwingIntervalMs(l60, 50, 0);
  assert.ok(normalSwing > 1000 && normalSwing <= 2500);
  const hyperSwing = computeSwingIntervalMs(l60, 500, 300);
  assert.equal(hyperSwing, 1000, 'Swing interval must never drop below 1,000ms');
});

// 5. Hit chance & crit chance caps
test('computeHitChance and computeCritChance respect 5%..95% and 50% caps', () => {
  const l60 = BRACKET_BUDGETS.L60;
  const stats = resolveClassStatsForBracket(samurai, l60);
  const boss = ENEMY_ARCHETYPES.high_def_boss;
  assert.equal(computeHitChance(l60, stats, boss, true, 0), 0.95, 'Spells have 95% hit cap');
  assert.equal(computeHitChance(l60, stats, boss, false, 500), 0.95, 'Physical hit capped at 95%');
  assert.equal(computeCritChance(l60, stats, 200), 0.5, 'Crit chance capped at 50%');
});

// 6. Target resistance mitigation, 70% cap, Armor Ignore, and Armor Break / Surprise Attack shred
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

// 7. Execute threshold activation for Honorable Execution & Kensei's Judgment
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

// 8. Mode B Samurai synergies: Perfection streak, Counter/Iaido proc channel, and parry sustain
test('Samurai Mode B activates Perfection streak, Parry Riposte proc channel, and Inner Calm sustain', () => {
  const outA = simulateScenarioDetailed(samurai, 'L60', 'high_def_boss', 'mode_a');
  const outB = simulateScenarioDetailed(samurai, 'L60', 'high_def_boss', 'mode_b');

  assert.ok(outB.telemetry.parryCount > 0, 'Samurai must register parries against high_def_boss');
  assert.ok(
    outB.breakdown.procCounterDps > 0,
    'Samurai Mode B must record positive procCounterDps from CounterAttack / Iaido Flash Riposte'
  );
  assert.equal(
    outA.breakdown.procCounterDps,
    0,
    'Samurai Mode A must not trigger Mode B reactive parry ripostes'
  );
  assert.ok(
    outB.telemetry.ehpPerSec >= outA.telemetry.ehpPerSec,
    'Confidence Inner Calm parry sustain must keep Mode B EHP/s >= Mode A'
  );
});

// 9. Mode B Ninja synergies: Clone interception, 5th-step Death Strike detonation, and Kitsune/Wolf Spirit Claw
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

// 10. Material tier progression & Tokuno affix loadout curves
test('Material tiers (Iron..Valorite) and Tokuno affix loadouts scale monotonically across all 5 classes', () => {
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

// 11. Multi-wave dungeon pull endurance & hotbar priority invariants
test('All 5 classes survive 10 consecutive dungeon waves and build valid 6-slot hotbars', () => {
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
