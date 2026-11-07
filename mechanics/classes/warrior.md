---
id: "warrior"
title: "Warrior Class Deep-Dive: Melee Tank, Weapon Abilities, and Stances"
category: "classes"
aliases: ["warrior", "guerreiro", "WR", "class-101"]
status: "bundle-stated"
sources: ["_raw/bundle/abilities-catalog.json", "_raw/bundle/skills-and-progression.js", "_raw/bundle/classes-config.js", "_raw/bundle/combat-estimators-and-hotbar.js", "_raw/bundle/i18n-en-abilities.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["bundle: _raw/bundle/skills-and-progression.js:68-238", "bundle: _raw/bundle/classes-config.js:5-56", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:85-93,413-453", "bundle: _raw/bundle/i18n-en-abilities.js:1780-1792,2473-2497", "wiki: _raw/wiki/changelog-server-dev.md:653-654,833"]
code_refs: ["abilities-catalog.json:warrior_*", "skills-and-progression.js:gE.warrior", "classes-config.js:ZC.warrior", "combat-estimators-and-hotbar.js:Cq"]
updated: "2026-11-07"
---
# Warrior Class Deep-Dive: Melee Tank, Weapon Abilities, and Stances

Source: [raw](../_raw/bundle/abilities-catalog.json)

## Summary

The Warrior is the foundational melee tank and physical bruiser of the starter class trio in UO Idle. Built around high base Strength, chainmail armor, and a sword-and-shield starter loadout, the Warrior pairs an automatic melee swing loop with ten level-gated class abilities spanning aggro control, shield stuns, physical armor shred, Ultima Online weapon abilities, damage-reduction stances, and a wounded-target execution finisher. On the authoritative server, Warrior abilities are exempt from mana expenditure and the class Meditation skill cap is permanently locked to zero, making Warrior sustain and ability rotation independent of mana pools or reagent supplies.

## Claims

