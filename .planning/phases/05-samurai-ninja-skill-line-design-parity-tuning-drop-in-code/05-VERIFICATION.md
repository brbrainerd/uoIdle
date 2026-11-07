---
phase: 05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code
verified: 2026-11-07T07:30:00Z
status: passed
score: 11/11 must-haves verified
covered_files:
  - ".planning/phases/05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code/05-01-PLAN.md"
  - ".planning/phases/05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code/05-01-SUMMARY.md"
  - ".planning/phases/05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code/05-02-PLAN.md"
  - ".planning/phases/05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code/05-02-SUMMARY.md"
  - ".planning/phases/05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code/05-03-PLAN.md"
  - ".planning/phases/05-samurai-ninja-skill-line-design-parity-tuning-drop-in-code/05-03-SUMMARY.md"
  - "data/sim-baselines/parity-5class-v0.99.0.json"
  - "design/BALANCE_REPORT.md"
  - "design/NINJA_SPEC.md"
  - "design/SAMURAI_SPEC.md"
  - "design/drop-in/classes-patch.js"
  - "design/drop-in/items-bushido-ninjitsu.json"
  - "design/drop-in/ninja.json"
  - "design/drop-in/samurai.json"
  - "src/sim/engine.ts"
  - "tools/sim_balance.ts"
  - "tools/validate_skills.ts"
covered_digest: "v1:sha256:40567083bb7a255cba9e7f8f93d839a42f9f4162ed860134d78ca62b30d6c8da"
behavior_unverified: 0
overrides_applied: 0
decision_coverage:
  honored: 0
  total: 0
  not_honored: []
---

# Phase 5: Samurai (Bushido) & Ninja (Ninjitsu) Skill Line Design, Parity Tuning & Drop-In Code Verification Report

**Phase Goal:** Design, balance-tune, and package complete Samurai (Bushido) and Ninja (Ninjitsu) skill lines, Tokuno weapon/equipment affixes, dual-mode drop-in JSON/JS definitions, formal design specifications, and an automated 5-class parity report.
**Verified:** 2026-11-07T07:30:00Z
**Status:** passed
**Re-verification:** No — initial verification

## Goal Achievement

### Roadmap Success Criteria Coverage

| # | Roadmap Success Criterion | Status | Evidence |
|---|---------------------------|--------|----------|
| SC-1 | Developer receives `design/SAMURAI_SPEC.md` and `design/NINJA_SPEC.md` defining complete Samurai (**Perfection Ramp / Weapon Parry-Counter / Execute**) and Ninja (**Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation**) skill lines that match live Warrior/Mage/Ranger unlock level tiers and active/passive slot counts 1:1. | ✓ VERIFIED | `design/SAMURAI_SPEC.md` (408 lines) and `design/NINJA_SPEC.md` (431 lines) document all 12 L1–60 progression milestones (`1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60`), starter kits, protected combat niches, Mode A/Mode B rules, and `<20 LOC` C# hooks. |
| SC-2 | Developer receives `design/drop-in/samurai.json`, `design/drop-in/ninja.json`, and `design/drop-in/classes-patch.js` that pass `schemas/class.schema.json` validation and support both **Mode A** (100% existing UO Idle engine opcodes, zero engine code changes) and **Mode B** (minimal `<20 LOC` native hook specification for clone interception and 5-hit delayed detonation). | ✓ VERIFIED | `npx tsx tools/validate_skills.ts --verify` exits `0` (`{"ok":true,"classes":5,"catalogAbilities":134}`). `node --check design/drop-in/classes-patch.js` exits `0`. Mode B hooks in `SAMURAI_SPEC.md` (17 LOC) and `NINJA_SPEC.md` (16 LOC) are under 20 LOC and simulated in `src/sim/engine.ts`. |
| SC-3 | Developer receives `design/drop-in/items-bushido-ninjitsu.json` (and specification tables) defining class-themed Tokuno armaments (*Katana*, *No-Dachi*, *Wakizashi*, *Lajatang*, *Tekagi*, *Kama*, *Fukiya*, *Tessen*) and affixes balanced against live equipment progression. | ✓ VERIFIED | `design/drop-in/items-bushido-ninjitsu.json` (498 lines) defines 8 missing Tokuno weapons, 4 Ninjitsu consumables, all 8 iconic Tokuno armaments across 9 material tiers (`Iron..Valorite`), and 10 affix pools (`bushido`, `ninjitsu`, `parrying`, `stealth`, `poisoning`, `critChance`, `attackSpeed`, `physicalDamage`, `poisonDamage`, `energyDamage`). |
| SC-4 | Running `npx tsx tools/sim_balance.ts` generates `design/BALANCE_REPORT.md` proving that Samurai and Ninja stay within $\pm 5\text{–}8\%$ of Warrior, Mage, and Ranger across Sustained Boss DPS, Trash TTK (including overkill), Net Resource Sustainability/min, and EHP/sec across all four level brackets with zero avoidance-immortality or mana-starvation loops. | ✓ VERIFIED | `npx tsx tools/sim_balance.ts --verify` exits `0` (`{"ok":true,...,"scenarios":80,"baselineScenarios":48,"parityModes":["mode_a","mode_b"]}`) and `design/BALANCE_REPORT.md` documents all 5 classes across `L10`, `L25`, `L45`, `L60` and all 4 enemy archetypes in both `mode_a` and `mode_b`. |

