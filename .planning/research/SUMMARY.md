# Project Research Summary

**Project:** UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase
**Domain:** Reverse-Engineered Game Mechanics Knowledgebase, ModernUO C# Reference Adaptation, & Idle RPG Class Design / Numerical Balance Simulation
**Researched:** 2026-11-06
**Confidence:** HIGH

## Executive Summary

This project delivers a studio-grade reverse-engineering knowledgebase of **UO Idle** (`https://uoidle.com/beta`, currently at `v0.99.0`) alongside a complete, drop-in class design and engineering package for two new classes—**Samurai** (grounded in Ultima Online's *Bushido*) and **Ninja** (grounded in Ultima Online's *Ninjitsu*)—commissioned for the UO Idle lead developer. Rather than producing an unverified "concept pitch," experts build this type of systems-design deliverable by establishing a strict two-layer pipeline: first, a **claim-verified mechanics knowledgebase (`mechanics/`)** modeled after `mudlet-dragonball-evolution/mechanics/` where every formula, cooldown, and skill stat quotes verbatim line spans from formatted client JS bundle slices (`_raw/bundle/`), live DevTools state/network captures (`_evidence/`), or canonical `modernuo/ModernUO` C# source files (`_raw/modernuo/`); and second, a **schema-driven simulation and specification layer (`schemas/`, `sim/`, `design/`, `mockups/`)** that proves structural and numerical parity against the live **Warrior**, **Mage**, and **Ranger** baselines before emitting copy-pasteable JSON/TS definitions and in-situ beta UI mockups.

The recommended technical approach combines zero-dependency Python 3 stdlib tooling (`mechanics/tools/kb.py`) for deterministic claim linting with a lightweight Node.js/TypeScript (`tsx`, `prettier`, `acorn`, `zod`) pipeline for AST bundle slicing, schema validation, and tick-accurate combat simulation. Because UO Idle (`v0.99.0`) ships a 2.28 MB minified Vite ES module (`/assets/index-CCYN0Dy6.js`) behind Cloudflare with no source map, the pipeline fetches static assets via `curl` and inspects authenticated runtime state read-only via Chrome DevTools MCP (`chrome-devtools`), formats and slices the bundle into human-readable domain modules prior to freezing `_raw/`, and fetches canonical Bushido/Ninjitsu C# scripts directly from `modernuo/ModernUO` via `gh api`.

