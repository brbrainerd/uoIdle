# Milestones

## v1.3 Smooth-Scroll Navigation, Sim Button Reactivity, Progressive Disclosure & Concept-Art CV Flywheel (Shipped: 2026-11-07)

**Phases completed:** 2 phases (Phases 15–16), 2 plans, 8/8 requirements (`UI-SCROLL-01`, `SIM-BUTTONS-01`, `PW-CV-AUDIT-01`, `UI-DEDUP-01`, `UI-PROG-DISC-01`, `UI-CLUSTER-01`, `UI-ANIM-01`, `UI-CONCEPT-CV-01`)

**Key accomplishments:**

- **Smooth-Scroll Navigation Overhaul, Full Simulator Reactivity & 46-Check Playwright + CV Harness (`Phase 15`)**: Replaced all `display: none` section hiding across `class-comparison.html`, `samurai-skill-tree.html`, `ninja-skill-tree.html`, and `index.html` with smooth scrolling (`window.scrollTo` / `scrollIntoView`) and `.is-focused-section` spotlight highlighting, wired dynamic `Mode A/B` + `Bracket` + `Archetype` re-rendering across all SVG progression curves and 5-channel breakdown bars, and built `tools/audit_buttons_cv.ts` verifying `46/46` interactive buttons via headless Chromium (`playwright`) + Pillow (`PIL.ImageChops`) pixel-diffing.
- **UI De-duplication, Progressive Disclosure, Full-Bleed `48×48` Square Level-Line Sockets & Concept-Art CV Convergence (`Phase 16`)**: Generated dark-fantasy UI Concept Art (`mockups/concept-art/concept-skill-tree-workbench.jpg` & `concept-sim-workbench.jpg`), fixed circular `.arvore-circulo` edge clipping on square icons by introducing full-bleed `48×48` beveled square sockets over an SVG golden constellation lattice (`.cobra-constellation-svg`), moved the Tokuno Paperdoll Alcove and 2×2 Simulator Telemetry Quadrant Grid into the primary `1600×1000` above-the-fold viewport, refactored the Inspector into 4 progressive-disclosure tabs (`Overview`, `Mode A/B`, `100ms Sim`, `JSON`) with horizontal hotbar/seal strips (`.hotbar-icon-strip`, `.seal-medallion-strip`), and resolved all 4/4 `16-REVIEW.md` findings (`16-FIX-SUMMARY.md`).

---

## v1.2 Live-Codebase Simulator Fidelity, Weapon Swing Speed Archetypes, Unified Tick Engine & Knowledgebase Verification Audit (Shipped: 2026-11-07)

**Phases completed:** 4 phases (Phases 11–14), 4 plans, 7/7 requirements (`KB-05..06`, `SIM-06..09`, `UI-04`)

**Key accomplishments:**

- **Knowledgebase Audit, Multi-Source Promotion & 8-Law Simulator Fidelity Audit (`Phase 11`)**: Audited all 31 existing KB pages, promoted multi-source corroborated claims (`bundle:` + `wiki:` / `modernuo:` / `live:`) to `[verified]`, authored 4 new claim-verified KB pages (`bestiary-and-monsters.md`, `hunting-bot-and-postures.md`, `progression-tree-ui.md`, `simulator-fidelity-audit.md`), and grew `mechanics/` to **35 pages** (`353` verbatim line-cited claims across `68` SHA-256-tracked `_raw/` files) with `0` errors and `0` warnings.
- **Live-Codebase Combat Math, Affix Caps, Postures, Material Ladder & Weapon Speed Archetypes (`Phase 12`)**: Implemented exact live UO Idle `v0.99.0` attribute/affix caps (`SDI <= 50%` + `INT` scaling, `DI <= 100%` + skill `>100` flattening, gear `SSI <= 60%` + additive `[Arvore` `treeSpeedPct`, `LMC <= 40%`, `EnhancePotions`, `ReflectPhysical`, defender `DCI`), canonical `[huntpostura` postures (`agressivo`, `equilibrado`, `defensivo`), `+8%` weapon / `+12%` armor material steps (`Copper..Valorite`), secondary-target `splashRatio`, 1H (`48,000`) / 2H (`41,140`) / Shield `CheckParry` divisors, `ro(e)` hotbar auto-triggers, and 3 weapon swing speed archetypes (`fast_1h` `2.25s`, `balanced_1h` `2.50s`, `heavy_2h` `3.25s`).
- **Unified Tick Kernel Refactor, Recalibrated 5-Class Parity & 16-Suite Unit Test Harness (`Phase 13`)**: Unified `simulateScenarioDetailed` and `simulateMultiWavePull` onto a single shared combat tick kernel in `src/sim/engine.ts` (`0` duplicated combat resolution loops), recalibrated 5-class Mode A & Mode B parity within $\pm 5\text{–}8\%$ across all 80 scenarios (`0` OOM ticks), and expanded `tools/test_sim.ts` to 16 unit test suites (`16/16` passing).
- **Workbench UI Sync, Maintainability Overhaul & Code Review Hardening (`Phase 14`)**: Synchronized `BALANCE_REPORT.md`, `SAMURAI_SPEC.md`, `NINJA_SPEC.md`, `README.md`, and all 5 HTML workbenches + Retina screenshots with `v1.2` simulator telemetry, added standardized `npm run` scripts in `package.json`, and resolved all 4/4 `v1.2` code review findings (`14-REVIEW-FIX.md`).