### Observable Truths (Plan Must-Haves)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | Developer can validate `design/drop-in/samurai.json` against `ClassSchema` (`npx tsx tools/validate_skills.ts design/drop-in/samurai.json`) with exit code 0, confirming `classNumericId` 114, badge `SM`, `robeHue` 1884, 8 `starterSkills` (including `magicResist: 30` and `focus: 50`), 4 `legacyTemplateSkills` summing to 100, 12 L1-60 progression milestones, and 12 abilities preserving all 6 pre-existing `samurai_*` catalog IDs. | ✓ VERIFIED | `npx tsx tools/validate_skills.ts design/drop-in/samurai.json` exited `0` with `{"ok":true,"classes":1,"catalogAbilities":134}`; `samurai.json` inspected and verified. |
| 2 | Developer can run `npx tsx tools/sim_balance.ts --extra-class design/drop-in/samurai.json --json` and verify that Samurai Mode A metrics across `L10`, `L25`, `L45`, and `L60` reproduce the pre-verified parity curve (`sustainedBossDps` `7.26 / 47.99 / 169.23 / 358.21` and `ehpPerSec` `15.67 / 53.24 / 147.95 / 316.89`). | ✓ VERIFIED | `npx tsx tools/sim_balance.ts --verify` and `parity-5class-v0.99.0.json` confirm exact Samurai Mode A outputs (`7.26 / 47.99 / 169.23 / 358.21` DPS and `15.67 / 53.24 / 147.95 / 316.89` EHP/sec). |
| 3 | Developer can read `design/SAMURAI_SPEC.md` to inspect the complete Samurai (Bushido) class specification covering the Perfection Ramp / Weapon Parry-Counter / Execute Duelist combat niche, starter skills/kit, L1-60 progression table, all 8 Bushido mechanics, Katana/No-Dachi/Wakizashi/Daisho/Lajatang/Tessen synergies, bilingual `pt-BR` and `en` i18n strings, Mode A engine-strict opcodes, and Mode B `<20 LOC` native C# server hooks. | ✓ VERIFIED | `design/SAMURAI_SPEC.md` (408 lines) verified; contains all 8 Bushido mechanics, all 12 `samurai_*` ability specs, 17-LOC C# hook snippet (`L333-L350`), Tokuno weapon table (`L365-L374`), and bilingual table (`L381-L395`). |
| 4 | Developer can validate `design/drop-in/ninja.json` against `ClassSchema` (`npx tsx tools/validate_skills.ts design/drop-in/ninja.json`) with exit code 0, confirming `classNumericId` 115, badge `NJ`, `robeHue` 1175, 8 `starterSkills` (including `magicResist: 30` and `focus: 50`), 4 `legacyTemplateSkills` summing to 100, 12 L1-60 progression milestones, and 13 abilities preserving all 6 pre-existing `ninja_*` catalog IDs plus `ninja_shuriken` at L35. | ✓ VERIFIED | `npx tsx tools/validate_skills.ts design/drop-in/ninja.json` exited `0` with `{"ok":true,"classes":1,"catalogAbilities":134}`; `ninja.json` inspected and verified. |
| 5 | Developer can run `npx tsx tools/sim_balance.ts --extra-class design/drop-in/ninja.json --json` and verify that Ninja Mode A metrics across `L10`, `L25`, `L45`, and `L60` reproduce the pre-verified parity curve (`sustainedBossDps` `7.28 / 53.81 / 190.26 / 374.50` and `ehpPerSec` `15.55 / 45.90 / 149.46 / 325.83`). | ✓ VERIFIED | `npx tsx tools/sim_balance.ts --verify` and `parity-5class-v0.99.0.json` confirm exact Ninja Mode A outputs (`7.28 / 53.81 / 190.26 / 374.50` DPS and `15.55 / 45.90 / 149.46 / 325.83` EHP/sec). |
| 6 | Developer can read `design/NINJA_SPEC.md` to inspect the complete Ninja (Ninjitsu) class specification covering the Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation Assassin combat niche, starter skills/kit, L1-60 progression table, all 8 Ninjitsu abilities plus SmokeBomb/Shuriken/Fukiya items, Kryss/Tekagi/Kama/Sai/Lajatang synergies, bilingual `pt-BR` and `en` i18n strings, Mode A engine-strict opcodes, and Mode B `<20 LOC` native C# server hooks. | ✓ VERIFIED | `design/NINJA_SPEC.md` (431 lines) verified; contains all 8 Ninjitsu spells/moves + Tokuno items, all 13 `ninja_*` ability specs, 16-LOC C# hook snippet (`L352-L369`), Tokuno item table (`L384-L396`), and bilingual table (`L403-L418`). |
| 7 | Developer can inspect `design/drop-in/items-bushido-ninjitsu.json` containing the 8 missing Tokuno weapon entries (`weapons.length === 8`), 4 Ninjitsu consumables (`consumables.length === 4`), iconic Tokuno armament profiles (*Katana*, *No-Dachi*, *Wakizashi*, *Lajatang*, *Tekagi*, *Kama*, *Fukiya*, *Tessen* with ClassicUO graphic IDs), material tiers (`Iron` through `Valorite`), and class-themed affix pools. | ✓ VERIFIED | `design/drop-in/items-bushido-ninjitsu.json` verified via `tools/validate_skills.ts --verify` (`weapons: 8`, `consumables: 4`, `iconicTokunoArmaments: 8`, `materialTiers: 9`, `affixPools: 10`). |
| 8 | Developer can run `node --check design/drop-in/classes-patch.js` and import/require `design/drop-in/classes-patch.js` to inspect drop-in bundle patches for `_E`/`dx`, `WE`/`hE`, `yE`/`mx`, `FE`, `mE`, `gE.samurai` and `gE.ninja`, `b` (abilities-catalog entries), `qC` (combat estimators), and `pt-BR`/`en` i18n strings. | ✓ VERIFIED | `node --check design/drop-in/classes-patch.js` exited `0`, and runtime import + `applyDropInClassPatch()` execution confirmed 12-milestone `gE.samurai`/`gE.ninja` arrays, 25 catalog entries (`12 + 13`), `qC` estimator function, and bilingual `i18n` tables. |
| 9 | Running `npx tsx tools/validate_skills.ts --verify` exits 0 with `ok: true` and `classes == 5`, validating `warrior`, `mage`, `ranger`, `samurai`, and `ninja` alongside `design/drop-in/items-bushido-ninjitsu.json`. | ✓ VERIFIED | `npx tsx tools/validate_skills.ts --verify` exited `0` with `{"ok":true,"classes":5,"catalogAbilities":134}`. |
| 10 | Running `npx tsx tools/sim_balance.ts --verify` exits 0 with `ok: true`, confirming 100% bit-for-bit preservation of `data/sim-baselines/baseline-v0.99.0.json` for `warrior`/`mage`/`ranger` and verifying that `samurai` and `ninja` stay within the $\pm 5\text{–}8\%$ parity envelope across `L10`, `L25`, `L45`, and `L60` in both `mode_a` and `mode_b` against `data/sim-baselines/parity-5class-v0.99.0.json`. | ✓ VERIFIED | `npx tsx tools/sim_balance.ts --verify` exited `0` with `{"ok":true,"scenarios":80,"baselineScenarios":48,"parityModes":["mode_a","mode_b"]}` and `git diff data/sim-baselines/baseline-v0.99.0.json` is empty. |
| 11 | Developer can read `design/BALANCE_REPORT.md` to inspect complete 5-class Mode A and Mode B benchmark tables, percentage delta calculations, resource sustainability proofs, and avoidance-cap verification across `L10`, `L25`, `L45`, and `L60` and all 4 enemy archetypes. | ✓ VERIFIED | `design/BALANCE_REPORT.md` (164 lines) documents Mode A and Mode B parity tables across all 4 brackets, all 4 enemy archetypes, resource sustainability (`0` OOM ticks for Samurai/Ninja), and anti-immortality caps. |

