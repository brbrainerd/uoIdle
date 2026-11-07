---
phase: 08-authentic-uo-gump-item-art-and-ai-icons
plan: 01
subsystem: iconography-and-sprites
tags: [uo-gumps, item-sprites, paperdoll, ai-raster-art, cv-audit]
provides:
  - 140 zero-polygon Samurai & Ninja ability/milestone icon & portrait PNGs (`mockups/assets/icons/`)
  - 37 authentic UO item sprites & composited paperdoll character renders (`mockups/assets/items/`)
  - Contact sheets (`mockups/assets/icons/contact-sheet.png` & `mockups/assets/items/items-contact-sheet.png`)
affects: [mockups, paperdoll, github-pages]
tech-stack:
  added: []
  patterns: [authentic-uo-gump-slicing, layered-paperdoll-compositing, cv-visual-audit]
key-files:
  created:
    - mockups/assets/icons/sources/bushido-sheet.jpg
    - mockups/assets/icons/sources/ninjitsu-sheet.jpg
    - mockups/assets/items/manifest.json
    - mockups/assets/items/items-contact-sheet.png
    - mockups/assets/items/paperdoll-samurai.png
    - mockups/assets/items/paperdoll-ninja.png
  modified:
    - tools/generate_icons.py
    - mockups/assets/icons/manifest.json
    - mockups/assets/icons/contact-sheet.png
key-decisions:
  - "Removed 100% of procedural ImageDraw.polygon calls from tools/generate_icons.py and added a self-verification check enforcing zero polygon calls."
  - "Centered composited UO paperdoll characters (+36px horizontal shift) and trimmed item sprite bounding boxes before scaling to 48x48 after CV visual inspection."
requirements-completed: [ART-01, ART-02, ART-03]
duration: 12min
completed: 2026-11-07
---

# Phase 8 Plan 01 Summary

## Accomplishments
- **Zero Polygonal Icons (`ART-02`)**: Replaced all procedural polygon drawings in [`tools/generate_icons.py`](file:///Users/brbrainerd/dev/uoIdle/tools/generate_icons.py) with authentic in-game UO ability gumps (`ability-icons.png`) and oil-painted dark-fantasy Tokuno sprite sheets (`bushido-sheet.jpg` and `ninjitsu-sheet.jpg`).
- **Authentic UO Item Sprites & Layered Paperdolls (`ART-01`, `ART-03`)**: Extracted 34 item sprites (`mockups/assets/items/<id>.png`) from `art.png` (`art.json`) and composited authentic layered UO paperdoll renders (`paperdoll-samurai.png` and `paperdoll-ninja.png`) from `paperdoll.json` gump layers (`12.png` + Tokuno armor/weapons).
- **CV Visual Audit & Refinements**: Inspected both contact sheets via `read_file`, fixing `gump_20997` bounding-box trimming, centering paperdoll characters (`+36px`), and replacing flat slot circles with soft Gaussian radial glows.
