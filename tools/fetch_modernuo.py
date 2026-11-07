#!/usr/bin/env python3
"""Deterministic ModernUO C# source file fetcher, manifest updater, and verifier.

Fetches all 48 canonical Bushido, Ninjitsu, Perfection (HonorContext.cs), Parry
(BaseWeapon.cs, SpecialMove.cs), Ninjitsu skill items/armor, and Tokuno (Samurai
Empire) weapon C# source files from modernuo/ModernUO pinned to commit
b0e6b17c5cba3a6944ca25a9676dcdec0022ac38 into mechanics/_raw/modernuo/ and
merges their SHA-256 and line-count provenance entries into
mechanics/_raw/manifest.json.

Usage:
  python3 tools/fetch_modernuo.py           # Fetch/extract all 48 .cs files + update manifest.json
  python3 tools/fetch_modernuo.py --force   # Re-fetch from GitHub ignoring local _crawl/ cache
  python3 tools/fetch_modernuo.py --verify  # Verify all 48 .cs files against manifest.json

Stdlib only (urllib.request, urllib.parse, hashlib, json, os, pathlib, subprocess).
"""
from __future__ import annotations

import argparse
from concurrent.futures import ThreadPoolExecutor, as_completed
from datetime import datetime, timezone
import hashlib
import json
import os
from pathlib import Path
import subprocess
import sys
from typing import Any, Dict, List, Tuple
import urllib.error
import urllib.parse
import urllib.request

MODERNUO_REPO = "modernuo/ModernUO"
MODERNUO_COMMIT = "b0e6b17c5cba3a6944ca25a9676dcdec0022ac38"

ROOT_DIR = Path(__file__).resolve().parent.parent
RAW_DIR = ROOT_DIR / "mechanics" / "_raw"
MODERNUO_OUT_DIR = RAW_DIR / "modernuo"
MANIFEST_PATH = RAW_DIR / "manifest.json"
CRAWL_MODERNUO_DIR = ROOT_DIR / "mechanics" / "_crawl" / "modernuo"

