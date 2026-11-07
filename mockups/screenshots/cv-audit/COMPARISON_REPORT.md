# Playwright + Computer Vision (CV) Button & Smooth-Scroll Audit Report

- **Before Baseline**: `16/38` passed (`22` failed — fatal JS `SyntaxError` on Simulator, `display: none` section/card hiding, non-reactive SVG brackets & breakdown bars)
- **After Overhaul**: `46/46` passed (`0` failed — `100%` pass rate, zero `display: none` hiding, smooth scroll + section/card spotlighting verified via CV)

| # | Page | Button / Control | Category | BEFORE Status | BEFORE Scroll / Hidden / CV% | AFTER Status | AFTER Scroll / Hidden / CV% |
|---|------|------------------|----------|---------------|------------------------------|--------------|-----------------------------|
| 1 | `sim` | Workbench View: 1. Combat Simulator & Visual Charts | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.3187% | **PASS** | ΔY=282px, hid=0/0, CV=26.4002% |
| 2 | `sim` | Workbench View: Visual SVG Curves & 5-Channel Breakdown | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=537px, hid=0/0, CV=33.7264% |
| 3 | `sim` | Workbench View: 9-Tier Material & 10-Wave Endurance | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=644px, hid=0/0, CV=36.0757% |
| 4 | `sim` | Workbench View: 2. 5-Class L1–L60 Progression Matrix | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.6435% | **PASS** | ΔY=552px, hid=0/0, CV=33.3395% |
| 5 | `sim` | Workbench View: 3. Tokuno Armaments & C# Server Hooks | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.6825% | **PASS** | ΔY=478px, hid=0/0, CV=33.2118% |
| 6 | `sim` | Workbench View: All Sections (Return to Top Overview) | `scroll-nav` | PASS | ΔY=-1400px, hid=0/0, CV=24.1997% | **PASS** | ΔY=-1453px, hid=0/0, CV=24.4666% |
| 7 | `sim` | Sim Filter: Mode B (<20 LOC C# Hook) | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.2467% | **PASS** | ΔY=0px, hid=0/0, CV=22.5527% (Brk=40.37%) |
| 8 | `sim` | Sim Filter: Mode A (100% Existing Engine) | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.2467% | **PASS** | ΔY=0px, hid=0/0, CV=4.1247% |
| 9 | `sim` | Sim Filter: Bracket L10 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0607% | **PASS** | ΔY=0px, hid=0/0, CV=4.8121% (Chart=7.1772%) |
| 10 | `sim` | Sim Filter: Bracket L25 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1215% | **PASS** | ΔY=0px, hid=0/0, CV=3.7849% (Chart=6.7679%) |
| 11 | `sim` | Sim Filter: Bracket L45 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1215% | **PASS** | ΔY=0px, hid=0/0, CV=3.5874% (Chart=6.89%) |
| 12 | `sim` | Sim Filter: Bracket L60 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0607% | **PASS** | ΔY=0px, hid=0/0, CV=3.6212% (Chart=6.457%) |
| 13 | `sim` | Sim Filter: Archetype high_def_boss | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1478% | **PASS** | ΔY=0px, hid=0/0, CV=4.2092% |
| 14 | `sim` | Sim Filter: Archetype fast_trash | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.2595% | **PASS** | ΔY=0px, hid=0/0, CV=4.6418% |
| 15 | `sim` | Sim Filter: Archetype multi_target_pack | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.285% | **PASS** | ΔY=0px, hid=0/0, CV=5.1395% |
| 16 | `sim` | Sim Filter: Archetype low_def_boss | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.1733% | **PASS** | ΔY=0px, hid=0/0, CV=4.6663% |
| 17 | `sim` | Executive KPI Card: Samurai (SM) | `card-spotlight` | PASS | ΔY=0px, hid=0/0, CV=0.2486% | **PASS** | ΔY=0px, hid=0/0, CV=7.888% |
| 18 | `sim` | Progression Chart Metric: Trash TTK Speed | `sim-filter` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=1.8476% |
| 19 | `sim` | Progression Chart Metric: Parity Envelope % | `sim-filter` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=2.013% |
| 20 | `sim` | Progression Chart SVG Bracket Column: L25 | `sim-filter` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=5.727% |
| 21 | `sim` | Quick Dock Chip: [M] Mode A/B | `quick-dock` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=0px, hid=0/0, CV=4.2111% |
| 22 | `sim` | Header Summary Pill: 34 UO Item Sprites (Scroll to Armaments) | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=472px, hid=0/0, CV=40.8282% |
| 23 | `samurai` | Header Button: PT-BR Locale | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=5.1736% | **PASS** | ΔY=0px, hid=0/0, CV=12.6273% |
| 24 | `samurai` | Header Button: EN Locale | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=2.9942% | **PASS** | ΔY=0px, hid=0/0, CV=1.7994% |
| 25 | `samurai` | Header Button: Mode B (<20 LOC C#) | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=4.6074% | **PASS** | ΔY=0px, hid=0/0, CV=4.6749% |
| 26 | `samurai` | Header Button: Mode A (100% Engine) | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=4.6246% | **PASS** | ΔY=0px, hid=0/0, CV=4.5483% |
| 27 | `samurai` | [Arvore Cobra Node: L60 Capstone (Kensei) | `tree-interaction` | **FAIL** | ΔY=0px, hid=0/0, CV=7.2484% | **PASS** | ΔY=0px, hid=0/0, CV=14.244% |
| 28 | `samurai` | [Arvore Progression Tier: Grandmaster L40–L60 | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=14.2975% |
| 29 | `samurai` | [Arvore Progression Step: Next Milestone ▶ | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=2.6429% |
| 30 | `samurai` | [Arvore Progression Tier: All L1–L60 | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=12.0247% |
| 31 | `samurai` | Inspector Progressive Disclosure Tab: Drop-In JSON Schema | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=0.2426% |
| 32 | `samurai` | Inspector Progressive Disclosure Tab: Overview | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=0.5537% |
| 33 | `samurai` | Filter Kind Button: passive | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/11, CV=19.2919% | **PASS** | ΔY=0px, hid=0/0, CV=4.6876% |
| 34 | `samurai` | Filter Kind Button: skill | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/7, CV=13.7128% | **PASS** | ΔY=0px, hid=0/0, CV=10.5944% |
| 35 | `samurai` | Filter Kind Button: spell | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/8, CV=7.2499% | **PASS** | ΔY=0px, hid=0/0, CV=9.2941% |
| 36 | `samurai` | Filter Kind Button: special | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/10, CV=13.5848% | **PASS** | ΔY=0px, hid=0/0, CV=10.8594% |
| 37 | `samurai` | Filter Kind Button: all | `card-spotlight` | PASS | ΔY=0px, hid=0/0, CV=17.6277% | **PASS** | ΔY=0px, hid=0/0, CV=12.7202% |
| 38 | `samurai` | Button: Toggle All Schema Drawers | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=11.0816% | **PASS** | ΔY=0px, hid=0/0, CV=8.2404% |
| 39 | `samurai` | Paperdoll Material Tier: Iron | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=6.8451% | **PASS** | ΔY=0px, hid=0/0, CV=5.5622% |
| 40 | `samurai` | Paperdoll Gear Slot: Imperial Kabuto Helm | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=1.0749% | **PASS** | ΔY=0px, hid=0/0, CV=1.3854% |
| 41 | `samurai` | Live Combat Ticker: Step +2.0s | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=0.5249% | **PASS** | ΔY=0px, hid=0/0, CV=0.5432% |
| 42 | `samurai` | Class Mastery Seal: Tier IV (L60) | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0315% | **PASS** | ΔY=460px, hid=0/0, CV=33.3274% |
| 43 | `ninja` | Dual L35 Unlock Banner: Shuriken & Fukiya Volley | `tree-interaction` | PASS | ΔY=681px, hid=0/0, CV=37.8519% | **PASS** | ΔY=238px, hid=0/0, CV=33.686% |
| 44 | `ninja` | Ninja Filter Kind: Spells | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/9, CV=12.5169% | **PASS** | ΔY=0px, hid=0/0, CV=19.5312% |
| 45 | `ninja` | Ninja 5-Slot Hotbar: Slot 2 | `tree-interaction` | **FAIL** | ΔY=0px, hid=0/9, CV=3.0434% | **PASS** | ΔY=48px, hid=0/0, CV=24.6531% |
| 46 | `portal` | Portal Header Pill: 56 KB Pages (Scroll to Repo Guide) | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=384px, hid=0/0, CV=35.0529% |
