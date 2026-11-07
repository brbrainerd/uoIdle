# Project Retrospective

*A living document updated after each milestone. Lessons feed into future planning.*

## Milestone: v1.0 — UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase

**Shipped:** 2026-11-07
**Phases:** 6 | **Plans:** 14 | **Requirements:** 17/17 (`KB-01..04`, `INDEX-01..04`, `SIM-01..03`, `CLASS-01..04`, `VISUAL-01..02`)

### What Was Built
- **Claim-Verified Knowledgebase (`mechanics/`)**: Adapted `mechanics/tools/kb.py` (`--self-test` with 28/28 mutations caught), extracted 68 SHA-256-tracked `_raw/` files (`bundle/`, `modernuo/`, `wiki/`, `_evidence/`), and authored 31 claim-verified KB pages (`290+` verbatim line-cited claims) with `0` check errors.
- **Canonical Data Schemas & Live Class Baselines (`schemas/`, `src/schemas/`, `data/live-classes/`)**: Reverse-engineered JSON Schema Draft 2020-12 and TypeScript `zod` contracts (`ClassSchema`, `SkillSchema`, `EffectSchema`) and extracted live `warrior.json`, `mage.json`, and `ranger.json` across all 134 catalog entries.
- **Deterministic 100ms-Tick Combat Simulator (`src/sim/`, `tools/sim_balance.ts`)**: Built a deterministic probability-accumulator combat simulator (`0.00%` run-to-run variance) verifying 80 scenarios (`5` classes × `4` brackets × `4` archetypes × `2` modes) within $\pm 5\text{–}8\%$ numerical parity.
- **Samurai (`Bushido`, `id: 114`) & Ninja (`Ninjitsu`, `id: 115`) Drop-In Package (`design/`)**: Delivered `samurai.json`, `ninja.json`, `items-bushido-ninjitsu.json`, `classes-patch.js`, `SAMURAI_SPEC.md`, `NINJA_SPEC.md`, `MODERNUO_MAPPING.md`, and `BALANCE_REPORT.md` featuring distinct Tokuno/Grandmaster L50 & L60 capstones (*Frenzied Whirlwind*, *Kensei: Amakura's Judgment*, *Fukiya & Egg Bomb Barrage*, and *Kage Bunshin: Twin Shadow Execution*) and `<20 LOC` Mode B C# server hooks.
- **Custom Dark-Fantasy Iconography & `uoidle.com/beta` Workbenches (`mockups/`, `tools/generate_icons.py`, `tools/build_mockups.ts`)**: Generated 140 super-sampled PNG icon/portrait assets and 3 interactive standalone `uoidle.com/beta` HTML/CSS workbenches with Retina verification screenshots (`3200x2800`) and root `README.md` developer handoff index.

### What Worked
- **Deterministic AST Slicing + `kb.py` Verbatim Line Citations**: Formatting the 2.28 MB minified Vite bundle (`index-CCYN0Dy6.js`) with `prettier` before AST slicing produced stable line spans (`raw L<a>-L<b>`) that prevented any formula guesswork across all 6 phases.
- **Dual-Mode Specification Architecture (Mode A + Mode B)**: Providing both a 100% engine-strict configuration payload (Mode A) and `<20 LOC` ModernUO C# hooks (Mode B) bridged client/shared config capabilities and server-authoritative combat mechanics without requiring invasive engine rewrites.
- **Deterministic Accumulator Simulation (`resolveDeterministicRoll`)**: Replacing PRNG variance with deterministic accumulators allowed instant, repeatable regression verification (`npx tsx tools/sim_balance.ts --verify`) whenever skill numbers or capstones were tuned.

### What Was Inefficient
- **Simulator Priority Tie-Breaking Sensitivity**: When replacing `samurai_lightning_r2` with `samurai_frenzied_whirlwind`, lexicographical/priority sorting in `directOffense` slightly shifted `L45`/`L60` cast ordering until `samurai_frenzied_whirlwind` was added to the explicit armor-piercing strike rule in `src/sim/engine.ts`.

### Patterns Established
- **6-Gate Verification Pipeline (`npm run verify:all`)**: Every change to KB pages, class JSON payloads, simulator math, icons, or HTML mockups is verified by a single deterministic command running `kb.py --self-test`, `kb.py check`, `validate_skills.ts --verify`, `sim_balance.ts --verify`, `generate_icons.py --verify`, and `build_mockups.ts --verify`.
- **Catalog Provenance Aliasing (`aliasOf`)**: Replacing legacy Rank II catalog stubs (`*_r2`) with brand-new lore-authentic capstones while recording `aliasOf: "samurai_lightning_r2"` / `"samurai_honorable_r2"` / `"ninja_mirror_r2"` / `"ninja_death_r2"` preserves 100% backward traceability to the raw `v0.99.0` bundle.

### Key Lessons
- Always enforce explicit HTML/JSON escaping (`escapeHtml`, `safeJsonEmbed`) and non-mutable CLI `--verify` flags in generator scripts (`code-review` findings `WR-02`, `WR-03`, `WR-04`).
- In 1D automated idle combat, spatial tile-distance mechanics (`KiAttack`, `DeathStrike` steps, `Shadowjump`) and self-sabotaging failure penalties (`HonorableExecution` `-40` resists) must be translated into temporal/swing-count state machines and threshold execute bonuses.

### Cost Observations
- Model mix: 100% `inherit` across orchestrator and subagents
- Sessions: 1 continuous autonomous delivery + review/fix + capstone upgrade
- Notable: Parallel Wave 1 execution in Phase 5 (`05-01` Samurai + `05-02` Ninja) cut class specification authoring time in half with zero file conflicts.

---

## Milestone: v1.1 — Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal

**Shipped:** 2026-11-07
**Phases:** 4 (`Phases 7–10`) | **Plans:** 4 | **Requirements:** 10/10 (`IDLE-01..02`, `SIM-04..05`, `ART-01..02`, `UI-01..03`, `HOST-01`)

### What Was Built
- **Idle-Tuned Ability Mechanics & Bilingual Lore (`Phase 7`)**: Added *Confidence* (`Inner Calm` parry empowerment), *Evasion* (`Iaido Flash Riposte`), *Animal Form* (`Kitsune & Wolf Aspect` 3rd-swing spirit proc), and *Smoke Bomb* (`Vanish & Volley` combo), rewrote all `en` + `pt-BR` descriptions across `samurai.json`, `ninja.json`, `SAMURAI_SPEC.md`, and `NINJA_SPEC.md`, and expanded `tools/sim_balance.ts` + `tools/test_sim.ts` (`11/11` passing) across 9 material tiers (`Iron..Valorite`) and 10-wave dungeon pulls.
- **Authentic UO Gump/Item Art & Oil-Painted Tokuno Iconography (`Phase 8`)**: Extracted authentic UO ability gumps, 34 item sprites, and 29 paperdoll layer gumps from `uoidle.com/packs/` and generated oil-painted dark-fantasy Tokuno icons for all custom abilities, capstones, and seals (`zeroPolygons: true`, `140` ability PNGs + `37` item/paperdoll PNGs verified with `stdDev >= 12.0` and SHA-256).
- **Consolidated v2.1 Component Workbench & Multi-Resolution CV Flywheel (`Phase 9`)**: Consolidated redundant ability catalogs into single unified `L1–L60` progression cards with progressive-disclosure schema drawers, semantic ability-kind colorization, full Mode A / Mode B live interactivity, a modular component library (`tools/ui_components.ts`), a live 100ms tick combat preview (`<uo-combat-ticker>`), and responsive multi-breakpoint layouts (`1600px`..`500px`).
- **Lead Developer Review Portal & Live GitHub Pages Deployment (`Phase 10`)**: Built `index.html` / `mockups/index.html` and deployed the static portal to `https://brbrainerd.github.io/uoIdle/` via `.github/workflows/deploy-pages.yml` (`_site` staging artifact), passing adversarial code review (`10-REVIEW.md` / `10-REVIEW-FIX.md`, 7/7 findings resolved).

### What Worked
- **Multi-Resolution CV Flywheel (`read_file` on `1600px`, `1280px`, `768px`, `500px` captures)**: Visually inspecting Retina headless Chrome captures across desktop, laptop, tablet, and mobile viewports caught subtle issues (such as the 4-bladed AI artifact on `samurai_way`, lowercase `skillKey` role lookups, and 12-column `.arvore-cobra` label collisions) immediately.
- **Modular Component Extraction (`tools/ui_components.ts`)**: Separating reusable dark-fantasy UI widgets (`<uo-quick-dock>`, `<uo-combat-ticker>`, `<uo-power-meter>`, `<exec-kpi-strip>`) from `tools/build_mockups.ts` kept the static generator clean while upgrading all 4 surfaces simultaneously.

### What Was Inefficient
- **Hardcoded Browser Path in Initial Screenshot Harness**: Initially referencing `/Applications/Google Chrome.app/...` directly required a cleanup pass (`resolveChromeBin()`) to make screenshot generation cross-platform and optional when headless Chrome is absent.

### Patterns Established
- **7-Gate Verification Pipeline (`npm run verify:all`)**: Expanded `verify:all` to 7 deterministic gates (`kb.py --self-test`, `kb.py check`, `validate_skills.ts --verify`, `sim_balance.ts --verify`, `test_sim.ts`, `generate_icons.py --verify`, and `build_mockups.ts --verify`).
- **Explicit `_site` Staging for GitHub Pages (`deploy-pages.yml`)**: Staging only public static assets (`index.html`, `README.md`, `mockups/`, `design/`, `schemas/`, `data/`, `mechanics/INDEX.md`) into `_site/` prevents internal `.planning/` or `_raw/` directories from being published in Pages artifacts.

### Key Lessons
- Always pair AI-generated icon sprite sheets with a CV visual inspection pass (`read_file` on `contact-sheet.png` and full page screenshots) to verify anatomical/weapon counts (e.g., 3 crossed swords on `Way of the Blade`) and thematic match against ability descriptions.
- Escape all dynamic values in client-side `innerHTML` helpers (`esc(...)`) just as strictly as server-side template strings (`escapeHtml(...)`).

### Cost Observations
- Model mix: 100% `inherit`
- Sessions: 1 continuous v1.1 delivery + multi-pass CV flywheel + Phase 10 code review & fix

---

## Milestone: v1.2 — Live-Codebase Simulator Fidelity, Weapon Swing Speed Archetypes, Unified Tick Engine & Knowledgebase Verification Audit

**Shipped:** 2026-11-07
**Phases:** 4 (`Phases 11–14`) | **Plans:** 4 | **Requirements:** 7/7 (`KB-05..06`, `SIM-06..09`, `UI-04`)

### What Was Built
- **Multi-Source Knowledgebase Promotion & 8-Law Simulator Fidelity Audit (`Phase 11`)**: Promoted corroborated claims across core combat, progression, and ModernUO pages to `[verified]`, added 4 new claim-verified pages (`bestiary-and-monsters.md`, `hunting-bot-and-postures.md`, `progression-tree-ui.md`, and `simulator-fidelity-audit.md`), and expanded `mechanics/` to **35 pages** (`353` claims, `0` errors).
- **Live-Codebase Combat Math, Postures, Material Steps & Weapon Speed Archetypes (`Phase 12`)**: Implemented live `v0.99.0` hard caps (`SDI <= 50%` + `INT` scaling, `DI <= 100%` + skill `>100` flattening, gear `SSI <= 60%` + `treeSpeedPct`, `LMC <= 40%`, `EnhancePotions`, `ReflectPhysical`), `[huntpostura` postures (`agressivo`/`equilibrado`/`defensivo`), `+8%` weapon / `+12%` armor material steps (`Copper..Valorite`), secondary-target `splashRatio`, 1H (`48,000`) / 2H (`41,140`) / Shield `CheckParry`, `ro(e)` hotbar auto-triggers, and `weaponArchetypeCurves` (`2.25s` Fast 1H vs `2.50s` Balanced 1H vs `3.25s` Heavy 2H).
- **Unified Combat Tick Kernel & 16-Suite Unit Test Harness (`Phase 13`)**: Consolidated `simulateScenarioDetailed` and `simulateMultiWavePull` onto a single shared tick loop in `src/sim/engine.ts`, recalibrated 80-scenario 5-class baselines (`±5–8%` parity, `0` OOM ticks), and expanded `tools/test_sim.ts` to 16 unit test suites (`16/16` passing).
- **Synchronized Workbenches, `README.md` Maintainability Overhaul & Code Review Fixes (`Phase 14`)**: Regenerated `BALANCE_REPORT.md`, `SAMURAI_SPEC.md`, `NINJA_SPEC.md`, `README.md`, `package.json` scripts, and all 5 HTML workbenches + Retina screenshots, and fixed all 4 Phase 14 review findings (`WR-01`, `WR-02`, `IN-01`, `IN-02` in `14-REVIEW-FIX.md`).

### What Worked
- **Single-Kernel Simulation Architecture**: Extracting the shared tick execution loop eliminated ~340 lines of duplicated combat resolution between single-wave and multi-wave runs and immediately surfaced subtle multi-target wave state mismatches (`WR-01`).
- **Weapon Swing Speed Archetype Sweep (`fast_1h`, `balanced_1h`, `heavy_2h`)**: Parameterizing weapon speed alongside handedness (`1H` `48,000` vs `2H` `41,140` `CheckParry` divisor) proved why Ninja thrives on `2.25s` Fast 1H (`+7.4%` DPS from `SSI` floor avoidance + 3rd-swing spirit procs) while Samurai peaks on `2.50s` Balanced 1H (`13.54%` parry + `1.63x` EHP).

### What Was Inefficient
- **Upper Clamp on `splashRatio` (`<= 1`)**: Initially clamping `splashRatio` to `[0, 1]` inadvertently suppressed `samurai_momentum_strike`'s `1.15` secondary blade transfer ratio until caught by `/gsd-code-review` (`IN-01`).

### Patterns Established
- **8-Law Simulator Fidelity Contract (`mechanics/topics/simulator-fidelity-audit.md`)**: Every mathematical formula in `src/sim/` is now explicitly documented and cross-linked to verbatim `_raw/` bundle/wiki/ModernUO citations and unit-tested in `tools/test_sim.ts`.
- **Standardized `package.json` Script Surface**: Every build and verification step (`build:kb`, `verify:kb`, `verify:skills`, `build:sim`, `verify:sim`, `test:sim`, `verify:icons`, `build:mockups`, `verify:mockups`, `verify:all`) is addressable via `npm run`.

### Key Lessons
- Always verify upper clamp bounds against domain-specific multipliers (`MomentumStrike` transfers `115%` to secondary targets in ModernUO/UO Idle).
- Include posture incoming-damage multipliers (`resolvePostureProfile(stats.posture).incomingDamageMultiplier`) in effective HP (`ehpMultiplier`) telemetry so aggressive/defensive posture trade-offs are reflected in EHP charts (`WR-02`).

### Cost Observations
- Model mix: 100% `inherit`
- Sessions: 1 continuous `v1.2` execution + weapon swing speed expansion + `README.md` overhaul + `/gsd-code-review --fix`

## Cross-Milestone Trends

| Milestone | Phases | Plans | Requirements | Verification Gates | Status |
|-----------|--------|-------|--------------|--------------------|--------|
| `v1.0` | 6 (`1–6`) | 14 | 17/17 (100%) | 6/6 (`npm run verify:all`) | Shipped 2026-11-07 |
| `v1.1` | 4 (`7–10`) | 4 | 10/10 (100%) | 7/7 (`npm run verify:all`) | Shipped 2026-11-07 |
| `v1.2` | 4 (`11–14`) | 4 | 7/7 (100%) | 7/7 (`npm run verify:all`, `16/16` unit tests) | Shipped 2026-11-07 |
