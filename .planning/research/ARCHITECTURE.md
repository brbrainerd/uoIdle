# Architecture Research

**Domain:** Reverse-Engineered Game Mechanics Knowledgebase, Numerical Combat Balance Simulation & Class Design Deliverable Pipeline (UO Idle)
**Researched:** 2026-11-06
**Confidence:** HIGH

## Standard Architecture

### System Overview

The project consists of two tightly coupled architectural halves:
1. **The Claim-Verified Mechanics Knowledgebase (`mechanics/`)** — A deterministic ingestion and verification pipeline modeled after `mudlet-dragonball-evolution/mechanics/`, adapted from Telnet MUD helpfiles to a web-based idle RPG's webpack/Vite JS bundles, authenticated state/network snapshots, and wiki/docs surfaces.
2. **The Class Design, Simulation & Deliverable Pipeline (`design/`, `schemas/`, `sim/`, `mockups/`)** — A downstream modeling and specification layer that consumes machine-readable parameters extracted from verified KB claims, establishes a mathematical baseline over live **Warrior**, **Mage**, and **Ranger** skill kits, adapts canonical **ModernUO** *Bushido* and *Ninjitsu* mechanics into UO Idle's combat primitives, validates parity via deterministic tick simulation, and outputs drop-in JSON/code schemas, formal markdown specs, and UI mockups.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   1. LIVE SURFACE & REFERENCE EXTRACTION                    │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │  UO Idle Beta Client │  │   UO Idle Wiki /     │  │ ModernUO Source & │  │
│  │  (JS Bundle + State  │  │   Public Docs        │  │ Wiki Reference    │  │
│  │   via DevTools MCP)  │  │                      │  │ (Bushido/Ninjitsu)│  │
│  └──────────┬───────────┘  └──────────┬───────────┘  └─────────┬─────────┘  │
│             │                         │                        │            │
├─────────────▼─────────────────────────▼────────────────────────▼────────────┤
│                2. IMMUTABLE RAW LAYER (`mechanics/_raw/`)                   │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │ `_raw/bundle/`       │  │ `_raw/wiki/` &       │  │ `_raw/modernuo/`  │  │
│  │ Pretty-printed AST   │  │ `_raw/api/`          │  │ Canonical C# /    │  │
│  │ slices (skills,      │  │ Scraped docs & JSON  │  │ doc extracts for  │  │
│  │ combat, items, ticks)│  │ state snapshots      │  │ Bushido & Ninjitsu│  │
│  └──────────┬───────────┘  └──────────┬───────────┘  └─────────┬─────────┘  │
│             │                         │                        │            │
├─────────────▼─────────────────────────▼────────────────────────▼────────────┤
│             3. CLAIM-VERIFIED KNOWLEDGEBASE (`mechanics/`)                  │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │  `classes/` (warrior, mage, ranger) │ `combat/` │ `systems/` │`topics/`│  │
│  │  Every number lives in a `- **C<n>** [<tag>] "<quote>" (raw La-Lb)`   │  │
│  │  Enforced & indexed by `mechanics/tools/kb.py {build,check}`          │  │
│  └──────────────────────────────────┬────────────────────────────────────┘  │
│                                     │                                       │
├─────────────────────────────────────▼───────────────────────────────────────┤
│          4. SCHEMA, SIMULATION & BALANCE ENGINE (`schemas/`, `sim/`)        │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │ `schemas/`           │  │ `sim/baseline/`      │  │ `sim/candidates/` │  │
│  │ Reverse-engineered   │─▶│ Warrior/Mage/Ranger  │─▶│ Samurai & Ninja   │  │
│  │ Skill, Buff, & Class │  │ DPS, EHP, Resource & │  │ Parity Solver &   │  │
│  │ JSON/TS Definitions  │  │ Level-Bracket Curves │  │ Niche Validator   │  │
│  └──────────┬───────────┘  └──────────┬───────────┘  └─────────┬─────────┘  │
│             │                         │                        │            │
├─────────────▼─────────────────────────▼────────────────────────▼────────────┤
│          5. PITCH & IMPLEMENTATION DELIVERABLES (`design/`, `mockups/`)     │
├─────────────────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────┐  ┌──────────────────────┐  ┌───────────────────┐  │
│  │ `design/specs/`      │  │ `design/drop-in/`    │  │ `mockups/`        │  │
│  │ Formal Class & Skill │  │ Production-ready     │  │ Beta UI HTML/CSS  │  │
│  │ Design Specifications│  │ JSON/JS class & skill│  │ Composites &      │  │
│  │ with KB C<n> cites   │  │ objects for lead dev │  │ Skill Icon Assets │  │
│  └──────────────────────┘  └──────────────────────┘  └───────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Component Responsibilities

