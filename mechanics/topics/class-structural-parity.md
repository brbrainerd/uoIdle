---
id: "class-structural-parity"
title: "Cross-Class Structural Parity and Four-Layer Class Template"
category: "classes"
aliases: ["structural-parity", "class-template", "advanced-classes", "unlock-tiers", "slot-ratios"]
status: "bundle-stated"
sources: ["_raw/bundle/skills-and-progression.js", "_raw/bundle/abilities-catalog.json", "_raw/bundle/classes-config.js", "_raw/bundle/abilities-loader-and-hotbar.js"]
evidence: ["bundle: _raw/bundle/abilities-catalog.json:213-1760", "bundle: _raw/bundle/classes-config.js:5-246", "bundle: _raw/bundle/abilities-loader-and-hotbar.js:864-873,1026-1173"]
code_refs: ["skills-and-progression.js:dx", "skills-and-progression.js:hE", "skills-and-progression.js:gE", "skills-and-progression.js:mx", "skills-and-progression.js:hx", "skills-and-progression.js:SE"]
updated: "2026-11-07"
---
# Cross-Class Structural Parity and Four-Layer Class Template

Source: [raw](../_raw/bundle/skills-and-progression.js)

## Summary

Every playable class in UO Idle conforms to a four-layer structural template spanning the client class registry, starter skill and equipment grants, linear level-gated progression unlock tables, and shared ability catalog entries. Auditing the starter class trio alongside the advanced melee and spellcaster progression trees establishes the exact milestone cadence, ability slot counts, dispatch kind mixes, and hotbar seeding rules required for structural parity. Furthermore, inspecting the sixteen-class registry and shared catalog confirms that Samurai and Ninja already possess complete identity, attribute, starter skill, equipment, paperdoll, and hotbar scaffolding, leaving only their linear level progression tables and normalized catalog skill lines to be finalized.

## Claims

