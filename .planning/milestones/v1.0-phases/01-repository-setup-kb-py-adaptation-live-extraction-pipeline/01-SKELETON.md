# Walking Skeleton — UO Idle (`uoIdle`)

**Phase:** 1 — Repository Setup, `kb.py` Adaptation & Live Extraction Pipeline
**Generated:** 2026-11-07

## User Story

> **As a** UO Idle Lead Developer, **I want to** establish a private, credential-sanitized repository with an automated claim-verification engine (`mechanics/tools/kb.py`) and deterministic `_raw/` extractors for the live UO Idle client bundle and canonical ModernUO C# Bushido/Ninjitsu sources, **so that** every formula, class progression rule, and skill specification in Phases 2–6 can be verified against verbatim line-cited source code with zero secret leaks.

## Capability Proven End-to-End

> A developer or agent can run the deterministic extraction pipeline (`tools/bundle_extract.mjs` and `tools/fetch_modernuo.py`) to populate `mechanics/_raw/{bundle,api,wiki,modernuo}/` and `mechanics/_evidence/` with SHA-256 provenance in `mechanics/_raw/manifest.json`, and run `python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics` to get `"ok": true` (exit `0`) with verified raw manifest integrity, credential sanitization, and generated `mechanics/INDEX.md`.

## Walking Skeleton Boundary & SPIDR Split Decisions

| SPIDR Dimension | Slice / Boundary Decision | Rationale |
|---|---|---|
| **Spike / Skeleton (`01-01-PLAN.md`, Wave 1)** | Repository privacy & `.gitignore` hardening, `mechanics/CONTRIBUTING.md`, adapted `mechanics/tools/kb.py` (`--self-test`, `build`, `check`, `check_raw_manifest`, `check_credentials`), seed `mechanics/_raw/manifest.json`, and generated `mechanics/INDEX.md` (`KB-01`, `KB-02`). | Establishes the end-to-end verification and secret-scanning gate first so every subsequent extraction slice is immediately validated by `kb.py check --root mechanics`. |
| **Interface / Data Slice 1 (`01-02-PLAN.md`, Wave 2)** | Live UO Idle `v0.99.0` bundle & surface extraction via `tools/bundle_extract.mjs` (`prettier` + `acorn` AST slicing of `index-CCYN0Dy6.js`, `Jogo-D5xEfvfV.js`, `bonecoVivo-DY66RLNm.js`, `Jogo-CVXGOt-C.css`, `abilities.json`, `ability-icons.json`, changelogs, and redacted `_evidence/`) into `mechanics/_raw/{bundle,wiki,api}/` and `mechanics/_raw/manifest.json` (`KB-03`). | Separates the Node.js (`prettier` + `acorn`) web bundle AST extraction from the Python (`gh api`) C# reference extraction, avoiding concurrent writes to `mechanics/_raw/manifest.json`. |
| **Interface / Data Slice 2 (`01-03-PLAN.md`, Wave 3)** | Canonical ModernUO C# reference extraction via `tools/fetch_modernuo.py` (`gh api` at commit `b0e6b17c5cba3a6944ca25a9676dcdec0022ac38`) pulling all 48 Bushido, Ninjitsu, Perfection (`HonorContext.cs`), Parry (`BaseWeapon.cs`), and Tokuno SE weapon `.cs` files into `mechanics/_raw/modernuo/` and updating `mechanics/_raw/manifest.json` (`KB-04`). | Completes the immutable `_raw/` corpus across both games (`uoidle.com/beta` and `modernuo/ModernUO`) and proves full-manifest verification under `kb.py check --root mechanics`. |

## Architectural Decisions

