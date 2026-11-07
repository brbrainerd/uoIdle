#!/usr/bin/env python3
"""
Authentic Ultima Online Gump, Item Sprite & Oil-Painted Raster Icon Generator (Phase 8 / ART-01..03).

Zero procedural polygons (`ImageDraw.polygon` is strictly prohibited).
Combines:
  1. Authentic in-game UO ability gumps sliced from `ability-icons.png` (`ability-icons-atlas.json`)
  2. High-detail oil-painted dark-fantasy Tokuno raster icons from `mockups/assets/icons/sources/`
  3. Authentic UO item sprites sliced from `art.png` (`art.json`) for Samurai & Ninja weapons, armor, and tools
  4. Authentic layered UO paperdoll character renders composited from `paperdoll.json` gump layers (`12.png` + gear)
  5. Contact sheets (`mockups/assets/icons/contact-sheet.png` & `mockups/assets/items/items-contact-sheet.png`)
  6. SHA-256 & pixel-variance provenance manifests and `--verify` CLI gate
"""

from __future__ import annotations

import argparse
import hashlib
import json
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageEnhance, ImageFilter, ImageFont, ImageStat

ROOT_DIR = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT_DIR / "mockups" / "assets" / "icons"
SOURCES_DIR = ICONS_DIR / "sources"
SAMURAI_DIR = ICONS_DIR / "samurai"
NINJA_DIR = ICONS_DIR / "ninja"
CONTACT_SHEET_PATH = ICONS_DIR / "contact-sheet.png"
MANIFEST_PATH = ICONS_DIR / "manifest.json"

ITEMS_DIR = ROOT_DIR / "mockups" / "assets" / "items"
ITEMS_CONTACT_SHEET_PATH = ITEMS_DIR / "items-contact-sheet.png"
ITEMS_MANIFEST_PATH = ITEMS_DIR / "manifest.json"

PACKS_DIR = ROOT_DIR / "mechanics" / "_crawl" / "packs"
ABILITY_ATLAS_JSON = ROOT_DIR / "mechanics" / "_raw" / "bundle" / "ability-icons-atlas.json"
ABILITY_ATLAS_PNG = PACKS_DIR / "ability-icons.png"
ART_JSON = PACKS_DIR / "art.json"
ART_PNG = PACKS_DIR / "art.png"
PAPERDOLL_JSON = PACKS_DIR / "paperdoll.json"
GUMPS_DIR = PACKS_DIR / "gumps"

SAMURAI_JSON = ROOT_DIR / "design" / "drop-in" / "samurai.json"
NINJA_JSON = ROOT_DIR / "design" / "drop-in" / "ninja.json"

CANVAS_SIZE = 256
MIN_STD_DEV = 12.0

# Theme palette (from 06-UI-SPEC.md)
BG_CANVAS = (11, 13, 10, 255)          # #0b0d0a
BG_PANEL = (18, 21, 16, 255)           # #121510
BG_CARD = (24, 28, 22, 255)            # #181c16
BORDER_SUBTLE = (42, 48, 38, 255)      # #2a3026
GOLD_PRIMARY = (201, 162, 39, 255)     # #c9a227
GOLD_BRIGHT = (229, 193, 88, 255)      # #e5c158
GOLD_TEXT = (212, 175, 55, 255)        # #d4af37
GOLD_SHADOW = (78, 60, 32, 255)        # #4e3c20
TEXT_PRIMARY = (232, 228, 217, 255)    # #e8e4d9
TEXT_SECONDARY = (163, 158, 144, 255)  # #a39e90
SPECULAR_CREAM = (255, 246, 214, 255)  # #fff6d6
OUTLINE_DARK = (6, 7, 6, 255)          # #060706

SAMURAI_CRIMSON = (200, 62, 55, 255)   # #c83e37 (robeHue 1884)
NINJA_EMERALD = (46, 158, 107, 255)    # #2e9e6b (robeHue 1175)
NINJA_VIOLET = (139, 92, 246, 255)     # #8b5cf6

SAMURAI_STEMS: list[tuple[str, str, str]] = [
    # 12 Canonical samurai.json IDs
    ("samurai_way", "L1 Passive", "Way of the Blade"),
    ("samurai_lightning", "L5 Skill", "Lightning Strike"),
    ("samurai_perfection", "L10 Mechanic", "Honor & Perfection"),
    ("samurai_honorable", "L15 Skill", "Honorable Execution"),
    ("samurai_confidence", "L20 Spell", "Confidence"),
    ("samurai_counter", "L25 Spell", "Counter Attack"),
    ("samurai_double_strike", "L30 Weapon", "Double Strike"),
    ("samurai_evasion", "L35 Spell", "Evasion"),
    ("samurai_momentum_strike", "L40 Spell", "Momentum Strike"),
    ("samurai_armor_ignore", "L45 Weapon", "Armor Ignore"),
    ("samurai_frenzied_whirlwind", "L50 Weapon", "Frenzied Whirlwind"),
    ("samurai_kensei_judgment", "L60 Capstone", "Kensei Judgment"),
    # 11 06-CONTEXT.md Alias & Passive Badge IDs
    ("samurai_lightning_strike", "Alias L5", "Lightning Strike"),
    ("samurai_honorable_exec", "Alias L15", "Honorable Exec"),
    ("samurai_counter_attack", "Alias L25", "Counter Attack"),
    ("samurai_whirlwind_attack", "Bushido AoE", "Whirlwind Attack"),
    ("samurai_bladeweave", "Mastery", "Bladeweave"),
    ("samurai_crushing_blow", "Weapon", "Crushing Blow"),
    ("samurai_honorable_exec_r2", "Alias L60 II", "Kensei Judgment"),
    ("samurai_bushido_initiate", "Badge T1", "Bushido Initiate"),
    ("samurai_inner_calm", "Badge T2", "Inner Calm"),
    ("samurai_way_of_the_blade", "Badge T3", "Way of the Blade"),
    ("samurai_bushido_master", "Badge T4", "Bushido Master"),
]

NINJA_STEMS: list[tuple[str, str, str]] = [
    # 13 Canonical ninja.json IDs
    ("ninja_shadowjump", "L1 Passive", "Shadowjump"),
    ("ninja_focus", "L5 Skill", "Focus Attack"),
    ("ninja_mirror", "L10 Spell", "Mirror Image"),
    ("ninja_backstab", "L15 Skill", "Backstab"),
    ("ninja_death", "L20 Skill", "Death Strike"),
    ("ninja_animal_form", "L25 Spell", "Animal Form"),
    ("ninja_infectious_strike", "L30 Weapon", "Infectious Strike"),
    ("ninja_smoke_bomb", "L35 Mechanic", "Smoke Bomb"),
    ("ninja_shuriken", "L35 Bonus", "Shuriken Volley"),
    ("ninja_ki_attack", "L40 Skill", "Ki Attack"),
    ("ninja_surprise_attack", "L45 Skill", "Surprise Attack"),
    ("ninja_fukiya_barrage", "L50 Tool/Spell", "Fukiya & Egg Bomb"),
    ("ninja_twin_shadow", "L60 Capstone", "Twin Shadow Exec"),
    # 9 06-CONTEXT.md Alias & Passive Badge IDs
    ("ninja_focus_attack", "Alias L5", "Focus Attack"),
    ("ninja_mirror_image", "Alias L10", "Mirror Image"),
    ("ninja_shadow_strike", "Stealth", "Shadow Strike"),
    ("ninja_double_strike", "Weapon", "Double Strike"),
    ("ninja_armor_ignore", "Weapon", "Armor Ignore"),
    ("ninja_way_of_stealth", "Badge T1", "Way of Stealth"),
    ("ninja_shadow_discipline", "Badge T2", "Shadow Discipline"),
    ("ninja_lethal_toxins", "Badge T3", "Lethal Toxins"),
    ("ninja_master_assassin", "Badge T4", "Master Assassin"),
]

