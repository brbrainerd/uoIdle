---
phase: 06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging
plan: 02
subsystem: ui
tags: [mockups, html, css, chrome-headless, screenshots, readme, uo-idle, samurai, ninja]

requires:
  - phase: 06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging
    provides: "Custom dark-fantasy UO Samurai & Ninja class portraits and 135 multi-resolution skill/milestone icons (mockups/assets/icons/)"
provides:
  - "Data-driven TypeScript/Zod HTML/CSS mockup compiler, headless Google Chrome screenshot runner, and --verify integrity gate (tools/build_mockups.ts)"
  - "Three self-contained, zero-CORS uoidle.com/beta HTML/CSS mockups (mockups/{samurai-skill-tree,ninja-skill-tree,class-comparison}.html)"
  - "High-resolution 3200x2800 Retina verification screenshots (mockups/screenshots/{samurai-skill-tree,ninja-skill-tree,class-comparison}.png)"
  - "Root README.md executive handoff index and package.json 6-command Milestone v1.0 verification suite"
affects: []

actuals:
  tokens: 28000
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Zero-CORS standalone HTML compilation with ClassSchema.parse() validation, HTML entity escaping, and inline <script id='mockup-data' type='application/json'> payload embedding"
    - "Headless Google Chrome (--headless=new --window-size=1600,1400 --device-scale-factor=2) automated Retina PNG screenshot capture and PNG IHDR dimension verification"

key-files:
  created:
    - tools/build_mockups.ts
    - mockups/samurai-skill-tree.html
    - mockups/ninja-skill-tree.html
    - mockups/class-comparison.html
    - mockups/screenshots/samurai-skill-tree.png
    - mockups/screenshots/ninja-skill-tree.png
    - mockups/screenshots/class-comparison.png
    - README.md
  modified:
    - package.json

key-decisions:
  - "Embedded validated JSON payloads directly inside <script id='mockup-data' type='application/json'> and used relative icon paths (assets/icons/...) so all three HTML mockups open cleanly over file:// with zero CORS errors."
  - "Verified all 114 icon references across the three compiled HTML files, deterministic HTML output parity, and PNG IHDR dimensions (>=1600x1400) inside npx tsx tools/build_mockups.ts --verify."

patterns-established:
  - "End-to-end 6-command verification suite (npm run verify:all) validating kb.py self-tests, 31 KB pages + secret scan, 5-class Zod/JSON schema parity, 5-class Mode A/Mode B simulation parity, 140 icon SHA-256/stdDev checks, and 3 HTML mockup + 3 Retina screenshot gates."

requirements-completed:
  - VISUAL-02

coverage:
  - id: D1
    description: "Data-driven uoidle.com/beta HTML/CSS mockups (mockups/{samurai-skill-tree,ninja-skill-tree,class-comparison}.html) compiled by tools/build_mockups.ts"
    requirement: VISUAL-02
    verification:
      - kind: integration
        ref: "npx tsx tools/build_mockups.ts --verify"
        status: pass
    human_judgment: false
  - id: D2
    description: "High-resolution verification screenshots (mockups/screenshots/*.png), root README.md executive handoff index, and 6-command Milestone v1.0 verification gate"
    requirement: VISUAL-02
    verification:
      - kind: integration
        ref: "npm run verify:all"
        status: pass
    human_judgment: false

duration: 10min
completed: 2026-11-07
status: complete
---

# Phase 6 Plan 02: Beta UI Mockups, Verification Screenshots & Executive Handoff Summary

**Data-driven `uoidle.com/beta` standalone HTML/CSS mockups (`samurai-skill-tree.html`, `ninja-skill-tree.html`, `class-comparison.html`), $3200\times 2800$ Retina Chrome verification screenshots, root `README.md` executive handoff index, and a 6-command Milestone v1.0 verification gate (`exit 0`)**

## Performance

- **Duration:** 10 min
- **Started:** 2026-11-07T08:01:40Z
- **Completed:** 2026-11-07T08:11:00Z
- **Tasks:** 2
- **Files modified:** 9

## Accomplishments

