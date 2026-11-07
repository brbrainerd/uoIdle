# Phase 5: Samurai & Ninja Skill Line Design, Parity Tuning & Drop-in Code - Research

**Researched:** 2026-11-06
**Domain:** Bushido (Samurai) & Ninjitsu (Ninja) L1–60 Class Specifications, Deterministic Combat Parity Tuning (`src/sim/engine.ts`), Schema-Validated Drop-in JSON/JS Artifacts (`design/drop-in/*`), and Balance Verification (`design/BALANCE_REPORT.md`)
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

### Class Progression & Skill Kit Architecture (`CLASS-01`, `CLASS-02`)
- **Normalized 12–13 Milestone L1–60 Progression**:
  - Override the abnormal raw catalog `unlockLevel` jumps (`75 / 200 / 300`) present in `abilities-catalog.json` (`mechanics/_raw/bundle/abilities-catalog.json:1395-1660`) and normalize both `samurai` (`classNumericId: 114`) and `ninja` (`classNumericId: 115`) onto the standard 12-milestone `gE` progression cadence (`L1, L5, L10, L15, L20, L25, L30, L35, L40, L45, L50, L60`) documented in `design/MODERNUO_MAPPING.md:273-325`.
  - Preserve the 6 pre-existing catalog ability IDs per class (`samurai_lightning`, `samurai_counter`, `samurai_honorable`, `samurai_way`, `samurai_honorable_r2`, `samurai_lightning_r2`; `ninja_focus`, `ninja_death`, `ninja_mirror`, `ninja_shadowjump`, `ninja_death_r2`, `ninja_mirror_r2`) at their normalized milestone levels, and fill the remaining 6–7 progression slots with authentic ModernUO Bushido (`400–405`), Ninjitsu (`500–507`), and Tokuno weapon abilities (`DoubleStrike`, `ArmorIgnore`, `InfectiousStrike`, `SmokeBomb`, `Shuriken`/`Fukiya`).
- **Dual-Mode Specification (Mode A Engine-Strict vs Mode B Authentic Extension)**:
  - Every ability in `design/SAMURAI_SPEC.md`, `design/NINJA_SPEC.md`, `design/drop-in/samurai.json`, and `design/drop-in/ninja.json` must document both **Mode A (Engine-Strict)** mappings (using only existing `StatusEffectType`, `ModifierStat`, and `EffectType` primitives verified in `mechanics/topics/engine-capability-matrix.md`) and **Mode B (Authentic Extension)** behavior (Perfection streak scaling + Honor on-kill recovery, Evasion spell interception, Counter Attack parry auto-trigger, Death Strike 5-swing detonation, Mirror Image clone pool, and Tokuno weapon unlocks).

### Quantitative Balance & Parity Envelope (`SIM-03`, `CLASS-03`)
- **$\pm 5\text{–}8\%$ Parity Envelope Across All Four Brackets (`L10`, `L25`, `L45`, `L60`)**:
  - Tune cooldowns, mana/stamina costs, min/max damage multipliers, status durations, and execute thresholds in `design/drop-in/samurai.json` and `design/drop-in/ninja.json` so that `tools/sim_balance.ts` shows both classes within $\pm 5\text{–}8\%$ of the live Warrior/Mage/Ranger baseline (`data/sim-baselines/baseline-v0.99.0.json`) across `L10`, `L25`, `L45`, and `L60`.
  - Maintain each class's distinct combat niche from `mechanics/topics/combat-niches.md`:
    - **Samurai (Bushido)**: Sustained reactive duelist & posture counter-fighter — competitive single-target boss DPS (`low_def_boss` and `high_def_boss`), strong 2-target cleave via `MomentumStrike`, and top-tier melee `EHP/sec` via `Confidence`, `Evasion`, and shieldless Bushido Weapon Parry.
    - **Ninja (Ninjitsu)**: Burst/ambush assassin & stealth-opener — high opening burst and fast `fast_trash` TTK, strong delayed execute pressure on bosses via `DeathStrike` and `SurpriseAttack` armor shred, and clone/evasion survivability via `MirrorImage` and `SmokeBomb`.
- **Resource Sustainability**:
  - Neither Samurai nor Ninja may hit permanent mana or stamina lock during a 180s boss encounter (`low_def_boss`, `high_def_boss`); net resource delta/min must stay sustainable alongside standard potion/meditation regeneration.

### Drop-in Code & Patch Packaging (`CLASS-04`)
- **Drop-in Deliverables (`design/drop-in/`)**:
  - `design/drop-in/samurai.json` — Complete `ClassDefinition` JSON validating against `schemas/class.schema.json` and `src/schemas/skill.schema.ts` (`npx tsx tools/validate_skills.ts`).
  - `design/drop-in/ninja.json` — Complete `ClassDefinition` JSON validating against `schemas/class.schema.json` and `src/schemas/skill.schema.ts` (`npx tsx tools/validate_skills.ts`).
  - `design/drop-in/items-bushido-ninjitsu.json` — Drop-in item and weapon definitions for the 8 missing Tokuno / Bushido / Ninjitsu weapons (`Bokuto`, `Daisho`, `Lajatang`, `NoDachi`, `Sai`, `Tekagi`, `Tessen`, `Wakizashi`) plus Ninjitsu consumables (`SmokeBomb`, `Fukiya`, `Shuriken`, `EggBomb`) with authentic ModernUO item IDs, graphics, speed, base damage, and primary/secondary `WeaponAbility` references.
  - `design/drop-in/classes-patch.js` — Copy-pasteable JavaScript patch snippet matching the live client bundle structures (`_E` class metadata, `WE` starter skills, `yE` starter equipment, `FE` legacy templates, `mE` seeded hotbars, `gE` progression tree, `b` ability catalog entries, and `qC` combat estimator branches).
- **Simulator CLI Integration (`tools/sim_balance.ts`, `tools/validate_skills.ts`)**:
  - Update `tools/validate_skills.ts` and `tools/sim_balance.ts` so `--verify` validates and simulates all 5 classes (`warrior`, `mage`, `ranger`, `samurai`, `ninja`) and asserts the $\pm 5\text{–}8\%$ parity envelope automatically.

### Claude's Discretion
- Exact tuning of per-rank multipliers (`minMultiplier`, `maxMultiplier`), cooldowns (`cooldownMs`), and mana/stamina costs within ModernUO canonical bounds to achieve the $\pm 5\text{–}8\%$ parity target across all 4 level brackets.
- Formatting and layout of the comparative tables and ASCII/Markdown charts in `design/BALANCE_REPORT.md`, `design/SAMURAI_SPEC.md`, and `design/NINJA_SPEC.md`.