- **C1** [bundle-stated] "const dx = { warrior: 'melee', berserker: 'melee', duelist: 'melee', assassin: 'melee', ninja: 'melee', monk: 'melee', samurai: 'melee', paladin: 'melee', ranger: 'ranged', mage: 'magic', necromancer: 'magic', mystic: 'magic', spellweaver: 'magic', bard: 'support', tamer: 'support', worker: 'support', }," (raw L68-L85)
- **C2** [bundle-stated] "uE = 50, dE = 30, mE = 26, hE = { warrior: [40, 41, 42, 27, 1, 5, 17, 26, 50], berserker: [40, 41, 42, 27, 1, 17, 26, 50], duelist: [40, 41, 42, 27, 1, 5, 17, 26, 50], ranger: [31, 27, 1, 4, 17, 26, 50], mage: [25, 16, 46, 41, 27, 1, 26, 50], necromancer: [49, 32, 46, 41, 27, 1, 26, 50], mystic: [55, 25, 46, 41, 27, 1, 26, 50], spellweaver: [54, 46, 41, 27, 1, 26, 50], paladin: [51, 40, 41, 42, 27, 1, 5, 17, 26, 50], assassin: [42, 27, 30, 21, 17, 26, 50], ninja: [53, 42, 21, 47, 17, 26, 50], monk: [43, 27, 1, 17, 26, 50], samurai: [52, 40, 27, 1, 17, 26, 50], bard: [29, 15, 9, 22, 17, 26, 50], tamer: [35, 2, 39, 42, 17, 26, 50], worker: [45, 44, 7, 37, 26, 50], };" (raw L86-L106)
- **C3** [bundle-stated] "const gE = { warrior: [ ['warrior_slash', 1], ['warrior_provoke', 5], ['warrior_shield_bash', 10], ['warrior_armor_break', 15], ['warrior_heavy_strike', 20], ['warrior_whirlwind', 25], ['warrior_brace', 30], ['warrior_disarm', 40], ['warrior_bulwark', 50], ['warrior_execution', 60], ]," (raw L113-L125)
- **C4** [bundle-stated] "berserker: [ ['berserker_cleave', 1], ['warrior_heavy_strike', 5], ['warrior_double_strike', 10], ['warrior_whirlwind', 15], ['warrior_bleed', 20], ['warrior_armor_break', 25], ['berserker_frenzy', 30], ['berserker_bloodrage', 35], ['duelist_mortal', 40], ['warrior_crushing_blow', 45], ['duelist_armor_ignore', 50], ['warrior_execution', 55], ['berserker_berserk', 60], ]," (raw L126-L140)
- **C5** [bundle-stated] "paladin: [ ['paladin_close_wounds', 1], ['warrior_heavy_strike', 5], ['paladin_consecrate', 10], ['warrior_shield_bash', 15], ['paladin_divine_fury', 20], ['warrior_brace', 25], ['paladin_holy_light', 30], ['warrior_disarm', 35], ['warrior_bulwark', 40], ['paladin_noble', 45], ['warrior_whirlwind', 50], ['warrior_crushing_blow', 55], ['warrior_execution', 60], ]," (raw L141-L155)
- **C6** [bundle-stated] "ranger: [ ['ranger_arrow', 1], ['ranger_rapid_shot', 5], ['ranger_aimed_shot', 10], ['ranger_force_arrow', 15], ['ranger_piercing', 20], ['ranger_serpent_arrow', 25], ['ranger_moving_shot', 30], ['ranger_lightning_arrow', 35], ['ranger_multishot', 40], ['ranger_armor_pierce', 45], ['ranger_charged_shot', 50], ['ranger_deadeye', 55], ['ranger_bolt_volley', 60], ]," (raw L156-L170)
- **C7** [bundle-stated] "mage: [ ['mage_heal', 1], ['mage_cure', 1], ['mage_magic_arrow', 1], ['mage_harm', 5], ['mage_fireball', 10], ['mage_lightning', 15], ['mage_magic_reflect', 25], ['mage_energy_bolt', 30], ['mage_explosion', 35], ['mage_chain_lightning', 40], ['mage_flamestrike', 45], ['mage_fire_elemental', 50], ['mage_air_elemental', 55], ['mage_meteor', 60], ]," (raw L171-L186)
- **C8** [bundle-stated] "necromancer: [ ['necro_magery_heal', 1], ['necro_magery_cure', 1], ['mage_magic_arrow', 1], ['mage_magic_reflect', 25], ['necro_pain_spike', 30], ['necro_blood_oath', 35], ['necro_wither', 40], ['necro_lich_form', 45], ['necro_animate_dead', 50], ['necro_strangle', 55], ['necro_poison_strike', 60], ]," (raw L187-L199)
- **C9** [bundle-stated] "spellweaver: [ ['sw_magery_heal', 1], ['mage_cure', 1], ['mage_magic_arrow', 1], ['mage_magic_reflect', 25], ['sw_magery_gh', 30], ['cleric_bless', 35], ['cleric_arch_protection', 40], ['sw_renewal', 45], ['mage_nature_fury', 50], ['sw_thunderstorm', 55], ['sw_wildfire', 60], ], }," (raw L200-L213)
- **C10** [bundle-stated] "mx = { warrior: ['malha', 'longswordShield', 'bandages', 'potionsMelee', 'robeCloak'], berserker: ['malha', 'executionersAxe', 'bandages', 'potionsMelee', 'robeCloak'], duelist: ['malha', 'kryssBuckler', 'bandages', 'potionsMelee', 'robeCloak'], ranger: ['studded', 'bowArrows', 'crossbowBolts', 'bandages', 'potionsMelee', 'robeCloak'], mage: ['leather', 'casterStaff', 'reagents300', 'potionsCaster', 'robeCloak'], necromancer: [ 'leather', 'casterStaff', 'necroPathReagents', 'healArrowReagents', 'potionsCaster', 'robeCloak', ], mystic: ['leather', 'casterStaff', 'reagents300', 'potionsCaster', 'robeCloak'], spellweaver: ['leather', 'casterStaff', 'spellweaverReagents', 'potionsCaster', 'robeCloak'], paladin: ['malha', 'maceShield', 'bandages', 'potionsMelee', 'robeCloak'], assassin: ['leather', 'kryss', 'poison', 'bandages', 'potionsMelee', 'robeCloak'], ninja: ['ninjaSet', 'kryss', 'bandages', 'potionsMelee', 'robeCloak'], monk: ['cloth', 'quarterStaff', 'bandages', 'potionsMelee', 'robeCloak'], samurai: ['samuraiSet', 'katana', 'bandages', 'potionsMelee', 'robeCloak'], bard: ['leather', 'kryss', 'harp', 'bandages', 'potionsMelee', 'robeCloak'], tamer: ['leather', 'crook', 'bandages', 'potionsMelee', 'robeCloak'], worker: ['cloth', 'pickaxeHatchet', 'smithHammer', 'potionsMelee', 'robeCloak'], };" (raw L214-L238)
- **C11** [bundle-stated] "ninja: Nn([ { layer: se.Helm, graphic: 10126 }, { layer: se.InnerTorso, graphic: 10131 }, { layer: se.Pants, graphic: 10129 }, { layer: se.Gloves, graphic: 10130 }, { layer: se.Shoes, graphic: 10135 }, { layer: se.OneHanded, graphic: 5121 }, ]), monk: Nn([ { layer: se.Shirt, graphic: 7933, softShirt: !0 }, { layer: se.Shoes, graphic: 5901 }, ]), samurai: Nn([ { layer: se.Helm, graphic: 10102 }, { layer: se.InnerTorso, graphic: 10182 }, { layer: se.Arms, graphic: 10110 }, { layer: se.Pants, graphic: 5067 }, { layer: se.Shoes, graphic: 10134 }, { layer: se.OneHanded, graphic: 5119 }, ])," (raw L338-L357)
- **C12** [bundle-stated] "SE = { warrior: 1816, ranger: 1837, mage: 1253, berserker: 1905, paladin: 1819, necromancer: 1880, spellweaver: 1864, duelist: 1826, mystic: 1848, assassin: 1866, ninja: 1871, monk: 1122, samurai: 1884, bard: 1892, tamer: 1843, worker: 1814, };" (raw L464-L481)