| Component | Responsibility | Typical Implementation |
|-----------|----------------|------------------------|
| **Raw Extractor (`mechanics/tools/extract_bundle.py` + DevTools MCP)** | Pulls live client JS bundles from `https://uoidle.com/beta`, formats/pretty-prints minified code into deterministic line-numbered module slices (`_raw/bundle/*.js`), captures live API/WebSocket/localStorage state (`_raw/api/*.json`), and archives ModernUO reference files (`_raw/modernuo/`). | Python 3 CLI scripts + Chrome DevTools MCP evaluation snapshots + `manifest.json` SHA-256 tracking |
| **KB Linter & Indexer (`mechanics/tools/kb.py`)** | Enforces frontmatter schema, verifies that every claim `C<n>` quotes `sources[0]` verbatim at `(raw L<a>-L<b>)` (whitespace-normalized), forbids unquoted numbers in `## Summary`, validates `[[slug]] C<n>` cross-references, and generates `mechanics/INDEX.md`. | Zero-dependency Python 3.9+ stdlib script adapted from `mudlet-dragonball-evolution/mechanics/tools/kb.py` |
| **Mechanics Knowledgebase (`mechanics/{classes,combat,systems,topics}/`)** | Stores human- and agent-readable markdown pages documenting UO Idle's exact combat loop, tick rates, damage/defense math, status effects, and the complete skill trees of Warrior, Mage, and Ranger. | Frontmatter-tagged Markdown with verbatim `(raw L<a>-L<b>)` claims |
| **Canonical Schema Layer (`schemas/`)** | Defines the exact TypeScript/JSON Schema structures used by UO Idle's client/server for class definitions, active/passive skills, unlock level tiers, status effects, scaling coefficients, and cooldowns. | JSON Schema (`draft-07` / `2020-12`) + TypeScript `.d.ts` interfaces |
| **Combat & Balance Simulator (`sim/`)** | Implements UO Idle's verified combat math in a deterministic tick-based simulator; runs Warrior, Mage, and Ranger across level brackets to establish target bands (DPS, burst, mitigation, sustain, resource economy) and validates Samurai and Ninja tuning against those bands. | Python 3 simulation package (`sim/engine.py`, `sim/models.py`, `sim/report.py`) outputting markdown/JSON parity tables |
| **Class Design Package (`design/`)** | Houses the ModernUO-to-UO-Idle mechanic translation matrix, the formal Samurai (*Bushido*) and Ninja (*Ninjitsu*) design specifications, and drop-in JSON/JS skill payloads ready for the UO Idle lead developer to paste into the game codebase. | Markdown specifications with `[[slug]] C<n>` citations + schema-validated `.json` / `.js` drop-in files |
| **Visual Mockups & Asset Suite (`mockups/`)** | Demonstrates Samurai and Ninja inside UO Idle's actual beta UI layout alongside custom class icons and full skill tree icon sets matching the game's visual aesthetic. | Generated PNG/WebP icon assets + self-contained HTML/CSS UI mockup views mirroring the live beta DOM |

---

## Recommended Project Structure

