---
id: "ranger"
title: "Ranger Class Deep-Dive: Ranged Archery, Volleys, and Catalog Drift"
category: "classes"
aliases: ["ranger", "arqueiro", "RG", "class-102"]
status: "verified"
sources: ["_raw/bundle/abilities-catalog.json", "_raw/bundle/skills-and-progression.js", "_raw/bundle/classes-config.js", "_raw/bundle/abilities-loader-and-hotbar.js", "_raw/bundle/combat-estimators-and-hotbar.js", "_raw/bundle/i18n-en-abilities.js"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/skills-and-progression.js:68-238", "bundle: _raw/bundle/classes-config.js:5-89", "bundle: _raw/bundle/abilities-loader-and-hotbar.js:864-873", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:85-93,413-453", "bundle: _raw/bundle/i18n-en-abilities.js:1780-1792,2473-2497"]
code_refs: ["abilities-catalog.json:ranger_*", "skills-and-progression.js:gE.ranger", "classes-config.js:ZC.ranger", "abilities-loader-and-hotbar.js:cr", "combat-estimators-and-hotbar.js:Cq"]
updated: "2026-11-07"
---
# Ranger Class Deep-Dive: Ranged Archery, Volleys, and Catalog Drift

Source: [raw](../_raw/bundle/abilities-catalog.json)

## Summary

The Ranger is the dedicated ranged physical marksman of the starter class trio in UO Idle. Built around a balanced Strength and Dexterity attribute profile, studded leather armor, and both bow-and-arrow and crossbow-and-bolt starter kits, the Ranger combines a continuous ranged auto-attack loop with Ultima Online ranged weapon abilities, multi-arrow custom volleys, and a wounded-target execution shot. Auditing the Ranger across the client progression module, hotbar loader, and shared ability catalog reveals three distinct categories of structural drift: four progression-tree arrow milestones absent from the shared ability catalog, a rank-suffixed Charged Shot identifier reconciled via a hotbar alias table, and a Deadeye unlock level mismatch between the client progression curve and the catalog.

## Claims

- **C1** [verified] ""id": "ranger_arrow", "class": "ranger", "kind": "Passive", "name": "Arrow", "unlock": 1, "mana": 0, "blurb": "Unlocks at level 1.", "tab": "ability", "map": "UO", "gumpIcon": 21013, "iconKey": "gump_21013"" (raw L567-L577)
- **C2** [verified] ""id": "ranger_rapid_shot", "class": "ranger", "kind": "WeaponAbility", "name": "Rapid Shot", "unlock": 5, "mana": 14, "blurb": "Unlocks at level 5.", "tab": "ability", "ref": 22, "map": "UO", "gumpIcon": 21013, "iconKey": "gump_21013"" (raw L580-L591)
- **C3** [verified] ""id": "ranger_aimed_shot", "class": "ranger", "kind": "WeaponAbility", "name": "Aimed Shot", "unlock": 10, "mana": 12, "blurb": "Unlocks at level 10.", "tab": "ability", "ref": 11, "map": "UO", "gumpIcon": 21002, "iconKey": "gump_21002"" (raw L594-L605)
- **C4** [verified] ""id": "ranger_piercing", "class": "ranger", "kind": "WeaponAbility", "name": "Piercing Arrow", "unlock": 20, "mana": 12, "blurb": "Unlocks at level 20.", "tab": "ability", "ref": 1, "map": "UO", "gumpIcon": 20992, "iconKey": "gump_20992"" (raw L608-L619)
- **C5** [verified] ""id": "ranger_moving_shot", "class": "ranger", "kind": "WeaponAbility", "name": "Moving Shot", "unlock": 30, "mana": 12, "blurb": "Unlocks at level 30.", "tab": "ability", "ref": 10, "map": "UO", "gumpIcon": 21001, "iconKey": "gump_21001"" (raw L622-L633)
- **C6** [verified] ""id": "ranger_multishot", "class": "ranger", "kind": "Custom", "name": "Multishot", "unlock": 40, "mana": 16, "blurb": "Unlocks at level 40.", "tab": "ability", "map": "New", "gumpIcon": 21013, "iconKey": "idle_ranger_multishot"" (raw L636-L646)
- **C7** [verified] ""id": "ranger_charged_shot_r2", "class": "ranger", "kind": "WeaponAbility", "name": "Charged Shot", "unlock": 50, "mana": 14, "blurb": "Unlocks at level 50.", "tab": "ability", "ref": 1, "map": "UO"" (raw L649-L658)
- **C8** [verified] ""id": "ranger_bolt_volley", "class": "ranger", "kind": "Custom", "name": "Bolt Volley", "unlock": 60, "mana": 16, "blurb": "Unlocks at level 60.", "tab": "ability", "map": "New", "gumpIcon": 21013, "iconKey": "idle_ranger_bolt_volley"" (raw L661-L671)
- **C9** [verified] ""id": "ranger_deadeye", "class": "ranger", "kind": "Custom", "name": "Deadeye", "unlock": 100, "mana": 25, "blurb": "Unlocks at level 100.", "tab": "ability", "map": "New", "gumpIcon": 21001, "iconKey": "idle_ranger_deadeye"" (raw L674-L684)

