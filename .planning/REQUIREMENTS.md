# Requirements: UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

**Defined:** 2026-11-06
**Core Value:** Deliver mechanically authentic (grounded in ModernUO Bushido/Ninjitsu), numerically balanced (parity-tested against live Warrior, Mage, and Ranger formulae), and implementation-ready Ninja and Samurai skill lines backed by a 100% source-verified UO Idle mechanics knowledgebase.

## v1 Requirements

Requirements for the v1 deliverable package. Each maps to a roadmap phase.

### Repository & Knowledgebase Tooling (`KB`)

- [x] **KB-01**: Developer can sync and access all project artifacts in a private GitHub repository (`brbrainerd/uoIdle`) with automated credential/session-token sanitization blocking leaked secrets before commit
- [x] **KB-02**: Developer or agent can run `python3 mechanics/tools/kb.py build` and `python3 mechanics/tools/kb.py check` (including `--self-test`) to validate frontmatter, verbatim `(raw L<a>-L<b>)` claim quotes, digit-free `## Summary` sections, evidence rank hierarchy (`contradicted < unverified < modernuo-stated < doc-stated < bundle-stated < verified`), and generate `mechanics/INDEX.md`
- [x] **KB-03**: Developer can inspect deterministically formatted (`prettier`) and AST-sliced (`acorn`) domain modules from the live UO Idle client bundle (`/assets/index-CCYN0Dy6.js`), redacted live Chrome DevTools runtime/network captures (`_evidence/`), and scraped documentation/wiki extracts under `mechanics/_raw/` with SHA-256 provenance in `manifest.json`
- [x] **KB-04**: Developer can inspect verbatim canonical ModernUO C# source files for Bushido (`Projects/UOContent/Spells/Bushido/*.cs`), Ninjitsu (`Projects/UOContent/Spells/Ninjitsu/*.cs`, `SmokeBomb.cs`), Honor/Perfection (`HonorContext.cs`), and weapon/spell parry (`BaseWeapon.cs`) under `mechanics/_raw/modernuo/`

### Core Engine & Live Classes Knowledgebase (`INDEX`)

- [x] **INDEX-01**: Developer can look up claim-verified KB pages under `mechanics/combat/` and `mechanics/systems/` documenting UO Idle's combat tick loop, cooldown/haste resolution, hit/crit/armor/resistance mitigation formulas, resource regeneration, status effect opcodes, and progression/equipment systems
- [x] **INDEX-02**: Developer can audit an explicit **Engine Capability Matrix** classifying every live UO Idle combat hook, trigger, and status effect as Client-Evaluated, Shared-Config, or Server-Authoritative
- [x] **INDEX-03**: Developer can look up complete, claim-verified KB pages for **Warrior** (`mechanics/classes/warrior.md`), **Mage** (`mechanics/classes/mage.md`), and **Ranger** (`mechanics/classes/ranger.md`) covering every active/passive skill, unlock level, resource cost, cooldown, scaling formula, and status interaction
- [x] **INDEX-04**: Developer can validate any live or candidate class, skill, and status effect definition against reverse-engineered JSON Schemas and TypeScript `zod` contracts (`schemas/{class,skill,effect}.schema.json`) and a structural parity specification (`mechanics/topics/class-structural-parity.md`)

### ModernUO Reference & Combat Balance Simulator (`SIM`)

