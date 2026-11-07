---
id: "ninjitsu-focus-attack"
title: "Ninjitsu Focus Attack Melee Damage and Property Multiplier"
category: "modernuo-ninjitsu"
aliases: ["focus-attack", "ninja-focus", "ninja-move"]
status: "modernuo-stated"
sources: ["_raw/modernuo/FocusAttack.cs", "_raw/modernuo/NinjaMove.cs"]
evidence: ["modernuo: _raw/modernuo/NinjaMove.cs:3-11", "modernuo: _raw/modernuo/SpecialMove.cs:61-61"]
code_refs: ["ModernUO:Spells.Ninjitsu.FocusAttack", "ModernUO:Spells.NinjaMove"]
updated: "2026-11-07"
---
# Ninjitsu Focus Attack Melee Damage and Property Multiplier

Source: [raw](../_raw/modernuo/FocusAttack.cs)

## Summary

Focus Attack is a core Ninjitsu weapon special move that channels the Ninja's concentration into a single shieldless melee strike, quadratically increasing both the weapon damage scalar and the on-hit magical property proc multiplier. Attempting to activate Focus Attack while holding a shield or wielding a ranged weapon is rejected by the move validator. See [[modernuo-ninjitsu]] for how Focus Attack anchors the Ninja active strike rotation.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => Core.ML ? 10 : 20; public override double RequiredSkill => Core.ML ? 30.0 : 60;" (raw L7-L8)
- **C2** [modernuo-stated] "var twoHanded = from.FindItemOnLayer(Layer.TwoHanded); if (twoHanded is BaseShield) { from.SendLocalizedMessage(1063096); // You cannot use this ability while holding a shield. return false; } var meleeWeapon = twoHanded is BaseWeapon and not BaseRanged || from.FindItemOnLayer(Layer.OneHanded) is BaseWeapon and not BaseRanged; if (meleeWeapon) { return base.Validate(from); }" (raw L15-L29)
- **C3** [modernuo-stated] "public override double GetDamageScalar(Mobile attacker, Mobile defender) { var ninjitsu = attacker.Skills.Ninjitsu.Value; return 1.0 + ninjitsu * ninjitsu / 43636; }" (raw L35-L40)
- **C4** [modernuo-stated] "public override double GetPropertyBonus(Mobile attacker) { var ninjitsu = attacker.Skills.Ninjitsu.Value; var bonus = ninjitsu * ninjitsu / 43636; return 1.0 + (bonus * 3 + 0.01); }" (raw L42-L49)

## Focus Attack and NinjaMove Mechanics

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana & Required Skill** | Costs `10` base mana (`Core.ML`; `20` pre-ML; `ninja_focus` in `abilities-catalog.json` uses `ref: 500` and `10` mana per `[[status-effects]] C9`) and requires `30.0` Ninjitsu (`Core.ML`; `60.0` pre-ML) | `BaseMana = 10`, `RequiredSkill = 30.0` | **C1**, `[[status-effects]] C9` |
| **Weapon & Shield Validation (`Validate`)** | Disallows `BaseShield` on `Layer.TwoHanded` and requires a non-ranged `BaseWeapon` (`not BaseRanged`) on `Layer.OneHanded` or `Layer.TwoHanded` | Melee weapon without a shield | **C2** |
| **Damage Scalar (`GetDamageScalar`)** | Quadratic Ninjitsu damage bonus (`+22.9%` at `100.0` Ninjitsu; `+33.0%` at `120.0` Ninjitsu) | `1.0 + Ninjitsu^2 / 43636` | **C3** |
| **Property Bonus (`GetPropertyBonus`)** | Multiplies weapon on-hit property effects (`+69.75%` at `100.0` Ninjitsu; `+100.0%` at `120.0` Ninjitsu) | `1.0 + (Ninjitsu^2 / 43636 * 3 + 0.01)` | **C4** |
| **`NinjaMove` Base Class (`NinjaMove.cs:3-11`)** | Sets `MoveSkill => SkillName.Ninjitsu` and checks skill gain across `RequiredSkill - 12.5` to `RequiredSkill + 37.5` | `MoveSkill = SkillName.Ninjitsu` | **C1** |
