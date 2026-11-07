# UO Idle v0.99.0 — Five-Class Combat Parity & Balance Report (`SIM-03` – `SIM-09`)

**Version:** `v0.99.0` (Milestone `v1.2` Live-Codebase Mathematical Fidelity)  
**Phases Covered:** `Phases 05, 07, 08, 12, 13, 14` (`SIM-03` through `SIM-09`, `CLASS-01` through `CLASS-04`)  
**Verification Commands:** `npx tsx tools/sim_balance.ts --verify && npx tsx tools/test_sim.ts`  
**Frozen Artifacts:** `data/sim-baselines/baseline-v0.99.0.json` (3-class live baseline), `data/sim-baselines/parity-5class-v0.99.0.json` (5-class Mode A & Mode B parity baseline), & `data/sim-baselines/gear-and-waves-v1.1.json` (9-tier material curves, 5 Tokuno affix loadouts, 3 weapon speed archetypes, and 10-wave endurance)

---

## Executive Summary & Parity Methodology (`SIM-03`, `SIM-06`–`SIM-09`)

This report provides the formal mathematical and simulation proof that the drop-in **Samurai (`bushido`, `id: 114`)** and **Ninja (`ninjitsu`, `id: 115`)** class specifications (`design/drop-in/samurai.json`, `design/drop-in/ninja.json`) sit within the target **$\pm 5\text{–}8\%$ numerical parity envelope** of UO Idle's live `v0.99.0` classes (`warrior`, `mage`, `ranger`) across all four progression brackets (`L10`, `L25`, `L45`, `L60`) and all four enemy encounter archetypes (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`) in both **Mode A (Engine-Strict)** and **Mode B (Authentic Extension)**.

### `v1.2` Live-Codebase Mathematical Fidelity Laws (`mechanics/topics/simulator-fidelity-audit.md`)
1. **Hard Attribute & Affix Caps (`i18n-en-abilities.js:2616`):**
   - `SpellDamage` (`SDI`) capped at `+50%` plus `+1%` per `10 INT` (`Math.floor(int / 10)`).
   - `DamageIncrease` (`DI`) capped at `+100%`; weapon skill bonus flattens above `100` (`Math.min(100, skillLevel)`).
   - Gear `SwingSpeedIncrease` (`SSI`) capped at `+60%`, while progression tree `Speed` (`treeSpeedPct`) and active haste buffs stack above `60%` down to the **`1,000ms` (`1.0s`) hard swing floor**.
   - `HitChanceIncrease` (`HCI`) and `DefenseChanceIncrease` (`DCI`) capped at `+45%`, with enemy defender `DCI` (`5%` on `low_def_boss`, `15%` on `high_def_boss`) and `Surprise Attack` DCI shred applied in `computeHitChance`.
   - `LowerManaCost` (`LMC`) capped at `+40%`, `EnhancePotions` capped at `+50%`, and `ReflectPhysical` reflected on incoming boss auto-attacks.
2. **Authoritative Hunting Bot Postures (`i18n-en-abilities.js:1574-1579`):**
   - `agressivo` (`Attack`): `1.20x` outgoing damage dealt, `1.40x` incoming damage taken.
   - `equilibrado` (`Balanced` / `Precision`): `1.00x` outgoing, `1.00x` incoming.
   - `defensivo` (`Defensive`): `0.60x` outgoing damage dealt, `0.80x` incoming damage taken.
3. **Material Tier Step Multipliers (`changelog-server-dev.md:58`):**
   - Each material step (`step = 0..8` from `Iron` to `Valorite`) applies `+8%` weapon damage (`1 + 0.08 * step`, `1.64x` at `Valorite`) and `+12%` armor resistance/durability (`1 + 0.12 * step`, `1.96x` at `Valorite`).
4. **Secondary Target `splashRatio` (`combat-estimators-and-hotbar.js:116-148`):**
   - Primary target (`targetIdx === 0`) takes `100%` of `rawDamagePerHit`; secondary targets (`targetIdx > 0`) on cleave abilities (`splashRatio < 1`) take `rawDamagePerHit * splashRatio` (`50%` on `warrior_cleave`, `85%` on `samurai_frenzied_whirlwind`).
5. **Canonical `ro(e)` Hotbar Auto-Trigger Thresholds (`abilities-loader-and-hotbar.js:609-695`):**
   - `lesser_heal_potion` (`<= 50%` HP), `heal_potion` (`<= 32%` HP), `greater_heal_potion` (`<= 18%` HP), `bandage` (`<= 80%` HP), `mage_heal` (`<= 50%` HP), `greater_heal` (`<= 40%` HP), standard `am` heals (`<= 55%` HP), `mana_potion` (`<= 40%` / `<= 28%` Mana), and `GE` AoE (`>= 3` targets via `zE(3)`).
