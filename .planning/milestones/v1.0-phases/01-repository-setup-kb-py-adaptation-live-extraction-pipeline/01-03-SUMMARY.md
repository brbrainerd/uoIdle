---
phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline
plan: 03
subsystem: infra
tags: [python, modernuo, bushido, ninjitsu, tokuno, manifest, provenance]

requires:
  - phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline
    provides: "tools/bundle_extract.mjs 20-entry manifest.json and mechanics/tools/kb.py validator"
provides:
  - "tools/fetch_modernuo.py deterministic ModernUO C# fetcher, manifest updater, and --verify checker (pinned to commit b0e6b17c5cba3a6944ca25a9676dcdec0022ac38)"
  - "9 canonical Bushido spell/move C# files under mechanics/_raw/modernuo/"
  - "23 canonical Ninjitsu spell/move, test, skill item, and armor C# files under mechanics/_raw/modernuo/"
  - "3 core combat, Honor/Perfection (HonorContext.cs), and weapon/spell parry (BaseWeapon.cs, SpecialMove.cs) C# files under mechanics/_raw/modernuo/"
  - "13 canonical Tokuno (Samurai Empire) weapon C# files under mechanics/_raw/modernuo/"
  - "Complete 68-entry SHA-256 and line-count provenance registry in mechanics/_raw/manifest.json verified by kb.py check"
affects:
  - phase-2
  - phase-3
  - phase-4
  - phase-5
  - phase-6

actuals:
  tokens: 8000
  tasks: 2
  commits: 2

tech-stack:
  added: []
  patterns:
    - "Zero-dependency Python 3 stdlib fetcher (urllib.request + gh api fallback) pinned to immutable commit SHA b0e6b17c5cba3a6944ca25a9676dcdec0022ac38"
    - "Local gitignored caching in mechanics/_crawl/modernuo/ for instant offline re-runs"
    - "Atomic merge of 48 modernuo/* entries with existing bundle/*, wiki/*, and api/* entries in mechanics/_raw/manifest.json"

key-files:
  created:
    - tools/fetch_modernuo.py
    - mechanics/_raw/modernuo/Confidence.cs
    - mechanics/_raw/modernuo/CounterAttack.cs
    - mechanics/_raw/modernuo/Evasion.cs
    - mechanics/_raw/modernuo/HonorableExecution.cs
    - mechanics/_raw/modernuo/LightningStrike.cs
    - mechanics/_raw/modernuo/MomentumStrike.cs
    - mechanics/_raw/modernuo/SamuraiMove.cs
    - mechanics/_raw/modernuo/SamuraiSpell.cs
    - mechanics/_raw/modernuo/BookOfBushido.cs
    - mechanics/_raw/modernuo/AnimalForm.cs
    - mechanics/_raw/modernuo/Backstab.cs
    - mechanics/_raw/modernuo/DeathStrike.cs
    - mechanics/_raw/modernuo/FocusAttack.cs
    - mechanics/_raw/modernuo/KiAttack.cs
    - mechanics/_raw/modernuo/MirrorImage.cs
    - mechanics/_raw/modernuo/NinjaMove.cs
    - mechanics/_raw/modernuo/NinjaSpell.cs
    - mechanics/_raw/modernuo/ShadowJump.cs
    - mechanics/_raw/modernuo/SurpriseAttack.cs
    - mechanics/_raw/modernuo/BookOfNinjitsu.cs
    - mechanics/_raw/modernuo/AnimalFormTests.cs
    - mechanics/_raw/modernuo/EggBomb.cs
    - mechanics/_raw/modernuo/Fukiya.cs
    - mechanics/_raw/modernuo/FukiyaDarts.cs
    - mechanics/_raw/modernuo/LeatherNinjaBelt.cs
    - mechanics/_raw/modernuo/NinjaWeapons.cs
    - mechanics/_raw/modernuo/Shuriken.cs
    - mechanics/_raw/modernuo/SmokeBomb.cs
    - mechanics/_raw/modernuo/LeatherNinjaHood.cs
    - mechanics/_raw/modernuo/LeatherNinjaJacket.cs
    - mechanics/_raw/modernuo/LeatherNinjaMitts.cs
    - mechanics/_raw/modernuo/LeatherNinjaPants.cs
    - mechanics/_raw/modernuo/HonorContext.cs
    - mechanics/_raw/modernuo/BaseWeapon.cs
    - mechanics/_raw/modernuo/SpecialMove.cs
    - mechanics/_raw/modernuo/Katana.cs
    - mechanics/_raw/modernuo/Bokuto.cs
    - mechanics/_raw/modernuo/Daisho.cs
    - mechanics/_raw/modernuo/Kama.cs
    - mechanics/_raw/modernuo/Lajatang.cs
    - mechanics/_raw/modernuo/NoDachi.cs
    - mechanics/_raw/modernuo/Nunchaku.cs
    - mechanics/_raw/modernuo/Sai.cs
    - mechanics/_raw/modernuo/Tekagi.cs
    - mechanics/_raw/modernuo/Tessen.cs
    - mechanics/_raw/modernuo/Tetsubo.cs
    - mechanics/_raw/modernuo/Wakizashi.cs
    - mechanics/_raw/modernuo/Yumi.cs
  modified:
    - mechanics/_raw/manifest.json

