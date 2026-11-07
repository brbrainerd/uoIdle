---
phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline
plan: 02
subsystem: infra
tags: [nodejs, prettier, acorn, ast-slicing, vite-bundle, changelog-extraction, manifest]

requires:
  - phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline
    provides: "mechanics/tools/kb.py multi-source manifest.json validator and credential scanner"
provides:
  - "package.json and package-lock.json with prettier, acorn, acorn-walk, zod, tsx, and typescript devDependencies"
  - "tools/bundle_extract.mjs deterministic Vite bundle formatter, Acorn AST domain slicer, changelog/API/protocol extractor, and --verify checker"
  - "14 formatted & AST-sliced live UO Idle v0.99.0 bundle modules under mechanics/_raw/bundle/"
  - "4 official server and client developer changelogs under mechanics/_raw/wiki/"
  - "2 redacted API status and WebSocket protocol command registries under mechanics/_raw/api/"
  - "Redacted live runtime/surface probe evidence file at mechanics/_evidence/live-bundle-probe.txt"
  - "20 verified SHA-256 and line-count provenance entries in mechanics/_raw/manifest.json"
affects:
  - 01-03
  - phase-2
  - phase-3
  - phase-4
  - phase-5
  - phase-6

actuals:
  tokens: 9500
  tasks: 2
  commits: 2

tech-stack:
  added: [prettier, acorn, acorn-walk, zod, tsx, typescript, "@types/node"]
  patterns:
    - "Prettier formatting (parser: babel, printWidth: 100, singleQuote: true) prior to Acorn AST slicing so JS strings use single quotes and never collide with kb.py double-quoted claim lines"
    - "4-line provenance header (// SOURCE, // BUNDLE_VERSION, // BUNDLE_SHA256, // AST_SPAN) prepended to every _raw/bundle/*.js slice"
    - "Automatic credential redaction filter before writing _raw/api/, _raw/wiki/, and _evidence/ files"
    - "Preserving non-bundle manifest entries when updating mechanics/_raw/manifest.json"

key-files:
  created:
    - package.json
    - package-lock.json
    - tools/bundle_extract.mjs
    - mechanics/_raw/bundle/classes-config.js
    - mechanics/_raw/bundle/skills-and-progression.js
    - mechanics/_raw/bundle/abilities-loader-and-hotbar.js
    - mechanics/_raw/bundle/character-bonus-and-status.js
    - mechanics/_raw/bundle/progression-tree-ui.js
    - mechanics/_raw/bundle/bestiary-and-wiki.js
    - mechanics/_raw/bundle/hunt-and-bot-config.js
    - mechanics/_raw/bundle/combat-estimators-and-hotbar.js
    - mechanics/_raw/bundle/i18n-en-abilities.js
    - mechanics/_raw/bundle/i18n-pt-abilities.js
    - mechanics/_raw/bundle/paperdoll-and-items.js
    - mechanics/_raw/bundle/abilities-catalog.json
    - mechanics/_raw/bundle/ability-icons-atlas.json
    - mechanics/_raw/bundle/game-theme.css
    - mechanics/_raw/wiki/changelog-server-dev.md
    - mechanics/_raw/wiki/changelog-client-dev.md
    - mechanics/_raw/wiki/changelog-server-en.md
    - mechanics/_raw/wiki/changelog-client-en.md
    - mechanics/_raw/api/closed-beta-status.json
    - mechanics/_raw/api/protocol-commands-index.json
    - mechanics/_evidence/live-bundle-probe.txt
  modified:
    - mechanics/_raw/manifest.json

key-decisions:
  - "Configured prettier with singleQuote: true and printWidth: 100 so formatted JS slices use single-quoted string literals and narrow line widths for verbatim kb.py (raw La-Lb) citations"
  - "Indexed both top-level FunctionDeclaration/VariableDeclaration statements and nested VariableDeclarator spans in Acorn so multi-declarator i18n locale bundles (index-CCYN0Dy6.js) and top-level game chunks (Jogo-D5xEfvfV.js) slice cleanly"
  - "Preserved existing non-bundle entries when updating mechanics/_raw/manifest.json so bundle_extract.mjs and fetch_modernuo.py compose idempotently"

