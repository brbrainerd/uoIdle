# UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

## What This Is

A comprehensive reverse-engineering knowledgebase of **UO Idle** (`https://uoidle.com/beta`) and a complete, drop-in class design package for two hypothetical classes—**Ninja** (based on Ultima Online's *Ninjitsu*) and **Samurai** (based on Ultima Online's *Bushido*)—commissioned for the lead developer of UO Idle. It combines a claim-verified local mechanics knowledgebase (modeled after `mudlet-dragonball-evolution/mechanics/`) scraped from the live game client, network surfaces, documentation, and wiki with mechanically and numerically balanced skill lines, drop-in code/JSON definitions, formal design specifications, and UI/icon visual mockups hosted live on GitHub Pages (`https://brbrainerd.github.io/uoIdle/`).

## Core Value

Deliver mechanically authentic (grounded in ModernUO Bushido/Ninjitsu), numerically balanced (parity-tested against live Warrior, Mage, and Ranger formulae), and implementation-ready Ninja and Samurai skill lines backed by a 100% source-verified UO Idle mechanics knowledgebase.

## Current Milestone: v1.2 Live-Codebase Simulator Fidelity, Unified Tick Engine & Knowledgebase Verification Audit

**Goal:** Eliminate every mathematical and behavioral gap between the deterministic combat simulator (`src/sim/`) and the live UO Idle `v0.99.0` codebase + ModernUO reference rules, unify the single-wave and multi-wave tick engines, audit and promote the `mechanics/` knowledgebase to multi-source `verified` rank with zero uncited `_raw/` slices, and synchronize all 5-class parity baselines, specs, and live GitHub Pages workbenches.

**Target features:**
- **Knowledgebase Audit, Cross-Verification & Coverage Expansion (`KB-05`, `KB-06`)**: Promote multi-source corroborated KB pages (`resources.md`, `damage-and-defense.md`, `tick-and-cooldowns.md`, `equipment-affixes.md`, Bushido/Ninjitsu pages) to `verified`, expand KB coverage across `bestiary-and-wiki.js`, `hunt-and-bot-config.js`, and `progression-tree-ui.js`, and author `mechanics/topics/simulator-fidelity-audit.md`
- **Live-Codebase Combat Math, Affix Caps, Postures & Hotbar `ro(e)` Parity (`SIM-06`, `SIM-07`)**: Enforce live UO Idle hard caps (`SDI <= 50%`, `DI <= 100%`, skill `>100` flattening, gear `SSI <= 60%` + tree `Speed`, `LMC <= 40%`, `EnhancePotions`, `ReflectPhysical`, `INT` spell bonus), canonical `[huntpostura` postures (`agressivo` `+20%` dmg / `+40%` taken, `equilibrado` `0%/0%`, `defensivo` `-40%` dmg / `-20%` taken), `+8%` weapon / `+12%` armor material-tier step ladder, secondary-target `splashRatio`, class weapon speeds, 1H (`48,000`) / 2H (`41,140`) / Shield `CheckParry` math, and exact `ro(e)` hotbar trigger thresholds (`hp<=50%/32%/18%`, `mana<=40%`, `zE(3)`)
- **Unified Tick Kernel Refactor, Recalibrated 5-Class Parity (`±5–8%`) & Expanded Unit Tests (`SIM-08`, `SIM-09`)**: Unify `simulateScenarioDetailed` and `simulateMultiWavePull` onto a single shared tick-step engine, recalibrate Samurai/Ninja tuning & baseline snapshots under the live formulas, and expand `tools/test_sim.ts`
- **Workbench UI & Documentation Sync, Live GitHub Pages Redeploy (`UI-04`)**: Regenerate all 5 HTML workbenches, Retina screenshots, `BALANCE_REPORT.md`, `SAMURAI_SPEC.md`, and `NINJA_SPEC.md`, and redeploy to GitHub Pages

## Requirements

### Validated