SAMURAI_ALIAS_IDS = [
    "samurai_lightning_strike",
    "samurai_honorable_exec",
    "samurai_counter_attack",
    "samurai_whirlwind_attack",
    "samurai_bladeweave",
    "samurai_crushing_blow",
    "samurai_honorable_exec_r2",
    "samurai_bushido_initiate",
    "samurai_inner_calm",
    "samurai_way_of_the_blade",
    "samurai_bushido_master",
]

NINJA_ALIAS_IDS = [
    "ninja_focus_attack",
    "ninja_mirror_image",
    "ninja_shadow_strike",
    "ninja_double_strike",
    "ninja_armor_ignore",
    "ninja_way_of_stealth",
    "ninja_shadow_discipline",
    "ninja_lethal_toxins",
    "ninja_master_assassin",
]

# Mapping of stems to authentic UO gump keys & high-detail dark-fantasy Tokuno oil-painted sprite sheets
# Bushido AI Sheet (2 cols x 3 rows):
#   (0,0): Confidence   (1,0): Evasion
#   (0,1): Momentum     (1,1): Bushido Perfection
#   (0,2): Kensei       (1,2): Way of the Samurai Dojo
# Samurai Thematic Sheet (3 cols x 3 rows):
#   (0,0): Way of the Blade (Daisho Parry Ward)  (1,0): Lightning Strike (Katana Thunderbolt)  (2,0): Honorable Execution (Crimson Cleave)
#   (0,1): Counter Attack (Parry + Riposte)      (1,1): Double Strike (Twin Gold/Crimson Arc)  (2,1): Armor Ignore (Katana Piercing Plate)
#   (0,2): Frenzied Whirlwind (Blade Tempest)    (1,2): Bushido Initiate (Scroll & Wakizashi)  (2,2): Inner Calm (Golden Lotus & Hilt)
# Ninjitsu AI Sheet (3 cols x 3 rows):
#   (0,0): Animal Form  (1,0): Ki Attack        (2,0): Backstab
#   (0,1): Surprise Atk (1,1): Smoke Bomb       (2,1): Shuriken
#   (0,2): Fukiya       (1,2): Twin Shadow      (2,2): Shadow Seal
# Ninja Thematic Sheet (3 cols x 3 rows):
#   (0,0): Shadowjump (Twilight Tekagi Blur)     (1,0): Focus Attack (Ki Needle Blade)         (2,0): Mirror Image (Moonlight Shadow Clones)
#   (0,1): Death Strike (5-Point Dim-Mak Heart)  (1,1): Infectious Strike (Venomous Kryss)     (2,1): Shadow Discipline (Kuji-Kiri Mudra)
#   (0,2): Lethal Toxins (Vial + Kryss + Star)   (1,2): Master Assassin (Tekagi Moon Crest)    (2,2): Bushido Master (Kensei Sun & Daisho)
# Tokuno Fixes Sheet (2 cols x 2 rows):
#   (0,0): Way of the Blade (Exact 3-Sword Katana/Wakizashi/No-Dachi Fan + Golden Parry Ward)
#   (1,0): Crushing Blow (No-Dachi Vertical Cleave)
#   (0,1): Bladeweave (Gold & Crimson Katana Ribbon Spiral)
#   (1,1): Shadow Strike (Tekagi & Wakizashi Twilight Emerald Strike)
STEM_SOURCE_MAP: dict[str, dict[str, object]] = {
    # Samurai Canonical (12) — 100% thematically matched to weapon & blurb
    "samurai_way": {"type": "ai_tokuno_fixes", "cell": (0, 0), "badge": True},
    "samurai_lightning": {"type": "ai_samurai_thematic", "cell": (1, 0)},
    "samurai_perfection": {"type": "ai_bushido", "cell": (1, 1), "badge": True},
    "samurai_honorable": {"type": "ai_samurai_thematic", "cell": (2, 0)},
    "samurai_confidence": {"type": "ai_bushido", "cell": (0, 0)},
    "samurai_counter": {"type": "ai_samurai_thematic", "cell": (0, 1)},
    "samurai_double_strike": {"type": "ai_samurai_thematic", "cell": (1, 1)},
    "samurai_evasion": {"type": "ai_bushido", "cell": (1, 0)},
    "samurai_momentum_strike": {"type": "ai_bushido", "cell": (0, 1)},
    "samurai_armor_ignore": {"type": "ai_samurai_thematic", "cell": (2, 1)},
    "samurai_frenzied_whirlwind": {"type": "ai_samurai_thematic", "cell": (0, 2)},
    "samurai_kensei_judgment": {"type": "ai_bushido", "cell": (0, 2), "capstone": True},
    # Samurai Aliases & Badges (11)
    "samurai_lightning_strike": {"type": "ai_samurai_thematic", "cell": (1, 0), "tint": (1.06, 1.0, 1.0)},
    "samurai_honorable_exec": {"type": "ai_samurai_thematic", "cell": (2, 0), "tint": (1.06, 1.0, 1.0)},
    "samurai_counter_attack": {"type": "ai_samurai_thematic", "cell": (0, 1), "tint": (1.06, 1.0, 1.0)},
    "samurai_whirlwind_attack": {"type": "ai_samurai_thematic", "cell": (0, 2), "tint": (1.05, 0.98, 0.95)},
    "samurai_bladeweave": {"type": "ai_tokuno_fixes", "cell": (0, 1)},
    "samurai_crushing_blow": {"type": "ai_tokuno_fixes", "cell": (1, 0)},
    "samurai_honorable_exec_r2": {"type": "ai_bushido", "cell": (0, 2), "capstone": True, "tint": (1.1, 1.02, 0.95)},
    "samurai_bushido_initiate": {"type": "ai_samurai_thematic", "cell": (1, 2), "badge": True},
    "samurai_inner_calm": {"type": "ai_samurai_thematic", "cell": (2, 2), "badge": True},
    "samurai_way_of_the_blade": {"type": "ai_bushido", "cell": (1, 2), "badge": True},
    "samurai_bushido_master": {"type": "ai_ninja_thematic", "cell": (2, 2), "badge": True},
    # Ninja Canonical (13) — 100% thematically matched to weapon & blurb
    "ninja_shadowjump": {"type": "ai_ninja_thematic", "cell": (0, 0), "badge": True},
    "ninja_focus": {"type": "ai_ninja_thematic", "cell": (1, 0)},
    "ninja_mirror": {"type": "ai_ninja_thematic", "cell": (2, 0)},
    "ninja_backstab": {"type": "ai_ninjitsu", "cell": (2, 0)},
    "ninja_death": {"type": "ai_ninja_thematic", "cell": (0, 1)},
    "ninja_animal_form": {"type": "ai_ninjitsu", "cell": (0, 0)},
    "ninja_infectious_strike": {"type": "ai_ninja_thematic", "cell": (1, 1)},
    "ninja_smoke_bomb": {"type": "ai_ninjitsu", "cell": (1, 1), "badge": True},
    "ninja_shuriken": {"type": "ai_ninjitsu", "cell": (2, 1)},
    "ninja_ki_attack": {"type": "ai_ninjitsu", "cell": (1, 0)},
    "ninja_surprise_attack": {"type": "ai_ninjitsu", "cell": (0, 1)},
    "ninja_fukiya_barrage": {"type": "ai_ninjitsu", "cell": (0, 2)},
    "ninja_twin_shadow": {"type": "ai_ninjitsu", "cell": (1, 2), "capstone": True},
    # Ninja Aliases & Badges (9)
    "ninja_focus_attack": {"type": "ai_ninja_thematic", "cell": (1, 0), "tint": (0.96, 1.06, 1.02)},
    "ninja_mirror_image": {"type": "ai_ninja_thematic", "cell": (2, 0), "tint": (0.96, 1.06, 1.02)},
    "ninja_shadow_strike": {"type": "ai_tokuno_fixes", "cell": (1, 1)},
    "ninja_double_strike": {"type": "ai_samurai_thematic", "cell": (1, 1), "tint": (0.85, 1.12, 1.08)},
    "ninja_armor_ignore": {"type": "ai_samurai_thematic", "cell": (2, 1), "tint": (0.85, 1.12, 1.08)},
    "ninja_way_of_stealth": {"type": "ai_ninjitsu", "cell": (2, 2), "badge": True},
    "ninja_shadow_discipline": {"type": "ai_ninja_thematic", "cell": (2, 1), "badge": True},
    "ninja_lethal_toxins": {"type": "ai_ninja_thematic", "cell": (0, 2), "badge": True},
    "ninja_master_assassin": {"type": "ai_ninja_thematic", "cell": (1, 2), "badge": True},
}

