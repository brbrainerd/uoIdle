# Phase 4: ModernUO Reference KB & Baseline Combat Simulator — Context

**Gathered:** 2026-11-06
**Status:** Ready for planning
**Mode:** Autonomous Smart Discuss

<domain>
## Phase Boundary

Phase 4 documents the canonical ModernUO Bushido and Ninjitsu C# source files (extracted in Phase 1 under `mechanics/_raw/modernuo/`) into claim-verified KB pages (`mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md`), authors the side-by-side ModernUO-to-UO-Idle adaptation specification (`design/MODERNUO_MAPPING.md`), and builds the deterministic tick-accurate baseline combat simulator (`tools/sim_balance.ts` + `src/sim/`) reproducing live Warrior, Mage, and Ranger combat curves across Early, Mid, Late, and Endgame brackets and 4 enemy archetypes.

</domain>

<decisions>
## Implementation Decisions

### ModernUO Bushido & Ninjitsu KB Pages (`SIM-01`)
- **`mechanics/classes/modernuo-bushido.md` & `mechanics/classes/modernuo-ninjitsu.md` (plus supporting `mechanics/modernuo/*` pages if needed for `sources[0]` coverage):**
  - Because `kb.py` verifies `(raw L<a>-L<b>)` claims exclusively against `sources[0]`, either:
    - Author per-file or grouped `mechanics/modernuo/*.md` pages (where each `.cs` file in `mechanics/_raw/modernuo/` is `sources[0]` on a page) and cross-link them into `mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md`, OR
    - Author `mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md` alongside focused `mechanics/modernuo/bushido-*.md` / `mechanics/modernuo/ninjitsu-*.md` pages so that all 8 Bushido mechanics (*Weapon Parry*, *Perfection & Honor*, *Honorable Execution*, *Confidence*, *Counter Attack*, *Lightning Strike*, *Evasion*, *Momentum Strike*) and all 9 Ninjitsu mechanics (*Mirror Image*, *Focus Attack*, *Backstab*, *Smoke Bomb & Stealth*, *Shadowjump*, *Surprise Attack*, *Ki Attack*, *Death Strike*, *Animal Form* + Ninjitsu items *Shuriken*, *Fukiya*, *Egg Bomb*) have verbatim `[modernuo-stated]` `(raw L<a>-L<b>)` citations against their exact `.cs` files!
  - Let's ensure both `mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md` exist at those exact paths (to satisfy `ROADMAP.md` Success Criterion 1) and pass `python3 mechanics/tools/kb.py check --root mechanics` with 0 errors.

### ModernUO-to-UO-Idle Adaptation Matrix (`design/MODERNUO_MAPPING.md`, `SIM-01`)
- **`design/MODERNUO_MAPPING.md`:**
  - Comprehensive side-by-side design document mapping all 8 Bushido mechanics and 9 Ninjitsu mechanics (+ Tokuno items *Shuriken*, *Fukiya*, *Smoke Bomb*, *Egg Bomb*) from canonical ModernUO C# rules (active targeting, spatial distance, tile movement, hiding/stealth checks, weapon parry formula, perfection scaling) into automated UO Idle 1D tick-loop state-machine primitives:
    - Maps each mechanic to **Mode A** (100% existing UO Idle engine opcodes from `mechanics/topics/engine-capability-matrix.md`: `self_buff`, `direct_damage`, `dot`, `debuff`, `heal`, `WeaponAbility`, `SpecialMove`, `Passive`) and **Mode B** (`<20 LOC` server C# hook extension for `Perfection` streak counter, reactive `CounterAttack` on parry, ablative `MirrorImage` clone stack, and 5-swing `DeathStrike` delayed detonation).
    - Reconciles the 6 pre-existing `samurai_*` and 6 pre-existing `ninja_*` entries in `abilities-catalog.json` with the full 12-milestone `gE` L1–60 progression architecture codified in `mechanics/topics/class-structural-parity.md`.

### Deterministic Tick-Accurate Combat Simulator (`tools/sim_balance.ts`, `SIM-02`)
- **Simulator Architecture (`src/sim/` + `tools/sim_balance.ts`):**
  - Implements UO Idle's exact verified combat math from Phase 2 (`damage-and-defense.md`, `tick-and-cooldowns.md`, `resources.md`, `status-effects.md`):
    - Tick resolution (`100ms` deterministic simulation step), weapon swing timer (`Sg`), hit chance (`vq`/`Gs`), crit chance (`yq`), physical/elemental damage and resistance mitigation (`fj`/`Zo`), spell damage (`jq`), DoT ticks (`Mq`), heals (`wq`) and potion sustain (`15%/25%/35%`), mana/stamina regeneration (`Eq`) and Warrior 0-mana / Chivalry tithe rules, hotbar slot priority queue (`ro(e)`) with `2,000ms` `Custom` cooldown floor, and posture modifiers (`Attack`, `Defensive`, `Precision`).
  - **4 Level Brackets:**
    - **Early (`L10`)**, **Mid (`L25`)**, **Late (`L45`)**, **Endgame (`L60`)** with canonical stat/skill/equipment progression budgets per bracket derived from `progression-unlocks.md` and `equipment-affixes.md`.
  - **4 Enemy Archetypes:**
    - **Fast Trash Wave** (low HP, low defense, tests overkill waste and cooldown cycling / TTK).
    - **Low-Defense Boss** (high HP, low resistances, tests raw sustained throughput).
    - **High-Defense Boss** (high HP, high physical/elemental resistances + high attack damage, tests armor penetration/elemental bypass and EHP/sustain).
    - **Multi-Target Pack (2–3 targets)** (tests cleave/AoE scaling such as `Momentum Strike`, `Whirlwind Attack`, `Chain Lightning`, `Multi-Shot`).
  - **4 Core Telemetry Metrics:**
    - **Sustained Boss DPS**, **Trash TTK (sec, with overkill waste %)**, **Net Resource Delta/min (Mana & Stamina sustainability)**, and **Effective HP / Net Sustain (`EHP/sec`)**.
  - CLI supports `npx tsx tools/sim_balance.ts --baseline --json` (and `--verify`) for automated verification in Phase 4 and extensible 5-class parity simulation in Phase 5.

</decisions>

<specifics>
## Specific Ideas & Citations

- Use dedicated `mechanics/modernuo/*.md` pages (or `sources[0]` per C# file) so every single Bushido and Ninjitsu `.cs` file in `mechanics/_raw/modernuo/` can be cited with verbatim `[modernuo-stated]` `(raw L<a>-L<b>)` claims and cross-linked from `mechanics/classes/modernuo-bushido.md` and `mechanics/classes/modernuo-ninjitsu.md`.
- Keep all KB `## Summary` sections 100% digit-free.

</specifics>

<deferred>
## Deferred Ideas

- Finalizing Samurai and Ninja drop-in JSON definitions (`design/drop-in/{samurai,ninja}.json`) and 5-class parity tuning (`design/BALANCE_REPORT.md`) are Phase 5 deliverables (`CLASS-01..04`, `SIM-03`).
</deferred>