- **C1** [bundle-stated] ""id": "warrior_slash", "class": "warrior", "kind": "Passive", "name": "Slash", "unlock": 1, "mana": 0, "blurb": "Unlocks at level 1.", "tab": "ability", "map": "UO", "gumpIcon": 20992, "iconKey": "gump_20992"" (raw L214-L224)
- **C2** [bundle-stated] ""id": "warrior_provoke", "class": "warrior", "kind": "Custom", "name": "Provocar", "unlock": 5, "mana": 10, "blurb": "Unlocks at level 5.", "tab": "ability", "map": "New", "iconKey": "idle_warrior_provoke"" (raw L227-L236)
- **C3** [bundle-stated] ""id": "warrior_shield_bash", "class": "warrior", "kind": "Custom", "name": "Shield Bash", "unlock": 5, "mana": 10, "blurb": "Unlocks at level 5.", "tab": "ability", "map": "New", "gumpIcon": 21007, "iconKey": "idle_warrior_shield_bash"" (raw L239-L249)
- **C4** [bundle-stated] ""id": "warrior_armor_break", "class": "warrior", "kind": "Custom", "name": "Armor Break", "unlock": 15, "mana": 15, "blurb": "Unlocks at level 15.", "tab": "ability", "map": "New", "gumpIcon": 21014, "iconKey": "idle_warrior_armor_break"" (raw L252-L262)
- **C5** [bundle-stated] ""id": "warrior_heavy_strike", "class": "warrior", "kind": "WeaponAbility", "name": "Heavy Strike", "unlock": 20, "mana": 12, "blurb": "Unlocks at level 20.", "tab": "ability", "ref": 4, "map": "UO", "gumpIcon": 20995, "iconKey": "gump_20995"" (raw L265-L276)
- **C6** [bundle-stated] ""id": "warrior_whirlwind", "class": "warrior", "kind": "WeaponAbility", "name": "Whirlwind", "unlock": 25, "mana": 10, "blurb": "Unlocks at level 25.", "tab": "ability", "ref": 13, "map": "UO", "gumpIcon": 21004, "iconKey": "gump_21004"" (raw L279-L290)
- **C7** [bundle-stated] ""id": "warrior_brace", "class": "warrior", "kind": "Custom", "name": "Brace", "unlock": 30, "mana": 10, "blurb": "Unlocks at level 30.", "tab": "ability", "map": "New/Eth", "gumpIcon": 21008, "iconKey": "idle_warrior_brace"" (raw L293-L303)
- **C8** [bundle-stated] ""id": "warrior_disarm", "class": "warrior", "kind": "WeaponAbility", "name": "Dirty Trick", "unlock": 40, "mana": 12, "blurb": "Unlocks at level 40.", "tab": "ability", "ref": 5, "map": "UO", "gumpIcon": 20996, "iconKey": "gump_20996"" (raw L306-L317)
- **C9** [bundle-stated] ""id": "warrior_bulwark", "class": "warrior", "kind": "Custom", "name": "Bulwark", "unlock": 50, "mana": 20, "blurb": "Unlocks at level 50.", "tab": "ability", "map": "New", "gumpIcon": 21008, "iconKey": "idle_warrior_bulwark"" (raw L320-L330)
- **C10** [bundle-stated] ""id": "warrior_execution", "class": "warrior", "kind": "Custom", "name": "Execution", "unlock": 60, "mana": 25, "blurb": "Unlocks at level 60.", "tab": "ability", "map": "New", "gumpIcon": 21000, "iconKey": "idle_warrior_execution"" (raw L333-L343)
- **C11** [bundle-stated] ""id": "bandage", "class": "*", "kind": "ItemUse", "name": "Bandage", "unlock": 1, "mana": 0, "blurb": "Self heal with bandages.", "tab": "item", "icon": 3617, "map": "UO"" (raw L5-L14)
- **C12** [bundle-stated] ""id": "lesser_heal_potion", "class": "*", "kind": "ItemUse", "name": "Lesser Heal Potion", "unlock": 1, "mana": 0, "blurb": "Drink a lesser heal potion.", "tab": "item", "icon": 3852, "map": "UO"" (raw L17-L26)

## Class Identity, Role, Starter Skills & Starter Kit

The Warrior (`warrior`) is the first entry in the starter class trio `Wj = ['warrior', 'ranger', 'mage']` (`_raw/bundle/classes-config.js:5-56`):

| Property | Value | Source / Cross-Link |
|---|---|---|
| **Class Key & Numeric ID** | `warrior` (`Kj.warrior = 101`, `QC[1] = 'warrior'`) | `_raw/bundle/classes-config.js:7,25` |
| **Two-Letter Badge & Robe Hue** | `e2.warrior = 'WR'`, `SE.warrior = 1816` | `_raw/bundle/classes-config.js:227`, `_raw/bundle/skills-and-progression.js:465` |
| **Role Classification** | `dx.warrior = 'melee'` | `[[progression-unlocks]] C3` |
| **Legacy Base Attributes (`ZC.warrior`)** | `STR: 60`, `DEX: 20`, `INT: 10` (`skills: [[40, 40], [27, 30], [1, 20], [5, 10]]`) | `_raw/bundle/classes-config.js:46-56` |
| **Starter Skill Grants (`hE.warrior`)** | `[40, 41, 42, 27, 1, 5, 17, 26, 50]` — `swords` (`50`), `macing` (`50`), `fencing` (`50`), `tactics` (`50`), `anatomy` (`50`), `parry` (`50`), `healing` (`50`), `magicResist` (`30`), `focus` (`50`) | `[[progression-unlocks]] C4`, `[[progression-unlocks]] C5` |
| **Starter Equipment Kit (`mx.warrior`)** | `['malha', 'longswordShield', 'bandages', 'potionsMelee', 'robeCloak']` (Chainmail set, Longsword + Shield, Bandages, Melee Potions, Robe & Cloak) | `[[progression-unlocks]] C13` |
| **Paperdoll Layers (`hx.warrior`)** | Chainmail (`mu()`: Helm `5051`, InnerTorso `5055`, Pants `5054`), Shoes `5899`, Shirt `7933`, OneHanded `3937` (Longsword), TwoHanded `7035` (Heater Shield), plus Robe `7939` and Cloak `5397` (`xE()`) | `_raw/bundle/skills-and-progression.js:252-279` |
| **Seeded Default Hotbar (`gh.warrior`)** | Slot `0`: `lesser_heal_potion` (`hp <= 50%`, **C12**), Slot `1`: `bandage` (`hp <= 80% OR poisoned == 1`, **C11**), Slot `2`: `lesser_cure_potion` (`poisoned == 1`), Slot `3`: `lesser_mana_potion` (`mana <= 30%`) | `[[tick-and-cooldowns]] C11` |

