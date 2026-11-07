# Requirements: UO Idle — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase (Milestone v1.1)

**Defined:** 2026-11-07
**Core Value:** Deliver mechanically authentic (grounded in ModernUO Bushido/Ninjitsu), numerically balanced (parity-tested against live Warrior, Mage, and Ranger formulae), and implementation-ready Ninja and Samurai skill lines backed by a 100% source-verified UO Idle mechanics knowledgebase.

## v1.1 Requirements

Requirements for Milestone `v1.1` (`Phases 7–10`), upgrading the `v1.0` baseline with idle-tuned ability mechanics, evocative bilingual lore blurbs, expanded gear-tier/multi-wave simulations & unit tests, authentic UO gump/item sprites + AI raster art (zero polygonal icons), interactive paperdoll gear with hover tooltips, visual simulator telemetry (`UI-SPEC.md`), and a live-hosted GitHub Pages developer portal.

### Idle-Tuned Ability Overhaul & Lore Presentation (`IDLE`)

- [x] **IDLE-01**: Refine **Samurai** and **Ninja** abilities for 24/7 automated idle combat across Mode A and Mode B:
  - *Confidence* (`samurai_confidence`, `L20`): Add **"Inner Calm"** parry synergy so parrying while Confidence is active restores bonus Stamina/Mana and grants an immediate `+10%` counter-empowerment window, preventing wasted casts at high HP.
  - *Evasion* (`samurai_evasion`, `L35`): Add **"Iaido Flash Riposte"** so intercepting an incoming attack or spell during Evasion triggers an instant counter-slash (`0.85x` weapon damage) in addition to `+16%` parry / spell interception.
  - *Animal Form* (`ninja_animal_form`, `L25`): Upgrade to **"Animal Form: Kitsune & Wolf Aspect"** granting `+10%` attack speed, `+4%` evasion instinct, and a **3rd-Swing Spirit Claw / Fox-Fire Proc** during the 8s aspect window.
  - *Smoke Bomb* (`ninja_smoke_bomb`, `L35`) + *Poisoned Shuriken* (`ninja_shuriken`, `L35`): Wire as a seamless **"Vanish & Volley"** automated combo engine where detonating Smoke Bomb refreshes stealth opener state (`+8%` damage window) and queues a high-tempo Shuriken volley.