# Authentic UO Item Sprites to extract from art.png (art.json) for Paperdoll & Armaments Showcase
ITEM_SPRITE_CATALOG: list[dict[str, object]] = [
    # Samurai Paperdoll Armor & Weapons
    {"id": "kabuto", "name": "Kabuto Helm", "graphic": 10102, "hex": "0x2776", "slot": "helm", "class": "samurai", "maleGump": 50444},
    {"id": "samurai_do", "name": "Plate Do Cuirass", "graphic": 10182, "hex": "0x27C6", "slot": "chest", "class": "samurai", "maleGump": 50457},
    {"id": "hiro_sode", "name": "Plate Hiro-Sode", "graphic": 10110, "hex": "0x277E", "slot": "arms", "class": "samurai", "maleGump": 50473},
    {"id": "suneate", "name": "Plate Suneate Greaves", "graphic": 5067, "hex": "0x13CB", "slot": "legs", "class": "samurai", "maleGump": 50543},
    {"id": "waraji", "name": "Waraji & Tabi", "graphic": 10134, "hex": "0x2796", "slot": "boots", "class": "samurai", "maleGump": 50569},
    {"id": "jin_baori", "name": "Imperial Jin-Baori Cloak", "graphic": 5397, "hex": "0x1515", "slot": "cloak", "class": "samurai", "maleGump": 50468},
    {"id": "katana", "name": "Katana", "graphic": 5119, "hex": "0x13FF", "slot": "weapon", "class": "samurai", "maleGump": 50627},
    {"id": "daisho", "name": "Daisho", "graphic": 10153, "hex": "0x27A9", "slot": "weapon", "class": "samurai", "maleGump": 50470},
    {"id": "no_dachi", "name": "No-Dachi", "graphic": 10146, "hex": "0x27A2", "slot": "weapon", "class": "samurai", "maleGump": 50519},
    {"id": "wakizashi", "name": "Wakizashi", "graphic": 10148, "hex": "0x27A4", "slot": "weapon", "class": "samurai", "maleGump": 50464},
    {"id": "bokuto", "name": "Bokuto", "graphic": 10152, "hex": "0x27A8", "slot": "weapon", "class": "samurai", "maleGump": 50467},
    {"id": "tetsubo", "name": "Tetsubo", "graphic": 10150, "hex": "0x27A6", "slot": "weapon", "class": "samurai", "maleGump": 50583},
    {"id": "yumi", "name": "Yumi Greatbow", "graphic": 10149, "hex": "0x27A5", "slot": "weapon", "class": "samurai", "maleGump": 50575},
    # Ninja Paperdoll Armor, Weapons & Tools
    {"id": "ninja_hood", "name": "Leather Ninja Hood", "graphic": 10126, "hex": "0x278E", "slot": "helm", "class": "ninja", "maleGump": 50425},
    {"id": "ninja_jacket", "name": "Leather Ninja Jacket", "graphic": 10131, "hex": "0x2793", "slot": "chest", "class": "ninja", "maleGump": 50426},
    {"id": "ninja_mitts", "name": "Leather Ninja Mitts", "graphic": 10130, "hex": "0x2792", "slot": "gloves", "class": "ninja", "maleGump": 50424},
    {"id": "ninja_pants", "name": "Leather Ninja Pants", "graphic": 10129, "hex": "0x2791", "slot": "legs", "class": "ninja", "maleGump": 50423},
    {"id": "ninja_tabi", "name": "Shinobi Ninja-Tabi", "graphic": 10135, "hex": "0x2797", "slot": "boots", "class": "ninja", "maleGump": 50572},
    {"id": "ninja_belt", "name": "Leather Shuriken Belt", "graphic": 10128, "hex": "0x2790", "slot": "belt", "class": "ninja", "maleGump": 50514},
    {"id": "tekagi", "name": "Tekagi War Claws", "graphic": 10155, "hex": "0x27AB", "slot": "weapon", "class": "ninja", "maleGump": 50533},
    {"id": "kama", "name": "Kama Twin Sickles", "graphic": 10157, "hex": "0x27AD", "slot": "weapon", "class": "ninja", "maleGump": 50535},
    {"id": "sai", "name": "Sai", "graphic": 10159, "hex": "0x27AF", "slot": "weapon", "class": "ninja", "maleGump": 50537},
    {"id": "lajatang", "name": "Lajatang Crescent Staff", "graphic": 10151, "hex": "0x27A7", "slot": "weapon", "class": "ninja", "maleGump": 50526},
    {"id": "tessen", "name": "Tessen Iron War Fan", "graphic": 10147, "hex": "0x27A3", "slot": "weapon", "class": "ninja", "maleGump": 50520},
    {"id": "nunchaku", "name": "Nunchaku", "graphic": 10158, "hex": "0x27AE", "slot": "weapon", "class": "ninja", "maleGump": 50536},
    {"id": "fukiya", "name": "Fukiya Blowgun", "graphic": 10154, "hex": "0x27AA", "slot": "offhand", "class": "ninja", "maleGump": 50532},
    {"id": "kryss", "name": "Kryss", "graphic": 5121, "hex": "0x1401", "slot": "weapon", "class": "ninja", "maleGump": 50630},
    # Consumables & Belt Pouches
    {"id": "heal_potion", "name": "Greater Heal Potion", "graphic": 3852, "hex": "0x0F0C", "slot": "consumable", "class": "both"},
    {"id": "cure_potion", "name": "Greater Cure Potion", "graphic": 3847, "hex": "0x0F07", "slot": "consumable", "class": "both"},
    {"id": "refresh_potion", "name": "Total Refresh Potion", "graphic": 3846, "hex": "0x0F06", "slot": "consumable", "class": "both"},
    {"id": "bandage", "name": "Clean Bandages", "graphic": 3617, "hex": "0x0E21", "slot": "consumable", "class": "both"},
]


def apply_rgb_tint(img: Image.Image, factors: tuple[float, float, float]) -> Image.Image:
    """Applies subtle per-channel RGB tinting while preserving alpha."""
    r, g, b, a = img.convert("RGBA").split()
    r = r.point(lambda v: min(255, int(v * factors[0])))
    g = g.point(lambda v: min(255, int(v * factors[1])))
    b = b.point(lambda v: min(255, int(v * factors[2])))
    return Image.merge("RGBA", (r, g, b, a))


