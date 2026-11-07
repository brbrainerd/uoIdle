# Phase 13-01 Summary: Unified Tick Kernel Refactor & Recalibrated 5-Class Parity

## Completed Deliverables

1. **Unified Single-Wave & Multi-Wave Tick Kernel (`SIM-08`)**
   - Extracted [`createUnifiedKernelContext`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L698-L809), [`stepKernelTimersAndSustain`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L851-L934), and [`stepKernelCombatActions`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L940-L1433) in [`src/sim/engine.ts`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts).
   - Refactored both [`simulateScenarioDetailed`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L1445-L1579) and [`simulateMultiWavePull`](file:///Users/brbrainerd/dev/uoIdle/src/sim/engine.ts#L1648-L1767) to execute on the exact same combat tick kernel, eliminating duplicated combat loop logic.

2. **Recalibrated 3-Class Baseline & 5-Class Parity (`SIM-09`)**
   - Tuned Samurai (`samurai_lightning` `1.15x–1.25x`, `samurai_perfection` Mode A `+14%`, `samurai_counter` `1.55x–1.65x`) and Ninja (`ninja_twin_shadow` `1.15x–1.25x` base / `1.85x` execute, `12,000ms` CD) across [`design/drop-in/samurai.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/samurai.json), [`design/drop-in/ninja.json`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/ninja.json), and [`design/drop-in/classes-patch.js`](file:///Users/brbrainerd/dev/uoIdle/design/drop-in/classes-patch.js).
   - Regenerated [`data/sim-baselines/baseline-v0.99.0.json`](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/baseline-v0.99.0.json), [`data/sim-baselines/parity-5class-v0.99.0.json`](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/parity-5class-v0.99.0.json), and [`data/sim-baselines/gear-and-waves-v1.1.json`](file:///Users/brbrainerd/dev/uoIdle/data/sim-baselines/gear-and-waves-v1.1.json).
   - Expanded [`tools/test_sim.ts`](file:///Users/brbrainerd/dev/uoIdle/tools/test_sim.ts) from 11 to 15 unit tests (`{"ok":true,"passed":15,"failed":0}`) and verified `npx tsx tools/sim_balance.ts --verify` (`{"ok":true,"scenarios":80,"baselineScenarios":48}`).