## The Four-Layer UO Idle Class Template

Every UO Idle class is defined across four orthogonal layers in the client bundle and shared catalog:

### Layer 1: Class Registry, Role, Badge, Robe Hue & Base Stats (`dx`, `Kj`, `QC`, `ZC`, `e2`, `SE`)

All sixteen classes (`101..116`) are registered in `Kj`, `QC`, `ZC`, and `e2` (`_raw/bundle/classes-config.js:5-246`), with role classification in `dx` (**C1**) and robe/cloak hues in `SE` (**C12**):

| Class Key | `Kj` ID | `QC` Index | `e2` Badge | `dx` Role (**C1**) | `SE` Robe Hue (**C12**) | `ZC` Stats (`STR / DEX / INT`, `Sum = 90`) | `gE` Tree Populated? |
|---|---|---|---|---|---|---|---|
| `warrior` | `101` | `1` | `'WR'` | `'melee'` | `1816` | `60 / 20 / 10` | Yes (`10` milestones, **C3**, `[[warrior]] C1`..`[[warrior]] C10`) |
| `ranger` | `102` | `2` | `'RG'` | `'ranged'` | `1837` | `40 / 40 / 10` | Yes (`13` milestones, **C6**, `[[ranger]] C1`..`[[ranger]] C9`) |
| `mage` | `103` | `3` | `'MG'` | `'magic'` | `1253` | `20 / 20 / 50` | Yes (`14` entries, **C7**, `[[mage]] C1`..`[[mage]] C15`) |
| `worker` | `104` | `4` | `'WK'` | `'support'` | `1814` | `50 / 30 / 10` | No (crafting/gathering class) |
| `berserker` | `105` | `5` | `'BK'` | `'melee'` | `1905` | `55 / 25 / 10` | Yes (`13` milestones, **C4**) |
| `duelist` | `106` | `6` | `'DL'` | `'melee'` | `1826` | `40 / 40 / 10` | No (`7` catalog entries) |
| `necromancer` | `107` | `7` | `'NC'` | `'magic'` | `1880` | `20 / 20 / 50` | Yes (`11` entries, **C8**) |
| `mystic` | `108` | `8` | `'MS'` | `'magic'` | `1848` | `20 / 20 / 50` | No (`8` catalog entries) |
| `spellweaver` | `109` | `9` | `'SW'` | `'magic'` | `1864` | `20 / 20 / 50` | Yes (`11` entries, **C9**) |
| `paladin` | `110` | `10` | `'PL'` | `'melee'` | `1819` | `50 / 25 / 15` | Yes (`13` milestones, **C5**) |
| `assassin` | `111` | `11` | `'AS'` | `'melee'` | `1866` | `35 / 45 / 10` | No (`6` catalog entries) |
| **`ninja`** | **`112`** | **`12`** | **`'NJ'`** | **`'melee'`** | **`1871`** | **`35 / 45 / 10`** | **Missing in `gE` (`6` catalog entries, `[[status-effects]] C9`..`[[status-effects]] C12`)** |
| `monk` | `113` | `13` | `'MK'` | `'melee'` | `1122` | `45 / 35 / 10` | No (`6` catalog entries) |
| **`samurai`** | **`114`** | **`14`** | **`'SM'`** | **`'melee'`** | **`1884`** | **`50 / 30 / 10`** | **Missing in `gE` (`6` catalog entries, `[[status-effects]] C13`..`[[status-effects]] C16`)** |
| `bard` | `115` | `15` | `'BD'` | `'support'` | `1892` | `30 / 35 / 25` | No (`5` catalog entries) |
| `tamer` | `116` | `16` | `'TM'` | `'support'` | `1843` | `40 / 30 / 20` | No (`4` catalog entries) |