## Complete L1–60 Progression Table (`gE.warrior`) vs Catalog (`C1`–`C10`)

In Progression V3 (`[[progression-unlocks]] C6`), Warrior unlocks ten abilities linearly between Level `1` and Level `60`. Every `gE.warrior` entry maps 1-to-1 to a `"class": "warrior"` entry in `abilities-catalog.json` (**C1–C10**), with one unlock-level discrepancy on `warrior_shield_bash`:

| `gE.warrior` Level | Catalog `unlock` | Ability ID | EN Name (`i18n-en`) | PT-BR Name (`i18n-pt`) | `kind` (`ref` / `map`) | Catalog `mana` | Server Mana Cost | EN & PT-BR Descriptions (`i18n-en-abilities.js:2496` / `i18n-pt-abilities.js:2473`) |
|---|---|---|---|---|---|---|---|---|
| **L1** | `1` (**C1**) | `warrior_slash` | Slash | Corte | `Passive` (`map: "UO"`) | `0` | `0` | EN: *"Automatic weapon swing — not for the hotbar; you already attack on your own."* / PT: *"Ataque automático da arma — não vai na hotbar; o personagem já bate sozinho."* |
| **L5** | `5` (**C2**) | `warrior_provoke` | Provocar | Provocar | `Custom` (`map: "New"`) | `10` | `0` (`[[resources]] C15`) | Taunts enemy when an ally holds aggro (`ally_agro == 1`, `[[tick-and-cooldowns]] C7`). |
| **L10** *(Drift)* | `5` (**C3**) | `warrior_shield_bash` | Shield Bash | Escudada | `Custom` (`map: "New"`) | `10` | `0` (`[[resources]] C15`) | EN: *"Bash with your shield: stun/push the target. Requires a shield."* / PT: *"Bate com o escudo: atordoa / empurra o alvo. Exige escudo."* |
| **L15** | `15` (**C4**) | `warrior_armor_break` | Armor Break | Quebra-Armadura | `Custom` (`map: "New"`) | `15` | `0` (`[[resources]] C15`) | EN: *"Strike that weakens the enemy’s armor (best with mace)."* / PT: *"Golpe que enfraquece a armadura do inimigo (melhor com maça)."* |
| **L20** | `20` (**C5**) | `warrior_heavy_strike` | Heavy Strike | Golpe Pesado | `WeaponAbility` (`ref: 4`, `CrushingBlow`) | `12` | `0` (`[[resources]] C15`) | EN: *"Heavy weapon strike — high single-target damage."* / PT: *"Golpe pesado de arma — alto dano num único alvo."* |
| **L25** | `25` (**C6**) | `warrior_whirlwind` | Whirlwind | Redemoinho | `WeaponAbility` (`ref: 13`, `WhirlwindAttack`) | `10` | `0` (`[[resources]] C15`) | EN: *"Area attack around you — good vs several enemies."* / PT: *"Ataque em área à volta de ti — bom com vários inimigos."* |
| **L30** | `30` (**C7**) | `warrior_brace` | Brace | Aparar | `Custom` (`map: "New/Eth"`) | `10` | `0` (`[[resources]] C15`) | EN: *"Defensive stance: reduce damage taken for a while."* / PT: *"Postura defensiva: reduz dano recebido por um tempo."* |
| **L40** | `40` (**C8**) | `warrior_disarm` | Disarm (`Dirty Trick`) | Truque Sujo | `WeaponAbility` (`ref: 5`, `Disarm`) | `12` | `0` (`[[resources]] C15`) | EN: *"Tries to disarm the enemy for a few seconds."* / PT: *"Tenta desarmar o inimigo por alguns segundos."* |
| **L50** | `50` (**C9**) | `warrior_bulwark` | Bulwark | Baluarte | `Custom` (`map: "New"`) | `20` | `0` (`[[resources]] C15`) | EN: *"Fortify yourself with the shield — large damage reduction."* / PT: *"Fortifique-se com o escudo — grande redução de dano."* |
| **L60** | `60` (**C10**) | `warrior_execution` | Execution | Execução | `Custom` (`map: "New"`) | `25` | `0` (`[[resources]] C15`) | EN: *"Finishing blow on low-HP targets."* / PT: *"Golpe final em alvos com pouca vida."* |

