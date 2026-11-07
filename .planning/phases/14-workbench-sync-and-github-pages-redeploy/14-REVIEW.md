---
phase: 14-workbench-sync-and-github-pages-redeploy
reviewed: 2026-11-07T17:28:30Z
depth: standard
files_reviewed: 13
files_reviewed_list:
  - src/sim/engine.ts
  - src/sim/archetypes.ts
  - src/sim/types.ts
  - tools/sim_balance.ts
  - tools/test_sim.ts
  - design/drop-in/classes-patch.js
  - design/drop-in/samurai.json
  - design/drop-in/ninja.json
  - design/BALANCE_REPORT.md
  - design/SAMURAI_SPEC.md
  - design/NINJA_SPEC.md
  - README.md
  - package.json
critical: 0
warning: 2
info: 2
total: 4
findings:
  critical: 0
  warning: 2
  info: 2
  total: 4
status: issues_found
---

# Phase 14 (Milestone `v1.2`): Code Review Report

**Reviewed:** 2026-11-07T17:28:30Z
**Depth:** standard
**Files Reviewed:** 13
**Status:** issues_found

## Summary

Reviewed all 13 core simulator, schema, drop-in specification, CLI runner, unit test, and documentation files modified across Milestone `v1.2` (`Phases 11–14`). The unified combat tick kernel (`createUnifiedKernelContext`, `stepKernelTimersAndSustain`, `stepKernelCombatActions`), live `v0.99.0` attribute/affix caps, `[huntpostura` postures, `+8%/+12%` material ladder, `ro(e)` hotbar auto-triggers, `1H/2H/Shield` `CheckParry` math, and `2.25s/2.50s/3.25s` weapon speed archetypes are clean, deterministic, and well-tested.

Zero critical issues were found. Two warnings and two informational findings were identified:

## Warnings

### WR-01: Target Count Mismatch Between `archetype.targetCount` (`3`) and `spawnWave()` (`2`) in `simulateMultiWavePull`

**File:** `src/sim/engine.ts:1914-1932`
**Issue:** In `simulateMultiWavePull`, `archetype.name` is `'Elite Dungeon Pull (2 targets)'` and `spawnWave()` returns `[singleTargetMaxHp, singleTargetMaxHp]` (`2` targets), but `archetype.targetCount` is set to `3`. Because `evaluateHotbarAutoTrigger` (`src/sim/engine.ts:212`) checks `const requiredTargets = archetype.targetCount >= 3 ? 3 : 2; return aliveEnemyCount >= requiredTargets;`, `aliveEnemyCount` (`<= 2`) never reaches `3`, preventing `GE` AoE skills (`warrior_whirlwind`, `samurai_frenzied_whirlwind`) from auto-triggering during 2-target wave pulls.
**Fix:** Set `targetCount: 2` on the `simulateMultiWavePull` archetype so `archetype.targetCount` matches `spawnWave().length`.

### WR-02: `ehpPerSec` Summary Multiplier in `simulateScenarioDetailed` Omits Hunting Bot Posture `incomingDamageMultiplier`

**File:** `src/sim/engine.ts:1783-1797`
**Issue:** While the tick-by-tick incoming damage step (`src/sim/engine.ts:1651`) multiplies incoming enemy hits by `postureProfile.incomingDamageMultiplier` (`1.40x` for `agressivo`, `1.00x` for `equilibrado`, `0.80x` for `defensivo`), the summary `ehpMultiplier` (`1 / (1 - avgResistFraction)`) applied to `stats.maxHP` and `ctx.totalHpHealedOrRegenerated` at the end of `simulateScenarioDetailed` does not divide by `postureProfile.incomingDamageMultiplier`. When simulating non-default postures (`agressivo` or `defensivo`), effective HP pool and heal value scaling are not adjusted by the posture's incoming damage multiplier.
**Fix:** Divide `ehpMultiplier` by `resolvePostureProfile(stats.posture).incomingDamageMultiplier` and add a unit assertion in `tools/test_sim.ts` verifying that `defensivo` posture increases `ehpPerSec` relative to `agressivo`.

## Info

### IN-01: `splashRatio` Upper-Bound Check (`<= 1`) Truncates `MomentumStrike` (`1.15`) Secondary Transfer Scalar

**File:** `src/sim/engine.ts:522-525`
**Issue:** `computeSkillBaseOutput` checks `configuredSplash > 0 && configuredSplash <= 1 ? configuredSplash : 1.0`. However, `samurai_momentum_strike` (`design/drop-in/samurai.json`) specifies `splashRatio: 1.15` (`115%` secondary blade momentum transfer per `MomentumStrike.cs`). Clamping at `<= 1` forces `1.15` back to `1.0`.
**Fix:** Allow `configuredSplash > 0 && configuredSplash <= 1.5` in `computeSkillBaseOutput` so `samurai_momentum_strike` preserves its `1.15` secondary transfer scalar.

### IN-02: `verifyPayload` in `tools/sim_balance.ts --verify` Omits `weaponArchetypes` Count

**File:** `tools/sim_balance.ts:541-556`
**Issue:** `tools/sim_balance.ts --verify` validates `gearWaves1.weaponArchetypeCurves` (`WEAPON_ARCHETYPE_IDS.length === 3` per class), but `verifyPayload` omits `weaponArchetypes: WEAPON_ARCHETYPE_IDS.length`.
**Fix:** Include `weaponArchetypes: WEAPON_ARCHETYPE_IDS.length` in `verifyPayload`.