key-decisions:
  - "Pinned all 48 ModernUO C# fetches to immutable commit SHA b0e6b17c5cba3a6944ca25a9676dcdec0022ac38 with URL-encoded paths and gh api fallback"
  - "Restricted output filenames via os.path.basename containment checks inside mechanics/_raw/modernuo/ to mitigate path traversal (T-01-07)"
  - "Merged all 48 modernuo/* entries into mechanics/_raw/manifest.json alongside the 20 bundle/wiki/api entries for unified 68-file verification under kb.py check"

patterns-established:
  - "Dual-extractor provenance manifest: tools/bundle_extract.mjs (20 entries) + tools/fetch_modernuo.py (48 entries) = 68 verified raw sources in mechanics/_raw/manifest.json"

requirements-completed:
  - KB-04

coverage:
  - id: D1
    description: "tools/fetch_modernuo.py extracts core Bushido, Ninjitsu, Perfection (HonorContext.cs), and Parry (BaseWeapon.cs, SpecialMove.cs) C# files into mechanics/_raw/modernuo/"
    requirement: KB-04
    verification:
      - kind: integration
        ref: "python3 tools/fetch_modernuo.py && test -f mechanics/_raw/modernuo/HonorContext.cs && test -f mechanics/_raw/modernuo/BaseWeapon.cs && test -f mechanics/_raw/modernuo/DeathStrike.cs && test -f mechanics/_raw/modernuo/LightningStrike.cs"
        status: pass
    human_judgment: false
  - id: D2
    description: "All 48 ModernUO C# files (including Ninjitsu skill items/armor and Tokuno SE weapons) archived and verified via fetch_modernuo.py --verify, bundle_extract.mjs --verify, and kb.py check across all 68 manifest entries"
    requirement: KB-04
    verification:
      - kind: integration
        ref: "python3 tools/fetch_modernuo.py --verify && node tools/bundle_extract.mjs --verify && python3 mechanics/tools/kb.py --self-test && python3 mechanics/tools/kb.py build --root mechanics && python3 mechanics/tools/kb.py check --root mechanics"
        status: pass
    human_judgment: false

duration: 4min
completed: 2026-11-06
status: complete
---

# Phase 1 Plan 03: ModernUO Bushido, Ninjitsu & Tokuno C# Source Archival Summary

**Deterministic Python 3 stdlib fetcher (`tools/fetch_modernuo.py`) archiving all 48 canonical ModernUO Bushido, Ninjitsu, Perfection (`HonorContext.cs`), Parry (`BaseWeapon.cs`), and Tokuno weapon C# files at commit `b0e6b17c5cba3a6944ca25a9676dcdec0022ac38` and completing the 68-entry `mechanics/_raw/manifest.json` verification pipeline (`KB-04`)**

## Performance

- **Duration:** 4 min
- **Started:** 2026-11-07T03:41:30Z
- **Completed:** 2026-11-07T03:45:00Z
- **Tasks:** 2
- **Files modified:** 50

## Accomplishments