6. **Complete 1H (`48,000`), 2H (`41,140`), and Shield (`400`) `CheckParry` Math (`BaseWeapon.cs:1505-1570`):**
   - Enforces the shield + Bushido penalty (`(parry - bushido) / 400`), pure shield parry (`parry / 400 + 5%` GM), 1H (`48,000`) vs 2H (`41,140`) Bushido weapon parry divisor, and low-DEX (`DEX < 80`) scaling.
7. **Unified Single-Wave & Multi-Wave Tick Kernel (`src/sim/engine.ts`):**
   - `simulateScenarioDetailed` and `simulateMultiWavePull` execute on a single shared tick resolution kernel (`createUnifiedKernelContext`, `stepKernelTimersAndSustain`, `stepKernelCombatActions`).

---

## Section 1 — 5-Class Mode A (`mode_a`) Summary & Parity Delta Tables (`L10`, `L25`, `L45`, `L60`)

All values below are reproduced deterministically by `npx tsx tools/sim_balance.ts --parity` (`mode_a`):

### 1.1 Bracket `L10` (`mode_a`)

| Class | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `overkillWastePct` | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` | Parity Delta vs Live Envelope |
|---|---:|---:|---:|---:|---:|---:|---:|---:|:---:|
| `warrior` *(Live)* | 6.67 | 2.00 | 6.47 | 8.57s | 4.99% | 0.00 | +108.40 | 17.24 | Baseline |
| `ranger` *(Live)* | 7.93 | 3.09 | 7.20 | 6.67s | 7.60% | -38.50 | +34.40 | 15.42 | Baseline |
| `mage` *(Live)* | 24.06 | 12.98 | 20.95 | 1.77s | 17.72% | -102.00 | +188.40 | 16.15 | Baseline |
| **`samurai`** | **6.21** (-6.9% vs W) | **2.59** (in `[2.00, 3.09]`) | **6.00** (-7.3% vs W) | **8.57s** (0.0% vs W) | **9.55%** | **-9.50** | **+188.40** | **16.23** (in `[15.42, 17.24]`) | **PASS ($\le 7.3\%$)** |
| **`ninja`** | **6.83** (in `[6.67, 7.93]`) | **2.65** (in `[2.00, 3.09]`) | **6.40** (-1.1% vs W) | **8.57s** (0.0% vs W) | **9.63%** | **-11.50** | **+188.40** | **16.61** (in `[15.42, 17.24]`) | **PASS ($\le 1.1\%$)** |

### 1.2 Bracket `L25` (`mode_a`)

| Class | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `overkillWastePct` | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` | Parity Delta vs Live Envelope |
|---|---:|---:|---:|---:|---:|---:|---:|---:|:---:|
| `warrior` *(Live)* | 49.04 | 20.66 | 56.86 | 4.03s | 15.03% | 0.00 | -8.60 | 56.42 | Baseline |
| `ranger` *(Live)* | 47.33 | 20.70 | 44.54 | 4.10s | 15.39% | -65.00 | +32.40 | 46.48 | Baseline |
| `mage` *(Live)* | 82.71 | 46.29 | 74.96 | 1.88s | 17.77% | -138.00 | +266.40 | 55.02 | Baseline |
| **`samurai`** | **46.07** (-2.7% vs R) | **19.38** (-6.2% vs W) | **50.45** (in `[44.5, 56.9]`) | **3.44s** (in `[1.88s, 4.10s]`) | **18.30%** | **-57.00** | **+266.40** | **53.46** (in `[46.5, 56.4]`) | **PASS ($\le 6.2\%$)** |
| **`ninja`** | **51.38** (+4.8% vs W) | **20.44** (-1.1% vs W) | **47.92** (in `[44.5, 56.9]`) | **3.82s** (in `[1.88s, 4.10s]`) | **14.82%** | **+15.00** | **+146.40** | **48.79** (in `[46.5, 56.4]`) | **PASS ($\le 4.8\%$)** |

### 1.3 Bracket `L45` (`mode_a`)