```
uoIdle/
├── .planning/                      # GSD project planning & research artifacts
├── mechanics/                      # Claim-verified UO Idle & ModernUO knowledgebase
│   ├── CONTRIBUTING.md             # Adapted rules for raw slices, claims, tags, and kb.py
│   ├── INDEX.md                    # Generated by `kb.py build` (never hand-edited)
│   ├── _raw/                       # Immutable verbatim source extracts (never hand-edited)
│   │   ├── manifest.json           # SHA-256 hashes, source URLs, timestamps, bundle version
│   │   ├── bundle/                 # Pretty-printed deterministic slices of client JS bundle
│   │   │   ├── classes-warrior.js  # Verbatim Warrior class & skill definitions
│   │   │   ├── classes-mage.js     # Verbatim Mage class & skill definitions
│   │   │   ├── classes-ranger.js   # Verbatim Ranger class & skill definitions
│   │   │   ├── combat-engine.js    # Hit/damage/mitigation/crit/tick resolution code
│   │   │   ├── status-effects.js   # Buffs, debuffs, DoTs, stances, cooldown handling
│   │   │   └── progression.js      # Level curves, stat growth, skill slot unlock tiers
│   │   ├── api/                    # Redacted network/state JSON payloads from live beta
│   │   ├── wiki/                   # Verbatim scrapes of official UO Idle docs/wiki pages
│   │   └── modernuo/               # Verbatim ModernUO Bushido/Ninjitsu C# & wiki extracts
│   ├── _evidence/                  # Measured runtime combat log/state excerpts for verification
│   ├── classes/                    # Per-class KB pages (1:1 with live classes + ModernUO refs)
│   │   ├── warrior.md              # Live Warrior skills, unlock tiers, scaling claims
│   │   ├── mage.md                 # Live Mage skills, unlock tiers, scaling claims
│   │   ├── ranger.md               # Live Ranger skills, unlock tiers, scaling claims
│   │   ├── modernuo-bushido.md     # Canonical UO Bushido abilities & formulas
│   │   └── modernuo-ninjitsu.md    # Canonical UO Ninjitsu abilities & formulas
│   ├── combat/                     # Core combat engine mechanics pages
│   │   ├── tick-and-cooldowns.md   # Attack speed, global/skill cooldowns, action queue
│   │   ├── damage-and-defense.md   # Physical/magical damage, armor/resist, crit math
│   │   ├── resources.md            # Health, Mana, Stamina/Energy regen & spend economy
│   │   └── status-effects.md       # Buff/debuff stacking, durations, proc hooks
│   ├── systems/                    # Surrounding game systems affecting class design
│   │   ├── progression-unlocks.md  # Level brackets, active/passive slot counts, stat points
│   │   └── equipment-affixes.md    # Weapon types, armor weights, item stat scaling
│   ├── topics/                     # Cross-cutting synthesis pages (`[[slug]] C<n>` links)
│   │   ├── class-structural-parity.md # Exact slot/tier template every class must obey
│   │   └── combat-niches.md        # Comparison of Warrior/Mage/Ranger archetypes & gaps
│   └── tools/
│       ├── kb.py                   # Adapted KB builder, claim linter, & self-test suite
│       └── slice_bundle.py         # Deterministic JS formatter & AST/regex chunk extractor
├── schemas/                        # Reverse-engineered data contracts from live bundle
│   ├── class.schema.json           # JSON Schema for a UO Idle Class object
│   ├── skill.schema.json           # JSON Schema for Active/Passive Skill definitions
│   ├── effect.schema.json          # JSON Schema for Status Effects / Buffs / Triggers
│   └── uoidle-types.d.ts           # TypeScript interfaces mirroring live client structures
├── sim/                            # Numerical balance & parity simulation engine
│   ├── engine.py                   # Tick-accurate UO Idle combat loop implementation
│   ├── baseline.py                 # Loads verified Warrior/Mage/Ranger params from KB/schemas
│   ├── candidates.py               # Loads Samurai & Ninja skill definitions from `design/drop-in/`
│   ├── scenarios.py                # Benchmark encounters (single-target, AoE, boss, sustain)
│   ├── run_parity.py               # CLI runner generating balance curves & parity verdicts
│   └── reports/                    # Generated markdown/JSON simulation outputs
│       └── parity-matrix.md        # Level-by-level DPS, EHP, and resource efficiency tables
├── design/                         # Deliverable specifications & drop-in code for lead dev
│   ├── MODERNUO_MAPPING.md         # How each Bushido/Ninjitsu skill adapts to UO Idle
│   ├── SAMURAI_SPEC.md             # Formal Samurai (Bushido) class & skill line design doc
│   ├── NINJA_SPEC.md               # Formal Ninja (Ninjitsu) class & skill line design doc
│   ├── BALANCE_REPORT.md           # Executive summary of numerical parity & niche protection
│   └── drop-in/                    # Ready-to-integrate code/JSON definitions
│       ├── samurai.json            # Schema-validated Samurai class & skill definitions
│       ├── ninja.json              # Schema-validated Ninja class & skill definitions
│       └── classes-patch.js        # Drop-in JS module formatted to match live bundle conventions
└── mockups/                        # Visual UI mockups & iconography deliverables
    ├── assets/
    │   ├── icons/samurai/          # Generated Samurai class & skill icons
    │   └── icons/ninja/            # Generated Ninja class & skill icons
    ├── samurai-skill-tree.html     # Interactive/static beta UI mockup for Samurai
    └── ninja-skill-tree.html       # Interactive/static beta UI mockup for Ninja
```