- Created `tools/fetch_modernuo.py` (Python 3 stdlib only, using `urllib.request` with `gh api` fallback and `mechanics/_crawl/modernuo/` caching) pinned to `modernuo/ModernUO` commit `b0e6b17c5cba3a6944ca25a9676dcdec0022ac38`.
- Extracted all 9 Bushido spell and special move C# files (`Confidence.cs`, `CounterAttack.cs`, `Evasion.cs`, `HonorableExecution.cs`, `LightningStrike.cs`, `MomentumStrike.cs`, `SamuraiMove.cs`, `SamuraiSpell.cs`, `BookOfBushido.cs`).
- Extracted all 12 Ninjitsu spell, special move, and test C# files (`AnimalForm.cs`, `Backstab.cs`, `DeathStrike.cs`, `FocusAttack.cs`, `KiAttack.cs`, `MirrorImage.cs`, `NinjaMove.cs`, `NinjaSpell.cs`, `ShadowJump.cs`, `SurpriseAttack.cs`, `BookOfNinjitsu.cs`, `AnimalFormTests.cs`) plus 11 Ninjitsu skill items and armor (`EggBomb.cs`, `Fukiya.cs`, `FukiyaDarts.cs`, `LeatherNinjaBelt.cs`, `NinjaWeapons.cs`, `Shuriken.cs`, `SmokeBomb.cs`, `LeatherNinjaHood.cs`, `LeatherNinjaJacket.cs`, `LeatherNinjaMitts.cs`, `LeatherNinjaPants.cs`).
- Extracted the 3 core combat, Perfection, and Parry C# files (`HonorContext.cs`, `BaseWeapon.cs`, `SpecialMove.cs`) and all 13 Tokuno (Samurai Empire) weapon C# files (`Katana.cs`, `Bokuto.cs`, `Daisho.cs`, `Kama.cs`, `Lajatang.cs`, `NoDachi.cs`, `Nunchaku.cs`, `Sai.cs`, `Tekagi.cs`, `Tessen.cs`, `Tetsubo.cs`, `Wakizashi.cs`, `Yumi.cs`).
- Implemented `--verify` mode in `tools/fetch_modernuo.py` (`{"ok": true, "verified": 48}`) and verified the complete 68-entry `mechanics/_raw/manifest.json` via `kb.py --self-test`, `kb.py build --root mechanics`, and `kb.py check --root mechanics`.

## Task Commits

Each task was committed atomically:

1. **Task 1: Create tools/fetch_modernuo.py and extract core Bushido, Ninjitsu, Perfection (HonorContext.cs), and Parry (BaseWeapon.cs, SpecialMove.cs) C# files** - `d5a65ac` (feat)
2. **Task 2: Extract Ninjitsu skill items/armor (SmokeBomb.cs, Fukiya.cs, Shuriken.cs, etc.) and Tokuno SE weapon C# files (48 total), add --verify mode, and run full Phase 1 kb.py check** - `eae2364` (feat)

## Files Created/Modified

- `tools/fetch_modernuo.py` - Deterministic ModernUO C# fetcher, manifest updater, and `--verify` validator
- `mechanics/_raw/modernuo/*.cs` - 48 verbatim ModernUO C# files covering Bushido, Ninjitsu, Perfection (`HonorContext.cs`), Parry (`BaseWeapon.cs`, `SpecialMove.cs`), Ninjitsu skill items/armor, and Tokuno weapons
- `mechanics/_raw/manifest.json` - Finalized 68-entry SHA-256 and line-count provenance manifest (`20` live UO Idle bundle/wiki/api files + `48` ModernUO C# files)

## Decisions Made

- Used `urllib.parse.quote(repo_path, safe="/")` so upstream ModernUO directory paths containing spaces (`Items/Skill Items/...`, `Items/Weapons/SE Weapons/...`) resolve deterministically over both HTTPS raw URLs and `gh api`.
- Cached downloaded `.cs` files in gitignored `mechanics/_crawl/modernuo/` so re-running `python3 tools/fetch_modernuo.py` is instantaneous and offline-capable unless `--force` is passed.
- Enforced `safe_cs_filename()` path containment checks so destination files are strictly flat `.cs` basenames inside `mechanics/_raw/modernuo/`.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Phase 1 is 100% complete (`KB-01`, `KB-02`, `KB-03`, `KB-04` all verified).
- All 68 raw files in `mechanics/_raw/{bundle,wiki,api,modernuo}/` and `mechanics/_evidence/live-bundle-probe.txt` are locked in `mechanics/_raw/manifest.json` and ready for Phase 2 (`Core Engine, Progression & Combat Formulae Knowledgebase`).

## Self-Check: PASSED

- Verified all 48 `.cs` files exist under `mechanics/_raw/modernuo/`, `tools/fetch_modernuo.py` exists, and `mechanics/_raw/manifest.json` contains 68 entries.
- Verified task commits `d5a65ac` and `eae2364` in `git log`.
- Verified `python3 tools/fetch_modernuo.py --verify` (`{"ok": true, "verified": 48}`), `node tools/bundle_extract.mjs --verify` (`{"ok":true,"verified":20}`), `python3 mechanics/tools/kb.py --self-test` (`{"ok": true, "mutations": 28}`), `python3 mechanics/tools/kb.py build --root mechanics`, and `python3 mechanics/tools/kb.py check --root mechanics` (`{"ok": true, "pages": 0, "errors": []}`).

---
*Phase: 01-repository-setup-kb-py-adaptation-live-extraction-pipeline*
*Completed: 2026-11-06*