| Class | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `overkillWastePct` | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` | Parity Delta vs Live Envelope |
|---|---:|---:|---:|---:|---:|---:|---:|---:|:---:|
| `warrior` *(Live)* | 174.74 | 79.69 | 200.40 | 3.28s | 12.92% | 0.00 | -34.60 | 161.38 | Baseline |
| `mage` *(Live)* | 192.37 | 90.32 | 226.28 | 3.10s | 26.97% | -187.00 | +362.40 | 152.25 | Baseline |
| `ranger` *(Live)* | 182.54 | 91.28 | 183.97 | 3.12s | 16.33% | -94.50 | +18.40 | 147.50 | Baseline |
| **`samurai`** | **163.18** (-6.6% vs W) | **74.12** (-7.0% vs W) | **198.13** (in `[184.0, 226.3]`) | **3.24s** (in `[3.10s, 3.28s]`) | **25.83%** | **-55.50** | **+352.40** | **151.13** (in `[147.5, 161.4]`) | **PASS ($\le 7.0\%$)** |
| **`ninja`** | **193.08** (+0.4% vs M) | **87.10** (in `[79.7, 91.3]`) | **200.54** (in `[184.0, 226.3]`) | **3.14s** (in `[3.10s, 3.28s]`) | **10.92%** | **-6.50** | **+302.40** | **156.57** (in `[147.5, 161.4]`) | **PASS ($\le 0.4\%$)** |

### 1.4 Bracket `L60` (`mode_a`)

| Class | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `overkillWastePct` | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` | Parity Delta vs Live Envelope |
|---|---:|---:|---:|---:|---:|---:|---:|---:|:---:|
| `warrior` *(Live)* | 345.15 | 154.99 | 383.58 | 2.89s | 39.81% | 0.00 | +85.00 | 331.99 | Baseline |
| `mage` *(Live)* | 374.52 | 191.26 | 713.23 | 2.99s | 24.38% | -84.00 | +462.00 | 370.67 | Baseline |
| `ranger` *(Live)* | 403.59 | 226.54 | 731.67 | 2.72s | 29.66% | -14.00 | +88.00 | 327.00 | Baseline |
| **`samurai`** | **369.04** (in `[345.2, 403.6]`) | **189.75** (in `[155.0, 226.5]`) | **451.17** (in `[383.6, 731.7]`) | **2.81s** (in `[2.72s, 2.99s]`) | **30.74%** | **+51.00** | **+432.00** | **328.04** (in `[327.0, 370.7]`) | **PASS ($0.0\%$ out)** |
| **`ninja`** | **370.85** (in `[345.2, 403.6]`) | **184.06** (in `[155.0, 226.5]`) | **433.54** (in `[383.6, 731.7]`) | **2.87s** (in `[2.72s, 2.99s]`) | **25.03%** | **+70.00** | **+426.00** | **330.45** (in `[327.0, 370.7]`) | **PASS ($0.0\%$ out)** |

---

## Section 2 — 5-Class Mode B (`mode_b`) Summary & Mode A vs Mode B Comparison Tables

In **Mode B (`mode_b`)**, `src/sim/engine.ts` executes the authentic ModernUO C# extensions (`Perfection` streak scaling with on-kill reset, `CounterAttack` / `Iaido` reactive parry swing with `6.0s` ICD, `MirrorImage` clone interception with `10.0s` ICD, and `DeathStrike` / `TwinShadow` delayed detonation replacing the Mode A DoT fallback).

### 2.1 Mode B (`mode_b`) Summary Across `L10`, `L25`, `L45`, `L60`

