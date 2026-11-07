---
id: "mage"
title: "Mage Class Deep-Dive: Elemental Magery, Summons, and Reagent Economy"
category: "classes"
aliases: ["mage", "mago", "MG", "class-103"]
status: "verified"
sources: ["_raw/bundle/abilities-catalog.json", "_raw/bundle/skills-and-progression.js", "_raw/bundle/classes-config.js", "_raw/bundle/combat-estimators-and-hotbar.js", "_raw/bundle/i18n-en-abilities.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/skills-and-progression.js:68-238", "bundle: _raw/bundle/classes-config.js:5-100", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:99-117,399-412,454-490", "bundle: _raw/bundle/i18n-en-abilities.js:1780-1792,2473-2497", "wiki: _raw/wiki/changelog-server-dev.md:17,109,499-500"]
code_refs: ["abilities-catalog.json:mage_*", "skills-and-progression.js:gE.mage", "classes-config.js:ZC.mage", "combat-estimators-and-hotbar.js:Aq", "combat-estimators-and-hotbar.js:Mq"]
updated: "2026-11-07"
---
# Mage Class Deep-Dive: Elemental Magery, Summons, and Reagent Economy

Source: [raw](../_raw/bundle/abilities-catalog.json)

## Summary

The Mage is the archetypal elemental spellcaster of the starter class trio in UO Idle. Built around high base Intelligence, leather armor, a caster staff, and a starter supply of Magery reagents and mana potions, the Mage combines direct single-target and area-of-effect elemental spells with percentage-based self and party healing, poison curing, spell reflection, and timed elemental summons. Unlike physical classes, the Mage benefits from the higher server spellcaster level power multiplier while managing both Mana and reagent consumption across active hunts. Comparing the client progression unlock table against the shared ability catalog also exposes several spell unlock-level shifts and a shared nature damage-over-time entry migrated to the Spellweaver progression tree.

## Claims

- **C1** [verified] ""id": "mage_magic_arrow", "class": "mage", "kind": "Spell", "name": "Magic Arrow", "unlock": 1, "mana": 5, "blurb": "Unlocks at level 1.", "tab": "spell", "ref": 4, "map": "UO", "gumpIcon": 2244, "iconKey": "gump_2244"" (raw L687-L698)
- **C2** [verified] ""id": "mage_harm", "class": "mage", "kind": "Spell", "name": "Harm", "unlock": 5, "mana": 8, "blurb": "Unlocks at level 5.", "tab": "spell", "ref": 11, "map": "UO", "gumpIcon": 2251, "iconKey": "gump_2251"" (raw L701-L712)
- **C3** [verified] ""id": "mage_fireball", "class": "mage", "kind": "Spell", "name": "Fireball", "unlock": 5, "mana": 12, "blurb": "Unlocks at level 5.", "tab": "spell", "ref": 17, "map": "UO", "gumpIcon": 2257, "iconKey": "gump_2257"" (raw L715-L726)
- **C4** [verified] ""id": "mage_heal", "class": "mage", "kind": "Spell", "name": "Heal", "unlock": 1, "mana": 5, "blurb": "Unlocks at level 1.", "tab": "spell", "ref": 3, "map": "UO", "gumpIcon": 2243, "iconKey": "gump_2243"" (raw L729-L740)
- **C5** [verified] ""id": "mage_cure", "class": "mage", "kind": "Spell", "name": "Cure", "unlock": 1, "mana": 8, "blurb": "Unlocks at level 1.", "tab": "spell", "ref": 10, "map": "UO", "gumpIcon": 2250, "iconKey": "gump_2250"" (raw L743-L754)
- **C6** [verified] ""id": "mage_lightning", "class": "mage", "kind": "Spell", "name": "Lightning", "unlock": 15, "mana": 14, "blurb": "Unlocks at level 15.", "tab": "spell", "ref": 29, "map": "UO", "gumpIcon": 2269, "iconKey": "gump_2269"" (raw L757-L768)
- **C7** [verified] ""id": "mage_energy_bolt", "class": "mage", "kind": "Spell", "name": "Energy Bolt", "unlock": 20, "mana": 25, "blurb": "Unlocks at level 20.", "tab": "spell", "ref": 41, "map": "UO", "gumpIcon": 2281, "iconKey": "gump_2281"" (raw L771-L782)
- **C8** [verified] ""id": "mage_magic_reflect", "class": "mage", "kind": "Custom", "name": "Magic Reflect", "unlock": 25, "mana": 14, "blurb": "Unlocks at level 25.", "tab": "ability", "map": "Idle"" (raw L785-L793)
- **C9** [verified] ""id": "mage_flamestrike", "class": "mage", "kind": "Spell", "name": "Flame Strike", "unlock": 30, "mana": 40, "blurb": "Unlocks at level 30.", "tab": "spell", "ref": 50, "map": "UO", "gumpIcon": 2290, "iconKey": "gump_2290"" (raw L796-L807)
- **C10** [verified] ""id": "mage_chain_lightning", "class": "mage", "kind": "Custom", "name": "Chain Lightning", "unlock": 35, "mana": 26, "blurb": "Unlocks at level 35.", "tab": "ability", "map": "New", "iconKey": "gump_2281"" (raw L810-L819)
- **C11** [verified] ""id": "mage_explosion", "class": "mage", "kind": "Spell", "name": "Explosion", "unlock": 40, "mana": 28, "blurb": "Unlocks at level 40.", "tab": "spell", "ref": 42, "map": "UO", "gumpIcon": 2282, "iconKey": "gump_2282"" (raw L822-L833)
- **C12** [verified] ""id": "mage_nature_fury", "class": "mage", "kind": "Custom", "name": "Nature's Fury", "unlock": 45, "mana": 24, "blurb": "Unlocks at level 45.", "tab": "ability", "map": "Idle"" (raw L836-L844)
- **C13** [verified] ""id": "mage_fire_elemental", "class": "mage", "kind": "Custom", "name": "Fire Elemental", "unlock": 50, "mana": 40, "blurb": "Unlocks at level 50.", "tab": "ability", "map": "Idle", "iconKey": "gump_2290"" (raw L847-L856)
- **C14** [verified] ""id": "mage_air_elemental", "class": "mage", "kind": "Custom", "name": "Air Elemental", "unlock": 55, "mana": 40, "blurb": "Unlocks at level 55.", "tab": "ability", "map": "Idle", "iconKey": "gump_2269"" (raw L859-L868)
- **C15** [verified] ""id": "mage_meteor", "class": "mage", "kind": "Custom", "name": "Meteor Swarm", "unlock": 60, "mana": 40, "blurb": "Unlocks at level 60.", "tab": "ability", "map": "Idle"" (raw L871-L879)

## Class Identity, Role, Starter Skills & Starter Kit

The Mage (`mage`) is the primary spellcaster of the starter class trio `Wj = ['warrior', 'ranger', 'mage']` (`_raw/bundle/classes-config.js:5-100`):

| Property | Value | Source / Cross-Link |
|---|---|---|
| **Class Key & Numeric ID** | `mage` (`Kj.mage = 103`, `QC[3] = 'mage'`) | `_raw/bundle/classes-config.js:9,27` |
| **Two-Letter Badge & Robe Hue** | `e2.mage = 'MG'`, `SE.mage = 1253` | `_raw/bundle/classes-config.js:229`, `_raw/bundle/skills-and-progression.js:467` |
| **Role Classification** | `dx.mage = 'magic'` | `[[progression-unlocks]] C3` |
| **Legacy Base Attributes (`ZC.mage`)** | `STR: 20`, `DEX: 20`, `INT: 50` (`skills: [[25, 40], [16, 30], [46, 20], [26, 10]]`) | `_raw/bundle/classes-config.js:90-100` |
| **Starter Skill Grants (`hE.mage`)** | `[25, 16, 46, 41, 27, 1, 26, 50]` — `magery` (`50`), `evalInt` (`50`), `meditation` (`50`), `macing` (`50`), `tactics` (`50`), `anatomy` (`50`), `magicResist` (`30`), `focus` (`50`) | `[[progression-unlocks]] C4`, `[[progression-unlocks]] C5` |
| **Starter Equipment Kit (`mx.mage`)** | `['leather', 'casterStaff', 'reagents300', 'potionsCaster', 'robeCloak']` (Leather armor set, Caster Staff, `300` of each Magery reagent, Caster Potions, Robe & Cloak) | `[[progression-unlocks]] C13` |
| **Paperdoll Layers (`hx.mage`)** | Leather (`Vo()` minus Helm), Wizard Hat (`Helm 5912`, `softHat: true`), Shirt `7933`, Shoes `5901`, TwoHanded `5112` (Gnarled Staff), plus Robe `7939` and Cloak `5397` (`xE()`) | `_raw/bundle/skills-and-progression.js:300-306` |
| **Seeded Default Hotbar (`gh.mage`)** | Slot `0`: `lesser_heal_potion` (`hp <= 50%`), Slot `1`: `mage_heal` (`self/ally hp <= 50%`, **C4**), Slot `2`: `mage_cure` (`self/ally poisoned == 1`, **C5**), Slot `3`: `mage_magic_arrow` (`[]`, **C1**), Slot `4`: `lesser_mana_potion` (`mana <= 30%`) | `[[tick-and-cooldowns]] C11` |

## Complete L1–60 Progression Table (`gE.mage`) vs Catalog (`C1`–`C15`)

`gE.mage` (`[[progression-unlocks]] C10`) defines **14 unlock entries across 12 level brackets** (`L1` grants three starter spells simultaneously; `L20` has no entry in `gE.mage`), whereas `abilities-catalog.json` defines **15 `"class": "mage"` entries** (**C1–C15**):

| `gE.mage` Level | Catalog `unlock` | Ability ID | EN Name (`i18n-en`) | PT-BR Name (`i18n-pt`) | `kind` (`ref` / `map`) | Catalog `mana` | EN & PT-BR Descriptions (`i18n-en-abilities.js:2496` / `i18n-pt-abilities.js:2473`) |
|---|---|---|---|---|---|---|---|
| **L1** | `1` (**C4**) | `mage_heal` | Heal | Curar | `Spell` (`ref: 3`, `map: "UO"`) | `5` | EN: *"Heal — light magical healing."* / PT: *"Heal — cura mágica leve."* |
| **L1** | `1` (**C5**) | `mage_cure` | Cure | Antídoto | `Spell` (`ref: 10`, `map: "UO"`) | `8` | EN: *"Cure — remove poison with magic."* / PT: *"Cure — remove veneno com magia."* |
| **L1** | `1` (**C1**) | `mage_magic_arrow` | Magic Arrow | Flecha Mágica | `Spell` (`ref: 4`, `map: "UO"`) | `5` | EN: *"Magic arrow — basic offensive spell (has a cooldown)."* / PT: *"Flecha mágica — magia ofensiva básica (tem recarga)."* |
| **L5** | `5` (**C2**) | `mage_harm` | Harm | Prejudicar | `Spell` (`ref: 11`, `map: "UO"`) | `8` | EN: *"Harm — short-range magic damage."* / PT: *"Harm — dano mágico a curta distância."* |
| **L10** *(Drift)* | `5` (**C3**) | `mage_fireball` | Fireball | Bola de Fogo | `Spell` (`ref: 17`, `map: "UO"`) | `12` | EN: *"Fireball — fire projectile with good range."* / PT: *"Bola de fogo — projétil de fogo com bom alcance."* |
| **L15** | `15` (**C6**) | `mage_lightning` | Lightning | Raio | `Spell` (`ref: 29`, `map: "UO"`) | `14` | EN: *"Lightning — instant electrical damage."* / PT: *"Relâmpago — dano elétrico instantâneo."* |
| **L25** | `25` (**C8**) | `mage_magic_reflect` | Magic Reflect | *(Reflexo Mágico)* | `Custom` (`map: "Idle"`) | `14` | Reflects incoming spell damage; shared at `L25` across `mage`, `necromancer`, and `spellweaver` (`[[progression-unlocks]] C10`–`[[progression-unlocks]] C12`). |
| **L30** *(Drift)* | `20` (**C7**) | `mage_energy_bolt` | Energy Bolt | Raio de Energia | `Spell` (`ref: 41`, `map: "UO"`) | `25` | EN: *"Energy Bolt — powerful energy missile."* / PT: *"Energy Bolt — projétil de energia poderoso."* |
| **L35** *(Drift)* | `40` (**C11**) | `mage_explosion` | Explosion | Explosão | `Spell` (`ref: 42`, `map: "UO"`) | `28` | EN: *"Explosion — delayed blast on the target."* / PT: *"Explosion — atraso e depois estoura no alvo."* |
| **L40** *(Drift)* | `35` (**C10**) | `mage_chain_lightning` | Chain Lightning | *(Relâmpago em Cadeia)* | `Custom` (`map: "New"`) | `26` | Lightning cleave jumping to nearby enemies (`[[damage-and-defense]] C8`, `[[damage-and-defense]] C9`). |
| **L45** *(Drift)* | `30` (**C9**) | `mage_flamestrike` | Flame Strike | Chuva de Fogo | `Spell` (`ref: 50`, `map: "UO"`) | `40` | EN: *"Flame Strike — high-damage pillar of fire."* / PT: *"Flame Strike — magia de fogo de alto dano."* |
| *(`gE.spellweaver` L50)* | `45` (**C12**) | `mage_nature_fury` | Nature's Fury | *(Fúria da Natureza)* | `Custom` (`map: "Idle"`) | `24` | Tagged `"class": "mage"` at `unlock: 45` (**C12**) and duplicated under `"class": "spellweaver"` at `unlock: 50` (`abilities-catalog.json:1198-1207`); only `gE.spellweaver` includes it at `L50` (`[[progression-unlocks]] C12`). |
| **L50** | `50` (**C13**) | `mage_fire_elemental` | Fire Elemental | Elemental de Fogo | `Custom` (`map: "Idle"`) | `40` | EN: *"Fire Elemental (Idle) — weak fire summon, 90s."* / PT: *"Fire Elemental (Idle) — summon fraco de fogo, 90s."* |
| **L55** | `55` (**C14**) | `mage_air_elemental` | Air Elemental | Elemental de Ar | `Custom` (`map: "Idle"`) | `40` | EN: *"Air Elemental (Idle) — weak air summon, 90s."* / PT: *"Air Elemental (Idle) — summon fraco de ar, 90s."* |
| **L60** | `60` (**C15**) | `mage_meteor` | Meteor Swarm | *(Chuva de Meteoros)* | `Custom` (`map: "Idle"`) | `40` | Capstone area-of-effect fire/meteor bombardment (`GE` AoE pattern `enemies >= 3`, `[[tick-and-cooldowns]] C5`). |

### Catalog vs Progression Drift Summary

1. **Five Unlock-Level Shifts (`gE.mage` vs `abilities-catalog.json`):**
   - `mage_fireball` (**C3**): Catalog `unlock: 5` $\rightarrow$ `gE.mage` `L10` (`[[progression-unlocks]] C10`).
   - `mage_energy_bolt` (**C7**): Catalog `unlock: 20` $\rightarrow$ `gE.mage` `L30` (leaving `L20` empty in `gE.mage`).
   - `mage_flamestrike` (**C9**): Catalog `unlock: 30` $\rightarrow$ `gE.mage` `L45`.
   - `mage_chain_lightning` (**C10**): Catalog `unlock: 35` $\rightarrow$ `gE.mage` `L40`.
   - `mage_explosion` (**C11**): Catalog `unlock: 40` $\rightarrow$ `gE.mage` `L35`.
   - **Runtime Impact:** While the Progression UI (`gE.mage`) displays the `gE` milestone levels, the hotbar eligibility filter `Uw(e, a)` checks `s.unlock > a.level` against `abilities-catalog.json` (`[[tick-and-cooldowns]] C3`).
2. **`mage_nature_fury` (**C12**) Cross-Class Migration:**
   - `abilities-catalog.json` contains two entries with `"id": "mage_nature_fury"`: one under `"class": "mage"` (`unlock: 45`, **C12**) and a second under `"class": "spellweaver"` (`unlock: 50`, `raw L1198-L1207`). Because `PE(Fr)` indexes `tb` by `id` in catalog order (`[[tick-and-cooldowns]] C2`), the second entry overwrites the first in `tb`, and in `gE` it appears exclusively in `gE.spellweaver` at `L50` (`[[progression-unlocks]] C12`).

## Client Spell Estimators (`Mq`, `Aq`, `Nq`, `Cq`) vs Server Scaling

### 1. Client Offensive Spell Estimator (`Aq(id, magery, evalInt)`, `[[damage-and-defense]] C9`, `[[damage-and-defense]] C10`)

For `"kind": "Spell"` offensive spells, `Eq(e, a)` computes composite skill $s = 0.5 \times \text{Magery} + 0.3 \times \text{EvalInt}$ and multiplies the base range by school multiplier $o = Mq(\text{id})$:

| Spell ID | `ref` (UO SpellID) | School Multiplier $o = Mq(\text{id})$ | Pre-Multiplier Base Range | Client Range at Starter Skills (`Magery 50, EvalInt 50` $\Rightarrow s = 40$) | Client Range at Cap (`Magery 100, EvalInt 100` $\Rightarrow s = 80$) |
|---|---|---|---|---|---|
| `mage_magic_arrow` (**C1**) | `4` (Circle 1) | `2.1` | $[3 + 0.05s,\; 8 + 0.08s]$ | $[10, 24]$ (`avg 17`) | $[14, 31]$ (`avg 23`) |
| `mage_harm` (**C2**) | `11` (Circle 2) | `2.0` | $[6 + 0.08s,\; 14 + 0.12s]$ | $[18, 38]$ (`avg 28`) | $[24, 48]$ (`avg 36`) |
| `mage_fireball` (**C3**) | `17` (Circle 3) | `1.85` | $[10 + 0.10s,\; 20 + 0.15s]$ | $[25, 49]$ (`avg 37`) | $[33, 60]$ (`avg 47`) |
| `mage_lightning` (**C6**) | `29` (Circle 4) | `1.65` | $[14 + 0.12s,\; 28 + 0.18s]$ | $[31, 59]$ (`avg 45`) | $[38, 70]$ (`avg 54`) |
| `mage_energy_bolt` (**C7**) | `41` (Circle 6) | `1.75` | $[14 + 0.12s,\; 28 + 0.18s]$ | $[32, 62]$ (`avg 47`) | $[41, 75]$ (`avg 58`) |
| `mage_explosion` (**C11**) | `42` (Circle 6) | `1.75` | $[20 + 0.15s,\; 40 + 0.22s]$ | $[45, 86]$ (`avg 66`) | $[56, 101]$ (`avg 79`) |
| `mage_flamestrike` (**C9**) | `50` (Circle 7) | `1.6` | $[20 + 0.15s,\; 40 + 0.22s]$ | $[41, 79]$ (`avg 60`) | $[51, 93]$ (`avg 72`) |

### 2. Custom Mage Abilities (`mage_chain_lightning`, `mage_magic_reflect`, Elementals, `mage_meteor`)

- **`mage_chain_lightning` (**C10**):** Marked `"kind": "Custom"`, so `Eq` skips `Aq` and falls through to `Cq(n, tactics, rank)` (`[[damage-and-defense]] C8`, `[[damage-and-defense]] C11`), which returns a cleave range of $[19, 27]$ (`avg 23`, `splash: 9`) at Rank 1 until `#HABINFO` overrides it. Matches the `GE` AoE regex (`chain`), seeding default condition `[zE(3)]` (`enemies >= 3`, `[[tick-and-cooldowns]] C5`, `[[tick-and-cooldowns]] C7`).
- **`mage_fire_elemental` (**C13**) & `mage_air_elemental` (**C14**):** Custom Idle summons (`map: "Idle"`) that persist for **90 seconds** and are automatically despawned when leaving a hunt (`[[resources]] C19`).
- **`mage_meteor` (**C15**):** Level `60` capstone AoE (`map: "Idle"`, `mana: 40`), matched by `GE` (`meteor`) for default trigger `[zE(3)]` (`enemies >= 3`, `[[tick-and-cooldowns]] C5`).
- **2-Second Custom Cooldown Floor (`[[resources]] C14`):** All six Mage `"Custom"` entries (**C8, C10, C12–C15**) obey the server's `#HABINFO` cooldown with a **2-second minimum floor**.

### 3. Server Level Power Multiplier & Percentage Heal Override

- **Spellcaster Level Power Multiplier (`×80`, `[[resources]] C1`):** On the authoritative server, spellcasters (`mage`, `necromancer`, `spellweaver`) scale outgoing damage by **`×80` power per level** (`casters ×80`), higher than the `×60` physical multiplier. Spell damage also scales with `INT`, `EvalInt` (`skill 16`), and item/tree `SpellDamage` (`SDI`, hard cap `+50%`, `[[damage-and-defense]]`).
- **Server Healing Override (`15% / 35%` Max HP, `[[resources]] C11`):** Although the client estimator `Nq(magery)` (**C4**) estimates `mage_heal` as $[\lfloor \text{Magery}/12 + 1 \rfloor, \lceil \text{Magery}/12 + 4 \rceil]$ (`[[damage-and-defense]] C7`), the authoritative server resolves `Heal` (`mage_heal`) as **`15%` of target Max HP** and `Greater Heal` as **`35%` of target Max HP**, with heals exempt from level `DamageFactor` (`[[resources]] C1`, `[[resources]] C11`).

## Mana, Meditation & Reagent Economy

- **Mana Pool & Regeneration (`[[resources]]`):** Base Mana equals `INT + Mana + BonusMana` (starting at `INT 50`). Passive mana recovery is driven by `Meditation` (`skill 46`, starter `50`) in leather/cloth armor, supplemented by `RegenMana`, `LowerManaCost` (hard cap `+40%`), and mana potions (`15% / 25% / 35%` Max Mana per `[[resources]] C10`).
- **Reagent Consumption & `#SUPPLY` (`[[resources]] C21`):** Mage spells consume standard Magery reagents (`blackPearl`, `bloodMoss`, `garlic`, `ginseng`, `mandrake`, `nightshade`, `sulfurousAsh`, `spidersSilk`) from the character's starter `reagents300` pack (`[[progression-unlocks]] C13`). The client polls `[supply` $\rightarrow$ `#SUPPLY` (`[[engine-capability-matrix]] C12`, `[[engine-capability-matrix]] C17`) and skips any hotbar slot lacking reagents or mana without stalling the hunt loop (`[[resources]] C8`).