# (dest_filename, upstream_repo_path, category) — 48 canonical ModernUO C# files
MODERNUO_FILES: Tuple[Tuple[str, str, str], ...] = (
    # Group 1 — Bushido Spells & Special Moves (9 files, category "modernuo-bushido")
    ("Confidence.cs", "Projects/UOContent/Spells/Bushido/Confidence.cs", "modernuo-bushido"),
    ("CounterAttack.cs", "Projects/UOContent/Spells/Bushido/CounterAttack.cs", "modernuo-bushido"),
    ("Evasion.cs", "Projects/UOContent/Spells/Bushido/Evasion.cs", "modernuo-bushido"),
    ("HonorableExecution.cs", "Projects/UOContent/Spells/Bushido/HonorableExecution.cs", "modernuo-bushido"),
    ("LightningStrike.cs", "Projects/UOContent/Spells/Bushido/LightningStrike.cs", "modernuo-bushido"),
    ("MomentumStrike.cs", "Projects/UOContent/Spells/Bushido/MomentumStrike.cs", "modernuo-bushido"),
    ("SamuraiMove.cs", "Projects/UOContent/Spells/Bushido/SamuraiMove.cs", "modernuo-bushido"),
    ("SamuraiSpell.cs", "Projects/UOContent/Spells/Bushido/SamuraiSpell.cs", "modernuo-bushido"),
    ("BookOfBushido.cs", "Projects/UOContent/Items/Skill Items/Magical/BookOfBushido.cs", "modernuo-bushido"),
    # Group 2 — Ninjitsu Spells, Special Moves & Tests (12 files, category "modernuo-ninjitsu")
    ("AnimalForm.cs", "Projects/UOContent/Spells/Ninjitsu/AnimalForm.cs", "modernuo-ninjitsu"),
    ("Backstab.cs", "Projects/UOContent/Spells/Ninjitsu/Backstab.cs", "modernuo-ninjitsu"),
    ("DeathStrike.cs", "Projects/UOContent/Spells/Ninjitsu/DeathStrike.cs", "modernuo-ninjitsu"),
    ("FocusAttack.cs", "Projects/UOContent/Spells/Ninjitsu/FocusAttack.cs", "modernuo-ninjitsu"),
    ("KiAttack.cs", "Projects/UOContent/Spells/Ninjitsu/KiAttack.cs", "modernuo-ninjitsu"),
    ("MirrorImage.cs", "Projects/UOContent/Spells/Ninjitsu/MirrorImage.cs", "modernuo-ninjitsu"),
    ("NinjaMove.cs", "Projects/UOContent/Spells/Ninjitsu/NinjaMove.cs", "modernuo-ninjitsu"),
    ("NinjaSpell.cs", "Projects/UOContent/Spells/Ninjitsu/NinjaSpell.cs", "modernuo-ninjitsu"),
    ("ShadowJump.cs", "Projects/UOContent/Spells/Ninjitsu/ShadowJump.cs", "modernuo-ninjitsu"),
    ("SurpriseAttack.cs", "Projects/UOContent/Spells/Ninjitsu/SurpriseAttack.cs", "modernuo-ninjitsu"),
    ("BookOfNinjitsu.cs", "Projects/UOContent/Items/Skill Items/Magical/BookOfNinjitsu.cs", "modernuo-ninjitsu"),
    ("AnimalFormTests.cs", "Projects/UOContent.Tests/Tests/Spells/Ninjitsu/AnimalFormTests.cs", "modernuo-ninjitsu"),
    # Group 3 — Ninjitsu Skill Items & Armor (11 files, category "modernuo-ninjitsu")
    ("EggBomb.cs", "Projects/UOContent/Items/Skill Items/Ninjitsu/EggBomb.cs", "modernuo-ninjitsu"),
    ("Fukiya.cs", "Projects/UOContent/Items/Skill Items/Ninjitsu/Fukiya.cs", "modernuo-ninjitsu"),
    ("FukiyaDarts.cs", "Projects/UOContent/Items/Skill Items/Ninjitsu/FukiyaDarts.cs", "modernuo-ninjitsu"),
    ("LeatherNinjaBelt.cs", "Projects/UOContent/Items/Skill Items/Ninjitsu/LeatherNinjaBelt.cs", "modernuo-ninjitsu"),
    ("NinjaWeapons.cs", "Projects/UOContent/Items/Skill Items/Ninjitsu/NinjaWeapons.cs", "modernuo-ninjitsu"),
    ("Shuriken.cs", "Projects/UOContent/Items/Skill Items/Ninjitsu/Shuriken.cs", "modernuo-ninjitsu"),
    ("SmokeBomb.cs", "Projects/UOContent/Items/Skill Items/Ninjitsu/SmokeBomb.cs", "modernuo-ninjitsu"),
    ("LeatherNinjaHood.cs", "Projects/UOContent/Items/Armor/Leather/LeatherNinjaHood.cs", "modernuo-ninjitsu"),
    ("LeatherNinjaJacket.cs", "Projects/UOContent/Items/Armor/Leather/LeatherNinjaJacket.cs", "modernuo-ninjitsu"),
    ("LeatherNinjaMitts.cs", "Projects/UOContent/Items/Armor/Leather/LeatherNinjaMitts.cs", "modernuo-ninjitsu"),
    ("LeatherNinjaPants.cs", "Projects/UOContent/Items/Armor/Leather/LeatherNinjaPants.cs", "modernuo-ninjitsu"),
    # Group 4 — Core Combat, Honor/Perfection, Parry & SpecialMove Hooks (3 files, category "modernuo-bushido")
    ("HonorContext.cs", "Projects/UOContent/Engines/Virtues/HonorContext.cs", "modernuo-bushido"),
    ("BaseWeapon.cs", "Projects/UOContent/Items/Weapons/BaseWeapon.cs", "modernuo-bushido"),
    ("SpecialMove.cs", "Projects/UOContent/Spells/Base/SpecialMove.cs", "modernuo-bushido"),
    # Group 5 — Tokuno (Samurai Empire) Weapons for Phase 5 CLASS-04 (13 files, category "items-equipment")
    ("Katana.cs", "Projects/UOContent/Items/Weapons/Swords/Katana.cs", "items-equipment"),
    ("Bokuto.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Bokuto.cs", "items-equipment"),
    ("Daisho.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Daisho.cs", "items-equipment"),
    ("Kama.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Kama.cs", "items-equipment"),
    ("Lajatang.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Lajatang.cs", "items-equipment"),
    ("NoDachi.cs", "Projects/UOContent/Items/Weapons/SE Weapons/NoDachi.cs", "items-equipment"),
    ("Nunchaku.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Nunchaku.cs", "items-equipment"),
    ("Sai.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Sai.cs", "items-equipment"),
    ("Tekagi.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Tekagi.cs", "items-equipment"),
    ("Tessen.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Tessen.cs", "items-equipment"),
    ("Tetsubo.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Tetsubo.cs", "items-equipment"),
    ("Wakizashi.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Wakizashi.cs", "items-equipment"),
    ("Yumi.cs", "Projects/UOContent/Items/Weapons/SE Weapons/Yumi.cs", "items-equipment"),
)