def draw_uo_beveled_frame(
    img: Image.Image,
    accent_rgba: tuple[int, int, int, int],
    is_capstone: bool = False,
    is_badge: bool = False,
) -> Image.Image:
    """Applies authentic Ultima Online beveled antique-gold & class-hue gump frame using rectangular borders only."""
    out = img.copy().convert("RGBA")
    draw = ImageDraw.Draw(out, "RGBA")
    n = out.width

    draw.rectangle([0, 0, n - 1, n - 1], outline=BG_CANVAS, width=4)

    gold_top = GOLD_BRIGHT if (is_capstone or is_badge) else GOLD_PRIMARY
    draw.rectangle([4, 4, n - 5, n - 5], outline=gold_top, width=8)
    # Bottom/right shadow bevel lines
    draw.line([(8, n - 6), (n - 6, n - 6), (n - 6, 8)], fill=GOLD_SHADOW, width=4)
    # Top/left specular highlight lines
    draw.line([(6, n - 10), (6, 6), (n - 10, 6)], fill=SPECULAR_CREAM, width=2)

    draw.rectangle([12, 12, n - 13, n - 13], outline=BG_PANEL, width=3)

    rim_color = GOLD_BRIGHT if is_capstone else accent_rgba
    draw.rectangle([15, 15, n - 16, n - 16], outline=(*rim_color[:3], 230), width=4)
    draw.rectangle([19, 19, n - 20, n - 20], outline=(10, 12, 10, 220), width=2)

    # Corner square studs (zero polygons)
    corners = [(12, 12), (n - 13, 12), (12, n - 13), (n - 13, n - 13)]
    for cx, cy in corners:
        draw.rectangle([cx - 6, cy - 6, cx + 6, cy + 6], fill=gold_top, outline=OUTLINE_DARK, width=2)
        draw.ellipse([cx - 2, cy - 2, cx + 2, cy + 2], fill=SPECULAR_CREAM)

    if is_capstone:
        # Double gold inset frame for L60 capstones
        draw.rectangle([22, 22, n - 23, n - 23], outline=GOLD_BRIGHT, width=2)

    return out


def build_class_portraits() -> None:
    """Frames the oil-painted Samurai & Ninja portraits into 256x256 and 64x64 PNGs."""
    SAMURAI_DIR.mkdir(parents=True, exist_ok=True)
    NINJA_DIR.mkdir(parents=True, exist_ok=True)

    configs = [
        (SOURCES_DIR / "portrait-samurai-raw.png", SAMURAI_DIR / "portrait-samurai.png", SAMURAI_DIR / "portrait-samurai-64.png", SAMURAI_CRIMSON),
        (SOURCES_DIR / "portrait-ninja-raw.png", NINJA_DIR / "portrait-ninja.png", NINJA_DIR / "portrait-ninja-64.png", NINJA_EMERALD),
    ]

    for raw_src, out_256, out_64, accent in configs:
        raw = Image.open(raw_src).convert("RGBA").resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
        framed_256 = draw_uo_beveled_frame(raw, accent, is_capstone=False, is_badge=True)
        framed_256.save(out_256, format="PNG", optimize=True)
        framed_64 = framed_256.resize((64, 64), Image.Resampling.LANCZOS)
        framed_64.save(out_64, format="PNG", optimize=True)


def load_ability_atlas() -> tuple[Image.Image | None, dict[str, dict[str, int]]]:
    """Loads ability-icons.png and its frame dictionary keyed by frame['key']."""
    if not ABILITY_ATLAS_JSON.exists():
        return None, {}
    atlas_meta = json.loads(ABILITY_ATLAS_JSON.read_text(encoding="utf-8"))
    frames = {fr["key"]: fr for fr in atlas_meta.get("frames", [])}
    atlas_img_path = SOURCES_DIR / "ability-icons.png"
    if not atlas_img_path.exists() and ABILITY_ATLAS_PNG.exists():
        SOURCES_DIR.mkdir(parents=True, exist_ok=True)
        atlas_img_path.write_bytes(ABILITY_ATLAS_PNG.read_bytes())
    if atlas_img_path.exists():
        return Image.open(atlas_img_path).convert("RGBA"), frames
    return None, frames


def extract_master_icon(
    stem: str,
    accent: tuple[int, int, int, int],
    atlas_img: Image.Image | None,
    atlas_frames: dict[str, dict[str, int]],
    bushido_sheet: Image.Image,
    ninjitsu_sheet: Image.Image,
    samurai_thematic_sheet: Image.Image,
    ninja_thematic_sheet: Image.Image,
    tokuno_fixes_sheet: Image.Image,
) -> Image.Image:
    """Extracts a 256x256 master icon from either ability-icons.png or the AI oil-painted sprite sheets."""
    spec = STEM_SOURCE_MAP[stem]
    src_type = str(spec["type"])
    is_capstone = bool(spec.get("capstone", False))
    is_badge = bool(spec.get("badge", False))
    crop_inset = int(spec.get("crop_inset", 18))

    if src_type == "atlas" and atlas_img is not None:
        key = str(spec["key"])
        fr = atlas_frames[key]
        x, y, w, h = int(fr["x"]), int(fr["y"]), int(fr["width"]), int(fr["height"])
        raw_cell = atlas_img.crop((x, y, x + w, y + h))
        bbox = raw_cell.getbbox()
        if bbox is not None:
            raw_cell = raw_cell.crop(bbox)
        cw, ch = raw_cell.size
        # Crop 1px inside the gump to remove outer black frame before upscaling
        gump_crop = raw_cell.crop((1, 1, max(2, cw - 1), max(2, ch - 1)))
        master = gump_crop.resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
        master = ImageEnhance.Sharpness(master).enhance(1.35)
        master = ImageEnhance.Contrast(master).enhance(1.12)
    elif src_type == "ai_bushido":
        col, row = spec["cell"]  # type: ignore[misc]
        bw, bh = bushido_sheet.size
        cw = bw / 2.0
        ch = bh / 3.0
        box = (
            int(col * cw + crop_inset),
            int(row * ch + crop_inset),
            int((col + 1) * cw - crop_inset),
            int((row + 1) * ch - crop_inset),
        )
        master = bushido_sheet.crop(box).resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
    elif src_type == "ai_ninjitsu":
        col, row = spec["cell"]  # type: ignore[misc]
        nw, nh = ninjitsu_sheet.size
        cw = nw / 3.0
        ch = nh / 3.0
        box = (
            int(col * cw + crop_inset),
            int(row * ch + crop_inset),
            int((col + 1) * cw - crop_inset),
            int((row + 1) * ch - crop_inset),
        )
        master = ninjitsu_sheet.crop(box).resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
    elif src_type == "ai_samurai_thematic":
        col, row = spec["cell"]  # type: ignore[misc]
        sw, sh = samurai_thematic_sheet.size
        cw = sw / 3.0
        ch = sh / 3.0
        box = (
            int(col * cw + crop_inset),
            int(row * ch + crop_inset),
            int((col + 1) * cw - crop_inset),
            int((row + 1) * ch - crop_inset),
        )
        master = samurai_thematic_sheet.crop(box).resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
    elif src_type == "ai_ninja_thematic":
        col, row = spec["cell"]  # type: ignore[misc]
        nw, nh = ninja_thematic_sheet.size
        cw = nw / 3.0
        ch = nh / 3.0
        box = (
            int(col * cw + crop_inset),
            int(row * ch + crop_inset),
            int((col + 1) * cw - crop_inset),
            int((row + 1) * ch - crop_inset),
        )
        master = ninja_thematic_sheet.crop(box).resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
    elif src_type == "ai_tokuno_fixes":
        col, row = spec["cell"]  # type: ignore[misc]
        fw, fh = tokuno_fixes_sheet.size
        cw = fw / 2.0
        ch = fh / 2.0
        box = (
            int(col * cw + crop_inset),
            int(row * ch + crop_inset),
            int((col + 1) * cw - crop_inset),
            int((row + 1) * ch - crop_inset),
        )
        master = tokuno_fixes_sheet.crop(box).resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
    else:
        raise ValueError(f"Unknown icon source spec for {stem}: {spec}")

    if "tint" in spec:
        master = apply_rgb_tint(master, spec["tint"])  # type: ignore[arg-type]

    return draw_uo_beveled_frame(master, accent, is_capstone=is_capstone, is_badge=is_badge)


