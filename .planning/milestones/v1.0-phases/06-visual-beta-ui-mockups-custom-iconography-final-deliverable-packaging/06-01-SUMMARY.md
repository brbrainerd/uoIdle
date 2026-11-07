---
phase: 06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging
plan: 01
subsystem: ui
tags: [pillow, iconography, portraits, uo-idle, samurai, ninja, sha256]

requires:
  - phase: 05-samurai-bushido-ninja-ninjitsu-skill-line-design-parity-tuning-drop-in-code
    provides: "Canonical Samurai (12 abilities) and Ninja (13 abilities) drop-in JSON definitions (design/drop-in/{samurai,ninja}.json)"
provides:
  - "Deterministic Python Pillow (13.0.0) super-sampled (256x256 -> 64x64 / 48x48 LANCZOS) dark-fantasy UO icon & portrait post-processor (tools/generate_icons.py)"
  - "Samurai (robeHue: 1884, #c83e37) and Ninja (robeHue: 1175, #2e9e6b) class portraits at 256x256 and 64x64"
  - "Complete 23-stem Samurai (69 skill PNGs) and 22-stem Ninja (66 skill PNGs) multi-resolution icon sets (<id>.png, <id>@64.png, <id>@48.png)"
  - "Labeled visual contact sheet (mockups/assets/icons/contact-sheet.png) and 140-artifact SHA-256 & pixel-variance manifest (mockups/assets/icons/manifest.json)"
affects: [06-02-PLAN]

actuals:
  tokens: 24500
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Super-sampled 256x256 4-layer dark-fantasy RPG icon composition downsampled via LANCZOS to 64x64 and 48x48"
    - "Union of canonical drop-in JSON ability IDs and 06-CONTEXT.md alias/passive milestone badge stems for zero-broken-path icon lookup"
    - "SHA-256 + RGB pixel variance (stdDev >= 12.0) + exact dimension verification gate (--verify)"

key-files:
  created:
    - tools/generate_icons.py
    - mockups/assets/icons/contact-sheet.png
    - mockups/assets/icons/manifest.json
    - mockups/assets/icons/samurai/portrait-samurai.png
    - mockups/assets/icons/samurai/portrait-samurai-64.png
    - mockups/assets/icons/ninja/portrait-ninja.png
    - mockups/assets/icons/ninja/portrait-ninja-64.png
  modified: []

key-decisions:
  - "Generated the complete union of canonical samurai.json/ninja.json ability IDs (12 + 13) and 06-CONTEXT.md alias/passive milestone badge IDs (11 + 9) = 23 Samurai stems and 22 Ninja stems so every mockup or client lookup path resolves cleanly."
  - "Rendered all skill icons on an internal 256x256 RGBA canvas with radial obsidian void backgrounds, Gaussian volumetric class-hue glow, distinct weapon/spell focal silhouettes with drop shadows, and beveled antique-gold Ultima Online gump borders before LANCZOS downsampling to 64x64 and 48x48."

patterns-established:
  - "Multi-resolution icon stem convention: <id>.png (64x64), <id>@64.png (64x64), and <id>@48.png (48x48) backed by manifest.json SHA-256 and stdDev verification."

requirements-completed:
  - VISUAL-01

coverage:
  - id: D1
    description: "Custom dark-fantasy UO Samurai (robeHue: 1884) and Ninja (robeHue: 1175) class portraits at 256x256 and 64x64 and all 23 Samurai + 22 Ninja skill/milestone icon stems at 64x64 and 48x48"
    requirement: VISUAL-01
    verification:
      - kind: integration
        ref: "python3 tools/generate_icons.py --verify"
        status: pass
    human_judgment: false
  - id: D2
    description: "Visual contact sheet (mockups/assets/icons/contact-sheet.png) and 140-artifact SHA-256 & pixel-variance manifest (mockups/assets/icons/manifest.json)"
    requirement: VISUAL-01
    verification:
      - kind: integration
        ref: "python3 tools/generate_icons.py --verify"
        status: pass
    human_judgment: false

duration: 12min
completed: 2026-11-07
status: complete
---

# Phase 6 Plan 01: Custom Dark-Fantasy UO Iconography & Class Portraits Summary

**Custom dark-fantasy Ultima Online Samurai (`robeHue: 1884`) and Ninja (`robeHue: 1175`) class portraits ($256\times 256$ and $64\times 64$) and 135 multi-resolution ($64\times 64$ and $48\times 48$) skill/milestone icons framed in beveled antique-gold gump borders, verified via `manifest.json` SHA-256 and pixel-variance checks**

## Performance

