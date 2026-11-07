---
phase: 04-modernuo-reference-kb-baseline-combat-simulator
verified: 2026-11-07T06:07:30Z
status: passed
score: 7/7 must-haves verified
covered_files:
  - ".planning/phases/04-modernuo-reference-kb-baseline-combat-simulator/04-01-PLAN.md"
  - ".planning/phases/04-modernuo-reference-kb-baseline-combat-simulator/04-01-SUMMARY.md"
  - ".planning/phases/04-modernuo-reference-kb-baseline-combat-simulator/04-02-PLAN.md"
  - ".planning/phases/04-modernuo-reference-kb-baseline-combat-simulator/04-02-SUMMARY.md"
  - "data/sim-baselines/baseline-v0.99.0.json"
  - "design/MODERNUO_MAPPING.md"
  - "mechanics/INDEX.md"
  - "mechanics/classes/modernuo-bushido.md"
  - "mechanics/classes/modernuo-ninjitsu.md"
  - "mechanics/modernuo/bushido-confidence.md"
  - "mechanics/modernuo/bushido-counter-attack.md"
  - "mechanics/modernuo/bushido-evasion.md"
  - "mechanics/modernuo/bushido-honorable-execution.md"
  - "mechanics/modernuo/bushido-lightning-strike.md"
  - "mechanics/modernuo/bushido-momentum-strike.md"
  - "mechanics/modernuo/bushido-perfection-honor.md"
  - "mechanics/modernuo/ninjitsu-animal-form.md"
  - "mechanics/modernuo/ninjitsu-backstab.md"
  - "mechanics/modernuo/ninjitsu-death-strike.md"
  - "mechanics/modernuo/ninjitsu-focus-attack.md"
  - "mechanics/modernuo/ninjitsu-items.md"
  - "mechanics/modernuo/ninjitsu-ki-attack.md"
  - "mechanics/modernuo/ninjitsu-mirror-image.md"
  - "mechanics/modernuo/ninjitsu-shadowjump.md"
  - "mechanics/modernuo/ninjitsu-stealth-hiding.md"
  - "mechanics/modernuo/ninjitsu-surprise-attack.md"
  - "src/sim/archetypes.ts"
  - "src/sim/engine.ts"
  - "src/sim/types.ts"
  - "tools/sim_balance.ts"
covered_digest: "v1:sha256:8a6321567748a00d4bf269ad5e78f7dffed4efbc23118013b23a028ab397af0f"
behavior_unverified: 0
overrides_applied: 0
decision_coverage:
  honored: 0
  total: 0
  not_honored: []
---

# Phase 4: ModernUO Reference KB & Baseline Combat Simulator Verification Report

