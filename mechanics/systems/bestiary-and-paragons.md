---
id: "bestiary-and-paragons"
title: "Bestiary Compendium, Monster Families, Special Blows, and Paragon Scaling"
category: "dungeons-monsters"
aliases: ["bestiario", "bestiary-compendium", "monster-families", "paragon-scaling", "special-blows"]
status: "verified"
sources: ["_raw/bundle/bestiary-and-wiki.js", "_raw/wiki/changelog-server-dev.md", "_raw/bundle/i18n-en-abilities.js"]
evidence: ["live: _evidence/live-bundle-probe.txt L1-L20", "wiki: _raw/wiki/changelog-server-dev.md:370", "wiki: _raw/wiki/changelog-server-dev.md:1051"]
code_refs: ["bestiary-and-wiki.js:kO", "bestiary-and-wiki.js:CO", "bestiary-and-wiki.js:MO", "bestiary-and-wiki.js:sk", "bestiary-and-wiki.js:dq", "bestiary-and-wiki.js:mq"]
updated: "2026-11-07"
---
# Bestiary Compendium, Monster Families, Special Blows, and Paragon Scaling

Source: [raw](../_raw/bundle/bestiary-and-wiki.js)

## Summary

UO Idle includes an interactive Bestiary and Monster Compendium synchronized via bracketed speech commands and server subject frames. The compendium tracks normal and Paragon kill counts across fourteen monster families, displays per-difficulty monster stat sheets including elemental damage channels, resistances, breath weapons, poison tiers, and ten Ultima Online special weapon blows, and awards permanent account-wide experience bonuses as players complete five progressive kill-count milestones per creature.

## Claims

- **C1** [verified] "I.assunto === 'BESTA' ? m.current.push({ id: String(k.id ?? ''), nome: String(k.nome ?? ''), linhagem: String(k.linhagem ?? ''), grau: Number(k.grau) || 0, corpo: Number(k.corpo) || 0, mortes: Number(k.mortes) || 0, mortesParagon: Number(k.paragon) || 0, conta: Number(k.conta) || 0, nivel: Number(k.nivel) || 0, ant: Number(k.ant) || 0, prox: Number(k.prox) || 0, }) : I.assunto === 'FIM' && k.de === 'bestiario' ? (o(m.current), (m.current = []), l(!!k.indisponivel), x(Number(k.bonus) || 0), i(!0)) : I.assunto === 'BESTANIVEL' && y.current && e.say('[bestiario');" (raw L34-L50)
- **C2** [verified] "const E = k && k !== 'medio' ? ` ${k}` : ''; e.say(`[bestiariobicho ${A}${I ? ' paragon' : ''}${E}`);" (raw L60-L61)
- **C3** [verified] "const CO = ['fisico', 'fogo', 'frio', 'veneno', 'energia'], MO = { ParalyzingBlow: 'paralyzingBlow', DoubleStrike: 'doubleStrike', CrushingBlow: 'crushingBlow', MortalStrike: 'mortalStrike', BleedAttack: 'bleedAttack', ArmorIgnore: 'armorIgnore', ConcussionBlow: 'concussionBlow', Disarm: 'disarm', Dismount: 'dismount', WhirlwindAttack: 'whirlwindAttack', };" (raw L91-L103)
- **C4** [verified] "if ( x && (x.magia > 0 && k.push(m(x.necro ? 'wiki.sheet.necro' : 'wiki.sheet.magic', { n: x.magia })), x.poison && k.push(m('wiki.sheet.poison', { nivel: x.poison })), x.sopro > 0 && k.push(m(x.soproFrio ? 'wiki.sheet.coldBreath' : 'wiki.sheet.fireBreath', { n: x.sopro })), x.golpe) ) { const N = MO[x.golpe]; k.push(m('wiki.sheet.strike', { nome: N ? m(`wiki.strike.${N}`) : x.golpe })); }" (raw L146-L156)
- **C5** [verified] "const cq = ['bestiario'], uq = ['comum', 'paragon'], sk = [ { tipo: 'ratos', ids: ['rat', 'giantrat', 'alligator'] }, { tipo: 'ratmen', ids: ['ratman', 'ratmanarcher', 'ratmanmage'] }, { tipo: 'mortosVivos', ids: [ 'skeleton', 'zombie', 'boneknight', 'ghoul', 'bonemagi', 'mummy', 'wraith', 'spectre', 'lich', 'lichlord', ], }, { tipo: 'orcs', ids: ['orc', 'orccaptain', 'orcishmage', 'orcbrute'] }, { tipo: 'aracnideos', ids: ['giantspider', 'scorpion', 'frostspider', 'dreadspider'] }, { tipo: 'terathans', ids: ['terathandrone', 'terathanwarrior', 'terathanavenger'] }, { tipo: 'gigantes', ids: ['troll', 'ogre', 'frosttroll', 'cyclops'] }, { tipo: 'gargulas', ids: ['gargoyle', 'stonegargoyle', 'firegargoyle'] }, { tipo: 'reptilianos', ids: ['lizardman', 'ophidianwarrior', 'ophidianmage', 'ophidianmatriarch'], }, { tipo: 'elementais', ids: ['airelemental', 'earthelemental', 'fireelemental', 'waterelemental', 'sandvortex'], }, { tipo: 'minotauros', ids: ['minotaur', 'minotaurscout', 'minotaurcaptain'] }, { tipo: 'yomotsu', ids: ['yomotsuwarrior', 'yomotsupriest', 'yomotsuelder'] }, { tipo: 'dragoes', ids: ['wyvern', 'drake', 'dragon', 'skeletaldragon', 'serpentinedragon', 'ancientwyrm'], }, { tipo: 'demonios', ids: ['daemon', 'icefiend', 'chaosdaemon', 'balron'] }, ];" (raw L807-L847)