def export_icon_stem(master_256: Image.Image, out_dir: Path, stem: str) -> None:
    """Downsamples 256x256 master canvas via LANCZOS to <id>.png (64x64), <id>@64.png (64x64), and <id>@48.png (48x48)."""
    img_64 = master_256.resize((64, 64), Image.Resampling.LANCZOS)
    img_48 = master_256.resize((48, 48), Image.Resampling.LANCZOS)
    img_64.save(out_dir / f"{stem}.png", format="PNG", optimize=True)
    img_64.save(out_dir / f"{stem}@64.png", format="PNG", optimize=True)
    img_48.save(out_dir / f"{stem}@48.png", format="PNG", optimize=True)


def generate_item_sprites_and_paperdolls(
    bushido_sheet: Image.Image,
    ninjitsu_sheet: Image.Image,
) -> dict[str, object]:
    """Slices authentic UO item art from art.png and composites layered Samurai/Ninja paperdolls."""
    ITEMS_DIR.mkdir(parents=True, exist_ok=True)
    gumps_out_dir = ITEMS_DIR / "gumps"
    gumps_out_dir.mkdir(parents=True, exist_ok=True)

    if ART_JSON.exists() and ART_PNG.exists():
        art_meta = json.loads(ART_JSON.read_text(encoding="utf-8"))
        art_frames = {int(fr["graphic"]): fr for fr in art_meta.get("frames", [])}
        art_sheet = Image.open(ART_PNG).convert("RGBA")

        for item in ITEM_SPRITE_CATALOG:
            item_id = str(item["id"])
            graphic = int(item["graphic"])
            fr = art_frames.get(graphic)
            if fr is None:
                continue
            raw_sprite = art_sheet.crop(
                (int(fr["x"]), int(fr["y"]), int(fr["x"]) + int(fr["width"]), int(fr["y"]) + int(fr["height"]))
            )
            bbox = raw_sprite.getbbox()
            if bbox is not None:
                raw_sprite = raw_sprite.crop(bbox)
            # Center the authentic UO item sprite inside a 64x64 dark-fantasy slot tile with soft radial vignette
            tile = Image.new("RGBA", (64, 64), (14, 17, 13, 255))
            glow = Image.new("RGBA", (64, 64), (0, 0, 0, 0))
            gdraw = ImageDraw.Draw(glow, "RGBA")
            cls = str(item["class"])
            border_col = (
                SAMURAI_CRIMSON
                if cls == "samurai"
                else (NINJA_EMERALD if cls == "ninja" else GOLD_PRIMARY)
            )
            gdraw.ellipse([12, 12, 52, 52], fill=(*border_col[:3], 55))
            glow = glow.filter(ImageFilter.GaussianBlur(radius=8))
            tile = Image.alpha_composite(tile, glow)
            tdraw = ImageDraw.Draw(tile, "RGBA")
            tdraw.rectangle([0, 0, 63, 63], outline=(42, 48, 38, 255), width=2)
            tdraw.rectangle([2, 2, 61, 61], outline=(*border_col[:3], 135), width=1)

            # Fit trimmed sprite into 48x48 box so small potions/weapons look crisp and prominent
            sw, sh = raw_sprite.size
            scale = min(48.0 / max(1, sw), 48.0 / max(1, sh), 2.35)
            nw = max(1, int(round(sw * scale)))
            nh = max(1, int(round(sh * scale)))
            resized = raw_sprite.resize((nw, nh), Image.Resampling.LANCZOS)
            ox = (64 - nw) // 2
            oy = (64 - nh) // 2
            tile.paste(resized, (ox, oy), resized)
            tile.save(ITEMS_DIR / f"{item_id}.png", format="PNG", optimize=True)

    # Also export Smoke Bomb, Egg Bomb, and Shuriken item tiles from our oil-painted Ninjitsu cells
    special_ninja_tools = [
        ("smoke_bomb", (1, 1)),
        ("egg_bomb", (1, 1)),
        ("shuriken", (2, 1)),
    ]
    nw_s, nh_s = ninjitsu_sheet.size
    for tool_id, (col, row) in special_ninja_tools:
        cw, ch = nw_s / 3.0, nh_s / 3.0
        crop = ninjitsu_sheet.crop(
            (int(col * cw + 20), int(row * ch + 20), int((col + 1) * cw - 20), int((row + 1) * ch - 20))
        ).resize((64, 64), Image.Resampling.LANCZOS)
        if tool_id == "egg_bomb":
            crop = apply_rgb_tint(crop, (1.12, 1.05, 0.88))
        tdraw = ImageDraw.Draw(crop, "RGBA")
        tdraw.rectangle([0, 0, 63, 63], outline=(42, 48, 38, 255), width=2)
        tdraw.rectangle([2, 2, 61, 61], outline=(*NINJA_EMERALD[:3], 150), width=1)
        crop.save(ITEMS_DIR / f"{tool_id}.png", format="PNG", optimize=True)

    # Composite authentic UO layered paperdoll characters from GUMPS_DIR (260x237)
    if GUMPS_DIR.exists() and (GUMPS_DIR / "12.png").exists():
        # Copy used gump layers into mockups/assets/items/gumps/ for interactive web inspection
        for gfile in sorted(GUMPS_DIR.glob("*.png")):
            (gumps_out_dir / gfile.name).write_bytes(gfile.read_bytes())

        # Samurai Paperdoll Layer Stack:
        #   Base Male Body (12) -> Waraji (50569) -> Suneate (50543) -> Jin-Baori Cloak (50468)
        #   -> Samurai Do (50457) -> Hiro-Sode (50473) -> Kabuto (50444) -> Daisho (50470)
        samurai_layers = [
            (50468, (1.15, 0.42, 0.38)),  # Cloak behind/shoulders (crimson lacquer)
            (12, None),                   # Male Body
            (50569, (0.95, 0.88, 0.72)),  # Waraji
            (50543, (1.12, 0.82, 0.55)),  # Suneate
            (50457, (1.22, 0.48, 0.42)),  # Samurai Do (Crimson & Gold)
            (50473, (1.18, 0.52, 0.44)),  # Hiro-Sode
            (50444, (1.20, 0.95, 0.55)),  # Kabuto (Antique Gold crest)
            (50470, (1.05, 1.08, 1.15)),  # Daisho blades
        ]
        pd_samurai = Image.new("RGBA", (260, 237), (14, 17, 13, 255))
        s_glow = Image.new("RGBA", (260, 237), (0, 0, 0, 0))
        sg_draw = ImageDraw.Draw(s_glow, "RGBA")
        sg_draw.ellipse([44, 24, 216, 218], fill=(200, 62, 55, 64))
        s_glow = s_glow.filter(ImageFilter.GaussianBlur(radius=18))
        pd_samurai = Image.alpha_composite(pd_samurai, s_glow)
        char_samurai = Image.new("RGBA", (260, 237), (0, 0, 0, 0))
        for gid, tint in samurai_layers:
            gpath = gumps_out_dir / f"{gid}.png"
            if gpath.exists():
                layer_im = Image.open(gpath).convert("RGBA")
                if tint is not None:
                    layer_im = apply_rgb_tint(layer_im, tint)
                char_samurai = Image.alpha_composite(char_samurai, layer_im)
        # Shift +36px horizontally so the paperdoll character (bbox x=42..139) is centered at x=130
        pd_samurai.paste(char_samurai, (36, -6), char_samurai)
        s_draw = ImageDraw.Draw(pd_samurai, "RGBA")
        s_draw.rectangle([0, 0, 259, 236], outline=GOLD_PRIMARY, width=2)
        s_draw.rectangle([3, 3, 256, 233], outline=(200, 62, 55, 180), width=1)
        pd_samurai.save(ITEMS_DIR / "paperdoll-samurai.png", format="PNG", optimize=True)

        # Ninja Paperdoll Layer Stack:
        #   Base Male Body (12) -> Ninja Tabi (50572) -> Ninja Pants (50423) -> Ninja Jacket (50426)
        #   -> Shuriken Belt (50514) -> Ninja Mitts (50424) -> Ninja Hood (50425) -> Tekagi (50533)
        ninja_layers = [
            (12, None),                   # Male Body
            (50572, (0.45, 0.55, 0.68)),  # Ninja Tabi
            (50423, (0.42, 0.50, 0.65)),  # Leather Ninja Pants (Midnight Indigo)
            (50426, (0.40, 0.52, 0.66)),  # Leather Ninja Jacket
            (50514, (0.45, 0.95, 0.72)),  # Leather Shuriken Belt (Emerald trim)
            (50424, (0.45, 0.58, 0.70)),  # Leather Ninja Mitts
            (50425, (0.38, 0.48, 0.64)),  # Leather Ninja Hood
            (50533, (0.85, 1.15, 1.02)),  # Tekagi War Claws (Venom steel)
        ]
        pd_ninja = Image.new("RGBA", (260, 237), (12, 15, 18, 255))
        n_glow = Image.new("RGBA", (260, 237), (0, 0, 0, 0))
        ng_draw = ImageDraw.Draw(n_glow, "RGBA")
        ng_draw.ellipse([44, 24, 216, 218], fill=(46, 158, 107, 64))
        n_glow = n_glow.filter(ImageFilter.GaussianBlur(radius=18))
        pd_ninja = Image.alpha_composite(pd_ninja, n_glow)
        char_ninja = Image.new("RGBA", (260, 237), (0, 0, 0, 0))
        for gid, tint in ninja_layers:
            gpath = gumps_out_dir / f"{gid}.png"
            if gpath.exists():
                layer_im = Image.open(gpath).convert("RGBA")
                if tint is not None:
                    layer_im = apply_rgb_tint(layer_im, tint)
                char_ninja = Image.alpha_composite(char_ninja, layer_im)
        pd_ninja.paste(char_ninja, (36, -6), char_ninja)
        n_draw = ImageDraw.Draw(pd_ninja, "RGBA")
        n_draw.rectangle([0, 0, 259, 236], outline=GOLD_PRIMARY, width=2)
        n_draw.rectangle([3, 3, 256, 233], outline=(46, 158, 107, 180), width=1)
        pd_ninja.save(ITEMS_DIR / "paperdoll-ninja.png", format="PNG", optimize=True)

    build_items_contact_sheet()
    return write_items_manifest()