**Phase Goal:** Document canonical ModernUO Bushido and Ninjitsu C# mechanics in claim-verified KB pages, map all 17 abilities to automated idle state-machine primitives, and build a deterministic tick-accurate combat simulator reproducing Warrior, Mage, and Ranger baseline curves.
**Verified:** 2026-11-07T06:07:30Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Observable Truths

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | **Roadmap SC-1 / Plan 04-01 T2:** Developer can read `mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md` alongside `design/MODERNUO_MAPPING.md` to trace all 8 Bushido mechanics (*Weapon Parry*, *Perfection & Honor*, *Honorable Execution*, *Confidence*, *Counter Attack*, *Lightning Strike*, *Evasion*, *Momentum Strike*) and 9 Ninjitsu mechanics (*Mirror Image*, *Focus Attack*, *Backstab*, *Smoke Bomb & Stealth*, *Shadowjump*, *Surprise Attack*, *Ki Attack*, *Death Strike*, *Animal Form*) from verbatim ModernUO C# formulas to idle-compatible state machines. | ✓ VERIFIED | `mechanics/classes/modernuo-bushido.md` (`sources[0]: _raw/modernuo/BaseWeapon.cs`, `C1..C13`) and `mechanics/classes/modernuo-ninjitsu.md` (`sources[0]: _raw/modernuo/NinjaSpell.cs`, `C1..C5`) synthesize all 8 Bushido mechanics, 9 Ninjitsu mechanics, and Tokuno Ninjitsu items with cross-page `[[bushido-*]] C<n>` and `[[ninjitsu-*]] C<n>` citations; `design/MODERNUO_MAPPING.md` maps all 17 mechanics + 4 Tokuno items into Mode A and Mode B UO Idle state machines. |
| 2 | **Roadmap SC-2 / Plan 04-02 T2:** Developer can run `npx tsx tools/sim_balance.ts` (`--baseline` / `--json`) to deterministically simulate live Warrior, Mage, and Ranger combat loops across Early (`L10`), Mid (`L25`), Late (`L45`), and Endgame (`L60`) level brackets against both fast trash waves and sustained boss archetypes (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`). | ✓ VERIFIED | `npx tsx tools/sim_balance.ts --baseline` and `npx tsx tools/sim_balance.ts --verify --json` execute all `48` (`3 classes × 4 brackets × 4 archetypes`) scenarios and output structured Markdown and JSON telemetry. |
| 3 | **Roadmap SC-3 / Plan 04-02 T3:** Baseline simulator outputs match the verified UO Idle combat math from Phases 2–3 and produce reproducible reference benchmarks for Sustained Boss DPS, Trash TTK (with overkill waste), Net Resource Delta/min, and Effective HP (`EHP/sec`), passing `npx tsx tools/sim_balance.ts --verify` with `{"ok":true}`. | ✓ VERIFIED | `npx tsx tools/sim_balance.ts --verify --json` exits `0` with `{"ok":true,"version":"0.99.0","tickMs":100,"classes":["warrior","mage","ranger"],"brackets":["L10","L25","L45","L60"],"archetypes":["fast_trash","low_def_boss","high_def_boss","multi_target_pack"],"scenarios":48,"baselineArtifact":"data/sim-baselines/baseline-v0.99.0.json"}`. |
| 4 | **Plan 04-01 T1:** Developer can inspect 17 atomic KB pages under `mechanics/modernuo/` (7 Bushido pages and 10 Ninjitsu pages) where each page binds its canonical ModernUO C# source file in `sources[0]` and proves its formulas via verbatim `[modernuo-stated]` `(raw L<a>-L<b>)` claims. | ✓ VERIFIED | All 17 files under `mechanics/modernuo/*.md` exist, bind their primary ModernUO `.cs` file in `sources[0]`, contain digit-free `## Summary` sections, and pass verbatim line-span verification in `kb.py check --root mechanics`. |
| 5 | **Plan 04-01 T3:** Running `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` exits `0` with `ok: true`, `pages == 31`, and `errors == []`. | ✓ VERIFIED | Executed `kb.py --self-test` (`{"ok": true, "mutations": 28, "caught": 28, "missed": [], "cases": 4, "failedCases": []}`) and `kb.py check --root mechanics` (`{"ok": true, "pages": 31, "errors": []}`). |
| 6 | **Plan 04-01 T4:** Developer can read `design/MODERNUO_MAPPING.md` to inspect the side-by-side derivation table mapping all 8 Bushido mechanics, 9 Ninjitsu mechanics, and 4 Tokuno Ninjitsu items across Mode A (`100%` existing engine opcodes) and Mode B (`<20 LOC` native server C# hook spec), reconciling the 12 pre-existing `samurai_*`/`ninja_*` entries in `abilities-catalog.json` with the 12-milestone `gE` L1–60 progression curve. | ✓ VERIFIED | `design/MODERNUO_MAPPING.md` (`251` lines) contains Sections 1–5 covering the 2D-to-1D paradigm translation, the 12 pre-existing `abilities-catalog.json` entries, the 8 Bushido & 9 Ninjitsu + 4 Tokuno item adaptation matrices, `<20 LOC` C# hooks (`Hooks 1A, 1B, 2A, 2B`), and the L1–60 `gE` progression tables. |
| 7 | **Plan 04-02 T1:** Developer can inspect `src/sim/types.ts`, `src/sim/archetypes.ts`, and `src/sim/engine.ts` implementing UO Idle's verified `100ms`-tick combat math (`Sg`, `vq`/`Gs`, `yq`, `fj`/`Zo`, `jq`/`Mq`/`wq`, `Eq`, `tI`, `ro(e)` with `2,000ms` `Custom` cooldown floor, and Mode A/Mode B hooks) and compiling cleanly under `npx tsc --noEmit`. | ✓ VERIFIED | `src/sim/types.ts` (`166` lines), `src/sim/archetypes.ts` (`241` lines), and `src/sim/engine.ts` (`1,327` lines) implement all required combat formulas and pass `npx tsc --noEmit` with zero errors. |

**Score:** 7/7 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `mechanics/modernuo/bushido-perfection-honor.md` | Atomic KB page for `HonorContext.cs` | ✓ VERIFIED | 5 verbatim `[modernuo-stated]` claims (`C1..C5`) against `_raw/modernuo/HonorContext.cs` |
| `mechanics/modernuo/bushido-honorable-execution.md` | Atomic KB page for `HonorableExecution.cs`, `SamuraiMove.cs`, `SpecialMove.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/HonorableExecution.cs` |
| `mechanics/modernuo/bushido-confidence.md` | Atomic KB page for `Confidence.cs` | ✓ VERIFIED | 3 verbatim `[modernuo-stated]` claims (`C1..C3`) against `_raw/modernuo/Confidence.cs` |
| `mechanics/modernuo/bushido-counter-attack.md` | Atomic KB page for `CounterAttack.cs` | ✓ VERIFIED | 3 verbatim `[modernuo-stated]` claims (`C1..C3`) against `_raw/modernuo/CounterAttack.cs` |
| `mechanics/modernuo/bushido-lightning-strike.md` | Atomic KB page for `LightningStrike.cs` | ✓ VERIFIED | 3 verbatim `[modernuo-stated]` claims (`C1..C3`) against `_raw/modernuo/LightningStrike.cs` |
| `mechanics/modernuo/bushido-evasion.md` | Atomic KB page for `Evasion.cs`, `SamuraiSpell.cs`, `BookOfBushido.cs` | ✓ VERIFIED | 5 verbatim `[modernuo-stated]` claims (`C1..C5`) against `_raw/modernuo/Evasion.cs` |
| `mechanics/modernuo/bushido-momentum-strike.md` | Atomic KB page for `MomentumStrike.cs` | ✓ VERIFIED | 3 verbatim `[modernuo-stated]` claims (`C1..C3`) against `_raw/modernuo/MomentumStrike.cs` |
| `mechanics/modernuo/ninjitsu-mirror-image.md` | Atomic KB page for `MirrorImage.cs`, `BookOfNinjitsu.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/MirrorImage.cs` |
| `mechanics/modernuo/ninjitsu-focus-attack.md` | Atomic KB page for `FocusAttack.cs`, `NinjaMove.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/FocusAttack.cs` |
| `mechanics/modernuo/ninjitsu-backstab.md` | Atomic KB page for `Backstab.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/Backstab.cs` |
| `mechanics/modernuo/ninjitsu-stealth-hiding.md` | Atomic KB page for `SmokeBomb.cs`, `EggBomb.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/SmokeBomb.cs` |
| `mechanics/modernuo/ninjitsu-shadowjump.md` | Atomic KB page for `ShadowJump.cs` | ✓ VERIFIED | 3 verbatim `[modernuo-stated]` claims (`C1..C3`) against `_raw/modernuo/ShadowJump.cs` |
| `mechanics/modernuo/ninjitsu-surprise-attack.md` | Atomic KB page for `SurpriseAttack.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/SurpriseAttack.cs` |
| `mechanics/modernuo/ninjitsu-ki-attack.md` | Atomic KB page for `KiAttack.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/KiAttack.cs` |
| `mechanics/modernuo/ninjitsu-death-strike.md` | Atomic KB page for `DeathStrike.cs` | ✓ VERIFIED | 5 verbatim `[modernuo-stated]` claims (`C1..C5`) against `_raw/modernuo/DeathStrike.cs` |
| `mechanics/modernuo/ninjitsu-animal-form.md` | Atomic KB page for `AnimalForm.cs`, `AnimalFormTests.cs` | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/AnimalForm.cs` |
| `mechanics/modernuo/ninjitsu-items.md` | Atomic KB page for `NinjaWeapons.cs`, `Fukiya.cs`, `LeatherNinjaBelt.cs`, `Shuriken.cs`, SE weapons | ✓ VERIFIED | 4 verbatim `[modernuo-stated]` claims (`C1..C4`) against `_raw/modernuo/NinjaWeapons.cs` + full SE weapon & armor tables |
| `mechanics/classes/modernuo-bushido.md` | Master Bushido reference KB page anchored on `BaseWeapon.cs` | ✓ VERIFIED | 13 verbatim `[modernuo-stated]` claims (`C1..C13`) + 8-mechanic synthesis matrix |
| `mechanics/classes/modernuo-ninjitsu.md` | Master Ninjitsu reference KB page anchored on `NinjaSpell.cs` | ✓ VERIFIED | 5 verbatim `[modernuo-stated]` claims (`C1..C5`) + 9-mechanic & Tokuno item synthesis matrix |
| `mechanics/INDEX.md` | Regenerated KB index with 31 pages | ✓ VERIFIED | `Pages: 31 (classes 5, combat 4, systems 2, topics 3, entities 0, modernuo 17)` |
| `design/MODERNUO_MAPPING.md` | Side-by-side Mode A / Mode B state-machine adaptation matrix | ✓ VERIFIED | Maps all 8 Bushido mechanics, 9 Ninjitsu mechanics, 4 Tokuno items, and 12 catalog entries |
| `src/sim/types.ts` | TypeScript interfaces for brackets, archetypes, state, and telemetry | ✓ VERIFIED | Exports `BracketId`, `EnemyArchetypeId`, `CombatState`, `SimTelemetry`, `SimBaselineArtifact` |
| `src/sim/archetypes.ts` | Canonical `L10..L60` budgets and 4 enemy archetypes | ✓ VERIFIED | Exports `BRACKET_BUDGETS`, `ENEMY_ARCHETYPES`, `resolveClassStatsForBracket` |
| `src/sim/engine.ts` | Deterministic `100ms`-tick combat simulator | ✓ VERIFIED | Exports `simulateScenario`, `runClassBaselineSuite`, Bresenham roll accumulator, Mode A/B hooks |
| `tools/sim_balance.ts` | Executable CLI simulator (`--baseline`, `--verify`, `--json`) | ✓ VERIFIED | Loads `data/live-classes/*.json`, runs 48 scenarios, enforces 4 verification gates |
| `data/sim-baselines/baseline-v0.99.0.json` | Frozen reproducible `v0.99.0` baseline benchmark telemetry | ✓ VERIFIED | 1,130 lines containing 48 scenario entries and 12 class-bracket summary rows |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `mechanics/classes/modernuo-bushido.md` | `mechanics/modernuo/bushido-*.md` | Cross-page claim citations `[[bushido-*]] C<n>` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check --root mechanics` |
| `mechanics/classes/modernuo-ninjitsu.md` | `mechanics/modernuo/ninjitsu-*.md` & `mechanics/classes/modernuo-bushido.md` | Cross-page claim citations `[[ninjitsu-*]] C<n>` and `[[modernuo-bushido]] C<n>` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `kb.py check --root mechanics` |
| `design/MODERNUO_MAPPING.md` | `mechanics/classes/modernuo-{bushido,ninjitsu}.md` & `mechanics/topics/*.md` | Mode A opcodes and Mode B `<20 LOC` C# hook specifications | ✓ WIRED | Verified by `gsd-tools query verify.key-links` |
| `src/sim/engine.ts` | `src/schemas/skill.schema.ts` & `data/live-classes/{warrior,mage,ranger}.json` | Consumes validated `ClassDefinition` and `SkillDefinition` payloads | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `npx tsc --noEmit` |
| `tools/sim_balance.ts` | `src/sim/{types,archetypes,engine}.ts` & `data/sim-baselines/baseline-v0.99.0.json` | Runs 48 scenarios and cross-verifies against `baseline-v0.99.0.json` | ✓ WIRED | Verified by `npx tsx tools/sim_balance.ts --verify --json` |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `mechanics/modernuo/*.md` & `mechanics/classes/modernuo-*.md` | `## Claims` (`C1..Cn`) | `mechanics/_raw/modernuo/*.cs` (`sources[0]`) | Yes — verbatim C# quotes verified line-by-line by `kb.py check` | ✓ FLOWING |
| `tools/sim_balance.ts` → `src/sim/engine.ts` | `run1.scenarios` (`48` `SimTelemetry` objects) | `data/live-classes/{warrior,mage,ranger}.json` validated via `ClassSchema` | Yes — executes 600-tick (`60,000ms`) `100ms` state-machine loops per scenario | ✓ FLOWING |
| `data/sim-baselines/baseline-v0.99.0.json` | `scenarios` & `summaryByClassBracket` | `runClassBaselineSuite(classes, 'mode_a')` | Yes — bit-for-bit verified against live recalculation in `--verify` | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `kb.py` mutation self-test catches all 28 synthetic violations | `python3 mechanics/tools/kb.py --self-test` | `{"ok": true, "mutations": 28, "caught": 28, "missed": [], "cases": 4, "failedCases": []}` | ✓ PASS |
| All 31 KB pages pass frontmatter, quote-span, summary, and secret checks | `python3 mechanics/tools/kb.py check --root mechanics` | `{"ok": true, "pages": 31, "errors": []}` | ✓ PASS |
| Baseline simulator verifies all 48 live-class scenarios & 4 invariant gates | `npx tsx tools/sim_balance.ts --verify --json` | `{"ok":true,"version":"0.99.0","tickMs":100,"classes":["warrior","mage","ranger"],"brackets":["L10","L25","L45","L60"],"archetypes":["fast_trash","low_def_boss","high_def_boss","multi_target_pack"],"scenarios":48,"baselineArtifact":"data/sim-baselines/baseline-v0.99.0.json"}` | ✓ PASS |
| Phase 3 schema validator remains green with zero regressions | `npx tsx tools/validate_skills.ts --verify` | `{"ok":true,"classes":3,"catalogAbilities":134}` | ✓ PASS |
| TypeScript compiler validates all Phase 4 simulator modules | `npx tsc --noEmit src/sim/types.ts src/sim/archetypes.ts src/sim/engine.ts tools/sim_balance.ts` | Exit 0 (0 errors) | ✓ PASS |

### Probe Execution

No shell probes (`scripts/*/tests/probe-*.sh`) declared for this phase; CLI verification tools (`kb.py` and `tools/sim_balance.ts --verify`) executed above.

### Test Quality Audit

| Test / Verifier File | Linked Req | Active Checks | Skipped | Circular | Assertion Level | Verdict |
|----------------------|------------|---------------|---------|----------|-----------------|---------|
| `mechanics/tools/kb.py` (`--self-test`, `check`) | `SIM-01` | 28 self-test mutations + 31 KB page checks | 0 | No (verifies against immutable `mechanics/_raw/modernuo/*.cs`) | Value & Behavioral | ✓ PASS |
| `tools/sim_balance.ts` (`--verify`) | `SIM-02` | 4 gates across 48 scenarios (Completeness, Determinism, Monotonic `L10 < L25 < L45 < L60` scaling, Warrior 0-mana & AoE/mitigation niche invariants) | 0 | No (Gates 1, 3, and 4 enforce independent mathematical and domain invariants; Gate 2 enforces regression determinism against `baseline-v0.99.0.json`) | Value & Behavioral | ✓ PASS |

**Disabled tests on requirements:** 0
**Circular patterns detected:** 0
**Insufficient assertions:** 0

### Decision Coverage

No trackable `<decisions>` block issues flagged by `gsd-tools query check.decision-coverage-verify` (`skipped: true`, `reason: "no trackable decisions"`). All architectural specifications in `04-CONTEXT.md` (17 atomic `mechanics/modernuo/*.md` pages, 2 master `mechanics/classes/modernuo-*.md` pages, `design/MODERNUO_MAPPING.md` Mode A/Mode B adaptation matrix, and `src/sim/` + `tools/sim_balance.ts` 48-scenario deterministic simulator) are honored in the shipped codebase.

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|-------------|-------------|--------|----------|
| `SIM-01` | `04-01-PLAN.md` | Developer can consult claim-verified KB pages (`mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md`) and a side-by-side derivation table (`design/MODERNUO_MAPPING.md`) mapping all 8 Bushido mechanics and 9 Ninjitsu mechanics from ModernUO C# formulas to automated idle state machines | ✓ SATISFIED | 17 atomic `mechanics/modernuo/*.md` pages + 2 master `mechanics/classes/modernuo-{bushido,ninjitsu}.md` pages (`kb.py check` `pages: 31, errors: []`) + `design/MODERNUO_MAPPING.md` |
| `SIM-02` | `04-02-PLAN.md` | Developer can run a deterministic tick-accurate combat simulator (`tools/sim_balance.ts` / `src/sim/`) reproducing live **Warrior**, **Mage**, and **Ranger** baseline curves across Early, Mid, Late, and Endgame level brackets and enemy archetypes (fast trash waves vs sustained bosses) | ✓ SATISFIED | `src/sim/{types,archetypes,engine}.ts`, `tools/sim_balance.ts`, and `data/sim-baselines/baseline-v0.99.0.json` passing `npx tsx tools/sim_balance.ts --verify --json` (`48` scenarios, `ok: true`) |

**Orphaned Requirements:** None (`REQUIREMENTS.md` maps only `SIM-01` and `SIM-02` to Phase 4).

### Anti-Pattern Scan

- Scanned all 26 created/modified files for `TBD`, `FIXME`, `XXX`, `TODO`, `HACK`, `PLACEHOLDER`, and stub returns.
- Zero debt markers or stubs exist in implementation code or KB prose. (The two `TODO:` occurrences in `mechanics/modernuo/bushido-honorable-execution.md:22` and `mechanics/modernuo/ninjitsu-death-strike.md:23` are verbatim quotes of upstream ModernUO C# source comments inside `(raw L<a>-L<b>)` claim strings required by `kb.py`'s verbatim quote checker.)

## Human Verification

N/A — Infrastructure/foundation knowledgebase and CLI combat simulation phase with no user-facing UI elements. All acceptance criteria are verified programmatically.