## Bestiary Protocol & Stat Sheet Architecture (`kO`, `bS`, **C1–C4**)

- **Bestiary Sync (`[bestiario` $\rightarrow$ `#BESTA` / `#FIM`, **C1**):** `kO` sends `[bestiario` and accumulates `#BESTA` records (`id`, `nome`, `linhagem`, `grau`, `corpo`, `mortes`, `mortesParagon`, `conta`, `nivel`, `ant`, `prox`) until `#FIM` (`de: 'bestiario'`) arrives with the account's total XP `bonus`.
- **Monster Stat Sheet Query (`[bestiariobicho`, **C2**):** Requests per-creature stats for normal or `paragon` variants and a specific difficulty tier (`medio` default).
- **Monster Special Capabilities (**C3**, **C4**):**
  - **Five Damage & Resistance Channels (`CO`):** `fisico`, `fogo`, `frio`, `veneno`, `energia`.
  - **Ten Special Weapon Blows (`MO`):** `ParalyzingBlow`, `DoubleStrike`, `CrushingBlow`, `MortalStrike`, `BleedAttack`, `ArmorIgnore`, `ConcussionBlow`, `Disarm`, `Dismount`, and `WhirlwindAttack`.
  - **Spellcasting, Poison & Breath (`x.magia`, `x.necro`, `x.poison`, `x.sopro`, `x.soproFrio`):** Indicates Magery/Necromancy circle, poison application tier, and Fire or Cold breath damage.

## Monster Families (`sk`, **C5**), Paragon Spawns & Account XP Bonus

The `sk` table (**C5**) organizes `55` canonical monster IDs into `14` families (including Tokuno `yomotsu`: `yomotsuwarrior`, `yomotsupriest`, `yomotsuelder`):
- **Paragon Spawn Rate (`[[resources]] C9`):** Every monster has a **`0.1%` Paragon spawn chance** across all difficulty levels.
- **Bestiary Kill Milestones (`[[resources]] C18`):** Each normal monster tracks **5 kill milestones (`500` to `10,000` kills)**, and each completed milestone grants **`+0.2%` permanent XP** (`+1.0%` per fully mastered creature).