**Score:** 11/11 truths verified (0 present, behavior-unverified)

### Required Artifacts

| Artifact | Expected | Status | Details |
|----------|----------|--------|---------|
| `design/drop-in/samurai.json` | Schema-validated drop-in Samurai (`Bushido`) `ClassDefinition` JSON with 12 L1–60 progression milestones and 12 parity-tuned abilities | ✓ VERIFIED | 740 lines; passes `ClassSchema` and catalog cross-check (`6` pre-existing `samurai_*` IDs preserved). |
| `design/SAMURAI_SPEC.md` | Formal Samurai (`Bushido`) class design specification with Mode A/Mode B state machines, bilingual i18n, and `<20 LOC` C# hook spec | ✓ VERIFIED | 408 lines; complete 6-section specification with KB citations and 17-LOC C# server hook. |
| `design/drop-in/ninja.json` | Schema-validated drop-in Ninja (`Ninjitsu`) `ClassDefinition` JSON with 12 L1–60 progression milestones and 13 parity-tuned abilities | ✓ VERIFIED | 771 lines; passes `ClassSchema` and catalog cross-check (`6` pre-existing `ninja_*` IDs preserved + `ninja_shuriken` at `L35`). |
| `design/NINJA_SPEC.md` | Formal Ninja (`Ninjitsu`) class design specification with Mode A/Mode B state machines, bilingual i18n, and `<20 LOC` C# hook spec | ✓ VERIFIED | 431 lines; complete 6-section specification with KB citations and 16-LOC C# server hook. |
| `design/drop-in/items-bushido-ninjitsu.json` | Tokuno weapon catalog (8 weapons + 4 consumables + 8 iconic armaments + 9 material tiers + 10 affix pools) | ✓ VERIFIED | 498 lines; validated by `tools/validate_skills.ts --verify`. |
| `design/drop-in/classes-patch.js` | Syntax-verified drop-in client/server JS patch wiring `_E`, `WE`, `yE`, `FE`, `mE`, `gE`, `b`, `qC`, and `i18n` | ✓ VERIFIED | 978 lines; passes `node --check` and runtime `applyDropInClassPatch()` test. |
| `tools/validate_skills.ts` | Extended CLI schema validator verifying all 5 classes and `items-bushido-ninjitsu.json` under `--verify` | ✓ VERIFIED | 380 lines; compiles cleanly and exits `0` on single-file and `--verify` invocations. |
| `src/sim/engine.ts` | Calibrated Mode B hooks for Samurai `Perfection`/`CounterAttack` and Ninja `MirrorImage`/`DeathStrike` without mutating Mode A | ✓ VERIFIED | 1,345 lines; Mode A 3-class baseline remains 100% bit-for-bit unchanged; Mode B replaces rather than double-stacks Mode A fallbacks. |
| `tools/sim_balance.ts` | Extended 5-class simulator CLI supporting `--parity` and `--verify` across Mode A and Mode B with automated parity envelope gates | ✓ VERIFIED | 526 lines; enforces 48-scenario 3-class baseline equality + 80-scenario Mode A & Mode B parity envelope checks. |
| `data/sim-baselines/parity-5class-v0.99.0.json` | Frozen 5-class Mode A and Mode B simulation telemetry artifact (80 scenarios per mode) | ✓ VERIFIED | 3,758 lines; bit-for-bit deterministic match against live simulation runs. |
| `design/BALANCE_REPORT.md` | Comprehensive 5-class multi-bracket parity report proving $\pm 5\text{–}8\%$ balance across all metrics and archetypes | ✓ VERIFIED | 164 lines; complete Mode A, Mode B, per-archetype, resource, and anti-immortality tables. |

