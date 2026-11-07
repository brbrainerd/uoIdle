---
id: "ninjitsu-mirror-image"
title: "Ninjitsu Mirror Image Clone Summon and Interception"
category: "modernuo-ninjitsu"
aliases: ["mirror-image", "ninja-mirror", "clone", "book-of-ninjitsu"]
status: "modernuo-stated"
sources: ["_raw/modernuo/MirrorImage.cs", "_raw/modernuo/BookOfNinjitsu.cs"]
evidence: ["modernuo: _raw/modernuo/BaseWeapon.cs:1734-1755", "modernuo: _raw/modernuo/BookOfNinjitsu.cs:8-15"]
code_refs: ["ModernUO:Spells.Ninjitsu.MirrorImage", "ModernUO:Mobiles.Clone", "ModernUO:Items.BookOfNinjitsu"]
updated: "2026-11-07"
---
# Ninjitsu Mirror Image Clone Summon and Interception

Source: [raw](../_raw/modernuo/MirrorImage.cs)

## Summary

Mirror Image is a signature Ninjitsu defensive spell that summons an uncommandable visual duplicate of the Ninja at the caster's location. Each summoned clone occupies a follower slot, copies the caster's appearance, equipment, and skill values, and persists for a Ninjitsu-scaled duration. Whenever the caster is struck in melee while a clone is nearby, the combat engine rolls a Ninjitsu-scaled probability to divert the incoming blow onto a clone, which is destroyed immediately upon taking any damage. See [[modernuo-bushido]] and [[modernuo-ninjitsu]] for the melee hit diversion hook.

## Claims

- **C1** [modernuo-stated] "public override TimeSpan CastDelayBase => TimeSpan.FromSeconds(1.5); public override double RequiredSkill => Core.ML ? 20.0 : 40.0; public override int RequiredMana => 10; public override bool BlockedByAnimalForm => false;" (raw L27-L32)
- **C2** [modernuo-stated] "if (Caster.Mounted) { Caster.SendLocalizedMessage(1063132); // You cannot use this ability while mounted. return false; } if (Caster.Followers + 1 > Caster.FollowersMax) { // You cannot summon a mirror image because you have too many followers. Caster.SendLocalizedMessage(1063133); return false; }" (raw L57-L68)
- **C3** [modernuo-stated] "var duration = TimeSpan.FromSeconds(30.0 + _caster.Skills.Ninjitsu.Value / 4.0); new UnsummonTimer(this, duration).Start(); SummonEnd = Core.Now + duration; MirrorImage.AddClone(_caster);" (raw L171-L176)
- **C4** [modernuo-stated] "public override void OnDamage(int amount, Mobile from, bool willKill) { Delete(); }" (raw L197-L200)

## Mirror Image Mechanics and BookOfNinjitsu Registry

| Parameter | Canonical ModernUO Rule | Formula / Value | Claim Citation |
|---|---|---|---|
| **Cast Delay, Skill & Mana** | `1.5s` cast delay, `20.0` Ninjitsu (`Core.ML`; `40.0` pre-ML), `10` Mana (`ninja_mirror` in `abilities-catalog.json` uses `ref: 507` and `10` mana per `[[status-effects]] C11`), `BlockedByAnimalForm => false`, cannot be disturbed (`CheckDisturb => false`) | `CastDelayBase = 1.5s`, `RequiredSkill = 20.0`, `RequiredMana = 10` | **C1**, `[[status-effects]] C11` |
| **Mount & Follower Restrictions (`CheckCast`)** | Fails if `Caster.Mounted` or `Caster.Followers + 1 > Caster.FollowersMax` (each `Clone` uses `1` follower slot) | Requires unmounted caster and `>= 1` free follower slot | **C2** |
| **Clone Lifespan (`AddClone`)** | Scales linearly from `35.0s` (`20` Ninjitsu) to `55.0s` (`100` Ninjitsu) or `60.0s` (`120` Ninjitsu) | `duration = 30.0 + Ninjitsu / 4.0` seconds | **C3** |
| **Ablative Single-Hit Destruction (`OnDamage`)** | Any damage dealt to a `Clone` immediately calls `Delete()`, decrementing `_cloneCount[_caster]` in `OnAfterDelete` | `1` hit destroys the clone | **C4** |
| **Melee Hit Diversion (`BaseWeapon.OnHit`)** | When `MirrorImage.HasClone(defender)` is true, rolls `defender.Skills.Ninjitsu.Value / 150.0 > Utility.RandomDouble()` (`66.7%` at `100` Ninjitsu, `80.0%` at `120` Ninjitsu) to redirect the hit to a `Clone` within `4` tiles | `divertChance = Ninjitsu / 150.0` | `[[modernuo-bushido]] C9` |
| **`BookOfNinjitsu` (`BookOfNinjitsu.cs:8-15`)** | Defines `BookOffset => 500`, `BookCount => 8`, `ItemID = 0x23A0` (`500` `FocusAttack`, `501` `DeathStrike`, `502` `AnimalForm`, `503` `KiAttack`, `504` `SurpriseAttack`, `505` `Backstab`, `506` `Shadowjump`, `507` `MirrorImage`) | `BookOffset = 500`, `BookCount = 8` | **C1** |
