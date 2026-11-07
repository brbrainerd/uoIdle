---
id: "resources"
title: "Combat Resources, Sustain, and Hunting Energy"
category: "combat"
aliases: ["hp", "mana", "stamina", "hunting-energy", "potions", "meditation", "focus"]
status: "verified"
sources: ["_raw/wiki/changelog-server-dev.md", "_raw/bundle/i18n-en-abilities.js", "_raw/bundle/combat-estimators-and-hotbar.js", "_raw/bundle/progression-tree-ui.js"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/i18n-en-abilities.js:2616", "bundle: _raw/bundle/combat-estimators-and-hotbar.js:99-117", "bundle: _raw/bundle/progression-tree-ui.js:35"]
code_refs: ["changelog-server-dev.md:L17-L1051", "combat-estimators-and-hotbar.js:ok", "progression-tree-ui.js:HI"]
updated: "2026-11-07"
---
# Combat Resources, Sustain, and Hunting Energy

Source: [raw](../_raw/wiki/changelog-server-dev.md)

## Summary

UO Idle governs character survivability and skill throughput through three combat vital pools—Health, Mana, and Stamina—paired with an account-persisted Hunting Energy pool that bounds active and offline dungeon farming. Vital capacities scale from primary attributes (Strength, Intelligence, and Dexterity) and flat progression tree vital purchases, while passive recovery depends on Focus, Meditation, and equipment regeneration affixes. Unlike fixed-point client tooltip approximations, the authoritative server scales healing and mana potions as well as Magery healing spells as fixed percentages of maximum pool size. Class-specific resource overrides exempt Warrior weapon and custom abilities from mana costs while locking Warrior Meditation to zero, and route Paladin Chivalry tithe costs directly to character gold per point spent.

## Claims

- **C1** [verified] "- Poder por nível **invertido** vs Ethernul: casters ×80, físico ×60 (cura sem DamageFactor)." (raw L17-L17)
- **C2** [verified] "- Escada de equipamentos: cada metal, madeira e couro pede um nível — metais aos pares (1, 20, 40, 60, 80, Avarite 100), couros 1, 20, 40 e 80. Cada degrau dá +12% de durabilidade e resistência na armadura e +8% de dano na arma. O material básico sai só por ouro." (raw L58-L58)
- **C3** [verified] "- Reparo de armas e armaduras no Ferreiro, no Artesão e no Alfaiate: custa 40% do preço da peça, e cada reparo tira 10% da durabilidade máxima." (raw L60-L60)
- **C4** [verified] "- Recarga de energia de +1 h, +4 h ou completa (cada uma conta como uma das 4 recargas do dia)." (raw L63-L63)
- **C5** [verified] "- Recarga de energia mais cara: 10 gp × nível × minutos que faltam × nº da recarga do dia." (raw L147-L147)
- **C6** [verified] "- Tempos em degraus de 5s: Trivial 50s · Fácil 45s · Médio 40s · Desafiador 35s · Difícil 30s · Pesadelo 25s · Inferno 20s." (raw L209-L209)
- **C7** [verified] "- Energia a zero encerra a caça no mesmo tick (sem farm “de graça” depois do HUD zerar), com avisos no chat (~36 min / ~7 min / acabou)." (raw L215-L215)
- **C8** [verified] "- Hotbar: gap das poções segue o CD real (não 400 ms); sem pot/bandagem/reags/mana o bot nem tenta o slot (não trava o farm); slot sem condição extra usa a regra base do catálogo (ex. em combate / cura)." (raw L217-L217)
- **C9** [verified] "- Paragon com 0,1% de chance em todos os níveis (era 0,01%)" (raw L370-L370)
- **C10** [verified] "- Poções de cura e mana: **15% / 25% / 35%** da vida/mana máxima (lesser / normal / greater)" (raw L499-L499)
- **C11** [verified] "- Magias Heal / Greater Heal Idle: **15% / 35%** da vida máxima do alvo" (raw L500-L500)
- **C12** [verified] "- Paladino Idle: Chivalry gasta ouro da conta **1 gp por ponto** (sem refill fantasma de 10k)" (raw L502-L502)
- **C13** [verified] "- A energia volta fora da caça, online ou offline (12 h do zero ao cheio)" (raw L568-L568)
- **C14** [verified] "- HabInfo: passives fora da lista; Custom sem CD declarado usa piso de 2 s" (raw L603-L603)
- **C15** [verified] "- Abilities do guerreiro custam 0 mana (customs + WeaponAbility)" (raw L653-L653)
- **C16** [verified] "- Meditation cap 0 e zerada no login/create do guerreiro" (raw L654-L654)
- **C17** [verified] "- Brace / Armor Break deixam de aplicar duas vezes (só em `AOS.Damage`)" (raw L833-L833)
- **C18** [verified] "- Níveis do bestiário: cada bicho comum tem 5 metas de abates (500 a 10.000), e cada meta dá +0,2% de XP permanente" (raw L1051-L1051)
- **C19** [verified] "- Mago: Necro (Strangle, Animate Dead, Lich 90s), Cleric (Bless, Arch Protection, Thunderstorm), elementais de Fogo/Ar (90s); summons limpam ao sair da caça." (raw L109-L109)
- **C20** [verified] "- Spellweaving gasta reagentes (livro + Gift of Renewal / Nature's Fury Idle)." (raw L12-L12)
- **C21** [verified] "- Contagens de reagentes e flechas para o HUD (`#SUPPLY`)." (raw L270-L270)
- **C22** [verified] "- Sair da dungeon enche vida, stamina e mana e tira o veneno do golpe que matou" (raw L352-L352)

## Vital Pools & Regeneration

Character vital pools combine primary status attributes, progression tree attribute purchases (`HI = { hits: 5, mana: 5, stam: 5 }` in `_raw/bundle/progression-tree-ui.js:35`), and equipped item bonuses (`BonusHits`, `BonusMana`, `BonusStam` in `_raw/bundle/i18n-en-abilities.js:2616`):

| Vital Pool | Base Formula / Primary Stat Scaling | Tree Attribute Increment & Cap | Item Affix Keys | Primary Regeneration Skill & Notes |
|---|---|---|---|---|
| **Health (`HP`)** | `Math.floor(STR / 2) + 50 + Hits + BonusHits` | `+5` per purchase, cap `+100` (`Hits`) | `BonusHits`, `RegenHits` | Restored via bandages, heal potions (**C10**), Magery/Chivalry/SpiritSpeak/Focus heals (**C11**), and full refill on dungeon exit (**C22**) |
| **Mana** | `INT + Mana + BonusMana` | `+5` per purchase, cap `+100` (`Mana`) | `BonusMana`, `RegenMana`, `LowerManaCost` | Regenerated by `Meditation` (penalized by heavy armor; capped at `0` for Warrior per **C16**) and mana potions (**C10**) |
| **Stamina** | `DEX + Stamina + BonusStam` | `+5` per purchase, cap `+100` (`Stamina`) | `BonusStam`, `RegenStam` | Regenerated by `Focus`; higher stamina shortens weapon swing delay alongside `WeaponSpeed` and tree `Speed`; drained when overloaded (`L990`) |

### Cost Reduction & Regeneration Modifiers

- **Lower Mana Cost (`LowerMana` / `LowerManaCost`):** Reduces the mana spent by each spell or ability up to a hard cap of `+40%` (`_raw/bundle/i18n-en-abilities.js:2616`).
- **Lower Reagent Cost (`LowerRegCost`):** Item affix reducing reagent consumption percentage on spell casts (`_raw/bundle/i18n-en-abilities.js:2616`).
- **Focus (`skill 50`):** Accelerates passive stamina recovery and scales Focus-backed class heals such as Monk `ki_recovery` (`_raw/bundle/i18n-en-abilities.js:2616`).
- **Meditation (`skill 46`):** Accelerates passive mana recovery when wearing light/cloth/leather armor; impeded by heavy metal armor (`_raw/bundle/i18n-en-abilities.js:2616`).

## Potions, Healing Spells & Class Resource Rules

While the browser client includes legacy UO flat-range estimators for tooltips, the authoritative UO Idle server resolves potions and Magery heals using percentage-of-maximum-vital formulas:

| Sustain Source | Lesser Tier | Normal Tier | Greater / Total Tier | Server Rule & Notes |
|---|---|---|---|---|
| **Heal Potions** (`lesser_heal_potion`, `heal_potion`, `greater_heal_potion`) | `15%` Max HP | `25%` Max HP | `35%` Max HP | **C10** (`raw L499-L499`). Consumed without leaving empty bottles (`L456`); bot will not drink at full HP (`L218`). |
| **Mana Potions** (`lesser_mana_potion`, `mana_potion`, `greater_mana_potion`) | `15%` Max Mana | `25%` Max Mana | `35%` Max Mana | **C10** (`raw L499-L499`). Hue `20` (`ki` in `abilities-loader-and-hotbar.js:136-138`). |
| **Magery Heal Spells** (`mage_heal`, `mage_greater_heal`, `*_magery_heal`, `*_magery_gh`) | `15%` Target Max HP (`Heal`) | — | `35%` Target Max HP (`Greater Heal`) | **C11** (`raw L500-L500`). Heals do not use `DamageFactor` level scaling (**C1**). |
| **Refresh Potions** (`refresh_potion`, `total_refresh_potion`) | — | Partial Stamina | `100%` Max Stamina | Triggered by default at `stam <= 45%` and `stam <= 22%` respectively (`[[tick-and-cooldowns]]`). |

### Class-Specific Resource Exemptions

1. **Warrior Zero-Mana & Zero-Meditation Rule (**C15**, **C16**):**
   - All Warrior abilities (`kind: "Custom"` and `kind: "WeaponAbility"`) cost `0` mana on the server (**C15**), even if legacy UO `WeaponAbility` definitions list nonzero base mana in `abilities-catalog.json`.
   - Warrior `Meditation` skill cap is forced to `0` and zeroed on login and character creation (**C16**).
2. **Paladin Chivalry Gold Tithe (**C12**):**
   - Paladin Chivalry spells (`paladin_CloseWounds`, `paladin_CleanseByFire`, `paladin_ConsecrateWeapon`, `paladin_DivineFury`, `paladin_HolyLight`, `paladin_RemoveCurse`) automatically tithe character gold at **1 gp per tithing point** (`1 gp por ponto`) without phantom 10,000 gp refills (**C12**).

## Reagent & Supply Economy

Magery, Necromancy, and Spellweaving spells consume reagents from the character's backpack/bank during active hunts (**C20**, `L482`), and the server broadcasts live reagent and ammunition counts via `#SUPPLY` in response to `[supply` and `[habinfo` (**C21**). If all combat spells on the hotbar run out of reagents (or a ranged weapon runs out of arrows/bolts) and the corresponding bot exit rule is enabled, the bot exits the dungeon (`_raw/bundle/i18n-en-abilities.js:1609-1613`).

The client maps seventeen reagent keys to Ultima Online item graphics in `ok` (`_raw/bundle/combat-estimators-and-hotbar.js:99-117`):

| Reagent Key | Graphic ID | School |
|---|---|---|
| `blackPearl` | `3962` (`0x0F7A`) | Magery |
| `bloodMoss` | `3963` (`0x0F7B`) | Magery |
| `garlic` | `3972` (`0x0F84`) | Magery |
| `ginseng` | `3973` (`0x0F85`) | Magery |
| `mandrake` | `3974` (`0x0F86`) | Magery |
| `nightshade` | `3976` (`0x0F88`) | Magery |
| `sulfurousAsh` | `3980` (`0x0F8C`) | Magery |
| `spidersSilk` | `3981` (`0x0F8D`) | Magery |
| `batWing` | `3960` (`0x0F78`) | Necromancy |
| `daemonBlood` | `3965` (`0x0F7D`) | Necromancy |
| `bone` | `3966` (`0x0F7E`) | Necromancy |
| `daemonBone` | `3968` (`0x0F80`) | Necromancy |
| `fertileDirt` | `3969` (`0x0F81`) | Necromancy / Spellweaving |
| `pigIron` | `3978` (`0x0F8A`) | Necromancy |
| `noxCrystal` | `3982` (`0x0F8E`) | Necromancy |
| `graveDust` | `3983` (`0x0F8F`) | Necromancy |
| `dragonsBlood` | `16503` (`0x4077`) | Spellweaving |

## Hunting Energy Pool & Recharge Math

Hunting Energy gates all dungeon farming (both online and offline):

- **Pool Drain & Zero-Tick Termination (**C7**):** Hunting Energy drains continuously while inside a hunt. Reaching `0` energy terminates the hunt on the **exact same server tick** (preventing free post-zero farming), with chat warnings at `~36 min` remaining, `~7 min` remaining, and depletion (**C7**). Characters with zero energy cannot enter a dungeon or join a party hunt (`L216`).
- **Passive Recovery (**C13**):** Whenever the character is outside a hunt (whether online in town or offline), Hunting Energy regenerates linearly from empty to full over **12 hours** (`720` minutes) (**C13**). Energy state is persisted across world saves (`L828`).
- **Gold Refill Options & Cost Formula (**C4**, **C5**):**
  - Players can purchase up to **4 energy refills per day**, choosing `+1 h` (`60` minutes), `+4 h` (`240` minutes), or a full recharge (**C4**).
  - Each refill's gold cost scales with character level, minutes recharged, and the ordinal refill index of the day (`1` through `4`) (**C5**):
    $$\text{RefillCost (gp)} = 10 \times \text{Level} \times \text{MissingMinutes} \times \text{RefillNumberOfDay}$$