### Key Link Verification

| From | To | Via | Status | Details |
|------|----|-----|--------|---------|
| `design/drop-in/samurai.json` | `src/schemas/skill.schema.ts` & `abilities-catalog.json` | `ClassSchema` validation & `crossCheckDropInClassWithCatalog` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `npx tsx tools/validate_skills.ts --verify`. |
| `design/SAMURAI_SPEC.md` | `design/drop-in/samurai.json` & `mechanics/classes/modernuo-bushido.md` | Exact ability parameter tables, KB claim citations, and Mode A/Mode B rules | ✓ WIRED | Verified by `gsd-tools query verify.key-links`. |
| `design/drop-in/ninja.json` | `src/schemas/skill.schema.ts` & `abilities-catalog.json` | `ClassSchema` validation & `crossCheckDropInClassWithCatalog` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and `npx tsx tools/validate_skills.ts --verify`. |
| `design/NINJA_SPEC.md` | `design/drop-in/ninja.json` & `mechanics/classes/modernuo-ninjitsu.md` | Exact ability parameter tables, KB claim citations, and Mode A/Mode B rules | ✓ WIRED | Verified by `gsd-tools query verify.key-links`. |
| `tools/validate_skills.ts` | `design/drop-in/{samurai,ninja,items-bushido-ninjitsu}.json` & `data/live-classes/*.json` | 5-class schema + catalog validation + Tokuno item validation under `--verify` | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and CLI execution. |
| `tools/sim_balance.ts` | `src/sim/engine.ts`, `baseline-v0.99.0.json`, & `parity-5class-v0.99.0.json` | Bit-for-bit 3-class baseline check and 5-class Mode A/Mode B parity envelope gate | ✓ WIRED | Verified by `gsd-tools query verify.key-links` and CLI execution. |
| `design/BALANCE_REPORT.md` | `data/sim-baselines/parity-5class-v0.99.0.json` | Exact Mode A and Mode B simulation telemetry and delta percentages | ✓ WIRED | Verified by `gsd-tools query verify.key-links`. |