The primary risks are: (1) **epistemological drift**—relying on stale wiki/tooltip strings or client-only preview calculators instead of authoritative bundle/server combat math; (2) **raw-layer corruption or credential leaks**—committing unformatted single-line minified JS (which breaks `kb.py`'s line-based quote verification) or leaking `localStorage`/WebSocket session tokens into git; (3) **genre mismatch**—translating spatial/manual Ultima Online mechanics (such as 20-tile running for *Ki Attack*, 5-step enemy walking for *Death Strike*, or unconditional $-40$ resistance failure penalties on *Honorable Execution*) literally into an unattended 24/7 idle loop; and (4) **class homogenization or idle balance skew**—creating reskinned Warriors/Rangers or overlooking resource starvation, overkill waste, and avoidance-stacking immortality. All four risks are mitigated through strict `kb.py` evidence hierarchies, automated credential sanitization, temporal/state-machine adaptations of ModernUO formulas, and multi-bracket tick simulation.

## Key Findings

### Recommended Stack

See [STACK.md](file:///Users/brbrainerd/dev/uoIdle/.planning/research/STACK.md) for full details and version compatibility.

The stack is purposefully split between **Python 3 stdlib** for immutable knowledgebase verification and **Node.js + TypeScript (`tsx`)** for JS bundle AST slicing, schema validation, and combat simulation. Running the AST extractor and combat simulator in Node/TypeScript ensures 100% floating-point (`Number` / `Math.*`) and JSON schema parity with UO Idle's actual JavaScript engine, while keeping `kb.py` zero-dependency guarantees instant, reproducible verification across any environment.

**Core technologies:**
- **Python 3 stdlib (`3.9.6`–`3.15.2`)**: Powers `mechanics/tools/kb.py` (`build`, `check`, `diff`, `--self-test`) and `tools/fetch_modernuo.py` — zero external pip dependencies required for KB linting, verbatim quote checking, and digit-free summary enforcement.
- **Node.js (`v26.13.0`) + TypeScript (`tsx`, `prettier`, `acorn`, `acorn-walk`, `zod`)**: Powers `tools/bundle_extract.mjs` (deterministic formatting and AST slicing of `/assets/index-CCYN0Dy6.js`), strict runtime/static schema validation (`zod`), and `tools/sim_balance.ts` (tick-accurate combat simulation).
- **Chrome DevTools MCP (`chrome-devtools`) + `curl`**: Performs strictly read-only inspection of the authenticated `https://uoidle.com/beta` session (DOM, `localStorage`, Pinia/React state, WebSocket/network frames) without triggering Cloudflare bot challenges, while `curl` fetches immutable bundle assets.
- **GitHub CLI (`gh 2.103.3`) + `ripgrep` (`rg`) + `jq`**: Pulls the ~25 canonical Bushido, Ninjitsu, Honor/Perfection, and weapon parry C# source files directly from `modernuo/ModernUO` (`Projects/UOContent/Spells/{Bushido,Ninjitsu}/`) with commit SHA provenance in seconds.
- **Pillow (`pillow 13.0.0`) + Built-in Image Generation + Scoped HTML/CSS**: Post-processes generated dark-fantasy UO skill/class icons and composites them into authentic UO Idle beta UI mockups (`#0b0d0a` palette, `Cinzel` + `IBM Plex Sans` typography) captured via Chrome DevTools.

### Expected Features

See [FEATURES.md](file:///Users/brbrainerd/dev/uoIdle/.planning/research/FEATURES.md) for the complete ModernUO formula tables, 5-class niche matrix, and dependency graph.

Every canonical ModernUO ability for **Bushido** (*Bushido Weapon Parry*, *Perfection & Honor*, *Honorable Execution*, *Confidence*, *Counter Attack*, *Lightning Strike*, *Evasion*, *Momentum Strike*) and **Ninjitsu** (*Mirror Image*, *Focus Attack*, *Backstab*, *Smoke Bomb & Stealth*, *Shadowjump*, *Surprise Attack*, *Ki Attack*, *Death Strike*, *Animal Form*) has been mapped from its exact ModernUO C# formula to an idle-compatible state-machine pattern.

**Must have (table stakes):**
- **Claim-Verified Mechanics KB (`mechanics/` + adapted `kb.py`)** — Every mechanic claim (`C1..Cn`) quotes verbatim line ranges from `_raw/` with zero digits permitted in `## Summary`.
- **Complete Live UO Idle Index (Core Engine + Warrior, Mage, Ranger)** — Full reverse-engineered documentation of combat ticks, hit/crit/mitigation math, status effects, unlock levels, cooldowns, and resource economy.
- **Structural Progression Parity** — Samurai and Ninja must match the exact unlock level tiers, active/passive slot counts, and upgrade rules of Warrior, Mage, and Ranger.
- **ModernUO-Grounded Samurai (Bushido) & Ninja (Ninjitsu) Skill Lines** — Authentic adaptations of canonical UO abilities into automated idle combat primitives (replacing tile-distance and manual Gumps with combo tempo, stealth state windows, clone charges, and delayed detonation marks).
- **Drop-In Code / JSON Definitions & Formal Design Specification** — Schema-validated class/skill definitions matching UO Idle's live data structures 1:1 alongside human-readable engineering specs.
- **Visual Beta UI Mockups & Custom Skill/Class Iconography** — Generated class portraits and full skill tree icon sets rendered inside authentic `https://uoidle.com/beta` DOM/CSS mockups.

**Should have (competitive differentiators):**
- **Protected 5-Class Combat Niche Matrix** — Positions **Samurai** as *Ramp / Parry-Counter / Execute* (*Perfection* consecutive-hit stacking + *Confidence/Counter Attack* parry triggers + *Honorable Execution* finisher) and **Ninja** as *Ablative Clone Mitigation / Stealth-State Opener / Delayed Detonation* (*Mirror Image* hit interception + *Smoke Bomb -> Surprise Attack/Backstab* shred/burst + 5-hit *Death Strike* mark), avoiding overlap with Warrior, Mage, or Ranger.
- **Deterministic Tick Simulation & Parity Proof** — Runnable simulation proving DPS, Effective HP (EHP), TTK (including overkill), and resource net sustainability stay within $\pm 5\text{–}8\%$ of live classes across Early, Mid, Late, and Endgame brackets.
- **Dual Implementation Modes ("Mode A: Zero-Engine-Change" vs "Mode B: Native Hook")** — Provides both a 100% existing-opcode JSON payload (shippable in 5 minutes) and a minimal (<20 LOC JS/TS) hook spec for signature mechanics like *Mirror Image* interception or *Death Strike* 5-hit detonation.
- **Cross-Referenced Formula Traceability (`ModernUO <-> UO Idle`)** — Side-by-side derivation tables linking exact ModernUO C# line numbers to scaled UO Idle coefficients.

**Defer (v1.x / v2+):**
- **Class-Specific Weapon / Itemization Tables** (Katana, No-Dachi, Wakizashi, Tekagi, Kama, Fukiya affixes) — High-value follow-up if the developer wants class-themed equipment drops.
- **Interactive Browser Balance Sandbox** — Local HTML/JS slider tool for live developer tuning.
- **Additional UO Skill Lines (Chivalry, Necromancy, Spellweaving) & Mastery Ascensions** — Future expansions once Samurai and Ninja are integrated.

### Architecture Approach

See [ARCHITECTURE.md](file:///Users/brbrainerd/dev/uoIdle/.planning/research/ARCHITECTURE.md) for component boundaries, data flows, and directory layouts.

The architecture enforces a strict unidirectional data flow across five layers so that reverse-engineered facts never mix with proposed designs, and spec-to-code drift is impossible:

**Major components:**
1. **Immutable Raw Layer (`mechanics/_raw/{bundle,api,wiki,modernuo}/` + `_evidence/`)** — Stores deterministically formatted (`prettier`), domain-sliced JS modules from `/assets/index-CCYN0Dy6.js`, redacted live state captures, and canonical ModernUO `.cs` files tracked with SHA-256 hashes in `manifest.json`.
2. **Claim-Verified Knowledgebase (`mechanics/{classes,combat,systems,topics}/` + `mechanics/tools/kb.py`)** — Enforces frontmatter contracts, ranks evidence (`contradicted < unverified < modernuo-stated < doc-stated < bundle-stated < verified`), validates `[[slug]] C<n>` cross-links, and builds `mechanics/INDEX.md`.
3. **Canonical Schema Layer (`schemas/`)** — Captures the exact JSON Schema / TypeScript (`zod`) contracts for live UO Idle classes, skills, and status effects, acting as a hard validation gate for both baseline and candidate classes.
4. **Deterministic Combat & Parity Simulator (`sim/` / `tools/sim_balance.ts`)** — Implements UO Idle's verified combat loop, runs Warrior, Mage, and Ranger baselines across level brackets and enemy archetypes, and solves/verifies Samurai and Ninja numerical parity directly from candidate JSON files.
5. **Single-Source-of-Truth Deliverables (`design/drop-in/*.json`, `design/*.md`, `mockups/`)** — Treats `design/drop-in/{samurai,ninja}.json` as the canonical source of truth consumed simultaneously by the simulator, the formal markdown specs (`SAMURAI_SPEC.md`, `NINJA_SPEC.md`, `BALANCE_REPORT.md`), and the HTML/CSS beta UI mockups.

### Critical Pitfalls

See [PITFALLS.md](file:///Users/brbrainerd/dev/uoIdle/.planning/research/PITFALLS.md) for all 6 critical pitfalls, technical debt patterns, and recovery strategies.

1. **Pitfall 1: Treating Stale Wiki or UI Tooltip Strings as Ground Truth Over Live Bundle & Server State** — In active betas, tooltip strings frequently lag behind patched code multipliers. *Mitigation:* Enforce `doc-stated < bundle-stated < verified` in `kb.py`, extract the actual JS skill config objects from `/assets/index-CCYN0Dy6.js`, and cross-check formulas against live WebSocket/combat log payloads in `_evidence/`.
2. **Pitfall 2: Committing Minified Single-Line JS or Unredacted Session Credentials to `_raw/`** — A 2.28 MB minified line makes `(raw L1-L1)` citations useless, and raw DevTools dumps risk leaking `localStorage` JWTs/cookies. *Mitigation:* Always run `prettier` + AST domain slicing before writing to `_raw/bundle/`, record original SHA-256 hashes in `manifest.json`, and enforce an automated regex credential scanner (`Bearer `, `eyJ`, `cookie`, `token`, `session`, `email`) in `kb.py check` before any commit.
3. **Pitfall 3: Misidentifying Client Display Helpers as Server-Authoritative Combat Math** — Client bundles often contain simplified UI DPS estimators while the server computes real mitigation or proc caps. *Mitigation:* Audit WebSocket/network combat tick frames alongside the client bundle and classify every mechanic as Client-Evaluated, Shared-Config, or Server-Authoritative.
4. **Pitfall 4: Literal Translation of Spatial/Manual ModernUO Mechanics into an Idle Loop** — Mechanics requiring 2D tile movement (*Ki Attack*, *Death Strike* steps, *Shadowjump* ground targeting), backpack consumables (*Smoke Bomb*), modal Gumps (*Animal Form*), or lethal non-kill self-penalties (*Honorable Execution* $-40$ resists) break unattended AFK play. *Mitigation:* Map spatial/manual triggers to temporal/combo state machines and conditional kill rewards using the verified UO Idle Engine Capability Matrix.
5. **Pitfall 5 & 6: Class Homogenization & Idle Numerical Skew (Resource Starvation, Overkill Waste, Avoidance Immortality)** — Flattening skills into generic `+% damage` buffs creates "Yellow Warrior / Green Ranger" clones, while per-swing mana drain or uncapped parry/clone avoidance breaks 8-hour idle sessions. *Mitigation:* Enforce distinct state loops (*Perfection/Parry-Counter* vs *Mirror Image/Stealth/Death Mark*) and simulate 4 concrete metrics across brackets: Sustained Boss DPS, Trash TTK (with overkill), Net Resource Delta/min, and EHP/Sustain under continuous attack.

## Implications for Roadmap

Based on architectural dependencies and pitfall prevention, the project should be structured into **6 sequential phases**:

### Phase 1: Repository Setup, `kb.py` Adaptation & Live Extraction Pipeline
**Rationale:** Tooling and deterministic extraction must exist before authoring a single KB page or class design; otherwise `_raw/` citations will shift or leak credentials.
**Delivers:** Private GitHub repo verification (`brbrainerd/uoIdle`), adapted `mechanics/tools/kb.py` (passing `--self-test` with UO Idle categories, evidence tags, and credential scanner), `tools/bundle_extract.mjs` (`prettier` + `acorn` AST slicer), `tools/fetch_modernuo.py`, and initial immutable extracts in `mechanics/_raw/{bundle,api,wiki,modernuo}/` + `manifest.json`.
**Addresses:** Adapted `mechanics/` KB tooling & verbatim `_raw/` extraction from `https://uoidle.com/beta` and `modernuo/ModernUO`.
**Avoids:** Pitfall 2 (Minified single-line JS & credential leaks in `_raw/`) and technical debt from unadapted MUD help parsers.

### Phase 2: Core UO Idle Engine & Systems Knowledgebase
**Rationale:** Warrior, Mage, and Ranger skills cannot be mathematically modeled until the underlying combat tick loop, hit/crit/armor mitigation math, status effect hooks, and level progression rules are verified.
**Delivers:** Claim-verified KB pages under `mechanics/combat/` (`tick-and-cooldowns.md`, `damage-and-defense.md`, `resources.md`, `status-effects.md`) and `mechanics/systems/` (`progression-unlocks.md`, `equipment-affixes.md`), backed by live `_evidence/` verification captures and a documented **Engine Capability Matrix**.
**Uses:** `mechanics/tools/kb.py`, Chrome DevTools MCP (`chrome-devtools`), sliced `_raw/bundle/combat-engine.js` & `status-effects.js`.
**Implements:** Claim-Verified Knowledgebase (Core Combat & Systems layer).
**Avoids:** Pitfall 1 (Stale wiki vs live bundle) and Pitfall 3 (Client display logic vs server-authoritative combat math).

### Phase 3: Existing Classes Deep-Dive (`Warrior`, `Mage`, `Ranger`) & Canonical Data Schemas
**Rationale:** Structural parity (exact unlock levels, active/passive counts, scaling curves) and drop-in JSON compatibility require a 100% complete audit of all three live classes first.
**Delivers:** Verified KB pages `mechanics/classes/{warrior,mage,ranger}.md`, synthesis topics `mechanics/topics/{class-structural-parity,combat-niches}.md`, and strict `zod` / JSON Schema definitions in `schemas/{class,skill,effect}.schema.json` validated against the live class payloads.
**Uses:** `zod`, `typescript`, `mechanics/tools/kb.py`.
**Implements:** Canonical Schema Layer (`schemas/`) & Existing Classes KB.
**Avoids:** Structural mismatch on unlock tiers/slot ratios and inventing incompatible JSON property names.

### Phase 4: ModernUO Reference KB & Baseline Combat Simulator
**Rationale:** Before tuning Samurai and Ninja numbers, we need both the canonical ModernUO Bushido/Ninjitsu formulas documented in the KB and a working deterministic simulator calibrated to the live Warrior, Mage, and Ranger baselines.
**Delivers:** Verified reference pages `mechanics/classes/{modernuo-bushido,modernuo-ninjitsu}.md` (citing exact `modernuo/ModernUO` C# lines), `design/MODERNUO_MAPPING.md` (translating all 8 Bushido and 9 Ninjitsu mechanics to UO Idle primitives), and the baseline tick simulator (`tools/sim_balance.ts` / `sim/`) outputting reference curves for Warrior, Mage, and Ranger across Early, Mid, Late, and Endgame brackets.
**Uses:** `tsx`, `gh api` extracts in `_raw/modernuo/`, verified formulas from Phases 2–3.
**Implements:** Combat & Balance Simulator (Baseline Engine) & ModernUO Adaptation Matrix.
**Avoids:** Pitfall 4 (Literal translation of spatial/manual UO mechanics that fail in idle combat).

### Phase 5: Samurai (Bushido) & Ninja (Ninjitsu) Skill Line Design, Parity Tuning & Drop-In Code
**Rationale:** With schemas, baselines, and ModernUO mappings locked, Samurai and Ninja can be authored directly as schema-validated JSON definitions, iteratively tuned in the simulator until numerical parity is proven, and documented in formal specs with zero spec-to-JSON drift.
**Delivers:** Schema-validated drop-in definitions (`design/drop-in/{samurai,ninja}.json` and `classes-patch.js`), dual implementation specs (Mode A zero-engine-change & Mode B minimal native hook), `design/SAMURAI_SPEC.md`, `design/NINJA_SPEC.md`, and `design/BALANCE_REPORT.md` (with full 5-class DPS, EHP, TTK/overkill, and resource sustainability tables).
**Uses:** `tools/sim_balance.ts`, `schemas/`, `mechanics/tools/kb.py`.
**Implements:** Single-Source-of-Truth Class Design Package & Parity Proof.
**Avoids:** Pitfall 5 (Class homogenization) and Pitfall 6 (Idle numerical balance skew, resource starvation, overkill waste, and EHP immortality).

### Phase 6: Visual Beta UI Mockups, Custom Iconography & Final Deliverable Packaging
**Rationale:** Visual mockups and tooltips display exact skill names, unlock levels, cooldowns, and damage percentages; building them after Phase 5 numerical lock prevents costly asset and layout rework.
**Delivers:** Custom dark-fantasy UO-styled class portraits and full skill tree icon sets (`mockups/assets/icons/{samurai,ninja}/`), pixel-accurate HTML/CSS beta UI mockups (`mockups/{samurai,ninja}-skill-tree.html`) matching `https://uoidle.com/beta`'s live DOM/CSS (`#0b0d0a`, `Cinzel` + `IBM Plex Sans`), high-resolution DevTools screenshots, final `kb.py build && kb.py check` verification, and private GitHub sync.
**Uses:** Built-in image generation, `pillow 13.0.0`, live beta CSS variables, Chrome DevTools MCP screenshot capture.
**Implements:** Visual Mockups & Asset Suite (`mockups/`).
**Avoids:** UX Pitfalls (generic AI art mismatch, unreadable 32x32/48x48 silhouettes, and spec-to-mockup tooltip drift).

### Phase Ordering Rationale

- **Verification Before Design (Phases 1–3 → Phases 4–5):** Enforces the core constraint that zero UO Idle mechanics or class structures are guessed; `schemas/` and `class-structural-parity.md` act as hard gates before any Samurai or Ninja skill is finalized.
- **Single-Source JSON Before Prose & Mockups (Phase 5 → Phase 6):** Generating spec tables and UI mockup tooltips directly from simulator-verified `design/drop-in/{samurai,ninja}.json` guarantees 100% numerical consistency across code, docs, and visuals.
- **Continuous Linting & Privacy Gates:** Running `kb.py check` (including the credential sanitizer) at the end of every phase prevents late-stage verification cascades or accidental token commits.

### Research Flags

Phases needing targeted inspection during phase planning:
- **Phase 2 (Core Combat & Server vs Client Authority):** Requires live inspection of `https://uoidle.com/beta` WebSocket frames / API responses via Chrome DevTools MCP alongside `/assets/index-CCYN0Dy6.js` to confirm whether any combat mitigation, proc rate, or tick quantization rules run server-side outside the client bundle.
- **Phase 3 (Live Status Effect Opcode Vocabulary):** Requires enumerating the exact status effect and trigger enum keys in `/assets/index-CCYN0Dy6.js` to draw the exact boundary between "Mode A (100% existing opcodes)" and "Mode B (minimal native hook)" for Phase 5.

Phases with established patterns (can skip deep external research):
- **Phase 1 (`kb.py` Adaptation & Bundle Slicing):** Direct adaptation of `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py` (already inspected line-by-line) and standard `prettier` + `acorn` AST extraction.
- **Phase 4 (ModernUO Formula Extraction):** All 8 Bushido and 9 Ninjitsu C# files in `modernuo/ModernUO` have already been located and their exact formulas extracted in `FEATURES.md`.
- **Phase 6 (UI Mockups & Icon Composition):** Live beta theme variables (`#0b0d0a`, `Cinzel`, `IBM Plex Sans`) and local `pillow 13.0.0` tooling are already verified.

## Confidence Assessment

| Area | Confidence | Notes |
|------|------------|-------|
| Stack | **HIGH** | Directly verified local Python `3.15.2`, Node `v26.13.0`, `gh 2.103.3`, `pillow 13.0.0`, reference `kb.py` (1,617 LOC), and live `https://uoidle.com/beta` (`v0.99.0`, `/assets/index-CCYN0Dy6.js`). |
| Features | **HIGH** | Every canonical Bushido and Ninjitsu formula was verified directly against `modernuo/ModernUO` C# source (`Projects/UOContent/Spells/{Bushido,Ninjitsu}/`, `HonorContext.cs`, `BaseWeapon.cs`). |
| Architecture | **HIGH** | Proven `mudlet-dragonball-evolution/mechanics/` verification architecture cleanly combined with schema-first simulation and single-source drop-in JSON deliverables. |
| Pitfalls | **HIGH** | Grounded in concrete inspection of `kb.py` static checks, minified Vite bundle characteristics, idle RPG mathematical failure modes, and live session security constraints. |

**Overall confidence:** **HIGH**

### Gaps to Address

- **Exact In-Bundle Opcodes for Multi-Target & Hit Interception:** During Phase 2–3 AST slicing of `/assets/index-CCYN0Dy6.js`, verify whether live UO Idle encounters support multi-enemy wave arrays (for *Momentum Strike*) and charge-based shield/dodge buffs (for *Mirror Image*). If combat is strictly 1v1 or uses flat shield HP, apply the pre-designed Mode A fallbacks (overkill carryover / echo strike for *Momentum Strike*; high-dodge charges or ablative ward for *Mirror Image*) while documenting the Mode B hook.
- **Locale String Handling (`pt-BR` vs `en`):** UO Idle's bundle may contain bilingual or `pt-BR`/`en` locale tables. During Phase 1–3, ensure `schemas/class.schema.json` and `design/drop-in/{samurai,ninja}.json` include all locale keys expected by the live client UI.

## Sources

### Primary (HIGH confidence)
- [`/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py`](file:///Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py) & [`CONTRIBUTING.md`](file:///Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/CONTRIBUTING.md) — Reference 1,617-line claim verification engine, frontmatter contract, and 27 self-test mutation checks.
- `https://uoidle.com/beta` & `https://uoidle.com/VERSION` — Live beta probe confirming version `0.99.0`, Vite bundle `/assets/index-CCYN0Dy6.js` (2,278,691 bytes), Cloudflare headers, and CSS typography/theme properties.
- `https://github.com/modernuo/ModernUO` (via `gh api`) — Canonical C# source for Bushido (`Projects/UOContent/Spells/Bushido/*.cs`), Ninjitsu (`Projects/UOContent/Spells/Ninjitsu/*.cs`, `Items/Skill Items/Ninjitsu/*.cs`), Perfection (`Engines/Virtues/HonorContext.cs`), and weapon/spell parry (`Items/Weapons/BaseWeapon.cs`).
- [`/Users/brbrainerd/dev/uoIdle/.planning/PROJECT.md`](file:///Users/brbrainerd/dev/uoIdle/.planning/PROJECT.md) — Project scope, constraints, and deliverable requirements.

---
*Research completed: 2026-11-06*
*Ready for roadmap: yes*
