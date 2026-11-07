# Phase 4 MVP Slice Plan — ModernUO Reference KB & Baseline Combat Simulator

**Phase:** 4 — ModernUO Reference KB & Baseline Combat Simulator
**Generated:** 2026-11-07

## User Story

> **As a** UO Idle Lead Developer, **I want to** consult claim-verified ModernUO Bushido and Ninjitsu KB pages alongside a side-by-side idle state-machine adaptation matrix (`design/MODERNUO_MAPPING.md`) and run a deterministic, tick-accurate baseline combat simulator (`npx tsx tools/sim_balance.ts --verify`) reproducing live Warrior, Mage, and Ranger combat curves across four progression brackets and four enemy archetypes, **so that** every canonical ModernUO formula, Mode A/Mode B idle translation, and live class DPS/TTK/resource/EHP benchmark is mathematically proven before designing and tuning Samurai and Ninja in Phase 5.

## Capability Proven End-to-End

> A developer or agent can read nineteen new claim-verified KB pages across `mechanics/modernuo/` (17 atomic C# pages) and `mechanics/classes/` (`modernuo-bushido.md`, `modernuo-ninjitsu.md`) passing `python3 mechanics/tools/kb.py check --root mechanics` (`"ok": true`, `"pages": 31`, `"errors": []`), inspect `design/MODERNUO_MAPPING.md` mapping all 8 Bushido mechanics, 9 Ninjitsu mechanics, and 4 Tokuno Ninjitsu items to Mode A and Mode B idle state machines, and run `npx tsx tools/sim_balance.ts --verify` to deterministically simulate live Warrior, Mage, and Ranger combat loops against `data/sim-baselines/baseline-v0.99.0.json` with exit code `0`.

## SPIDR Split Decisions & Wave Ordering

| SPIDR Dimension | Slice / Plan | Wave & Dependencies | Rationale |
|---|---|---|---|
| **ModernUO Reference KB & Idle State-Machine Mapping Slice 1 (`04-01-PLAN.md`)** | 17 atomic `mechanics/modernuo/*.md` pages + 2 synthesis pages (`mechanics/classes/modernuo-bushido.md`, `mechanics/classes/modernuo-ninjitsu.md`) + regenerated `mechanics/INDEX.md` + side-by-side adaptation specification `design/MODERNUO_MAPPING.md` (`SIM-01`). | **Wave 1** (`depends_on: []`) | Tasks 1 and 2 author all 19 ModernUO KB pages (`31` total KB pages) and `design/MODERNUO_MAPPING.md` in Wave 1 with zero file conflicts, resolving `kb.py`'s single-`sources[0]` constraint via 17 per-file atomic C# pages cross-linked into `modernuo-bushido.md` and `modernuo-ninjitsu.md`. |
| **Deterministic Combat Simulator & Live Class Baselines Slice 2 (`04-02-PLAN.md`)** | Modular `100ms`-tick combat simulation engine (`src/sim/types.ts`, `src/sim/archetypes.ts`, `src/sim/engine.ts`), CLI runner (`tools/sim_balance.ts` supporting `--baseline`, `--verify`, `--json`), and frozen baseline artifact (`data/sim-baselines/baseline-v0.99.0.json`) (`SIM-02`). | **Wave 2** (`depends_on: ["04-01"]`) | Implements the verified UO Idle combat math from Phases 2–3 (`Sg`, `vq`/`Gs`, `yq`, `fj`/`Zo`, `jq`, `Mq`, `wq`, `Eq`, `tI`, `ro(e)`) across 4 progression brackets (`L10`, `L25`, `L45`, `L60`) × 4 enemy archetypes (`fast_trash`, `low_def_boss`, `high_def_boss`, `multi_target_pack`) and freezes the reproducible v0.99.0 baseline benchmarks for Phase 5 parity testing. |

## Key Technical Invariants Enforced Across Both Slices

1. **`kb.py` Frontmatter, Category & Single-`sources[0]` Contract (`fm-bad-json`, `fm-bad-category`, `quote-not-in-raw`):** Every KB page uses the 9 single-line JSON frontmatter keys (`id`, `title`, `category`, `aliases`, `status`, `sources`, `evidence`, `code_refs`, `updated`). Because `kb.py` verifies `(raw L<a>-L<b>)` claims exclusively against `sources[0]`, each of the 17 atomic `mechanics/modernuo/*.md` pages binds its primary C# source file in `sources[0]`, while `mechanics/classes/modernuo-bushido.md` (`sources[0]: "_raw/modernuo/BaseWeapon.cs"`) and `mechanics/classes/modernuo-ninjitsu.md` (`sources[0]: "_raw/modernuo/NinjaSpell.cs"`) quote their primary file in `## Claims` and cross-link `[[bushido-*]] C<n>` and `[[ninjitsu-*]] C<n>` in their synthesis sections.
2. **Digit-Free `## Summary` (`summary-number`):** Every KB page's `## Summary` section spells out numbers in words and contains zero ASCII digits (`0-9`).
3. **Dual-Mode Idle Adaptation Contract (`design/MODERNUO_MAPPING.md`):** Every Bushido and Ninjitsu mechanic is mapped both to **Mode A** (100% existing UO Idle engine opcodes: `self_buff`, `direct_damage`, `dot`, `debuff`, `heal`, `WeaponAbility`, `SpecialMove`, `Passive`) and **Mode B** (`<20 LOC` native C# hook extensions for `Perfection` streak scaling, reactive `CounterAttack` on parry, ablative `MirrorImage` clone stacks with ICD, and 5-swing `DeathStrike` delayed detonation), reconciling the 12 pre-existing `samurai_*` and `ninja_*` entries in `abilities-catalog.json` with the 12-milestone `gE` L1–60 progression curve.
4. **Bit-for-Bit Deterministic `100ms` Tick Simulation (`src/sim/` & `tools/sim_balance.ts`):** The combat simulator uses deterministic Bresenham/expected-value accumulators (`hitAcc`, `critAcc`) on a `100ms` discrete tick clock, applies Warrior's runtime `0`-mana stamina conversion (`tI`) and the `2,000ms` `Custom` cooldown floor (`ro(e)`), and verifies bit-for-bit reproducibility against `data/sim-baselines/baseline-v0.99.0.json`.
