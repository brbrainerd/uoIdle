---
phase: 09-interactive-paperdoll-and-sim-ui
type: ui-spec
status: approved
created: 2026-11-07
requirements: [PAPERDOLL-01, SIM-UI-01, SIM-UI-02]
---

# Phase 9 UI Design Contract (`09-UI-SPEC.md`)

## 1. Visual Identity & Design System
- **Theme**: UO Idle `v0.99.0` Dark-Fantasy Gold-on-Obsidian (`--bg-canvas: #0b0d0a`, `--bg-panel: #121510`, `--bg-card: #181c16`, `--border-gold: #c9a227`, `--border-gold-bright: #e5c158`, `--text-primary: #e8e4d9`, `--text-gold: #d4af37`).
- **Class Accents**:
  - **Warrior (`WR`, 101)**: `#d97706` (Amber Bronze)
  - **Mage (`MG`, 103)**: `#3b82f6` (Arcane Sapphire)
  - **Ranger (`RG`, 102)**: `#84cc16` (Forest Emerald)
  - **Samurai (`SM`, 114)**: `#c83e37` (Crimson Lacquer, `robeHue: 1884`)
  - **Ninja (`NJ`, 115)**: `#2e9e6b` (Shadow Jade, `robeHue: 1175`)
- **Typography**: `Cinzel` (serif section headers & titles), `IBM Plex Sans` (UI copy & lore blurbs), `IBM Plex Mono` (`tabular-nums` telemetry metrics, item hex IDs, cooldowns, and formulas).

## 2. Interactive Visual Paperdoll & Equipment Rack (`PAPERDOLL-01`)
Embedded in `mockups/samurai-skill-tree.html` and `mockups/ninja-skill-tree.html`:
- **Center Stage**: Authentic `260×237` layered UO paperdoll character render (`assets/items/paperdoll-samurai.png` / `assets/items/paperdoll-ninja.png`) composited from `paperdoll.json` male gump layers (`12.png` + Tokuno armor/cloak/weapon layers).
- **Flanking 6-Slot Equipped Armor Rack + Tokuno Armory Strip**:
  - Displays real `64×64` UO item sprites (`assets/items/<id>.png`) extracted from `art.png`.
  - **Material Tier Selector (`Iron` → `Valorite`)**: 9-tier interactive selector updating item damage/defense multipliers (`1.00x` → `1.85x`) and resistance bonuses (`+0%` → `+96%`) in real time.
  - **Interactive Mouseover / Click Gear Inspector Card (`#paperdoll-gear-tooltip`)**:
    - Displays Item Name (`EN / PT-BR`), UO Graphic ID (`decimal` + `0xHEX`), Paperdoll Layer & Male Gump ID, Material Tier scaled damage/defense, Primary & Secondary `WeaponAbility` badges, and Tokuno affix rolls (`Bushido`, `Ninjitsu`, `Parrying`, `Stealth`, `Poisoning`, `Swing Speed`, `Damage`).

## 3. Visual Simulator Telemetry Charts (`SIM-UI-01`, `SIM-UI-02`)
Embedded in `mockups/class-comparison.html` from `parity-5class-v0.99.0.json` and `gear-and-waves-v1.1.json`:
1. **Multi-Bracket DPS & EHP/s Progression SVG Chart (`L10 → L25 → L45 → L60`)**: Interactive polyline chart comparing all 5 classes with shaded `±5–8%` parity envelope.
2. **5-Channel Damage Breakdown Stacked Bars**: Per-class horizontal stacked bars (`Auto-Attack`, `SpecialMove/Spell`, `Execute/Detonation`, `DoT/Venom`, `Parry/Spirit Procs`) with exact DPS and `%` share.
3. **Material Tier (`Iron` → `Valorite`) Scaling Explorer**: Interactive 9-tier chart & table showing weapon/armor scaling and monotonic EHP/s across all 5 classes.
4. **10-Wave Dungeon Endurance & `100ms` Rotation Timeline Strip**: Visualizes 10-wave continuous dungeon survival (`0` deaths, `0` OOM ticks, potion/bandage counts) and a `0s–20s` combat timeline strip showing exact hotbar cast ticks (`ro(e)`).