- [x] **SIM-01**: Developer can consult claim-verified KB pages (`mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md`) and a side-by-side derivation table (`design/MODERNUO_MAPPING.md`) mapping all 8 Bushido mechanics (*Weapon Parry*, *Perfection & Honor*, *Honorable Execution*, *Confidence*, *Counter Attack*, *Lightning Strike*, *Evasion*, *Momentum Strike*) and 9 Ninjitsu mechanics (*Mirror Image*, *Focus Attack*, *Backstab*, *Smoke Bomb & Stealth*, *Shadowjump*, *Surprise Attack*, *Ki Attack*, *Death Strike*, *Animal Form*) from ModernUO C# formulas to automated idle state machines
- [x] **SIM-02**: Developer can run a deterministic tick-accurate combat simulator (`tools/sim_balance.ts` / `sim/`) reproducing live **Warrior**, **Mage**, and **Ranger** baseline curves across Early, Mid, Late, and Endgame level brackets and enemy archetypes (fast trash waves vs sustained bosses)
- [ ] **SIM-03**: Developer can verify via automated parity reports (`design/BALANCE_REPORT.md`) that **Samurai** and **Ninja** stay within $\pm 5\text{–}8\%$ of live class benchmarks across Sustained Boss DPS, Trash TTK (accounting for overkill waste), Net Resource Sustainability/min, and Effective HP (EHP)/sec without avoidance-immortality or mana-starvation loops

### Samurai & Ninja Skill Lines & Drop-In Deliverables (`CLASS`)

