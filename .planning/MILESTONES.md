# Milestones

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

---

## v1.1 Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal (Shipped: 2026-11-07)

**Phases completed:** 4 phases (Phases 7–10), 4 plans

**Key accomplishments:**

- **Idle-Tuned Ability Overhaul & Bilingual Lore (`Phase 7`)**: Upgraded *Confidence* (`Inner Calm` parry empowerment), *Evasion* (`Iaido Flash Riposte`), *Animal Form* (`Kitsune & Wolf Aspect` 3rd-swing spirit proc), and *Smoke Bomb* (`Vanish & Volley` automated combo) with evocative bilingual (`en` + `pt-BR`) Tokuno lore blurbs and expanded the simulator (`src/sim/engine.ts`, `tools/sim_balance.ts`, `tools/test_sim.ts`) across 9 material tiers (`Iron..Valorite`), 10-wave dungeon endurance runs, and 11 unit test suites (`11/11` passing).
- **Zero-Polygon Authentic UO Gump/Item Art & Oil-Painted Icons (`Phase 8`)**: Eliminated 100% of procedural `ImageDraw.polygon` icons (`zeroPolygons: true`), extracting authentic UO ability gumps from `ability-icons.png`, 34 UO item sprites from `art.png`, and 29 paperdoll layer gumps from `paperdoll/` alongside oil-painted Tokuno raster art (`bushido-sheet.jpg` & `ninjitsu-sheet.jpg`).
- **Interactive Paperdoll with Gear Mouseovers & Simulator Visual Telemetry (`Phase 9`)**: Built interactive Tokuno paperdolls (`paperdoll-samurai.png` & `paperdoll-ninja.png`) with 6 armor slots, 4 weapons, 9-tier `Iron..Valorite` scaling selector, and live mouseover gear stat tooltips (`#paperdoll-gear-tooltip`), plus multi-bracket SVG DPS/EHP progression curves, 5-channel damage source breakdown bars, and `100ms` tick rotation log strips in `class-comparison.html`.
- **Lead Developer Review Portal & Live GitHub Pages Deployment (`Phase 10`)**: Created `index.html` and `mockups/index.html` as the Executive Lead Developer Onboarding & Review Portal and deployed live to `https://brbrainerd.github.io/uoIdle/` via `.github/workflows/deploy-pages.yml`.

---
