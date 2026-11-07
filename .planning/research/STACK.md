# Stack Research

**Domain:** Claim-Verified Game Mechanics Knowledgebase, Vite JS Bundle Reverse Engineering, C# Reference Extraction (ModernUO), and Idle RPG Class Design / Numerical Balance Simulation
**Researched:** 2026-11-06
**Confidence:** HIGH

## Recommended Stack

### Core Technologies

| Technology | Version | Purpose | Why Recommended |
|------------|---------|---------|-----------------|
| **Python 3 (stdlib)** | `3.15.2` (compat down to `/usr/bin/python3` `3.9.6`) | Claim-verified knowledgebase engine (`mechanics/tools/kb.py`), deterministic `_raw/` slicing, and mutation self-testing | The reference `mudlet-dragonball-evolution/mechanics/tools/kb.py` (1,617 lines) is intentionally zero-dependency Python 3 stdlib (`json`, `re`, `hashlib`, `pathlib`, `argparse`, `tempfile`). Keeping `kb.py` stdlib-only guarantees instant execution in any worktree, CI environment, or subagent session without virtualenv drift, while parsing frontmatter via `json.loads` per line (valid YAML flow syntax without `PyYAML`). |
| **Node.js + TypeScript (`tsx` / `acorn` / `astravel`)** | Node `v26.13.0` + npm `11.20.0` | Vite JS bundle AST parsing, deterministic pretty-printing/slicing, drop-in skill schema validation (`zod`), and deterministic tick-based combat/DPS simulation | UO Idle (`v0.99.0`) ships a 2.28 MB minified Vite ES module (`/assets/index-CCYN0Dy6.js`) with no public source map (`.js.map` returns SPA HTML fallback). Executing AST extraction and combat simulations in Node/TypeScript allows us to directly evaluate or mirror the exact JS `Math.*` floating-point semantics and object schemas used by the UO Idle client/server engine. |
| **Chrome DevTools MCP (`chrome-devtools`) + `curl`** | Live MCP + `curl 8.x` | Authenticated live DOM/network/WebSocket inspection, `localStorage`/Pinia/React state extraction, and static asset/bundle fetching | `https://uoidle.com/beta` is behind Cloudflare (`cf-cache-status: DYNAMIC`) and requires an authenticated browser session for live character state, WebSocket/API traffic, and in-app wiki/compendium views. `chrome-devtools` reads live authenticated browser memory and network frames read-only without tripping Cloudflare bot protection, while `curl` fetches immutable CDN/Vite assets (`/VERSION`, `/assets/index-*.js`). |
| **GitHub CLI (`gh`) + `ripgrep` (`rg`) + `jq`** | `gh 2.103.3`, `rg 15.2.0` (PCRE2 JIT), `jq 1.8.2` | ModernUO C# source extraction (`modernuo/ModernUO`), JSON evidence querying, and cross-file constant discovery | `gh api` retrieves exact file trees and raw C# source (`Projects/UOContent/Spells/Bushido/*.cs`, `Projects/UOContent/Spells/Ninjitsu/*.cs`, `Projects/UOContent/Items/Skill Items/Ninjitsu/*.cs`) without cloning a multi-gigabyte repository history. `rg` with PCRE2 JIT and `jq` provide sub-millisecond querying across sliced `_raw/` extracts and JSON manifests. |
| **Pillow (`PIL`) + Built-in Image Generation + Scoped HTML/CSS** | `pillow 13.0.0` | Skill/class iconography post-processing and pixel-accurate beta UI mockup composition | `pillow 13.0.0` is already installed in the local Python environment for cropping, resizing, border-framing, and sprite-sheet assembly of generated dark-fantasy UO icons. Combining generated icon assets with UO Idle's live CSS custom properties (`#0b0d0a` theme, `Cinzel` + `IBM Plex Sans` typography) inside a standalone HTML/CSS harness produces authentic beta UI mockups captured via Chrome DevTools screenshots. |

