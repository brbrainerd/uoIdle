# Roadmap: UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

## Overview

This roadmap delivers a 100% source-verified mechanics knowledgebase of **UO Idle** (`https://uoidle.com/beta`) and a complete, drop-in class design and engineering package for **Samurai** (grounded in Ultima Online's *Bushido*) and **Ninja** (grounded in Ultima Online's *Ninjitsu*). The project progresses through six sequential phases: establishing the private repository, `kb.py` claim-verification linter, and immutable `_raw/` extraction pipeline (Phase 1); reverse-engineering UO Idle's core combat tick loop, formulas, and server/client capability boundaries (Phase 2); indexing the live Warrior, Mage, and Ranger skill lines into strict JSON/TypeScript schemas (Phase 3); documenting canonical ModernUO C# Bushido/Ninjitsu formulas and calibrating a deterministic baseline combat simulator (Phase 4); authoring and parity-tuning the Samurai and Ninja skill lines, Tokuno weapon/item affixes, and dual-mode drop-in code definitions (Phase 5); and rendering custom dark-fantasy skill iconography inside pixel-accurate UO Idle beta UI mockups (Phase 6).

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [ ] **Phase 1: Repository Setup, `kb.py` Adaptation & Live Extraction Pipeline** - Private repo verification, adapted `kb.py` claim linter with credential sanitization, formatted/AST-sliced UO Idle bundle extracts, and canonical ModernUO C# source snapshots.
- [ ] **Phase 2: Core UO Idle Engine & Systems Knowledgebase** - Claim-verified KB pages for combat tick loops, hit/crit/mitigation math, resource regen, status opcodes, progression/equipment systems, and the Engine Capability Matrix.
- [ ] **Phase 3: Existing Classes Deep-Dive (`Warrior`, `Mage`, `Ranger`) & Canonical Data Schemas** - Complete claim-verified KB pages for Warrior, Mage, and Ranger alongside reverse-engineered `zod`/JSON Schemas and structural parity rules.
- [ ] **Phase 4: ModernUO Reference KB & Baseline Combat Simulator** - Claim-verified ModernUO Bushido/Ninjitsu KB pages, idle state-machine derivation matrix, and a tick-accurate combat simulator reproducing live class baselines.
- [ ] **Phase 5: Samurai (Bushido) & Ninja (Ninjitsu) Skill Line Design, Parity Tuning & Drop-In Code** - Numerically balanced Samurai and Ninja skill lines, Tokuno equipment affixes, Mode A/Mode B drop-in JSON/JS payloads, formal specs, and automated parity proof.
- [ ] **Phase 6: Visual Beta UI Mockups, Custom Iconography & Final Deliverable Packaging** - Custom dark-fantasy UO class portraits and skill icons rendered inside self-contained, pixel-accurate `uoidle.com/beta` HTML/CSS skill tree mockups.

## Phase Details

### Phase 1: Repository Setup, `kb.py` Adaptation & Live Extraction Pipeline
**Goal**: Establish the private repository workflow, adapt `mechanics/tools/kb.py` for UO Idle categories, evidence rankings, and credential sanitization, and populate `mechanics/_raw/` with deterministically formatted client bundle modules, redacted live runtime captures, wiki extracts, and canonical ModernUO C# source files.
**Mode:** mvp
**Depends on**: Nothing (first phase)
**Requirements**: [KB-01, KB-02, KB-03, KB-04]
**Success Criteria** (what must be TRUE):
  1. Developer can sync and access the repository at `https://github.com/brbrainerd/uoIdle` with visibility verified as `PRIVATE` and an automated credential/token scanner blocking secret leaks (`Bearer`, `eyJ`, cookies, session tokens) before commit.
  2. Running `python3 mechanics/tools/kb.py --self-test`, `python3 mechanics/tools/kb.py build --root mechanics`, and `python3 mechanics/tools/kb.py check --root mechanics` exits `0` with `"ok": true`, enforcing UO Idle categories, evidence rank hierarchy (`contradicted < unverified < modernuo-stated < doc-stated < bundle-stated < verified`), verbatim `(raw L<a>-L<b>)` quote spans, and digit-free `## Summary` sections.
  3. Developer can inspect `prettier`-formatted and `acorn` AST-sliced domain modules from `/assets/index-CCYN0Dy6.js`, redacted Chrome DevTools runtime/network captures (`_evidence/`), and scraped documentation/wiki extracts under `mechanics/_raw/` tracked with SHA-256 hashes in `mechanics/_raw/manifest.json`.
  4. Developer can inspect verbatim canonical ModernUO C# source files for all Bushido spells (`Projects/UOContent/Spells/Bushido/*.cs`), Ninjitsu spells/items (`Projects/UOContent/Spells/Ninjitsu/*.cs`, `SmokeBomb.cs`), Honor/Perfection (`HonorContext.cs`), and weapon/spell parry (`BaseWeapon.cs`) under `mechanics/_raw/modernuo/`.
