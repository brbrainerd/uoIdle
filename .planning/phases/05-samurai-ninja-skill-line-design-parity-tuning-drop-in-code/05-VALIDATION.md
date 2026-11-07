---
phase: 5
slug: samurai-ninja-skill-line-design-parity-tuning-drop-in-code
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-11-06
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | TypeScript CLI Verification (`npx tsx tools/validate_skills.ts`, `npx tsx tools/sim_balance.ts`) + Node Syntax Check + KB CLI (`mechanics/tools/kb.py`) |
| **Config file** | `package.json` / `tsconfig.json` |
| **Quick run command** | `npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify` |
| **Full suite command** | `npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify && node --check design/drop-in/classes-patch.js && python3 mechanics/tools/kb.py check --root mechanics` |
| **Estimated runtime** | ~2 seconds |

---

## Sampling Rate

- **After every task commit:** Run task-specific schema/simulation verification (`npx tsx tools/validate_skills.ts <file>` or `npx tsx tools/sim_balance.ts --verify`)
- **After every plan wave:** Run `npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify && python3 mechanics/tools/kb.py check --root mechanics`
- **Before `/gsd-verify-work`:** Full suite must be green (`exit 0`)
- **Max feedback latency:** 2 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | `CLASS-01`, `CLASS-03`, `CLASS-04` | V5 (Schema Validation) | `design/drop-in/samurai.json` passes `ClassSchema` and cross-field progression invariants | schema + structural | `npx tsx tools/validate_skills.ts design/drop-in/samurai.json` | ✅ `tools/validate_skills.ts` | ⬜ pending |
| 05-01-02 | 01 | 1 | `CLASS-01`, `CLASS-03` | — | `design/SAMURAI_SPEC.md` documents all 12 L1–60 milestones, 6 Bushido abilities (`400–405`), Honor/Perfection, Katana/No-Dachi synergies, and Mode A/Mode B specs | content + structure | `node -e "const fs=require('fs'); const s=fs.readFileSync('design/SAMURAI_SPEC.md','utf8'); for(const k of ['HonorableExecution','Confidence','Evasion','CounterAttack','LightningStrike','MomentumStrike','Mode A','Mode B','samurai_way','samurai_honorable_r2']) if(!s.includes(k)) throw new Error('Missing '+k);"` | ❌ W0 | ⬜ pending |
| 05-02-01 | 02 | 1 | `CLASS-02`, `CLASS-03`, `CLASS-04` | V5 (Schema Validation) | `design/drop-in/ninja.json` and `design/drop-in/items-bushido-ninjitsu.json` pass `ClassSchema` and item structure checks | schema + structural | `npx tsx tools/validate_skills.ts design/drop-in/ninja.json && node -e "const d=JSON.parse(require('fs').readFileSync('design/drop-in/items-bushido-ninjitsu.json','utf8')); if(d.weapons.length!==8||d.consumables.length!==4) throw new Error('Invalid item counts');"` | ✅ `tools/validate_skills.ts` | ⬜ pending |
| 05-02-02 | 02 | 1 | `CLASS-02`, `CLASS-03` | — | `design/NINJA_SPEC.md` documents all 12 L1–60 progression milestones, 8 Ninjitsu abilities (`500–507`), Smoke Bomb/Shuriken/Fukiya items, Kryss/Tekagi synergies, and Mode A/Mode B specs | content + structure | `node -e "const fs=require('fs'); const s=fs.readFileSync('design/NINJA_SPEC.md','utf8'); for(const k of ['FocusAttack','DeathStrike','AnimalForm','KiAttack','SurpriseAttack','Backstab','Shadowjump','MirrorImage','SmokeBomb','Shuriken','Fukiya','Mode A','Mode B']) if(!s.includes(k)) throw new Error('Missing '+k);"` | ❌ W0 | ⬜ pending |
| 05-03-01 | 03 | 2 | `SIM-03`, `CLASS-03`, `CLASS-04` | V5 (Schema & Parity Gate) | `tools/validate_skills.ts --verify` and `tools/sim_balance.ts --verify` validate all 5 classes (`warrior`, `mage`, `ranger`, `samurai`, `ninja`) and assert $\pm 5\text{–}8\%$ parity across `L10, L25, L45, L60` in Mode A and Mode B | deterministic sim + schema | `npx tsx tools/validate_skills.ts --verify && npx tsx tools/sim_balance.ts --verify` | ✅ `tools/sim_balance.ts` | ⬜ pending |
| 05-03-02 | 03 | 2 | `SIM-03`, `CLASS-04` | — | `design/drop-in/classes-patch.js` passes syntax & export check and `design/BALANCE_REPORT.md` documents all 4 brackets (`L10, L25, L45, L60`), 3 archetypes, and Mode A/Mode B parity tables | syntax + report check | `node --check design/drop-in/classes-patch.js && node -e "const fs=require('fs'); const r=fs.readFileSync('design/BALANCE_REPORT.md','utf8'); for(const k of ['L10','L25','L45','L60','low_def_boss','high_def_boss','fast_trash','mode_a','mode_b','samurai','ninja']) if(!r.includes(k)) throw new Error('Missing '+k);"` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

Existing infrastructure (`tools/validate_skills.ts`, `tools/sim_balance.ts`, `src/schemas/skill.schema.ts`, `src/sim/engine.ts`, `mechanics/tools/kb.py`) covers all Phase 5 verification needs without installing new test packages.

---

## Manual-Only Verifications

*All phase behaviors have automated verification.*

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 2s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** ready
