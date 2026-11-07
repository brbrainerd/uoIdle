---
id: "hunting-bot-and-dungeons"
title: "Hunting Bot Automation, Combat Postures, Target Selectors, and Dungeon Exit Rules"
category: "combat"
aliases: ["hunting-bot", "huntpostura", "huntbot", "postures", "dungeon-exit-rules", "placar"]
status: "verified"
sources: ["_raw/bundle/hunt-and-bot-config.js", "_raw/bundle/i18n-en-abilities.js", "_raw/wiki/changelog-server-dev.md"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "bundle: _raw/bundle/i18n-en-abilities.js:1574-1615", "wiki: _raw/wiki/changelog-server-dev.md:209-217"]
code_refs: ["hunt-and-bot-config.js:qm", "hunt-and-bot-config.js:QO", "hunt-and-bot-config.js:eR", "hunt-and-bot-config.js:aR", "hunt-and-bot-config.js:dR", "hunt-and-bot-config.js:pR", "hunt-and-bot-config.js:gR"]
updated: "2026-11-07"
---
# Hunting Bot Automation, Combat Postures, Target Selectors, and Dungeon Exit Rules

Source: [raw](../_raw/bundle/hunt-and-bot-config.js)

## Summary

UO Idle automates dungeon farming through a client-configured, server-executed Hunting Bot synchronized over the speech protocol. The bot controller manages five target-selection strategies, three attack postures that trade outgoing damage against incoming damage taken, class-capped engagement distance sliders for ranged and spellcasting classes, loot category filters, party follow behavior, and eight automated dungeon exit safety rules. During active hunts, the shard streams real-time damage scoreboard breakdowns, difficulty-tier monster rosters, and spawn-point timers back to the client gump.

## Claims

- **C1** [verified] "function qm(e) { const a = it(e); if (!a) return null; switch (a.assunto) { case 'BOT': case 'PLACAR': case 'NIVEL': case 'MONSTRO': case 'HUNTASK': case 'FIM': return a; default: return null; } }" (raw L5-L19)
- **C2** [verified] "const g = d.useCallback((f) => e.say(`[huntdiff ${f}`), [e]), b = n.find((f) => f.actual) ?? null; return { niveis: n, monstros: o, dungeon: i, nivelActual: b, pedirInfo: m, escolherNivel: g };" (raw L88-L90)
- **C3** [verified] "const Ry = ['ouro', 'magico', 'instrumento', 'outro']; function eR(e, a) { const [n, s] = d.useState(() => ZO()); d.useEffect(() => { if (!a) return; const i = Ry.filter((c) => !n.has(c)); e.say(i.length === Ry.length ? '[huntloot' : `[huntloot ${i.join(',')}`); }, [e, a, n]);" (raw L107-L114)
- **C4** [verified] "const CS = ['proximo', 'menorVida', 'maiorVida', 'menorPct', 'maiorPct'], MS = ['agressivo', 'equilibrado', 'defensivo'], Jl = 16, Kh = 8, Yh = { seguirSerial: 0, sairSeAliadoMorrer: !1, sairSeLiderMorrer: !0, sairSeSemPot: !1, sairSeSemBandagem: !1, sairSeSemReags: !1, sairSeSemAmmo: !1, sairSePesado: !1, sairSeAlguemSair: !0, aceitarTudoDoLider: !0, };" (raw L450-L465)
- **C5** [verified] "function dR(e, a, n, s) { const [o, r] = d.useState(() => Xh('uoidle.caca.alvo', lR, 'proximo')), [i, c] = d.useState(() => Xh('uoidle.caca.postura', cR, 'equilibrado')), [l, m] = d.useState(() => +Xh('uoidle.caca.distancia', uR, String(Jl)))," (raw L503-L506)
- **C6** [verified] "const p = n === 'mage' || n === 'necromancer' || n === 'mystic' || n === 'spellweaver', v = g != null && g.distante ? Math.max(1, Math.min(p ? Kh : Jl, g.alcance || (p ? Kh : Jl))) : p ? Kh : Jl, x = Math.min(l, v);" (raw L520-L527)
- **C7** [verified] "(d.useEffect(() => { a && Rh && e.say(`[huntalvo ${o}`); }, [e, a, o]), d.useEffect(() => { a && Rh && e.say(`[huntpostura ${i}`); }, [e, a, i]), d.useEffect(() => { a && Rh && e.say(`[huntdist ${x}`); }, [e, a, x]), d.useEffect(() => { a && (Eu('uoidle.caca.idlebot', JSON.stringify(f)), e.say(`[IdleBot ${JSON.stringify(f)}`)); }, [e, a, f])," (raw L528-L539)
- **C8** [verified] "const mR = [ 'warrior', 'ranger', 'berserker', 'duelist', 'paladin', 'assassin', 'ninja', 'monk', 'samurai', 'bard', 'tamer', ], hR = ['mage', 'necromancer'], fR = ['ranger'];" (raw L584-L598)
- **C9** [verified] "const pR = [ { key: 'sairSeAliadoMorrer', label: 'bot.exitAllyDeath', hint: 'bot.exitAllyDeathHint' }, { key: 'sairSeLiderMorrer', label: 'bot.exitLeaderDeath', hint: 'bot.exitLeaderDeathHint' }, { key: 'sairSeAlguemSair', label: 'bot.exitAllyLeave', hint: 'bot.exitAllyLeaveHint' }, { key: 'sairSeSemPot', label: 'bot.exitNoPot', hint: 'bot.exitNoPotHint' }, { key: 'sairSeSemBandagem', label: 'bot.exitNoBand', hint: 'bot.exitNoBandHint', classes: mR }, { key: 'sairSeSemReags', label: 'bot.exitNoReags', hint: 'bot.exitNoReagsHint', classes: hR }, { key: 'sairSeSemAmmo', label: 'bot.exitNoAmmo', hint: 'bot.exitNoAmmoHint', classes: fR }, { key: 'sairSePesado', label: 'bot.exitHeavy', hint: 'bot.exitHeavyHint' }, ];" (raw L611-L620)