**Plans**: 3 plans

Plans:
- [ ] 01-01: Private GitHub repository audit, directory scaffolding, and `mechanics/tools/kb.py` adaptation with `--self-test` and credential sanitization (`KB-01`, `KB-02`)
- [ ] 01-02: Live UO Idle bundle AST extraction (`tools/bundle_extract.mjs`), read-only Chrome DevTools runtime/network capture, and wiki/doc scraping with `manifest.json` provenance (`KB-03`)
- [ ] 01-03: Canonical ModernUO C# Bushido, Ninjitsu, Perfection, and Parry source extraction (`tools/fetch_modernuo.py`) (`KB-04`)

### Phase 2: Core UO Idle Engine & Systems Knowledgebase
**Goal**: Reverse-engineer and document UO Idle's core combat tick loop, cooldown/haste resolution, hit/crit/mitigation math, resource economy, status effect opcodes, progression/equipment systems, and client-vs-server execution authority in claim-verified KB pages.
**Mode:** mvp
**Depends on**: Phase 1
**Requirements**: [INDEX-01, INDEX-02]
**Success Criteria** (what must be TRUE):
  1. Developer can look up claim-verified KB pages under `mechanics/combat/` (`tick-and-cooldowns.md`, `damage-and-defense.md`, `resources.md`, `status-effects.md`) and `mechanics/systems/` (`progression-unlocks.md`, `equipment-affixes.md`) where every formula and rule cites exact line spans from `mechanics/_raw/`.
  2. Developer can audit an explicit **Engine Capability Matrix** classifying every live UO Idle combat hook, trigger, and status effect opcode as Client-Evaluated, Shared-Config, or Server-Authoritative based on bundle and live WebSocket/network verification.
  3. `python3 mechanics/tools/kb.py check --root mechanics` passes with zero errors across all core engine and system KB pages and regenerates `mechanics/INDEX.md`.
**Plans**: 2 plans

Plans:
- [ ] 02-01: Core combat tick loop, cooldown/haste math, hit/crit/mitigation formulas, and resource regeneration KB pages (`INDEX-01`)
- [ ] 02-02: Status effect opcodes, progression/equipment systems KB pages, and Engine Capability Matrix audit (`INDEX-01`, `INDEX-02`)

### Phase 3: Existing Classes Deep-Dive (`Warrior`, `Mage`, `Ranger`) & Canonical Data Schemas
**Goal**: Produce complete, claim-verified knowledgebase pages for live Warrior, Mage, and Ranger skill lines and codify the exact JSON Schema / TypeScript (`zod`) contracts and structural parity rules that govern UO Idle classes.
**Mode:** mvp
**Depends on**: Phase 2
**Requirements**: [INDEX-03, INDEX-04]
**Success Criteria** (what must be TRUE):
  1. Developer can consult `mechanics/classes/warrior.md`, `mechanics/classes/mage.md`, and `mechanics/classes/ranger.md` to inspect every live active/passive skill, unlock level, cooldown, resource cost, scaling coefficient, and status effect interaction with verbatim `(raw L<a>-L<b>)` citations.
  2. Developer can inspect `mechanics/topics/class-structural-parity.md` and `mechanics/topics/combat-niches.md` defining the exact unlock level tier brackets, active/passive slot ratios, and combat role boundaries across all live classes.
  3. Developer can run schema validation against `schemas/{class,skill,effect}.schema.json` (and TypeScript `zod` definitions) and verify that the extracted live Warrior, Mage, and Ranger JSON payloads pass 100% validation.