### Data-Flow Trace (Level 4)

| Artifact | Data Variable | Source | Produces Real Data | Status |
|----------|---------------|--------|--------------------|--------|
| `tools/validate_skills.ts` | `defaultClassTargets` & `catalogEntries` | `data/live-classes/*.json`, `design/drop-in/{samurai,ninja,items-bushido-ninjitsu}.json`, `mechanics/_raw/bundle/abilities-catalog.json` | Yes — parses and validates all 5 classes (69 abilities) + 134 catalog abilities + Tokuno items | ✓ FLOWING |
| `tools/sim_balance.ts` | `parityA1`, `parityB1` (`SimParityArtifact`) | `src/sim/engine.ts` (`runClassBaselineSuite` over 5 validated `ClassDefinition` payloads) | Yes — computes 80 deterministic `100ms`-tick combat scenarios per mode (`mode_a` & `mode_b`) | ✓ FLOWING |
| `design/drop-in/classes-patch.js` | `applyDropInClassPatch(bundleTables)` | `CLASS_METADATA_PATCH`, `PROGRESSION_TREE_PATCH`, `ABILITIES_CATALOG_PATCH`, `COMBAT_ESTIMATOR_PATCH`, `I18N_LOCALE_PATCH` | Yes — merges all Samurai (`114`) and Ninja (`115`) tables and estimator functions into bundle state | ✓ FLOWING |