- **Duration:** 12 min
- **Started:** 2026-11-07T07:48:00Z
- **Completed:** 2026-11-07T08:00:00Z
- **Tasks:** 2
- **Files modified:** 142

## Accomplishments

- Generated high-detail dark-fantasy Ultima Online Tokuno **Samurai** (`portrait-samurai.png`, `portrait-samurai-64.png` — crimson-and-gold Do-Maru & Mempo armor with lightning-wreathed Katana) and **Ninja** (`portrait-ninja.png`, `portrait-ninja-64.png` — midnight-indigo shinobi shozoku with emerald toxin glow, Tekagi claws, and venom-dripping Kama) class portraits framed in beveled antique-gold (`#c9a227` / `#e5c158`) and class-hue (`#c83e37` / `#2e9e6b`) UO gump borders.
- Authored `tools/generate_icons.py` using Pillow `13.0.0` to synthesize all **23 Samurai icon stems** (`12` canonical `samurai.json` IDs + `11` `06-CONTEXT.md` alias/passive badge IDs = `69` skill icon PNGs) and all **22 Ninja icon stems** (`13` canonical `ninja.json` IDs + `9` `06-CONTEXT.md` alias/passive badge IDs = `66` skill icon PNGs) via 4-layer $256\times 256 \rightarrow 64\times 64 / 48\times 48$ `LANCZOS` super-sampling.
- Composited the $1440\times 1280$ labeled visual audit grid (`mockups/assets/icons/contact-sheet.png`), emitted the 140-file SHA-256 and pixel-variance registry (`mockups/assets/icons/manifest.json`), and verified `python3 tools/generate_icons.py --verify` exits `0` with `{"ok": true, "samuraiStems": 23, "ninjaStems": 22, "totalFiles": 140}` (minimum `stdDev = 41.10 >= 12.0`).

## Task Commits

Each task was committed atomically:

1. **Task 1: Generate dark-fantasy UO Samurai and Ninja class portraits and author tools/generate_icons.py to render all 23 Samurai and 22 Ninja skill/milestone icon stems at 64x64 and 48x48** - `61b2760` (feat)
2. **Task 2: Generate mockups/assets/icons/contact-sheet.png and mockups/assets/icons/manifest.json and implement python3 tools/generate_icons.py --verify** - `34c723f` (feat)

## Files Created/Modified

- `tools/generate_icons.py` - Deterministic Python Pillow (`13.0.0`) super-sampled dark-fantasy UO icon & portrait post-processor, contact sheet compositor, manifest generator, and `--verify` CLI gate
- `mockups/assets/icons/samurai/portrait-samurai.png` & `portrait-samurai-64.png` - $256\times 256$ and $64\times 64$ Tokuno Samurai class portraits
- `mockups/assets/icons/ninja/portrait-ninja.png` & `portrait-ninja-64.png` - $256\times 256$ and $64\times 64$ Tokuno Shadow Ninja class portraits
- `mockups/assets/icons/samurai/*.png` - 69 Samurai skill & milestone icon files across 23 stems (`<id>.png`, `<id>@64.png`, `<id>@48.png`)
- `mockups/assets/icons/ninja/*.png` - 66 Ninja skill & milestone icon files across 22 stems (`<id>.png`, `<id>@64.png`, `<id>@48.png`)
- `mockups/assets/icons/contact-sheet.png` - $1440\times 1280$ labeled contact sheet displaying both portraits and all 45 $64\times 64$ skill/milestone icons on `#0b0d0a`
- `mockups/assets/icons/manifest.json` - SHA-256, dimension, `meanRgba`, and `stdDev` provenance registry for all 140 PNG artifacts

## Decisions Made

- Emitted the full union of canonical `design/drop-in/{samurai,ninja}.json` ability IDs and `06-CONTEXT.md` descriptive alias/passive milestone badge IDs so that both data-driven mockup lookups and prose/context references resolve without broken paths.
- Preserved committed $256\times 256$ and $64\times 64$ AI portrait files byte-for-byte when running `tools/generate_icons.py` in environments without the temporary generation cache, while retaining a deterministic procedural Pillow portrait fallback.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

- Global macOS gitignore (`~/.config/git/ignore`) contained an `Icon?` pattern (intended for Finder `Icon\r` metadata files) which matched `icons` on case-insensitive APFS; resolved cleanly by staging `mockups/assets/icons/**` with `git add -f`.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- All 140 custom dark-fantasy UO portrait, skill icon, contact sheet, and manifest artifacts are verified on disk and ready for `tools/build_mockups.ts` in Plan `06-02`.

---
*Phase: 06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging*
*Completed: 2026-11-07*