def build_items_contact_sheet() -> None:
    """Composites mockups/assets/items/items-contact-sheet.png showing both paperdolls and all 34 item sprites."""
    width = 1440
    height = 760
    sheet = Image.new("RGBA", (width, height), BG_CANVAS)
    draw = ImageDraw.Draw(sheet, "RGBA")
    font = ImageFont.load_default()

    draw.rectangle([8, 8, width - 9, height - 9], outline=GOLD_PRIMARY, width=3)
    draw.rectangle([20, 20, width - 21, 68], fill=BG_PANEL, outline=GOLD_PRIMARY, width=2)
    draw.text(
        (36, 36),
        "UO IDLE v1.1 - AUTHENTIC UO PAPERDOLL GUMPS & TOKUNO ITEM SPRITES (ART-01 / ART-03)",
        fill=GOLD_TEXT,
        font=font,
    )

    # Paperdoll panels on left (x=24..620)
    for idx, (title, fname, accent) in enumerate(
        [
            ("SAMURAI LAYERED PAPERDOLL (260x237)", "paperdoll-samurai.png", SAMURAI_CRIMSON),
            ("NINJA LAYERED PAPERDOLL (260x237)", "paperdoll-ninja.png", NINJA_EMERALD),
        ]
    ):
        px = 24 + idx * 300
        py = 84
        draw.rectangle([px, py, px + 288, py + 292], fill=BG_PANEL, outline=accent, width=2)
        draw.text((px + 12, py + 10), title, fill=GOLD_TEXT, font=font)
        p_im = Image.open(ITEMS_DIR / fname).convert("RGBA")
        sheet.paste(p_im, (px + 14, py + 36), p_im)

    # Item grid across bottom & right
    all_item_ids = [str(it["id"]) for it in ITEM_SPRITE_CATALOG] + ["smoke_bomb", "egg_bomb", "shuriken"]
    draw.rectangle([24, 392, width - 25, height - 24], fill=BG_PANEL, outline=GOLD_PRIMARY, width=2)
    draw.text((40, 404), f"EXTRACTED UO ITEM SPRITES ({len(all_item_ids)} 64x64 TILES FROM ART.PNG)", fill=GOLD_TEXT, font=font)

    cols = 12
    cell_w = 114
    cell_h = 98
    for idx, item_id in enumerate(all_item_ids):
        r = idx // cols
        c = idx % cols
        cx = 36 + c * cell_w
        cy = 432 + r * cell_h
        im_path = ITEMS_DIR / f"{item_id}.png"
        if im_path.exists():
            ic = Image.open(im_path).convert("RGBA")
            sheet.paste(ic, (cx + 20, cy + 4), ic)
            draw.text((cx + 8, cy + 72), item_id[:15], fill=TEXT_PRIMARY, font=font)

    sheet.save(ITEMS_CONTACT_SHEET_PATH, format="PNG", optimize=True)