### Supporting Libraries

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **`acorn` + `acorn-walk`** | `^8.14.0` / `^8.3.4` | Fast, zero-dependency ECMAScript AST parser and walker | Use in `tools/bundle_extract.mjs` to locate Warrior, Mage, and Ranger skill definitions, combat formula functions, status effect registries, and i18n (`pt-BR` / `en`) string tables inside `/assets/index-*.js` and emit deterministic, line-numbered `_raw/` slices. |
| **`prettier` (or `js-beautify`)** | `^3.5.0` | Deterministic formatting of minified JS bundle before AST slicing | **Critical for `kb.py` compatibility:** `kb.py` validates claims against `(raw L<a>-L<b>)` line spans. A raw minified Vite bundle packs 2.28 MB onto a handful of lines; formatting `/assets/index-*.js` with fixed `printWidth: 100` before slicing produces stable, readable line numbers for `_raw/` citations. |
| **`zod` + `typescript`** | `^3.24.0` / `^5.8.0` | Strict runtime + static schema validation for reverse-engineered Warrior/Mage/Ranger skills and proposed Ninja/Samurai drop-in definitions | Use to prove 100% structural and type parity between live classes (`warrior`, `mage`, `ranger`) and the proposed `ninja` (Ninjitsu) and `samurai` (Bushido) JSON/TS payloads. |
| **`tsx`** | `^4.19.0` | Zero-build TypeScript script execution on Node `v26.13.0` | Use to run `tools/sim_balance.ts` and `tools/validate_skills.ts` directly without maintaining a `dist/` build step. |

### Development Tools

| Tool | Purpose | Notes |
|------|---------|-------|
| **`mechanics/tools/kb.py`** (adapted from `mudlet-dragonball-evolution`) | Builds `mechanics/INDEX.md`, validates frontmatter (`FM_KEYS`), enforces verbatim quote matching (`check_claims`), checks cross-page `[[slug]] C<n>` links, and runs mutation self-tests (`--self-test`) | Must be adapted from CircleMUD telnet help-file assumptions to UO Idle's multi-source architecture (`_raw/bundle/`, `_raw/wiki/`, `_raw/modernuo/`, `_evidence/`). Confidence: **HIGH**. |
| **`tools/bundle_extract.mjs`** | Fetches/formats the Vite bundle and extracts named domain slices (`skills-warrior.js`, `skills-mage.js`, `skills-ranger.js`, `combat-engine.js`, `status-effects.js`, `classes-config.js`) + `manifest.json` | Writes SHA-256 hashes and bundle version (`0.99.0`, `index-CCYN0Dy6.js`) into `mechanics/_raw/bundle/manifest.json` so `kb.py check` can verify 1:1 raw-to-page integrity. Confidence: **HIGH**. |
| **`tools/fetch_modernuo.py`** | Pulls canonical ModernUO C# files for Bushido and Ninjitsu via `gh api` into `mechanics/_raw/modernuo/` with commit SHA provenance | Captures all 8 Bushido files, 10 Ninjitsu spell/move files, and 7 Ninjitsu item files with exact line numbers for `modernuo-stated` claim citations. Confidence: **HIGH**. |
| **`tools/sim_balance.ts`** | Deterministic tick-based Monte Carlo & expected-value combat simulator | Runs Warrior, Mage, Ranger, Samurai, and Ninja across level brackets (early/mid/late/endgame) against Low/Mid/High-mitigation and Multi-target enemy archetypes to prove numerical balance. Confidence: **HIGH**. |

---

## Adapting `kb.py` from `mudlet-dragonball-evolution` to UO Idle

Inspecting `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py` (1,617 lines) reveals a remarkably strong verification engine with **27 self-tested mutation error codes** (`fm-*`, `claim-*`, `quote-not-in-raw`, `quote-line-mismatch`, `status-mismatch`, `summary-number`, `link-broken`, `link-claim-missing`, `index-stale`, etc.). However, several parts of `kb.py` are hardcoded to a CircleMUD telnet help crawler and must be cleanly adapted for UO Idle:

### 1. Keep Unchanged (Core Verification Invariants)
- **Zero-dependency stdlib architecture**: `json.loads` per frontmatter line between `---` fences (`parse_frontmatter`), avoiding third-party YAML parsers.
- **Verbatim claim verification (`check_claims`, L187–L214)**: `CLAIM_LINE` regex (`^- \*\*C(\d+)\*\* \[([a-z-]+)\] "(.*)" \((?:raw L(\d+)(?:-L(\d+))?|evidence (\d+))\)$`) and whitespace-collapsed `ws()` substring verification against `sources[0]` lines `a..b`.
- **Digit-free `## Summary` rule (`check_summary`, L291–L299)**: Forces all numbers, cooldowns, percentages, and level tiers out of prose summaries and into line-cited `## Claims`.
- **Cross-claim linking (`check_links`, L158–L180)**: `[[slug]]` and `[[slug]] C<n>` validation across all KB directories.
- **Weakest-claim page status (`check_status`, L279–L288)**: Page `status` automatically equals the weakest claim rank on the page.
- **Self-test harness (`--self-test`, L1532–L1580)**: Temp-directory mutation testing guaranteeing every error code is actively caught.

