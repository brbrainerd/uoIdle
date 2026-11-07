# UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

## What This Is

A comprehensive reverse-engineering knowledgebase of **UO Idle** (`https://uoidle.com/beta`) and a complete, drop-in class design package for two hypothetical classes—**Ninja** (based on Ultima Online's *Ninjitsu*) and **Samurai** (based on Ultima Online's *Bushido*)—commissioned for the lead developer of UO Idle. It combines a claim-verified local mechanics knowledgebase (modeled after `mudlet-dragonball-evolution/mechanics/`) scraped from the live game client, network surfaces, documentation, and wiki with mechanically and numerically balanced skill lines, drop-in code/JSON definitions, formal design specifications, and UI/icon visual mockups.

## Core Value

Deliver mechanically authentic (grounded in ModernUO Bushido/Ninjitsu), numerically balanced (parity-tested against live Warrior, Mage, and Ranger formulae), and implementation-ready Ninja and Samurai skill lines backed by a 100% source-verified UO Idle mechanics knowledgebase.

## Requirements

### Validated

- ✓ **KB-01**: Private GitHub repository (`brbrainerd/uoIdle`) synced and maintained throughout all phases with automated credential/session-token sanitization — v1.0
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
- ✓ **VISUAL-01**: Custom-generated dark-fantasy UO Samurai & Ninja portraits and 140 super-sampled PNG skill/milestone icons (`tools/generate_icons.py`, `mockups/assets/icons/`) — v1.0
- ✓ **VISUAL-02**: Self-contained, pixel-accurate `uoidle.com/beta` HTML/CSS skill tree and 5-class parity workbenches (`tools/build_mockups.ts`, `mockups/*.html`, `mockups/screenshots/*.png`) and master developer handoff (`README.md`) — v1.0

### Active

- [ ] **SANDBOX-01**: Interactive browser-based HTML/JS balance slider sandbox allowing live tweaking of skill coefficients with real-time DPS/EHP chart updates (v2 candidate)
- [ ] **SANDBOX-02**: Additional ModernUO expansion skill line adaptations (*Chivalry / Paladin*, *Necromancy*, *Spellweaving*) and Level I–III Mastery Ascensions (v2 candidate)

### Out of Scope

- Modifying or attacking live production servers — all scraping and auditing is strictly read-only inspection of the authenticated beta client, bundle, and public docs/wiki
- Inventing arbitrary class progression structures that break Warrior/Mage/Ranger structural parity — Ninja and Samurai must slot cleanly into UO Idle's existing level tiers and active/passive architecture
- Tile-distance movement mechanics (*20-tile Ki Attack run*, *5-step enemy walk*, *ground-targeted Shadowjump*) — incompatible with automated 24/7 idle combat; replaced by temporal/combo state machines
- Unconditional self-sabotaging failure penalties (*Honorable Execution* $-40$ all resists on non-kill) — replaced by conditional threshold execute scaling
- Consumable backpack item depletion for core rotations (*Smoke Bomb* stacks, *Shuriken*/*Fukiya* charges) — converted to standard cooldown/resource skills
- Weapon-locking modal selection Gumps (*Animal Form* popup disabling weapon skills) — adapted as an 8.0s combat aspect buff

## Context

- **Current State (`v1.0` Shipped 2026-11-07)**:
  - **Knowledgebase (`mechanics/`)**: 31 claim-verified markdown pages (`290+` verbatim line-cited claims) backed by 68 SHA-256-verified raw files (`mechanics/_raw/manifest.json`) across `bundle/`, `modernuo/`, `wiki/`, and `_evidence/`.
  - **Schemas & Validators (`schemas/`, `src/schemas/`, `tools/validate_skills.ts`)**: Strict Draft 2020-12 JSON Schemas and TypeScript `zod` schemas validating all 5 classes (`warrior`, `mage`, `ranger`, `samurai`, `ninja`) and 134 catalog abilities.
  - **Simulator (`src/sim/`, `tools/sim_balance.ts`)**: Deterministic `100ms`-tick accumulator combat simulator verifying 80 scenarios (`5` classes × `4` brackets × `4` archetypes × `2` modes) with `0.00%` run-to-run variance.
  - **Drop-In Package & Visual Workbenches (`design/`, `mockups/`)**: Complete Mode A & Mode B JSON/JS payloads, 140 custom dark-fantasy PNG icon assets, and 3 interactive `uoidle.com/beta` HTML/CSS workbenches (`samurai-skill-tree.html`, `ninja-skill-tree.html`, `class-comparison.html`).

## Constraints

- **Verification Integrity**: Every UO Idle mechanic, formula, and skill stat in the knowledgebase must cite verbatim `_raw/` extracts from the live game bundle, network state, or official wiki/docs — never guessed.
- **Structural Parity**: Ninja and Samurai skill lines must use the exact unlock level tiers and active/passive slot progression used by Warrior, Mage, and Ranger in live UO Idle.
- **Numerical Balance**: Damage output, survivability, resource economy, and utility across level brackets must be mathematically balanced against the live Warrior, Mage, and Ranger formulae.
- **Repository Privacy**: GitHub repository (`https://github.com/brbrainerd/uoIdle`) must remain private and synced.

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Full claim-verified KB (`kb.py` + `_raw/` + `INDEX.md`) | Prevents hallucinated game mechanics and gives both agents and the lead developer traceable citations to live code/docs | ✓ Good (31 pages, 0 check errors, 28/28 self-test mutations caught) |
| Match existing Warrior/Mage/Ranger unlock tiers & active/passive structure | Ensures the lead developer can drop Ninja and Samurai directly into the existing class progression engine | ✓ Good (12 progression milestones at `[1,5,10,15,20,25,30,35,40,45,50,60]` verified) |
| Dual Implementation Modes (Mode A zero-code-change + Mode B `<20 LOC` C# hooks) | Lets the lead developer ship immediately via config tables or wire native Bushido/Ninjitsu C# hooks in under 20 lines | ✓ Good (Both modes verified within $\pm 5\text{–}8\%$ parity across all 80 scenarios) |
| Replace generic Rank II L50/L60 abilities with distinct Tokuno/Grandmaster capstones (*Frenzied Whirlwind*, *Kensei: Amakura's Judgment*, *Fukiya & Egg Bomb Barrage*, *Kage Bunshin: Twin Shadow Execution*) while preserving `aliasOf` catalog provenance | Gives Samurai and Ninja exciting, lore-authentic L50/L60 unlocks while maintaining 100% backward compatibility with pre-existing `abilities-catalog.json` IDs | ✓ Good |
| Include drop-in code/JSON + formal spec + UI mockups & generated art | Provides a complete, pitch-ready and implementation-ready package for the UO Idle lead developer | ✓ Good |

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
*Last updated: 2026-11-07 after v1.0 milestone*
