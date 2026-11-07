# Phase 6: UI Design Contract (`06-UI-SPEC.md`)

**Phase:** `06-visual-beta-ui-mockups-custom-iconography-final-deliverable-packaging`
**Target Aesthetic:** Authentic `https://uoidle.com/beta` (`v0.99.0`) Dark-Fantasy Obsidian & Antique Gold RPG Interface

## 1. Visual Theme & Color Tokens (Extracted from `uoidle.com/beta`)

| Token | Hex / Value | Usage |
|-------|-------------|-------|
| `--bg-canvas` | `#0b0d0a` | Primary page background (deep obsidian-forest black) |
| `--bg-panel` | `#121510` | Main window/card container background |
| `--bg-card` | `#181c16` | Skill node, ability row, and equipment slot surface |
| `--bg-card-hover` | `#20261d` | Active/hovered skill node surface |
| `--border-subtle` | `#2a3026` | Hairline structural dividers and inactive slots |
| `--border-gold` | `#c9a227` | Active milestone nodes, selected class frame, primary accents |
| `--border-gold-bright` | `#e5c158` | Capstone (`L60`) node border and tooltip header rule |
| `--text-primary` | `#e8e4d9` | Primary parchment text |
| `--text-secondary` | `#a39e90` | Muted descriptions, secondary labels |
| `--text-gold` | `#d4af37` | Section headers, level badges, gold costs |
| `--samurai-accent` | `#c83e37` | Samurai Bushido crimson-lacquer accent (`robeHue: 1884`) |
| `--ninja-accent` | `#2e9e6b` | Ninja Ninjitsu shadow-emerald toxin accent (`robeHue: 1175`) |
| `--mana-blue` | `#4a90e2` | Mana cost badge & bar |
| `--stamina-amber` | `#e2a04a` | Stamina / weapon swing badge |
| `--cd-purple` | `#9b6be2` | Cooldown & `2.0s` Custom CD floor badge |

## 2. Typography

- **Display / Headings:** `'Cinzel', Georgia, serif` (`font-weight: 600..700`, `letter-spacing: 0.05em`, uppercase for panel titles and class headers).
- **Body / Tooltips:** `'IBM Plex Sans', -apple-system, BlinkMacSystemFont, sans-serif` (`14px` base, `1.45` line-height).
- **Telemetry / Numbers / Cooldowns:** `'IBM Plex Mono', monospace` (`font-variant-numeric: tabular-nums` for all DPS, TTK, EHP/s, cooldowns, mana costs, and scaling formulas).

## 3. Iconography Contract (`mockups/assets/icons/`)

- **Class Portraits:**
  - `mockups/assets/icons/samurai/portrait-samurai.png` ($256\times 256$ PNG) & `portrait-samurai-64.png` ($64\times 64$ PNG)
  - `mockups/assets/icons/ninja/portrait-ninja.png` ($256\times 256$ PNG) & `portrait-ninja-64.png` ($64\times 64$ PNG)
- **Skill & Milestone Icons:**
  - Every Samurai (`12` abilities + `4` passive milestone icons) and Ninja (`13` abilities + `4` passive milestone icons) icon must be generated at both `$64\times 64$` (`<id>.png` and `<id>@64.png`) and `$48\times 48$` (`<id>@48.png`) with an authentic dark-fantasy beveled metallic border, clear focal glyph, and zero transparency artifacts.

## 4. Layout & Interactive States (`mockups/*.html`)

1. **`mockups/samurai-skill-tree.html` & `mockups/ninja-skill-tree.html`:**
   - **Top Header Bar:** UO Idle `v0.99.0` header with Class Badge (`SM` / `NJ`), Class Numeric ID (`114` / `115`), Robe Hue swatch (`1884` / `1175`), `EN` / `PT-BR` language switcher, and `Mode A (100% Existing Engine)` vs `Mode B (<20 LOC C# Hook)` toggle.
   - **Left Column (Character & Kit Panel):** Class Portrait ($256\times 256$), Base Stats (`STR/DEX/INT`), 8 Starter Skills (`50`x7 + `Magic Resist 30`), 9-layer Tokuno Starter Equipment paperdoll grid (`mx`), and 5-slot Seeded Hotbar (`ro(e)` priority queue with `2000ms` Custom CD floor).
   - **Center Column (L1–60 `[Arvore` Progression Timeline):** All 12 progression milestones (`L1, L5, L10, L15, L20, L25, L30, L35, L40, L45, L50, L60`) rendered as interactive dark-fantasy cards with $64\times 64$ icons, type tags (`spell`, `skill`, `passive`, `feature`), unlock level badges, and click-to-inspect state.
   - **Right Column (Complete Ability Catalog & Live Tooltip Inspector):** All class abilities (`12` for Samurai, `13` for Ninja) with $48\times 48$ icons, exact `cooldownMs`, `customCooldownMs`, `manaCost`, `effectType`, `weaponAbilityRef`/`spellId`, `scalingFormula`, and Mode A / Mode B execution breakdown.
2. **`mockups/class-comparison.html`:**
   - 5-Class Structural Parity table (`Warrior`, `Mage`, `Ranger`, `Samurai`, `Ninja` across L1–60).
   - Multi-bracket (`L10`, `L25`, `L45`, `L60`) × 4-Archetype (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`) interactive telemetry bars and parity delta badges ($\pm 5\text{–}8\%$ envelope verification).
   - Tokuno Armaments & Affix showcase (`items-bushido-ninjitsu.json`).