### Structure Rationale

- **`mechanics/` separation from `design/`:** Mixing reverse-engineered facts about the live game with newly proposed class designs is the #1 cause of hallucinated mechanics. Everything inside `mechanics/` describes **what is provably true** in live UO Idle (or canonical ModernUO reference), enforced by `kb.py check`. Everything inside `design/` and `sim/candidates.py` describes **what we are proposing**, citing `mechanics/` via `[[slug]] C<n>`.
- **`mechanics/_raw/bundle/` sliced by domain rather than a single 5MB minified file:** Web bundles are often single-line or webpack-chunked files. `kb.py` relies on readable line ranges (`(raw L<a>-L<b>)`). Running a deterministic pretty-printer + slice extractor (`slice_bundle.py`) once per capture produces stable, line-numbered files under `_raw/bundle/` with SHA-256 hashes recorded in `_raw/manifest.json`.
- **`schemas/` as the bridge between KB, Simulator, and Drop-in Deliverables:** By extracting the live game's exact JSON/JS object shape into `schemas/` first, both the baseline classes (Warrior, Mage, Ranger) and the candidate classes (Samurai, Ninja) use the exact same data structure. The simulator (`sim/`) runs directly on those JSON definitions—meaning the drop-in files in `design/drop-in/` are the **exact files** tested by the simulator, eliminating spec-to-code drift.

---

## Adapting `mudlet-dragonball-evolution/mechanics/` to UO Idle

The reference KB (`mudlet-dragonball-evolution/mechanics/`) was engineered for a CircleMUD derivative where helpfiles (`_raw/help/*.txt`) are primary sources and Mudlet session logs (`trace:` / `log:`) verify runtime behavior. Adapting `kb.py` and `CONTRIBUTING.md` to a web-based idle RPG requires four targeted changes while keeping 90% of `kb.py` intact:

| Dimension | Reference (`mudlet-dragonball-evolution`) | UO Idle Adaptation (`uoIdle/mechanics/`) |
|-----------|-------------------------------------------|------------------------------------------|
| **Page Directories (`PAGE_DIRS`)** | `("help", "topics")` | `("classes", "combat", "systems", "topics")` |
| **Categories (`CATEGORIES`)** | `combat`, `skills`, `races`, `transformations`, `regen-rest`, `xp-levels`, `economy-items`, `movement-world`, `commands-ui`, `admin-misc` | `classes`, `skills`, `combat`, `status-effects`, `resources`, `progression`, `equipment`, `ui-client`, `modernuo-ref` |
| **Evidence Tags (`TAGS` & `RANK`)** | `contradicted` (0) < `unverified` (1) < `help-stated` (2) < `verified` (3) | `contradicted` (0) < `unverified` (1) < `doc-stated` (2) < `bundle-stated` (3) < `verified` (4) |
| **Evidence Prefixes (`EVIDENCE_PREFIXES`)** | `trace: `, `log: `, `code: `, `ledger: `, `live: ` | `bundle: `, `network: `, `dom: `, `wiki: `, `modernuo: `, `live: ` |
| **Cross-Ref Key (`FM_KEYS`)** | `bot_refs` (links to Lua bot code) | `design_refs` (links to `schemas/`, `sim/`, or `design/` files that consume the mechanic) |