## Class Identity, Role, Starter Skills & Starter Kit

The Ranger (`ranger`) is the sole `'ranged'` class among all sixteen UO Idle class definitions (`[[progression-unlocks]] C3`):

| Property | Value | Source / Cross-Link |
|---|---|---|
| **Class Key & Numeric ID** | `ranger` (`Kj.ranger = 102`, `QC[2] = 'ranger'`) | `_raw/bundle/classes-config.js:8,26` |
| **Two-Letter Badge & Robe Hue** | `e2.ranger = 'RG'`, `SE.ranger = 1837` | `_raw/bundle/classes-config.js:228`, `_raw/bundle/skills-and-progression.js:466` |
| **Role Classification** | `dx.ranger = 'ranged'` | `[[progression-unlocks]] C3` |
| **Legacy Base Attributes (`ZC.ranger`)** | `STR: 40`, `DEX: 40`, `INT: 10` (`skills: [[31, 40], [27, 30], [1, 20], [21, 10]]`) | `_raw/bundle/classes-config.js:79-89` |
| **Starter Skill Grants (`hE.ranger`)** | `[31, 27, 1, 4, 17, 26, 50]` — `archery` (`50`), `tactics` (`50`), `anatomy` (`50`), `armsLore` (`50`), `healing` (`50`), `magicResist` (`30`), `focus` (`50`) | `[[progression-unlocks]] C4`, `[[progression-unlocks]] C5` |
| **Starter Equipment Kit (`mx.ranger`)** | `['studded', 'bowArrows', 'crossbowBolts', 'bandages', 'potionsMelee', 'robeCloak']` (Studded Leather armor set, Bow + Arrows, Crossbow + Bolts, Bandages, Melee Potions, Robe & Cloak) | `[[progression-unlocks]] C13` |
| **Paperdoll Layers (`hx.ranger`)** | Studded Leather (`vE()` minus Helm: Necklace `5078`, InnerTorso `5083`, Arms `5084`, Gloves `5077`, Pants `5082`), Feathered Hat (`Helm 5914`, `softHat: true`), Shoes `5899`, Shirt `7933`, TwoHanded `5042` (Bow), plus Robe `7939` and Cloak `5397` (`xE()`) | `_raw/bundle/skills-and-progression.js:264-299` |
| **Seeded Default Hotbar (`gh.ranger`)** | Slot `0`: `lesser_heal_potion` (`hp <= 50%`), Slot `1`: `bandage` (`hp <= 80% OR poisoned == 1`), Slot `2`: `lesser_cure_potion` (`poisoned == 1`), Slot `3`: `lesser_mana_potion` (`mana <= 30%`) | `[[tick-and-cooldowns]] C11` |