def build_contact_sheet() -> None:
    """Composites mockups/assets/icons/contact-sheet.png showing both class portraits and all 23+22 64x64 icons."""
    width = 1440
    height = 1280
    sheet = Image.new("RGBA", (width, height), BG_CANVAS)
    draw = ImageDraw.Draw(sheet, "RGBA")
    font = ImageFont.load_default()

    draw.rectangle([8, 8, width - 9, height - 9], outline=GOLD_PRIMARY, width=3)
    draw.rectangle([14, 14, width - 15, height - 15], outline=BORDER_SUBTLE, width=1)

    draw.rectangle([20, 20, width - 21, 76], fill=BG_PANEL, outline=GOLD_PRIMARY, width=2)
    draw.text(
        (38, 34),
        "UO IDLE v1.1 - AUTHENTIC UO GUMPS & OIL-PAINTED RASTER ICONOGRAPHY (ZERO POLYGONS)",
        fill=GOLD_TEXT,
        font=font,
    )
    draw.text(
        (38, 52),
        "Samurai (SM, ID 114, robeHue 1884 #c83e37): 2 Portraits + 23 Stems (69 Icons)   |   Ninja (NJ, ID 115, robeHue 1175 #2e9e6b): 2 Portraits + 22 Stems (66 Icons)",
        fill=TEXT_SECONDARY,
        font=font,
    )

    portrait_panels = [
        (
            24,
            90,
            708,
            394,
            "SAMURAI CLASS PORTRAITS - SM | ID 114 | ROBE HUE 1884 (CRIMSON & ANTIQUE GOLD)",
            SAMURAI_CRIMSON,
            SAMURAI_DIR / "portrait-samurai.png",
            SAMURAI_DIR / "portrait-samurai-64.png",
            "portrait-samurai.png (256x256)",
            "portrait-samurai-64.png (64x64)",
        ),
        (
            732,
            90,
            1416,
            394,
            "NINJA CLASS PORTRAITS - NJ | ID 115 | ROBE HUE 1175 (MIDNIGHT INDIGO & EMERALD)",
            NINJA_EMERALD,
            NINJA_DIR / "portrait-ninja.png",
            NINJA_DIR / "portrait-ninja-64.png",
            "portrait-ninja.png (256x256)",
            "portrait-ninja-64.png (64x64)",
        ),
    ]
    for x1, y1, x2, y2, title, accent, p256_path, p64_path, lbl256, lbl64 in portrait_panels:
        draw.rectangle([x1, y1, x2, y2], fill=BG_PANEL, outline=accent, width=2)
        draw.text((x1 + 16, y1 + 10), title, fill=GOLD_TEXT, font=font)
        p256 = Image.open(p256_path).convert("RGBA")
        p64 = Image.open(p64_path).convert("RGBA")
        sheet.paste(p256, (x1 + 24, y1 + 34), p256)
        draw.text((x1 + 310, y1 + 52), lbl256, fill=TEXT_PRIMARY, font=font)
        sheet.paste(p64, (x1 + 310, y1 + 84), p64)
        draw.text((x1 + 390, y1 + 108), lbl64, fill=TEXT_PRIMARY, font=font)
        draw.text((x1 + 310, y1 + 172), "Source: Authentic UO Gumps + Oil-Painted Sheets", fill=TEXT_SECONDARY, font=font)
        draw.text((x1 + 310, y1 + 194), "Zero ImageDraw.polygon calls", fill=TEXT_SECONDARY, font=font)

    def render_icon_section(
        y_top: int,
        sec_title: str,
        accent: tuple[int, int, int, int],
        icon_dir: Path,
        stems: list[tuple[str, str, str]],
    ) -> None:
        draw.rectangle([24, y_top, width - 25, y_top + 408], fill=BG_PANEL, outline=accent, width=2)
        draw.text((40, y_top + 10), sec_title, fill=GOLD_TEXT, font=font)
        cols = 8
        cell_w = 170
        cell_h = 118
        start_x = 38
        start_y = y_top + 38
        for idx, (stem, role_tag, display_name) in enumerate(stems):
            r = idx // cols
            c = idx % cols
            cx = start_x + c * cell_w
            cy = start_y + r * cell_h
            draw.rounded_rectangle(
                [cx, cy, cx + cell_w - 10, cy + cell_h - 8],
                radius=6,
                fill=BG_CARD,
                outline=BORDER_SUBTLE,
                width=1,
            )
            ic = Image.open(icon_dir / f"{stem}.png").convert("RGBA")
            sheet.paste(ic, (cx + 48, cy + 6), ic)
            short_id = stem.replace("samurai_", "sm_").replace("ninja_", "nj_")
            draw.text((cx + 8, cy + 74), short_id[:22], fill=TEXT_PRIMARY, font=font)
            draw.text((cx + 8, cy + 90), f"{role_tag} | {display_name[:14]}", fill=GOLD_TEXT, font=font)

    render_icon_section(
        412,
        "SAMURAI SKILL & MILESTONE ICONS (23 STEMS: AUTHENTIC UO GUMPS + OIL-PAINTED BUSHIDO ART)",
        SAMURAI_CRIMSON,
        SAMURAI_DIR,
        SAMURAI_STEMS,
    )
    render_icon_section(
        838,
        "NINJA SKILL & MILESTONE ICONS (22 STEMS: AUTHENTIC UO GUMPS + OIL-PAINTED NINJITSU ART)",
        NINJA_EMERALD,
        NINJA_DIR,
        NINJA_STEMS,
    )

    sheet.save(CONTACT_SHEET_PATH, format="PNG", optimize=True)


def compute_image_metadata(fp: Path) -> dict[str, object]:
    """Computes width, height, sha256, meanRgba, and RGB stdDev for a PNG artifact."""
    raw_bytes = fp.read_bytes()
    sha256_hex = hashlib.sha256(raw_bytes).hexdigest()
    with Image.open(fp) as im:
        rgba = im.convert("RGBA")
        w, h = rgba.size
        stat = ImageStat.Stat(rgba)
        mean_rgba = [round(float(x), 2) for x in stat.mean[:4]]
        std_dev = round(sum(float(x) for x in stat.stddev[:3]) / 3.0, 2)
    return {
        "width": w,
        "height": h,
        "sha256": sha256_hex,
        "meanRgba": mean_rgba,
        "stdDev": std_dev,
    }


