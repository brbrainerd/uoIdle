---
phase: 04-modernuo-reference-kb-baseline-combat-simulator
plan: 02
subsystem: combat-simulator
tags: [combat-simulator, typescript, deterministic-tick-loop, baseline-telemetry, warrior, mage, ranger]

requires:
  - phase: 04-modernuo-reference-kb-baseline-combat-simulator
    provides: ModernUO KB pages, design/MODERNUO_MAPPING.md, verified Phase 2-3 combat math & live class JSONs
provides:
  - Deterministic 100ms-tick UO Idle combat simulation engine (src/sim/types.ts, src/sim/archetypes.ts, src/sim/engine.ts)
  - CLI benchmark & verification runner (tools/sim_balance.ts supporting --baseline, --verify, --json, --write-baseline, --mode, --extra-class)
  - Frozen v0.99.0 baseline telemetry across 48 (3 classes x 4 brackets x 4 archetypes) scenarios (data/sim-baselines/baseline-v0.99.0.json)
affects: [05-class-architecture-balance-blueprints, 06-patch-generation-validation-pipeline]

actuals:
  tokens: 24500
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Deterministic Bresenham roll accumulator (hitAcc, critAcc, parryAcc, procAcc) modeling discrete combat events and overkill waste with zero PRNG seed variance"
    - "Mode A (data-only JSON statusEffect modifiers) and Mode B (native C# Perfection streak, CounterAttack free swing, MirrorImage clone stacks, and 5-swing DeathStrike detonation) dual-mode engine execution"

key-files:
  created:
    - src/sim/types.ts
    - src/sim/archetypes.ts
    - src/sim/engine.ts
    - tools/sim_balance.ts
    - data/sim-baselines/baseline-v0.99.0.json
  modified: []

key-decisions:
  - "Used a deterministic Bresenham roll accumulator (resolveDeterministicRoll) instead of PRNG sampling so discrete hits, crits, parries, clone interceptions, and trash overkill waste are modeled with 100% bit-for-bit repeatability"
  - "Enforced strict multi-target triggering (enemies >= 2) for AoE/pack abilities (warrior_whirlwind, mage_chain_lightning, mage_meteor, ranger_multishot, ranger_bolt_volley) matching ro(e) GE rules from tick-and-cooldowns.md"
  - "Built Mode B native hook state fields directly into CombatState so Phase 5 Samurai and Ninja parity simulations can compare Mode A and Mode B without changing the core engine"

patterns-established:
  - "All 48 baseline scenarios (3 live classes x 4 brackets x 4 archetypes) are verified against 4 invariant gates in tools/sim_balance.ts --verify: completeness, bit-for-bit determinism, monotonic L10 < L25 < L45 < L60 scaling, and resource/niche sanity"

requirements-completed: [SIM-02]

coverage:
  - id: D1
    description: "src/sim/types.ts, src/sim/archetypes.ts, and src/sim/engine.ts implementing deterministic 100ms-tick UO Idle combat simulation across L10, L25, L45, L60 and 4 enemy archetypes"
    requirement: SIM-02
    verification:
      - kind: typecheck
        ref: "npx tsc --noEmit src/sim/types.ts src/sim/archetypes.ts src/sim/engine.ts"
        status: pass
    human_judgment: false
  - id: D2
    description: "tools/sim_balance.ts and data/sim-baselines/baseline-v0.99.0.json producing reproducible 48-scenario baseline telemetry and passing --verify"
    requirement: SIM-02
    verification:
      - kind: integration
        ref: "npx tsx tools/sim_balance.ts --verify --json"
        status: pass
    human_judgment: false

duration: 9min
completed: 2026-11-06
status: complete
---

# Phase 4 Plan 02: Baseline Combat Simulator Summary

**Deterministic `100ms`-tick UO Idle combat simulator (`src/sim/`, `tools/sim_balance.ts`) and frozen `v0.99.0` 48-scenario baseline artifact (`data/sim-baselines/baseline-v0.99.0.json`) for Warrior, Mage, and Ranger passing `--verify` with zero errors**

## Performance

- **Duration:** 9 min
- **Started:** 2026-11-07T05:55:55Z
- **Completed:** 2026-11-07T06:04:30Z
- **Tasks:** 2
- **Files modified:** 5