## Complete L1–60 Progression Table (`gE.ranger`) vs Catalog (`C1`–`C9`)

`gE.ranger` (`[[progression-unlocks]] C9`) defines **13 linear milestones** at every 5-level step from `L1` to `L60` (`1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60`), whereas `abilities-catalog.json` defines **9 `"class": "ranger"` entries** (**C1–C9**):

| `gE.ranger` Level | Catalog `unlock` | `gE.ranger` ID | Catalog ID | EN Name (`i18n-en`) | PT-BR Name (`i18n-pt`) | `kind` (`ref` / `map`) | Catalog `mana` | EN & PT-BR Descriptions (`i18n-en-abilities.js:2496` / `i18n-pt-abilities.js:2473`) |
|---|---|---|---|---|---|---|---|---|
| **L1** | `1` (**C1**) | `ranger_arrow` | `ranger_arrow` | Arrow | Flecha | `Passive` (`map: "UO"`) | `0` | EN: *"Automatic bow shot — does not need a hotbar slot."* / PT: *"Disparo automático do arco — não precisa de slot na hotbar."* |
| **L5** | `5` (**C2**) | `ranger_rapid_shot` | `ranger_rapid_shot` | Rapid Shot | Tiro Rápido | `WeaponAbility` (`ref: 22`, `FrenziedWhirlwind`) | `14` | EN: *"Rapid volley of arrows."* / PT: *"Rajada rápida de flechas."* |
| **L10** | `10` (**C3**) | `ranger_aimed_shot` | `ranger_aimed_shot` | Aimed Shot | Tiro Preciso | `WeaponAbility` (`ref: 11`, `ParalyzingBlow`) | `12` | EN: *"Aimed shot — more damage, a bit slower."* / PT: *"Tiro mirado — mais dano, um pouco mais lento."* |
| **L15** *(gE-only)* | *Absent* | `ranger_force_arrow` | — | *(Force Arrow)* | *(Flecha de Impacto)* | *Unregistered in catalog* | — | Present in `gE.ranger` at `L15` (`[[progression-unlocks]] C9`), absent from `abilities-catalog.json` and `ab.name` (`i18n-en-abilities.js:2496`). |
| **L20** | `20` (**C4**) | `ranger_piercing` | `ranger_piercing` | Piercing Arrow | Flecha Perfurante | `WeaponAbility` (`ref: 1`, `ArmorIgnore`) | `12` | EN: *"Piercing arrow — punches through armor."* / PT: *"Flecha perfurante — atravessa armadura."* |
| **L25** *(gE-only)* | *Absent* | `ranger_serpent_arrow` | — | *(Serpent Arrow)* | *(Flecha Serpente)* | *Unregistered in catalog* | — | Present in `gE.ranger` at `L25` (`[[progression-unlocks]] C9`), absent from `abilities-catalog.json`. |
| **L30** | `30` (**C5**) | `ranger_moving_shot` | `ranger_moving_shot` | Moving Shot | Tiro em Movimento | `WeaponAbility` (`ref: 10`, `MovingShot`) | `12` | EN: *"Moving shot — keep kiting while you attack."* / PT: *"Tiro em movimento — mantém distância enquanto ataca."* |
| **L35** *(gE-only)* | *Absent* | `ranger_lightning_arrow` | — | *(Lightning Arrow)* | *(Flecha Relâmpago)* | *Unregistered in catalog* | — | Present in `gE.ranger` at `L35` (`[[progression-unlocks]] C9`), absent from `abilities-catalog.json`. |
| **L40** | `40` (**C6**) | `ranger_multishot` | `ranger_multishot` | Multishot | Multitiro | `Custom` (`map: "New"`) | `16` | EN: *"Fire several arrows at once."* / PT: *"Dispara várias flechas de uma vez."* |
| **L45** *(gE-only)* | *Absent* | `ranger_armor_pierce` | — | *(Armor Pierce)* | *(Perfurar Armadura)* | *Unregistered in catalog* | — | Present in `gE.ranger` at `L45` (`[[progression-unlocks]] C9`), absent from `abilities-catalog.json`. |
| **L50** *(Aliased)* | `50` (**C7**) | `ranger_charged_shot` | `ranger_charged_shot_r2` | Charged Shot | *(Tiro Carregado)* | `WeaponAbility` (`ref: 1`, `ArmorIgnore`) | `14` | Reconciled in hotbar normalizer `cr(e)` via `ranger_charged_shot_r2: 'ranger_charged_shot'` (`[[tick-and-cooldowns]] C10`). |
| **L55** *(Drift)* | `100` (**C9**) | `ranger_deadeye` | `ranger_deadeye` | Deadeye | Olho de Águia | `Custom` (`map: "New"`) | `25` | EN: *"Deadeye shot on wounded targets."* / PT: *"Tiro certeiro em alvos feridos."* |
| **L60** | `60` (**C8**) | `ranger_bolt_volley` | `ranger_bolt_volley` | Bolt Volley | Rajada | `Custom` (`map: "New"`) | `16` | EN: *"Bolt/arrow volley across several targets."* / PT: *"Saraivada de virotes / flechas em vários alvos."* |

