# Phase 6: Visual Beta UI Mockups, Custom Iconography & Final Deliverable Packaging — Context

**Gathered:** 2026-11-07
**Status:** Ready for planning
**Mode:** Autonomous Smart Discuss

<domain>
## Phase Boundary

Phase 6 completes the UO Idle Samurai & Ninja Class Skill Lines & Mechanics Knowledgebase deliverable package:
1. Generates custom dark-fantasy Ultima Online / UO Idle-styled class portraits and crisp $64\times 64$ and $48\times 48$ skill icons for every Samurai (`12` milestones/abilities) and Ninja (`13` abilities / `12` milestones) skill under `mockups/assets/icons/samurai/` and `mockups/assets/icons/ninja/`, plus a master icon manifest (`mockups/assets/icons/manifest.json`) and contact sheet (`mockups/assets/icons/contact-sheet.png`).
2. Builds pixel-accurate, self-contained HTML/CSS UI mockups (`mockups/samurai-skill-tree.html`, `mockups/ninja-skill-tree.html`, `mockups/class-comparison.html`) driven directly by the finalized `design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `data/live-classes/{warrior,mage,ranger}.json`, and `data/sim-baselines/parity-5class-v0.99.0.json` payloads, matching `https://uoidle.com/beta`'s dark obsidian/gold aesthetic (`#0b0d0a` canvas, `#131612` cards, `#d4af37` / `#c9a227` antique gold trim, `Cinzel` display headers, `IBM Plex Sans` body/tooltips, `IBM Plex Mono` numerical telemetry).
3. Captures high-resolution verification screenshots (`mockups/screenshots/{samurai-skill-tree,ninja-skill-tree,class-comparison}.png`), authors a root [`README.md`](file:///Users/brbrainerd/dev/uoIdle/README.md) executive handoff index for the UO Idle lead developer, runs the full end-to-end verification suite (`kb.py --self-test`, `kb.py check`, `validate_skills.ts --verify`, `sim_balance.ts --verify`, mockup & asset integrity checks, and credential/secret audit), and syncs everything to `origin/main`.

</domain>

<decisions>
## Implementation Decisions

### Custom Dark-Fantasy UO Iconography (`VISUAL-01`)
- **Asset Coverage (`mockups/assets/icons/`):**
  - **Class Portraits ($256\times 256$ and $64\times 64$):**
    - `mockups/assets/icons/samurai/portrait-samurai.png` (and `portrait-samurai-64.png`): Tokuno Samurai duelist in lacquered crimson-and-gold Mempo/Do-Maru armor (`robeHue: 1884`) wielding a gleaming Katana/No-Dachi.
    - `mockups/assets/icons/ninja/portrait-ninja.png` (and `portrait-ninja-64.png`): Tokuno Shadow Ninja in midnight-indigo shinobi shozoku (`robeHue: 1175`) with emerald poison/smoke accents wielding Tekagi/Kama.
  - **Samurai Skill Icons (`12` abilities, each rendered at both $64\times 64$ `@64.png` and $48\times 48$ `@48.png` + canonical `<id>.png` at $64\times 64$):**
    - `samurai_confidence`, `samurai_honorable_exec`, `samurai_counter_attack`, `samurai_lightning_strike`, `samurai_evasion`, `samurai_momentum_strike`, `samurai_whirlwind_attack`, `samurai_double_strike`, `samurai_armor_ignore`, `samurai_bladeweave`, `samurai_crushing_blow`, `samurai_honorable_exec_r2` (plus passive milestone badges `samurai_bushido_initiate`, `samurai_inner_calm`, `samurai_way_of_the_blade`, `samurai_bushido_master`).
  - **Ninja Skill Icons (`13` abilities, each rendered at both $64\times 64$ `@64.png` and $48\times 48$ `@48.png` + canonical `<id>.png` at $64\times 64$):**
    - `ninja_focus_attack`, `ninja_mirror_image`, `ninja_backstab`, `ninja_shadowjump`, `ninja_ki_attack`, `ninja_death`, `ninja_smoke_bomb`, `ninja_shuriken`, `ninja_infectious_strike`, `ninja_shadow_strike`, `ninja_double_strike`, `ninja_armor_ignore`, `ninja_death_r2` (plus passive milestone badges `ninja_way_of_stealth`, `ninja_shadow_discipline`, `ninja_lethal_toxins`, `ninja_master_assassin`).
  - **Generation & Post-Processing Pipeline (`tools/generate_icons.py` + `image-generator` / Pillow):**
    - Uses AI image generation (`image-generator` subagent for hero portraits/base sheets) combined with deterministic high-precision Pillow (`PIL`) dark-fantasy RPG icon rendering/compositing (`tools/generate_icons.py`) with beveled antique-gold/iron Ultima Online gump borders, volumetric lighting, class-hue rim glow, crisp silhouettes at $64\times 64$ and $48\times 48$, and `mockups/assets/icons/manifest.json` SHA-256 verification.

### Pixel-Accurate `uoidle.com/beta` HTML/CSS Mockups (`VISUAL-02`)
- **Three Self-Contained Interactive Mockups (`mockups/*.html`):**
  1. `mockups/samurai-skill-tree.html`: Renders the live `uoidle.com/beta` `[Arvore` / Class Progression & Hotbar interface for **Samurai (`SM`, ID `114`, Hue `1884`)**, showing the 12-milestone L1–60 progression tree (`L1..L60`), starter skills (`Bushido 50`, `Swordsmanship 50`, `Parrying 50`, `Tactics 50`, `Anatomy 50`, `Healing 50`, `Focus 50`, `Magic Resist 30`), starter Tokuno equipment kit, 5-slot seeded hotbar (`ro(e)` priority queue with `2,000ms` Custom CD floor indicator), interactive bilingual (`EN` / `PT-BR`) toggle, Mode A vs Mode B toggle, and rich hover/pinned ability tooltips sourced 1:1 from `design/drop-in/samurai.json`.
  2. `mockups/ninja-skill-tree.html`: Renders the live `uoidle.com/beta` `[Arvore` / Class Progression & Hotbar interface for **Ninja (`NJ`, ID `115`, Hue `1175`)**, showing the 12-milestone L1–60 progression tree (`L1..L60` + dual L35 unlock `Smoke Bomb` & `Shuriken`), starter skills (`Ninjitsu 50`, `Fencing 50`, `Hiding 50`, `Stealth 50`, `Tactics 50`, `Poisoning 50`, `Focus 50`, `Magic Resist 30`), starter Tokuno equipment kit, 5-slot seeded hotbar, interactive `EN` / `PT-BR` and Mode A / Mode B toggles, and rich ability tooltips sourced 1:1 from `design/drop-in/ninja.json`.
  3. `mockups/class-comparison.html`: Renders the 5-Class Parity & Architecture Dashboard (`Warrior`, `Mage`, `Ranger`, `Samurai`, `Ninja`) in `uoidle.com/beta` theme, featuring side-by-side L1–60 milestone structural parity matrix, Mode A & Mode B DPS / TTK / EHP/s / Resource sustainability charts across `L10, L25, L45, L60` (from `data/sim-baselines/parity-5class-v0.99.0.json`), Tokuno armament showcase (`design/drop-in/items-bushido-ninjitsu.json`), and Mode B `<20 LOC` C# hook inspector.
- **Data-Driven Build & Verification (`tools/build_mockups.ts`):**
  - `npx tsx tools/build_mockups.ts` embeds the exact JSON payloads (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `design/drop-in/items-bushido-ninjitsu.json`, `data/live-classes/{warrior,mage,ranger}.json`, `data/sim-baselines/parity-5class-v0.99.0.json`) and relative icon paths directly into the standalone HTML files so they work offline via `file://` without CORS errors, and `--verify` asserts that every ability ID, unlock level, cooldown, mana cost, and icon asset is present and valid.

</decisions>

<specifics>
## Specific Ideas & Citations

- Capture high-resolution PNG screenshots (`mockups/screenshots/samurai-skill-tree.png`, `mockups/screenshots/ninja-skill-tree.png`, `mockups/screenshots/class-comparison.png`) and author root `README.md` linking every KB index, drop-in file, specification, simulator command, and visual mockup.

</specifics>

<deferred>
## Deferred Ideas

- None — Phase 6 is the final phase of Milestone v1.0.
</deferred>