## Hunting Bot Combat Postures (`MS`, `[huntpostura`, **C4**, **C5**, **C7**)

The bot controller `dR` (**C5**) persists the selected posture in `localStorage` under `uoidle.caca.postura` (default `'equilibrado'`) and transmits `[huntpostura <postura>` (**C7**) to the shard. Per `_raw/bundle/i18n-en-abilities.js:1574-1579` and `[[damage-and-defense]]`:

| Posture Key (`MS`) | English Label | Outgoing Damage Multiplier | Incoming Damage Taken Multiplier | Default State |
|---|---|---|---|---|
| `agressivo` | Aggressive | **`×1.20` (`+20%` damage dealt)** | **`×1.40` (`+40%` damage taken)** | Optional high-tempo farm posture |
| `equilibrado` | Balanced | **`×1.00` (`0%` modifier)** | **`×1.00` (`0%` modifier)** | Default (`'equilibrado'`, **C5**) |
| `defensivo` | Defensive | **`×0.60` (`-40%` damage dealt)** | **`×0.80` (`-20%` damage taken)** | Optional high-survival tank posture |

## Target Selection Strategies (`CS`, `[huntalvo`, **C4**, **C5**, **C7**)

| Target Strategy Key (`CS`) | Protocol Command | Target Priority Rule |
|---|---|---|
| `proximo` (default) | `[huntalvo proximo` | Closest hostile monster |
| `menorVida` | `[huntalvo menorVida` | Monster with lowest current HP |
| `maiorVida` | `[huntalvo maiorVida` | Monster with highest current HP |
| `menorPct` | `[huntalvo menorPct` | Monster with lowest HP percentage |
| `maiorPct` | `[huntalvo maiorPct` | Monster with highest HP percentage |

## Engagement Distance Ceiling (`[huntdist`, **C4**, **C6**, **C7**)

- **Spellcaster Ceiling (`Kh = 8` tiles):** For `mage`, `necromancer`, `mystic`, and `spellweaver` (`p === true`, **C6**), maximum engagement distance is clamped to `8` tiles.
- **Ranged Weapon Ceiling (`Jl = 16` tiles):** For ranged weapon users (`g.distante === true`, e.g., `ranger`), maximum engagement distance is clamped to `Math.min(16, g.alcance || 16)` tiles (**C6**).
- **Melee Classes (`mR`):** Engage at melee range (`1` tile).

## Class-Gated Dungeon Exit Rules (`Yh`, `pR`, `[IdleBot`, **C4**, **C8**, **C9**)

The `[IdleBot <json>` command (**C7**) synchronizes ten boolean/serial flags (`Yh`, **C4**). Notably, `mR` (**C8**) already includes both `'ninja'` and `'samurai'` in the bandage-exit eligibility list:

| Flag Key | Default | Class Filter | Server Behavior |
|---|---|---|---|
| `sairSeAliadoMorrer` | `false` | All (party) | Exit dungeon if any party member dies |
| `sairSeLiderMorrer` | `true` | All (party) | Exit dungeon if party leader dies |
| `sairSeAlguemSair` | `true` | All (party) | Exit dungeon if a party member leaves |
| `sairSeSemPot` | `false` | All | Exit dungeon when heal potions run out |
| `sairSeSemBandagem` | `false` | `mR` (`warrior`, `ranger`, `berserker`, `duelist`, `paladin`, `assassin`, `ninja`, `monk`, `samurai`, `bard`, `tamer`, **C8**) | Exit dungeon when bandages run out |
| `sairSeSemReags` | `false` | `hR` (`mage`, `necromancer`, **C8**) | Exit dungeon when all hotbar combat spells lack reagents |
| `sairSeSemAmmo` | `false` | `fR` (`ranger`, **C8**) | Exit dungeon when arrows/bolts run out |
| `sairSePesado` | `false` | All | Exit dungeon when backpack weight exceeds carrying capacity |

## Loot Filter (`[huntloot`, **C3**) & Live Scoreboard (`#PLACAR`, **C1**)

- **Loot Filter Categories (`Ry`, **C3**):** Players can toggle `ouro` (gold), `magico` (magic gear), `instrumento` (instruments), and `outro` (other items) via `[huntloot <csv>`.
- **Live Damage Scoreboard (`#PLACAR`, **C1**):** Streams total damage, per-ability damage breakdown (`s.id === 'base'` for weapon auto-attacks vs ability IDs), XP/hour, and gold/hour to the hunting HUD.
