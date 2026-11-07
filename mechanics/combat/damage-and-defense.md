---
id: "damage-and-defense"
title: "Damage, Healing, and Defense Mitigation Formulas"
category: "combat"
aliases: ["combat-estimators", "damage-formulas", "healing-formulas", "defense-chance", "resistances"]
status: "verified"
sources: ["_raw/bundle/combat-estimators-and-hotbar.js", "_raw/bundle/i18n-en-abilities.js", "_raw/wiki/changelog-server-dev.md", "_raw/wiki/changelog-server-en.md"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/i18n-en-abilities.js:1575-1579", "bundle: _raw/bundle/i18n-en-abilities.js:2616", "wiki: _raw/wiki/changelog-server-dev.md:17", "wiki: _raw/wiki/changelog-server-dev.md:499-502"]
code_refs: ["combat-estimators-and-hotbar.js:Zo", "combat-estimators-and-hotbar.js:jq", "combat-estimators-and-hotbar.js:wq", "combat-estimators-and-hotbar.js:Nq", "combat-estimators-and-hotbar.js:Sq", "combat-estimators-and-hotbar.js:kq", "combat-estimators-and-hotbar.js:Cq", "combat-estimators-and-hotbar.js:Mq", "combat-estimators-and-hotbar.js:Aq", "combat-estimators-and-hotbar.js:Eq"]
updated: "2026-11-07"
---
# Damage, Healing, and Defense Mitigation Formulas

Source: [raw](../_raw/bundle/combat-estimators-and-hotbar.js)

## Summary

UO Idle combines client-side combat estimators with authoritative server-side damage, healing, and mitigation resolution. In the browser client, a master dispatcher evaluates a character's trained Alchemy, Anatomy, Evaluating Intelligence, Healing, Magery, Tactics, and Chivalry skills to compute fallback damage and healing ranges, multi-hit totals, splash damage, and per-second throughput until server telemetry arrives. On the shard, outgoing power scales with character level at distinct rates for spellcasters and physical fighters while excluding heals from level damage factors, and healing/mana potions as well as Magery heal spells resolve as fixed percentages of maximum pool size. Final combat throughput and survivability are bounded by hunting bot attack postures, five elemental and physical resistance channels, and hard caps on hit chance, defense chance, weapon damage, spell damage, swing speed, casting speed, and mana cost reduction.

## Claims

- **C1** [verified] "function fj(e, a) { if (!e) return []; const n = (o, r) => (o === r ? String(r) : `${o}–${r}`), s = []; if (e.dmax && e.dmax > 0) { const o = e.dmin ?? e.dmax, r = e.golpes && e.golpes > 1 ? e.golpes : 1, i = Math.round(((o + e.dmax) / 2) * r); (s.push(a('hotbar.detalhe.porGolpe', { v: n(o, e.dmax) })), r > 1 && s.push(a('hotbar.detalhe.total', { n: r, v: i })), e.area && s.push(a('hotbar.detalhe.area')), e.cd > 0 && s.push( a('hotbar.detalhe.porSegundo', { v: (i / e.cd).toLocaleString(sn.language, { maximumFractionDigits: 1 }), }) )); } return ( e.cmax && e.cmax > 0 && s.push(a('hotbar.detalhe.cura', { v: n(e.cmin ?? e.cmax, e.cmax) })), e.mana > 0 && s.push(a('hotbar.detalhe.mana', { v: e.mana })), s ); }" (raw L61-L84)
- **C2** [verified] "function Sg(e, a) { return e ? e.id === 'warrior_slash' || e.id === 'ranger_arrow' || e.id === 'monk_palm' ? a('hotbar.autoAttackCd') : e.cd > 0 ? a('hotbar.cooldownSec', { s: Number.isInteger(e.cd) ? e.cd : e.cd.toFixed(1) }) : a('hotbar.noCooldown') : ''; }" (raw L85-L93)
- **C3** [verified] "const Zo = { alchemy: 0, anatomy: 1, evalInt: 16, healing: 17, magery: 25, tactics: 27, chivalry: 51, };" (raw L358-L366)
- **C4** [verified] "function vq(e, a) { return Math.round((e + a) / 2); } function Gs(e, a, n) { const s = Math.max(1, Math.floor(a)), o = Math.max(s, Math.ceil(n)); return { kind: e, min: s, max: o, avg: vq(s, o), variant: 'range' }; } function yq(e) { return Math.floor((e * 10) / 33); } function pj(e, a) { return Math.floor((e * (100 + a)) / 100); }" (raw L367-L380)
- **C5** [verified] "function jq(e, a) { const n = e === 'lesser_heal_potion' ? { min: 6, max: 8 } : e === 'heal_potion' ? { min: 13, max: 16 } : e === 'greater_heal_potion' ? { min: 20, max: 25 } : null; if (!n) return null; const s = yq(a); return Gs('heal', pj(n.min, s), pj(n.max, s)); }" (raw L381-L393)
- **C6** [verified] "function wq(e, a) { const n = a / 8 + e / 5 + 4, s = a / 6 + e / 2.5 + 4; return Gs('heal', n, s); }" (raw L394-L398)
- **C7** [verified] "function Nq(e, a = !0) { const n = e / 12, s = n + 1, o = n + 4; return Gs('heal', s, o); } function Sq(e) { const a = e / 5; return Gs('heal', a + 1, a + 6); } function kq(e) { const a = e / 10; return Gs('heal', a + 1, a + 6); }" (raw L399-L412)
- **C8** [verified] "function Cq(e, a, n = 1) { if (e.includes('execution')) { const s = Math.floor(a * 0.6) + 20 * n; return Gs('damage', s, s); } if (e.includes('cleave') || e.endsWith('_cleave')) { const s = 15 + 10 * n, o = 8 + 4 * n; return { kind: 'damage', min: s, max: s, avg: s, variant: 'cleave', splash: o }; } if (e.includes('multishot') || e.includes('bolt_volley')) { const s = 2 + n, o = 10 + 5 * n; return { kind: 'damage', min: o, max: o, avg: o * s, variant: 'multihit', hits: s }; } if (e.includes('flurry')) { const s = 2 + n, o = 8 + 3 * n; return { kind: 'damage', min: o, max: o, avg: o * s, variant: 'multihit', hits: s }; } if (e.includes('shield_bash') || e.includes('earthshaker')) { const s = 10 + 5 * n + Math.floor(a * 0.15); return Gs('damage', s, s + 6); } if (e.includes('cleric_thunderstorm') || e.includes('chain_lightning')) { const s = 14 + 5 * n; return { kind: 'damage', min: s, max: s + 8, avg: s + 4, variant: 'cleave', splash: Math.max(1, Math.floor(s / 2)), }; } if (e.includes('heavy_strike') || e.includes('crushing')) { const s = 12 + Math.floor(a * 0.25); return Gs('damage', s - 4, s + 8); } return (e.includes('fireball'), null); }" (raw L413-L453)
- **C9** [verified] "function Mq(e) { return e.includes('magic_arrow') ? 2.1 : e.includes('_harm') || e.endsWith('harm') ? 2 : e.includes('fireball') ? 1.85 : e.includes('lightning') && !e.includes('chain') ? 1.65 : e.includes('energy_bolt') || e.includes('explosion') || e.includes('poison_strike') ? 1.75 : e.includes('flame_strike') || e.includes('chain_lightning') || e.includes('wither') ? 1.6 : e.includes('pain_spike') ? 1.65 : (e.includes('strangle'), 1.75); }" (raw L454-L470)
- **C10** [verified] "function Aq(e, a, n) { const s = a * 0.5 + n * 0.3, o = Mq(e), r = (i, c) => Gs('damage', i * o, c * o); return e.includes('magic_arrow') ? r(3 + s * 0.05, 8 + s * 0.08) : e.includes('_harm') || e.endsWith('harm') ? r(6 + s * 0.08, 14 + s * 0.12) : e.includes('fireball') ? r(10 + s * 0.1, 20 + s * 0.15) : e.includes('lightning') || e.includes('energy_bolt') ? r(14 + s * 0.12, 28 + s * 0.18) : e.includes('explosion') || e.includes('flame_strike') ? r(20 + s * 0.15, 40 + s * 0.22) : e.includes('pain_spike') ? r(8 + s * 0.08, 18 + s * 0.12) : e.includes('thunderstorm') || e.includes('eagle') ? r(10 + s * 0.1, 22 + s * 0.16) : null; }" (raw L471-L490)
- **C11** [verified] "function Eq(e, a) { const n = e.id.toLowerCase(), s = a.getSkill(Zo.alchemy), o = a.getSkill(Zo.healing), r = a.getSkill(Zo.anatomy), i = a.getSkill(Zo.magery), c = a.getSkill(Zo.evalInt), l = a.getSkill(Zo.tactics), m = a.getSkill(Zo.chivalry), g = jq(n, s); if (g) return g; if (n === 'bandage' || n.includes('bandage')) return wq(o, r); if (n.includes('greater_heal') || n.includes('magery_gh')) return Sq(i); if ( (n.includes('_heal') || n.endsWith('heal') || n.includes('magery_heal')) && !n.includes('potion') && e.kind === 'Spell' ) return Nq(i); if (n.includes('close_wounds')) return kq(m); if (n.includes('ki_recovery')) { const h = 15 + 5 * Math.max(1, e.unlock > 40 ? 2 : 1); return Gs('heal', h - 5, h + 5); } const b = e.kind === 'Spell' ? Aq(n, i, c) : null; if (b) return b; const f = n.includes('_r2') ? 2 : n.includes('_r3') ? 3 : 1; return Cq(n, l, f); }" (raw L491-L519)
- **C12** [verified] "function rk(e) { switch (e) { case 'enemies': return ['self']; case 'ally_agro': return ['self']; case 'in_combat': return ['self', 'enemy']; case 'str_buff': case 'dex_buff': case 'int_buff': return ['self']; case 'mana': case 'stam': return ['self', 'ally', 'party:leader']; case 'poisoned': return ['self', 'ally', 'party:leader']; case 'hp': default: return ['self', 'ally', 'party:leader', 'enemy']; } }" (raw L520-L541)

## Client Combat Estimator Architecture (`Eq`, `Gs`, `Zo`)

The client-side estimator `Eq(e, a)` (**C11**) reads seven skills via `Zo` (**C3**: `alchemy: 0`, `anatomy: 1`, `evalInt: 16`, `healing: 17`, `magery: 25`, `tactics: 27`, `chivalry: 51`) and normalizes ranges with `Gs(kind, min, max)` (**C4**), where:
$$\text{min} = \max(1, \lfloor a \rfloor), \quad \text{max} = \max(\text{min}, \lceil n \rceil), \quad \text{avg} = \text{round}\!\left(\frac{\text{min} + \text{max}}{2}\right)$$

When the server responds to `[habinfo` with `#HABINFO` (see `[[tick-and-cooldowns]]`), `fj(e, a)` (**C1**) formats server-reported `dmin`, `dmax`, `cmin`, `cmax`, multi-hit count `golpes`, AoE flag `area`, and cooldown `cd` into per-hit range, total multi-hit damage `Math.round(((dmin + dmax) / 2) * golpes)`, and DPS `(total / cd)`.

### Healing Estimators (`jq`, `wq`, `Nq`, `Sq`, `kq`, `ki_recovery`)

| Estimator / Ability | Input Skills | Client Estimator Formula (**C5**, **C6**, **C7**, **C11**) | Authoritative Server Override |
|---|---|---|---|
| **Heal Potions** (`jq(id, alchemy)`) | `alchemy` (`0`) | Base `[6, 8]` (lesser), `[13, 16]` (normal), `[20, 25]` (greater); scaled by `pj(base, Math.floor(alchemy * 10 / 33))` | Server overrides with **15% / 25% / 35% Max HP** (`[[resources]] C10`) |
| **Bandage** (`wq(healing, anatomy)`) | `healing` (`17`), `anatomy` (`1`) | $\text{min} = \lfloor \frac{\text{Anatomy}}{8} + \frac{\text{Healing}}{5} + 4 \rfloor$, $\text{max} = \lceil \frac{\text{Anatomy}}{6} + \frac{\text{Healing}}{2.5} + 4 \rceil$ | Scales with `Healing` and `Anatomy` (`_raw/bundle/i18n-en-abilities.js:2616`) |
| **Magery Heal** (`Nq(magery)`) | `magery` (`25`) | $\text{min} = \lfloor \frac{\text{Magery}}{12} + 1 \rfloor$, $\text{max} = \lceil \frac{\text{Magery}}{12} + 4 \rceil$ | Server overrides with **15% Target Max HP** (`[[resources]] C11`) |
| **Magery Greater Heal** (`Sq(magery)`) | `magery` (`25`) | $\text{min} = \lfloor \frac{\text{Magery}}{5} + 1 \rfloor$, $\text{max} = \lceil \frac{\text{Magery}}{5} + 6 \rceil$ | Server overrides with **35% Target Max HP** (`[[resources]] C11`) |
| **Chivalry Close Wounds** (`kq(chivalry)`) | `chivalry` (`51`) | $\text{min} = \lfloor \frac{\text{Chivalry}}{10} + 1 \rfloor$, $\text{max} = \lceil \frac{\text{Chivalry}}{10} + 6 \rceil$ | Costs `1 gp` per Chivalry point (`[[resources]] C12`) |
| **Monk `ki_recovery`** (`Eq` inline) | `unlock` tier | $h = 15 + 5 \times (\text{unlock} > 40 ? 2 : 1)$, range $[h - 5, h + 5]$ (`[15, 25]` at R1, `[20, 30]` at R2) | Scales with `Focus` on server (`_raw/bundle/i18n-en-abilities.js:2616`) |

### Physical Ability Estimator (`Cq(id, tactics, rank)`, **C8**)

`Eq` determines ability rank `n` from the ID suffix (`_r3` $\rightarrow 3$, `_r2` $\rightarrow 2$, otherwise $1$) and passes `tactics` (`a`) and `rank` (`n`) to `Cq(e, a, n)`:

| Ability Pattern | Variant | Hits | Min Damage | Max Damage | Avg / Total | Splash Damage |
|---|---|---|---|---|---|---|
| `*execution*` | `'range'` | `1` | $\lfloor 0.6 \times \text{Tactics} \rfloor + 20n$ | $\lfloor 0.6 \times \text{Tactics} \rfloor + 20n$ | $\lfloor 0.6 \times \text{Tactics} \rfloor + 20n$ | — |
| `*cleave*` | `'cleave'` | `1` | $15 + 10n$ | $15 + 10n$ | $15 + 10n$ | $8 + 4n$ |
| `*multishot*`, `*bolt_volley*` | `'multihit'` | $2 + n$ | $10 + 5n$ (per hit) | $10 + 5n$ (per hit) | $(2 + n)(10 + 5n)$ | — |
| `*flurry*` | `'multihit'` | $2 + n$ | $8 + 3n$ (per hit) | $8 + 3n$ (per hit) | $(2 + n)(8 + 3n)$ | — |
| `*shield_bash*`, `*earthshaker*` | `'range'` | `1` | $10 + 5n + \lfloor 0.15 \times \text{Tactics} \rfloor$ | $\text{min} + 6$ | $\text{min} + 3$ | — |
| `*cleric_thunderstorm*`, `*chain_lightning*` | `'cleave'` | `1` | $14 + 5n$ | $22 + 5n$ | $18 + 5n$ | $\max(1, \lfloor (14 + 5n) / 2 \rfloor)$ |
| `*heavy_strike*`, `*crushing*` | `'range'` | `1` | $\max(1, 8 + \lfloor 0.25 \times \text{Tactics} \rfloor)$ | $20 + \lfloor 0.25 \times \text{Tactics} \rfloor$ | $14 + \lfloor 0.25 \times \text{Tactics} \rfloor$ | — |

### Spell School Multipliers (`Mq`) & Spell Damage Estimator (`Aq`, **C9**, **C10**)

For `"Spell"` entries, `Aq(id, magery, evalInt)` computes a composite skill term $s = 0.5 \times \text{Magery} + 0.3 \times \text{EvalInt}$ and multiplies the spell's base range by its school multiplier $o = Mq(\text{id})$:

| Spell Pattern | School Multiplier $o = Mq(\text{id})$ (**C9**) | Pre-Multiplier Min | Pre-Multiplier Max | Final Range (`Gs('damage', min * o, max * o)`, **C10**) |
|---|---|---|---|---|
| `*magic_arrow*` | `2.1` | $3 + 0.05s$ | $8 + 0.08s$ | $[\lfloor (3 + 0.05s) \times 2.1 \rfloor, \lceil (8 + 0.08s) \times 2.1 \rceil]$ |
| `*_harm*`, `*harm` | `2.0` | $6 + 0.08s$ | $14 + 0.12s$ | $[\lfloor (6 + 0.08s) \times 2.0 \rfloor, \lceil (14 + 0.12s) \times 2.0 \rceil]$ |
| `*fireball*` | `1.85` | $10 + 0.10s$ | $20 + 0.15s$ | $[\lfloor (10 + 0.10s) \times 1.85 \rfloor, \lceil (20 + 0.15s) \times 1.85 \rceil]$ |
| `*lightning*` (non-chain) | `1.65` | $14 + 0.12s$ | $28 + 0.18s$ | $[\lfloor (14 + 0.12s) \times 1.65 \rfloor, \lceil (28 + 0.18s) \times 1.65 \rceil]$ |
| `*energy_bolt*` | `1.75` | $14 + 0.12s$ | $28 + 0.18s$ | $[\lfloor (14 + 0.12s) \times 1.75 \rfloor, \lceil (28 + 0.18s) \times 1.75 \rceil]$ |
| `*explosion*` | `1.75` | $20 + 0.15s$ | $40 + 0.22s$ | $[\lfloor (20 + 0.15s) \times 1.75 \rfloor, \lceil (40 + 0.22s) \times 1.75 \rceil]$ |
| `*flame_strike*` | `1.6` | $20 + 0.15s$ | $40 + 0.22s$ | $[\lfloor (20 + 0.15s) \times 1.6 \rfloor, \lceil (40 + 0.22s) \times 1.6 \rceil]$ |
| `*pain_spike*` | `1.65` | $8 + 0.08s$ | $18 + 0.12s$ | $[\lfloor (8 + 0.08s) \times 1.65 \rfloor, \lceil (18 + 0.12s) \times 1.65 \rceil]$ |
| `*thunderstorm*`, `*eagle*` | `1.75` (fallback) | $10 + 0.10s$ | $22 + 0.16s$ | $[\lfloor (10 + 0.10s) \times 1.75 \rfloor, \lceil (22 + 0.16s) \times 1.75 \rceil]$ |
| `*poison_strike*`, `*strangle*` | `1.75` | — (`Aq` returns `null`; server `#HABINFO` supplies values) | — | Server-resolved via Necromancy / Spirit Speak (`changelog-server-dev.md:11`) |
| `*chain_lightning*`, `*wither*` | `1.6` | — (`chain_lightning` falls back to `Cq` on client) | — | Server-resolved via `#HABINFO` |

## Server Level Scaling, Postures & Attribute/Resistance Caps

### Level Power Multipliers (`[[resources]] C1`)

On the authoritative server (`changelog-server-dev.md:17`), level-based power scaling is inverted relative to Ethernul:
- **Spellcasters (`mage`, `necromancer`, `spellweaver`):** `×80` power per level (`casters ×80`). Note that Necromancer and Spellweaver use their own school skills (`Necromancy`/`Spirit Speak` and `Spellweaving`) for cast success and damage rather than `Magery`/`EvalInt` (`changelog-server-dev.md:11`).
- **Physical classes (`warrior`, `berserker`, `paladin`, `ranger`):** `×60` power per level (`físico ×60`). Weapon damage flattens above skill `100` (`changelog-server-dev.md:338`).
- **Healing abilities:** Exempt from `DamageFactor` level scaling (`cura sem DamageFactor`).

### Hunting Bot Combat Postures (`[huntpostura`)

Configured in the hunting bot panel (`_raw/bundle/i18n-en-abilities.js:1574-1579`), posture multipliers modify outgoing and incoming damage:

| Posture Key | Label | Outgoing Damage Modifier | Incoming Damage Taken Modifier |
|---|---|---|---|
| `agressivo` | Aggressive | **`+20%`** (`×1.20`) | **`+40%`** (`×1.40`) |
| `equilibrado` | Balanced | **`0%`** (`×1.00`) | **`0%`** (`×1.00`) |
| `defensivo` | Defensive | **`-40%`** (`×0.60`) | **`-20%`** (`×0.80`) |

### Combat Attribute & Mitigation Caps (`_raw/bundle/i18n-en-abilities.js:2616`)

| Attribute / Bonus Key | Item Affix Key | Tree Attribute Key | Hard Cap | Combat Effect |
|---|---|---|---|---|
| **Weapon Damage Increase** | `WeaponDamage` | `Damage` | **`+100%`** | Multiplies physical weapon swing damage alongside `STR`, `Tactics`, and `Anatomy` |
| **Hit Chance Increase (`HCI`)** | `AttackChance` | `HitChance` | **`+45%`** | Extra chance for weapon swings to connect on top of the active weapon skill |
| **Defense Chance Increase (`DCI`)** | `DefendChance` | `Defense` | **`+45%`** | Lowers physical damage taken / increases avoidance |
| **Swing Speed Increase (`SSI`)** | `WeaponSpeed` | `Speed` | **`60%` (gear cap)** | Shortens delay between swings alongside Stamina; progression tree `Speed` exceeds the `60%` gear cap |
| **Spell Damage Increase (`SDI`)** | `SpellDamage` | `SpellDamage` | **`+50%`** | Multiplies spell damage alongside `INT` (every `10 INT`) and `EvalInt` |
| **Faster Casting (`FC`)** | `CastSpeed` | `Cast` | **`+2`** | Shortens spell cast time |
| **Faster Cast Recovery (`FCR`)** | `CastRecovery` | `Recovery` | **`+6`** | Shortens post-cast recovery pause |
| **Lower Mana Cost (`LMC`)** | `LowerManaCost` | `LowerMana` | **`+40%`** | Reduces mana spent per spell/ability (`[[resources]]`) |
| **Parry (`skill 5`)** | — | — | Skill `100` | Chance to block blows with weapon or shield |
| **Magic Resist (`skill 26`)** | — | — | Skill `100` | Lowers incoming spell damage |
| **Elemental & Physical Resistances** | `resist` (`fisica`, `fogo`, `frio`, `veneno`, `energia`) | — | `resistMax` (`max {{v}}%`) | Mitigates incoming Physical, Fire, Cold, Poison, and Energy damage in `AOS.Damage` |