patterns-established:
  - "Deterministic AST slicing from gitignored mechanics/_crawl/bundle/ cache into git-tracked mechanics/_raw/bundle/"
  - "Self-verifying --verify CLI flag on extraction tools cross-checking disk SHA-256 and line counts against mechanics/_raw/manifest.json"

requirements-completed:
  - KB-03

coverage:
  - id: D1
    description: "tools/bundle_extract.mjs deterministically formats and AST-slices all 14 live UO Idle v0.99.0 bundle modules into mechanics/_raw/bundle/"
    requirement: KB-03
    verification:
      - kind: integration
        ref: "node tools/bundle_extract.mjs && test $(ls -1 mechanics/_raw/bundle/ | wc -l) -eq 14 && rg -q 'warrior_whirlwind' mechanics/_raw/bundle/skills-and-progression.js && rg -q 'function Cq' mechanics/_raw/bundle/combat-estimators-and-hotbar.js"
        status: pass
    human_judgment: false
  - id: D2
    description: "Server/client changelogs, API/protocol command registries, and redacted live runtime probe evidence extracted and verified by bundle_extract.mjs --verify and kb.py check"
    requirement: KB-03
    verification:
      - kind: integration
        ref: "node tools/bundle_extract.mjs --verify && python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false

duration: 6min
completed: 2026-11-06
status: complete
---

# Phase 1 Plan 02: Live Bundle AST Slicing & Surface Extraction Summary

**Deterministic `prettier` + `acorn` AST extraction pipeline (`tools/bundle_extract.mjs`) producing 14 live UO Idle `v0.99.0` bundle slices, 4 server/client changelogs, 2 API/protocol registries, and redacted live runtime probe evidence with 100% `manifest.json` SHA-256 verification**

## Performance

- **Duration:** 6 min
- **Started:** 2026-11-07T03:33:30Z
- **Completed:** 2026-11-07T03:39:50Z
- **Tasks:** 2
- **Files modified:** 25

## Accomplishments

- Initialized `package.json` and `package-lock.json` (`npm install --ignore-scripts`) with `prettier`, `acorn`, `acorn-walk`, `zod`, `tsx`, `typescript`, and `@types/node`.
- Built `tools/bundle_extract.mjs` to download raw `v0.99.0` assets (`index-CCYN0Dy6.js`, `Jogo-D5xEfvfV.js`, `bonecoVivo-DY66RLNm.js`, `Jogo-CVXGOt-C.css`, `abilities.json`, `ability-icons.json`) into gitignored `mechanics/_crawl/bundle/`, format with `prettier` (`printWidth: 100, singleQuote: true`), and slice 14 domain files into `mechanics/_raw/bundle/` with 4-line provenance headers.
- Extracted all 4 official server and client developer changelogs (`changelog-server-dev.md`, `changelog-client-dev.md`, `changelog-server-en.md`, `changelog-client-en.md`) into `mechanics/_raw/wiki/`.
- Extracted `mechanics/_raw/api/closed-beta-status.json`, `mechanics/_raw/api/protocol-commands-index.json` (indexing all server `assunto` packet types and client `[command` speech verbs with exact line numbers), and redacted runtime probe evidence in `mechanics/_evidence/live-bundle-probe.txt`.
- Recorded all 20 `_raw/{bundle,wiki,api}/` files in `mechanics/_raw/manifest.json` and verified zero errors via `node tools/bundle_extract.mjs --verify` and `python3 mechanics/tools/kb.py check --root mechanics` (`KB-03`).

## Task Commits

Each task was committed atomically:

