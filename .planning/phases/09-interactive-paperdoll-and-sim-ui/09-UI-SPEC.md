---
phase: 09-interactive-paperdoll-and-sim-ui
version: "2.0"
status: approved
verified: 2026-11-07
dimensions_passed: "7/7"
---

# Phase 9 UI Design Contract (`09-UI-SPEC.md` v2.0 — Consolidated, De-Duplicated & Color-Themed)

## 1. Executive Summary & CV Pre-Audit Findings ("Before" State)

Visual CV inspection (`read_file`) of the v1.1 `samurai-skill-tree.png`, `ninja-skill-tree.png`, `class-comparison.png`, and `portal-index.png` surfaced four structural UX/visual density issues that v2.0 resolves:

1. **Redundant Ability Presentation (`samurai-skill-tree.html` & `ninja-skill-tree.html`):**
   - **Before:** Every ability was rendered **three times** on the same screen: (1) the 12-node horizontal `[Arvore` timeline bar, (2) a 12-card `L1–L60` progression grid in the center column, and (3) a 12/13-card "Complete Ability Catalog" stacked in the right column. This forced `2800px+` vertical scrolling and split lore from technical schema fields.
   - **After (v2.0 Single Unified View):** Eliminate the right-column "Complete Ability Catalog" entirely. Present a single **Unified `L1–L60` `[Arvore` Ability Progression & Schema Grid** in the center column where each card displays the ability's semantic color badge, lore blurb, cooldown/resource pills, and a progressive-disclosure `<details class="schema-drawer">` for raw `gE`/`b` schema fields (`spellId`, `gumpId`, `tab`, `scope`, `effectType`). Clicking or hovering any card updates the sticky right-column **Active Ability Deep-Dive & Engine Inspector** (`Mode A` vs `Mode B`, `qC` estimator, and live JSON payload).
2. **Cramped Left Column & Paperdoll Overflow:**
   - **Before:** The left column (`345px`) stacked 4 heavy panels (Character Profile, 8 Starter Skills, Interactive Paperdoll + Armory, and 5-Slot Hotbar), pushing the 5-Slot Hotbar below the `1400px` viewport fold.
   - **After (v2.0 Balanced 3-Column Single-Screen Workbench):** Move the **5-Slot Seeded Hotbar Queue (`ro(e)` Priority)** and **Class Combat Niche & Resource Loop Summary** into the right column directly beneath the Sticky Inspector, and fold the `FE` Legacy Template Weights into a progressive-disclosure `<details>` drawer inside the Starter Skills panel. Every panel in the left, center, and right columns fits cleanly within a single `1600x1260` (`3200x2520` Retina) viewport with zero cutoffs.
