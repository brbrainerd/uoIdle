---
phase: "16"
slug: "ui-deduplication-progressive-disclosure-cv-flywheel"
status: approved
shadcn_initialized: false
preset: none
created: "2026-11-07"
---

# Phase 16 — UI Design Contract (`UI-SPEC.md`)

> Visual, information-architecture, progressive-disclosure, control-clustering, and micro-animation contract for Phase 16.
> Grounded in live `UO Idle v0.99.0` dark-fantasy tokens (`#0b0d0a`, `Cinzel`, `IBM Plex Sans`, `JetBrains Mono`) and validated against target Concept Art via the Playwright + Computer Vision (CV) Flywheel.

---

## 1. De-Duplication & Information Hierarchy Audit (Before → After)

Across the current 4 surfaces (`index.html`, `samurai-skill-tree.html`, `ninja-skill-tree.html`, `class-comparison.html`), identical facts are repeated up to 4 times on the same screen. Phase 16 enforces the **Single Source of Visual Truth (SSVT)** rule: every data point has **one primary home** at the appropriate disclosure tier.

| Surface | Redundancy Eliminated (Before) | Progressive Disclosure & Organization (After) |
|---------|--------------------------------|-----------------------------------------------|
| **Global Headers & Toolbars** (All 4 pages) | 3–4 stacked bars at the top of every page: `.quick-dock` + `.topbar` (with 4 summary stat boxes & `.nav-row`) + `.comp-tab-bar` + `.sim-filter-row` + `.sim-mode-banner`. Mode A/B and Locale buttons appear twice; class links appear 3 times. | **Single Unified Command Deck (`.command-deck`)** with 3 labeled, categorized control clusters: **1. Surface Switcher** (`Portal · Samurai · Ninja · Simulator`), **2. Engine & Context Cluster** (`Mode A / Mode B`, `EN / PT-BR`, `Bracket L10–L60`, `Archetype`), and **3. Section Jump & Filter Cluster** (smooth-scroll section pills or ability-kind spotlight pills). |
| **Skill Tree Center Grid vs. Right Inspector** (`samurai-skill-tree.html`, `ninja-skill-tree.html`) | Each of the 12 center `.ability-card` items renders the full 4-line lore blurb, 4 resource chips, 2 telemetry boxes, a yellow `MODE A · 100% ENGINE` paragraph box, AND an expandable `<details>` schema drawer — while the sticky `#live-inspector` on the right repeats the exact same card header, lore blurb, resource chips, and Mode A/B text a second time. | **2-Tier Progressive Disclosure**: <br>• **Tier 1 (Center Milestone Cards — Scannable Overview)**: Compact card showing 52×52 oil-painted icon, Level + Kind badge, Ability Title, **1-line tactical hook** (max 95 chars), and **3 primary stat chips** (`CD`, `Cost`, `Headline Multiplier/Effect`). Zero yellow Mode paragraphs or raw JSON drawers inside the grid cards.<br>• **Tier 2 (Right Deep-Dive Inspector — Tabbed Progressive Disclosure)**: Clicking any Cobra node, Milestone card, Hotbar slot, or Mastery Seal smoothly populates the sticky right inspector, organized into 4 clean interactive tabs: **`[Overview & Lore]`**, **`[Mode A vs B C# Diff]`**, **`[Live 100ms Combat Ticker]`**, and **`[Raw JSON Schema]`**. |
| **Skill Tree Left Column** (`samurai-skill-tree.html`, `ninja-skill-tree.html`) | Character Profile repeats `classId: "samurai" · numericId: 114 · badge: "SM"` (already in header), repeats `Reagents: false | Ammo: false` twice, and Paperdoll repeats weapon stats in two stacked boxes (`Power (1.85x) | Speed 40 | Bushido +15` AND `Damage +40% | Swing Speed +20% | Bushido +15`) plus a raw JSON array string. | **Clean Character & Armory Column**: Compact stat bar strip (`STR 50 · DEX 30 · INT 10` + `Mana 25 · 2.0s Floor`), 2×4 Grandmaster template pills, and the interactive Layered Paperdoll with a **single unified Active Armament Card** that updates live on gear slot click or 9-tier material pill click. Raw bundle layer tokens moved to a collapsed progressive-disclosure footer toggle. |
| **Simulator Executive KPIs vs. Table & Logs** (`class-comparison.html`) | 5 Executive Class KPI Cards display `DPS`, `EHP/s`, and `OOM` directly above a 5-row table displaying the exact same numbers; below the charts, two tall static rotation log boxes (`SAMURAI L60...` and `NINJA L60...`) are stacked vertically; in Section 3, 8 weapon cards are followed by an open `<details open>` table repeating all 8 weapons. | **Unified Telemetry Hierarchy**: <br>• **Interactive 5-Class Hero Strip**: High-emphasis class cards showing headline `Sustained DPS`, `Parity Delta %`, `EHP/s`, and `Mitigation Identity`. Clicking a class card spotlights that class across all charts AND switches the active class in the **Interactive 100ms Rotation & Breakdown Inspector**.<br>• **2×2 Visual Telemetry Bento Grid**: Top-Left: Multi-Bracket DPS Curve SVG; Top-Right: 5-Channel Damage Source Breakdown; Bottom-Left: Multi-Bracket EHP/s Curve SVG; Bottom-Right: **Interactive 5-Class 100ms Rotation Timeline** (tabbed across `Samurai`, `Ninja`, `Warrior`, `Mage`, `Ranger` for the active Bracket & Mode).<br>• **Progressive-Disclosure Deep Tables**: Full 10-column numeric matrix, 9-Tier Material table, 10-Wave Endurance table, and 8-Weapon Affix Matrix are organized cleanly with summary callouts up front and tabbed/expandable full data matrices. |
| **Review Portal** (`index.html`) | Top bar, hero banner, and 3 workbench cards repeat the same DPS numbers (`363.2 / 391.9 DPS`), class IDs (`114 / 115`), and verification counts 4 times. | **Executive Launchpad Architecture**: Hero focuses on the executive value proposition and 2 interactive Samurai/Ninja portrait preview cards; the 3 Workbench Launch Cards focus on distinct capabilities of each surface; Repository Guide groups drop-in payloads and specs into clean progressive-disclosure tabs (`[Drop-In JSON/JS Payloads]`, `[Formal Specs & 56-Page KB]`, `[Authentic Gump & Sprite Contact Sheets]`). |

