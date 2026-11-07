---
id: "ninjitsu-stealth-hiding"
title: "Ninjitsu Smoke Bomb and Egg Bomb Combat Hiding Override"
category: "modernuo-ninjitsu"
aliases: ["smoke-bomb", "egg-bomb", "stealth-hiding", "combat-override"]
status: "modernuo-stated"
sources: ["_raw/modernuo/SmokeBomb.cs", "_raw/modernuo/EggBomb.cs"]
evidence: ["modernuo: _raw/modernuo/EggBomb.cs:9-58"]
code_refs: ["ModernUO:Items.SmokeBomb", "ModernUO:Items.EggBomb"]
updated: "2026-11-07"
---
# Ninjitsu Smoke Bomb and Egg Bomb Combat Hiding Override

Source: [raw](../_raw/modernuo/SmokeBomb.cs)

## Summary

Smoke Bombs and Egg Bombs are consumable Ninjitsu skill items that enable a Ninja to enter stealth mid-combat by temporarily setting the global Hiding combat-override flag. Using either item requires the item to reside in the player's backpack, checks a minimum Ninjitsu skill threshold, verifies that the player is not on skill cooldown, and consumes both the item and a flat mana cost when the Hiding skill check succeeds. See [[modernuo-ninjitsu]] for how Smoke Bomb and Egg Bomb enable mid-combat Backstab, Surprise Attack, and Shadowjump transitions.

## Claims

- **C1** [modernuo-stated] "[Constructible] public SmokeBomb() : base(0x2808) => Stackable = Core.ML; public override double DefaultWeight => 1.0;" (raw L9-L12)
- **C2** [modernuo-stated] "else if (from.Skills.Ninjitsu.Value < 50.0) { // You need at least ~1_SKILL_REQUIREMENT~ ~2_SKILL_NAME~ skill to use that ability. from.SendLocalizedMessage(1063013, "50\tNinjitsu"); }" (raw L21-L25)
- **C3** [modernuo-stated] "else if (from.Mana < 10) { // You don't have enough mana to do that. from.SendLocalizedMessage(1049456); }" (raw L31-L35)
- **C4** [modernuo-stated] "Hiding.CombatOverride = true; if (from.UseSkill(SkillName.Hiding)) { from.Mana -= 10; from.FixedParticles(0x3709, 1, 30, 9904, 1108, 6, EffectLayer.RightFoot); from.PlaySound(0x22F); Consume(); } Hiding.CombatOverride = false;" (raw L38-L50)

## Smoke Bomb and Egg Bomb Specifications

| Item / Parameter | Canonical ModernUO Rule | Value / Formula | Claim Citation |
|---|---|---|---|
| **Item Properties (`SmokeBomb` & `EggBomb`)** | `ItemID = 0x2808` (`EggBomb` adds `LabelNumber => 1030249` in `EggBomb.cs:18`), `Stackable = Core.ML`, `DefaultWeight = 1.0` | Stackable backpack consumable | **C1** |
| **Skill Gate** | Requires `from.Skills.Ninjitsu.Value >= 50.0` and `Core.TickCount - from.NextSkillTime >= 0` | `50.0` Ninjitsu | **C2** |
| **Mana Cost** | Requires `from.Mana >= 10` and deducts `from.Mana -= 10` on use | `10` Mana | **C3**, **C4** |
| **Combat Hiding Override** | Sets `Hiding.CombatOverride = true`, invokes `from.UseSkill(SkillName.Hiding)`, consumes `1` charge on success, and resets `Hiding.CombatOverride = false` (identical in `EggBomb.cs:44-57`) | Instant combat stealth entry | **C4** |