3. **Scroll-Heavy 4,000px `class-comparison.html`:**
   - **Before:** Stacked 5 giant full-width sections vertically (`L1–L60` Matrix, Telemetry Table + SVG Charts, Tokuno Armaments + Weapons Table + Affixes, and C# Hooks), clipping the bottom half in screenshots.
   - **After (v2.0 Interactive Tabbed Workbench + Full-Page CV Captures):** Introduce a 3-Tab Sub-Navigation Bar (**Tab 1: `Combat Simulator & Visual Telemetry`**, **Tab 2: `5-Class L1–L60 Progression Matrix`**, **Tab 3: `Tokuno Armaments, Consumables & C# Hooks`**) with an **"All Sections (Print / Full View)"** toggle, and capture dedicated full-height Retina screenshots for verification.
4. **Monochromatic Gold Styling:**
   - **Before:** Nearly all pills, borders, and cards shared the same muted gold/brown border (`#3c3425`), making `Passive`, `SpecialMove`, `Spell`, `Custom Mechanic`, and `L60 Capstone` cards look visually indistinct.
   - **After (v2.0 Semantic Ability-Kind & Class-Theme Colorization):** Apply distinct semantic border/glow/badge tokens per ability category and class theme (`Crimson Lacquer #e05246` for Samurai, `Jade Nightshade #38b27c` for Ninja).

---

## 2. Design System & Semantic Color Tokens

| Token | Value | Usage |
|---|---|---|
| `--bg-primary` | `#0b0d0a` | Root canvas background |
| `--bg-panel` | `linear-gradient(180deg, #171b15 0%, #10130f 100%)` | Primary workbench panel background |
| `--bg-card` | `linear-gradient(180deg, #1c2019 0%, #131611 100%)` | Unified ability card & equipment slot background |
| `--samurai-theme` | `#d9483b` (Border) / `rgba(217, 72, 59, 0.16)` (Glow) | Samurai (`SM`, ID `114`, `robeHue: 1884`) crimson lacquer theme |
| `--ninja-theme` | `#34b37a` (Border) / `rgba(52, 179, 122, 0.16)` (Glow) | Ninja (`NJ`, ID `115`, `robeHue: 1175`) jade nightshade theme |
| `--kind-passive` | `#63b3ed` (Azure Steel) | Innate `passive` milestones (`samurai_way`, `ninja_shadowjump`) |
| `--kind-skill` | `#f6ad55` (Amber Blade) | Weapon/Tactical `skill` (`SpecialMove`) milestones |
| `--kind-spell` | `#b794f4` (Arcane Amethyst) | Bushido/Ninjitsu `spell` postures & invocations |
| `--kind-mechanic` | `#4fd1c5` (Teal Spirit) | Custom class `mechanic` (`samurai_perfection`, `ninja_smoke_bomb`) |
| `--kind-capstone` | `#f6e05e` (Radiant Grandmaster Gold) | `L60` `feature` Capstones (`Kensei`, `Kage Bunshin`) |

---

## 3. Component & Layout Contracts

### 3.1 Class Skill Tree Workbenches (`samurai-skill-tree.html` & `ninja-skill-tree.html`)
- **Viewport Grid (`1560px` max-width):** `grid-template-columns: 360px minmax(0, 1fr) 390px; gap: 14px;`
- **Left Column (`360px` — Character & Interactive Paperdoll Armory):**
  1. **Compact Character & Starter Skills Card:** `92x92` portrait, `STR/DEX/INT` pills, 8 starter skills (`2x4` compact grid), and a progressive-disclosure `<details>` drawer for `FE` legacy template weights.
  2. **Interactive Tokuno Paperdoll & Armory:** `240x218` layered UO paperdoll flanked by 6 armor slots (`Helm`, `Chest`, `Arms/Gloves`, `Legs`, `Boots`, `Neck/Waist`), 4 switchable signature Tokuno weapons, 9-tier `Iron..Valorite` scaling selector, and the live `#paperdoll-gear-tooltip` inspection card.
- **Center Column (`1fr` — Unified `[Arvore` Progression Timeline & Ability Cards):**
  1. **Interactive 12-Node `[Arvore` Milestone Ribbon (`L1 -> L60`):** Clicking any node highlights and filters/focuses that milestone, plus a Category Filter Bar (`All (12)`, `Passive`, `Skills`, `Spells`, `Mechanics & Capstone`).
  2. **Unified 2-Column Ability Cards (Zero Duplication):** Each card renders its `48x48` authentic UO gump / oil-painted icon, level badge (`L1..L60`), semantic kind badge (`PASSIVE`, `SKILL`, `SPELL`, `MECHANIC`, `CAPSTONE`), bilingual title, atmospheric lore blurb, `CD / Mana / Stam` pills, Dual-Unlock badge (for `L35 Smoke Bomb + Poisoned Shuriken`), and an expandable `<details>` drawer showing raw `b` catalog metadata (`spellId`, `gump`, `effectType`, `customCooldownMs`).
- **Right Column (`390px` — Sticky Inspector, 5-Slot Hotbar & Combat Loop Summary):**
  1. **Pinned `.arvore-dica` Deep-Dive Inspector:** Shows the selected ability's `64x64` icon, `qC` client estimator formula, status effect duration/scaling, side-by-side `Mode A (Drop-In JSON)` vs `Mode B (<20 LOC C#)` comparison, and a collapsible `<details>` drawer with the verbatim JSON definition.
  2. **5-Slot Seeded Hotbar Queue (`mE` / `gh` / `ro(e)` Priority):** Shows all 5 auto-cast slots with `>= 2,000ms` custom cooldown floor badges and interactive click-to-inspect wiring.
  3. **Class Combat Niche & Idle Resource Economy Summary:** Highlights the class's protected niche, parry/clone math, and `0 OOM` sustain loop.

### 3.2 5-Class Parity & Simulator Telemetry Workbench (`class-comparison.html`)
- **Interactive View Switcher Bar:**
  - `All Views (Complete Executive Sheet)` (default for full-page inspection)
  - `Tab 1: Simulator Telemetry & Visual Charts` (Interactive 80-scenario table, SVG `L10->L60` DPS & EHP/s curves, 5-Channel Damage Breakdown stacked bars, `100ms` Tick Rotation Strips, and `<details>` drawers for 9-Tier Material Scaling & 10-Wave Dungeon Endurance)
  - `Tab 2: 5-Class L1–L60 Progression Matrix` (Side-by-side `WR / MG / RG / SM / NJ` structural parity table with semantic ability-kind badges)
  - `Tab 3: Tokuno Armaments, Consumables & C# Hooks` (8 Iconic Tokuno weapons, 4 cooldown-gated Ninjitsu tools, progressive-disclosure `<details>` drawer for full 8-weapon table & 10 affix pools, and syntax-highlighted Mode B C# hooks)

---

## 4. UI Considerations (State & Progressive Disclosure Coverage)

- **Selection State (`is-selected`):** Clicking any node in the `L1–L60` ribbon, any unified ability card, or any 5-slot hotbar item highlights the node/card with the class theme glow and updates the Sticky Inspector.
- **Category Filter State (`data-kind-filter`):** Filtering by `All`, `Passive`, `Skill`, `Spell`, or `Capstone/Mechanic` smoothly toggles visibility across the unified grid without losing selection state.
- **Progressive Disclosure (`<details>` Drawers):** Raw schema fields, JSON payloads, legacy `FE` weights, and secondary weapon/affix tables are tucked inside clean `<details>` accordions so the primary view remains uncluttered while keeping 100% of engineering data one click away.