### 2. Required Adaptations in `mechanics/tools/kb.py` for UO Idle

| `kb.py` Component (mudlet-dbe) | Why It Breaks on UO Idle | Exact Adaptation for UO Idle |
|--------------------------------|--------------------------|------------------------------|
| **`PAGE_DIRS = ("help", "topics")` (L43)** | UO Idle is not a MUD with `help <keyword>` telnet files; its truth comes from client bundle slices, in-game wiki/compendium docs, ModernUO C# reference files, and synthesis topics. | Expand `PAGE_DIRS` to `("entities", "topics", "modernuo")` (or keep `"help"` aliased to `"entities"` for extracted game/bundle/wiki entities, `"modernuo"` for canonical UO C# mechanics, and `"topics"` for cross-cutting engine & class design synthesis). |
| **`CATEGORIES` (L39–L42)**: `races`, `transformations`, `regen-rest`, `commands-ui`, etc. | Dragonball Evolution categories (`transformations`, `races`) do not match UO Idle's domain. | Replace with UO Idle's fixed category tuple: `("classes", "skills", "combat", "status-effects", "progression", "items-equipment", "dungeons-monsters", "crafting-gathering", "companions-mounts", "engine-ui", "modernuo-bushido", "modernuo-ninjitsu")`. |
| **`TAGS` & `RANK` (L37–L38)**: `("help-stated", "verified", "contradicted", "unverified")` | In UO Idle, extracted client JS bundle code is executable ground truth (`code-verified`), wiki/tooltip text is `doc-stated`, live network/DOM telemetry is `live-verified`, and ModernUO C# source is `modernuo-stated`. | Update `TAGS` and `RANK` (weakest first): `RANK = {"contradicted": 0, "unverified": 1, "modernuo-stated": 2, "doc-stated": 3, "code-stated": 4, "verified": 5}` (or retain backward-compatible aliases in `kb.py --self-test` while adding `code-stated` / `modernuo-stated`). |
| **`FM_KEYS` (L35)**: includes `"bot_refs"` | There is no Mudlet Lua bot (`wanderbot`); instead, claims map to game bundle identifiers or class design spec references. | Either retain `bot_refs` as `code_refs` (referencing bundle symbols/spec IDs like `"bundle:index-CCYN0Dy6.js:WARRIOR_SKILLS"`) or keep key name `code_refs` across all frontmatter and self-tests. |
| **MUD Help Block Grammar (`find_blocks`, `parse_entry`, `RULE_RE`, `KEYWORDS_PREFIX`, L433–L515)** | Parses `----...` + `Help Keywords:` ASCII blocks from telnet responses. UO Idle `_raw/` files are formatted JS AST slices (`.js`/`.json`), wiki markdown/text (`.txt`), and ModernUO C# files (`.cs`). | Replace the telnet help block parser in `cmd_diff` / page generator with a structured `_raw/` manifest loader that accepts any text file under `_raw/{bundle,wiki,modernuo}/<slug>.txt` (or `.js`/`.cs`) recorded in `_raw/manifest.json` with SHA-256 integrity checking. |
| **Telnet Sweep Completeness (`completeness`, L664–L699)** | Checks 2-pass telnet keyword prefix sweeps (`firstMatchViolations`, `replacementChars`). | Replace `completeness(manifest)` with **Bundle & Domain Coverage Completeness**: verifies that every exported skill ID, class ID (`warrior`, `mage`, `ranger`), status effect ID, and combat formula block discovered by the AST extractor in `index-*.js` has a corresponding `_raw/` slice and KB page with zero `raw-orphan` or `page-missing` entries. |
| **`EVIDENCE_PREFIXES` (L56)**: `("trace: ", "log: ", "code: ", "ledger: ", "live: ")` | Mudlet `debug-mdt.ndjson` traces don't exist here. | Standardize evidence prefixes to `("bundle: ", "network: ", "dom: ", "modernuo: ", "sim: ", "live: ")`, where `live: _evidence/<file> L<a>[-L<b>]` continues to validate exact line ranges in committed `_evidence/` captures (`check_live`, L251–L267). |

---

## Installation

```bash
# 1. Knowledgebase Engine (Python 3 stdlib — zero pip installs required)
python3 mechanics/tools/kb.py --self-test

# 2. Bundle AST Extractor, Schema Validator & Combat Simulator (local dev dependencies only)
npm init -y
npm install -D typescript@^5.8.0 tsx@^4.19.0 @types/node@^22.0.0 prettier@^3.5.0 acorn@^8.14.0 acorn-walk@^8.3.4 zod@^3.24.0
```

## Alternatives Considered