### Catalog vs Progression Drift (`warrior_shield_bash`)

- In `abilities-catalog.json` (**C3**), `warrior_shield_bash` declares `"unlock": 5`, `"blurb": "Unlocks at level 5."` alongside `warrior_provoke` (**C2**).
- In `gE.warrior` (`[[progression-unlocks]] C6`), `warrior_provoke` is placed at `['warrior_provoke', 5]` while `warrior_shield_bash` is shifted to `['warrior_shield_bash', 10]` so the client progression UI displays one ability unlock every 5 levels from L1 to L30 (`1, 5, 10, 15, 20, 25, 30`) before stepping by 10 levels (`40, 50, 60`).

## Dispatch Kinds, Scaling Formulas & Combat Mechanics

### 1. Passive Auto-Attack Loop (`warrior_slash`, **C1**)

- `warrior_slash` (**C1**) has `"kind": "Passive"` and is shared across `warrior`, `berserker`, and `paladin` (`[[status-effects]] C1`).
- `Uw(e, a)` and `Yw(e)` filter `"Passive"` entries out of hotbar selection (`[[tick-and-cooldowns]] C3`, `[[tick-and-cooldowns]] C8`), and `Sg(e, a)` displays the localized auto-attack notice (`[[damage-and-defense]] C2`).
- Weapon swing damage scales with weapon base dice, `STR`, `Tactics` (`skill 27`), `Anatomy` (`skill 1`), item/tree `WeaponDamage` (cap `+100%`), and the server physical level multiplier **`×60` per level** (`[[resources]] C1`), mientras swing delay scales with Stamina (`DEX + Stamina`), gear `WeaponSpeed` (cap `60%`), and progression tree `Speed` (`[[damage-and-defense]]`).

### 2. Client Fallback Damage Estimators (`Cq(id, tactics, rank)`)

Before `#HABINFO` server telemetry arrives (`[[damage-and-defense]] C1`), the client combat estimator `Eq(e, a)` routes Warrior active offensive skills to `Cq(n, tactics, rank)` (`[[damage-and-defense]] C8`, `[[damage-and-defense]] C11`):

