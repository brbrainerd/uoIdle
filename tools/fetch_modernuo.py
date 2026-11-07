#!/usr/bin/env python3
"""Deterministic ModernUO C# source file fetcher and manifest updater.

Fetches canonical Bushido, Ninjitsu, Perfection (HonorContext.cs), and Parry
(BaseWeapon.cs, SpecialMove.cs) C# source files from modernuo/ModernUO pinned
to commit b0e6b17c5cba3a6944ca25a9676dcdec0022ac38 into mechanics/_raw/modernuo/
and merges their SHA-256 and line-count provenance entries into
mechanics/_raw/manifest.json.

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

# (dest_filename, upstream_repo_path, category)
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
    # Group 4 — Core Combat, Honor/Perfection, Parry & SpecialMove Hooks (3 files, category "modernuo-bushido")
    ("HonorContext.cs", "Projects/UOContent/Engines/Virtues/HonorContext.cs", "modernuo-bushido"),
    ("BaseWeapon.cs", "Projects/UOContent/Items/Weapons/BaseWeapon.cs", "modernuo-bushido"),
    ("SpecialMove.cs", "Projects/UOContent/Spells/Base/SpecialMove.cs", "modernuo-bushido"),
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


def main(argv: List[str] | None = None) -> int:
    parser = argparse.ArgumentParser(description="Fetch canonical ModernUO C# files into mechanics/_raw/modernuo/")
    parser.add_argument("--force", action="store_true", help="Re-fetch files from GitHub ignoring local _crawl/ cache")
    args = parser.parse_args(argv)

    try:
        res = extract_all(force=args.force)
        print(json.dumps(res))
        return 0 if res.get("ok") else 1
    except Exception as exc:
        print(json.dumps({"ok": False, "error": str(exc)}))
        return 1


if __name__ == "__main__":
    sys.exit(main())