---

## 2. Categorization & Clustering of Buttons & Interactives

Every interactive control belongs to one of **4 semantic control clusters** with distinct visual framing:

1. **Cluster A — Surface & Section Navigation (`.cluster-nav`)**:
   - **Workbench Switcher**: Segmented pill bar switching between `Portal`, `Samurai (114)`, `Ninja (115)`, and `5-Class Sim`.
   - **Section Jump Pills**: Smooth-scroll anchor pills (`Overview`, `Telemetry Charts`, `Endurance & Tiers`, `L1–L60 Matrix`, `Tokuno Armaments`) with active scroll-spy / spotlight feedback.
2. **Cluster B — Simulation & Engine Context (`.cluster-context`)**:
   - **Implementation Mode Toggle**: Segmented pill (`Mode A: Zero-C#` vs `Mode B: <20 LOC C#`).
   - **Level Bracket Selector**: Segmented 4-pill cluster (`L10`, `L25`, `L45`, `L60`).
   - **Encounter Archetype Selector**: Segmented 4-pill cluster (`Low-Def Boss`, `High-Def Boss`, `Fast Trash`, `3-Target Pack`).
   - **Locale Switcher**: Compact 2-pill toggle (`EN` | `PT-BR`).
3. **Cluster C — Spotlight & Progressive Disclosure Controls (`.cluster-spotlight`)**:
   - **Kind Spotlight Filter**: (`All (12)`, `Passives`, `Skills`, `Spells`, `Specials`) — dims non-matching cards to `0.32` opacity and elevates matching cards with a gold border & smooth scroll.
   - **Inspector Tab Bar**: (`Overview`, `Mode A/B Diff`, `100ms Rotation`, `JSON Schema`) inside the Deep-Dive Inspector.
4. **Cluster D — Direct Canvas Manipulators (`.cluster-canvas`)**:
   - `[Arvore` Serpentine Nodes (`L1`–`L60`), Paperdoll 8 Gear Slots + 9 Material Swatches (`Iron`–`Valorite`), 5-Slot Hotbar Queue, 4 Class Mastery Seals, and 5 Executive Class KPI Cards.

---

## 3. Tasteful Animation & Micro-Interaction Contract

