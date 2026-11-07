---
phase: 14-workbench-sync-and-github-pages-redeploy
fixed_at: 2026-11-07T17:32:30Z
review_path: .planning/phases/14-workbench-sync-and-github-pages-redeploy/14-REVIEW.md
iteration: 1
findings_in_scope: 4
fixed: 4
skipped: 0
status: all_fixed
---

# Phase 14 (Milestone `v1.2`): Code Review Fix Report

**Fixed at:** 2026-11-07T17:32:30Z
**Source review:** `.planning/phases/14-workbench-sync-and-github-pages-redeploy/14-REVIEW.md`
**Iteration:** 1

**Summary:**
- Findings in scope: 4 (`2` warnings, `2` info)
- Fixed: 4
- Skipped: 0
- Verification environment: `npm run verify:all` (`7/7` verification gates PASS)

## Fixed Issues

### WR-01: Target Count Mismatch Between `archetype.targetCount` (`3`) and `spawnWave()` (`2`) in `simulateMultiWavePull`

**Files modified:** `src/sim/engine.ts`, `data/sim-baselines/gear-and-waves-v1.1.json`, `design/BALANCE_REPORT.md`
**Applied fix:** Updated `archetype.targetCount` in `simulateMultiWavePull` (`src/sim/engine.ts:1915`) from `3` to `2` to match `name: 'Elite Dungeon Pull (2 targets)'` and `spawnWave(): [singleTargetMaxHp, singleTargetMaxHp]`.

### WR-02: `ehpPerSec` Summary Multiplier in `simulateScenarioDetailed` Omits Hunting Bot Posture `incomingDamageMultiplier`

**Files modified:** `src/sim/engine.ts`
**Applied fix:** Updated `ehpMultiplier` in `simulateScenarioDetailed` (`src/sim/engine.ts:1791`) to divide by `resolvePostureProfile(stats.posture).incomingDamageMultiplier` so `stats.maxHP` and `totalHpHealedOrRegenerated` scale properly under `agressivo` (`1.40x`) and `defensivo` (`0.80x`) postures.

### IN-01: `splashRatio` Upper-Bound Check (`<= 1`) Truncates `MomentumStrike` (`1.15`) Secondary Transfer Scalar

**Files modified:** `src/sim/engine.ts`, `tools/test_sim.ts`, `data/sim-baselines/parity-5class-v0.99.0.json`, `data/sim-baselines/gear-and-waves-v1.1.json`, `design/BALANCE_REPORT.md`, `design/SAMURAI_SPEC.md`, `mechanics/topics/simulator-fidelity-audit.md`, `README.md`
**Applied fix:** Relaxed the `splashRatio` clamp in `computeSkillBaseOutput` (`src/sim/engine.ts:524`) to `configuredSplash > 0 && configuredSplash <= 1.5`, preserving `samurai_momentum_strike`'s `1.15` secondary blade transfer scalar, and added an explicit assertion in `tools/test_sim.ts`.

### IN-02: `verifyPayload` in `tools/sim_balance.ts --verify` Omits `weaponArchetypes` Count

**Files modified:** `tools/sim_balance.ts`
**Applied fix:** Added `weaponArchetypes: WEAPON_ARCHETYPE_IDS.length` (`3`) to `verifyPayload` in `tools/sim_balance.ts --verify`.