### Three Categories of Ranger Client-vs-Catalog Drift

1. **Four `gE.ranger`-Only Arrow Nodes (`L15, L25, L35, L45`):**
   - `gE.ranger` (`[[progression-unlocks]] C9`) lists `['ranger_force_arrow', 15]`, `['ranger_serpent_arrow', 25]`, `['ranger_lightning_arrow', 35]`, and `['ranger_armor_pierce', 45]`.
   - None of these four IDs exist in `abilities-catalog.json` (`raw L567-L684`), so they never appear in the hotbar ability picker `Uw(e, a)` (`[[tick-and-cooldowns]] C3`).
2. **The `ranger_charged_shot_r2` $\leftrightarrow$ `ranger_charged_shot` Alias (`L50`, **C7**):**
   - `gE.ranger` at `L50` uses ID `'ranger_charged_shot'`, whereas `abilities-catalog.json` (**C7**) defines `"id": "ranger_charged_shot_r2"`, `"name": "Charged Shot"`, `"unlock": 50`, `"ref": 1`.
   - The hotbar slot serializer `cr(e)` in `_raw/bundle/abilities-loader-and-hotbar.js:864-873` explicitly normalizes `ranger_charged_shot_r2: 'ranger_charged_shot'` (`[[tick-and-cooldowns]] C10`) before sending `[IdleHotbar` to the server.
3. **The `ranger_deadeye` Unlock Level Mismatch (`L55` vs `unlock: 100`, **C9**):**
   - `gE.ranger` places `ranger_deadeye` at `L55` (`['ranger_deadeye', 55]`, `[[progression-unlocks]] C9`), whereas `abilities-catalog.json` (**C9**) sets `"unlock": 100, "blurb": "Unlocks at level 100."`.
   - Because `Uw(e, a)` filters the hotbar picker using `s.unlock > a.level` when `includeLocked === false` (`[[tick-and-cooldowns]] C3`), `ranger_deadeye` remains locked in the hotbar ability selector until character level `100` unless `includeLocked` is enabled.

## Dispatch Kinds, Scaling Formulas & Combat Mechanics

### 1. Passive Auto-Attack Loop (`ranger_arrow`, **C1**)