**Plans**: 2 plans

Plans:
- [ ] 03-01: Claim-verified KB pages for live Warrior, Mage, and Ranger skill lines (`mechanics/classes/{warrior,mage,ranger}.md`) (`INDEX-03`)
- [ ] 03-02: Cross-class structural parity topic (`mechanics/topics/class-structural-parity.md`) and `zod` / JSON Schema validation contracts (`schemas/{class,skill,effect}.schema.json`) (`INDEX-04`)

### Phase 4: ModernUO Reference KB & Baseline Combat Simulator
**Goal**: Document canonical ModernUO Bushido and Ninjitsu C# mechanics in claim-verified KB pages, map all 17 abilities to automated idle state-machine primitives, and build a deterministic tick-accurate combat simulator reproducing Warrior, Mage, and Ranger baseline curves.
**Mode:** mvp
**Depends on**: Phase 3
**Requirements**: [SIM-01, SIM-02]
**Success Criteria** (what must be TRUE):
  1. Developer can read `mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md` alongside `design/MODERNUO_MAPPING.md` to trace all 8 Bushido mechanics (*Weapon Parry*, *Perfection & Honor*, *Honorable Execution*, *Confidence*, *Counter Attack*, *Lightning Strike*, *Evasion*, *Momentum Strike*) and 9 Ninjitsu mechanics (*Mirror Image*, *Focus Attack*, *Backstab*, *Smoke Bomb & Stealth*, *Shadowjump*, *Surprise Attack*, *Ki Attack*, *Death Strike*, *Animal Form*) from verbatim ModernUO C# formulas to idle-compatible state machines.
  2. Developer can run `npx tsx tools/sim_balance.ts` to deterministically simulate live Warrior, Mage, and Ranger combat loops across Early, Mid, Late, and Endgame level brackets against both fast trash waves and sustained boss archetypes.
  3. Baseline simulator outputs match the verified UO Idle combat math from Phases 2–3 and produce reproducible reference benchmarks for Sustained Boss DPS, Trash TTK (with overkill waste), Net Resource Delta/min, and Effective HP (EHP)/sec.
**Plans**: 2 plans

Plans:
- [ ] 04-01: Claim-verified ModernUO Bushido & Ninjitsu KB pages and side-by-side idle adaptation matrix (`design/MODERNUO_MAPPING.md`) (`SIM-01`)
- [ ] 04-02: Deterministic tick-accurate combat simulator (`tools/sim_balance.ts` / `sim/`) and live Warrior, Mage, and Ranger baseline curves (`SIM-02`)

### Phase 5: Samurai (Bushido) & Ninja (Ninjitsu) Skill Line Design, Parity Tuning & Drop-In Code
**Goal**: Design, balance-tune, and package complete Samurai (Bushido) and Ninja (Ninjitsu) skill lines, Tokuno weapon/equipment affixes, dual-mode drop-in JSON/JS definitions, formal design specifications, and an automated 5-class parity report.
**Mode:** mvp
**Depends on**: Phase 4
**Requirements**: [SIM-03, CLASS-01, CLASS-02, CLASS-03, CLASS-04]
**Success Criteria** (what must be TRUE):
  1. Developer receives `design/SAMURAI_SPEC.md` and `design/NINJA_SPEC.md` defining complete Samurai (**Perfection Ramp / Weapon Parry-Counter / Execute**) and Ninja (**Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation**) skill lines that match live Warrior/Mage/Ranger unlock level tiers and active/passive slot counts 1:1.
  2. Developer receives `design/drop-in/samurai.json`, `design/drop-in/ninja.json`, and `design/drop-in/classes-patch.js` that pass `schemas/class.schema.json` validation and support both **Mode A** (100% existing UO Idle engine opcodes, zero engine code changes) and **Mode B** (minimal `<20 LOC` native hook specification for clone interception and 5-hit delayed detonation).
  3. Developer receives `design/drop-in/items-bushido-ninjitsu.json` (and specification tables) defining class-themed Tokuno armaments (*Katana*, *No-Dachi*, *Wakizashi*, *Lajatang*, *Tekagi*, *Kama*, *Fukiya*, *Tessen*) and affixes balanced against live equipment progression.
  4. Running `npx tsx tools/sim_balance.ts` generates `design/BALANCE_REPORT.md` proving that Samurai and Ninja stay within $\pm 5\text{–}8\%$ of Warrior, Mage, and Ranger across Sustained Boss DPS, Trash TTK (including overkill), Net Resource Sustainability/min, and EHP/sec across all four level brackets with zero avoidance-immortality or mana-starvation loops.