---

## v1.1 Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal (Shipped: 2026-11-07)

**Phases completed:** 4 phases (Phases 7–10), 4 plans, 10/10 requirements (`IDLE-01..02`, `SIM-04..05`, `ART-01..02`, `UI-01..03`, `HOST-01`)

**Key accomplishments:**

- **Idle-Tuned Ability Overhaul & Bilingual Lore (`Phase 7`)**: Upgraded *Confidence* (`Inner Calm` parry empowerment), *Evasion* (`Iaido Flash Riposte`), *Animal Form* (`Kitsune & Wolf Aspect` 3rd-swing spirit proc), and *Smoke Bomb* (`Vanish & Volley` automated combo) with evocative bilingual (`en` + `pt-BR`) Tokuno lore blurbs and expanded the simulator (`src/sim/engine.ts`, `tools/sim_balance.ts`, `tools/test_sim.ts`) across 9 material tiers (`Iron..Valorite`), 10-wave dungeon endurance runs, and 11 unit test suites (`11/11` passing).
- **Zero-Polygon Authentic UO Gump/Item Art & Oil-Painted Icons (`Phase 8`)**: Eliminated 100% of procedural `ImageDraw.polygon` icons (`zeroPolygons: true`), extracting authentic UO ability gumps from `ability-icons.png`, 34 UO item sprites from `art.png`, and 29 paperdoll layer gumps from `paperdoll/` alongside oil-painted Tokuno raster art (`bushido-sheet.jpg`, `ninjitsu-sheet.jpg`, `samurai-thematic-sheet.png`, `ninja-thematic-sheet.png`, `tokuno-fixes-sheet.png`).
- **Interactive Paperdoll, v2.1 Component Architecture & Simulator Visual Telemetry (`Phase 9`)**: Built interactive Tokuno paperdolls (`paperdoll-samurai.png` & `paperdoll-ninja.png`) with 6 armor slots, 4 weapons, 9-tier `Iron..Valorite` scaling selector, and live mouseover gear stat tooltips (`#paperdoll-gear-tooltip`), plus `tools/ui_components.ts` (`<uo-quick-dock>`, `<uo-combat-ticker>`, `<uo-power-meter>`, `<exec-kpi-strip>`), multi-bracket SVG DPS/EHP progression curves, 5-channel damage source breakdown bars, and responsive multi-resolution layout (`1600px`..`500px`).
- **Lead Developer Review Portal, Live GitHub Pages Deployment & Code Review Hardening (`Phase 10`)**: Created `index.html` and `mockups/index.html` as the Executive Lead Developer Onboarding & Review Portal, deployed live to `https://brbrainerd.github.io/uoIdle/` via `_site`-staged `.github/workflows/deploy-pages.yml`, and resolved all 7/7 Phase 10 code review findings (`10-REVIEW-FIX.md`).

---

## v1.0 UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase (Shipped: 2026-11-07)

**Phases completed:** 6 phases, 14 plans, 28 tasks

**Key accomplishments:**