def norm_eol(text: str) -> str:
    return text.replace("\r\n", "\n")


def sha256_hex(text: str) -> str:
    return hashlib.sha256(norm_eol(text).encode("utf-8")).hexdigest()


def count_lines(text: str) -> int:
    return len(norm_eol(text).splitlines())


def safe_cs_filename(filename: str) -> str:
    base = os.path.basename(filename)
    if base != filename or not base.endswith(".cs") or ".." in base or "/" in base or "\\" in base:
        raise ValueError(f"Unsafe destination filename: {filename!r}")
    return base


def fetch_raw_cs(repo_path: str) -> str:
    encoded_path = urllib.parse.quote(repo_path, safe="/")
    raw_url = f"https://raw.githubusercontent.com/{MODERNUO_REPO}/{MODERNUO_COMMIT}/{encoded_path}"
    req = urllib.request.Request(
        raw_url,
        headers={"User-Agent": "uoIdle-fetch-modernuo/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            return norm_eol(resp.read().decode("utf-8"))
    except (urllib.error.URLError, TimeoutError):
        # Fallback to authenticated `gh api`
        api_endpoint = f"repos/{MODERNUO_REPO}/contents/{encoded_path}?ref={MODERNUO_COMMIT}"
        proc = subprocess.run(
            ["gh", "api", "-H", "Accept: application/vnd.github.raw+json", api_endpoint],
            capture_output=True,
            text=True,
            check=True,
        )
        return norm_eol(proc.stdout)


def fetch_or_read_cached(dest_name: str, repo_path: str, force: bool = False) -> Tuple[str, str]:
    safe_name = safe_cs_filename(dest_name)
    cache_path = CRAWL_MODERNUO_DIR / safe_name
    if not force and cache_path.is_file():
        return safe_name, norm_eol(cache_path.read_text(encoding="utf-8"))
    content = fetch_raw_cs(repo_path)
    CRAWL_MODERNUO_DIR.mkdir(parents=True, exist_ok=True)
    with open(cache_path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)
    return safe_name, content


def load_existing_manifest() -> Dict[str, Any]:
    if MANIFEST_PATH.is_file():
        try:
            data = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
            if isinstance(data, dict) and isinstance(data.get("entries"), dict):
                return data
        except (OSError, ValueError):
            pass
    return {
        "version": 1,
        "updatedAt": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "bundleVersion": "0.99.0",
        "modernuoCommit": MODERNUO_COMMIT,
        "entries": {},
    }


def extract_all(force: bool = False) -> Dict[str, Any]:
    MODERNUO_OUT_DIR.mkdir(parents=True, exist_ok=True)
    CRAWL_MODERNUO_DIR.mkdir(parents=True, exist_ok=True)
    manifest = load_existing_manifest()
    manifest["modernuoCommit"] = MODERNUO_COMMIT

    fetched: Dict[str, str] = {}
    with ThreadPoolExecutor(max_workers=8) as pool:
        future_map = {
            pool.submit(fetch_or_read_cached, dest_name, repo_path, force): (dest_name, repo_path, category)
            for dest_name, repo_path, category in MODERNUO_FILES
        }
        for fut in as_completed(future_map):
            safe_name, content = fut.result()
            fetched[safe_name] = content

    for dest_name, repo_path, category in MODERNUO_FILES:
        safe_name = safe_cs_filename(dest_name)
        content = norm_eol(fetched[safe_name])
        out_path = MODERNUO_OUT_DIR / safe_name
        with open(out_path, "w", encoding="utf-8", newline="\n") as f:
            f.write(content)

        rel_key = f"modernuo/{safe_name}"
        manifest["entries"][rel_key] = {
            "sha256": sha256_hex(content),
            "lines": count_lines(content),
            "category": category,
            "source": f"https://github.com/{MODERNUO_REPO}/blob/{MODERNUO_COMMIT}/{repo_path}",
        }

    manifest["entries"] = {k: manifest["entries"][k] for k in sorted(manifest["entries"])}
    manifest["updatedAt"] = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    with open(MANIFEST_PATH, "w", encoding="utf-8", newline="\n") as f:
        f.write(json.dumps(manifest, indent=2) + "\n")

    return {
        "ok": True,
        "extracted": len(MODERNUO_FILES),
        "modernuoCommit": MODERNUO_COMMIT,
    }


def verify_all() -> Dict[str, Any]:
    errors: List[str] = []
    if not MANIFEST_PATH.is_file():
        return {"ok": False, "verified": 0, "errors": ["manifest.json is missing"]}

    try:
        manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    except (OSError, ValueError) as exc:
        return {"ok": False, "verified": 0, "errors": [f"manifest.json unreadable: {exc}"]}

    if manifest.get("modernuoCommit") != MODERNUO_COMMIT:
        errors.append(
            f"modernuoCommit mismatch: expected {MODERNUO_COMMIT!r}, got {manifest.get('modernuoCommit')!r}"
        )

    entries = manifest.get("entries", {})
    verified = 0
    expected_names = set()

    for dest_name, repo_path, category in MODERNUO_FILES:
        safe_name = safe_cs_filename(dest_name)
        expected_names.add(safe_name)
        rel_key = f"modernuo/{safe_name}"
        entry = entries.get(rel_key)
        file_path = MODERNUO_OUT_DIR / safe_name

        if entry is None:
            errors.append(f"Missing manifest entry for {rel_key}")
            continue
        if not file_path.is_file():
            errors.append(f"Missing file on disk: mechanics/_raw/{rel_key}")
            continue

        content = norm_eol(file_path.read_text(encoding="utf-8"))
        actual_sha = sha256_hex(content)
        actual_lines = count_lines(content)
        expected_src = f"https://github.com/{MODERNUO_REPO}/blob/{MODERNUO_COMMIT}/{repo_path}"

        if entry.get("sha256") != actual_sha:
            errors.append(f"{rel_key}: sha256 mismatch ({entry.get('sha256')} != {actual_sha})")
            continue
        if entry.get("lines") != actual_lines:
            errors.append(f"{rel_key}: lines mismatch ({entry.get('lines')} != {actual_lines})")
            continue
        if entry.get("category") != category:
            errors.append(f"{rel_key}: category mismatch ({entry.get('category')} != {category})")
            continue
        if entry.get("source") != expected_src:
            errors.append(f"{rel_key}: source mismatch ({entry.get('source')} != {expected_src})")
            continue

        verified += 1

    if MODERNUO_OUT_DIR.is_dir():
        for p in sorted(MODERNUO_OUT_DIR.iterdir()):
            if p.is_file() and not p.name.startswith(".") and p.name not in expected_names:
                errors.append(f"Orphan file in mechanics/_raw/modernuo/: {p.name}")

    out: Dict[str, Any] = {"ok": len(errors) == 0 and verified == len(MODERNUO_FILES), "verified": verified}
    if errors:
        out["errors"] = errors
    return out


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Fetch or verify canonical ModernUO C# files in mechanics/_raw/modernuo/")
    parser.add_argument("--force", action="store_true", help="Re-fetch files from GitHub ignoring local _crawl/ cache")
    parser.add_argument("--verify", action="store_true", help="Verify all 48 .cs files against mechanics/_raw/manifest.json")
    args = parser.parse_args(argv)

    try:
        if args.verify:
            res = verify_all()
        else:
            res = extract_all(force=args.force)
        print(json.dumps(res))
        return 0 if res.get("ok") else 1
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
