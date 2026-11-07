---
id: "bushido-evasion"
title: "Bushido Evasion Parry Multiplier, Spell Evasion, and Stance Lockout"
category: "modernuo-bushido"
aliases: ["evasion", "samurai-evasion", "samurai-spell", "book-of-bushido"]
status: "modernuo-stated"
sources: ["_raw/modernuo/Evasion.cs", "_raw/modernuo/SamuraiSpell.cs", "_raw/modernuo/BookOfBushido.cs"]
evidence: ["modernuo: _raw/modernuo/SamuraiSpell.cs:16-27", "modernuo: _raw/modernuo/SamuraiSpell.cs:91-104", "modernuo: _raw/modernuo/BookOfBushido.cs:8-15", "modernuo: _raw/modernuo/BaseWeapon.cs:1556-1559"]
code_refs: ["ModernUO:Spells.Bushido.Evasion", "ModernUO:Spells.Bushido.SamuraiSpell", "ModernUO:Items.BookOfBushido"]
updated: "2026-11-07"
---
# Bushido Evasion Parry Multiplier, Spell Evasion, and Stance Lockout

Source: [raw](../_raw/modernuo/Evasion.cs)

## Summary

Evasion is a high-tier Bushido defensive stance spell that multiplies the caster's weapon or shield parry probability and enables the Samurai to completely evade direct-damage spells using their parry check. Both the active duration and the multiplicative parry scalar scale with Bushido skill and receive a Grandmaster synergy bonus when paired with Grandmaster Anatomy and Tactics. Casting Evasion triggers a fixed action cooldown lockout before Evasion can be cast again, and the shared Samurai spell base class enforces mutual exclusion across Evasion, Confidence, and Counter Attack. See [[modernuo-bushido]] for how the Evasion parry scalar multiplies weapon parry chance.

## Claims

- **C1** [modernuo-stated] "public override TimeSpan CastDelayBase => TimeSpan.FromSeconds(0.25); public override double RequiredSkill => 60.0; public override int RequiredMana => 10;" (raw L22-L25)
- **C2** [modernuo-stated] "if (IsEvading(defender) && BaseWeapon.CheckParry(defender)) { defender.Emote("*evades*"); // Yes. Eew. Blame OSI. defender.FixedEffect(0x37B9, 10, 16); return true; }" (raw L106-L111)
- **C3** [modernuo-stated] "Caster.BeginAction<Evasion>(); Timer.StartTimer(TimeSpan.FromSeconds(20.0), Caster.EndAction<Evasion>);" (raw L135-L136)
- **C4** [modernuo-stated] "double seconds = 3; if (m.Skills.Bushido.Value > 60) { seconds += (m.Skills.Bushido.Value - 60) / 20; } // Bushido being HIGHER than 100 for bonus is intended if (m.Skills.Anatomy.Value >= 100.0 && m.Skills.Tactics.Value >= 100.0 && m.Skills.Bushido.Value > 100.0) { seconds++; } return TimeSpan.FromSeconds((int)seconds);" (raw L159-L172)
- **C5** [modernuo-stated] "double bonus = 0; if (m.Skills.Bushido.Value >= 60) { bonus += (m.Skills.Bushido.Value - 60) * .004 + 0.16; } // Bushido being HIGHER than 100 for bonus is intended if (m.Skills.Anatomy.Value >= 100 && m.Skills.Tactics.Value >= 100 && m.Skills.Bushido.Value > 100) { bonus += 0.10; } return 1.0 + bonus;" (raw L191-L204)

## Evasion Formulas and SamuraiSpell Base Architecture

| Mechanic / Class | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Cast Delay, Skill & Mana** | Fast `0.25s` cast time requiring `60.0` Bushido, `10` Mana, and weapon skill `>= 50` (or shield) | `CastDelayBase = 0.25s`, `RequiredSkill = 60.0`, `RequiredMana = 10` | **C1** |
| **Spell Evasion (`CheckSpellEvasion`)** | Allows a non-casting defender with `IsEvading(defender)` to completely evade incoming spells via `BaseWeapon.CheckParry(defender)` | `IsEvading(defender) && BaseWeapon.CheckParry(defender)` | **C2**, `[[modernuo-bushido]] C3` |
| **Recast Cooldown Lockout** | Locks `Caster.BeginAction<Evasion>()` for `20.0` seconds on cast | `20.0s` cooldown lock | **C3** |
| **Active Duration (`GetEvadeDuration`)** | Scales from `3` to `5` seconds at `60..100` Bushido (`3 + (Bushido - 60) / 20`), up to `6..7` seconds above `100` Bushido with `Anatomy >= 100` and `Tactics >= 100` | `seconds = 3 + (Bushido - 60) / 20 + (GM_Synergy ? 1 : 0)` | **C4** |
| **Parry Multiplier (`GetParryScalar`)** | Multiplies `BaseWeapon.CheckParry` chance by `1.16x` (`60` Bushido) to `1.32x` (`100` Bushido), or up to `1.50x` (`120` Bushido + GM Anatomy/Tactics) | `1.0 + 0.16 + (Bushido - 60) * 0.004 + (GM_Synergy ? 0.10 : 0)` | **C5**, `[[modernuo-bushido]] C4` |
| **`SamuraiSpell` Mutual Stance Exclusion (`SamuraiSpell.cs:99-104`)** | `OnCastSuccessful` calls `Evasion.EndEvasion(caster)`, `Confidence.EndConfidence(caster)`, and `CounterAttack.StopCountering(caster)` so only one Bushido stance can be active at a time | Mutual exclusion of `Evasion`, `Confidence`, and `CounterAttack` | **C1** |
| **`BookOfBushido` (`BookOfBushido.cs:8-15`)** | Defines `BookOffset => 400`, `BookCount => 6`, `ItemID = 0x238C` (`400` `HonorableExecution`, `401` `Confidence`, `402` `Evasion`, `403` `CounterAttack`, `404` `LightningStrike`, `405` `MomentumStrike`) | `BookOffset = 400`, `BookCount = 6` | **C1** |