- [x] **IDLE-02**: Overhaul all class introductions, ability blurbs, flavor lore, and combat mechanic descriptions (`en` and `pt-BR`) in `design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `design/drop-in/classes-patch.js`, `design/SAMURAI_SPEC.md`, and `design/NINJA_SPEC.md` so every ability reads like an evocative, atmospheric Ultima Online skill with crisp, separated idle-game mechanical tooltips.

### Simulation & Test Gap Closure (`SIM`)

- [x] **SIM-04**: Expand `src/sim/` and `tools/sim_balance.ts` to simulate **Material Tier Progression** (`Iron`, `DullCopper`, `ShadowIron`, `Copper`, `Bronze`, `Gold`, `Agapite`, `Verite`, `Valorite`), **Tokuno Weapon/Armor Affix Loadouts** (`swing_speed_increase`, `damage_increase`, `hit_leech_life`, `hit_harm`, `bushido_bonus`, `ninjitsu_bonus`), and **Multi-Wave Dungeon Pull Transitions** (with inter-wave spawn delay, Perfection streak decay/retention, and DoT/mark carryover), emitting a verified `data/sim-baselines/gear-and-waves-v1.1.json` artifact while maintaining $\pm 5\text{–}8\%$ 5-class parity.
- [x] **SIM-05**: Create a comprehensive deterministic unit test suite (`tools/test_sim.ts`) asserting combat engine edge cases:
  - Shieldless 1H (`48,000` divisor) vs 2H (`41,140` divisor) Bushido Weapon Parry probabilities
  - *Mirror Image* ablative clone absorption and damage mitigation decay
  - `<35%` HP execute threshold transitions (*Honorable Execution*, *Kensei: Amakura's Judgment*, *Kage Bunshin: Twin Shadow Execution*)
  - *Death Strike* 5-hit detonation vs 4.0s trauma timer and *Infectious Strike* poison tick stacking
  - *Confidence* Inner Calm & *Evasion* Iaido Flash Riposte idle triggers
  - *Animal Form* 3rd-swing spirit proc & *Smoke Bomb* Vanish & Volley combo sequencing
  - Zero (`0`) OOM ticks across 180s sustained fights under haste caps (`1,250ms` swing floor, `500ms` GCD)

### Authentic UO Gump/Item Art & AI Raster Replacement (`ART`)

- [x] **ART-01**: Eliminate 100% of procedural `PIL.ImageDraw.polygon` skill icons (`tools/generate_icons.py`). Extract authentic in-game UO ability gumps directly from `uoidle.com/packs/ability-icons/ability-icons.png` (`gump_21536..21540` Bushido, `gump_21280..21287` Ninjitsu, `gump_20992..21022` Weapon Abilities, `idle_samurai_way` custom slot) and generate rich, dark-fantasy oil-painted raster icons via `image-generator` for all custom milestones, capstones, and mastery badges. Enforce an automated check rejecting flat polygonal icon generation.
- [x] **ART-02**: Extract authentic in-game UO equipment & item graphics from `uoidle.com/packs/art/art.png` (`art.json`), `world-art.png`, and `uoidle.com/packs/paperdoll/` (`paperdoll.json`) into `mockups/assets/items/` for all Samurai & Ninja paperdoll slots (*Kabuto*, *Do*, *Hiro-Sode*, *Suneate*, *Waraji*, *Mempo*, *Katana*, *No-Dachi*, *Daisho*, *Wakizashi*, *Lajatang*, *Bokuto*, *Tetsubo*, *Leather Ninja Hood*, *Jacket*, *Mitts*, *Pants*, *Tabi*, *Kryss*, *Tekagi*, *Kama*, *Fukiya*, *Shuriken*, *Smoke Bomb*, *Egg Bomb*, *Robe*, *Cloak*).

### Interactive Paperdoll, Visual Simulator Telemetry & CV Audit (`UI`)

- [x] **UI-01**: Author a formal Phase 9 UI design contract (`UI-SPEC.md` via `/gsd-ui-phase`) and upgrade `samurai-skill-tree.html` and `ninja-skill-tree.html` with an **Interactive Visual Paperdoll**:
  - Render actual UO equipment & weapon sprites in a classic UO paperdoll layout + slot grid with a Material Tier selector (`Iron..Valorite`).
  - Provide rich **mouseover stat tooltips** for every equipped item and Tokuno armament showing exact item graphic ID, hue, armor/weapon rating across material tiers, weapon speed/damage range, linked primary/secondary `WeaponAbility` icons, and rolled Tokuno affixes.
- [x] **UI-02**: Upgrade `class-comparison.html` with a **Visual Simulator Telemetry Workbench**:
  - Interactive SVG/Canvas multi-bracket DPS & EHP progression charts (`L10 -> L25 -> L45 -> L60`)
  - Damage-source breakdown stacked bars (Auto-Attack, SpecialMove/Spell, Execute/Capstones, DoT/Venom, Parry/Riposte/Spirit Procs)
  - Material-tier (`Iron -> Valorite`) and Multi-Wave sustain telemetry explorer
  - Visual 100ms-tick combat rotation timeline strip for Samurai and Ninja
- [x] **UI-03**: Perform a complete **CV Visual Audit** across `contact-sheet.png`, `samurai-skill-tree.png`, `ninja-skill-tree.png`, `class-comparison.png`, and `index.png` using `read_file` visual inspection and headless Chrome DOM geometry assertions (`0` broken images, `0` overlapping tooltips, `0` polygonal icons, WCAG contrast compliance).

### Live GitHub Pages Developer Portal (`HOST`)

- [x] **HOST-01**: Build a polished **Lead Developer Onboarding Portal** (`index.html` at repository root and `mockups/index.html`) and deploy live to **GitHub Pages** (`https://brbrainerd.github.io/uoIdle/`):
  - Executive introduction tailored for the UO Idle Lead Developer explaining the reverse-engineered `v0.99.0` baseline, Mode A (zero-code-change JSON) vs Mode B (`<20 LOC` C# hook) integration paths, and 5-class balance methodology
  - Guided review cards with live interactive links to the **Samurai Workbench**, **Ninja Workbench**, **5-Class Simulator & Gear Telemetry Dashboard**, and **Direct Repository Deliverables** (`design/drop-in/`, `design/SAMURAI_SPEC.md`, `design/NINJA_SPEC.md`, `design/BALANCE_REPORT.md`, `mechanics/INDEX.md`)
  - Automated GitHub Actions deployment workflow (`.github/workflows/deploy-pages.yml`) verified live via `gh api` / `curl` HTTP 200 check

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| IDLE-01 | Phase 7 | Complete |
| IDLE-02 | Phase 7 | Complete |
| SIM-04 | Phase 7 | Complete |
| SIM-05 | Phase 7 | Complete |
| ART-01 | Phase 8 | Complete |
| ART-02 | Phase 8 | Complete |
| UI-01 | Phase 9 | Complete |
| UI-02 | Phase 9 | Complete |
| UI-03 | Phase 9 | Complete |
| HOST-01 | Phase 10 | Complete |

**Coverage:**
- Milestone `v1.1` requirements: 10 total
- Mapped to phases: 10 (`Phases 7–10`)
- Unmapped: 0 ✓