- [ ] **CLASS-01**: Developer receives a complete **Samurai (Bushido)** skill line matching live class unlock tiers and active/passive slot counts, occupying a protected **Perfection Ramp / Weapon Parry-Counter / Execute** combat niche (`design/SAMURAI_SPEC.md`)
- [ ] **CLASS-02**: Developer receives a complete **Ninja (Ninjitsu)** skill line matching live class unlock tiers and active/passive slot counts, occupying a protected **Ablative Clone Mitigation / Stealth-State Opener / 5-Hit Delayed Detonation** combat niche (`design/NINJA_SPEC.md`)
- [ ] **CLASS-03**: Developer receives schema-validated, drop-in class and skill definitions (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`, and `design/drop-in/classes-patch.js`) with **Dual Implementation Modes**: Mode A (100% existing UO Idle engine opcodes, zero engine code changes) and Mode B (minimal `<20 LOC` native hook specification for signature clone-interception and 5-hit delayed mark mechanics)
- [ ] **CLASS-04**: Developer receives class-themed weapon and equipment affix definitions (`design/drop-in/items-bushido-ninjitsu.json` & spec section) covering iconic Tokuno armaments (*Katana*, *No-Dachi*, *Wakizashi*, *Lajatang*, *Tekagi*, *Kama*, *Fukiya*, *Tessen*) balanced against live itemization curves

### Visual Beta UI Mockups & Iconography (`VISUAL`)

- [ ] **VISUAL-01**: Developer receives custom-generated dark-fantasy Ultima Online / UO Idle-styled class portraits and a full set of crisp $64\times 64$ / $48\times 48$ skill icons for every **Samurai** and **Ninja** active and passive ability (`mockups/assets/icons/{samurai,ninja}/`)
- [ ] **VISUAL-02**: Developer can open self-contained, pixel-accurate HTML/CSS beta UI mockups (`mockups/samurai-skill-tree.html`, `mockups/ninja-skill-tree.html`, `mockups/class-comparison.html`) and high-resolution DevTools screenshots that render the finalized `samurai.json` and `ninja.json` skills, tooltips, unlock tiers, and icons inside `https://uoidle.com/beta`'s exact visual theme (`#0b0d0a`, `Cinzel` + `IBM Plex Sans`)

## v2 Requirements

Deferred to future extensions after v1 delivery.

### Interactive Developer Tooling (`SANDBOX`)

- **SANDBOX-01**: Interactive browser-based HTML/JS balance slider sandbox allowing live tweaking of skill coefficients with real-time DPS/EHP chart updates
- **SANDBOX-02**: Additional ModernUO expansion skill line adaptations (*Chivalry / Paladin*, *Necromancy*, *Spellweaving*) and Level I–III Mastery Ascensions

## Out of Scope

Explicitly excluded to protect verification integrity and idle-loop compatibility.

| Feature | Reason |
|---------|--------|
| Live server mutation or packet injection on `uoidle.com/beta` | Strictly read-only inspection; all combat testing runs in the local deterministic simulator |
| Tile-distance movement mechanics (*20-tile Ki Attack run*, *5-step enemy walk*, *ground-targeted Shadowjump*) | Incompatible with automated 24/7 idle combat; replaced by temporal/combo state machines |
| Unconditional self-sabotaging failure penalties (*Honorable Execution* $-40$ all resists on non-kill) | Causes unavoidable AFK deaths on bosses when fired on cooldown; replaced by conditional kill/threshold reward scaling |
| Consumable backpack item depletion for core rotations (*Smoke Bomb* stacks, *Bandages* for Cu Sidhe) | Breaks multi-hour AFK parity with Warrior/Mage/Ranger; converted to standard cooldown/resource skills |
| Weapon-locking modal selection Gumps (*Animal Form* popup disabling weapon skills) | Halts automated play and invalidates 75% of the Ninja skill tree; adapted as passive/aspect buff |

## User Stories

- As the **UO Idle Lead Developer**, I want a 100% source-cited mechanics knowledgebase of my live game and ModernUO Bushido/Ninjitsu so that I can verify every formula and assumption without guesswork.
- As the **UO Idle Lead Developer**, I want drop-in `samurai.json` and `ninja.json` skill definitions (plus Tokuno weapon/item affixes) that match Warrior, Mage, and Ranger progression tiers and pass a tick-accurate DPS/EHP balance simulation so I can integrate Ninja and Samurai with confidence.
- As the **UO Idle Lead Developer**, I want both a zero-engine-change implementation mode (Mode A) and a minimal native hook spec (Mode B), alongside pixel-accurate beta UI mockups and custom skill icons, so I can immediately preview and ship the classes.

## Acceptance Criteria

- `python3 mechanics/tools/kb.py --self-test` and `python3 mechanics/tools/kb.py check --root mechanics` exit `0` with `"ok": true` and zero leaked credentials.
- All live Warrior, Mage, and Ranger skills, unlock levels, cooldowns, and formulas are documented in `mechanics/classes/` with verbatim `(raw L<a>-L<b>)` citations.
- `design/drop-in/{samurai,ninja}.json` validate cleanly against `schemas/class.schema.json` and match live class unlock tiers and slot counts.
- `tools/sim_balance.ts` confirms Samurai and Ninja Sustained DPS, Trash TTK, Resource Delta, and EHP fall within $\pm 5\text{–}8\%$ of Warrior, Mage, and Ranger across Early, Mid, Late, and Endgame brackets.
- `mockups/{samurai,ninja}-skill-tree.html` render all custom icons and exact JSON-sourced skill tooltips inside the live beta UI theme.

## Definition of Done

- All v1 requirements (`KB-01..04`, `INDEX-01..04`, `SIM-01..03`, `CLASS-01..04`, `VISUAL-01..02`) are implemented, verified by automated checks, committed to git, and synced to the private GitHub repository `brbrainerd/uoIdle`.

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| KB-01 | Phase 1 | Complete |
| KB-02 | Phase 1 | Complete |
| KB-03 | Phase 1 | Complete |
| KB-04 | Phase 1 | Complete |
| INDEX-01 | Phase 2 | Complete |
| INDEX-02 | Phase 2 | Complete |
| INDEX-03 | Phase 3 | Complete |
| INDEX-04 | Phase 3 | Complete |
| SIM-01 | Phase 4 | Complete |
| SIM-02 | Phase 4 | Complete |
| SIM-03 | Phase 5 | Pending |
| CLASS-01 | Phase 5 | Pending |
| CLASS-02 | Phase 5 | Pending |
| CLASS-03 | Phase 5 | Pending |
| CLASS-04 | Phase 5 | Pending |
| VISUAL-01 | Phase 6 | Pending |
| VISUAL-02 | Phase 6 | Pending |

**Coverage:**

- v1 requirements: 17 total
- Mapped to phases: 17
- Unmapped: 0 ✓

---
*Requirements defined: 2026-11-06*
*Last updated: 2026-11-06 after roadmap creation*