| Class | Bracket | `sustainedBossDps` (`low_def_boss`) | `highDefBossDps` (`high_def_boss`) | `multiTargetDps` (`multi_target_pack`) | `trashTtkSec` (`fast_trash`) | `overkillWastePct` | `netManaDeltaPerMin` | `netStaminaDeltaPerMin` | `ehpPerSec` | Mode B vs Live Envelope |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|:---:|
| `samurai` | **L10** | 6.21 (-6.9% vs W) | 2.59 (in `[2.00, 3.09]`) | 6.00 (-7.3% vs W) | 8.57s (0.0% vs W) | 9.55% | -9.50 | +188.40 | 16.23 (in `[15.4, 17.2]`) | **PASS** |
| `samurai` | **L25** | 47.20 (-0.3% vs R) | 19.95 (-3.4% vs W) | 51.40 (in `[44.5, 56.9]`) | 3.32s (in `[1.88s, 4.10s]`) | 17.10% | -57.00 | +270.40 | 53.56 (in `[46.5, 56.4]`) | **PASS** |
| `samurai` | **L45** | 170.20 (-2.6% vs W) | 74.66 (-6.3% vs W) | 195.19 (in `[184.0, 226.3]`) | 3.24s (in `[3.10s, 3.28s]`) | 26.46% | -55.50 | +358.40 | 151.20 (in `[147.5, 161.4]`) | **PASS** |
| `samurai` | **L60** | 367.22 (in `[345.2, 403.6]`) | 193.60 (in `[155.0, 226.5]`) | 456.84 (in `[383.6, 731.7]`) | 2.81s (in `[2.72s, 2.99s]`) | 31.69% | +51.00 | +438.00 | 328.52 (in `[327.0, 370.7]`) | **PASS** |
| `ninja` | **L10** | 6.83 (in `[6.67, 7.93]`) | 2.65 (in `[2.00, 3.09]`) | 6.40 (-1.1% vs W) | 8.57s (0.0% vs W) | 9.63% | -11.50 | +188.40 | 17.12 (in `[15.4, 17.2]`) | **PASS** |
| `ninja` | **L25** | 49.41 (+0.8% vs W) | 19.90 (-3.7% vs W) | 45.51 (in `[44.5, 56.9]`) | 3.94s (in `[1.88s, 4.10s]`) | 16.14% | +15.00 | +146.40 | 50.93 (in `[46.5, 56.4]`) | **PASS** |
| `ninja` | **L45** | 186.84 (in `[174.7, 192.4]`) | 85.15 (in `[79.7, 91.3]`) | 192.24 (in `[184.0, 226.3]`) | 3.14s (in `[3.10s, 3.28s]`) | 11.20% | -6.50 | +302.40 | 156.57 (in `[147.5, 161.4]`) | **PASS** |
| `ninja` | **L60** | 364.22 (in `[345.2, 403.6]`) | 183.57 (in `[155.0, 226.5]`) | 408.59 (in `[383.6, 731.7]`) | 2.54s (-6.6% vs R) | 18.26% | +70.00 | +426.00 | 336.54 (in `[327.0, 370.7]`) | **PASS** |

---

## Section 3 — Per-Archetype Breakdown (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`)