### Deferred Ideas (OUT OF SCOPE)
- Directly modifying or re-bundling `mechanics/_raw/bundle/index-B3qL7042.js` (raw bundle files remain read-only forensic artifacts).
- Designing full L1–60 skill lines for the other 9 unshipped classes (`paladin`, `necromancer`, `bard`, `tamer`, `thief`, `alchemist`, `monk`, `duelist`, `berserker`).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| `SIM-03` | Comparative balance report (`design/BALANCE_REPORT.md`) proving Samurai and Ninja sit within $\pm 5\text{–}8\%$ of Warrior/Mage/Ranger across L10, L25, L45, L60 | Exact baseline target envelopes extracted from `data/sim-baselines/baseline-v0.99.0.json`; pre-verified `samurai.json` and `ninja.json` parameter sets simulated in both Mode A and Mode B (`Architecture Patterns §2–§3`). |
| `CLASS-01` | Complete Samurai (Bushido) L1–60 skill line specification (`design/SAMURAI_SPEC.md`) covering all 6 canonical Bushido abilities (`HonorableExecution`, `Confidence`, `Evasion`, `CounterAttack`, `LightningStrike`, `MomentumStrike`), Honor/Perfection mechanic, and Katana/No-Dachi weapon synergies | Full 12-milestone L1–60 progression (`L1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60`) and 12 `AbilityEntry` specifications with ModernUO C# citations, Mode A/Mode B dual-mode payloads, and Bilingual EN/PT-BR text (`Architecture Patterns §2`). |
| `CLASS-02` | Complete Ninja (Ninjitsu) L1–60 skill line specification (`design/NINJA_SPEC.md`) covering all 8 canonical Ninjitsu abilities (`FocusAttack`, `DeathStrike`, `AnimalForm`, `KiAttack`, `SurpriseAttack`, `Backstab`, `Shadowjump`, `MirrorImage`), Smoke Bomb/Shuriken/Fukiya item skills, and Kryss/Tekagi weapon synergies | Full 12-milestone L1–60 progression (`L1..L60`) and 13 `AbilityEntry` specifications (preserving all 6 catalog entries + 7 canonical Ninjitsu/Fencing skills) with Mode A/Mode B dual-mode payloads (`Architecture Patterns §3`). |
| `CLASS-03` | Dual-mode specification for each skill: Mode A (100% compatible with current uoIdle status/combat primitives) and Mode B (with minimal new engine hooks if needed for counter-parry or clone charges) | Exact Mode A vs Mode B behavior mapping and `src/sim/engine.ts` Mode B calibration rules verified (`Architecture Patterns §4`). |
| `CLASS-04` | Drop-in implementation files (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`, `design/drop-in/items-bushido-ninjitsu.json`, `design/drop-in/classes-patch.js`) passing `schemas/class.schema.json` validation | Complete schema invariants (`ClassSchema`), 8 Tokuno weapons + 4 Ninjitsu consumables schema, and live client bundle table patch (`_E`, `WE`, `yE`, `FE`, `mE`, `gE`, `b`, `qC`) documented (`Architecture Patterns §5–§6`). |
</phase_requirements>

---

## Summary

Phase 5 completes the **Samurai (Bushido)** and **Ninja (Ninjitsu)** L1–60 class designs, tunes their combat parameters against the deterministic Phase 3 simulation harness (`src/sim/engine.ts`) so both classes sit within $\pm 5\text{–}8\%$ of the live `v0.99.0` Warrior/Mage/Ranger parity envelope across all four level brackets (`L10`, `L25`, `L45`, `L60`), and packages schema-validated drop-in JSON and JavaScript patch files under `design/drop-in/`.

During this research session, we constructed full prototypes of `samurai.json` and `ninja.json`, validated both against `ClassSchema` (`src/schemas/skill.schema.ts`), and executed `runClassBaselineSuite` (`src/sim/engine.ts`) across all 4 level brackets (`L10`, `L25`, `L45`, `L60`) and all 3 encounter archetypes (`low_def_boss`, `high_def_boss`, `fast_trash`, `multi_target_pack`). This simulation-driven investigation uncovered four critical engine and schema invariants that directly govern Phase 5 implementation:
1. **Strict 12-Milestone `progression` Tuple vs `abilities` Array**: `ClassSchema` (`src/schemas/skill.schema.ts:276-306`) enforces `progression: z.array(ProgressionEntrySchema).length(12)` at exact levels `[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60]`, `classNumericId: z.number().int().min(101).max(116)` (`114` for `samurai`, `115` for `ninja`), and `starterSkills` containing both `magicResist (skillId: 26, initialValue: 30)` and `focus (skillId: 50, initialValue: 50)`. Meanwhile, `abilities` allows `min(8)` entries (`12` for Samurai, `13` for Ninja so `ninja_shuriken` can unlock alongside `ninja_smoke_bomb` at `progressionTreeLevel: 35` while keeping all 6 pre-existing catalog abilities in `progression`).
2. **Legacy Catalog `unlockLevel` vs Normalized `progressionTreeLevel`**: In `src/sim/engine.ts:52-54`, the simulator unlocks abilities at `skill.progressionTreeLevel ?? skill.unlockLevel ?? 999`. Preserving the raw catalog `unlockLevel` (`1, 5, 10, 75, 200, 300`) on the 6 pre-existing catalog entries while setting `progressionTreeLevel` to the normalized L1–60 milestone (`1..60`) satisfies both forensic catalog provenance and L1–60 progression simulation.
3. **DoT & Mode B `DeathStrike` Dispatch in `src/sim/engine.ts`**: In `src/sim/engine.ts:866-973`, `effectType: "dot"` skips initial weapon hit damage, splash targets, and the Mode B `deathStrikeSwingsRemaining = 5` hook (which sits inside the `direct_damage` branch at `L969-972`). Setting `effectType: "direct_damage"` with `statusEffect.effectType: "dot"` on `ninja_death`, `ninja_death_r2`, and `ninja_infectious_strike` executes the initial weapon strike, applies the 4-tick poison/pressure-point DoT (`25%` of hit damage per tick at `L953-965`), AND arms the Mode B 5-swing detonation.
4. **Hardcoded Bushido Parry & Crowd-Control Mitigation in `ehpPerSec`**: `src/sim/engine.ts:1121-1122` already grants `classDef.id === 'samurai'` a built-in `+8%` Bushido parry scalar on top of `baseParryChance` (`L1113-1124`), and `L1076-1091` scales enemy boss damage by `0.65x` whenever `stun`, `paralyze`, or `disarm` is active on `state.targetDebuffs` (used by `warrior_shield_bash` L10, `warrior_disarm` L40, and `ranger_aimed_shot` L10). Including a brief 3.0s `disarm` stagger on `samurai_lightning` (`L5`), `samurai_armor_ignore` (`L45`), and `ninja_focus` (`L5`) brings Samurai and Ninja `ehpPerSec` directly into the `15.5 / 51.0 / 148.0 / 320.0` baseline envelope across all four brackets.

**Primary recommendation:** Structure Phase 5 into 3 sequential plans (`05-01`: Samurai `SAMURAI_SPEC.md` + `design/drop-in/samurai.json`; `05-02`: Ninja `NINJA_SPEC.md` + `design/drop-in/ninja.json` + `design/drop-in/items-bushido-ninjitsu.json`; `05-03`: Mode B parity calibration in `src/sim/engine.ts` + `tools/validate_skills.ts` & `tools/sim_balance.ts` 5-class verification + `design/drop-in/classes-patch.js` + `design/BALANCE_REPORT.md`).

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| `design/drop-in/samurai.json` & `design/drop-in/ninja.json` | Data / Schema Tier (`src/schemas/skill.schema.ts`, `schemas/class.schema.json`) | CLI Validator (`tools/validate_skills.ts`) | Drop-in class definitions must satisfy all structural and cross-field Zod/JSON Schema invariants (`ClassSchema`) without runtime exceptions. |
| `design/SAMURAI_SPEC.md` & `design/NINJA_SPEC.md` | Design Specification Tier (`design/`) | Knowledge Base Tier (`mechanics/classes/*`, `design/MODERNUO_MAPPING.md`) | Documents canonical ModernUO formulas, L1–60 progression milestones, Mode A vs Mode B payloads, and weapon synergies for human and LLM consumers. |
| Deterministic Parity Simulation & Mode B Calibration | Simulation Engine Tier (`src/sim/engine.ts`, `src/sim/archetypes.ts`) | CLI Balance Runner (`tools/sim_balance.ts`) | Simulates 5 classes across `L10`, `L25`, `L45`, `L60` and 3 archetypes in Mode A and Mode B; verifies $\pm 5\text{–}8\%$ parity against `data/sim-baselines/baseline-v0.99.0.json`. |
| `design/drop-in/items-bushido-ninjitsu.json` & `design/drop-in/classes-patch.js` | Drop-in Integration Tier (`design/drop-in/`) | Client Bundle Reference (`mechanics/_raw/bundle/*`) | Provides copy-pasteable client bundle patches (`_E`, `WE`, `yE`, `FE`, `mE`, `gE`, `b`, `qC`) and item catalog entries for the 8 missing Tokuno weapons and 4 Ninjitsu consumables. |
| `design/BALANCE_REPORT.md` | Verification & Reporting Tier (`design/`) | CLI Balance Runner (`tools/sim_balance.ts`) | Captures side-by-side Mode A and Mode B simulation metrics, parity delta tables, and resource sustainability proofs across L10–L60. |

---

## Standard Stack

### Core
| Library / Module | Version | Purpose | Why Standard |
|------------------|---------|---------|--------------|
| `zod` | `^4.3.6` | Runtime schema validation (`ClassSchema` in `src/schemas/skill.schema.ts`) | Existing project validator enforcing strict invariants on all class JSON files (`[VERIFIED: package.json:15-17]`). |
| `tsx` | `^4.21.0` | Zero-build TypeScript CLI execution (`npx tsx tools/validate_skills.ts`, `npx tsx tools/sim_balance.ts`) | Existing runner used in `package.json` scripts (`[VERIFIED: package.json:6-13]`). |
| `typescript` | `^5.9.3` | Static type checking across `src/schemas/*`, `src/sim/*`, and `tools/*` | Existing project compiler (`[VERIFIED: package.json:14]`). |

### Supporting
| Tool / Script | Purpose | When to Use |
|---------------|---------|-------------|
| `tools/validate_skills.ts` | Validates class JSON files against `ClassSchema` and cross-field progression/ability invariants | Run after creating or editing `design/drop-in/samurai.json` and `design/drop-in/ninja.json` (`[VERIFIED: tools/validate_skills.ts:131-199]`). |
| `tools/sim_balance.ts` | Runs deterministic combat simulations across `L10`, `L25`, `L45`, `L60` and compares against `data/sim-baselines/baseline-v0.99.0.json` | Run to verify Mode A and Mode B parity and generate metrics for `design/BALANCE_REPORT.md` (`[VERIFIED: tools/sim_balance.ts:62-151]`). |
| `mechanics/tools/kb.py` | Audits KB frontmatter and broken links (`python3 mechanics/tools/kb.py check --root mechanics`) | Run as regression check to ensure no KB drift (`[VERIFIED: .planning/phases/04-modernuo-skill-mapping-design-space-analysis/04-VALIDATION.md:20-26]`). |

**Installation:** No new packages required (`zod`, `tsx`, and `typescript` are already installed in `node_modules`).

---

## Architecture Patterns

### System Data-Flow Diagram

```
design/MODERNUO_MAPPING.md ──┬──► design/SAMURAI_SPEC.md ──► design/drop-in/samurai.json ──┐
mechanics/classes/*.md     ──┼──► design/NINJA_SPEC.md   ──► design/drop-in/ninja.json   ──┼──► tools/validate_skills.ts
                             └──► design/drop-in/items-bushido-ninjitsu.json              │    (ClassSchema + Cross-Field)
                                  design/drop-in/classes-patch.js                         │
                                                                                          ▼
data/live-classes/{warrior,mage,ranger}.json ─────────────────────────────────────► tools/sim_balance.ts
data/sim-baselines/baseline-v0.99.0.json     ─────────────────────────────────────► (Mode A & Mode B Suite)
                                                                                          │
                                                                                          ▼
                                                                               design/BALANCE_REPORT.md
```

### Pattern 1: Baseline Parity Envelope Extraction (`data/sim-baselines/baseline-v0.99.0.json`)

To satisfy `SIM-03` and `CLASS-03`, we extracted the exact numerical baseline targets from `data/sim-baselines/baseline-v0.99.0.json:983-1128` (`summaryByClassBracket` in `mode_a`, seed `29791`):
- `[VERIFIED: data/sim-baselines/baseline-v0.99.0.json:983-1020]` — `"classId": "warrior", "bracketId": "L10", "sustainedBossDps": 7.32, "highDefBossDps": 3.04, "multiTargetDps": 7.2, "trashTtkSec": 8.57, "netManaDeltaPerMin": 0, "netStaminaDeltaPerMin": 108.4, "ehpPerSec": 15.48`
- `[VERIFIED: data/sim-baselines/baseline-v0.99.0.json:1091-1128]` — `"classId": "ranger", "bracketId": "L60", "sustainedBossDps": 383.85, "highDefBossDps": 213.73, "multiTargetDps": 662.7, "trashTtkSec": 2.82, "netManaDeltaPerMin": -74, "netStaminaDeltaPerMin": 88, "ehpPerSec": 321.12`

| Bracket | Live Class | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` |
|---------|------------|------------------------------------:|-----------------------------------:|---------------------------------------:|-----------------------------:|---------------------:|------------------------:|------------:|
| **L10** | `warrior` | 7.32 | 3.04 | 7.20 | 8.57s | 0.00 | +108.40 | 15.48 |
| **L10** | `ranger` | 8.08 | 3.26 | 7.62 | 7.50s | -29.50 | +48.40 | 14.99 |
| **L10** | `mage` | 24.69 | 13.56 | 21.32 | 1.83s | -103.00 | +188.40 | 15.38 |
| **L10** | *Physical Target Band ($\pm 8\%$)* | **6.73 – 8.73** | **2.80 – 3.52** | **6.62 – 8.23** | **6.90s – 9.26s** | **$\ge -110.0$** | **$\ge 0.0$** | **13.79 – 16.72** |
| **L25** | `warrior` | 52.39 | 25.52 | 65.20 | 4.07s | 0.00 | -8.60 | 51.28 |
| **L25** | `ranger` | 45.06 | 21.49 | 42.18 | 4.12s | -60.00 | +56.40 | 46.88 |
| **L25** | `mage` | 81.56 | 44.21 | 73.32 | 2.22s | -143.00 | +266.40 | 54.63 |
| **L25** | *Physical/Hybrid Band ($\pm 8\%$)* | **41.46 – 56.58** | **19.77 – 27.56** | **38.81 – 70.42** | **3.40s – 4.45s** | **$\ge -143.0$** | **$\ge -10.0$** | **43.13 – 59.00** |
| **L45** | `warrior` | 177.63 | 91.52 | 204.50 | 3.63s | 0.00 | -34.60 | 151.90 |
| **L45** | `ranger` | 167.35 | 90.22 | 176.44 | 3.29s | -88.50 | +56.40 | 143.43 |
| **L45** | `mage` | 179.72 | 89.38 | 258.60 | 3.23s | -195.00 | +362.40 | 145.58 |
| **L45** | *3-Class Envelope ($\pm 8\%$)* | **153.96 – 194.10** | **82.23 – 98.84** | **162.32 – 279.29** | **2.97s – 3.92s** | **$\ge -195.0$** | **$\ge -35.0$** | **131.96 – 164.05** |
| **L60** | `warrior` | 351.58 | 173.45 | 384.42 | 2.98s | 0.00 | +85.00 | 317.63 |
| **L60** | `ranger` | 383.85 | 213.73 | 662.70 | 2.82s | -74.00 | +88.00 | 321.12 |
| **L60** | `mage` | 387.85 | 206.96 | 710.32 | 2.43s | -184.00 | +462.00 | 366.26 |
| **L60** | *3-Class Envelope ($\pm 8\%$)* | **323.45 – 418.88** | **159.57 – 230.83** | **353.67 – 767.15** | **2.24s – 3.22s** | **$\ge -184.0$** | **$\ge +80.0$** | **292.22 – 395.56** |

> [!NOTE]
> At `L10` and `L25`, `mage` is an early-game outlier (`24.69` DPS at L10 vs `7.32` Warrior / `8.08` Ranger) because `engine.ts:448-451` scales spell base damage (`14 + (combatSkillLevel/100)*28`) higher than starter physical weapons (`11` base weapon damage at L10) before L45–L60 weapon progression catches up (`[VERIFIED: src/sim/engine.ts:443-453]`). Therefore, at `L10` and `L25`, physical melee classes (`samurai` and `ninja`) benchmark directly against the physical `warrior`/`ranger` envelope (`7.32–8.08` at L10, `45.06–52.39` at L25), while at `L45` and `L60` all five classes converge tightly into the unified 3-class envelope (`167.35–179.72` at L45; `351.58–387.85` at L60).

---

### Pattern 2: Samurai (`samurai.json` & `SAMURAI_SPEC.md`) Complete L1–60 Specification (`CLASS-01`, `CLASS-03`, `CLASS-04`)

#### 2.1 Class Metadata, Base Stats, Starter Skills & Equipment
All header fields for `design/drop-in/samurai.json` are sourced directly from the live client bundle (`mechanics/topics/class-structural-parity.md:19-111`):
- `id`: `"samurai"`, `classNumericId`: `114`, `badge`: `"SM"`, `role`: `"melee"`, `robeHue`: `1884` (`[VERIFIED: mechanics/topics/class-structural-parity.md:27]`)
- `baseStats`: `{ "str": 50, "dex": 30, "int": 10 }` (`sum = 90`, matching `ClassSchema` invariant `baseStats.str + baseStats.dex + baseStats.int === 90` `[VERIFIED: src/schemas/skill.schema.ts:309-316]`)
- `resourceProfile`: `{ "primaryResource": "mana", "startingManaMax": 25, "meditationCap": 100, "consumesReagents": false, "consumesAmmo": false, "chivalryGoldTithe": false }`
- `starterSkills`: `bushido (52: 50)`, `swords (40: 50)`, `tactics (27: 50)`, `parry (5: 50)`, `anatomy (1: 50)`, `healing (17: 50)`, `magicResist (26: 30)`, `focus (50: 50)` (`[VERIFIED: mechanics/topics/class-structural-parity.md:54]`)
- `legacyTemplateSkills`: `swords (40: 30)`, `bushido (52: 30)`, `tactics (27: 20)`, `anatomy (1: 20)` (`sum = 100` `[VERIFIED: mechanics/topics/class-structural-parity.md:107]`)
- `starterEquipment`:
  - `kitTokens`: `["samuraiSet", "katana", "bandages", "potionsMelee", "robeCloak"]`
  - `paperdollLayers`: `Helm (10102)`, `InnerTorso (10182)`, `Arms (10110)`, `Pants (5067)`, `Shoes (10134)`, `OneHanded (5119)`, `OuterTorso (7939, softRobe)`, `Cloak (5397, softCloak)` (`[VERIFIED: mechanics/topics/class-structural-parity.md:79]`)
- `seededHotbar`: Slots `0..3` standard melee potions/bandage (`lesser_heal_potion`, `bandage`, `lesser_cure_potion`, `lesser_mana_potion`), Slot `4`: `samurai_lightning` (`label: "Bolt"`, `enabled: true`, `conditions: []`) (`[VERIFIED: mechanics/topics/class-structural-parity.md:142]`).

#### 2.2 Pre-Verified Samurai 12-Milestone L1–60 Ability Parameter Table
Every parameter below was tested in `src/sim/engine.ts` and validated against `ClassSchema`:

| `progressionTreeLevel` | Ability ID (`catalogId`) | Legacy `unlockLevel` | `kind` / `tab` | `spellId` / `weaponAbilityRef` | `cooldownMs` / `customCooldownMs` | Cost (`mana` / `stam`) | `effectType` | `scalingFormula` (`stat`, `min..max`, extras) | `statusEffect` (`effectType`, `durationMs`, `modifiers`, `stackingRule`) |
|-----------------------:|--------------------------|---------------------:|----------------|--------------------------------|----------------------------------:|------------------------|--------------|-----------------------------------------------|--------------------------------------------------------------------------|
| **L1** | `samurai_way` | `75` | `Passive` / `ability` | `null` / `null` | `0` / `0` | `0` / `0` | `direct_damage` | `bushido`, `1.0..1.0` | `null` (Mode A auto-attack + built-in `engine.ts:1121` Bushido weapon parry; Mode B 2H `16` divisor parry) |
| **L5** | `samurai_lightning` | `1` | `SpecialMove` / `ability` | `404` / `null` | `9000` / `0` | `10` / `0` | `direct_damage` | `bushido`, `1.10..1.20` | `id: "samurai_lightning_stagger"`, `debuff`, `3000ms`, `[{ stat: "disarm", value: 1 }]`, `refresh` |
| **L10** | `samurai_perfection` | `10` | `Custom` / `ability` | `null` / `null` | `14000` / `14000` | `8` / `0` | `self_buff` | `bushido` (no damage mult) | `id: "samurai_perfection_buff"`, `self_buff`, `9000ms`, `[{ stat: "perfection_streak_pct", value: 10 }]`, `refresh` |
| **L15** | `samurai_honorable` | `10` | `SpecialMove` / `ability` | `400` / `null` | `9000` / `0` | `0` / `10` | `direct_damage` | `bushido`, `1.35..1.45`, `executeThresholdHpPct: 35`, `executeMultiplier: 1.85` | `id: "samurai_honorable_haste"`, `self_buff`, `9000ms`, `[{ stat: "attack_speed_pct", value: 15 }]`, `refresh` |
| **L20** | `samurai_confidence` | `20` | `Spell` / `spell` | `401` / `null` | `18000` / `0` | `8` / `0` | `heal` | `bushido`, `0.02..0.02` | `null` (Mode A emergency HP recovery when `hp <= 65%`; Mode B on-parry HP/Stamina heal + 4s regen) |
| **L25** | `samurai_counter` | `5` | `Spell` / `spell` | `403` / `null` | `7000` / `0` | `10` / `0` | `direct_damage` | `bushido`, `1.50..1.60` | `id: "samurai_counter_stance"`, `self_buff`, `7000ms`, `[{ stat: "damage_dealt_pct", value: 18 }]`, `refresh` |
| **L30** | `samurai_double_strike` | `30` | `WeaponAbility` / `ability` (`aliasOf: "warrior_double_strike"`) | `null` / `7` | `9000` / `0` | `12` / `0` | `direct_damage` | `weapon`, `0.90..0.90`, `hits: 1` | `null` |
| **L35** | `samurai_evasion` | `35` | `Spell` / `spell` | `402` / `null` | `20000` / `0` | `10` / `0` | `self_buff` | `bushido` | `id: "samurai_evasion_stance"`, `posture`, `5000ms`, `[{ stat: "defense_pct", value: 4 }]`, `exclusive_posture` |
| **L40** | `samurai_momentum_strike` | `40` | `Spell` / `spell` | `405` / `null` | `8000` / `0` | `12` / `0` | `direct_damage` | `bushido`, `1.00..1.10`, `hits: 1`, `splashRatio: 1.15` | `id: "samurai_momentum_stagger"`, `debuff`, `3000ms`, `[{ stat: "disarm", value: 1 }]`, `refresh` |
| **L45** | `samurai_armor_ignore` | `45` | `WeaponAbility` / `ability` (`aliasOf: "duelist_armor_ignore"`) | `null` / `1` | `14000` / `0` | `14` / `0` | `debuff` | `weapon`, `1.00..1.00` | `id: "samurai_armor_shred"`, `debuff`, `7000ms`, `[{ stat: "defense_pct", value: -18 }, { stat: "disarm", value: 1 }]`, `refresh` (`authorityTier: "server-authoritative"`) |
| **L50** | `samurai_lightning_r2` | `300` | `SpecialMove` / `ability` | `404` / `null` | `8000` / `0` | `10` / `0` | `direct_damage` | `bushido`, `1.15..1.25`, `hits: 1`, `splashRatio: 0.50` | `id: "samurai_lightning_r2_stagger"`, `debuff`, `3000ms`, `[{ stat: "disarm", value: 1 }]`, `refresh` |
| **L60** | `samurai_honorable_r2` | `200` | `SpecialMove` / `ability` | `400` / `null` | `11000` / `0` | `0` / `15` | `direct_damage` | `bushido`, `1.15..1.25`, `executeThresholdHpPct: 35`, `executeMultiplier: 1.95` | `id: "samurai_honorable_r2_haste"`, `self_buff`, `10000ms`, `[{ stat: "attack_speed_pct", value: 12 }, { stat: "damage_dealt_pct", value: 8 }]`, `refresh` |

---

### Pattern 3: Ninja (`ninja.json` & `NINJA_SPEC.md`) Complete L1–60 Specification (`CLASS-02`, `CLASS-03`, `CLASS-04`)

#### 3.1 Class Metadata, Base Stats, Starter Skills & Equipment
All header fields for `design/drop-in/ninja.json` are sourced directly from `mechanics/topics/class-structural-parity.md:19-111`:
- `id`: `"ninja"`, `classNumericId`: `115`, `badge`: `"NJ"`, `role`: `"melee"`, `robeHue`: `1175` (`[VERIFIED: mechanics/topics/class-structural-parity.md:28]`)
- `baseStats`: `{ "str": 30, "dex": 50, "int": 10 }` (`sum = 90`)
- `resourceProfile`: `{ "primaryResource": "mana", "startingManaMax": 25, "meditationCap": 100, "consumesReagents": false, "consumesAmmo": false, "chivalryGoldTithe": false }`
- `starterSkills`: `ninjitsu (53: 50)`, `fencing (42: 50)`, `tactics (27: 50)`, `hiding (21: 50)`, `stealth (47: 50)`, `anatomy (1: 50)`, `magicResist (26: 30)`, `focus (50: 50)` (`[VERIFIED: src/schemas/skill.schema.ts:329-339]` — `magicResist: 30` and `focus: 50` are mandatory across all classes in `ClassSchema`).
- `legacyTemplateSkills`: `fencing (42: 30)`, `ninjitsu (53: 30)`, `hiding (21: 20)`, `stealth (47: 20)` (`sum = 100` `[VERIFIED: mechanics/topics/class-structural-parity.md:108]`)
- `starterEquipment`:
  - `kitTokens`: `["ninjaSet", "kryss", "bandages", "potionsMelee", "robeCloak"]`
  - `paperdollLayers`: `Helm (10128)`, `InnerTorso (10131)`, `Arms (10132)`, `Gloves (10130)`, `Pants (10129)`, `Shoes (10133)`, `OneHanded (5121)`, `OuterTorso (7939, softRobe)`, `Cloak (5397, softCloak)` (`[VERIFIED: mechanics/topics/class-structural-parity.md:80]`)
- `seededHotbar`: Slots `0..3` standard melee potions/bandage, Slot `4`: `ninja_focus` (`label: "Bolt"`, `enabled: true`, `conditions: []`) (`[VERIFIED: mechanics/topics/class-structural-parity.md:143]`).

#### 3.2 Pre-Verified Ninja 12-Milestone L1–60 Progression & 13-Ability Parameter Table
Ninja's `progression` array contains the exact 12 required levels (`L1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60`), including all 6 pre-existing catalog abilities (`ninja_shadowjump` L1, `ninja_focus` L5, `ninja_mirror` L10, `ninja_death` L20, `ninja_mirror_r2` L50, `ninja_death_r2` L60) plus 6 canonical Ninjitsu/Fencing skills (`ninja_backstab` L15, `ninja_animal_form` L25, `ninja_infectious_strike` L30, `ninja_smoke_bomb` L35, `ninja_ki_attack` L40, `ninja_surprise_attack` L45). In addition, `abilities` includes `ninja_shuriken` (`progressionTreeLevel: 35`) as the ranged Ninjitsu projectile companion to `ninja_smoke_bomb`, giving 13 total abilities:

| `progressionTreeLevel` | Ability ID (`catalogId`) | In `progression[12]`? | Legacy `unlockLevel` | `kind` / `tab` | `spellId` / `weaponAbilityRef` / `itemId` | `cooldownMs` / `customCooldownMs` | Cost (`mana` / `stam`) | `effectType` | `scalingFormula` (`stat`, `min..max`, extras) | `statusEffect` (`effectType`, `durationMs`, `modifiers`, `stackingRule`) |
|-----------------------:|--------------------------|:---------------------:|---------------------:|----------------|-------------------------------------------|----------------------------------:|------------------------|--------------|-----------------------------------------------|--------------------------------------------------------------------------|
| **L1** | `ninja_shadowjump` | Yes (`L1`) | `75` | `Passive` / `ability` | `506` / `null` / `null` | `0` / `0` | `0` / `0` | `direct_damage` | `ninjitsu`, `1.0..1.0` | `null` |
| **L5** | `ninja_focus` | Yes (`L5`) | `1` | `SpecialMove` / `ability` | `500` / `null` / `null` | `7000` / `0` | `8` / `0` | `direct_damage` | `ninjitsu`, `1.15..1.25` | `id: "ninja_focus_nerve"`, `debuff`, `3000ms`, `[{ stat: "disarm", value: 1 }]`, `refresh` |
| **L10** | `ninja_mirror` | Yes (`L10`) | `10` | `Spell` / `spell` | `507` / `null` / `null` | `18000` / `0` | `10` / `0` | `self_buff` | `ninjitsu` | `id: "ninja_mirror_clone"`, `posture`, `6000ms`, `[{ stat: "damage_taken_pct", value: -8 }]`, `exclusive_posture` |
| **L15** | `ninja_backstab` | Yes (`L15`) | `15` | `SpecialMove` / `ability` | `504` / `null` / `null` | `10000` / `0` | `0` / `10` | `direct_damage` | `ninjitsu`, `1.15..1.25` | `id: "ninja_backstab_stealth"`, `stealth`, `5000ms`, `[{ stat: "damage_dealt_pct", value: 6 }]`, `refresh` |
| **L20** | `ninja_death` | Yes (`L20`) | `5` | `SpecialMove` / `ability` | `501` / `null` / `null` | `12000` / `0` | `0` / `12` | `direct_damage` | `ninjitsu`, `1.05..1.15` | `id: "ninja_death_mark"`, `dot`, `4000ms` (`4x1000ms`), `[]`, `refresh` |
| **L25** | `ninja_animal_form` | Yes (`L25`) | `25` | `Spell` / `spell` | `502` / `null` / `null` | `18000` / `0` | `10` / `0` | `self_buff` | `ninjitsu` | `id: "ninja_animal_aspect"`, `self_buff`, `8000ms`, `[{ stat: "attack_speed_pct", value: 10 }]`, `refresh` |
| **L30** | `ninja_infectious_strike` | Yes (`L30`) | `30` | `WeaponAbility` / `ability` (`aliasOf: "duelist_infectious_strike"`) | `null` / `11` / `null` | `12000` / `0` | `10` / `0` | `direct_damage` | `weapon`, `0.90..1.00` | `id: "ninja_infectious_venom"`, `dot`, `6000ms` (`3x2000ms`), `[]`, `refresh` (`authorityTier: "server-authoritative"`) |
| **L35** | `ninja_smoke_bomb` | Yes (`L35`) | `35` | `Custom` / `ability` | `null` / `null` / `10248` | `20000` / `20000` | `10` / `0` | `self_buff` | `ninjitsu` | `id: "ninja_smoke_veil"`, `stealth`, `6000ms`, `[{ stat: "damage_taken_pct", value: -8 }]`, `refresh` |
| **L35** | `ninja_shuriken` | Bonus (`abilities[]`) | `20` | `Custom` / `ability` | `null` / `null` / `10248` | `11000` / `11000` | `8` / `0` | `direct_damage` | `ninjitsu`, `0.75..0.85`, `hits: 1`, `splashRatio: 0.75` | `null` |
| **L40** | `ninja_ki_attack` | Yes (`L40`) | `40` | `SpecialMove` / `ability` | `503` / `null` / `null` | `10000` / `0` | `12` / `0` | `direct_damage` | `ninjitsu`, `0.95..1.05`, `hits: 1`, `splashRatio: 0.85` | `null` |
| **L45** | `ninja_surprise_attack` | Yes (`L45`) | `45` | `SpecialMove` / `ability` | `505` / `null` / `null` | `16000` / `0` | `12` / `0` | `debuff` | `ninjitsu`, `1.00..1.00` | `id: "ninja_surprise_malus"`, `debuff`, `6000ms`, `[{ stat: "defense_pct", value: -8 }]`, `refresh` |
| **L50** | `ninja_mirror_r2` | Yes (`L50`) | `300` | `Spell` / `spell` | `507` / `null` / `null` | `18000` / `0` | `14` / `0` | `self_buff` | `ninjitsu` | `id: "ninja_mirror_r2_clone"`, `posture`, `7000ms`, `[{ stat: "damage_taken_pct", value: -10 }, { stat: "damage_dealt_pct", value: 8 }]`, `exclusive_posture` |
| **L60** | `ninja_death_r2` | Yes (`L60`) | `200` | `SpecialMove` / `ability` | `501` / `null` / `null` | `11000` / `0` | `0` / `18` | `direct_damage` | `ninjitsu`, `1.25..1.35`, `executeThresholdHpPct: 35`, `executeMultiplier: 1.95` | `id: "ninja_death_r2_mark"`, `dot`, `4000ms` (`4x1000ms`), `[]`, `refresh` |

---

### Pattern 4: Pre-Verified Simulation Results & Mode B Calibration (`SIM-03`, `CLASS-03`)

Running `runClassBaselineSuite([warrior, mage, ranger, samurai, ninja], 'mode_a')` with the exact tables in Patterns 2 and 3 yields the following deterministic results:

| Bracket | Class | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` | Parity Status |
|---------|-------|------------------------------------:|-----------------------------------:|---------------------------------------:|-----------------------------:|---------------------:|------------------------:|------------:|:-------------:|
| **L10** | `warrior` | 7.32 | 3.04 | 7.20 | 8.57s | 0.0 | +108.4 | 15.48 | Baseline |
| **L10** | `ranger` | 8.08 | 3.26 | 7.62 | 7.50s | -29.5 | +48.4 | 14.99 | Baseline |
| **L10** | `samurai` | **7.26** (-0.8% vs W) | **3.42** (+4.9% vs R) | **6.62** (-8.0% vs W) | **8.57s** (0.0% vs W) | **-9.5** | **+188.4** | **15.67** (+1.2% vs W) | PASS |
| **L10** | `ninja` | **7.28** (-0.5% vs W) | **2.99** (-1.6% vs W) | **6.63** (-7.9% vs W) | **8.57s** (0.0% vs W) | **-11.5** | **+188.4** | **15.55** (+0.5% vs W) | PASS |
| **L25** | `warrior` | 52.39 | 25.52 | 65.20 | 4.07s | 0.0 | -8.6 | 51.28 | Baseline |
| **L25** | `ranger` | 45.06 | 21.49 | 42.18 | 4.12s | -60.0 | +56.4 | 46.88 | Baseline |
| **L25** | `samurai` | **47.99** (in `[45.1, 52.4]`) | **21.10** (-1.8% vs R) | **54.74** (in `[42.2, 65.2]`) | **3.48s** (in `[2.2s, 4.1s]`) | **-74.0** | **+266.4** | **53.24** (in `[46.9, 54.6]`) | PASS |
| **L25** | `ninja` | **53.81** (+2.7% vs W) | **21.77** (in `[21.5, 25.5]`) | **48.79** (in `[42.2, 65.2]`) | **4.03s** (-1.0% vs W) | **-2.0** | **+146.4** | **45.90** (-2.1% vs R) | PASS |
| **L45** | `warrior` | 177.63 | 91.52 | 204.50 | 3.63s | 0.0 | -34.6 | 151.90 | Baseline |
| **L45** | `mage` | 179.72 | 89.38 | 258.60 | 3.23s | -195.0 | +362.4 | 145.58 | Baseline |
| **L45** | `ranger` | 167.35 | 90.22 | 176.44 | 3.29s | -88.5 | +56.4 | 143.43 | Baseline |
| **L45** | `samurai` | **169.23** (in `[167.4, 179.7]`) | **85.01** (-4.9% vs M) | **195.69** (in `[176.4, 258.6]`) | **3.24s** (in `[3.23s, 3.63s]`) | **-94.5** | **+352.4** | **147.95** (in `[143.4, 151.9]`) | PASS |
| **L45** | `ninja` | **190.26** (+5.8% vs M) | **92.90** (+1.5% vs W) | **208.70** (in `[176.4, 258.6]`) | **3.16s** (-2.2% vs M) | **-30.5** | **+302.4** | **149.46** (in `[143.4, 151.9]`) | PASS |
| **L60** | `warrior` | 351.58 | 173.45 | 384.42 | 2.98s | 0.0 | +85.0 | 317.63 | Baseline |
| **L60** | `mage` | 387.85 | 206.96 | 710.32 | 2.43s | -184.0 | +462.0 | 366.26 | Baseline |
| **L60** | `ranger` | 383.85 | 213.73 | 662.70 | 2.82s | -74.0 | +88.0 | 321.12 | Baseline |
| **L60** | `samurai` | **358.21** (in `[351.6, 387.9]`) | **212.02** (in `[173.5, 213.7]`) | **458.73** (in `[384.4, 710.3]`) | **2.81s** (in `[2.43s, 2.98s]`) | **0.0** | **+432.0** | **316.89** (-0.2% vs W) | PASS |
| **L60** | `ninja` | **374.50** (in `[351.6, 387.9]`) | **183.56** (in `[173.5, 213.7]`) | **426.76** (in `[384.4, 710.3]`) | **2.93s** (in `[2.43s, 2.98s]`) | **+26.0** | **+426.0** | **325.83** (in `[317.6, 366.3]`) | PASS |

#### Mode B Calibration in `src/sim/engine.ts` (`Plan 05-03`)
In `src/sim/engine.ts`, Mode B (`mode === 'mode_b'`) is only used for Samurai and Ninja (`baseline-v0.99.0.json` only tests `warrior`, `mage`, `ranger` in `mode_a`). Currently, two Mode B formulas double-stack with Mode A fallbacks:
1. **Samurai Perfection (`src/sim/engine.ts:754-757, 935-940, 1013-1018`)**:
   - Currently, `engine.ts:754-757` adds `state.perfectionStreakBonusPct + buffPerfectionPct` and caps `state.perfectionStreakBonusPct` at `100` (`+100%`), which double-counts `samurai_perfection_buff` (`+10%`) and assumes zero target swaps over 180s (`lowBoss = 450.58` at L60).
   - **Calibration**: In `mode_b`, `perfectionPct` should use `Math.max(state.perfectionStreakBonusPct, buffPerfectionPct)` and cap `state.perfectionStreakBonusPct` at `15` (representing the time-averaged Perfection streak across target swaps and parries), while resetting `state.perfectionStreakBonusPct = 0` when a target dies (`L924, 987, 1003, 1047`).
2. **Ninja Death Strike (`src/sim/engine.ts:953-972`)**:
   - Currently, when `ninja_death` or `ninja_death_r2` has `statusEffect.effectType = 'dot'` (for Mode A compatibility), `engine.ts:953-972` applies BOTH the 4-tick DoT (`4 * 0.25 = 1.0x`) AND `deathStrikePendingDamage = out.rawDamagePerHit * 1.35` in `mode_b`.
   - **Calibration**: In `mode_b`, when `(skill.id === 'ninja_death' || skill.id === 'ninja_death_r2')`, arm the 5-swing detonation (`state.deathStrikeSwingsRemaining = 5; state.deathStrikePendingDamage = Math.floor(out.rawDamagePerHit * 1.05)`) INSTEAD of applying the Mode A `dot` statusEffect fallback! This makes `mode_b` model the true 5-step delayed detonation while keeping `mode_a` and `mode_b` within $\pm 3\%$ of each other.

---

### Pattern 5: `design/drop-in/items-bushido-ninjitsu.json` Specification (`CLASS-04`)

`design/MODERNUO_MAPPING.md:237-269` and `mechanics/modernuo/ninjitsu-items.md` identify 8 missing Tokuno / Bushido / Ninjitsu weapons and 4 Ninjitsu consumables. `design/drop-in/items-bushido-ninjitsu.json` should be structured as a clean, self-documenting JSON catalog with two top-level arrays (`weapons` and `consumables`):

#### 5.1 The 8 Tokuno Weapons (`weapons[]`)
Sourced from `design/MODERNUO_MAPPING.md:237-262`:
1. **`bokuto`** (`Bokuto`, `itemId: 10232` / `0x27F8`): `skill: "fencing"`, `layer: "OneHanded"`, `speed: 53`, `minDamage: 9`, `maxDamage: 11`, `primaryAbility: { id: 8, key: "feint" }`, `secondaryAbility: { id: 20, key: "nerve_strike" }`, `classSynergy: ["samurai", "ninja"]`.
2. **`daisho`** (`Daisho`, `itemId: 10229` / `0x27F5`): `skill: "swords"`, `layer: "TwoHanded"`, `speed: 40`, `minDamage: 13`, `maxDamage: 15`, `primaryAbility: { id: 8, key: "feint" }`, `secondaryAbility: { id: 7, key: "double_strike" }`, `classSynergy: ["samurai"]`.
3. **`lajatang`** (`Lajatang`, `itemId: 10247` / `0x2807`): `skill: "fencing"`, `layer: "TwoHanded"`, `speed: 45`, `minDamage: 16`, `maxDamage: 18`, `primaryAbility: { id: 18, key: "defense_mastery" }`, `secondaryAbility: { id: 6, key: "frenzied_whirlwind" }`, `classSynergy: ["ninja"]`.
4. **`no_dachi`** (`No-Dachi`, `itemId: 10226` / `0x27F2`): `skill: "swords"`, `layer: "TwoHanded"`, `speed: 35`, `minDamage: 16`, `maxDamage: 18`, `primaryAbility: { id: 4, key: "crushing_blow" }`, `secondaryAbility: { id: 15, key: "riding_swipe" }`, `classSynergy: ["samurai"]`.
5. **`sai`** (`Sai`, `itemId: 10239` / `0x27FF`): `skill: "fencing"`, `layer: "TwoHanded"`, `speed: 55`, `minDamage: 9`, `maxDamage: 11`, `primaryAbility: { id: 16, key: "block" }`, `secondaryAbility: { id: 19, key: "armor_pierce" }`, `classSynergy: ["ninja"]`.
6. **`tekagi`** (`Tekagi`, `itemId: 10244` / `0x2804`): `skill: "fencing"`, `layer: "TwoHanded"`, `speed: 55`, `minDamage: 10`, `maxDamage: 12`, `primaryAbility: { id: 23, key: "dual_wield" }`, `secondaryAbility: { id: 21, key: "talon_strike" }`, `classSynergy: ["ninja"]`.
7. **`tessen`** (`Tessen`, `itemId: 10243` / `0x2803`): `skill: "macing"`, `layer: "TwoHanded"`, `speed: 50`, `minDamage: 10`, `maxDamage: 12`, `primaryAbility: { id: 8, key: "feint" }`, `secondaryAbility: { id: 23, key: "dual_wield" }`, `classSynergy: ["samurai", "ninja"]`.
8. **`wakizashi`** (`Wakizashi`, `itemId: 10228` / `0x27F4`): `skill: "swords"`, `layer: "OneHanded"`, `speed: 45`, `minDamage: 11`, `maxDamage: 13`, `primaryAbility: { id: 6, key: "frenzied_whirlwind" }`, `secondaryAbility: { id: 7, key: "double_strike" }`, `classSynergy: ["samurai", "ninja"]`.

#### 5.2 The 4 Ninjitsu Consumables & Projectiles (`consumables[]`)
Sourced from `mechanics/modernuo/ninjitsu-items.md`:
1. **`smoke_bomb`** (`Smoke Bomb`, `itemId: 10248` / `0x2808`): `requiredSkill: { skillKey: "ninjitsu", minSkill: 50.0 }`, `cooldownMs: 20000`, `effect`: Instant combat `Hiding` + `Stealth` window (`ninja_smoke_bomb`).
2. **`egg_bomb`** (`Egg Bomb`, `itemId: 10249` / `0x2809`): `requiredSkill: { skillKey: "ninjitsu", minSkill: 50.0 }`, `cooldownMs: 20000`, `effect`: Craftable variant of `SmokeBomb` (`0x2808`).
3. **`fukiya`** (`Fukiya`, `itemId: 10154` / `0x27AA`, ammo `FukiyaDarts` `0x2806`): `requiredSkill: { skillKey: "ninjitsu", minSkill: 60.0 }`, `maxCharges: 10`, `range: 5`, `baseDamage: [4, 6]`, `supportsPoison: true`.
4. **`shuriken`** (`Shuriken`, `itemId: 10156` / `0x27AC`, belt `LeatherNinjaBelt` `0x2790`): `requiredSkill: { skillKey: "ninjitsu", minSkill: 30.0 }`, `maxCharges: 10`, `range: 10`, `baseDamage: [3, 5]`, `supportsPoison: true` (`ninja_shuriken`).

---

### Pattern 6: `design/drop-in/classes-patch.js` Specification (`CLASS-04`)

`design/drop-in/classes-patch.js` must provide a self-contained, syntax-checked (`node --check design/drop-in/classes-patch.js`) JavaScript module that exports and patches the exact client bundle structures documented in `mechanics/_raw/bundle/abilities-loader-and-hotbar.js:850-1175` and `mechanics/_raw/bundle/combat-estimators-and-hotbar.js:350-525`:
- `[VERIFIED: mechanics/_raw/bundle/abilities-loader-and-hotbar.js:1164-1166]` — `samurai: [{ level: 1, id: "samurai_way", ... }], ninja: [{ level: 1, id: "ninja_shadowjump", ... }]`
- `[VERIFIED: mechanics/_raw/bundle/combat-estimators-and-hotbar.js:480-496]` — `case "samurai_lightning": case "samurai_lightning_r2": ... case "ninja_focus": ...`
1. **`CLASS_METADATA_PATCH` (`_E`)**: `samurai` (`id: 114, badge: "SM", robeHue: 1884`) and `ninja` (`id: 115, badge: "NJ", robeHue: 1175`).
2. **`STARTER_SKILLS_PATCH` (`WE`)**: 8-skill starter arrays for `samurai` and `ninja`.
3. **`STARTER_EQUIPMENT_PATCH` (`yE`)**: `kitTokens` and `paperdollLayers` for `samurai` and `ninja`.
4. **`LEGACY_TEMPLATES_PATCH` (`FE`)**: 4-skill weighted templates (`weight: 30/30/20/20`).
5. **`SEEDED_HOTBAR_PATCH` (`mE`)**: 5-slot seeded hotbars (`slotIndex: 0..4`).
6. **`PROGRESSION_TREE_PATCH` (`gE`)**: Full 12-milestone `L1..L60` progression arrays for `samurai` and `ninja` replacing the 1-entry stubs in `abilities-loader-and-hotbar.js:1164-1166`.
7. **`ABILITIES_CATALOG_PATCH` (`b`)**: The 12 `samurai` and 13 `ninja` catalog entries in raw catalog format (`unlockLevel` normalized to `1..60` for live client `gE` compatibility), plus an `applyDropInClassPatch(bundleTables)` helper function.
8. **`COMBAT_ESTIMATOR_PATCH` (`qC`)**: Switch-case estimator branches for all new Samurai (`samurai_perfection`, `samurai_confidence`, `samurai_double_strike`, `samurai_evasion`, `samurai_momentum_strike`, `samurai_armor_ignore`) and Ninja (`ninja_backstab`, `ninja_shuriken`, `ninja_animal_form`, `ninja_infectious_strike`, `ninja_smoke_bomb`, `ninja_ki_attack`, `ninja_surprise_attack`) abilities matching `combat-estimators-and-hotbar.js:390-515`.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Class JSON validation | Custom ad-hoc JSON property checks | `ClassSchema` in `src/schemas/skill.schema.ts` via `tools/validate_skills.ts` | `ClassSchema` already enforces 15+ structural and cross-field rules (`baseStats` sum 90, `legacyTemplateSkills` sum 100, `magicResist`/`focus` presence, `progression` 12-level tuple, `seededHotbar` 0..4 indices). |
| Combat DPS/TTK/EHP math | Spreadsheet or manual hand-calculated DPS estimates | `runClassBaselineSuite` in `src/sim/engine.ts` via `tools/sim_balance.ts` | Hand-calculated DPS ignores GCD contention, mana/stamina potion cooldowns, execute window uptime, and enemy stagger (`0.65x` damage scaling on `disarm`/`stun`/`paralyze`). |
| Baseline regression checks | Eyeballing numbers in console output | Automated parity assertions in `tools/sim_balance.ts --verify` | Automated checks guarantee both Mode A and Mode B stay within $\pm 5\text{–}8\%$ across all 4 brackets and exit non-zero on drift. |

---

## Common Pitfalls

### Pitfall 1: Violating `ClassSchema` Invariants on `progression`, `classNumericId`, or `starterSkills`
**What goes wrong:** `npx tsx tools/validate_skills.ts` fails with Zod validation errors on `ninja.json` or `samurai.json`.
**Why it happens:**
1. `progression` in `ClassSchema` (`src/schemas/skill.schema.ts:276-306`) is strictly `.length(12)` with levels `[1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60]`. Putting 13 items in `progression` (e.g., adding a `level: 55` milestone) fails validation.
2. `classNumericId` in `ClassSchema` (`L297`) is `min(101).max(116)` (`114` for `samurai`, `115` for `ninja`).
3. `starterSkills` (`L329-339`) must include `magicResist` (`skillId: 26, initialValue: 30`) and `focus` (`skillId: 50, initialValue: 50`), and every `initialValue` must be literally `30` or `50` (`L227`).
**How to avoid:** Keep `progression` at exactly 12 milestones (`1, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 60`), put any 13th ability (`ninja_shuriken`) in `abilities[]` with `progressionTreeLevel: 35`, use `classNumericId: 114` / `115`, and include `magicResist (26: 30)` + `focus (50: 50)` in `starterSkills`.

### Pitfall 2: Using `effectType: "dot"` Instead of `effectType: "direct_damage"` with `statusEffect.effectType: "dot"`
**What goes wrong:** `ninja_death`, `ninja_death_r2`, or `ninja_infectious_strike` deals zero initial strike damage, ignores `executeMultiplier`, and fails to arm Mode B `deathStrikeSwingsRemaining = 5`.
**Why it happens:** In `src/sim/engine.ts:866-887`, the `else if (skill.effectType === 'dot')` branch only applies a DoT and returns early before the `direct_damage` branch (`L888-973`) where weapon hits, `executeMultiplier`, `dot` statusEffect attachment (`L953-965`), and Mode B `deathStrikeSwingsRemaining = 5` (`L969-972`) are executed.
**How to avoid:** Always set `effectType: "direct_damage"` with `statusEffect: { ..., effectType: "dot", ... }` on weapon/special-move strikes that apply a DoT or delayed mark (`ninja_death`, `ninja_death_r2`, `ninja_infectious_strike`), matching `warrior_rend` in `data/live-classes/warrior.json:377-395`.

### Pitfall 3: Over-Stacking Unconditional `heal` or `reflect_magic` on Samurai (`ehpPerSec` Inflation)
**What goes wrong:** Samurai `ehpPerSec` balloons to `175–385` (`+18%` above Warrior/Mage/Ranger) at `L45` and `L60`.
**Why it happens:** `src/sim/engine.ts:1121-1122` already gives `classDef.id === 'samurai'` a built-in `+8%` Bushido parry scalar on top of `baseParryChance` (`25.8%`). Adding a `heal` tick statusEffect on `samurai_confidence` or `reflect_magic: 1` on `samurai_evasion` stacks on top of passive parry and inflates `totalHpHealedOrRegenerated + totalIncomingDamageMitigated`.
**How to avoid:** Follow the pre-verified Pattern 2 parameters (`samurai_confidence` as emergency heal `0.02..0.02` with `statusEffect: null`, `samurai_evasion` with `defense_pct: 4`, and brief `disarm` staggers on `samurai_lightning`, `samurai_momentum_strike`, and `samurai_armor_ignore`).

### Pitfall 4: Mode B Double-Counting Mode A Fallbacks
**What goes wrong:** In `mode_b`, Samurai L60 DPS jumps to `450.58` because `state.perfectionStreakBonusPct` (`+100%`) adds on top of `buffPerfectionPct` (`+10%`), and Ninja `DeathStrike` applies both the 4-tick Mode A DoT and the Mode B 5-swing detonation.
**Why it happens:** `src/sim/engine.ts` was written in Phase 3 before `samurai.json` and `ninja.json` existed, so its `mode_b` branches (`L754-757`, `L935-972`) stacked on top of `mode_a` status effects.
**How to avoid:** In Plan `05-03`, calibrate the `mode_b`-only branches in `src/sim/engine.ts` (`Pattern 4`) so `mode_b` replaces (rather than double-stacks with) the `mode_a` fallback approximations while keeping `mode_a` for `warrior`, `mage`, `ranger` 100% bit-for-bit identical to `data/sim-baselines/baseline-v0.99.0.json`.

---

## Code Examples

### Example 1: Extending `tools/validate_skills.ts` for Drop-in Class Files (`Plan 05-03`)
In `tools/validate_skills.ts:132-136`, `DEFAULT_FILES` currently validates `data/live-classes/{warrior,mage,ranger}.json`. Adding `design/drop-in/samurai.json` and `design/drop-in/ninja.json` when they exist (or via `--include-drop-in` / default list once created in Plans `05-01` and `05-02`) validates all 5 classes automatically:

```typescript
// Source: tools/validate_skills.ts:132-145
const DEFAULT_FILES = [
  'data/live-classes/warrior.json',
  'data/live-classes/mage.json',
  'data/live-classes/ranger.json',
  'design/drop-in/samurai.json',
  'design/drop-in/ninja.json',
];
```

### Example 2: Extending `tools/sim_balance.ts --verify` with 5-Class Parity Gate (`Plan 05-03`)
`tools/sim_balance.ts` must continue verifying that `warrior`, `mage`, `ranger` match `data/sim-baselines/baseline-v0.99.0.json` bit-for-bit, AND additionally load `design/drop-in/samurai.json` and `design/drop-in/ninja.json`, run `runClassBaselineSuite` in both `mode_a` and `mode_b`, and assert that `samurai` and `ninja` sit within the live class parity envelope across `L10`, `L25`, `L45`, `L60`.

---

## Assumptions Log

| # | Claim / Decision | Section | Risk if Wrong | Mitigation |
|---|------------------|---------|---------------|------------|
| A1 | At `L10` and `L25`, physical classes (`samurai`, `ninja`) benchmark against the physical `warrior`/`ranger` envelope (`7.32–8.08` L10, `45.06–52.39` L25) rather than the early-game `mage` spell outlier (`24.69` L10, `81.56` L25), while at `L45` and `L60` all 5 classes share the unified 3-class envelope. | Pattern 1 & Pattern 4 | If compared against L10 Mage (`24.69` DPS), a L10 melee class would need `3.3x` Warrior's DPS, breaking physical weapon scaling. | Document both physical (`warrior`/`ranger`) and 3-class comparisons explicitly in `design/BALANCE_REPORT.md`. |
| A2 | `ninja.json` includes `12` entries in `progression` (`L1..L60`) and `13` entries in `abilities` (adding `ninja_shuriken` at `progressionTreeLevel: 35` alongside `ninja_smoke_bomb`). | Pattern 3 | None — verified against `ClassSchema` (`progression.length === 12`, `abilities.min(8)`) and `validateCrossFieldInvariants`. | Keep `progression` strictly 12 items and `abilities` 13 items. |

---

## Validation Architecture (`nyquist_validation`)

### Test Framework
| Property | Value |
|----------|-------|
| Framework | TypeScript CLI Verification (`tsx` + `zod` + deterministic simulation assertions) |
| Config file | `package.json` (`tsconfig.json`) |
| Quick run command | `npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify` |
| Full suite command | `npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify && node --check design/drop-in/classes-patch.js && python3 mechanics/tools/kb.py check --root mechanics` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| `CLASS-01` | `design/SAMURAI_SPEC.md` & `design/drop-in/samurai.json` cover all 6 Bushido abilities, Honor/Perfection, Katana/No-Dachi synergies, and pass `ClassSchema` | schema + structural | `npx tsx tools/validate_skills.ts design/drop-in/samurai.json` | ❌ Wave 0 / Plan 05-01 |
| `CLASS-02` | `design/NINJA_SPEC.md` & `design/drop-in/ninja.json` cover all 8 Ninjitsu abilities, SmokeBomb/Shuriken/Fukiya, Kryss/Tekagi synergies, and pass `ClassSchema` | schema + structural | `npx tsx tools/validate_skills.ts design/drop-in/ninja.json` | ❌ Wave 0 / Plan 05-02 |
| `CLASS-03` | Dual-mode (Mode A & Mode B) specification in specs and JSON files; both modes simulate cleanly in `tools/sim_balance.ts` | simulation | `npx tsx tools/sim_balance.ts --verify` | ✅ (`tools/sim_balance.ts` extended in Plan 05-03) |
| `CLASS-04` | `design/drop-in/{samurai.json,ninja.json,items-bushido-ninjitsu.json,classes-patch.js}` validate cleanly | schema + syntax | `npx tsx tools/validate_skills.ts --verify && node --check design/drop-in/classes-patch.js` | ❌ Wave 0 / Plans 05-01..03 |
| `SIM-03` | `design/BALANCE_REPORT.md` & `tools/sim_balance.ts --verify` prove Samurai and Ninja sit within $\pm 5\text{–}8\%$ parity across `L10, L25, L45, L60` | deterministic balance gate | `npx tsx tools/sim_balance.ts --verify` | ❌ Wave 0 / Plan 05-03 |

### Wave 0 / Plan Verification Gates
- **Plan `05-01`**: Creates `design/drop-in/samurai.json` and `design/SAMURAI_SPEC.md`; verified by `npx tsx tools/validate_skills.ts design/drop-in/samurai.json`.
- **Plan `05-02`**: Creates `design/drop-in/ninja.json`, `design/drop-in/items-bushido-ninjitsu.json`, and `design/NINJA_SPEC.md`; verified by `npx tsx tools/validate_skills.ts design/drop-in/ninja.json`.
- **Plan `05-03`**: Calibrates Mode B in `src/sim/engine.ts`, updates `tools/validate_skills.ts` and `tools/sim_balance.ts` to validate and verify all 5 classes (`warrior`, `mage`, `ranger`, `samurai`, `ninja`), creates `design/drop-in/classes-patch.js` and `design/BALANCE_REPORT.md`; verified by `npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify && node --check design/drop-in/classes-patch.js`.

---

## Security Domain (`security_enforcement`)

### Applicable ASVS Categories
| ASVS Category | Applies? | Standard Control |
|---------------|----------|------------------|
| V2 Authentication | No | Offline static JSON/Markdown/JS drop-in artifacts and local deterministic CLI simulator. |
| V3 Session Management | No | No network or session state. |
| V4 Access Control | No | Read-only reference to `mechanics/_raw/bundle/*`; outputs restricted to `design/` and `src/`/`tools/`. |
| V5 Input Validation | **Yes** | Strict Zod schema validation (`ClassSchema` in `src/schemas/skill.schema.ts` and `schemas/class.schema.json`) on all drop-in JSON payloads (`samurai.json`, `ninja.json`), rejecting malformed numbers, out-of-range cooldowns/multipliers, or invalid `ModifierStat` enums. |
| V6 Cryptography | No | Deterministic PRNG (`Mulberry32`) is used strictly for combat simulation repeatability, not security. |

---

## Sources

### Primary (HIGH confidence — In-Repo Verified)
- `data/sim-baselines/baseline-v0.99.0.json:983-1128` — Exact Mode A baseline metrics for `warrior`, `mage`, `ranger` across `L10`, `L25`, `L45`, `L60`.
  - Verbatim quote (`L983-994`): `"classId": "warrior", "bracketId": "L10", "sustainedBossDps": 7.32, "highDefBossDps": 3.04, "multiTargetDps": 7.2, "trashTtkSec": 8.57, "netManaDeltaPerMin": 0, "netStaminaDeltaPerMin": 108.4, "ehpPerSec": 15.48`
- `src/schemas/skill.schema.ts:223-364` — `ClassSchema` and cross-field refinement invariants (`baseStats` sum 90, `legacyTemplateSkills` sum 100, `magicResist`/`focus` in `starterSkills`, `progression.length(12)`).
  - Verbatim quote (`L304-305`): `progression: z.array(ProgressionEntrySchema).length(12), abilities: z.array(AbilityEntrySchema).min(8),`
- `src/sim/engine.ts:52-54, 721-975, 1076-1140` — Deterministic combat simulation priority rules, `getSkillUnlockTier`, Mode A/Mode B hooks, and `ehpPerSec` calculation.
  - Verbatim quote (`L52-54`): `function getSkillUnlockTier(skill: AbilityEntry): number { return skill.progressionTreeLevel ?? skill.unlockLevel ?? 999; }`
  - Verbatim quote (`L1121-1122`): `const bushidoBonus = classDef.id === 'samurai' ? ((bracket.combatSkillLevel / 100) * 0.08) : 0;`
- `design/MODERNUO_MAPPING.md:27-325` — Phase 4 canonical Bushido/Ninjitsu Mode A/Mode B mapping, 8 Tokuno weapons table, and L1–60 progression blueprints.
- `mechanics/topics/class-structural-parity.md:19-145` — `_E`, `WE`, `yE`, `FE`, `mE`, `gE` client bundle tables for `samurai` (`114`) and `ninja` (`115`).
- `mechanics/classes/modernuo-bushido.md` & `mechanics/classes/modernuo-ninjitsu.md` — ModernUO C# formulas for Bushido (`400–405`) and Ninjitsu (`500–507`).
- `mechanics/modernuo/ninjitsu-items.md` — ModernUO C# item parameters for `SmokeBomb` (`0x2808`), `EggBomb` (`0x2809`), `Fukiya` (`0x27AA`), and `Shuriken` (`0x27AC`).

---

## Metadata

**Confidence breakdown:**
- Standard stack: **HIGH** — Uses existing `zod`, `tsx`, and `typescript` toolchain already verified in Phases 3–4.
- Architecture & Simulation Tuning: **HIGH** — Both `samurai.json` and `ninja.json` parameter sets were executed directly against `ClassSchema` and `runClassBaselineSuite` (`src/sim/engine.ts`) during research.
- Pitfalls: **HIGH** — All schema and simulation edge cases (`classNumericId <= 116`, `magicResist: 30` requirement, `effectType: "direct_damage"` with `dot` statusEffect, Mode B double-stacking) were empirically discovered and resolved.

**Research date:** 2026-11-06
**Valid until:** 2026-12-06
