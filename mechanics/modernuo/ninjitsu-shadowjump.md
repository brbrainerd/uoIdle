---
id: "ninjitsu-shadowjump"
title: "Ninjitsu Shadowjump Stealth Teleportation"
category: "modernuo-ninjitsu"
aliases: ["shadowjump", "ninja-shadowjump"]
status: "modernuo-stated"
sources: ["_raw/modernuo/ShadowJump.cs"]
evidence: ["modernuo: _raw/modernuo/NinjaSpell.cs:14-25"]
code_refs: ["ModernUO:Spells.Ninjitsu.Shadowjump"]
updated: "2026-11-07"
---
# Ninjitsu Shadowjump Stealth Teleportation

Source: [raw](../_raw/modernuo/ShadowJump.cs)

## Summary

Shadowjump is a Ninjitsu teleportation spell that relocates a stealthing Ninja to a targeted ground coordinate without breaking stealth. Casting Shadowjump requires the caster to already be in active stealth mode, checks standard travel and house region restrictions, teleports the caster across the target range, and immediately executes a post-teleport Stealth skill check to determine whether the Ninja remains hidden at the destination. See [[modernuo-ninjitsu]] for how Shadowjump bridges stealth openers and gap-closing combat rotations.

## Claims

- **C1** [modernuo-stated] "public override TimeSpan CastDelayBase => TimeSpan.FromSeconds(1.0); public override double RequiredSkill => 50.0; public override int RequiredMana => 15; public override bool BlockedByAnimalForm => false; public int TargetRange => 11;" (raw L24-L31)
- **C2** [modernuo-stated] "if ((Caster as PlayerMobile)?.IsStealthing != true) { Caster.SendLocalizedMessage(1063087); // You must be in stealth mode to use this ability. }" (raw L43-L46)
- **C3** [modernuo-stated] "var m = Caster; m.Location = to; m.ProcessDelta(); Effects.SendLocationParticles( EffectItem.Create(from, m.Map, EffectItem.DefaultDuration), 0x3728, 10, 10, 2023 ); m.PlaySound(0x512); Stealth.OnUse(m); // stealth check after the shadow jump" (raw L79-L95)

## Shadowjump Mechanics

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Cast Delay, Skill, Mana & Range** | `1.0s` cast delay, `50.0` Ninjitsu, `15` Mana (`ninja_shadowjump` in `abilities-catalog.json` uses `ref: 506` and `15` mana per `[[status-effects]] C12`), `BlockedByAnimalForm => false`, `TargetRange => 11` tiles | `CastDelayBase = 1.0s`, `RequiredSkill = 50.0`, `RequiredMana = 15`, `TargetRange = 11` | **C1**, `[[status-effects]] C12` |
| **Stealth Prerequisite (`CheckCast` & `Target`)** | Requires `(Caster as PlayerMobile)?.IsStealthing == true` both when initiating cast (`L101`) and when resolving the ground target (`L43`) | Active stealth required | **C2** |
| **Post-Teleport Stealth Check** | Moves `Caster` to `to` and calls `Stealth.OnUse(m)` immediately after teleporting | Preserves stealth state on successful `Stealth.OnUse` roll | **C3** |
