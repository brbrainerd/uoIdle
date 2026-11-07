---
id: "ninjitsu-surprise-attack"
title: "Ninjitsu Surprise Attack Defense Chance Shred"
category: "modernuo-ninjitsu"
aliases: ["surprise-attack", "ninja-surprise-attack"]
status: "modernuo-stated"
sources: ["_raw/modernuo/SurpriseAttack.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1300-1305"]
code_refs: ["ModernUO:Spells.Ninjitsu.SurpriseAttack", "ModernUO:Items.BaseWeapon.CheckHit"]
updated: "2026-11-07"
---
# Ninjitsu Surprise Attack Defense Chance Shred

Source: [raw](../_raw/modernuo/SurpriseAttack.cs)

## Summary

Surprise Attack is a Ninjitsu stealth-opener weapon special move that catches the defender off guard and applies a timed Defense Chance Increase malus. Like Backstab, Surprise Attack requires the Ninja to be hidden with remaining stealth steps before swinging, reveals the attacker on hit or miss, and locks the Stealth skill for a short cooldown window. When the strike connects, the target's effective defense bonus is reduced by a Ninjitsu and Tracking scaled malus for the duration of the debuff timer. See [[modernuo-bushido]] and [[modernuo-ninjitsu]] for the hit-chance malus hook in the weapon combat engine.

## Claims

- **C1** [modernuo-stated] "public override int BaseMana => 20; public override double RequiredSkill => Core.ML ? 60.0 : 30.0; public override TextDefinition AbilityMessage { get; } = 1063128; // You prepare to surprise your prey. public override bool ValidatesDuringHit => false;" (raw L11-L16)
- **C2** [modernuo-stated] "public override bool Validate(Mobile from) { if (!from.Hidden || from.AllowedStealthSteps <= 0) { from.SendLocalizedMessage(1063087); // You must be in stealth mode to use this ability. return false; } return base.Validate(from); }" (raw L18-L27)
- **C3** [modernuo-stated] "var ninjitsu = attacker.Skills.Ninjitsu.Fixed; var malus = ninjitsu / 60 + (int)Tracking.GetStalkingBonus(attacker, defender); var timer = new SurpriseAttackTimer(defender, malus);" (raw L57-L61)
- **C4** [modernuo-stated] "public SurpriseAttackTimer(Mobile target, int effect) : base(TimeSpan.FromSeconds(8.0)) { Target = target; Malus = effect; }" (raw L108-L112)

## Surprise Attack Mechanics

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Base Mana & Required Skill** | Costs `20` base mana and requires `60.0` Ninjitsu (`Core.ML`; `30.0` pre-ML) | `BaseMana = 20`, `RequiredSkill = 60.0`, `ValidatesDuringHit = false` | **C1** |
| **Stealth Prerequisite & Reveal** | Requires `from.Hidden && from.AllowedStealthSteps > 0`, applies a `5.0s` `Stealth` lockout on swing, and calls `attacker.RevealingAction()` on hit or miss | Active stealth required | **C2** |
| **Defense Chance Malus (`OnHit`)** | Computes `malus` from `Ninjitsu.Fixed` (`1000` at `100.0` Ninjitsu $\rightarrow$ `16` DCI malus; `1200` at `120.0` Ninjitsu $\rightarrow$ `20` DCI malus) plus `Tracking.GetStalkingBonus`, subtracted from defender DCI in `BaseWeapon.CheckHit` | `malus = Ninjitsu.Fixed / 60 + (int)StalkingBonus` | **C3**, `[[modernuo-bushido]] C9` |
| **Debuff Duration (`SurpriseAttackTimer`)** | Applies the defense malus to `defender` for `8.0` seconds | `8.0s` duration | **C4** |
