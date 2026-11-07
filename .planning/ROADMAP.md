# Roadmap: UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

## Milestones

- ✅ **v1.0 UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase** — Phases 1–6 (shipped 2026-11-07) — [Archive](file:///Users/brbrainerd/dev/uoIdle/.planning/milestones/v1.0-ROADMAP.md)
- ✅ **v1.1 Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal** — Phases 7–10 (shipped 2026-11-07)

---

## Phases

<details>
<summary>✅ v1.0 UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase (Phases 1–6) — SHIPPED 2026-11-07</summary>

- [x] **Phase 1: Repository, Knowledgebase Engine & Raw Source Extraction** (`3/3` plans) — completed 2026-11-07
- [x] **Phase 2: Core Combat, Progression & Engine Capability Knowledgebase** (`2/2` plans) — completed 2026-11-07
- [x] **Phase 3: Live Classes (Warrior, Mage, Ranger) & Structural Parity Contract** (`2/2` plans) — completed 2026-11-07
- [x] **Phase 4: ModernUO Bushido/Ninjitsu Reference & Deterministic Combat Simulator** (`2/2` plans) — completed 2026-11-07
- [x] **Phase 5: Samurai & Ninja Skill Line Design, Balance Verification & Drop-In Code** (`3/3` plans) — completed 2026-11-07
- [x] **Phase 6: Dark-Fantasy Iconography, Beta UI Mockups & Developer Handoff Package** (`2/2` plans) — completed 2026-11-07

</details>

### ✅ v1.1 Authentic UO Gump/Item Art, Interactive Paperdoll & Sim Telemetry UI, Idle-Tuned Ability Overhaul & Live Developer Portal (Phases 7–10) — SHIPPED 2026-11-07

- [x] **Phase 7: Idle-Game Ability Overhaul, Evocative Lore Blurbs & Expanded Simulation/Test Suite** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 8: Authentic UO Gump/Item Sprite Extraction & High-Detail AI Raster Iconography** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 9: Interactive Visual Paperdoll, Simulator Telemetry Charts & CV UI Polish (`/gsd-ui-phase`)** (`1/1` plan) — completed 2026-11-07
- [x] **Phase 10: Lead Developer Review Portal (`index.html`), Live GitHub Pages Deployment & Final Audit** (`1/1` plan) — completed 2026-11-07

---

## Phase Details

### Phase 7: Idle-Game Ability Overhaul, Evocative Lore Blurbs & Expanded Simulation/Test Suite
**Goal:** Refine Samurai and Ninja ability mechanics specifically for 24/7 idle auto-battler play, rewrite all `en` and `pt-BR` ability blurbs and lore descriptions to be evocative and crystal-clear, expand the simulator to cover `Iron..Valorite` material tiers, Tokuno affixes, and multi-wave dungeon pulls, and add a comprehensive unit test suite (`tools/test_sim.ts`).
**Depends on:** Phase 6 (v1.0 baseline)
**Requirements:** `IDLE-01`, `IDLE-02`, `SIM-04`, `SIM-05`
**Success Criteria** (what must be TRUE):
1. *Confidence* (`Inner Calm` parry synergy), *Evasion* (`Iaido Flash Riposte`), *Animal Form* (`Kitsune & Wolf Aspect` 3rd-swing spirit proc), and *Smoke Bomb* (`Vanish & Volley` combo) are modeled in `samurai.json`, `ninja.json`, `classes-patch.js`, and `src/sim/` with 100% schema validation pass.
2. Every ability in `samurai.json`, `ninja.json`, `SAMURAI_SPEC.md`, and `NINJA_SPEC.md` features rich, atmospheric Ultima Online lore blurbs (`en` and `pt-BR`) paired with concise idle-combat mechanic summaries.
3. `npx tsx tools/sim_balance.ts --verify` validates both the 80-scenario 5-class parity matrix ($\pm 5\text{–}8\%$) and the new `data/sim-baselines/gear-and-waves-v1.1.json` matrix (`Iron..Valorite` material scaling, Tokuno affixes, and multi-wave spawn transitions).
4. `npx tsx tools/test_sim.ts` passes 100% of unit test assertions covering shieldless 1H/2H parry math, clone absorption, `<35%` execute boundaries, poison/trauma detonation, idle proc synergies, and `0` OOM ticks.

**Plans:**
- [ ] `07-01-PLAN.md` — Idle-Tuned Ability Mechanics Refinement & Evocative Bilingual (`en`/`pt-BR`) Lore/Blurb Overhaul (`IDLE-01`, `IDLE-02`)
- [ ] `07-02-PLAN.md` — Material-Tier (`Iron..Valorite`), Affix & Multi-Wave Simulator Expansion + Unit Test Suite (`SIM-04`, `SIM-05`)

---

### Phase 8: Authentic UO Gump/Item Sprite Extraction & High-Detail AI Raster Iconography
**Goal:** Eliminate 100% of procedural `ImageDraw.polygon` icons by extracting authentic in-game UO ability gumps and equipment/item sprites from `uoidle.com/packs/{ability-icons,art,paperdoll}` and generating rich oil-painted dark-fantasy raster icons via `image-generator` for custom milestones, capstones, and mastery badges.
**Depends on:** Phase 7
**Requirements:** `ART-01`, `ART-02`
**Success Criteria** (what must be TRUE):
1. `mockups/assets/icons/` contains zero procedural `ImageDraw.polygon` icons: all canonical UO skills use authentic gumps extracted from `uoidle.com/packs/ability-icons/ability-icons.png` (`21536..21540`, `21280..21287`, `20992..21022`, `idle_samurai_way`) and all custom capstones/milestones/badges use genuine AI-generated oil-painted raster artwork framed in beveled antique-gold gump borders.
2. `mockups/assets/items/` and `mockups/assets/items/manifest.json` contain authentic in-game UO item sprites and paperdoll layer graphics extracted from `uoidle.com/packs/art/art.png` and `uoidle.com/packs/paperdoll/` for all Samurai & Ninja armor slots, Tokuno weapons, and Ninjitsu tools.
3. CV visual inspection (`read_file` on `mockups/assets/icons/contact-sheet.png` and `mockups/assets/items/items-contact-sheet.png`) confirms high-detail Ultima Online gump and item artwork across every cell.

**Plans:**
- [ ] `08-01-PLAN.md` — Live UO Gump Atlas & Paperdoll/Item Sprite Extractor (`tools/extract_uo_assets.py`, `mockups/assets/items/`) (`ART-01`, `ART-02`)
- [ ] `08-02-PLAN.md` — High-Detail AI Raster Icon Generation for Custom Capstones/Badges & Composite Contact Sheet Verification (`tools/generate_icons.py`) (`ART-01`, `ART-02`)

---

### Phase 9: Interactive Visual Paperdoll, Simulator Telemetry Charts & CV UI Polish (`/gsd-ui-phase`)
**Goal:** Design (`UI-SPEC.md`) and build an interactive visual paperdoll displaying real UO gear sprites with mouseover stat/material/affix tooltips on the Samurai & Ninja workbenches, upgrade `class-comparison.html` with rich SVG/Canvas simulator telemetry charts (DPS/EHP progression, damage source breakdown, `Iron..Valorite` gear scaling, rotation timeline), and verify all views via CV visual inspection.
**Depends on:** Phase 8
**Requirements:** `UI-01`, `UI-02`, `UI-03`
**Success Criteria** (what must be TRUE):
1. `.planning/phases/09-interactive-paperdoll-and-sim-ui/09-UI-SPEC.md` defines the visual layout, paperdoll slot grid, hover tooltip card contract, and simulator chart specifications.
2. `mockups/samurai-skill-tree.html` and `mockups/ninja-skill-tree.html` render an interactive Tokuno paperdoll and equipment slot grid with real UO item graphics, an interactive `Iron..Valorite` material tier selector, and mouseover tooltips displaying full item stats, speed/damage, `WeaponAbility` badges, and Tokuno affixes.
3. `mockups/class-comparison.html` renders interactive SVG/Canvas telemetry charts (L10–L60 DPS/EHP curves, stacked damage-source breakdowns, `Iron..Valorite` material scaling curves, multi-wave sustain telemetry, and 100ms rotation timeline strips).
4. CV visual inspection (`read_file` on updated Retina screenshots `samurai-skill-tree.png`, `ninja-skill-tree.png`, `class-comparison.png`) confirms crisp typography, authentic gear/icon sprites, interactive hover cards, and zero layout clipping.

**Plans:**
- [ ] `09-01-PLAN.md` — UI Design Contract (`09-UI-SPEC.md`) & Interactive Visual Paperdoll with Mouseover Gear/Affix Tooltips (`UI-01`, `UI-03`)
- [ ] `09-02-PLAN.md` — Visual Simulator Telemetry Charts (`class-comparison.html`) & CV Screenshot Verification (`UI-02`, `UI-03`)

---

### Phase 10: Lead Developer Review Portal (`index.html`), Live GitHub Pages Deployment & Final Audit
**Goal:** Create an executive Lead Developer Review Portal (`index.html` and `mockups/index.html`) guiding the UO Idle developer through the interactive demos, simulator telemetry, drop-in JSON/JS files, architecture specs, and claim-verified KB, deploy the full portal live to GitHub Pages (`https://brbrainerd.github.io/uoIdle/`), and run the end-to-end verification and CV audit.
**Depends on:** Phase 9
**Requirements:** `HOST-01`
**Success Criteria** (what must be TRUE):
1. Root `index.html` (and `mockups/index.html`) presents an authentic `uoidle.com/beta`-styled Lead Developer Executive Portal with guided walkthrough cards, quick-jump links to `samurai-skill-tree.html`, `ninja-skill-tree.html`, and `class-comparison.html`, interactive integration mode toggles, and direct GitHub file links to `design/drop-in/`, `design/*_SPEC.md`, and `mechanics/INDEX.md`.
2. `.github/workflows/deploy-pages.yml` deploys the site to `https://brbrainerd.github.io/uoIdle/` and live HTTP probes (`curl -I https://brbrainerd.github.io/uoIdle/` and subpages) return `HTTP 200`.
3. `npm run verify:all` (including `kb.py`, `validate_skills.ts`, `sim_balance.ts`, `test_sim.ts`, `generate_icons.py --verify`, and `build_mockups.ts --verify`) passes with `0` errors and CV inspection of the live portal screenshot passes.

**Plans:**
- [ ] `10-01-PLAN.md` — Lead Developer Onboarding Portal (`index.html`) & Updated `README.md` Review Guide (`HOST-01`)
- [ ] `10-02-PLAN.md` — GitHub Pages Workflow Deployment, Live URL Verification & Final CV Audit (`HOST-01`, `UI-03`)

---

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Repository, KB Engine & Raw Extraction | v1.0 | 3/3 | Complete | 2026-11-07 |
| 2. Core Combat, Progression & Engine Matrix | v1.0 | 2/2 | Complete | 2026-11-07 |
| 3. Live Classes & Structural Parity Contract | v1.0 | 2/2 | Complete | 2026-11-07 |
| 4. ModernUO Reference & Combat Simulator | v1.0 | 2/2 | Complete | 2026-11-07 |
| 5. Samurai & Ninja Design, Balance & Code | v1.0 | 3/3 | Complete | 2026-11-07 |
| 6. Iconography, Beta UI Mockups & Handoff | v1.0 | 2/2 | Complete | 2026-11-07 |
| 7. Idle Ability Overhaul, Lore Blurbs & Sim Tests | v1.1 | 1/1 | Complete | 2026-11-07 |
| 8. Authentic UO Gump/Item Art & AI Icons | v1.1 | 1/1 | Complete | 2026-11-07 |
| 9. Interactive Paperdoll & Sim Telemetry UI | v1.1 | 1/1 | Complete | 2026-11-07 |
| 10. Developer Portal & Live GitHub Pages | v1.1 | 1/1 | Complete | 2026-11-07 |