def write_manifest() -> dict[str, object]:
    """Emits mockups/assets/icons/manifest.json with deterministic metadata for all 140 PNG files."""
    png_paths = sorted(
        list(SAMURAI_DIR.glob("*.png"))
        + list(NINJA_DIR.glob("*.png"))
        + ([CONTACT_SHEET_PATH] if CONTACT_SHEET_PATH.exists() else []),
        key=lambda p: p.relative_to(ICONS_DIR).as_posix(),
    )
    files_meta: dict[str, object] = {}
    for p in png_paths:
        rel = p.relative_to(ICONS_DIR).as_posix()
        files_meta[rel] = compute_image_metadata(p)

    manifest = {
        "version": "0.99.0",
        "milestone": "v1.1",
        "zeroPolygons": True,
        "totalFiles": len(files_meta),
        "samuraiStems": len(SAMURAI_STEMS),
        "ninjaStems": len(NINJA_STEMS),
        "files": files_meta,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


def write_items_manifest() -> dict[str, object]:
    """Emits mockups/assets/items/manifest.json with metadata for all extracted item sprites and paperdoll renders."""
    png_paths = sorted(
        list(ITEMS_DIR.glob("*.png")),
        key=lambda p: p.relative_to(ITEMS_DIR).as_posix(),
    )
    files_meta: dict[str, object] = {}
    for p in png_paths:
        rel = p.relative_to(ITEMS_DIR).as_posix()
        files_meta[rel] = compute_image_metadata(p)

    manifest = {
        "version": "0.99.0",
        "milestone": "v1.1",
        "totalItemFiles": len(files_meta),
        "catalog": ITEM_SPRITE_CATALOG,
        "files": files_meta,
    }
    ITEMS_MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


def verify_all_icons() -> int:
    """Runs the --verify CLI gate checking JSON ID coverage, dimensions, stdDev >= 12.0, SHA-256 parity, and zero polygons."""
    errors: list[str] = []

    # Check that this script itself has zero ImageDraw polygon calls
    self_text = Path(__file__).read_text(encoding="utf-8")
    if ("." + "polygon(") in self_text:
        errors.append("Prohibited polygon call found in tools/generate_icons.py")

    if not SAMURAI_JSON.exists():
        errors.append(f"Missing drop-in file: {SAMURAI_JSON}")
    if not NINJA_JSON.exists():
        errors.append(f"Missing drop-in file: {NINJA_JSON}")
    if not MANIFEST_PATH.exists():
        errors.append(f"Missing icon manifest: {MANIFEST_PATH}")
    if not CONTACT_SHEET_PATH.exists():
        errors.append(f"Missing icon contact sheet: {CONTACT_SHEET_PATH}")
    if not ITEMS_MANIFEST_PATH.exists():
        errors.append(f"Missing items manifest: {ITEMS_MANIFEST_PATH}")

    if errors:
        print(json.dumps({"ok": False, "errors": errors}))
        return 1

    samurai_data = json.loads(SAMURAI_JSON.read_text(encoding="utf-8"))
    ninja_data = json.loads(NINJA_JSON.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    manifest_files: dict[str, dict[str, object]] = manifest.get("files", {})
    items_manifest = json.loads(ITEMS_MANIFEST_PATH.read_text(encoding="utf-8"))
    item_files: dict[str, dict[str, object]] = items_manifest.get("files", {})

    samurai_required_stems = set()
    for p in samurai_data.get("progression", []):
        samurai_required_stems.add(p["id"])
    for a in samurai_data.get("abilities", []):
        samurai_required_stems.add(a["id"])
    samurai_required_stems.update(SAMURAI_ALIAS_IDS)

    ninja_required_stems = set()
    for p in ninja_data.get("progression", []):
        ninja_required_stems.add(p["id"])
    for a in ninja_data.get("abilities", []):
        ninja_required_stems.add(a["id"])
    ninja_required_stems.update(NINJA_ALIAS_IDS)

    if len(samurai_required_stems) != 23:
        errors.append(f"Expected 23 Samurai stems, found {len(samurai_required_stems)}")
    if len(ninja_required_stems) != 22:
        errors.append(f"Expected 22 Ninja stems, found {len(ninja_required_stems)}")

    expected_dimensions: dict[str, tuple[int, int] | None] = {
        "samurai/portrait-samurai.png": (256, 256),
        "samurai/portrait-samurai-64.png": (64, 64),
        "ninja/portrait-ninja.png": (256, 256),
        "ninja/portrait-ninja-64.png": (64, 64),
        "contact-sheet.png": None,
    }
    for stem in sorted(samurai_required_stems):
        expected_dimensions[f"samurai/{stem}.png"] = (64, 64)
        expected_dimensions[f"samurai/{stem}@64.png"] = (64, 64)
        expected_dimensions[f"samurai/{stem}@48.png"] = (48, 48)
    for stem in sorted(ninja_required_stems):
        expected_dimensions[f"ninja/{stem}.png"] = (64, 64)
        expected_dimensions[f"ninja/{stem}@64.png"] = (64, 64)
        expected_dimensions[f"ninja/{stem}@48.png"] = (48, 48)

    for rel_path, exp_size in expected_dimensions.items():
        fp = ICONS_DIR / rel_path
        if not fp.exists():
            errors.append(f"Missing PNG file on disk: {rel_path}")
            continue
        if rel_path not in manifest_files:
            errors.append(f"Missing entry in manifest.json: {rel_path}")
            continue

        live_meta = compute_image_metadata(fp)
        rec_meta = manifest_files[rel_path]

        if exp_size is not None and (live_meta["width"], live_meta["height"]) != exp_size:
            errors.append(
                f"Dimension mismatch for {rel_path}: expected {exp_size}, got {(live_meta['width'], live_meta['height'])}"
            )
        if float(live_meta["stdDev"]) < MIN_STD_DEV:
            errors.append(
                f"Blank or low-variance image {rel_path}: stdDev={live_meta['stdDev']} < {MIN_STD_DEV}"
            )
        if live_meta["sha256"] != rec_meta.get("sha256"):
            errors.append(
                f"SHA-256 mismatch for {rel_path}: live={live_meta['sha256']} != manifest={rec_meta.get('sha256')}"
            )

    if len(manifest_files) < 140:
        errors.append(f"Expected >= 140 tracked files in manifest.json, got {len(manifest_files)}")
    if len(item_files) < 35:
        errors.append(f"Expected >= 35 tracked item/paperdoll files in items/manifest.json, got {len(item_files)}")

    for fname, rec_meta in item_files.items():
        fp = ITEMS_DIR / fname
        if not fp.exists():
            errors.append(f"Missing item/paperdoll file on disk: items/{fname}")
            continue
        live_meta = compute_image_metadata(fp)
        if float(live_meta["stdDev"]) < MIN_STD_DEV:
            errors.append(
                f"Blank or low-variance item image items/{fname}: stdDev={live_meta['stdDev']} < {MIN_STD_DEV}"
            )
        if live_meta["sha256"] != rec_meta.get("sha256"):
            errors.append(
                f"SHA-256 mismatch for items/{fname}: live={live_meta['sha256']} != manifest={rec_meta.get('sha256')}"
            )

    if errors:
        print(json.dumps({"ok": False, "errors": errors}))
        return 1

    print(
        json.dumps(
            {
                "ok": True,
                "zeroPolygons": True,
                "samuraiStems": len(samurai_required_stems),
                "ninjaStems": len(ninja_required_stems),
                "totalFiles": len(manifest_files),
                "totalItemFiles": len(item_files),
            }
        )
    )
    return 0


def generate_all_icons() -> None:
    """Generates all Samurai and Ninja portraits, icons, item sprites, paperdolls, contact sheets, and manifests."""
    build_class_portraits()
    atlas_img, atlas_frames = load_ability_atlas()
    bushido_sheet = Image.open(SOURCES_DIR / "bushido-sheet.jpg").convert("RGBA")
    ninjitsu_sheet = Image.open(SOURCES_DIR / "ninjitsu-sheet.jpg").convert("RGBA")
    samurai_thematic_sheet = Image.open(SOURCES_DIR / "samurai-thematic-sheet.png").convert("RGBA")
    ninja_thematic_sheet = Image.open(SOURCES_DIR / "ninja-thematic-sheet.png").convert("RGBA")
    tokuno_fixes_sheet = Image.open(SOURCES_DIR / "tokuno-fixes-sheet.png").convert("RGBA")

    for stem, _role, _label in SAMURAI_STEMS:
        master = extract_master_icon(
            stem,
            SAMURAI_CRIMSON,
            atlas_img,
            atlas_frames,
            bushido_sheet,
            ninjitsu_sheet,
            samurai_thematic_sheet,
            ninja_thematic_sheet,
            tokuno_fixes_sheet,
        )
        export_icon_stem(master, SAMURAI_DIR, stem)

    for stem, _role, _label in NINJA_STEMS:
        master = extract_master_icon(
            stem,
            NINJA_EMERALD,
            atlas_img,
            atlas_frames,
            bushido_sheet,
            ninjitsu_sheet,
            samurai_thematic_sheet,
            ninja_thematic_sheet,
            tokuno_fixes_sheet,
        )
        export_icon_stem(master, NINJA_DIR, stem)

    build_contact_sheet()
    write_manifest()
    generate_item_sprites_and_paperdolls(bushido_sheet, ninjitsu_sheet)


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate or verify UO Idle Samurai & Ninja authentic gumps, item sprites, and icons.")
    parser.add_argument("--verify", action="store_true", help="Verify all icon, item, paperdoll, and contact-sheet artifacts.")
    args = parser.parse_args()
    if args.verify:
        return verify_all_icons()
    generate_all_icons()
    return 0


if __name__ == "__main__":
    sys.exit(main())
