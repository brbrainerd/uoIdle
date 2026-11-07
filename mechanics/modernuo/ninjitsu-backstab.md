---
id: "ninjitsu-backstab"
title: "Ninjitsu Backstab Stealth Opener and Stalking Multiplier"
category: "modernuo-ninjitsu"
aliases: ["backstab", "ninja-backstab"]
status: "modernuo-stated"
sources: ["_raw/modernuo/Backstab.cs"]
evidence: ["modernuo: _raw/modernuo/SurpriseAttack.cs:18-40"]
code_refs: ["ModernUO:Spells.Ninjitsu.Backstab"]
updated: "2026-11-07"
---
# Ninjitsu Backstab Stealth Opener and Stalking Multiplier

Source: [raw](../_raw/modernuo/Backstab.cs)

## Summary

Backstab is a Ninjitsu stealth-opener weapon special move that requires the Ninja to be hidden with remaining stealth steps before swinging. Connecting or missing with Backstab immediately reveals the attacker, locks the Stealth skill for a brief cooldown window, and scales melee damage with both Ninjitsu skill and the Tracking stalking bonus. See [[modernuo-ninjitsu]] and [[ninjitsu-stealth-hiding]] for how combat stealth transitions feed into Backstab.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => 30; public override double RequiredSkill => Core.ML ? 40.0 : 20.0; // You prepare to Backstab your opponent. public override TextDefinition AbilityMessage { get; } = 1063089; public override bool ValidatesDuringHit => false;" (raw L8-L14)
- **C2** [modernuo-stated] "public override double GetDamageScalar(Mobile attacker, Mobile defender) { var ninjitsu = attacker.Skills.Ninjitsu.Value; return 1.0 + ninjitsu / 360 + Tracking.GetStalkingBonus(attacker, defender) / 100; }" (raw L16-L21)
- **C3** [modernuo-stated] "public override bool Validate(Mobile from) { if (!from.Hidden || from.AllowedStealthSteps <= 0) { from.SendLocalizedMessage(1063087); // You must be in stealth mode to use this ability. return false; } return base.Validate(from); }" (raw L23-L32)
- **C4** [modernuo-stated] "if (valid) { attacker.BeginAction<Stealth>(); Timer.StartTimer(TimeSpan.FromSeconds(5.0), attacker.EndAction<Stealth>); }" (raw L38-L42)

## Backstab Mechanics

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana & Required Skill** | Costs `30` base mana and requires `40.0` Ninjitsu (`Core.ML`; `20.0` pre-ML) | `BaseMana = 30`, `RequiredSkill = 40.0`, `ValidatesDuringHit = false` | **C1** |
| **Damage Scalar (`GetDamageScalar`)** | Linear Ninjitsu bonus (`+27.8%` at `100.0` Ninjitsu, `+33.3%` at `120.0` Ninjitsu) plus `Tracking.GetStalkingBonus(attacker, defender) / 100` | `1.0 + Ninjitsu / 360 + StalkingBonus / 100` | **C2** |
| **Stealth Prerequisite (`Validate`)** | Requires `from.Hidden && from.AllowedStealthSteps > 0` prior to the swing | Active stealth mode required | **C3** |
| **Stealth Lockout & Reveal (`OnBeforeSwing` / `OnHit` / `OnMiss`)** | Consumes mana before swinging, locks `attacker.BeginAction<Stealth>()` for `5.0` seconds, and calls `attacker.RevealingAction()` on hit or miss | `5.0s` Stealth lockout + instant reveal | **C4** |
