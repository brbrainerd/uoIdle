# Playwright + Computer Vision (CV) Button & Smooth-Scroll Audit Report

- **Before Baseline**: `16/38` passed (`22` failed — fatal JS `SyntaxError` on Simulator, `display: none` section/card hiding, non-reactive SVG brackets & breakdown bars)
- **After Overhaul**: `46/46` passed (`0` failed — `100%` pass rate, zero `display: none` hiding, smooth scroll + section/card spotlighting verified via CV)

| # | Page | Button / Control | Category | BEFORE Status | BEFORE Scroll / Hidden / CV% | AFTER Status | AFTER Scroll / Hidden / CV% |
|---|------|------------------|----------|---------------|------------------------------|--------------|-----------------------------|
| 1 | `sim` | Workbench View: 1. Combat Simulator & Visual Charts | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.3187% | **PASS** | ΔY=298px, hid=0/0, CV=34.3546% |
| 2 | `sim` | Workbench View: Visual SVG Curves & 5-Channel Breakdown | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=433px, hid=0/0, CV=37.4051% |
| 3 | `sim` | Workbench View: 9-Tier Material & 10-Wave Endurance | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=469px, hid=0/0, CV=39.4733% |
| 4 | `sim` | Workbench View: 2. 5-Class L1–L60 Progression Matrix | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.6435% | **PASS** | ΔY=386px, hid=0/0, CV=36.2518% |
| 5 | `sim` | Workbench View: 3. Tokuno Armaments & C# Server Hooks | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0.6825% | **PASS** | ΔY=474px, hid=0/0, CV=37.8618% |
| 6 | `sim` | Workbench View: All Sections (Return to Top Overview) | `scroll-nav` | PASS | ΔY=-1400px, hid=0/0, CV=24.1997% | **PASS** | ΔY=-1405px, hid=0/0, CV=30.9087% |
| 7 | `sim` | Sim Filter: Mode B (<20 LOC C# Hook) | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.2467% | **PASS** | ΔY=0px, hid=0/0, CV=16.5067% (Brk=31.3187%) |
| 8 | `sim` | Sim Filter: Mode A (100% Existing Engine) | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.2467% | **PASS** | ΔY=0px, hid=0/0, CV=2.6597% |
| 9 | `sim` | Sim Filter: Bracket L10 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0607% | **PASS** | ΔY=0px, hid=0/0, CV=3.5376% (Chart=7.0478%) |
| 10 | `sim` | Sim Filter: Bracket L25 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1215% | **PASS** | ΔY=0px, hid=0/0, CV=3.3181% (Chart=7.3467%) |
| 11 | `sim` | Sim Filter: Bracket L45 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1215% | **PASS** | ΔY=0px, hid=0/0, CV=3.1252% (Chart=7.3333%) |
| 12 | `sim` | Sim Filter: Bracket L60 | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0607% | **PASS** | ΔY=0px, hid=0/0, CV=2.8537% (Chart=6.6523%) |
| 13 | `sim` | Sim Filter: Archetype high_def_boss | `sim-filter` | **FAIL** | ΔY=0px, hid=0/0, CV=0.1478% | **PASS** | ΔY=0px, hid=0/0, CV=3.4591% |
| 14 | `sim` | Sim Filter: Archetype fast_trash | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.2595% | **PASS** | ΔY=0px, hid=0/0, CV=3.9778% |
| 15 | `sim` | Sim Filter: Archetype multi_target_pack | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.285% | **PASS** | ΔY=0px, hid=0/0, CV=4.1752% |
| 16 | `sim` | Sim Filter: Archetype low_def_boss | `sim-filter` | PASS | ΔY=0px, hid=0/0, CV=0.1733% | **PASS** | ΔY=0px, hid=0/0, CV=3.6468% |
| 17 | `sim` | Executive KPI Card: Samurai (SM) | `card-spotlight` | PASS | ΔY=0px, hid=0/0, CV=0.2486% | **PASS** | ΔY=0px, hid=0/0, CV=3.8826% |
| 18 | `sim` | Progression Chart Metric: Trash TTK Speed | `sim-filter` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=1.6458% |
| 19 | `sim` | Progression Chart Metric: Parity Envelope % | `sim-filter` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=1.8244% |
| 20 | `sim` | Progression Chart SVG Bracket Column: L25 | `sim-filter` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=3.1223% |
| 21 | `sim` | Quick Dock Chip: [M] Mode A/B | `quick-dock` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=0px, hid=0/0, CV=2.8618% |
| 22 | `sim` | Header Summary Pill: 34 UO Item Sprites (Scroll to Armaments) | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=470px, hid=0/0, CV=38.8287% |
| 23 | `samurai` | Header Button: PT-BR Locale | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=5.1736% | **PASS** | ΔY=0px, hid=0/0, CV=13.2853% |
| 24 | `samurai` | Header Button: EN Locale | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=2.9942% | **PASS** | ΔY=0px, hid=0/0, CV=1.7885% |
| 25 | `samurai` | Header Button: Mode B (<20 LOC C#) | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=4.6074% | **PASS** | ΔY=0px, hid=0/0, CV=3.7799% |
| 26 | `samurai` | Header Button: Mode A (100% Engine) | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=4.6246% | **PASS** | ΔY=0px, hid=0/0, CV=3.7799% |
| 27 | `samurai` | [Arvore Cobra Node: L60 Capstone (Kensei) | `tree-interaction` | **FAIL** | ΔY=0px, hid=0/0, CV=7.2484% | **PASS** | ΔY=0px, hid=0/0, CV=14.6787% |
| 28 | `samurai` | [Arvore Progression Tier: Grandmaster L40–L60 | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=14.6973% |
| 29 | `samurai` | [Arvore Progression Step: Next Milestone ▶ | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=2.3006% |
| 30 | `samurai` | [Arvore Progression Tier: All L1–L60 | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=11.7287% |
| 31 | `samurai` | Inspector Progressive Disclosure Tab: Drop-In JSON Schema | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=5.3509% |
| 32 | `samurai` | Inspector Progressive Disclosure Tab: Overview | `tree-interaction` | N/A | — | **PASS** | ΔY=0px, hid=0/0, CV=5.3509% |
| 33 | `samurai` | Filter Kind Button: passive | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/11, CV=19.2919% | **PASS** | ΔY=0px, hid=0/0, CV=4.6753% |
| 34 | `samurai` | Filter Kind Button: skill | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/7, CV=13.7128% | **PASS** | ΔY=0px, hid=0/0, CV=11.3813% |
| 35 | `samurai` | Filter Kind Button: spell | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/8, CV=7.2499% | **PASS** | ΔY=0px, hid=0/0, CV=8.2176% |
| 36 | `samurai` | Filter Kind Button: special | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/10, CV=13.5848% | **PASS** | ΔY=0px, hid=0/0, CV=11.6903% |
| 37 | `samurai` | Filter Kind Button: all | `card-spotlight` | PASS | ΔY=0px, hid=0/0, CV=17.6277% | **PASS** | ΔY=0px, hid=0/0, CV=13.9926% |
| 38 | `samurai` | Button: Toggle All Schema Drawers | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=11.0816% | **PASS** | ΔY=0px, hid=0/0, CV=8.2303% |
| 39 | `samurai` | Paperdoll Material Tier: Iron | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=6.8451% | **PASS** | ΔY=0px, hid=0/0, CV=5.5775% |
| 40 | `samurai` | Paperdoll Gear Slot: Imperial Kabuto Helm | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=1.0749% | **PASS** | ΔY=0px, hid=0/0, CV=1.3576% |
| 41 | `samurai` | Live Combat Ticker: Step +2.0s | `tree-interaction` | PASS | ΔY=0px, hid=0/0, CV=0.5249% | **PASS** | ΔY=0px, hid=0/0, CV=0.5199% |
| 42 | `samurai` | Class Mastery Seal: Tier IV (L60) | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/0, CV=0.0315% | **PASS** | ΔY=332px, hid=0/0, CV=22.9832% |
| 43 | `ninja` | Dual L35 Unlock Banner: Shuriken & Fukiya Volley | `tree-interaction` | PASS | ΔY=681px, hid=0/0, CV=37.8519% | **PASS** | ΔY=267px, hid=0/0, CV=23.8613% |
| 44 | `ninja` | Ninja Filter Kind: Spells | `card-spotlight` | **FAIL** | ΔY=0px, hid=0/9, CV=12.5169% | **PASS** | ΔY=0px, hid=0/0, CV=19.5269% |
| 45 | `ninja` | Ninja 5-Slot Hotbar: Slot 2 | `tree-interaction` | **FAIL** | ΔY=0px, hid=0/9, CV=3.0434% | **PASS** | ΔY=48px, hid=0/0, CV=20.7179% |
| 46 | `portal` | Portal Header Pill: 56 KB Pages (Scroll to Repo Guide) | `scroll-nav` | **FAIL** | ΔY=0px, hid=0/0, CV=0% | **PASS** | ΔY=410px, hid=0/0, CV=37.1013% |