| Mode | Class | Archetype | `sustainedDps` | `trashTtkSec` | `ehpPerSec` | `totalCasts` | `totalSwings` | `totalHits` | `totalCrits` | `parryCount` | `cloneInterceptions` | `oomTicks` |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `mode_a` | `warrior` | `fast_trash` | 308.30 | 2.89s | 117.87 | 17 | 23 | 33 | 11 | 6 | 0 | 0 |
| `mode_a` | `warrior` | `low_def_boss` | 345.15 | 68.84s | 222.33 | 29 | 49 | 65 | 22 | 12 | 0 | 0 |
| `mode_a` | `warrior` | `high_def_boss` | 154.99 | 127.75s | 331.99 | 28 | 50 | 56 | 19 | 12 | 0 | 0 |
| `mode_a` | `warrior` | `multi_target_pack` | 383.58 | 6.19s | 267.19 | 41 | 44 | 86 | 29 | 12 | 0 | 0 |
| `mode_a` | `mage` | `fast_trash` | 297.99 | 2.99s | 132.95 | 12 | 28 | 34 | 11 | 2 | 0 | 0 |
| `mode_a` | `mage` | `low_def_boss` | 374.52 | 63.44s | 248.75 | 26 | 55 | 67 | 23 | 3 | 0 | 0 |
| `mode_a` | `mage` | `high_def_boss` | 191.26 | 103.53s | 370.67 | 27 | 55 | 60 | 20 | 3 | 0 | 0 |
| `mode_a` | `mage` | `multi_target_pack` | 713.23 | 3.33s | 301.51 | 35 | 55 | 109 | 37 | 3 | 0 | 177 |
| `mode_a` | `ranger` | `fast_trash` | 327.57 | 2.72s | 137.60 | 15 | 24 | 37 | 16 | 1 | 0 | 0 |
| `mode_a` | `ranger` | `low_def_boss` | 403.59 | 58.87s | 224.18 | 28 | 53 | 77 | 34 | 3 | 0 | 0 |
| `mode_a` | `ranger` | `high_def_boss` | 226.54 | 87.40s | 327.00 | 27 | 54 | 72 | 32 | 3 | 0 | 0 |
| `mode_a` | `ranger` | `multi_target_pack` | 731.67 | 3.25s | 266.36 | 37 | 44 | 237 | 106 | 3 | 0 | 290 |
| `mode_a` | `samurai` | `fast_trash` | 317.08 | 2.81s | 142.57 | 17 | 25 | 34 | 11 | 5 | 0 | 0 |
| `mode_a` | `samurai` | `low_def_boss` | 369.04 | 64.38s | 235.41 | 29 | 51 | 66 | 22 | 12 | 0 | 0 |
| `mode_a` | `samurai` | `high_def_boss` | 189.75 | 104.35s | 328.04 | 27 | 50 | 55 | 18 | 12 | 0 | 0 |
| `mode_a` | `samurai` | `multi_target_pack` | 451.17 | 5.27s | 270.51 | 32 | 54 | 94 | 32 | 12 | 0 | 0 |
| `mode_a` | `ninja` | `fast_trash` | 310.45 | 2.87s | 151.04 | 16 | 27 | 37 | 16 | 2 | 0 | 0 |
| `mode_a` | `ninja` | `low_def_boss` | 370.85 | 64.07s | 229.56 | 27 | 55 | 70 | 31 | 3 | 0 | 0 |
| `mode_a` | `ninja` | `high_def_boss` | 184.06 | 107.57s | 330.45 | 25 | 55 | 64 | 29 | 3 | 0 | 0 |
| `mode_a` | `ninja` | `multi_target_pack` | 433.54 | 5.48s | 270.60 | 30 | 55 | 96 | 43 | 3 | 0 | 0 |
| `mode_b` | `samurai` | `fast_trash` | 317.08 | 2.81s | 137.92 | 17 | 26 | 35 | 11 | 5 | 0 | 0 |
| `mode_b` | `samurai` | `low_def_boss` | 367.22 | 64.70s | 235.77 | 29 | 52 | 67 | 22 | 12 | 0 | 0 |
| `mode_b` | `samurai` | `high_def_boss` | 193.60 | 102.27s | 328.52 | 27 | 51 | 56 | 18 | 12 | 0 | 0 |
| `mode_b` | `samurai` | `multi_target_pack` | 456.84 | 5.20s | 270.99 | 32 | 55 | 95 | 32 | 12 | 0 | 0 |
| `mode_b` | `ninja` | `fast_trash` | 350.79 | 2.54s | 137.12 | 15 | 24 | 33 | 15 | 1 | 2 | 0 |
| `mode_b` | `ninja` | `low_def_boss` | 364.22 | 65.24s | 232.98 | 27 | 55 | 70 | 31 | 3 | 4 | 0 |
| `mode_b` | `ninja` | `high_def_boss` | 183.57 | 107.86s | 336.54 | 25 | 55 | 64 | 29 | 3 | 4 | 0 |
| `mode_b` | `ninja` | `multi_target_pack` | 408.59 | 5.82s | 275.17 | 29 | 55 | 95 | 43 | 3 | 4 | 0 |

---

## Section 4 — Resource Economy & Anti-Immortality Audit

1. **Samurai Resource Delta (`L10..L60`):**
   - `netManaDeltaPerMin`: `-9.50/min` (`L10`), `-57.00/min` (`L25`), `-55.50/min` (`L45`), `+51.00/min` (`L60`, `0` OOM ticks), well above the `-195.00/min` sustainability floor.
   - `netStaminaDeltaPerMin`: `+188.40/min` (`L10`), `+266.40/min` (`L25`), `+352.40/min` (`L45`), `+432.00/min` (`L60`).
2. **Ninja Resource Delta (`L10..L60`):**
   - `netManaDeltaPerMin`: `-11.50/min` (`L10`), `+15.00/min` (`L25`), `-6.50/min` (`L45`), `+70.00/min` (`L60`, `0` OOM ticks).
   - `netStaminaDeltaPerMin`: `+188.40/min` (`L10`), `+146.40/min` (`L25`), `+302.40/min` (`L45`), `+426.00/min` (`L60`).
3. **Avoidance & Clone Immortality Caps:**
   - Total avoidance (`Parry` + `Bushido` + `DCI`) is hard-capped at `65%` (`src/sim/engine.ts:447`), keeping Samurai `L60` `ehpPerSec` at `328.04`–`328.52` (vs `331.99` `warrior`).
   - Ninja `MirrorImage` clones enforce `stackingRule: "exclusive_posture"` and a `10,000ms` internal interception cooldown (`cloneInterceptions: 4` per `60s` boss fight), keeping `L60` `ehpPerSec` at `330.45`–`336.54`.

---

## Section 5 — Extended Gear, Affix, Damage-Channel & Multi-Wave Telemetry (`SIM-04`–`SIM-09`)