### Behavioral Spot-Checks

| Behavior | Command | Result | Status |
|----------|---------|--------|--------|
| `classes-patch.js` syntax & runtime patch application | `node --check design/drop-in/classes-patch.js && node -e "import('./design/drop-in/classes-patch.js').then(...)"` | `applyDropInClassPatch OK: { gESamurai: 12, gENinja: 12, catalogMerged: 26, est: { kind: 'damage', min: 46, max: 54, avg: 50, variant: 'range' } }` | ✓ PASS |
| 5-class + Tokuno item schema & catalog validation | `npx tsx tools/validate_skills.ts --verify` | `{"ok":true,"classes":5,"catalogAbilities":134}` | ✓ PASS |
| Single-file Samurai & Ninja `ClassSchema` validation | `npx tsx tools/validate_skills.ts design/drop-in/samurai.json && npx tsx tools/validate_skills.ts design/drop-in/ninja.json` | `{"ok":true,"classes":1,"catalogAbilities":134}` (both) | ✓ PASS |
| 5-class Mode A & Mode B parity envelope & 3-class baseline preservation | `npx tsx tools/sim_balance.ts --verify` | `{"ok":true,"version":"0.99.0","tickMs":100,"classes":["warrior","mage","ranger","samurai","ninja"],"brackets":["L10","L25","L45","L60"],"archetypes":["fast_trash","low_def_boss","high_def_boss","multi_target_pack"],"scenarios":80,"baselineScenarios":48,"parityModes":["mode_a","mode_b"]}` | ✓ PASS |
| Knowledgebase integrity & claim verification | `python3 mechanics/tools/kb.py check --root mechanics` | `{"ok": true, "pages": 31, "errors": []}` | ✓ PASS |

### Test Quality Audit

| Test File | Linked Req | Active | Skipped | Circular | Assertion Level | Verdict |
|-----------|-----------|--------|---------|----------|-----------------|---------|
| `tools/validate_skills.ts` | `CLASS-01`, `CLASS-02`, `CLASS-03`, `CLASS-04` | 5 gates (`validateJsonSchemaParity`, `RawCatalogAbilitySchema`, `ClassSchema`, `crossCheckDropInClassWithCatalog`, `validateTokunoItemsCatalog`) | 0 | No (validates against independent `src/schemas/skill.schema.ts` and `mechanics/_raw/bundle/abilities-catalog.json`) | Value & Structural | ✓ PASS |
| `tools/sim_balance.ts` | `SIM-03`, `CLASS-03` | 5 gates (`verifyBaselineSuite`, `verifySuiteSanityAndMonotonicity`, `verifyFiveClassParityEnvelope` across `mode_a` & `mode_b`) | 0 | No (`verifyFiveClassParityEnvelope` compares Samurai & Ninja against independent Phase 4 live `warrior`/`mage`/`ranger` baseline curves from `data/sim-baselines/baseline-v0.99.0.json`) | Behavioral & Value (`±8%` live band, monotonicity, resource & OOM bounds) | ✓ PASS |

**Disabled tests on requirements:** 0
**Circular patterns detected:** 0 (Note: `parity-5class-v0.99.0.json` regression lock is paired with `verifyFiveClassParityEnvelope`, which checks Samurai/Ninja metrics against the frozen Phase 4 live class benchmarks `warrior`/`mage`/`ranger` in `baseline-v0.99.0.json`.)
**Insufficient assertions:** 0