**Invariant 1 (Base Attribute Budget):** Every single class in `ZC` (`_raw/bundle/classes-config.js:45-222`) has base attributes `str + dex + int == 90`, and legacy skill weights totaling `100` (`40 + 30 + 20 + 10` or `30 + 30 + 20 + 20`).

### Layer 2: Starter Skill Grants (`hE`), Starter Equipment Kits (`mx`), and Paperdolls (`hx`)

- **Starter Skill Grant Rule (`uE = 50, dE = 30, mE = 26` in **C2**):** Every class receives `6` to `10` starter skills in `hE[class]` (`[[progression-unlocks]] C4`, `[[progression-unlocks]] C5`). Every skill in `hE[class]` starts at **`50`** (`uE = 50`) except `magicResist` (`skill 26`), which always starts at **`30`** (`dE = 30`). Every class includes `magicResist` (`26`) and `focus` (`50`) as its final two entries:
  - **`samurai` (`hE.samurai = [52, 40, 27, 1, 17, 26, 50]`):** `bushido` (`50`), `swords` (`50`), `tactics` (`50`), `anatomy` (`50`), `healing` (`50`), `magicResist` (`30`), `focus` (`50`).
  - **`ninja` (`hE.ninja = [53, 42, 21, 47, 17, 26, 50]`):** `ninjitsu` (`50`), `fencing` (`50`), `hiding` (`50`), `stealth` (`50`), `healing` (`50`), `magicResist` (`30`), `focus` (`50`).
- **Starter Equipment Kits (`mx` in **C10**):** Every combat class receives `5` or `6` starter kit tokens ending with `potionsMelee` (or `potionsCaster`) and `robeCloak`. `mx.samurai = ['samuraiSet', 'katana', 'bandages', 'potionsMelee', 'robeCloak']` and `mx.ninja = ['ninjaSet', 'kryss', 'bandages', 'potionsMelee', 'robeCloak']` are already wired (**C10**).
- **Paperdoll Layer Arrays (`hx` in **C11**):** `hx.samurai` equips Tokuno Samurai armor graphics (`Helm 10102`, `InnerTorso 10182`, `Arms 10110`, `Pants 5067`, `Shoes 10134`) and a `Katana` (`OneHanded 5119`), while `hx.ninja` equips Leather Ninja armor graphics (`Helm 10126`, `InnerTorso 10131`, `Pants 10129`, `Gloves 10130`, `Shoes 10135`) and a `Kryss` (`OneHanded 5121`) (**C11**).

### Layer 3: Linear L1–60 Progression Curve (`gE`, **C3–C9**)

Across the seven populated `gE` classes (**C3–C9**), progression follows a strict L1–60 milestone curve:

| Structural Metric | `warrior` (**C3**) | `berserker` (**C4**) | `paladin` (**C5**) | `ranger` (**C6**) | `mage` (**C7**) | `necromancer` (**C8**) | `spellweaver` (**C9**) |
|---|---|---|---|---|---|---|---|
| **Total `gE` Entries** | `10` | `13` | `13` | `13` | `14` | `11` | `11` |
| **Distinct Level Brackets** | `10` (`1..30` by `5`, then `40, 50, 60`) | `13` (`1..60` every `5` levels) | `13` (`1..60` every `5` levels) | `13` (`1..60` every `5` levels) | `12` (`L1` x`3`, `5, 10, 15, 25..60` every `5` levels) | `9` (`L1` x`3`, `25..60` every `5` levels) | `9` (`L1` x`3`, `25..60` every `5` levels) |
| **L1 Starter Node(s)** | `warrior_slash` (`Passive`) | `berserker_cleave` (`Custom`, + `warrior_slash` in catalog) | `paladin_close_wounds` (`Spell`, + `warrior_slash` in catalog) | `ranger_arrow` (`Passive`) | `mage_heal`, `mage_cure`, `mage_magic_arrow` | `necro_magery_heal`, `necro_magery_cure`, `mage_magic_arrow` | `sw_magery_heal`, `mage_cure`, `mage_magic_arrow` |
| **L60 Capstone Node** | `warrior_execution` | `berserker_berserk` | `warrior_execution` | `ranger_bolt_volley` | `mage_meteor` | `necro_poison_strike` (catalog L60: `necro_lich_form`) | `sw_wildfire` (`Word of Death`) |

#### Complete Advanced `gE` Class Breakdown (`berserker`, `paladin`, `necromancer`, `spellweaver`)

1. **`berserker` (`13` `gE` milestones in **C4**; `10` `"class": "berserker"` catalog entries at `abilities-catalog.json:346-471`):**
   - Reuses `5` Warrior abilities in `gE.berserker` (`warrior_heavy_strike` L5, `warrior_whirlwind` L15, `warrior_armor_break` L25, `warrior_crushing_blow` L45, `warrior_execution` L55) and `2` Duelist-prefixed `WeaponAbility` entries (`duelist_mortal` L40 `ref: 9` `MortalStrike`, `duelist_armor_ignore` L50 `ref: 1` `ArmorIgnore`), plus `warrior_double_strike` (L10 `ref: 7`), `warrior_bleed` (L20 `ref: 2`), and four signature Berserker `Custom` abilities: `berserker_cleave` (L1, cleave + splash in `Cq` per `[[damage-and-defense]] C8`), `berserker_frenzy` (L30), `berserker_bloodrage` (L35), and `berserker_berserk` (L60).
2. **`paladin` (`13` `gE` milestones in **C5**; `6` `"class": "paladin"` catalog entries at `abilities-catalog.json:1236-1317`):**
   - Combines `5` Chivalry `"Spell"` entries (`paladin_close_wounds` L1 `ref: 201`, `paladin_consecrate` L10 `ref: 202`, `paladin_divine_fury` L20 `ref: 204`, `paladin_holy_light` L30 `ref: 206`, `paladin_noble` L45 `ref: 207`)—all tithing `1 gp` per Chivalry point (`[[resources]] C12`)—with `8` shared Warrior melee/shield skills (`warrior_heavy_strike` L5, `warrior_shield_bash` L15, `warrior_brace` L25, `warrior_disarm` L35, `warrior_bulwark` L40, `warrior_whirlwind` L50, `warrior_crushing_blow` L55, `warrior_execution` L60).
