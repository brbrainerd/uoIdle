---
phase: 09-interactive-paperdoll-and-sim-ui
plan: 01
subsystem: ui-mockups
tags:
  - paperdoll
  - tooltips
  - svg-charts
  - telemetry
provides:
  - ".planning/phases/09-interactive-paperdoll-and-sim-ui/09-UI-SPEC.md"
  - "Interactive Tokuno Paperdoll & Armory with 9-tier Iron..Valorite selector and mouseover stat tooltips in samurai-skill-tree.html and ninja-skill-tree.html"
  - "Multi-bracket SVG progression curves, 5-channel damage source breakdown bars, 9-tier material scaling tables, 10-wave endurance tables, and 100ms tick combat rotation strips in class-comparison.html"
key-files:
  created:
    - ".planning/phases/09-interactive-paperdoll-and-sim-ui/09-UI-SPEC.md"
  modified:
    - "tools/build_mockups.ts"
    - "mockups/samurai-skill-tree.html"
    - "mockups/ninja-skill-tree.html"
    - "mockups/class-comparison.html"
    - "mockups/screenshots/samurai-skill-tree.png"
    - "mockups/screenshots/ninja-skill-tree.png"
    - "mockups/screenshots/class-comparison.png"
completed: 2026-11-07
---

# Phase 9 Plan 01: Interactive Paperdoll with Gear Mouseovers & Simulator Visual Telemetry Summary

## Accomplishments

- **UI Design Contract (`09-UI-SPEC.md`)**: Defined the visual layout, color tokens, interactive paperdoll geometry, and SVG chart specifications for UO Idle `v0.99.0` beta parity.
- **Interactive Tokuno Paperdoll & Armory (`UI-01`, `UI-02`)**:
  - Embedded authentic layered UO paperdoll composites (`paperdoll-samurai.png` and `paperdoll-ninja.png`) flanked by 6 equipped armor slots and 4 switchable Tokuno weapons.
  - Added interactive 9-tier `Iron -> Valorite` material scaling buttons and mouseover/click gear stat inspection (`#paperdoll-gear-tooltip`) displaying item sprite, UO graphic ID & hex, layer, scaled damage or armor rating, affixes, and bilingual (`EN` / `PT-BR`) lore.
- **Simulator Visual Telemetry Dashboard (`UI-03`, `UI-04`)**:
  - Added multi-bracket (`L10 -> L25 -> L45 -> L60`) SVG sustained DPS and EHP/s progression curves across all 5 classes (`Warrior`, `Mage`, `Ranger`, `Samurai`, `Ninja`).
  - Added 5-channel damage source breakdown stacked horizontal bars (`Auto-Attack`, `SpecialMove/Spell`, `Execute/Detonation`, `DoT/Venom`, `Parry/Spirit Procs`), 9-tier material scaling tables, 10-wave continuous dungeon endurance summaries, and `100ms` tick rotation log strips.
- **CV Visual Audit**: Inspected `samurai-skill-tree.png`, `ninja-skill-tree.png`, and `class-comparison.png` via `read_file` and separated the 5-channel breakdown header into two clean rows to eliminate wrapping collisions.
