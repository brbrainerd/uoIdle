---
id: "ninjitsu-ki-attack"
title: "Ninjitsu Ki Attack Gap-Closing Distance Damage Multiplier"
category: "modernuo-ninjitsu"
aliases: ["ki-attack", "ninja-ki-attack"]
status: "modernuo-stated"
sources: ["_raw/modernuo/KiAttack.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1779-1782"]
code_refs: ["ModernUO:Spells.Ninjitsu.KiAttack"]
updated: "2026-11-07"
---
# Ninjitsu Ki Attack Gap-Closing Distance Damage Multiplier

Source: [raw](../_raw/modernuo/KiAttack.cs)

## Summary

Ki Attack is a high-skill Ninjitsu melee special move that rewards rapid gap-closing movement between activation and strike delivery. Activating Ki Attack records the Ninja's starting coordinates and starts a short expiration timer; when a melee hit connects before the timer expires, the damage scalar increases with the Euclidean tile distance traveled from the origin up to a maximum distance cap. Ki Attack cannot be used while in stealth mode or with ranged weapons. See [[modernuo-ninjitsu]] for how Ki Attack translates into an automated gap-closer burst skill.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => 25; public override double RequiredSkill => 80.0; // Your Ki Attack must be complete within 2 seconds for the damage bonus! public override TextDefinition AbilityMessage { get; } = 1063099;" (raw L11-L15)
- **C2** [modernuo-stated] "public override bool Validate(Mobile from) { if (from.Hidden && from.AllowedStealthSteps > 0) { from.SendLocalizedMessage(1063127); // You cannot use this ability while in stealth mode. return false; } if (Core.ML && from.Weapon is BaseRanged) { from.SendLocalizedMessage(1075858); // You can only use this with melee attacks. return false; } return base.Validate(from); }" (raw L29-L44)
- **C3** [modernuo-stated] "public override double GetDamageScalar(Mobile attacker, Mobile defender) { if (attacker.Hidden) { return 1.0; } /* * Pub40 changed pvp damage max to 55% */ return 1.0 + GetBonus(attacker) / (Core.ML && attacker.Player && defender.Player ? 40 : 10); }" (raw L46-L57)
- **C4** [modernuo-stated] "var xDelta = t._location.X - from.X; var yDelta = t._location.Y - from.Y; return Math.Min(Math.Sqrt(xDelta * xDelta + yDelta * yDelta), 20.0); } private class KiAttackTimer : Timer { public Mobile _mobile; public Point3D _location; public KiAttackTimer(Mobile m) : base(TimeSpan.FromSeconds(2.0)) { _mobile = m; _location = m.Location; }" (raw L100-L115)

## Ki Attack Mechanics

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana & Required Skill** | Costs `25` base mana and requires `80.0` Ninjitsu | `BaseMana = 25`, `RequiredSkill = 80.0` | **C1** |
| **Stealth & Weapon Restrictions (`Validate`)** | Disallows activation while `from.Hidden && from.AllowedStealthSteps > 0` or when wielding a `BaseRanged` weapon (`Core.ML`) | Visible melee combat only | **C2** |
| **Completion Window & Distance Cap (`KiAttackTimer` & `GetBonus`)** | Starts a `2.0s` timer recording `_location = m.Location`; computes Euclidean distance `Math.Min(Math.Sqrt(xDelta^2 + yDelta^2), 20.0)` | `2.0s` window, `20.0`-tile cap | **C4** |
| **Damage Scalar (`GetDamageScalar`)** | Adds `GetBonus(attacker) / 10` in PvM (up to `3.0x` at `20` tiles) or `GetBonus(attacker) / 40` in ML PvP (up to `1.50x` at `20` tiles) | `1.0 + distance / (PvP ? 40 : 10)` | **C3** |