| Ability ID | `Cq` Branch | Client Fallback Damage Range (`rank = 1`, `tactics = a`) | Default Hotbar Trigger (`ro(e)`) |
|---|---|---|---|
| `warrior_shield_bash` (**C3**) | `e.includes('shield_bash')` | $\text{min} = 15 + \lfloor 0.15 \times \text{Tactics} \rfloor$, $\text{max} = \text{min} + 6$, $\text{avg} = \text{min} + 3$ | `[]` (fires on cooldown in combat) |
| `warrior_heavy_strike` (**C5**) | `e.includes('heavy_strike')` | $\text{min} = \max(1, 8 + \lfloor 0.25 \times \text{Tactics} \rfloor)$, $\text{max} = 20 + \lfloor 0.25 \times \text{Tactics} \rfloor$, $\text{avg} = 14 + \lfloor 0.25 \times \text{Tactics} \rfloor$ | `[]` (fires on cooldown in combat) |
| `warrior_execution` (**C10**) | `e.includes('execution')` | Flat $\lfloor 0.6 \times \text{Tactics} \rfloor + 20$ (`min == max == avg`) | `[]` (or user-configured enemy HP threshold) |
| `warrior_whirlwind` (**C6**) | Returns `null` in `Cq` (resolved via `#HABINFO`) | Server `WhirlwindAttack` (`ref: 13`) melee AoE around caster | `[zE(3)]` (`enemies >= 3`, `[[tick-and-cooldowns]] C5`, `[[tick-and-cooldowns]] C7`) |
| `warrior_provoke` (**C2**) | Non-damage taunt | Pulls monster aggro onto Warrior | `[{ target: 'self', attr: 'ally_agro', op: '==', value: 1 }]` (`[[tick-and-cooldowns]] C7`) |

### 3. Defensive Stances, Debuffs & Single-Application `AOS.Damage` Fix

- **Defensive Stances (`warrior_brace` **C7**, `warrior_bulwark` **C9**):** Temporarily reduce incoming physical damage (`[[status-effects]] C7`).
- **Physical Armor Shred (`warrior_armor_break` **C4**):** Weakens target physical defense (`[[status-effects]] C4`).
- **Server `AOS.Damage` Fix (`[[resources]] C17`):** Per `_raw/wiki/changelog-server-dev.md:833`, `Brace` and `Armor Break` were fixed on the server so they apply **only once inside `AOS.Damage`** rather than double-applying in both the weapon hit handler and `AOS.Damage`.
- **2-Second Custom Cooldown Floor (`[[resources]] C14`):** All six Warrior `"Custom"` abilities (`warrior_provoke`, `warrior_shield_bash`, `warrior_armor_break`, `warrior_brace`, `warrior_bulwark`, `warrior_execution`) omit a client-side `cooldownMs` property in `abilities-catalog.json` and therefore obey the server's `#HABINFO` cooldown with a hard **2-second minimum floor** (`Custom sem CD declarado usa piso de 2 s`).

## Server Resource Rules & Sustain Economy

1. **Zero-Mana Ability Rule (`[[resources]] C15`):** On the authoritative server (`_raw/wiki/changelog-server-dev.md:653`), all Warrior abilities—both `"Custom"` and `"WeaponAbility"`—cost **`0` mana** (`Abilities do guerreiro custam 0 mana (customs + WeaponAbility)`), overriding the nominal `10–25` `"mana"` values stored in `abilities-catalog.json` (**C2–C10**).
2. **Zero-Meditation Cap (`[[resources]] C16`):** Warrior `Meditation` (`skill 46`) is capped at **`0`** and reset to `0` on character creation and login (`Meditation cap 0 e zerada no login/create do guerreiro`, `_raw/wiki/changelog-server-dev.md:654`).
3. **Bandage & Potion Sustain (`C11`, `C12`):** Because Warrior has no spellbook heal, self-sustain relies on:
   - **Bandages (`bandage`, **C11**):** Scales with `Healing` (`skill 17`, starter `50`) and `Anatomy` (`skill 1`, starter `50`) via `wq(healing, anatomy)` (`[[damage-and-defense]] C6`), auto-triggered at `hp <= 80% OR poisoned == 1` (`[[tick-and-cooldowns]] C4`, `[[tick-and-cooldowns]] C6`).
   - **Heal Potions (`lesser_heal_potion` **C12**, `heal_potion`, `greater_heal_potion`):** Restore **`15% / 25% / 35%` of Max HP** on the server (`[[resources]] C10`) and follow their real potion cooldown (`[[resources]] C8`).