### Why Separate `bundle-stated`, `doc-stated`, and `verified`?
In a web RPG, the client JS bundle (`bundle-stated`) frequently contains the exact formula or skill table, whereas a public wiki page (`doc-stated`) may lag behind beta patches. Furthermore, server-authoritative calculations might differ from client display logic until confirmed by a live combat state/network capture (`verified` via `live: _evidence/...` or `network: `). Ranking `contradicted < unverified < doc-stated < bundle-stated < verified` gives crystal-clear epistemological provenance for every claim.

---

## Architectural Patterns

### Pattern 1: Deterministic AST/Bundle Slicing (`slice_bundle.py`)

**What:** Never commit a 1-line minified webpack bundle directly to `_raw/` and try to cite column offsets. Instead, fetch the raw bundle into a gitignored staging directory (`mechanics/_crawl/`), pass it through a deterministic formatter (e.g., `js-beautify` or `prettier` with fixed config, or Python AST/token line-splitter), and extract named semantic regions into `mechanics/_raw/bundle/<slug>.js` with a header comment recording the bundle URL, SHA-256 hash, and byte span.
**When to use:** Always, for all client JS bundle extractions from `https://uoidle.com/beta`.
**Trade-offs:** Adds one preprocessing step before writing `_raw/bundle/*.js`, but makes `(raw L<a>-L<b>)` citations in `kb.py` human-readable, diffable, and 100% compatible with `kb.py`'s line-based quote verifier.

**Example (`mechanics/_raw/bundle/classes-warrior.js`):**
```javascript
// SOURCE: https://uoidle.com/beta/assets/index-a1b2c3d4.js
// BUNDLE_SHA256: 9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08
// EXTRACTED_AT: 2026-11-06T20:00:00Z
export const WARRIOR_SKILLS = [
  {
    id: "warrior_slash",
    name: "Slash",
    type: "active",
    unlockLevel: 1,
    cooldownMs: 3000,
    damageMultiplier: 1.45,
    resourceCost: 15
  }
];
```

**Corresponding Claim in `mechanics/classes/warrior.md`:**
```markdown
- **C1** [bundle-stated] "id: "warrior_slash", name: "Slash", type: "active", unlockLevel: 1, cooldownMs: 3000, damageMultiplier: 1.45, resourceCost: 15" (raw L6-L13)
```
Because `kb.py`'s `ws()` function collapses newlines and whitespace runs into single spaces (`" ".join(s.split())`), multi-line formatted JS objects match single-line claim quotes verbatim across `L6-L13` with zero modification to `kb.py`'s quote engine.

### Pattern 2: Single-Source-of-Truth Skill Definitions (`design/drop-in/*.json`)

**What:** The candidate skill definitions for Samurai and Ninja are authored as schema-validated JSON files in `design/drop-in/samurai.json` and `design/drop-in/ninja.json`. Both the simulation engine (`sim/candidates.py`) and the markdown spec generator/verifier read directly from these JSON files.
**When to use:** Throughout class design, balance tuning, and final deliverable packaging.
**Trade-offs:** Requires defining `schemas/skill.schema.json` before finalizing skill numbers, which is strictly beneficial because it guarantees structural parity with Warrior, Mage, and Ranger.

### Pattern 3: Effect Primitive Closed-World Constraint

**What:** When translating ModernUO *Bushido* and *Ninjitsu* abilities into UO Idle, Ninja and Samurai skills must be composed primarily from **effect primitives that already exist in UO Idle's combat engine** (e.g., direct damage multipliers, crit chance/damage modifiers, evasion/parry buffs, counter-attack triggers, DoTs, resource restore on hit/kill, multi-target cleave, stacking self-buffs, threshold execution multipliers). If a canonical UO mechanic (such as spatial tile teleportation in *Shadowjump* or polymorphic sprite swapping in *Animal Form*) does not exist in an idle auto-battler, the ModernUO Adapter maps it to an idle-native equivalent (e.g., *Shadowjump* → untargetable/evasion burst + guaranteed critical ambush opener; *Animal Form* → stance passive granting speed/evasion or regen/bleed).
**When to use:** During the ModernUO-to-UO-Idle mapping phase (`design/MODERNUO_MAPPING.md`).
**Trade-offs:** Avoids requiring the UO Idle lead developer to rewrite their core combat loop while still allowing 1–2 well-scoped, low-complexity hook extensions if clearly flagged as optional engine extensions.

