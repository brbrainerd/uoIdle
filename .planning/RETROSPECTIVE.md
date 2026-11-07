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

## Cross-Milestone Trends

| Milestone | Phases | Plans | Requirements | Verification Gates | Status |
|-----------|--------|-------|--------------|--------------------|--------|
| `v1.0` | 6 | 14 | 17/17 (100%) | 6/6 (`npm run verify:all`) | Shipped 2026-11-07 |