- ✓ **KB-01**: GitHub repository (`brbrainerd/uoIdle`) synced and maintained throughout all phases with automated credential/session-token sanitization — v1.0
- ✓ **KB-02**: Claim-verified UO Idle mechanics knowledgebase (`mechanics/`) with adapted `kb.py` tooling (`--self-test`, `build`, `check`) and generated `mechanics/INDEX.md` — v1.0
- ✓ **KB-03**: Deterministically formatted (`prettier`) and AST-sliced (`acorn`) domain modules from `/assets/index-CCYN0Dy6.js`, redacted live Chrome DevTools captures (`_evidence/`), and scraped wiki extracts under `mechanics/_raw/` with SHA-256 provenance in `manifest.json` — v1.0
- ✓ **KB-04**: Verbatim canonical ModernUO C# source files for Bushido, Ninjitsu, Honor/Perfection, and weapon/spell parry under `mechanics/_raw/modernuo/` — v1.0
- ✓ **INDEX-01**: Claim-verified KB pages under `mechanics/combat/` and `mechanics/systems/` documenting UO Idle's combat tick loop, cooldown/haste resolution, hit/crit/mitigation formulas, resource regeneration, status effect opcodes, and progression/equipment systems — v1.0
- ✓ **INDEX-02**: Explicit 3-tier **Engine Capability Matrix** (`mechanics/topics/engine-capability-matrix.md`) classifying every live UO Idle combat hook, trigger, and status effect as Client-Evaluated, Shared-Config, or Server-Authoritative — v1.0
- ✓ **INDEX-03**: Complete claim-verified KB pages for **Warrior** (`mechanics/classes/warrior.md`), **Mage** (`mechanics/classes/mage.md`), and **Ranger** (`mechanics/classes/ranger.md`) — v1.0
- ✓ **INDEX-04**: Canonical JSON Schemas (`schemas/{class,skill,effect}.schema.json`), TypeScript `zod` validator (`src/schemas/skill.schema.ts`), structural parity specification (`mechanics/topics/class-structural-parity.md`), and CLI validator (`tools/validate_skills.ts`) — v1.0
- ✓ **SIM-01**: Claim-verified ModernUO Bushido/Ninjitsu KB pages (`mechanics/classes/modernuo-{bushido,ninjitsu}.md`, `mechanics/modernuo/*.md`) and side-by-side idle state-machine derivation matrix (`design/MODERNUO_MAPPING.md`) — v1.0
- ✓ **SIM-02**: Deterministic 100ms-tick accumulator combat simulator (`src/sim/`, `tools/sim_balance.ts`) reproducing live Warrior, Mage, and Ranger baseline curves (`data/sim-baselines/baseline-v0.99.0.json`) — v1.0
- ✓ **SIM-03**: Automated 80-scenario 5-class Mode A & Mode B parity verification (`design/BALANCE_REPORT.md`, `data/sim-baselines/parity-5class-v0.99.0.json`) proving Samurai and Ninja stay within $\pm 5\text{–}8\%$ of live class benchmarks — v1.0
- ✓ **CLASS-01**: Complete **Samurai (Bushido)** L1–60 skill line occupying a protected **Perfection Ramp / Weapon Parry-Counter / Execute Duelist** niche with *Frenzied Whirlwind* (`L50`) and *Kensei: Amakura's Judgment* (`L60`) capstones (`design/SAMURAI_SPEC.md`) — v1.0
- ✓ **CLASS-02**: Complete **Ninja (Ninjitsu)** L1–60 skill line occupying a protected **Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation Assassin** niche with *Fukiya & Egg Bomb Barrage* (`L50`) and *Kage Bunshin: Twin Shadow Execution* (`L60`) capstones (`design/NINJA_SPEC.md`) — v1.0
- ✓ **CLASS-03**: Schema-validated drop-in definitions (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `design/drop-in/classes-patch.js`) with Dual Implementation Modes (Mode A zero-code-change & Mode B `<20 LOC` C# server hooks) — v1.0
- ✓ **CLASS-04**: Class-themed Tokuno weapon, consumable, material-tier, and affix definitions (`design/drop-in/items-bushido-ninjitsu.json`) — v1.0
- ✓ **VISUAL-01**: Custom-generated dark-fantasy UO Samurai & Ninja portraits and multi-resolution skill/milestone icons (`tools/generate_icons.py`, `mockups/assets/icons/`) — v1.0
- ✓ **VISUAL-02**: Self-contained, pixel-accurate `uoidle.com/beta` HTML/CSS skill tree and 5-class parity workbenches (`tools/build_mockups.ts`, `mockups/*.html`, `mockups/screenshots/*.png`) and master developer handoff (`README.md`) — v1.0
- ✓ **IDLE-01**: Idle-tuned mechanical refinements for *Confidence* (`samurai_confidence` Inner Calm parry-empowerment), *Evasion* (`samurai_evasion` Spell-Parry Iaido riposte), *Animal Form* (`ninja_animal_form` Kitsune & Wolf 3rd-swing spirit proc), and *Smoke Bomb* (`ninja_smoke_bomb` Vanish & Volley combo synergy) across Mode A and Mode B — v1.1
- ✓ **IDLE-02**: Evocative bilingual (`en` and `pt-BR`) lore blurbs, flavor text, and idle combat tooltips across all 12 Samurai milestones, 13 Ninja milestones, and class identity headers in `samurai.json`, `ninja.json`, `classes-patch.js`, `SAMURAI_SPEC.md`, and `NINJA_SPEC.md` — v1.1
- ✓ **SIM-04**: Expanded deterministic simulation matrices (`src/sim/`, `tools/sim_balance.ts`) modeling `Iron..Valorite` material-tier progression, Tokuno affix loadouts, and multi-wave spawn transitions while preserving $\pm 5\text{–}8\%$ 5-class parity — v1.1
- ✓ **SIM-05**: Automated unit test suite (`tools/test_sim.ts`) verifying combat engine edge cases (shieldless 1H/2H Bushido parry math, Mirror Image clone consumption, `<35%` execute boundary, poison stack ticks, Perfection ramp resets, and `0` OOM ticks) — v1.1
- ✓ **ART-01**: Authentic in-game UO ability gump extraction from `uoidle.com/packs/ability-icons/ability-icons.png` and high-detail AI-generated oil-painted raster icons for custom capstones/badges and thematic Tokuno abilities — `0` procedural `ImageDraw.polygon` icons — v1.1
- ✓ **ART-02**: Authentic in-game UO equipment & item sprite extraction from `uoidle.com/packs/art/art.png` and `uoidle.com/packs/paperdoll/` for all Samurai & Ninja starter gear, Tokuno weapons, and Ninjitsu tools — v1.1
- ✓ **UI-01**: Interactive visual paperdoll component (`samurai-skill-tree.html`, `ninja-skill-tree.html`) displaying actual UO gear sprites per slot with rich mouseover tooltips (stats, `Iron..Valorite` material scaling, weapon speed/damage, `WeaponAbility` links, and Tokuno affixes) — v1.1
- ✓ **UI-02**: Rich visual simulator telemetry dashboard (`class-comparison.html`, guided by `/gsd-ui-phase` `09-UI-SPEC.md`) featuring interactive SVG DPS & EHP progression charts, damage source breakdown bars, `Iron..Valorite` gear-tier scaling explorer, and combat rotation timeline — v1.1
- ✓ **UI-03**: CV visual audit (`read_file` inspection of Retina Chrome screenshots across `1600px`, `1280px`, `768px`, `500px` + `ui_components.ts` v2.1 component library & live 100ms combat ticker) across all front-facing pages and icon sheets with zero clipping, overlap, or polygonal artifacts — v1.1
- ✓ **HOST-01**: Lead Developer Review Portal (`index.html` / `mockups/index.html`) with guided executive walkthrough, interactive demo links, and direct repository file navigation, deployed live on GitHub Pages (`https://brbrainerd.github.io/uoIdle/`) — v1.1

### Active

- [ ] **KB-05**: Comprehensive Knowledgebase Audit & Multi-Source Rank Promotion (`mechanics/combat/*.md`, `mechanics/systems/*.md`, `mechanics/classes/*.md`, `mechanics/modernuo/*.md`) promoting corroborated claims to `[verified]` and eliminating uncited `_raw/` slices
- [ ] **KB-06**: Expanded Knowledgebase Coverage for Bestiary/Enemy Archetypes, Hunting Bot `[huntpostura` Rules, Progression Tree `[Arvore` Scaling, and a dedicated Simulator Fidelity Audit topic (`mechanics/topics/simulator-fidelity-audit.md`)
- [ ] **SIM-06**: Live-Codebase Combat Math & Hard Cap Enforcement in `src/sim/engine.ts` (`SDI <= 50%` + `INT` scaling, `DI <= 100%` + skill `>100` flattening, gear `SSI <= 60%` + tree `Speed`, `LMC <= 40%`, `EnhancePotions`, `ReflectPhysical`, defender `DCI` in `computeHitChance`, 1H `48,000` / 2H `41,140` / Shield `CheckParry` math, and secondary-target `splashRatio`)
- [ ] **SIM-07**: Authentic Hunting Bot Postures (`agressivo` `+20%` dmg / `+40%` taken, `equilibrado` `0%/0%`, `defensivo` `-40%` dmg / `-20%` taken), `+8%` weapon / `+12%` armor material-tier step ladder, class-authentic weapon speeds, and exact `ro(e)` hotbar auto-trigger thresholds (`hp<=50%/32%/18%`, `mana<=40%`, `zE(3)`) in `src/sim/archetypes.ts` and `src/sim/engine.ts`
- [ ] **SIM-08**: Unified Tick-Step Kernel Refactor in `src/sim/engine.ts` eliminating the 340-line loop duplication between `simulateScenarioDetailed` and `simulateMultiWavePull` while recalibrating 5-class Mode A & Mode B parity within $\pm 5\text{–}8\%$ across all scenarios
- [ ] **SIM-09**: Expanded Automated Unit Test Suite (`tools/test_sim.ts`) verifying all live caps (`SDI`, `DI`, `SSI`, `LMC`), `[huntpostura` incoming/outgoing multipliers, `+8%/+12%` material ladder, `splashRatio`, 1H/2H/Shield parry divisors, `ro(e)` potion/heal/AoE triggers, and single-wave vs. multi-wave kernel equivalence
- [ ] **UI-04**: Synchronized Workbench UI, Design Specs (`BALANCE_REPORT.md`, `SAMURAI_SPEC.md`, `NINJA_SPEC.md`), Retina Screenshots, and Live GitHub Pages Redeployment (`https://brbrainerd.github.io/uoIdle/`) reflecting `v1.2` simulator telemetry

### Out of Scope

- Modifying or attacking live production servers — all scraping and auditing is strictly read-only inspection of the authenticated beta client, bundle, and public docs/wiki
- Procedural geometric `PIL.ImageDraw.polygon` icon placeholders — strictly forbidden; every icon must be a real in-game UO gump/item sprite or high-detail raster artwork
- Tile-distance movement mechanics (*20-tile Ki Attack run*, *5-step enemy walk*, *ground-targeted Shadowjump*) — incompatible with automated 24/7 idle combat; replaced by temporal/combo state machines

## Context

- **Current State (`v1.0` & `v1.1` Shipped 2026-11-07, Starting `v1.2`)**:
  - **Knowledgebase (`mechanics/`)**: 31 claim-verified markdown pages (`290+` verbatim line-cited claims) backed by 68 SHA-256-verified raw files (`mechanics/_raw/manifest.json`). Audit identified opportunities to promote multi-source corroborated pages to `verified` and cover `bestiary-and-wiki.js`, `hunt-and-bot-config.js`, and `progression-tree-ui.js`.
  - **Simulator Audit (`src/sim/engine.ts`, `src/sim/archetypes.ts`)**: Identified 7 concrete math/fidelity gaps against live `v0.99.0` bundle/server rules (`SDI`/`DI`/`SSI`/`LMC` caps, `[huntpostura` postures, `+8%/+12%` material steps, `splashRatio`, `ro(e)` hotbar thresholds, 1H/2H/shield `CheckParry`, and `simulateMultiWavePull` loop duplication).
  - **GitHub Pages Live**: Hosted at `https://brbrainerd.github.io/uoIdle/` with 7/7 verification gates (`npm run verify:all`).

## Constraints

- **Verification Integrity**: Every UO Idle mechanic, formula, and skill stat in the knowledgebase must cite verbatim `_raw/` extracts from the live game bundle, network state, or official wiki/docs — never guessed.
- **Zero Polygonal Icons**: Never use procedural `ImageDraw.polygon` icons; use authentic in-game UO gumps/art from `uoidle.com/packs/` or high-detail AI-generated raster art.
- **Structural Parity**: Ninja and Samurai skill lines must use the exact unlock level tiers and active/passive slot progression used by Warrior, Mage, and Ranger in live UO Idle.
- **Numerical Balance**: Damage output, survivability, resource economy, and utility across level brackets and gear tiers must be mathematically balanced against the live Warrior, Mage, and Ranger formulae.
- **Credential Sanitization**: Zero session tokens, cookies, or private credentials may ever be committed (`kb.py check` enforces automated secret scanning).

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full claim-verified KB (`kb.py` + `_raw/` + `INDEX.md`) | Prevents hallucinated game mechanics and gives both agents and the lead developer traceable citations to live code/docs | ✓ Good (31 pages, 0 check errors, 28/28 self-test mutations caught) |
| Match existing Warrior/Mage/Ranger unlock tiers & active/passive structure | Ensures the lead developer can drop Ninja and Samurai directly into the existing class progression engine | ✓ Good (12 progression milestones at `[1,5,10,15,20,25,30,35,40,45,50,60]` verified) |
| Dual Implementation Modes (Mode A zero-code-change + Mode B `<20 LOC` C# hooks) | Lets the lead developer ship immediately via config tables or wire native Bushido/Ninjitsu C# hooks in under 20 lines | ✓ Good (Both modes verified within $\pm 5\text{–}8\%$ parity across all 80 scenarios) |
| Replace generic Rank II L50/L60 abilities with distinct Tokuno/Grandmaster capstones | Gives Samurai and Ninja exciting, lore-authentic L50/L60 unlocks while maintaining 100% backward compatibility with `abilities-catalog.json` IDs | ✓ Good |
| Switch `brbrainerd/uoIdle` to public & enable GitHub Pages (`v1.1`) | Allows hosting live interactive demos at `https://brbrainerd.github.io/uoIdle/` for immediate review by the UO Idle lead developer | ✓ Good (Deployed via `_site` staging artifact with HTTP 200 across all 5 surfaces) |
| Extract real UO gump/item sprites from `uoidle.com/packs/` + AI raster art (`v1.1`) | Replaces procedural Pillow polygons with authentic Ultima Online gump/item art and oil-painted dark-fantasy icons | ✓ Good (`zeroPolygons: true`, 140 ability PNGs + 37 item/paperdoll PNGs verified with `stdDev >= 12.0` and SHA-256) |
| Consolidate UI into v2.1 Component Architecture (`tools/ui_components.ts`) | Eliminates duplicate ability catalogs, adds progressive-disclosure schema drawers, live Mode A/B interactivity, and a 100ms tick combat preview across all breakpoints (`1600px`..`500px`) | ✓ Good (Verified via multi-resolution CV flywheel) |
| Enforce live `v0.99.0` stat caps, `[huntpostura` postures, `+8%/+12%` material ladder, `splashRatio`, and unified tick kernel (`v1.2`) | Eliminates simulator drift at L45/L60/Valorite tiers and guarantees 1:1 behavioral parity between single-wave and multi-wave simulations | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-11-07 after v1.2 milestone initialization*