**Plans**: 3 plans

Plans:
- [ ] 05-01: Samurai (Bushido) skill line architecture, drop-in `design/drop-in/samurai.json`, Mode A/B definitions, and `design/SAMURAI_SPEC.md` (`CLASS-01`, `CLASS-03`)
- [ ] 05-02: Ninja (Ninjitsu) skill line architecture, drop-in `design/drop-in/ninja.json`, Mode A/B definitions, and `design/NINJA_SPEC.md` (`CLASS-02`, `CLASS-03`)
- [ ] 05-03: Tokuno weapon/equipment affix definitions (`design/drop-in/items-bushido-ninjitsu.json`), 5-class multi-bracket parity tuning, `design/drop-in/classes-patch.js`, and `design/BALANCE_REPORT.md` (`CLASS-04`, `SIM-03`)

### Phase 6: Visual Beta UI Mockups, Custom Iconography & Final Deliverable Packaging
**Goal**: Generate custom dark-fantasy Ultima Online / UO Idle-styled class portraits and skill iconography, render self-contained HTML/CSS beta UI mockups directly from the finalized Samurai and Ninja JSON payloads, capture high-resolution verification screenshots, and sync the complete verified package to the private GitHub repository.
**Mode:** mvp
**UI hint**: yes
**Depends on**: Phase 5
**Requirements**: [VISUAL-01, VISUAL-02]
**Success Criteria** (what must be TRUE):
  1. Developer receives custom dark-fantasy Ultima Online / UO Idle-styled class portraits and crisp $64\times 64$ / $48\times 48$ skill icons for every Samurai and Ninja active and passive ability under `mockups/assets/icons/{samurai,ninja}/`.
  2. Developer can open self-contained HTML/CSS mockups (`mockups/samurai-skill-tree.html`, `mockups/ninja-skill-tree.html`, `mockups/class-comparison.html`) and inspect high-resolution DevTools screenshots that render the exact skill names, unlock tiers, resource costs, cooldowns, and tooltips from `design/drop-in/{samurai,ninja}.json` inside `https://uoidle.com/beta`'s visual theme (`#0b0d0a`, `Cinzel` + `IBM Plex Sans`).
  3. Final end-to-end verification (`kb.py check`, schema validation, simulator parity check, and git secret audit) exits `0` and all deliverables are synced to the private `brbrainerd/uoIdle` repository.
**Plans**: 2 plans

Plans:
- [ ] 06-01: Custom dark-fantasy UO class portraits and active/passive skill icon generation & post-processing (`mockups/assets/icons/{samurai,ninja}/`) (`VISUAL-01`)
- [ ] 06-02: Pixel-accurate `uoidle.com/beta` HTML/CSS skill tree and 5-class comparison mockups, high-res DevTools captures, and final repository verification (`VISUAL-02`)

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Repository Setup, `kb.py` Adaptation & Live Extraction Pipeline | 0/3 | Not started | - |
| 2. Core UO Idle Engine & Systems Knowledgebase | 0/2 | Not started | - |
| 3. Existing Classes Deep-Dive (`Warrior`, `Mage`, `Ranger`) & Canonical Data Schemas | 0/2 | Not started | - |
| 4. ModernUO Reference KB & Baseline Combat Simulator | 0/2 | Not started | - |
| 5. Samurai (Bushido) & Ninja (Ninjitsu) Skill Line Design, Parity Tuning & Drop-In Code | 0/3 | Not started | - |
| 6. Visual Beta UI Mockups, Custom Iconography & Final Deliverable Packaging | 0/2 | Not started | - |
