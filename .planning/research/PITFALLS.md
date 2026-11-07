# Pitfalls Research

**Domain:** Live Web Game Reverse-Engineering, Claim-Verified Knowledgebase (`kb.py`), & ModernUO-to-Idle Class Design (Ninja & Samurai)
**Researched:** 2026-11-06
**Confidence:** HIGH

## Critical Pitfalls

### Pitfall 1: Treating Stale Wiki or UI Tooltip Text as Ground-Truth Over the Live Client Bundle & Server State

**What goes wrong:**
Scraping the official UO Idle wiki or in-game UI descriptions and coding those numbers into the baseline comparison formulas for Warrior, Mage, and Ranger—only to discover later that the live JavaScript bundle (`https://uoidle.com/beta`) or server combat ticks use patched multipliers, hidden internal cooldowns, or different scaling curves.

**Why it happens:**
In active beta web games (`uoidle.com/beta`), developers frequently hotfix balance numbers in code or database tables without updating wiki pages or static tooltip locale strings. If the knowledgebase treats wiki text and live JS code as equal sources, Ninja and Samurai will be balanced against obsolete Warrior/Mage/Ranger math.

**How to avoid:**
1. Enforce a strict evidence hierarchy in the adapted `kb.py`:
   - `contradicted` < `unverified` < `wiki-stated` (or `help-stated`) < `bundle-stated` < `verified` (confirmed in live network/combat log payload).
2. Extract both the wiki/docs (`_raw/wiki/`) and the formatted live client bundle/state (`_raw/bundle/` and `_raw/network/`).
3. Whenever a wiki value and a client bundle formula disagree, tag the wiki claim `[contradicted]` and cite the bundle/network evidence entry.

**Warning signs:**
- Tooltip strings in the JS bundle are hard-coded string literals (`"Deals 150% damage"`) rather than template literals interpolating the actual skill config object (`skill.multiplier`).
- Observed combat log damage numbers in Chrome DevTools do not match the formula stated on the wiki.

**Phase to address:**
Phase 1 (Knowledgebase Tooling & Live Scraping) & Phase 2 (Core Mechanics & Existing Class Reverse-Engineering)

---

### Pitfall 2: Committing Minified Single-Line JS Bundles or Unredacted Session Payloads to `_raw/`

**What goes wrong:**
Two failure modes happen during raw extraction from Chrome DevTools:
1. Saving a minified production JS bundle (`index-[hash].js`) directly to `_raw/bundle/` where 50,000+ characters sit on Line 1. Every `kb.py` claim citing `(raw L1-L1)` becomes unreadable, un-diffable, and useless to the lead developer, or `CLAIM_LINE` regex (`r'^- \*\*C(\d+)\*\* \[([a-z-]+)\] "(.*)" ...'`) breaks on unescaped double quotes inside JSON/JS snippets.
2. Saving raw Chrome DevTools HAR dumps, `localStorage` snapshots, or WebSocket handshake frames into `_raw/` that contain live JWTs, session cookies, account emails, or player IDs, and pushing them to GitHub.

**Why it happens:**
`mudlet-dragonball-evolution/mechanics/` was built for 80-column plain-text MUD help files. Web game bundles are minified ASTs and JSON payloads, and authenticated browser inspection naturally mixes auth headers with game state payloads.

**How to avoid:**
1. **Deterministic Pretty-Printing Before `_raw/` Freeze:** Run a deterministic formatter (`prettier` or `js-beautify` with fixed config, and `jq -S .` for JSON) as part of the extraction script *before* writing to `_raw/bundle/`. Record the SHA-256 hash of the original minified asset in `_raw/manifest.json` so provenance is preserved while line numbers (`L<a>-L<b>`) remain narrow and human-readable.
2. **Automated Credential Sanitizer Gate:** Build a redaction check into the extraction tool and `kb.py check` that scans `_raw/` and `_evidence/` for `Bearer `, `eyJ` (JWT prefix), `cookie`, `session`, `token`, `password`, and `email` before any git stage/commit.
3. **Quote Normalization Rules in `kb.py`:** Adapt `kb.py` or raw formatting so JSON/JS double quotes inside verbatim quotes do not corrupt claim parsing or readability.

**Warning signs:**
- Any file in `_raw/` has lines exceeding 200 characters.
- `git diff` on `_raw/` shows multi-kilobyte single-line changes.
- Raw network captures include HTTP request headers or initial WebSocket `auth` frames.