3. **`necromancer` (`11` `gE` entries in **C8**; `9` `"class": "necromancer"` catalog entries at `abilities-catalog.json:882-1002`):**
   - Starts at `L1` with `necro_magery_heal`, `necro_magery_cure`, and shared `mage_magic_arrow`, gains shared `mage_magic_reflect` at `L25`, and unlocks `7` Necromancy spells/abilities from `L30` to `L60`: `necro_pain_spike` (`L30` in `gE`, `unlock: 10` in catalog, `ref: 108`), `necro_blood_oath` (`L35` in `gE`, `unlock: 20` in catalog, `ref: 101`), `necro_wither` (`L40` in `gE`, `unlock: 45` in catalog, `ref: 114`), `necro_lich_form` (`L45` in `gE`, `unlock: 60` in catalog, `ref: 106`, `90s` duration per `[[resources]] C19`), `necro_animate_dead` (`L50`, `Custom` `map: "Idle"` corpse-free skeleton summon per `[[resources]] C19`), `necro_strangle` (`L55` in `gE`, `unlock: 30` in catalog, `ref: 110`), and `necro_poison_strike` (`L60` in `gE`, `unlock: 40` in catalog, `ref: 109`).
4. **`spellweaver` (`11` `gE` entries in **C9**; `9` `"class": "spellweaver"` catalog entries at `abilities-catalog.json:1116-1234`):**
   - Starts at `L1` with `sw_magery_heal`, `mage_cure`, and `mage_magic_arrow`, gains `mage_magic_reflect` at `L25` and `sw_magery_gh` (`Greater Heal`, `35%` Max HP per `[[resources]] C11`) at `L30`, and unlocks `cleric_bless` (`L35`, `ref: 16`), `cleric_arch_protection` (`L40`, `ref: 25`), `sw_renewal` (`L45`, `Custom` `map: "Idle"`), `mage_nature_fury` (`L50`, `Custom` `map: "Idle"`), `sw_thunderstorm` (`L55`, `ref: 604`), and `sw_wildfire` (`L60`, `ref: 613`, named `"Word of Death"` in catalog). Note that `sw_circle` (`Arcane Circle`, `unlock: 20`, `ref: 600`) exists in `abilities-catalog.json:1171-1183` but is omitted from `gE.spellweaver`.

### Layer 4: Ability Catalog Dispatch & Pre-Existing Samurai / Ninja Entries

In `abilities-catalog.json` (`134` total entries: `18` universal `ItemUse` + `116` class entries), the non-`gE` classes (`duelist`, `mystic`, `assassin`, `ninja`, `monk`, `samurai`, `bard`, `tamer`) retain legacy pre-V3 unlock tiers (`1, 5, 10, 75, 150, 200, 300`). Specifically, the **12 pre-existing `samurai_*` and `ninja_*` catalog entries** (`[[status-effects]] C9`..`[[status-effects]] C16`) are:

| Class | Pre-Existing Catalog IDs & Unlock Levels | Dispatch Kinds & `ref` IDs | Required Phase 5 Normalization for Structural Parity |
|---|---|---|---|
| **`samurai`** | `samurai_lightning` (`L1`), `samurai_counter` (`L5`), `samurai_honorable` (`L10`), `samurai_way` (`L75`), `samurai_honorable_r2` (`L200`), `samurai_lightning_r2` (`L300`) | `SpecialMove` (`400`, `404`), `Spell` (`403`), `Passive` (`map: "New"`) | Move `samurai_way` (`Passive`) to `L1`, populate `gE.samurai` with a **10–13 milestone L1–60 curve** (`1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60`), wire remaining Bushido spells (`Confidence` `401`, `Evasion` `402`, `MomentumStrike` `405`) and Tokuno `WeaponAbility` / `Custom` nodes into `L1..L60`, and add `Cq`/`Eq` client estimator branches (`[[engine-capability-matrix]]`). |
| **`ninja`** | `ninja_focus` (`L1`), `ninja_death` (`L5`), `ninja_mirror` (`L10`), `ninja_shadowjump` (`L75`), `ninja_death_r2` (`L200`), `ninja_mirror_r2` (`L300`) | `SpecialMove` (`500`, `501`, `506`, `507`) | Add an `L1` `Passive` auto-attack node, populate `gE.ninja` with a **10–13 milestone L1–60 curve** (`1..60`), normalize `ninja_shadowjump` and Ninjitsu skills (`Backstab` `502`, `SurpriseAttack` `503`, `KiAttack` `505`, `AnimalForm` `504`, `SmokeBomb` / `Fukiya` / `Shuriken`) into `L1..L60`, and add `Cq`/`Eq` client estimator branches (`[[engine-capability-matrix]]`). |