### 5.1 `L60` Damage Channel Breakdown (`low_def_boss`, `mode_b`)

| Class | `autoAttackDps` | `specialMoveDps` | `executeDps` | `dotDps` | `procCounterDps` | `totalDps` | Primary Offensive Identity |
|---|---:|---:|---:|---:|---:|---:|---|
| `warrior` | 203.98 | 117.84 | 20.84 | 0.00 | 2.48 | **345.15** | Heavy physical auto-swings + `Mortal Strike` / `Execution` + `ReflectPhysical` |
| `mage` | 236.32 | 134.62 | 0.00 | 0.00 | 3.58 | **374.52** | High-multiplier elemental `Magery` spell cadence (`+50%` SDI cap + `INT/10`) |
| `ranger` | 223.85 | 112.82 | 61.20 | 0.00 | 5.72 | **403.59** | Rapid `Precision` bow shots + `Multishot` + `Deadeye` finisher |
| **`samurai`** | **243.01** | **106.85** | **13.83** | **0.00** | **3.52** | **367.22** | `Perfection`-amplified katana swings + `Kensei's Judgment` execute + `Iaido`/`Counter` parry ripostes |
| **`ninja`** | **238.67** | **87.13** | **19.80** | **13.42** | **5.19** | **364.22** | High-speed crits + `Twin Shadow` / `Death Strike` detonation + `Infectious` venom + `Spirit Claw` procs |

### 5.2 Material Tier Scaling Curve (`Iron -> Valorite` at `L60`, `+8%` Weapon / `+12%` Armor per Step)

| Material Tier (`step`, Weapon / Armor Mult) | `warrior` (DPS / EHP) | `mage` (DPS / EHP) | `ranger` (DPS / EHP) | **`samurai` (DPS / EHP)** | **`ninja` (DPS / EHP)** |
|---|---:|---:|---:|---:|---:|
| **Iron** (`0`, `1.00x / 1.00x`) | 129.46 / 214.43 | 170.35 / 192.95 | 116.31 / 144.85 | **121.51 / 176.30** | **124.88 / 163.05** |
| **DullCopper** (`1`, `1.08x / 1.12x`) | 151.87 / 215.79 | 192.07 / 209.65 | 146.05 / 161.36 | **150.65 / 190.71** | **157.74 / 178.33** |
| **ShadowIron** (`2`, `1.16x / 1.24x`) | 173.92 / 231.52 | 212.99 / 232.53 | 175.57 / 185.82 | **178.11 / 205.80** | **175.14 / 202.58** |
| **Copper** (`3`, `1.24x / 1.36x`) | 196.58 / 242.43 | 246.25 / 250.52 | 203.74 / 203.55 | **206.11 / 219.65** | **206.44 / 220.01** |
| **Bronze** (`4`, `1.32x / 1.48x`) | 217.67 / 253.34 | 282.78 / 269.78 | 228.90 / 222.49 | **224.67 / 233.99** | **225.82 / 237.93** |
| **Gold** (`5`, `1.40x / 1.60x`) | 243.82 / 274.58 | 298.77 / 294.82 | 255.61 / 248.96 | **280.17 / 251.55** | **257.22 / 260.88** |
| **Agapite** (`6`, `1.48x / 1.72x`) | 288.40 / 289.79 | 336.00 / 317.74 | 311.41 / 271.41 | **297.71 / 266.94** | **288.60 / 283.39** |
| **Verite** (`7`, `1.56x / 1.84x`) | 328.48 / 307.94 | 352.30 / 340.52 | 332.95 / 295.20 | **351.10 / 290.55** | **329.82 / 308.08** |
| **Valorite** (`8`, `1.64x / 1.96x`) | 352.08 / 330.90 | 374.14 / 369.24 | 400.00 / 325.54 | **366.61 / 322.81** | **363.62 / 335.16** |

### 5.3 Tokuno Affix Loadout Scaling (`L60`, `mode_b`)