All animations respect `prefers-reduced-motion: reduce` and use hardware-accelerated properties (`transform`, `opacity`, `filter`, SVG `stroke-dashoffset`, and CSS transitions):

| Interaction | Animation Specification |
|-------------|-------------------------|
| **Section Smooth Scroll & Spotlight Pulse** | `window.scrollTo({ top, behavior: 'smooth' })` + `@keyframes sectionSpotlightPulse` (`0%` gold box-shadow glow `rgba(200,168,88,0.45)` fading smoothly to resting state over `900ms cubic-bezier(0.22, 1, 0.36, 1)`). |
| **Card & KPI Elevation** | `transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1), border-color 220ms ease, box-shadow 220ms ease, opacity 220ms ease;` — hover/active lifts `-2px` with burnished gold halo. |
| **5-Channel & Relative DPS Bar Morphing** | Horizontal stacked bars and relative DPS bars animate width changes via `transition: width 360ms cubic-bezier(0.22, 1, 0.36, 1)`. |
| **SVG Progression Curve & Spotlight Band** | Active bracket vertical spotlight band and data nodes transition smoothly with a subtle radial pulse on the active bracket markers (`@keyframes markerPulse 2.4s infinite ease-in-out`). |
| **Inspector Tab & Card Selection Transition** | Switching abilities or inspector tabs triggers `@keyframes inspectorFadeSlide` (`opacity: 0 -> 1`, `translateY(4px -> 0)` over `200ms cubic-bezier(0.22, 1, 0.36, 1)`). |
| **`[Arvore` Serpentine Flow Shimmer** | Subtle animated gold dash flow along the serpentine connector spine between `L1` and `L60` (`stroke-dasharray`, `@keyframes cobraFlow 18s linear infinite`). |

---

## 4. Spacing, Typography & Color Tokens

### Spacing Scale (Multiples of 4)

| Token | Value | Usage |
|-------|-------|-------|
| `xs` | `4px` | Chip internal gaps, micro badge padding |
| `sm` | `8px` | Button cluster internal gap, compact grid gap |
| `md` | `12px` | Card internal padding, Bento grid gap |
| `lg` | `16px` | Column gap, section header spacing |
| `xl` | `24px` | Major section separation |

### Typography

| Role | Font Family | Size | Weight | Usage |
|------|-------------|------|--------|-------|
| Display / Hero KPI | `Cinzel`, serif | `22px` (`1.375rem`) | `700` | Class DPS headlines, Page Titles |
| Section Heading | `Cinzel`, serif | `14px` (`0.875rem`) | `700` | Section headers, Inspector titles |
| Card Title | `Cinzel`, serif | `13px` (`0.8125rem`) | `700` | Ability & Weapon card titles |
| Body / Lore | `IBM Plex Sans`, sans-serif | `12.5px` (`0.78rem`) | `400` | Concise 1-line hooks & Inspector lore |
| Telemetry / Mono | `JetBrains Mono`, monospace | `11px` (`0.6875rem`) | `500` | Cooldowns, DPS tables, C# hooks, JSON |

### Color Hierarchy (60 / 30 / 10 Rule)

| Role | Hex | Usage |
|------|-----|-------|
| Dominant (60%) | `#0b0d0a` / `#111510` | Deep obsidian canvas & primary panel backgrounds |
| Secondary (30%) | `#171c15` / `#262118` | Elevated cards, command deck clusters, inspector surfaces |
| Accent (10%) | `#c8a858` (Gold), `#d9534f` (Samurai), `#3cc47c` (Ninja) | Reserved strictly for active cluster pills, selected card borders, primary KPI numbers, and SVG curves |

---

## 5. Checker Sign-Off

- [x] Dimension 1 Copywriting & De-duplication: PASS
- [x] Dimension 2 Visual Hierarchy & Progressive Disclosure: PASS
- [x] Dimension 3 Color (60/30/10 Dark-Fantasy Discipline): PASS
- [x] Dimension 4 Typography (`Cinzel` + `IBM Plex Sans` + `JetBrains Mono`): PASS
- [x] Dimension 5 Spacing & Button Clustering: PASS
- [x] Dimension 6 Micro-Animation & Reduced-Motion Safety: PASS
- [x] Dimension 7 Playwright + CV Flywheel Verification Contract: PASS

**Approval:** Approved for Concept Art Review & CV Flywheel Execution (2026-11-07)