| Recommended | Alternative | When to Use Alternative |
|-------------|-------------|-------------------------|
| **Python 3 stdlib `kb.py` (`json.loads` line frontmatter)** | `PyYAML` + `MkDocs` / `Docusaurus` / `Obsidian` plugins | Never for this project. External static-site generators do not enforce verbatim substring & line-number verification (`quote-line-mismatch`) or digit-free summaries (`summary-number`). |
| **Formatted Vite Bundle + `acorn` AST Slicing (`tools/bundle_extract.mjs`)** | Regex-only `grep` on raw minified `/assets/index-CCYN0Dy6.js` | Only for quick 5-second existence checks. Regex over a 2.28 MB minified file cannot reliably extract nested skill objects or produce human-readable `(raw L<a>-L<b>)` line spans for `kb.py`. |
| **Chrome DevTools MCP (`chrome-devtools`) + `curl`** | Standalone Playwright / Puppeteer headless login scraper | Only if running unattended in a remote CI pipeline. Since `https://uoidle.com/beta` is behind Cloudflare and already authenticated in the active Chrome DevTools MCP session, launching separate headless browsers risks Cloudflare challenges and session invalidation. |
| **`gh api` targeted ModernUO C# extraction** | Full `git clone https://github.com/modernuo/ModernUO.git` | Only if we needed to compile and execute the full C# ModernUO server locally. We only need the ~25 canonical Bushido and Ninjitsu `.cs` source files and tests (`Projects/UOContent/Spells/{Bushido,Ninjitsu}/`), which `gh api` fetches in <3 seconds. |
| **TypeScript (`tsx`) Tick Simulator + `zod`** | Python simulator (`numpy`/`scipy`) | Use Python only if doing heavy matrix optimization. Because UO Idle's client/server is written in JavaScript/TypeScript, running the combat simulator and schema validator in TypeScript (`tsx`) guarantees identical `Number` rounding, tick ordering, and direct copy-paste compatibility for the lead developer. |

## What NOT to Use

| Avoid | Why | Use Instead |
|-------|-----|-------------|
| **Unformatted Minified JS in `mechanics/_raw/`** | `/assets/index-CCYN0Dy6.js` is 2,278,691 bytes minified onto a few lines. Citing `(raw L1-L1)` against a 2.28 MB line defeats line-referenced verification and slows `kb.py check` to a crawl. | Run `prettier` (fixed config: `printWidth: 100, singleQuote: true`) + `acorn` AST extraction to write deterministic, domain-scoped `.js` / `.txt` slices under `mechanics/_raw/bundle/` before citing line numbers. |
| **Aggressive Automated HTTP/WebSocket Fuzzing against `uoidle.com`** | Violates PROJECT.md Out of Scope ("strictly read-only inspection of the authenticated beta client, bundle, and public docs/wiki") and triggers Cloudflare rate-limiting (`cf-ray`). | Read-only inspection of the already-loaded DOM, `localStorage`, passive network/WebSocket frames via `chrome-devtools`, and single `curl` downloads of static bundle assets. |
| **Generic UO Wiki Guesses (UO Stratics / UOGuide) Without Source Verification** | Public UO wikis mix eras (AoS, SE, ML, SA, TOL) and shards. Guessing formulas without citing either `_raw/bundle/` (for UO Idle rules) or `_raw/modernuo/` (for canonical Bushido/Ninjitsu reference) violates Verification Integrity. | Cite verbatim C# lines from `modernuo/ModernUO` (`Projects/UOContent/Spells/Bushido/*.cs` and `Ninjitsu/*.cs`) tagged `[modernuo-stated]`, and adapt them explicitly to UO Idle's verified combat primitives. |
| **LLM-Paraphrased Numbers in KB `## Summary` Sections** | Paraphrased numbers drift when game versions update (e.g., `0.99.0` -> `0.99.1`) and bypass `kb.py`'s quote verifier. | Keep `kb.py`'s `summary-number` check enabled: zero digits in `## Summary`; every number must live in a `- **C<n>**` claim quoting `sources[0]` verbatim. |

## Stack Patterns by Variant

**When extracting mechanics from the Vite JS bundle (`/assets/index-*.js`):**
- Fetch `/VERSION` (`0.99.0`) and `/assets/index-CCYN0Dy6.js` once via `curl` into a gitignored staging cache (`mechanics/_crawl/bundle/`).
- Format deterministically with `prettier` and run `tools/bundle_extract.mjs` (`acorn`) to slice out class registries, Warrior/Mage/Ranger skill arrays, combat math functions, status effect definitions, and i18n strings (`pt-BR` and `en` if present) into `mechanics/_raw/bundle/<slug>.txt`.
- Generate/update KB pages under `mechanics/entities/<slug>.md` with `[code-stated]` claims citing `(raw L<a>-L<b>)`.