| Loadout Archetype | `warrior` (DPS / EHP) | `mage` (DPS / EHP) | `ranger` (DPS / EHP) | **`samurai` (DPS / EHP)** | **`ninja` (DPS / EHP)** |
|---|---:|---:|---:|---:|---:|
| `clean_base` *(Un-Affixed Base Gear)* | 167.09 / 236.44 | 209.70 / 246.54 | 165.90 / 198.04 | **174.13 / 214.19** | **170.93 / 214.75** |
| `speed_crit` *(+60% SSI, +22% Crit)* | 326.75 / 322.01 | 347.41 / 360.08 | 344.89 / 316.02 | **351.54 / 309.92** | **329.57 / 323.42** |
| `power_lethality` *(+95% DI, +50% SDI)* | 389.70 / 322.01 | 391.66 / 360.08 | 414.22 / 316.02 | **405.93 / 309.92** | **388.15 / 323.42** |
| `bastion_parry` *(+45% DCI, 70% Resist)* | 299.55 / 401.54 | 341.58 / 450.32 | 318.41 / 425.30 | **312.77 / 416.41** | **310.91 / 432.62** |
| `valorite_bis` *(Grandmaster Valorite Cap)* | 490.15 / 410.61 | 460.24 / 441.83 | 497.55 / 420.23 | **514.60 / 410.40** | **472.59 / 424.18** |

### 5.4 10-Wave Consecutive Dungeon Pull Endurance (`L60`, `1,500ms` Inter-Wave Spawn Delay, Unified Tick Kernel)

| Class | Total 10-Wave Clear Time | Average Effective Wave DPS | Minimum HP % | Minimum Mana % | Total Parries | Clone Interceptions |
|---|---:|---:|---:|---:|---:|---:|
| `warrior` | 114.60s | 298.87 | 84.97% | 100.00% | 21 | 0 |
| `mage` | 65.60s | 1234.31 | 49.93% | 40.59% | 3 | 0 |
| `ranger` | 70.70s | 1263.26 | 72.65% | 41.43% | 3 | 0 |
| **`samurai`** | **101.60s** | **335.24** | **80.88%** | **75.48%** | **17** | **0** |
| **`ninja`** | **104.30s** | **332.67** | **71.39%** | **69.68%** | **5** | **6** |

---

## Section 6 — Weapon Swing Speed Archetypes (`2.25s` Fast 1H vs `2.50s` Balanced 1H vs `3.25s` Heavy 2H) & Balance Analysis

All three canonical UO weapon speed families (`fast_1h`: `2,250ms` / `0.90x` hit dmg; `balanced_1h`: `2,500ms` / `1.00x` hit dmg; `heavy_2h`: `3,250ms` / `1.30x` hit dmg) share an identical normalized raw weapon DPS ratio (`0.90 / 2.25s = 1.00 / 2.50s = 1.30 / 3.25s = 0.400/s`). However, simulating all 15 class × weapon-speed combinations (`weaponArchetypeCurves` in `data/sim-baselines/gear-and-waves-v1.1.json`) reveals four critical non-linear dynamics:

1. **`1,000ms` Floor Clipping & Discrete `100ms` Tick Quantization:**
   - At `L60` (`55%` Gear `SSI` + `20%` tree `Speed` + `150–175` Stamina), `fast_1h` (`2,250ms`) reaches `1,000ms–1,020ms` (`10` ticks), hitting the **`1,000ms` hard swing floor**. Any additional haste from `Honorable Execution` (`+15%`), `Kensei Stance` (`+12%`), or `Animal Form` (`+10%`) is clipped on `fast_1h`, whereas `heavy_2h` (`3,250ms` -> `1,380ms–1,473ms` effective) derives full value from every point of `SSI`, Stamina, and haste buffs.
2. **Weapon-Scaled Special Moves (`Cq`) on Fixed Wall-Clock Cooldowns:**
   - Because Special Moves (`Lightning Strike`, `Honorable Execution`, `Momentum Strike`, `Backstab`, `Focus Attack`, `Mortal Strike`, `Whirlwind`) scale off `weaponAvgDmg` (`1.30x` on `heavy_2h` vs `0.90x` on `fast_1h`) while their cooldowns (`7s–14s`) are fixed in wall-clock seconds, `heavy_2h` weapons deal `+30%` more burst/ability and execute damage per cooldown cycle while `autoAttackDps` remains nearly flat (`237.44` vs `244.83` on Ninja; `236.79` vs `256.83` on Samurai).
3. **Samurai (`Bushido`) 1H vs 2H Trade-Off:**
   - `fast_1h` (`Wakizashi / Kama`, `57` swings/min) stacks `Perfection` (`+2%` to `+4%` per connected hit) `~30%` faster after any miss.
   - `heavy_2h` (`No-Dachi / Lajatang`, `44` swings/min) switches `CheckParry` from the `1H` divisor (`48,000`) to the **`2H` divisor (`41,140`)**, increasing parry count (`12` -> `13`), boosting `ehpPerSec` (`328.52` -> `335.62`), and scaling `Kensei's Judgment` / `Counter Attack` / `Iaido Flash Riposte` hits by `1.30x` (`lowDefBossDps` rises from `361.85` -> `367.22` -> `416.80`).