- Authored `tools/build_mockups.ts` to validate all 5 class definitions (`warrior`, `mage`, `ranger`, `samurai`, `ninja`) via `ClassSchema.parse()` and compile three self-contained, zero-CORS `uoidle.com/beta`-styled HTML/CSS workbenches (`mockups/samurai-skill-tree.html`, `mockups/ninja-skill-tree.html`, `mockups/class-comparison.html`) embedding the live `.personagem-arvore` / `.arvore-*` theme tokens (`#0b0d0a`, `#121510`, `#181c16`, `#c9a227`, `Cinzel` + `IBM Plex Sans` + `IBM Plex Mono`).
- Rendered the complete Samurai (`SM`, ID `114`, `robeHue: 1884`) and Ninja (`NJ`, ID `115`, `robeHue: 1175`) progression workbenches featuring $256\times 256$ class portraits, `STR/DEX/INT` base stats (`Sum = 90`), 8 starter skills, Tokuno starter equipment paperdoll, 5-slot seeded hotbar with `2,000ms` Custom CD floor badges, winding `.arvore-cobra` node ribbon, 12 `L1–L60` milestone cards (including Ninja's dual `L35` `Smoke Bomb` + `Shuriken & Fukiya Volley` unlock), pinned `.arvore-dica` tooltip inspector, all `12` Samurai / `13` Ninja catalog ability cards, and interactive `EN`/`PT-BR` and `Mode A`/`Mode B` toggles.
- Compiled `mockups/class-comparison.html` with the 5-class `L1–L60` structural parity matrix, interactive `Mode A` / `Mode B` × `L10/L25/L45/L60` × 4-archetype combat simulation telemetry bar charts and tables, Tokuno armament/consumable/affix showcase (`design/drop-in/items-bushido-ninjitsu.json`), and side-by-side `<20 LOC` C# server hooks (`17 LOC` Samurai, `16 LOC` Ninja).
- Captured $3200\times 2800$ (`1600x1400 @ 2x`) headless Google Chrome verification screenshots (`mockups/screenshots/{samurai-skill-tree,ninja-skill-tree,class-comparison}.png`), authored the root `README.md` executive handoff index covering all 17 v1 requirements, added `verify:icons`, `verify:mockups`, and `verify:all` scripts to `package.json`, and verified all 6 Milestone v1.0 verification gates pass with exit code `0`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Author tools/build_mockups.ts and compile mockups/samurai-skill-tree.html, mockups/ninja-skill-tree.html, and mockups/class-comparison.html** - `2179394` (feat)
2. **Task 2: Capture high-resolution verification screenshots, author root README.md executive handoff index, add package.json verification scripts, and run the 6-command Milestone v1.0 verification gate** - `697a969` (feat)

## Files Created/Modified

- `tools/build_mockups.ts` - Data-driven TypeScript/Zod HTML/CSS mockup compiler, headless Chrome screenshot runner, and `--verify` integrity gate
- `mockups/samurai-skill-tree.html` - Self-contained `uoidle.com/beta` Samurai (`SM`, ID `114`, Hue `1884`) `L1–L60` `[Arvore` progression, hotbar, starter kit, and ability catalog mockup
- `mockups/ninja-skill-tree.html` - Self-contained `uoidle.com/beta` Ninja (`NJ`, ID `115`, Hue `1175`) `L1–L60` `[Arvore` progression (with dual `L35` unlock), hotbar, starter kit, and ability catalog mockup
- `mockups/class-comparison.html` - Self-contained 5-Class Structural Parity, Mode A/Mode B Simulation Telemetry, Tokuno Armaments, and `<20 LOC` C# Hook dashboard
- `mockups/screenshots/samurai-skill-tree.png` - $3200\times 2800$ Retina PNG verification screenshot of `mockups/samurai-skill-tree.html`
- `mockups/screenshots/ninja-skill-tree.png` - $3200\times 2800$ Retina PNG verification screenshot of `mockups/ninja-skill-tree.html`
- `mockups/screenshots/class-comparison.png` - $3200\times 2800$ Retina PNG verification screenshot of `mockups/class-comparison.html`
- `README.md` - Executive handoff index for the UO Idle Lead Developer linking all 17 v1 requirements and the 6-command verification suite
- `package.json` - Added `verify:icons`, `verify:mockups`, and `verify:all` scripts

## Decisions Made

- Used inline `<script id="mockup-data" type="application/json">` blocks and relative `assets/icons/...` image paths so all three HTML mockups operate 100% offline over `file://` without requiring a local HTTP server.
- Inspected the captured $3200\times 2800$ Retina screenshots and refined `.arvore-head` / `.arvore-saldos` flex wrapping so all header metrics and interactive toggle buttons render with zero overlap at `1600px` viewport width.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Direct invocation of `npx tsc --noEmit tools/build_mockups.ts` ignores `tsconfig.json` by TypeScript CLI convention and defaults to ES5/CommonJS flags; resolved by using `import * as fs` / `import * as path`, `process.cwd()`, and a standard `RegExp.exec` loop so `npx tsc --noEmit tools/build_mockups.ts` passes with zero warnings or errors.

## User Setup Required

None - all mockups, screenshots, and CLI verification commands run locally out of the box.

## Next Phase Readiness

- Milestone v1.0 (`KB-01..04`, `INDEX-01..04`, `SIM-01..03`, `CLASS-01..04`, `VISUAL-01..02`) is 100% complete and verified across all 6 automated gates.

---
*Phase: 06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging*
*Completed: 2026-11-07*
