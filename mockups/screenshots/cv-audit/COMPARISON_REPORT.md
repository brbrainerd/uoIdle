# Playwright + Computer Vision (CV) Button & Smooth-Scroll Audit Report

- **Before Baseline**: `16/38` passed (`22` failed — fatal JS `SyntaxError` on Simulator, `display: none` section/card hiding, non-reactive SVG brackets & breakdown bars)
- **After Overhaul**: `38/38` passed (`0` failed — `100%` pass rate, zero `display: none` hiding, smooth scroll + section/card spotlighting verified via CV)

| # | Page | Button / Control | Category | BEFORE Status | BEFORE Scroll / Hidden / CV% | AFTER Status | AFTER Scroll / Hidden / CV% |
|---|------|------------------|----------|---------------|------------------------------|--------------|-----------------------------|
| 1 | `sim` | Workbench View: 1. Combat Simulator & Visual Charts | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.3187% | **PASS** | ΔY=270px, hid=0/0, CV=24.32% |
| 2 | `sim` | Workbench View: Visual SVG Curves & 5-Channel Breakdown | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=506px, hid=0/0, CV=32.6777% |
| 3 | `sim` | Workbench View: 9-Tier Material & 10-Wave Endurance | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=919px, hid=0/0, CV=30.7454% |
| 4 | `sim` | Workbench View: 2. 5-Class L1–L60 Progression Matrix | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.6435% | **PASS** | ΔY=1610px, hid=0/0, CV=29.2909% |
| 5 | `sim` | Workbench View: 3. Tokuno Armaments & C# Server Hooks | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.6825% | **PASS** | ΔY=645px, hid=0/0, CV=34.8458% |
| 6 | `sim` | Workbench View: All Sections (Return to Top Overview) | `scroll-nav` | PASS | ΔY=-1400px, hid=0/0, CV=24.1997% | **PASS** | ΔY=-1400px, hid=0/0, CV=26.7876% |
| 7 | `sim` | Sim Filter: Mode B (<20 LOC C# Hook) | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.2467% | **PASS** | ΔY=0px, hid=0/0, CV=17.2654% (Brk=38.737%) |
| 8 | `sim` | Sim Filter: Mode A (100% Existing Engine) | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.2467% | **PASS** | ΔY=0px, hid=0/0, CV=4.1613% |
| 9 | `sim` | Sim Filter: Bracket L10 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0607% | **PASS** | ΔY=0px, hid=0/0, CV=5.4637% (Chart=9.3688%) |
| 10 | `sim` | Sim Filter: Bracket L25 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1215% | **PASS** | ΔY=0px, hid=0/0, CV=4.5373% (Chart=9.5923%) |
| 11 | `sim` | Sim Filter: Bracket L45 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1215% | **PASS** | ΔY=0px, hid=0/0, CV=4.2556% (Chart=9.4014%) |
| 12 | `sim` | Sim Filter: Bracket L60 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0607% | **PASS** | ΔY=0px, hid=0/0, CV=4.3992% (Chart=9.2102%) |
| 13 | `sim` | Sim Filter: Archetype high_def_boss | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1478% | **PASS** | ΔY=0px, hid=0/0, CV=4.7804% |
| 14 | `sim` | Sim Filter: Archetype fast_trash | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.2595% | **PASS** | ΔY=0px, hid=0/0, CV=5.234% |
| 15 | `sim` | Sim Filter: Archetype multi_target_pack | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.285% | **PASS** | ΔY=0px, hid=0/0, CV=5.6509% |
| 16 | `sim` | Sim Filter: Archetype low_def_boss | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.1733% | **PASS** | ΔY=0px, hid=0/0, CV=5.0896% |
| 17 | `sim` | Executive KPI Card: Samurai (SM) | `card-spotlight` | PASS | ΔY=0px, hid=0/0, CV=0.2486% | **PASS** | ΔY=0px, hid=0/0, CV=7.9914% |
| 18 | `sim` | Quick Dock Chip: [M] Mode A/B | `quick-dock` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=0px, hid=0/0, CV=3.6956% |
| 19 | `sim` | Header Summary Pill: 34 UO Item Sprites (Scroll to Armaments) | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=639px, hid=0/0, CV=37.9008% |
| 20 | `samurai` | Header Button: PT-BR Locale | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=5.1736% | **PASS** | ΔY=0px, hid=0/0, CV=5.1809% |
| 21 | `samurai` | Header Button: EN Locale | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=2.9942% | **PASS** | ΔY=0px, hid=0/0, CV=3.0173% |
| 22 | `samurai` | Header Button: Mode B (<20 LOC C#) | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=4.6074% | **PASS** | ΔY=0px, hid=0/0, CV=4.6176% |
| 23 | `samurai` | Header Button: Mode A (100% Engine) | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=4.6246% | **PASS** | ΔY=0px, hid=0/0, CV=4.5467% |
| 24 | `samurai` | [Arvore Cobra Node: L60 Capstone (Kensei) | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=7.2484% | **PASS** | ΔY=1002px, hid=0/0, CV=39.2144% |
| 25 | `samurai` | Filter Kind Button: passive | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/11, CV=19.2919% | **PASS** | ΔY=0px, hid=0/0, CV=15.3384% |
| 26 | `samurai` | Filter Kind Button: skill | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/7, CV=13.7128% | **PASS** | ΔY=0px, hid=0/0, CV=11.5046% |
| 27 | `samurai` | Filter Kind Button: spell | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/8, CV=7.2499% | **PASS** | ΔY=0px, hid=0/0, CV=7.2528% |
| 28 | `samurai` | Filter Kind Button: special | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/10, CV=13.5848% | **PASS** | ΔY=0px, hid=0/0, CV=9.4402% |
| 29 | `samurai` | Filter Kind Button: all | `card-spotlight` | PASS | ΔY=0px, hid=0/0, CV=17.6277% | **PASS** | ΔY=0px, hid=0/0, CV=14.1286% |
| 30 | `samurai` | Button: Toggle All Schema Drawers | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=11.0816% | **PASS** | ΔY=0px, hid=0/0, CV=8.9789% |
| 31 | `samurai` | Paperdoll Material Tier: Iron | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=6.8451% | **PASS** | ΔY=0px, hid=0/0, CV=6.8549% |
| 32 | `samurai` | Paperdoll Gear Slot: Imperial Kabuto Helm | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=1.0749% | **PASS** | ΔY=0px, hid=0/0, CV=1.0931% |
| 33 | `samurai` | Live Combat Ticker: Step +2.0s | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=0.5249% | **PASS** | ΔY=0px, hid=0/0, CV=0.4689% |
| 34 | `samurai` | Class Mastery Seal: Tier IV (L60) | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0315% | **PASS** | ΔY=881px, hid=0/0, CV=36.3713% |
| 35 | `ninja` | Dual L35 Unlock Banner: Shuriken & Fukiya Volley | `tree-interaction` | PASS | ΔY=681px, hid=0/0, CV=37.8519% | **PASS** | ΔY=681px, hid=0/0, CV=38.8332% |
| 36 | `ninja` | Ninja Filter Kind: Spells | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/9, CV=12.5169% | **PASS** | ΔY=0px, hid=0/0, CV=14.6911% |
| 37 | `ninja` | Ninja 5-Slot Hotbar: Slot 2 | `tree-interaction` | **FAIL** | ΔY=0px, hid=0/9, CV=3.0434% | **PASS** | ΔY=27px, hid=0/0, CV=24.9201% |
| 38 | `portal` | Portal Header Pill: 56 KB Pages (Scroll to Repo Guide) | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=347px, hid=0/0, CV=34.1631% |