**Phase to address:**
Phase 1 (Knowledgebase Tooling & Live Scraping)

---

### Pitfall 3: Misidentifying Client-Side Predictive/Display Logic as Authoritative Server Combat Math

**What goes wrong:**
Reverse-engineering a formula from the client JS bundle (e.g., a character sheet DPS estimator or UI preview calculator) and assuming it is the actual combat resolution engine, when actual hit/miss, crit, status proc, or mitigation math runs server-side and is only observable via WebSocket combat tick events.

**Why it happens:**
Web idle games often duplicate simplified formulas on the client to render "Estimated DPS" or tooltip previews, while the server runs the real tick loop (sometimes including armor penetration, level delta penalties, or proc rate caps omitted from the client UI helper).

**How to avoid:**
1. Audit the network layer (`Network` tab / WebSocket frames in Chrome DevTools) alongside the JS bundle during Phase 1–2.
2. Classify every combat mechanic in the KB as **Client-Evaluated**, **Shared-Config**, or **Server-Authoritative**.
3. For any server-authoritative mechanic where the formula is not in the client bundle, capture live combat event payloads in `_evidence/` and verify the math empirically across multiple stat points before locking in class balance numbers.

**Warning signs:**
- A function in the client bundle is only called inside React/UI render components (`CharacterSheet`, `SkillTooltip`) and never inside a combat loop or state reducer.
- Server WebSocket messages push final `damageDealt` / `hpRemaining` integers rather than letting the client compute combat outcomes.

**Phase to address:**
Phase 2 (Core Mechanics & Existing Class Reverse-Engineering)

---

### Pitfall 4: Literal Translation of Positional/Active ModernUO Skills That Violate Idle Engine Constraints

**What goes wrong:**
Designing Ninja (*Ninjitsu*) and Samurai (*Bushido*) skills that rely on mechanics Ultima Online has—2D tile distance, facing direction (`Backstab`), manual target switching (`Momentum Strike`), movement teleports (`Shadowjump`), or manual reactive timing (`Confidence` / `Evasion` cast right before a boss swing)—which do not exist in UO Idle's automated tick combat loop.

**Why it happens:**
Designers copy ModernUO wiki descriptions directly into the skill spec without first mapping the **state primitives** actually supported by UO Idle's combat engine (e.g., timers, buffs/debuffs, hit/evade/parry hooks, multi-hit counters, health thresholds, resource pools).

**How to avoid:**
1. Before designing a single Ninja or Samurai skill, compile a strict **Engine Capability Matrix** from live Warrior, Mage, and Ranger code structures in Phase 2 (listing every supported trigger, target type, buff/debuff property, and stat modifier).
2. Translate spatial/manual ModernUO mechanics into authentic **temporal/state-machine equivalents** using existing engine primitives:
   - *Positional Stealth (`Hiding` / `Shadowjump` / `Backstab`)* → **Stance/State Window** ("Shadow Stance" / "Concealed" state granted on cooldown or after an evade, empowering the next tick or skill with guaranteed crit / armor bypass).
   - *Movement Distance (`Ki Attack` / `Death Strike` movement steps)* → **Tick Delay / Combo Charge Counter** (triggers bonus damage after $N$ auto-attack ticks or when a delayed mark expires).
   - *Multi-Target Cleave (`Momentum Strike`)* → If UO Idle combat is strictly 1v1 per encounter, translate two-target transfer into **Overkill Carryover** (excess damage carries into the next spawn) or **Echo Strike** (strikes the target a second time for $X\%$ damage on the same tick); if multi-enemy waves exist, use the native AoE target primitive.

**Warning signs:**
- A proposed skill description uses words like "behind the target", "tiles away", "while moving", or "when manually activated before an enemy attack" without defining an automated trigger condition.
- The drop-in JSON schema requires adding brand-new top-level keys that do not exist in Warrior, Mage, or Ranger skill definitions (unless explicitly documented as a minimal, self-contained engine extension).

**Phase to address:**
Phase 3 (ModernUO Reference Mapping & Class Architecture)

---

### Pitfall 5: Class Homogenization ("Yellow Warrior" Samurai & "Green Ranger" Ninja)

**What goes wrong:**
Reducing every Bushido and Ninjitsu skill to generic `+% Damage for X seconds` or `Deal X% weapon damage` so it fits easily into existing JSON templates, resulting in Samurai feeling like a reskinned Warrior and Ninja feeling like a reskinned Ranger.

