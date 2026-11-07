---
id: "bushido-lightning-strike"
title: "Bushido Lightning Strike Accuracy and Critical IgnoreArmor Move"
category: "modernuo-bushido"
aliases: ["lightning-strike", "samurai-lightning"]
status: "modernuo-stated"
sources: ["_raw/modernuo/LightningStrike.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1259-1270", "modernuo: _raw/modernuo/SpecialMove.cs:59-61"]
code_refs: ["ModernUO:Spells.Bushido.LightningStrike"]
updated: "2026-11-07"
---
# Bushido Lightning Strike Accuracy and Critical IgnoreArmor Move

Source: [raw](../_raw/modernuo/LightningStrike.cs)

## Summary

Lightning Strike is a low-mana Bushido weapon special move that grants a massive flat hit-chance accuracy bonus on the next melee swing and rolls a quadratic Bushido-scaled critical chance to bypass all defender physical armor and elemental resistances. Because Lightning Strike sets a delayed special-move context, mana is checked before swinging and consumed when the strike connects. See [[modernuo-bushido]] for how special move accuracy bonuses integrate into the global hit chance cap.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => 5; public override double RequiredSkill => 50.0; public override TextDefinition AbilityMessage { get; } = 1063167; // You prepare to strike quickly. public override bool DelayedContext => true; public override bool ValidatesDuringHit => false; public override int GetAccuracyBonus(Mobile attacker) => 50;" (raw L7-L16)
- **C2** [modernuo-stated] "public override bool IgnoreArmor(Mobile attacker) { var bushido = attacker.Skills.Bushido.Value; var criticalChance = bushido * bushido / 72000.0; return criticalChance >= Utility.RandomDouble(); }" (raw L29-L34)
- **C3** [modernuo-stated] "public override bool OnBeforeSwing(Mobile attacker, Mobile defender) { /* no mana drain before actual hit */ var enoughMana = CheckMana(attacker, false); return Validate(attacker); }" (raw L36-L41)

## Lightning Strike Mechanics

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana & Skill Requirement** | Costs `5` base mana (`abilities-catalog.json` `samurai_lightning` uses `ref: 404` and `10` mana per `[[status-effects]] C13`) and requires `50.0` Bushido | `BaseMana = 5`, `RequiredSkill = 50.0`, `DelayedContext = true` | **C1**, `[[status-effects]] C13` |
| **Accuracy Bonus (`GetAccuracyBonus`)** | Adds `+50` to the attacker's hit-chance bonus pool before the `+45%` HCI cap in `BaseWeapon.CheckHit` | `+50` accuracy bonus (guarantees capped `+45%` HCI) | **C1** |
| **Critical Armor Ignore (`IgnoreArmor`)** | Quadratic Bushido probability to convert the swing into direct `IgnoreArmor` damage | `criticalChance = Bushido^2 / 72000.0` (`13.89%` at `100.0` Bushido; `20.0%` at `120.0` Bushido) | **C2** |
| **Pre-Swing Validation (`OnBeforeSwing`)** | Verifies mana availability before the swing without draining mana until `OnHit` (`CheckMana(attacker, true)`) | Mana consumed on hit connection | **C3** |