| Decision | Choice | Rationale |
|---|---|---|
| **Verification & Linter Engine** | Python 3 stdlib (`mechanics/tools/kb.py`, zero pip dependencies) | Runs identically on macOS system Python (`3.9+`) and Homebrew Python (`3.15+`); validates 9-key JSON-per-line YAML frontmatter, verbatim `(raw L<a>-L<b>)` substring quotes, digit-free `## Summary` sections, 6-tier evidence ranks, SHA-256 manifest integrity, and credential sanitization. |
| **Bundle Formatting & AST Slicing** | Node.js ES module (`tools/bundle_extract.mjs`) using `prettier` (`3.9.10`, `printWidth: 100`, `singleQuote: true`) + `acorn` (`8.19.0`) | Normalizes single-line minified Vite chunks (`index-CCYN0Dy6.js` and `Jogo-D5xEfvfV.js`) into stable `<=100`-char lines and slices exact top-level AST declarations so `(raw L<a>-L<b>)` citations remain human-readable and avoid double-quote escaping collisions. |
| **ModernUO Source Archival** | Python 3 CLI (`tools/fetch_modernuo.py`) using `gh api` / raw GitHub content pinned to commit `b0e6b17c5cba3a6944ca25a9676dcdec0022ac38` | Fetches the exact 48 canonical Bushido, Ninjitsu, Honor/Perfection, Parry, and Tokuno weapon C# files in seconds with deterministic SHA-256 provenance without cloning a multi-gigabyte repository. |
| **Provenance & Secret Gate** | Unified `mechanics/_raw/manifest.json` + `check_credentials()` in `kb.py` + `.gitignore` blocking `mechanics/_crawl/` | Guarantees 1:1 SHA-256 and line-count tracking of all committed `_raw/` files while blocking leaked JWTs (`eyJ...`), Bearer tokens, `uo-idle-token`, `uoidle.convidado`, and cookies. |
| **Directory Layout** | `mechanics/{_raw,_evidence,classes,combat,systems,topics,entities,modernuo,tools}/`, `tools/`, `schemas/`, `sim/`, `design/`, `mockups/` | Separates gitignored staging (`mechanics/_crawl/`), immutable raw sources (`mechanics/_raw/`), claim-verified KB pages (`mechanics/{classes,combat,systems,topics}/`), simulator/schemas (`sim/`, `schemas/`), and drop-in class packages (`design/`, `mockups/`). |

## Stack Touched in Phase 1

- [x] Project scaffold (`.gitignore`, `package.json`, `mechanics/` and `tools/` directory structure)
- [x] Verification & linting CLI (`mechanics/tools/kb.py` with `--self-test`, `build`, `check`, `check_raw_manifest`, and `check_credentials`)
- [x] Data extraction layer 1 — Live UO Idle Vite bundle AST slicer & changelog/API/evidence extractor (`tools/bundle_extract.mjs`)
- [x] Data extraction layer 2 — Canonical ModernUO C# Bushido/Ninjitsu/Parry/Perfection/Tokuno extractor (`tools/fetch_modernuo.py`)
- [x] Provenance & index layer — `mechanics/_raw/manifest.json` and generated `mechanics/INDEX.md`

## Out of Scope (Deferred to Later Slices)

> Explicitly excluded from Phase 1 so the walking skeleton stays focused on the verification engine and immutable `_raw/` extraction pipeline:

- Authoring the prose/claim markdown pages for combat tick loops, hit/crit/armor mitigation, status opcodes, and progression (`mechanics/combat/*.md`, `mechanics/systems/*.md` — **Phase 2**)
- Authoring the Warrior, Mage, and Ranger KB pages and `zod` / JSON Schema validation contracts (`mechanics/classes/{warrior,mage,ranger}.md`, `schemas/*.schema.json` — **Phase 3**)
- Authoring the ModernUO Bushido/Ninjitsu KB pages, `design/MODERNUO_MAPPING.md`, and deterministic combat simulator (`tools/sim_balance.ts` — **Phase 4**)
- Authoring Samurai and Ninja skill line designs, Tokuno itemization, and `design/drop-in/{samurai,ninja}.json` (`design/*` — **Phase 5**)
- Generating custom skill icons and pixel-accurate `uoidle.com/beta` HTML/CSS mockups (`mockups/*` — **Phase 6**)

## Subsequent Slice Plan

Each later phase adds one vertical capability slice on top of this Phase 1 skeleton without altering its `kb.py` contract or `_raw/manifest.json` architecture:

- **Phase 2:** Reverse-engineer core UO Idle combat math, cooldown/haste resolution, status opcodes, progression/equipment systems, and the Engine Capability Matrix into claim-verified `mechanics/combat/` and `mechanics/systems/` pages (`INDEX-01`, `INDEX-02`).
- **Phase 3:** Document live Warrior, Mage, and Ranger skill lines in `mechanics/classes/` and codify `schemas/{class,skill,effect}.schema.json` + `mechanics/topics/class-structural-parity.md` (`INDEX-03`, `INDEX-04`).
- **Phase 4:** Document canonical ModernUO Bushido & Ninjitsu formulas (`mechanics/classes/modernuo-{bushido,ninjitsu}.md`, `design/MODERNUO_MAPPING.md`) and calibrate the deterministic combat simulator (`tools/sim_balance.ts`) against live Warrior/Mage/Ranger baselines (`SIM-01`, `SIM-02`).
- **Phase 5:** Design, parity-tune ($\pm 5\text{–}8\%$), and package Samurai and Ninja skill lines, Tokuno weapon/equipment affixes, Dual Implementation Modes (Mode A & Mode B), and `design/BALANCE_REPORT.md` (`SIM-03`, `CLASS-01..04`).
- **Phase 6:** Render custom dark-fantasy UO skill icons and self-contained `uoidle.com/beta` HTML/CSS skill tree mockups (`VISUAL-01`, `VISUAL-02`).