4. **Ninja (`Ninjitsu`) & Warrior (`Shield` vs `2H`) Trade-Offs:**
   - **Ninja:** `fast_1h` (`Kryss / Tekagi`, `60` swings/min vs `43` on `heavy_2h`) triggers `Kitsune & Wolf Spirit Claw` (every 3rd hit) and detonates `Death Strike` / `Twin Shadow Mark` (3rd/5th hit) `~40%` faster in short trash windows, whereas `heavy_2h` (`Fukiya & Heavy Kama`) maximizes boss burst (`349.00` -> `364.22` -> `408.29`).
   - **Warrior:** Switching from `balanced_1h` (`Scepter & Order Shield`, `hasShield: true`, `400` shield divisor) to `heavy_2h` (`Halberd`, `hasShield: false`) sacrifices shield parry (`parryCount` drops `12 -> 9`, `ehpPerSec` drops `331.99 -> 322.66`) in exchange for `+18.2%` Boss DPS (`345.15 -> 408.03`).

| Class (`L60` Mode B) | Weapon Archetype | Weapon Profile | Base (`ms`) | Effective (`ms`) | Swings (`60s`) | Auto DPS | Boss DPS | High-Def DPS | Pack DPS | Parries | EHP/sec |
|---|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `warrior` | `fast_1h` | Broadsword & Heater Shield | 2250 | 1020 | 54 | 191.86 | 331.19 | 147.94 | 372.56 | 12 | 331.99 |
| `warrior` | `balanced_1h` | Scepter & Order Shield | 2500 | 1133 | 49 | 203.98 | 345.15 | 154.99 | 383.58 | 12 | 331.99 |
| `warrior` | `heavy_2h` | Halberd / War Hammer (2H) | 3250 | 1473 | 39 | 199.67 | 408.03 | 173.58 | 435.60 | 9 | 322.66 |
| `mage` | `fast_1h` | Spellweaver Wand (1H) | 2250 | 1020 | 60 | 244.33 | 357.11 | 185.87 | 713.95 | 3 | 370.67 |
| `mage` | `balanced_1h` | Gnarled Staff (2H) | 2500 | 1133 | 55 | 236.32 | 374.52 | 191.26 | 713.23 | 3 | 370.67 |
| `mage` | `heavy_2h` | Black Staff (2H) | 3250 | 1473 | 43 | 238.66 | 379.40 | 193.11 | 714.12 | 3 | 370.67 |
| `ranger` | `fast_1h` | Yumi / Repeating Bow | 2250 | 1000 | 59 | 230.47 | 375.25 | 209.16 | 687.47 | 3 | 327.00 |
| `ranger` | `balanced_1h` | Composite Bow (2H) | 2500 | 1061 | 53 | 223.85 | 403.59 | 226.54 | 731.67 | 3 | 327.00 |
| `ranger` | `heavy_2h` | Heavy Crossbow (2H) | 3250 | 1380 | 41 | 221.16 | 437.66 | 262.06 | 875.30 | 3 | 327.00 |
| **`samurai`** | **`fast_1h`** | **Wakizashi / Kama (1H)** | **2250** | **1020** | **57** | **236.79** | **361.85** | **185.84** | **414.28** | **12** | **328.52** |
| **`samurai`** | **`balanced_1h`** | **Katana / Bokuto (1H)** | **2500** | **1133** | **52** | **243.01** | **367.22** | **193.60** | **456.84** | **12** | **328.52** |
| **`samurai`** | **`heavy_2h`** | **No-Dachi / Lajatang (2H)** | **3250** | **1473** | **44** | **256.83** | **416.80** | **238.75** | **497.44** | **13** | **335.62** |
| **`ninja`** | **`fast_1h`** | **Kryss / Tekagi Claws (1H)** | **2250** | **1000** | **60** | **237.44** | **349.00** | **174.29** | **391.73** | **3** | **336.54** |
| **`ninja`** | **`balanced_1h`** | **Sai / Kama Pair (1H)** | **2500** | **1061** | **55** | **238.67** | **364.22** | **183.57** | **408.59** | **3** | **336.54** |
| **`ninja`** | **`heavy_2h`** | **Fukiya & Heavy Kama (2H)** | **3250** | **1380** | **43** | **244.83** | **408.29** | **198.84** | **475.83** | **3** | **336.54** |