- Private repository boundary, `mechanics/CONTRIBUTING.md` contributor contract, and zero-dependency `mechanics/tools/kb.py` verifier adapted for UO Idle's 12 categories, 6-tier evidence ranks, multi-source `_raw/manifest.json` SHA-256 checks, credential scanning, and 28-mutation `--self-test` harness
- Deterministic `prettier` + `acorn` AST extraction pipeline (`tools/bundle_extract.mjs`) producing 14 live UO Idle `v0.99.0` bundle slices, 4 server/client changelogs, 2 API/protocol registries, and redacted live runtime probe evidence with 100% `manifest.json` SHA-256 verification
- Deterministic Python 3 stdlib fetcher (`tools/fetch_modernuo.py`) archiving all 48 canonical ModernUO Bushido, Ninjitsu, Perfection (`HonorContext.cs`), Parry (`BaseWeapon.cs`), and Tokuno weapon C# files at commit `b0e6b17c5cba3a6944ca25a9676dcdec0022ac38` and completing the 68-entry `mechanics/_raw/manifest.json` verification pipeline (`KB-04`)
- Four claim-verified combat KB pages (`resources`, `tick-and-cooldowns`, `damage-and-defense`, and `status-effects`) with 62 verbatim `(raw L<a>-L<b>)` citations, cross-linked server changelog rules, and a rebuilt `mechanics/INDEX.md` passing `kb.py check` with zero errors.
- Claim-verified progression/unlock (`progression-unlocks.md`) and equipment/affix (`equipment-affixes.md`) KB pages plus a `verified` 3-tier Client/Shared/Server Engine Capability Matrix (`engine-capability-matrix.md`) defining Mode A vs Mode B for Phase 5 Samurai and Ninja, completing all 7 Phase 2 KB pages with zero errors.
- Authored claim-verified KB pages for Warrior, Mage, and Ranger alongside the 16-class structural parity specification and protected Samurai/Ninja combat niche matrix (`12` total KB pages, `0` errors).
- Authored JSON Schema Draft 2020-12 and TypeScript `zod` contracts (`schemas/{effect,skill,class}.schema.json`, `src/schemas/skill.schema.ts`), extracted canonical live class JSON definitions (`data/live-classes/{warrior,mage,ranger}.json`), and verified 100% validation pass across all `3` live classes and `134` catalog entries via `tools/validate_skills.ts --verify`.
- 19 citation-verified ModernUO Bushido/Ninjitsu KB pages passing `kb.py check` (31 pages, 0 errors) plus `design/MODERNUO_MAPPING.md` translating spatial/stealth/parry mechanics into Mode A (pure JSON) and Mode B (`<20 LOC` C# hook) UO Idle primitives
- Deterministic `100ms`-tick UO Idle combat simulator (`src/sim/`, `tools/sim_balance.ts`) and frozen `v0.99.0` 48-scenario baseline artifact (`data/sim-baselines/baseline-v0.99.0.json`) for Warrior, Mage, and Ranger passing `--verify` with zero errors
- Schema-validated Samurai (`Bushido`, `classNumericId: 114`) drop-in class definition (`design/drop-in/samurai.json`) and formal Mode A / Mode B architecture specification (`design/SAMURAI_SPEC.md`) verified across `L10`, `L25`, `L45`, and `L60`.
- Schema-validated Ninja (`Ninjitsu`, `classNumericId: 115`) drop-in class definition (`design/drop-in/ninja.json`) and formal Mode A / Mode B architecture specification (`design/NINJA_SPEC.md`) verified across `L10`, `L25`, `L45`, and `L60`.
- Drop-in Tokuno item catalog (`design/drop-in/items-bushido-ninjitsu.json`), syntax-verified client/server bundle patch (`design/drop-in/classes-patch.js`), calibrated Mode B simulation hooks, automated 5-class schema/parity CLI gates, and formal balance report (`design/BALANCE_REPORT.md`) proving $\pm 5\text{–}8\%$ parity across `L10..L60` in Mode A and Mode B.
- Custom dark-fantasy Ultima Online Samurai (`robeHue: 1884`) and Ninja (`robeHue: 1175`) class portraits ($256\times 256$ and $64\times 64$) and 135 multi-resolution ($64\times 64$ and $48\times 48$) skill/milestone icons framed in beveled antique-gold gump borders, verified via `manifest.json` SHA-256 and pixel-variance checks
- Data-driven `uoidle.com/beta` standalone HTML/CSS mockups (`samurai-skill-tree.html`, `ninja-skill-tree.html`, `class-comparison.html`), $3200\times 2800$ Retina Chrome verification screenshots, root `README.md` executive handoff index, and a 6-command Milestone v1.0 verification gate (`exit 0`)