1. **Task 1: Initialize package.json and build tools/bundle_extract.mjs to format and AST-slice all 14 live UO Idle bundle modules into mechanics/_raw/bundle/** - `e706869` (feat)
2. **Task 2: Extract server/client changelogs, API/protocol command registries, and redacted live runtime probe evidence in tools/bundle_extract.mjs and verify with kb.py check** - `3af3219` (feat)

## Files Created/Modified

- `package.json` & `package-lock.json` - Node.js workspace configuration with audited AST, formatting, schema, and TypeScript tooling
- `tools/bundle_extract.mjs` - Deterministic Vite bundle formatter, Acorn AST slicer, changelog/API/protocol extractor, and `--verify` checker
- `mechanics/_raw/bundle/classes-config.js` - Class IDs (`101..116` including `ninja:112`, `samurai:114`), starter classes, and base stats (`Wj` → `Dc`)
- `mechanics/_raw/bundle/skills-and-progression.js` - 58 UO skill names (`jc`, `52='bushido'`, `53='ninjitsu'`) and L1–L60 class progression tables (`gE`)
- `mechanics/_raw/bundle/abilities-loader-and-hotbar.js` - Ability catalog loader (`Fc`), consumable item tables, and default class hotbar presets (`gh`)
- `mechanics/_raw/bundle/character-bonus-and-status.js` - `[personagembonus` / `PERSONAGEMBONUS` payload parser and status sheet logic (`wo` → `nI`)
- `mechanics/_raw/bundle/progression-tree-ui.js` - Subclass paths (`Rs`), signature abilities (`FI`), and `[Arvore` parser (`Rm`, `zI`)
- `mechanics/_raw/bundle/bestiary-and-wiki.js` - Bestiary protocol handlers (`TO`, `BESTAINFO`) and monster taxonomy (`cq` → `mq`)
- `mechanics/_raw/bundle/hunt-and-bot-config.js` - Hunt telemetry (`NIVEL`, `MONSTRO`, `PLACAR`) and `[IdleBot` configuration (`qm` → `gR`)
- `mechanics/_raw/bundle/combat-estimators-and-hotbar.js` - `[habinfo` receiver (`pq`) and all client-side damage/heal scaling formulas (`jq`, `wq`, `Nq`, `Sq`, `kq`, `Cq`, `Mq`, `Aq`, `Eq`)
- `mechanics/_raw/bundle/i18n-en-abilities.js` & `mechanics/_raw/bundle/i18n-pt-abilities.js` - English (`HB`) and Portuguese (`XB`) ability names, descriptions, and UI strings
- `mechanics/_raw/bundle/paperdoll-and-items.js` - Paperdoll renderer and item rarity hue table (`$A`)
- `mechanics/_raw/bundle/abilities-catalog.json`, `ability-icons-atlas.json`, `game-theme.css` - Formatted 134-ability catalog, icon atlas, and beta CSS stylesheet
- `mechanics/_raw/wiki/changelog-{server,client}-{dev,en}.md` - 4 official developer and English patch note changelogs
- `mechanics/_raw/api/closed-beta-status.json` & `protocol-commands-index.json` - Redacted beta status and WebSocket protocol command line index
- `mechanics/_evidence/live-bundle-probe.txt` - Redacted live surface & runtime probe evidence
- `mechanics/_raw/manifest.json` - Updated provenance manifest tracking all 20 extracted `_raw/` files

## Decisions Made

- Used `singleQuote: true` and `printWidth: 100` in `prettier` so extracted JavaScript slices use single quotes (`'warrior_whirlwind'`) and never conflict with `kb.py`'s double-quoted claim syntax.
- Supported both top-level statement slicing (`FunctionDeclaration`/`VariableDeclaration`) and nested `VariableDeclarator` slicing in `tools/bundle_extract.mjs` so `index-CCYN0Dy6.js`'s bundled locale declarators (`ph` → `HB` and `V1` → `XB`) extract cleanly alongside `Jogo-D5xEfvfV.js`'s top-level functions.
- Preserved existing `manifest.entries` keys in `tools/bundle_extract.mjs` so subsequent `tools/fetch_modernuo.py` runs in Plan `01-03` merge into `mechanics/_raw/manifest.json` without overwriting bundle/wiki/api entries.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- `mechanics/_raw/{bundle,wiki,api}/`, `mechanics/_evidence/live-bundle-probe.txt`, and `mechanics/_raw/manifest.json` are verified and ready for Plan `01-03-PLAN.md` (`tools/fetch_modernuo.py` canonical ModernUO C# archival).

## Self-Check: PASSED

- Verified all 25 created/modified files exist on disk.
- Verified task commits `e706869` and `3af3219` in `git log`.
- Verified `node tools/bundle_extract.mjs --verify` (`{"ok":true,"verified":20}`) and `python3 mechanics/tools/kb.py check --root mechanics` (`{"ok": true, "pages": 0, "errors": []}`).

---
*Phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline*
*Completed: 2026-11-06*