- `ranger_arrow` (**C1**) has `"kind": "Passive"`, is excluded from hotbar selection by `Uw` and `Yw` (`[[tick-and-cooldowns]] C3`, `[[tick-and-cooldowns]] C8`), and displays `hotbar.autoAttackCd` via `Sg(e, a)` (`[[damage-and-defense]] C2`).
- Bow and crossbow auto-attacks scale with weapon dice, `STR`, `DEX`, `Archery` (`skill 31`), `Tactics` (`skill 27`), `Anatomy` (`skill 1`), and the server physical level multiplier **`×60` per level** (`[[resources]] C1`).

### 2. Ranged `WeaponAbility` Dispatch (`C2`, `C3`, `C4`, `C5`, `C7`)

Five of the nine Ranger catalog entries dispatch directly to standard Ultima Online `WeaponAbility` indices (`[[status-effects]]`):

| Ability ID | Catalog `unlock` | `ref` ID | UO `WeaponAbility` | Combat Behavior |
|---|---|---|---|---|
| `ranger_rapid_shot` (**C2**) | `5` | `22` | `FrenziedWhirlwind` | Rapid multi-arrow burst (`mana: 14`) |
| `ranger_aimed_shot` (**C3**) | `10` | `11` | `ParalyzingBlow` | High-accuracy shot + **Paralyze crowd control** (`mana: 12`) |
| `ranger_piercing` (**C4**) | `20` | `1` | `ArmorIgnore` | Bypasses target physical armor (`mana: 12`) |
| `ranger_moving_shot` (**C5**) | `30` | `10` | `MovingShot` | Mobile shot while kiting (`mana: 12`) |
| `ranger_charged_shot_r2` (**C7**) | `50` | `1` | `ArmorIgnore` | Rank II armor-ignoring shot (`mana: 14`, aliased to `ranger_charged_shot` per `[[tick-and-cooldowns]] C10`) |

### 3. Client Multi-Hit Volley Estimator (`Cq` for `multishot` and `bolt_volley`, **C6**, **C8**)

For `ranger_multishot` (**C6**) and `ranger_bolt_volley` (**C8**), the client fallback estimator `Cq(e, a, n)` (`[[damage-and-defense]] C8`) evaluates the `e.includes('multishot') || e.includes('bolt_volley')` branch:
- **Hit Count (`hits`):** $s = 2 + n$ (`3` hits at Rank 1, `4` hits at `_r2`).
- **Damage per Hit (`min` / `max`):** $o = 10 + 5n$ (`15` per hit at Rank 1, `20` per hit at `_r2`).
- **Total Volley Average (`avg`):** $o \times s = (10 + 5n)(2 + n)$ (`45` total at Rank 1, `80` total at `_r2`).
- **2-Second Custom Cooldown Floor (`[[resources]] C14`):** All three Ranger `"Custom"` entries (`ranger_multishot` **C6**, `ranger_bolt_volley` **C8**, `ranger_deadeye` **C9**) enforce the server's `#HABINFO` cooldown with a **2-second minimum floor**.

## Ammunition, Stamina & Resource Economy

- **Arrows & Bolts Supply Tracking (`[[resources]] C21`):** Ranger starts with both `bowArrows` and `crossbowBolts` in `mx.ranger` (`[[progression-unlocks]] C13`). The server broadcasts live arrow and bolt counts via `#SUPPLY` in response to `[supply` (`[[engine-capability-matrix]] C12`, `[[engine-capability-matrix]] C17`). If ammunition is exhausted and the bot's out-of-ammo exit toggle is active, the character automatically leaves the dungeon (`[[resources]]`).
- **Mana, Stamina & Bandage Sustain:** Unlike Warrior (whose abilities are zero-mana and whose Meditation cap is `0` per `[[resources]] C15`, `[[resources]] C16`), Ranger retains normal mana expenditure (`12–25` mana across **C2–C9**) and seeds `lesser_mana_potion` in Slot `3` alongside `lesser_heal_potion` (`15%` Max HP), `bandage` (`wq(healing, anatomy)`), and `lesser_cure_potion` (`[[tick-and-cooldowns]] C11`).