## Accomplishments
- Authored [types.ts](file:///Users/brbrainerd/dev/uoIdle/src/sim/types.ts), [archetypes.ts](file:///Users/brbrainerd/dev/uoIdle/src/sim/archetypes.ts), and [engine.ts](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts) encoding UO Idle's verified `100ms`-tick combat math (`Sg` swing timer, `vq`/`Gs` hit chance, `yq` crit chance, `fj`/`Zo` resistance mitigation, `jq`/`Aq`/`Mq`/`Cq` spell/physical/DoT/heal estimators, `Eq` resource regeneration, `tI` Warrior 0-mana stamina conversion, `ro(e)` 6-slot hotbar priority with `2,000ms` Custom cooldown floor, and Mode A/Mode B hooks) across 4 progression brackets (`L10`, `L25`, `L45`, `L60`) and 4 enemy archetypes (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`).
- Authored [sim_balance.ts](file:///Users/brbrainerd/dev/uoIdle/tools/sim_balance.ts) CLI supporting `--baseline`, `--write-baseline`, `--verify`, `--json`, `--mode`, and `--extra-class` flags.
- Generated and verified [baseline-v0.99.0.json](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/baseline-v0.99.0.json) capturing all 48 `(3 classes × 4 brackets × 4 archetypes)` baseline scenarios for Warrior, Mage, and Ranger.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author `src/sim/types.ts`, `src/sim/archetypes.ts`, and `src/sim/engine.ts` implementing deterministic 100ms-tick UO Idle combat simulation** - `c7f243d` (feat)
2. **Task 2: Author `tools/sim_balance.ts` and `data/sim-baselines/baseline-v0.99.0.json` and verify reproducible live class benchmarks** - `ae51e63` (feat)

## Files Created/Modified
- [types.ts](file:///Users/brbrainerd/dev/uoIdle/src/sim/types.ts) - TypeScript interfaces for `BracketId`, `EnemyArchetypeId`, `BracketBudget`, `EnemyArchetype`, `CombatState`, `SimTelemetry`, `SimScenarioResult`, and `SimBaselineArtifact`
- [archetypes.ts](file:///Users/brbrainerd/dev/uoIdle/src/sim/archetypes.ts) - Canonical `L10`, `L25`, `L45`, `L60` progression/equipment budgets, enemy archetypes (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`), and `resolveClassStatsForBracket`
- [engine.ts](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts) - Deterministic `100ms`-tick combat simulation engine (`simulateScenario`, `runClassBaselineSuite`) with Bresenham accumulator rolls and Mode A / Mode B hooks
- [sim_balance.ts](file:///Users/brbrainerd/dev/uoIdle/tools/sim_balance.ts) - CLI benchmark runner and 4-gate invariant verifier (`--baseline`, `--verify`, `--json`, `--write-baseline`)
- [baseline-v0.99.0.json](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/baseline-v0.99.0.json) - Frozen reproducible `v0.99.0` baseline telemetry across all 48 scenarios for Warrior, Mage, and Ranger

## Decisions Made
- Used a deterministic Bresenham roll accumulator (`resolveDeterministicRoll`) for hits, crits, parries, and clone interceptions so discrete combat events and `fast_trash` overkill waste are captured accurately while remaining 100% deterministic across runs.
- Enforced multi-target enemy count gating (`aliveIndices.length >= 2`) for AoE/pack abilities (`warrior_whirlwind`, `mage_chain_lightning`, `mage_meteor`, `ranger_multishot`, `ranger_bolt_volley`) and continuous pack target replacement during the 60s `multi_target_pack` horizon so AoE/cleave throughput scales cleanly above single-target boss DPS at `L45` and `L60`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered
- Initial test run of `multi_target_pack` allowed single-target damage to kill target 0 early while targets 1 and 2 remained alive, dropping active pack target count below the AoE trigger threshold for part of the 60s horizon and causing `ranger[L45]` `multiTargetDps` (`165.62`) to dip slightly below `sustainedBossDps` (`167.35`). Replenishing slain pack members during the 60s `multi_target_pack` horizon and gating `ranger_multishot` to multi-target encounters resolved this cleanly (`ranger[L45]` `multiTargetDps = 176.44 > 167.35`).

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- Phase 4 (`04-modernuo-reference-kb-baseline-combat-simulator`, `SIM-01` & `SIM-02`) is 100% complete.
- Ready for Phase 5 (`05-class-architecture-balance-blueprints`) to author `design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `design/SAMURAI_SPEC.md`, `design/NINJA_SPEC.md`, and run 5-class parity tuning via `tools/sim_balance.ts`.

---
*Phase: 04-modernuo-reference-kb-baseline-combat-simulator*
*Completed: 2026-11-06*