**Why it happens:**
Over-correcting for Pitfall 4 by stripping away all mechanical identity in order to reuse 100% identical skill templates.

**How to avoid:**
Define hard, non-overlapping mechanical pillars grounded in ModernUO's actual skill identity:
- **Samurai (*Bushido*) Niche — Reactive Mastery, Perfection Ramp, & Execution Sustainability:**
  - *Perfection*: Consecutive hits against the same target build a stacking damage bonus (rewards single-target sustain/accuracy, resets on miss or target switch—canonical ModernUO Bushido mechanic).
  - *Counter Attack / Evasion*: Parry/Evasion events actively trigger offensive ripostes or cooldown reductions, turning defense into offense (unlike Warrior's flat mitigation/HP tanking).
  - *Honorable Execution / Confidence*: On-kill and on-parry sustain loops that minimize downtime between mob kills in an idle grind.
- **Ninja (*Ninjitsu*) Niche — Stealth Setup/Payoff Cycles, Mirror Image Mitigation, & Delayed Burst:**
  - *Mirror Image*: Absorb/deflect discrete incoming single hits via clone charges rather than armor/HP soaking.
  - *Stealth / Surprise Attack / Backstab*: Alternating cyclical DPS profile (Setup window → Massive opening/ambush burst + armor shred → Follow-up ticks).
  - *Death Strike / Focus Attack*: Delayed venom/assassination detonation after $N$ ticks or hits, creating high-synergy burst windows with attack speed.

**Warning signs:**
- If you swap the skill names and icons between Ranger and Ninja, the combat rotation and stat priority (e.g., pure attack speed + flat crit) remain identical.
- Samurai and Warrior want the exact same gear affixes in every slot with no divergence in how Parry/Evasion/Speed scale their kits.

**Phase to address:**
Phase 3 (ModernUO Reference Mapping & Class Architecture) & Phase 4 (Skill Line Design & Numerical Balancing)

---

### Pitfall 6: Idle Numerical Balance Skew (Tick-Rate Quantization, Resource Starvation, & EHP Immortality)

**What goes wrong:**
Skills look balanced on paper in a single-hit spreadsheet calculation (`200% damage on a 10s CD = +20% DPS`), but break in a continuous 24/7 idle loop due to:
1. **Attack Speed / Cooldown Desync:** Skills that buff "the next attack" (`Focus Attack`, `Lightning Strike`) scale multiplicatively with fast weapon attack speed if cooldown-gated, or starve resources if triggered on every swing.
2. **Resource Starvation Over Long Sessions:** In ModernUO, *Lightning Strike* and *Focus Attack* are on-hit toggles that consume Mana/Stamina per swing. In an idle game running unattended for 8 hours, per-swing resource drain that exceeds passive regeneration causes the character to run dry after 90 seconds and spend the remaining 7 hours auto-attacking with zero skills.
3. **Avoidance/Clone Stacking Immortality:** Combining Ninja *Mirror Image* + high Evasion, or Samurai *Evasion* + *Confidence* heal-on-parry, can cross a critical threshold where incoming enemy DPS is lower than avoidance + heal-on-proc, allowing a player to idle bosses 30 levels higher than intended.
4. **Overkill Waste on Fast Clears:** Ninja's high front-loaded burst (`Backstab` / `Death Strike`) either one-shots trash mobs (wasting 60% of the damage as overkill) or leaves them at 5% HP while waiting on long cooldowns, making hourly XP/gold farm rates vastly worse than Mage/Ranger despite equal dummy DPS.

**Why it happens:**
Evaluating balance using static "target dummy DPS" instead of modeling **Time-to-Kill (TTK) across mob HP brackets**, **resource net-flow per minute**, and **effective HP (EHP) under continuous incoming attack rates**.

**How to avoid:**
1. Build a lightweight Python verification script during Phase 4 that plugs the exact reverse-engineered Warrior, Mage, and Ranger formulas alongside the proposed Ninja and Samurai definitions across **Early, Mid, and Late level brackets** (matched to class unlock tiers).
2. Measure four concrete metrics per bracket:
   - **Sustained Single-Target DPS** (boss fight, 60s+ window)
   - **Clear Speed / TTK Including Overkill** (trash farming loop, 3–10s mob life)
   - **Net Resource Delta per Minute** (must be sustainable or self-regulating in an unattended idle loop)
   - **Effective HP & Sustain per Second** (preventing un-killable avoidance/heal loops)

**Warning signs:**
- A skill's resource cost/sec at max attack speed exceeds base + passive regen without a cooldown or generator skill.
- Uncapped percentage evasion/parry stacks additively rather than multiplicatively or has no diminishing returns / internal cooldown on heal procs.
- Ninja's average damage per cycle is 90% concentrated in a single 15-second cooldown hit.

**Phase to address:**
Phase 4 (Skill Line Design & Numerical Balancing)

---

## Technical Debt Patterns

Shortcuts that seem reasonable early but create severe rework later.

| Shortcut | Immediate Benefit | Long-term Cost | When Acceptable |
|----------|-------------------|----------------|-----------------|
| Copying `mudlet-dragonball-evolution` `kb.py` without adapting categories & source parsers | Zero initial tooling work | Fails immediately on UO Idle categories (which don't have `races`/`transformations` and need `classes`/`items`/`combat`) and MUD `Help Keywords:` block parsers | **Never** — adapt `CATEGORIES`, `EVIDENCE_PREFIXES`, and raw extractors in Phase 1 |
| Putting raw numbers in `## Summary` sections of KB pages | Faster prose writing | `kb.py check` immediately fails with `summary-number` (`digit in Summary`); numbers become untethered from line-cited claims | **Never** — all numbers must live exclusively in `- **C<n>**` claim lines |
| Hardcoding minified variable names (`e.t.a * 1.25`) in KB notes without semantic mapping | Fast initial note-taking | Impossible to read or reference during Phase 4 balance modeling; breaks on next client build | **Never** — pair verbatim raw quotes with clear variable-mapping notes in `## Notes` |
| Designing Ninja/Samurai unlock levels before auditing all 3 existing classes | Lets class design start in parallel with scraping | High risk of structural mismatch if one existing class has an asymmetric passive/active tier unlock | **Never** — complete Phase 2 class structural audit first |
| Generating UI icons/mockups before finalizing skill names and slot counts | Early visual progress | Have to regenerate icons and re-layout mockups when a passive becomes an active or a skill is replaced | Only for throwaway style-exploration tests |

## Integration Gotchas

Common mistakes when inspecting `uoidle.com/beta`, adapting `kb.py`, and formatting drop-in deliverables.

| Integration | Common Mistake | Correct Approach |
|-------------|----------------|------------------|
| **Chrome DevTools MCP (`chrome-devtools`)** | Relying only on DOM text inspection (`innerText` of skill cards) | Inspect both the rendered DOM and the underlying JS module state / network bundles (`evaluate_script` / network responses) so hidden coefficients (proc chances, scaling ratios, internal CDs) are captured |
| **`kb.py` Claim Regex (`CLAIM_LINE`)** | Quoting raw JSON lines containing unescaped double quotes or multi-line formatting issues without testing `kb.py check` | Remember `CLAIM_LINE` uses greedy `"(.*)"` and `ws()` collapses whitespace; run `python3 mechanics/tools/kb.py check --root mechanics` after adding every batch of 3–5 pages |
| **`kb.py` Status Calculation (`check_status`)** | Setting frontmatter `status: "verified"` on a page that has three `verified` claims and one `help-stated` claim | `kb.py` enforces that a page's `status` equals its **weakest** claim (`contradicted < unverified < help-stated < verified`); always match frontmatter `status` to the minimum claim rank |
| **ModernUO Source Reference** | Mixing classic 2004 *Samurai Empire* publish formulas with current *ModernUO* C# implementation formulas | Cite specific ModernUO source files (`Scripts/Spells/Bushido/`, `Scripts/Spells/Ninjitsu/` or official ModernUO docs) in a dedicated reference section so the developer knows exact canonical provenance |
| **Drop-in Code/JSON Schema** | Inventing clean "ideal" JSON keys (`damageMultiplier`, `cooldownSeconds`) instead of UO Idle's exact property names (`dmgMult`, `cd`, etc.) | Extract the exact TypeScript/JS object shape from `_raw/bundle/` and validate that Ninja/Samurai skill objects pass a schema check against Warrior/Mage/Ranger objects |

## Performance Traps

Patterns that slow down agent execution, context usage, or verification loops in this project.

| Trap | Symptoms | Prevention | When It Breaks |
|------|----------|------------|----------------|
| Dumping an entire 2MB pretty-printed JS bundle into a single `_raw/bundle/app.js` file | Every `view_file` or agent inspection burns massive context windows; finding line numbers takes multiple tool calls | Split `_raw/bundle/` into logical domain slices (`_raw/bundle/skills-warrior.js`, `_raw/bundle/combat-math.js`, etc.) with a manifest mapping back to the master bundle | Immediately once bundle exceeds ~1,500 lines |
| Running unthrottled automated requests against `uoidle.com/beta` | Rate-limiting, session invalidation, or violating the strict read-only non-disruptive constraint | Extract the already-loaded client bundle and state directly from the active browser memory/cache via DevTools MCP rather than spamming HTTP requests | >10 rapid requests/sec |
| Waiting until the end of Phase 2 to run `kb.py build && kb.py check` | Dozens of cascading `link-broken`, `link-claim-missing`, `summary-number`, and `quote-line-mismatch` errors | Run `kb.py build && kb.py check` after every subsystem batch | >10 markdown pages authored without linting |

## Security & Privacy Mistakes

Project-specific security and privacy hazards.

| Mistake | Risk | Prevention |
|---------|------|------------|
| Committing `localStorage`, cookies, or WebSocket auth payloads from the logged-in `uoidle.com/beta` session into `_raw/` or `_evidence/` | Exposes the user's live beta account credentials in git history | Exclude auth keys during extraction; run a regex credential scanner in `kb.py check` that fails on JWTs (`eyJ...`), tokens, cookies, or emails |
| Creating or pushing to a public GitHub repository | Violates explicit project constraint (`Private GitHub repository brbrainerd/uoIdle`) and leaks unreleased UO Idle beta code | Verify `gh repo view brbrainerd/uoIdle --json isPrivate` returns `true` before pushing any `_raw/` extracts |
| Triggering mutating API calls (deleting characters, spending currency, resetting skills) while probing endpoints in DevTools | Corrupts the user's live beta character state | Restrict DevTools inspection to read-only memory/bundle reads, passive network listening, and non-destructive UI navigation |

## UX & Deliverable Pitfalls (Pitch & Developer Handoff)

Common mistakes when presenting class designs and UI mockups to a game's lead developer.

| Pitfall | Developer / User Impact | Better Approach |
|---------|-------------------------|-----------------|
| **Mockups that ignore UO Idle's actual CSS/UI density** | Looks like generic AI fantasy art rather than a believable feature inside `uoidle.com/beta` | Capture screenshots and exact CSS variables (colors, borders, typography, icon dimensions, slot grid layout) from the live beta UI first, then composite the generated Ninja/Samurai icons into faithful UI mockups |
| **Iconography with inconsistent art style or unreadable 32x32/48x48 silhouettes** | Icons look muddy or clash with existing Warrior/Mage/Ranger skill icons when scaled down to actual in-game button sizes | Audit existing UO Idle skill icon style (palette, border treatment, illustration vs glyph style) and test generated Ninja/Samurai icons at actual in-game pixel dimensions |
| **Opaque balance claims ("This skill is balanced")** | Lead developer has to redo all the math from scratch and distrusts the numbers | Include side-by-side comparative tables showing Warrior, Mage, Ranger, Ninja, and Samurai DPS/EHP/Resource curves across unlock tiers with formulas cited to KB claims (`[[skills-warrior]] C3`) |

## "Looks Done But Isn't" Checklist

Things that appear complete at first glance but fail rigorous audit.

- [ ] **`kb.py` Adaptation:** Often only updates `CATEGORIES` — verify `python3 mechanics/tools/kb.py --self-test` and `kb.py check --root mechanics` pass with zero errors on UO Idle categories and evidence prefixes.
- [ ] **Existing Class Coverage:** Often captures active skill damage numbers but misses **passive skills, base class stat growth per level, or weapon speed/stat scaling** — verify all three classes (Warrior, Mage, Ranger) have 100% of their actives, passives, and stat scalings cited in `mechanics/`.
- [ ] **Structural Parity:** Often matches total skill count but misses **exact unlock levels or resource cost progressions** — verify Ninja and Samurai unlock at the exact same level tiers and active/passive ratios as Warrior, Mage, and Ranger.
- [ ] **Drop-in JSON/Code Definitions:** Often written as pseudo-code — verify every field name, data type, enum string, and nesting level matches the live `_raw/bundle/` skill schema 1:1.
- [ ] **GitHub Privacy & Clean History:** Often checked once at init — verify `git log -p` contains zero auth tokens/cookies and remote repo is private.

## Recovery Strategies

When pitfalls occur despite prevention, how to recover cleanly.

| Pitfall | Recovery Cost | Recovery Steps |
|---------|---------------|----------------|
| **Auth token or cookie committed to `_raw/`** | MEDIUM | Immediately scrub git history (`git filter-repo` or `git reset` if unpushed), rotate/re-login session if ever pushed, and add the offending pattern to `kb.py` credential check |
| **Raw bundle file re-formatted after claims were written (`quote-line-mismatch`)** | MEDIUM | Use a deterministic script to relocate verbatim quote substrings in the newly formatted `_raw/` file and update `(raw L<a>-L<b>)` spans automatically, then run `kb.py check` |
| **Designed skill requires an unsupported engine hook** | LOW–MEDIUM | Re-map the skill's trigger to the closest verified primitive in the Phase 2 Engine Capability Matrix (e.g., convert "on enemy miss" to "on player evade" or a periodic stance buff) and re-run the Phase 4 balance script |
| **Balance simulation shows Samurai/Ninja out-scaling existing classes in late game** | LOW | Adjust scaling coefficients (separating base flat damage from stat/level multipliers) in the centralized balance script, re-export the JSON definitions, and update the spec tables |

## Pitfall-to-Phase Mapping

How roadmap phases should address and verify each pitfall.

| Pitfall | Prevention Phase | Verification |
|---------|------------------|--------------|
| **Pitfall 1: Stale Wiki vs Live Bundle Discrepancies** | Phase 1 & Phase 2 | Every mechanic page cites `_raw/bundle/` or `_evidence/`; discrepancies with `_raw/wiki/` are explicitly tagged |
| **Pitfall 2: Minified Single-Line JS & Credential Leaks in `_raw/`** | Phase 1 (KB Tooling & Extraction) | All `_raw/` files are deterministically formatted with readable line spans; credential scan passes with 0 matches; `kb.py check` returns `"ok": true` |
| **Pitfall 3: Client Display Logic vs Server Combat Math** | Phase 2 (Reverse-Engineering KB) | Combat formulas are cross-checked against live WebSocket/combat log payloads in `_evidence/` |
| **Pitfall 4: Unimplementable Positional/Manual UO Mechanics** | Phase 3 (ModernUO Mapping & Architecture) | Every Ninja and Samurai skill maps 100% of its triggers and effects to documented primitives in the UO Idle Engine Capability Matrix |
| **Pitfall 5: Class Homogenization ("Yellow Warrior" / "Green Ranger")** | Phase 3 & Phase 4 | Samurai (Perfection/Reactive Parry/Execution) and Ninja (Stealth Cycles/Mirror Image/Delayed Detonation) have distinct combat state loops and stat affinities |
| **Pitfall 6: Idle Numerical Balance Skew (Speed, Resources, EHP, Overkill)** | Phase 4 (Skill Line Design & Balance) | Quantitative parity model confirms DPS, TTK (with overkill), resource sustainability, and EHP stay within target bands of Warrior, Mage, and Ranger across Early/Mid/Late brackets |
| **Deliverable & UI Mockup Mismatches** | Phase 5 (Code/JSON Specs & Visual Mockups) | JSON definitions validate against live bundle schema; UI mockups and icons match live `uoidle.com/beta` layout and resolution |

## Sources

- `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/CONTRIBUTING.md` — Claim-verified KB workflow, evidence hierarchy (`contradicted < unverified < help-stated < verified`), and raw excerpt rules.
- `/Users/brbrainerd/dev/mudlet-dragonball-evolution/mechanics/tools/kb.py` — Exact static analysis checks (`fm-*`, `claim-malformed`, `quote-not-in-raw`, `quote-line-mismatch`, `status-mismatch`, `summary-number`, `link-claim-missing`).
- `/Users/brbrainerd/dev/uoIdle/.planning/PROJECT.md` — Project constraints, live `https://uoidle.com/beta` DevTools inspection scope, and ModernUO Bushido/Ninjitsu design goals.
- ModernUO canonical *Bushido* & *Ninjitsu* skill mechanics (Honorable Execution, Confidence, Evasion, Counter Attack, Lightning Strike, Momentum Strike, Perfection; Focus Attack, Death Strike, Animal Form, Ki Attack, Surprise Attack, Backstab, Shadowjump, Mirror Image).

---
*Pitfalls research for: UO Idle Mechanics Knowledgebase & Ninja/Samurai Class Design*
*Researched: 2026-11-06*
