# UO Idle (`v0.99.0`) — Ninja & Samurai Class Skill Lines & Mechanics Knowledgebase

**Milestone v1.1 Executive Handoff, Interactive Workbench & Live GitHub Pages Portal**

> **Live Interactive Review Portal (GitHub Pages):**  
> - **Lead Developer Executive Portal:** <https://brbrainerd.github.io/uoIdle/>  
> - **Samurai (`SM`, ID `114`, `robeHue: 1884`) Interactive Workbench & Paperdoll:** <https://brbrainerd.github.io/uoIdle/mockups/samurai-skill-tree.html>  
> - **Ninja (`NJ`, ID `115`, `robeHue: 1175`) Interactive Workbench & Paperdoll:** <https://brbrainerd.github.io/uoIdle/mockups/ninja-skill-tree.html>  
> - **5-Class Progression Matrix, Simulator Visual Telemetry & Tokuno Armaments:** <https://brbrainerd.github.io/uoIdle/mockups/class-comparison.html>

This repository delivers a **100% source-verified mechanics knowledgebase** (56 claim-verified pages) of **UO Idle** (`https://uoidle.com/beta`, build `v0.99.0`) and **ModernUO** (*Bushido* & *Ninjitsu*), a **deterministic `100ms`-tick 5-class combat simulator** (verified across 9 material tiers `Iron -> Valorite`, 10-wave dungeon endurance runs, and 11 unit test suites), complete **drop-in Samurai (`SM`, `classNumericId: 114`, `robeHue: 1884`) and Ninja (`NJ`, `classNumericId: 115`, `robeHue: 1175`) class, skill, and Tokuno armament definitions** supporting both **Mode A** (zero engine code changes) and **Mode B** (`<20 LOC` native C# server hooks), **140 oil-painted & authentic UO gump icon PNGs + 34 authentic UO item/paperdoll sprites** (zero procedural polygons), and **interactive `uoidle.com/beta` HTML/CSS UI mockups** with mouseover gear paperdolls and visual simulator charts.

---

## 1. Quick-Start Integration Guide (`Mode A` vs `Mode B`)

### Mode A — 100% Existing UO Idle `v0.99.0` Engine (Zero Engine Code Changes)

Mode A maps every Samurai and Ninja progression milestone, hotbar skill, weapon ability, spell, and status effect directly onto live `v0.99.0` client/server bundle structures (`_E`/`dx`, `WE`/`hE`, `yE`/`mx`, `FE`, `mE`/`gh`, `gE`, `b`, `qC`/`Cq`/`Eq`, and `i18n`).

1. **Drop-In Class & Ability Payloads:**
   - [`design/drop-in/samurai.json`](design/drop-in/samurai.json) — **Samurai (`SM`, `classNumericId: 114`, `robeHue: 1884`)**: `STR 50 / DEX 30 / INT 10`, 8 starter skills (`Bushido 50`, `Swordsmanship 50`, `Tactics 50`, `Parrying 50`, `Anatomy 50`, `Healing 50`, `Magic Resist 30`, `Focus 50`), 8-layer Tokuno starter kit (`Katana` `5119` with shieldless `TwoHanded` slot open for Bushido Weapon Parry), 5-slot seeded hotbar, 12 `L1–L60` progression milestones, and 12 normalized catalog abilities.
   - [`design/drop-in/ninja.json`](design/drop-in/ninja.json) — **Ninja (`NJ`, `classNumericId: 115`, `robeHue: 1175`)**: `STR 30 / DEX 50 / INT 10`, 8 starter skills (`Ninjitsu 50`, `Fencing 50`, `Tactics 50`, `Hiding 50`, `Stealth 50`, `Anatomy 50`, `Magic Resist 30`, `Focus 50`), 9-layer Tokuno starter kit (`Kryss` `5121` with off-hand free for `FocusAttack`, `Shuriken`, and `Fukiya`), 5-slot seeded hotbar, 12 `L1–L60` progression milestones (including dual `L35` unlock of `ninja_smoke_bomb` + `ninja_shuriken`), and 13 normalized catalog abilities.
   - [`design/drop-in/items-bushido-ninjitsu.json`](design/drop-in/items-bushido-ninjitsu.json) — **Tokuno Armaments, Consumables & Affixes**: 8 iconic Tokuno armaments (*Katana*, *No-Dachi*, *Wakizashi*, *Lajatang*, *Tekagi*, *Kama*, *Fukiya*, *Tessen*), 8 drop-in weapon definitions (*Bokuto*, *Daisho*, *Lajatang*, *No-Dachi*, *Sai*, *Tekagi*, *Tessen*, *Wakizashi*), 4 Ninjitsu consumables (*Smoke Bomb*, *Egg Bomb*, *Fukiya*, *Shuriken*), 9 material tiers (`Iron` `1.00x` through `Valorite` `1.85x`), and 10 equipment affix pools.
2. **Apply the Client/Server Bundle Patch (`applyDropInClassPatch`):**
   - Import [`design/drop-in/classes-patch.js`](design/drop-in/classes-patch.js) and invoke `applyDropInClassPatch(bundleTables)` to register class metadata (`_E`), starter skills (`WE`), paperdoll kits (`yE`), legacy template weights (`FE`), seeded hotbars (`mE`), `[Arvore` progression trees (`gE`), catalog abilities (`b`), client combat estimators (`qC`), and bilingual `en` / `pt-BR` localization keys (`i18n`).

### Mode B — Authentic ModernUO Extension (`<20 LOC` C# Server Hooks)

For shards running the ModernUO C# backend that want native reactive parry counters, automatic *Honor/Perfection* target binding, ablative *Mirror Image* clone interception, and 5-swing *Death Strike* detonation in stationary 1D combat:

- **Samurai (`17 LOC` C# in `Projects/UOContent/Items/Weapons/BaseWeapon.cs`):** Documented in [`design/SAMURAI_SPEC.md` §4](design/SAMURAI_SPEC.md). Binds `PerfectionTarget` automatically on hit (`+4%/hit` up to a `+15%` boss cap, restoring `+8` HP/Stam/Mana on kill) and triggers `CounterAttack` free swings and `Confidence` regeneration on successful parries with a `2,000ms` internal cooldown (`NextBushidoParryProc`).
- **Ninja (`16 LOC` C# in `Projects/UOContent/Items/Weapons/BaseWeapon.cs`):** Documented in [`design/NINJA_SPEC.md` §4](design/NINJA_SPEC.md). Intercepts incoming hits with active `MirrorImage` clones (`70%` ablative mitigation, `1,500ms` ICD via `NextCloneIntercept`), advances `DeathStrike.AddStep(defender)` on every connected Ninja melee swing (`5` swings to detonate), and consumes `CombatStealthUntil` windows for `Backstab` and `SurpriseAttack`.

---

## 2. Visual Beta UI Mockups & Custom Dark-Fantasy UO Iconography (`VISUAL-01`, `VISUAL-02`)

All three HTML mockups are 100% self-contained, zero-CORS standalone bundles compiled by [`tools/build_mockups.ts`](tools/build_mockups.ts) that can be opened directly over `file://` in any browser:

| Mockup Deliverable | HTML Workbench (`file://` Ready) | Retina Verification Screenshot ($3200\times 2800$) | Highlights |
|---|---|---|---|
| **Samurai (`SM`, ID `114`, Hue `1884`) Skill Tree** | [`mockups/samurai-skill-tree.html`](mockups/samurai-skill-tree.html) | [`mockups/screenshots/samurai-skill-tree.png`](mockups/screenshots/samurai-skill-tree.png) | Live `.personagem-arvore` layout, $256\times 256$ Samurai portrait, 8 starter skills, Tokuno paperdoll, 5-slot hotbar, 12 `L1–L60` milestones, 12 catalog cards, interactive `EN`/`PT-BR` & `Mode A`/`Mode B` toggles |
| **Ninja (`NJ`, ID `115`, Hue `1175`) Skill Tree** | [`mockups/ninja-skill-tree.html`](mockups/ninja-skill-tree.html) | [`mockups/screenshots/ninja-skill-tree.png`](mockups/screenshots/ninja-skill-tree.png) | Live `.personagem-arvore` layout, $256\times 256$ Ninja portrait, 8 starter skills, Tokuno paperdoll, 5-slot hotbar, 12 `L1–L60` milestones + dual `L35` `Smoke Bomb` & `Shuriken` unlock, 13 catalog cards |
| **5-Class Parity, Telemetry & Armament Dashboard** | [`mockups/class-comparison.html`](mockups/class-comparison.html) | [`mockups/screenshots/class-comparison.png`](mockups/screenshots/class-comparison.png) | Side-by-side 5-class `L1–L60` matrix (`WR`, `MG`, `RG`, `SM`, `NJ`), interactive `L10/L25/L45/L60` × 4-archetype telemetry bars, Tokuno armaments & affixes, `<20 LOC` C# hook inspector |
| **Custom Iconography Contact Sheet & Manifest** | [`mockups/assets/icons/manifest.json`](mockups/assets/icons/manifest.json) | [`mockups/assets/icons/contact-sheet.png`](mockups/assets/icons/contact-sheet.png) | `140` verified PNG files (`23` Samurai stems + `22` Ninja stems at $64\times 64$ & $48\times 48$ + $256\times 256$ & $64\times 64$ portraits) generated by [`tools/generate_icons.py`](tools/generate_icons.py) |

### Screenshot Previews

#### Samurai (`SM`, ID `114`, `robeHue: 1884`) — `[Arvore` Progression & Hotbar Workbench
![Samurai Skill Tree Mockup](mockups/screenshots/samurai-skill-tree.png)

#### Ninja (`NJ`, ID `115`, `robeHue: 1175`) — `[Arvore` Progression & Hotbar Workbench
![Ninja Skill Tree Mockup](mockups/screenshots/ninja-skill-tree.png)

#### 5-Class Structural Parity, Combat Simulation Telemetry & Tokuno Armaments
![5-Class Comparison Mockup](mockups/screenshots/class-comparison.png)

#### Custom Dark-Fantasy UO Portraits & Multi-Resolution Skill Icon Contact Sheet
![Custom Iconography Contact Sheet](mockups/assets/icons/contact-sheet.png)

---

## 3. Complete Deliverable & v1.0 Requirement Traceability Index

Every v1 requirement (`KB-01..04`, `INDEX-01..04`, `SIM-01..03`, `CLASS-01..04`, `VISUAL-01..02`) is verified by automated gates and indexed below:

| Req ID | Requirement Summary | Primary Artifacts & Documentation Links |
|---|---|---|
| **`KB-01`** | Private repository (`brbrainerd/uoIdle`) & credential/secret sanitizer | [`mechanics/tools/kb.py`](mechanics/tools/kb.py) (`check_credentials`, `CREDENTIAL_PATTERNS`) |
| **`KB-02`** | Claim-verification linter (`kb.py build`, `kb.py check`, `--self-test`) & master KB index | [`mechanics/INDEX.md`](mechanics/INDEX.md), [`mechanics/tools/kb.py`](mechanics/tools/kb.py) |
| **`KB-03`** | Formatted & AST-sliced live UO Idle `v0.99.0` bundle modules & runtime captures | [`tools/bundle_extract.mjs`](tools/bundle_extract.mjs), [`mechanics/_raw/manifest.json`](mechanics/_raw/manifest.json), `mechanics/_raw/bundle/` |
| **`KB-04`** | Canonical ModernUO C# source snapshots (*Bushido*, *Ninjitsu*, *HonorContext*, *BaseWeapon*) | [`tools/fetch_modernuo.py`](tools/fetch_modernuo.py), `mechanics/_raw/modernuo/` |
| **`INDEX-01`** | Core UO Idle combat & progression systems KB pages | [`mechanics/combat/tick-and-cooldowns.md`](mechanics/combat/tick-and-cooldowns.md), [`mechanics/combat/damage-and-defense.md`](mechanics/combat/damage-and-defense.md), [`mechanics/combat/resources.md`](mechanics/combat/resources.md), [`mechanics/combat/status-effects.md`](mechanics/combat/status-effects.md), [`mechanics/systems/progression-unlocks.md`](mechanics/systems/progression-unlocks.md), [`mechanics/systems/equipment-affixes.md`](mechanics/systems/equipment-affixes.md) |
| **`INDEX-02`** | 3-Tier Client / Shared-Config / Server-Authoritative Engine Capability Matrix | [`mechanics/topics/engine-capability-matrix.md`](mechanics/topics/engine-capability-matrix.md) |
| **`INDEX-03`** | Claim-verified live **Warrior**, **Mage**, and **Ranger** class deep-dive KB pages | [`mechanics/classes/warrior.md`](mechanics/classes/warrior.md), [`mechanics/classes/mage.md`](mechanics/classes/mage.md), [`mechanics/classes/ranger.md`](mechanics/classes/ranger.md) |
| **`INDEX-04`** | Canonical JSON Schemas, TypeScript `zod` validator, and cross-class structural parity | [`schemas/class.schema.json`](schemas/class.schema.json), [`schemas/skill.schema.json`](schemas/skill.schema.json), [`schemas/effect.schema.json`](schemas/effect.schema.json), [`src/schemas/skill.schema.ts`](src/schemas/skill.schema.ts), [`tools/validate_skills.ts`](tools/validate_skills.ts), [`mechanics/topics/class-structural-parity.md`](mechanics/topics/class-structural-parity.md), [`mechanics/topics/combat-niches.md`](mechanics/topics/combat-niches.md), [`data/live-classes/warrior.json`](data/live-classes/warrior.json), [`data/live-classes/mage.json`](data/live-classes/mage.json), [`data/live-classes/ranger.json`](data/live-classes/ranger.json) |
| **`SIM-01`** | ModernUO *Bushido* & *Ninjitsu* reference KB pages (17 mechanics) & idle state-machine mapping | [`mechanics/classes/modernuo-bushido.md`](mechanics/classes/modernuo-bushido.md), [`mechanics/classes/modernuo-ninjitsu.md`](mechanics/classes/modernuo-ninjitsu.md), `mechanics/modernuo/*.md`, [`design/MODERNUO_MAPPING.md`](design/MODERNUO_MAPPING.md) |
| **`SIM-02`** | Deterministic `100ms`-tick combat simulator & live 3-class baseline benchmarks | [`src/sim/engine.ts`](src/sim/engine.ts), [`src/sim/types.ts`](src/sim/types.ts), [`src/sim/archetypes.ts`](src/sim/archetypes.ts), [`tools/sim_balance.ts`](tools/sim_balance.ts), [`data/sim-baselines/baseline-v0.99.0.json`](data/sim-baselines/baseline-v0.99.0.json) |
| **`SIM-03`** | Automated 5-class Mode A & Mode B parity proof ($\pm 5\text{–}8\%$ envelope across `L10, L25, L45, L60`) | [`design/BALANCE_REPORT.md`](design/BALANCE_REPORT.md), [`data/sim-baselines/parity-5class-v0.99.0.json`](data/sim-baselines/parity-5class-v0.99.0.json) |
| **`CLASS-01`** | **Samurai (`Bushido`)** formal specification (*Perfection Ramp / Weapon Parry-Counter / Execute*) | [`design/SAMURAI_SPEC.md`](design/SAMURAI_SPEC.md), [`design/drop-in/samurai.json`](design/drop-in/samurai.json) |
| **`CLASS-02`** | **Ninja (`Ninjitsu`)** formal specification (*Ablative Clone Mitigation / Stealth Opener / 5-Hit Detonation*) | [`design/NINJA_SPEC.md`](design/NINJA_SPEC.md), [`design/drop-in/ninja.json`](design/drop-in/ninja.json) |
| **`CLASS-03`** | Dual-mode drop-in class/skill payloads (`Mode A` 100% engine-strict & `Mode B` `<20 LOC` C# hooks) | [`design/drop-in/samurai.json`](design/drop-in/samurai.json), [`design/drop-in/ninja.json`](design/drop-in/ninja.json), [`design/drop-in/classes-patch.js`](design/drop-in/classes-patch.js) |
| **`CLASS-04`** | Tokuno weapons, Ninjitsu projectiles/consumables, material tiers, and equipment affix pools | [`design/drop-in/items-bushido-ninjitsu.json`](design/drop-in/items-bushido-ninjitsu.json) |
| **`VISUAL-01`** | Custom dark-fantasy UO Samurai & Ninja class portraits and $64\times 64$ / $48\times 48$ skill icon suite | [`tools/generate_icons.py`](tools/generate_icons.py), [`mockups/assets/icons/contact-sheet.png`](mockups/assets/icons/contact-sheet.png), [`mockups/assets/icons/manifest.json`](mockups/assets/icons/manifest.json), `mockups/assets/icons/{samurai,ninja}/` |
| **`VISUAL-02`** | Self-contained `uoidle.com/beta` HTML/CSS mockups & high-resolution verification screenshots | [`tools/build_mockups.ts`](tools/build_mockups.ts), [`mockups/samurai-skill-tree.html`](mockups/samurai-skill-tree.html), [`mockups/ninja-skill-tree.html`](mockups/ninja-skill-tree.html), [`mockups/class-comparison.html`](mockups/class-comparison.html), `mockups/screenshots/*.png` |

---

## 4. Reproducible 7-Command Milestone v1.1 Verification Suite

Run the complete verification suite via `npm run verify:all` or execute each gate individually (completes in `< 5 seconds`):

```bash
# 1. Verify kb.py claim linter self-tests (28 mutation & 4 unit self-tests)
python3 mechanics/tools/kb.py --self-test

# 2. Verify all 56 KB pages in mechanics/INDEX.md and scan repository for leaked secrets
python3 mechanics/tools/kb.py check --root mechanics

# 3. Validate all 5 class JSON payloads (Warrior, Mage, Ranger, Samurai, Ninja) & 134 catalog skills against Zod/JSON Schemas
npx tsx tools/validate_skills.ts --verify

# 4. Run deterministic 5-class Mode A & Mode B combat simulations across L10/L25/L45/L60 × 4 archetypes + 9 material tiers + 10-wave endurance
npx tsx tools/sim_balance.ts --verify

# 5. Run 11 deterministic unit test suites for idle state-machine mechanics (Perfection, Parry ICD, Mirror Image, 3-Swing Death Strike, etc.)
npx tsx tools/test_sim.ts

# 6. Verify all 140 oil-painted/gump icons + 37 item/paperdoll PNGs, zero ImageDraw.polygon usage, and SHA-256 hashes
python3 tools/generate_icons.py --verify

# 7. Verify all 5 standalone beta HTML mockups/portals, 164 resolved asset links, and 4 high-DPI PNG screenshots
npx tsx tools/build_mockups.ts --verify
```