**When capturing live runtime state or network payloads from `https://uoidle.com/beta`:**
- Inspect via `chrome-devtools` MCP (`evaluate_script`, `list_network_requests`, `get_network_request`, `take_snapshot`).
- Save redacted, deterministic excerpts to `mechanics/_evidence/<slug>.txt` (never committing session tokens, cookies, or credentials).
- Promote matching claims from `[code-stated]` or `[doc-stated]` to `[verified]` by adding `live: _evidence/<slug>.txt L<a>-L<b>` to the page's `evidence` frontmatter list.

**When extracting ModernUO Bushido & Ninjitsu canonical mechanics:**
- Fetch the exact `.cs` files from `modernuo/ModernUO` (`Confidence.cs`, `CounterAttack.cs`, `Evasion.cs`, `HonorableExecution.cs`, `LightningStrike.cs`, `MomentumStrike.cs`, `SamuraiMove.cs`, `SamuraiSpell.cs`, `AnimalForm.cs`, `Backstab.cs`, `DeathStrike.cs`, `FocusAttack.cs`, `KiAttack.cs`, `MirrorImage.cs`, `NinjaMove.cs`, `NinjaSpell.cs`, `ShadowJump.cs`, `SurpriseAttack.cs`, plus Ninjitsu items `Shuriken.cs`, `Fukiya.cs`, `SmokeBomb.cs`, `EggBomb.cs`) via `gh api` into `mechanics/_raw/modernuo/<slug>.txt`.
- Document canonical formulas (skill requirements, mana costs, scaling math, perfection/evasion/stealth rules) in `mechanics/modernuo/<slug>.md` with `[modernuo-stated]` claims citing exact C# line spans.

**When designing & balancing Ninja and Samurai skill lines:**
- Express live Warrior, Mage, and Ranger skills and proposed Ninja and Samurai skills in a unified TypeScript/JSON schema (`src/schemas/skill.schema.ts` validated with `zod`).
- Run `npx tsx tools/sim_balance.ts` using the exact combat loop formulas verified in `mechanics/topics/mech-combat.md` to output comparative DPS, effective HP (EHP), sustain, and resource economy tables across all unlock tiers.

## Version Compatibility

| Package / Tool | Compatible With | Notes |
|----------------|-----------------|-------|
| `mechanics/tools/kb.py` | Python `3.9.6` (`/usr/bin/python3`) through `3.15.2` (Homebrew/active `python3`) | Uses `from __future__ import annotations` and stdlib only; zero version-specific C extensions. |
| `node v26.13.0` | `tsx@^4.19.0`, `acorn@^8.14.0`, `prettier@^3.5.0`, `zod@^3.24.0` | Native ESM support; can also run basic `.ts` files with Node's built-in `--experimental-strip-types` if needed. |
| `pillow 13.0.0` | Python `3.15.2` | Pre-installed in the active Python environment; ready for icon post-processing and sprite composition. |
| `gh 2.103.3` | GitHub REST/GraphQL API v3/v4 | Authenticated and verified working against `repos/modernuo/ModernUO/git/trees/main?recursive=1`. |

## Sources

- `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py` — Inspected full 1,617-line reference implementation (`parse_frontmatter`, `check_claims`, `check_cites`, `check_live`, `check_status`, `check_summary`, `cmd_build`, `cmd_check`, `cmd_diff`, `run_self_test`) — **Confidence: HIGH**
- `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/CONTRIBUTING.md` — Inspected 9-key frontmatter contract, evidence hierarchy, claim syntax, and workflow — **Confidence: HIGH**
- `https://uoidle.com/beta` & `https://uoidle.com/VERSION` — Probed live headers and HTML shell (`v0.99.0`, `/assets/index-CCYN0Dy6.js` at 2,278,691 bytes, Cloudflare headers, `Cinzel` + `IBM Plex Sans` fonts, `#0b0d0a` theme color, SPA `.map` fallback) — **Confidence: HIGH**
- `https://github.com/modernuo/ModernUO` (via `gh api`) — Verified exact repository paths under `Projects/UOContent/Spells/Bushido/`, `Projects/UOContent/Spells/Ninjitsu/`, and `Projects/UOContent/Items/Skill Items/Ninjitsu/` — **Confidence: HIGH**

---
*Stack research for: UO Idle Mechanics Knowledgebase & Ninja/Samurai Class Design*
*Researched: 2026-11-06*