### Requirements Coverage

| Requirement | Source Plan | Description | Status | Evidence |
|-------------|------------|-------------|--------|----------|
| `CLASS-01` | `05-01-PLAN.md` | Complete **Samurai (Bushido)** skill line matching live class unlock tiers and active/passive slot counts, occupying a protected **Perfection Ramp / Weapon Parry-Counter / Execute** combat niche (`design/SAMURAI_SPEC.md`) | ✓ SATISFIED | `design/drop-in/samurai.json` and `design/SAMURAI_SPEC.md` verified. |
| `CLASS-02` | `05-02-PLAN.md` | Complete **Ninja (Ninjitsu)** skill line matching live class unlock tiers and active/passive slot counts, occupying a protected **Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation** combat niche (`design/NINJA_SPEC.md`) | ✓ SATISFIED | `design/drop-in/ninja.json` and `design/NINJA_SPEC.md` verified. |
| `CLASS-03` | `05-01-PLAN.md`, `05-02-PLAN.md`, `05-03-PLAN.md` | Schema-validated, drop-in class and skill definitions (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`, and `design/drop-in/classes-patch.js`) with **Dual Implementation Modes**: Mode A and Mode B (`<20 LOC` native hook specification) | ✓ SATISFIED | `samurai.json`, `ninja.json`, and `classes-patch.js` pass validation; Mode A and Mode B specifications and simulation hooks verified. |
| `CLASS-04` | `05-03-PLAN.md` | Class-themed weapon and equipment affix definitions (`design/drop-in/items-bushido-ninjitsu.json` & spec section) covering iconic Tokuno armaments (*Katana*, *No-Dachi*, *Wakizashi*, *Lajatang*, *Tekagi*, *Kama*, *Fukiya*, *Tessen*) balanced against live itemization curves | ✓ SATISFIED | `design/drop-in/items-bushido-ninjitsu.json` and Section 5 of `SAMURAI_SPEC.md` & `NINJA_SPEC.md` verified. |
| `SIM-03` | `05-03-PLAN.md` | Automated parity reports (`design/BALANCE_REPORT.md`) proving **Samurai** and **Ninja** stay within $\pm 5\text{–}8\%$ of live class benchmarks across Sustained Boss DPS, Trash TTK, Net Resource Sustainability/min, and EHP/sec without avoidance-immortality or mana-starvation loops | ✓ SATISFIED | `npx tsx tools/sim_balance.ts --verify` exits `0`; `design/BALANCE_REPORT.md` and `data/sim-baselines/parity-5class-v0.99.0.json` verified. |

**Orphaned requirements check:** Zero orphaned requirements for Phase 5 in `.planning/REQUIREMENTS.md` (`SIM-03`, `CLASS-01`, `CLASS-02`, `CLASS-03`, `CLASS-04` all accounted for).

### Decision Coverage

No trackable `<decisions>` block in `05-CONTEXT.md` (`gsd-tools query check.decision-coverage-verify` returned `{"skipped":true,"reason":"no trackable decisions"}`); all locked architectural decisions in `05-CONTEXT.md` were verified directly through the 11 plan must-haves above.

### Anti-Patterns Scan

Scanned `design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `design/drop-in/items-bushido-ninjitsu.json`, `design/drop-in/classes-patch.js`, `design/SAMURAI_SPEC.md`, `design/NINJA_SPEC.md`, `design/BALANCE_REPORT.md`, `tools/validate_skills.ts`, `tools/sim_balance.ts`, and `src/sim/engine.ts`:
- Debt markers (`TBD`, `FIXME`, `XXX`): **0 found**
- Cleanup/stub markers (`TODO`, `HACK`, `PLACEHOLDER`): **0 found**

## Human Verification

N/A — Data, specification, and CLI simulation phase with no user-facing UI elements (visual HTML/CSS mockups and iconography are scoped to Phase 6). All acceptance criteria are verified programmatically.