---

## Data Flow

### End-to-End Verification & Design Flow

```
[Live UO Idle Beta (Chrome DevTools MCP)]        [ModernUO Docs / C# Source]
                   │                                          │
                   ▼ (extract & format)                       ▼ (archive)
      `mechanics/_raw/{bundle,api,wiki}/`         `mechanics/_raw/modernuo/`
                   │                                          │
                   └───────────────────┬──────────────────────┘
                                       ▼ (verbatim quote + line cite)
                    `mechanics/{classes,combat,systems,topics}/*.md`
                                       │
                                       ▼ (`kb.py check` & `kb.py build`)
                              `mechanics/INDEX.md` (Verified KB)
                                       │
                   ┌───────────────────┴──────────────────────┐
                   ▼ (extract schema)                         ▼ (extract baseline math)
     `schemas/{class,skill,effect}.schema.json`      `sim/baseline.py` (Warrior/Mage/Ranger)
                   │                                          │
                   ▼ (constrain candidate JSON)               ▼ (target DPS/EHP/Resource bands)
        `design/drop-in/{samurai,ninja}.json` ──────▶ `sim/run_parity.py`
                   │                                          │
                   ├──────────────────────────────────────────┘ (parity pass)
                   ▼
   `design/{SAMURAI_SPEC,NINJA_SPEC,BALANCE_REPORT}.md` + `mockups/*.html`
```

### Key Data Flows

1. **Raw Capture to Verified Claim Flow:**
   - Inspector queries live `https://uoidle.com/beta` via Chrome DevTools MCP (`evaluate_script`, network inspection, DOM inspection) to locate client JS bundle URLs, Redux/Zustand/Vuex/localStorage state, and active WebSocket/REST payloads.
   - `slice_bundle.py` writes deterministic, line-numbered slices into `mechanics/_raw/bundle/` and records hashes in `mechanics/_raw/manifest.json`.
   - Author creates markdown pages under `mechanics/classes/`, `mechanics/combat/`, and `mechanics/systems/` where every factual statement with numbers is encoded as `- **C<n>** [bundle-stated] "<verbatim quote>" (raw L<a>-L<b>)`.
   - `python3 mechanics/tools/kb.py check --root mechanics` verifies that every quote matches the exact line span in `_raw/` and that `## Summary` contains no unbacked digits.

2. **Verified Claim to Baseline Simulation Model Flow:**
   - Once Warrior, Mage, Ranger, and Combat Engine pages pass `kb.py check`, their exact parameters (base stats, level scaling, weapon damage, cooldowns, status effects, resource regeneration) are encoded into `schemas/` and `sim/baseline.py`.
   - Every constant in `sim/baseline.py` carries an inline comment citing its KB claim ID (e.g., `# [[damage-and-defense]] C4`, `# [[warrior]] C12`).
   - Running `sim/run_parity.py --baseline-only` produces reference curves across level brackets (e.g., Lv 1, Lv 10, Lv 25, Lv 50, Endgame) for single-target sustained DPS, burst window DPS, effective HP (EHP) / survival time, and resource net sustainability.

3. **ModernUO Adaptation to Candidate Parity Flow:**
   - `mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md` document canonical Ultima Online formulas (e.g., Bushido *Honorable Execution*, *Confidence*, *Evasion*, *Counter Attack*, *Lightning Strike*, *Momentum Strike*, *Perfection*; Ninjitsu *Focus Attack*, *Death Strike*, *Animal Form*, *Ki Attack*, *Surprise Attack*, *Backstab*, *Shadowjump*, *Mirror Image*).
   - `design/MODERNUO_MAPPING.md` maps each canonical ability to a specific unlock tier and active/passive slot matching Warrior/Mage/Ranger structural parity (`[[class-structural-parity]]`).
   - Candidate definitions are written to `design/drop-in/samurai.json` and `design/drop-in/ninja.json`, validated against `schemas/class.schema.json`, and simulated in `sim/run_parity.py` until their DPS/EHP/utility curves sit within the target parity band (e.g., ±5% composite power score across brackets) while preserving distinct combat identities.

---

## Component Boundaries & Suggested Build Order

Because downstream components have strict data dependencies on upstream verification, the roadmap phases **must** follow this topological build order:

```
Phase 1: Repo & KB Tooling (`kb.py`, `slice_bundle.py`, directory scaffold)
   │
   ▼
Phase 2: Live UO Idle Extraction & Core Combat KB (`_raw/bundle/`, `combat/`, `systems/`)
   │
   ▼
Phase 3: Existing Classes Deep-Dive KB & Schemas (`classes/{warrior,mage,ranger}.md`, `schemas/`)
   │
   ▼
Phase 4: Baseline Combat Simulator & ModernUO Reference KB (`sim/engine.py`, `modernuo-*.md`)
   │
   ▼
Phase 5: Samurai (Bushido) & Ninja (Ninjitsu) Design, Tuning & Drop-in Code (`design/`, `sim/`)
   │
   ▼
Phase 6: Visual UI Mockups, Iconography & Final Deliverable Packaging (`mockups/`)
```

### Build Order Implications for Roadmap Phases

1. **Tooling Before Scraping (Phase 1 → Phase 2):**
   - Do not scrape live game files into ad-hoc markdown notes. Adapt `mechanics/tools/kb.py` and build `mechanics/tools/slice_bundle.py` first so that every extracted JS chunk or API snapshot immediately lands in `mechanics/_raw/` and gets linted on day one.
2. **Engine Rules Before Class Skills (Phase 2 → Phase 3):**
   - Warrior, Mage, and Ranger skill descriptions cannot be mathematically modeled until the underlying combat loop (tick interval, cooldown queuing, hit/crit/armor math, status effect stacking, and skill slot unlock levels) is documented in `mechanics/combat/` and `mechanics/systems/`.
3. **Schemas & Baseline Classes Before Candidate Class Design (Phase 3 → Phase 4 → Phase 5):**
   - Attempting to design Samurai or Ninja before extracting the exact JSON schema and numerical curves of Warrior, Mage, and Ranger guarantees structural mismatch. `schemas/skill.schema.json` and `mechanics/topics/class-structural-parity.md` act as a hard gate before authoring Samurai and Ninja skills.
4. **Simulation Lock Before Visual Mockups (Phase 5 → Phase 6):**
   - UI mockups (`mockups/*.html`) display skill names, unlock levels, cooldowns, resource costs, and tooltip percentages. Generating mockups before locking numerical tuning in `sim/run_parity.py` causes rework. Finalize `design/drop-in/{samurai,ninja}.json` first, then render the UI mockups directly from those finalized JSON files.

---

## Anti-Patterns

### Anti-Pattern 1: Summarizing Minified Code Instead of Slicing Verbatim `_raw/`
**What people do:** Read the minified JS bundle in DevTools, mentally translate a formula into prose (`"Armor reduces damage by roughly armor / (armor + 100)"`), and write it directly into a markdown file without saving the verbatim code slice in `mechanics/_raw/bundle/`.
**Why it's wrong:** Breaks `kb.py check`, makes claims un-auditable by the lead developer, and hides subtle edge cases (e.g., floor/ceiling rounding, minimum damage clamps, or level-based denominators).
**Do this instead:** Extract the exact function or object literal into `mechanics/_raw/bundle/<module>.js`, pretty-print it deterministically, and quote the exact lines in `- **C<n>** [bundle-stated] "..." (raw L<a>-L<b>)`.

### Anti-Pattern 2: Designing "MUD/MMO Spatial" Skills for an Idle Auto-Battler
**What people do:** Copy Ultima Online's *Shadowjump* (targeted tile teleportation while stealthed) or *Backstab* (requiring positional behind-the-target facing) literally into the UO Idle design spec.
**Why it's wrong:** Idle RPG combat loops generally lack 2D tile pathing or manual facing vectors during auto-combat; proposing mechanics that require a spatial grid makes the spec unusable as a drop-in class package.
**Do this instead:** Map spatial/stealth mechanics to **state-machine and temporal primitives** native to UO Idle (e.g., *Stealth/Shadowjump* as an evasion/untargetable buff state that empowers the next attack with a guaranteed crit/backstab multiplier; *Mirror Image* as a stack-based hit-absorption buff that consumes 1 clone per incoming attack).

### Anti-Pattern 3: Hand-Calculated "Vibes" Balance Instead of Tick Simulation
**What people do:** Tune skill multipliers by comparing single-skill tooltips (`"Slash does 145% every 3s, so Lightning Strike doing 160% every 3.5s looks balanced"`) without modeling cooldown alignment, resource starvation, buff uptime, or passive synergies.
**Why it's wrong:** In idle auto-battlers, small interactions between attack speed, cooldown reduction, crit procs, and resource regeneration create compounding exponential curves across level brackets.
**Do this instead:** Run all 5 classes (Warrior, Mage, Ranger, Samurai, Ninja) through the same tick simulator (`sim/run_parity.py`) over 60-second and 300-second combat windows across multiple level brackets.

### Anti-Pattern 4: Spec-to-JSON Drift
**What people do:** Write `SAMURAI_SPEC.md`, `design/drop-in/samurai.json`, and `mockups/samurai-skill-tree.html` manually as three disconnected files, resulting in different cooldowns or scaling numbers in each file after a balance pass.
**Why it's wrong:** Destroys credibility with the lead developer when the spec says `180% damage` and the drop-in JSON says `1.65`.
**Do this instead:** Treat `design/drop-in/{samurai,ninja}.json` as the single source of truth for candidate class numbers, and add a small verification check in `sim/run_parity.py` (or a build script) that validates spec tables and mockup tooltips against the JSON definitions.

---

## Integration Points

### External Surfaces (Read-Only)

| Surface | Inspection Pattern | Notes |
|---------|--------------------|-------|
| **UO Idle Beta Client (`https://uoidle.com/beta`)** | Authenticated Chrome DevTools MCP (`list_network_requests`, `evaluate_script`, `take_snapshot`) | Strictly read-only inspection. Never mutate server state or flood endpoints. Extract loaded JS bundles and in-memory state stores once into `_raw/`. |
| **UO Idle Wiki / Public Docs** | HTTP fetch / DevTools read into `mechanics/_raw/wiki/` | Tagged as `doc-stated` (`RANK=2`), subordinate to `bundle-stated` (`RANK=3`) and `verified` (`RANK=4`) if discrepancies exist. |
| **ModernUO Repository & Documentation** | Web search / raw GitHub file fetch of `Scripts/Spells/Bushido/` and `Scripts/Spells/Ninjitsu/` into `mechanics/_raw/modernuo/` | Provides canonical ability names, skill requirements, resource costs, and original UO formulas for authentic adaptation. |

### Internal Boundaries

| Boundary | Contract | Enforcement Mechanism |
|----------|----------|-----------------------|
| **`_raw/` ↔ `mechanics/**/*.md`** | Every claim `C<n>` must quote `sources[0]` verbatim at `L<a>-L<b>`; no numbers allowed in `## Summary`. | `python3 mechanics/tools/kb.py check --root mechanics` |
| **`mechanics/` ↔ `schemas/`** | JSON Schemas in `schemas/` must validate the verbatim class/skill JSON objects extracted from `_raw/bundle/classes-*.js`. | Schema validation test in `sim/baseline.py` |
| **`schemas/` ↔ `design/drop-in/*.json`** | Candidate Samurai & Ninja JSON definitions must pass the exact same JSON Schema validation as live Warrior, Mage, and Ranger. | Schema validation check in `sim/candidates.py` |
| **`design/drop-in/*.json` ↔ `sim/run_parity.py`** | Simulator reads candidate JSONs directly and outputs `sim/reports/parity-matrix.md` comparing Samurai/Ninja against Warrior/Mage/Ranger. | Automated parity test threshold assertions |

## Sources

- Reference Knowledgebase Architecture: [CONTRIBUTING.md](file:///Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/CONTRIBUTING.md) and [kb.py](file:///Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py)
- Project Constraints & Scope: [PROJECT.md](file:///Users/brbrainerd/dev/uoIdle/.planning/PROJECT.md)

---
*Architecture research for: UO Idle Mechanics Knowledgebase & Ninja/Samurai Class Design*
*Researched: 2026-11-06*
