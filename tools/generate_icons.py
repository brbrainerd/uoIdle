#!/usr/bin/env python3
"""
Deterministic Dark-Fantasy Ultima Online / UO Idle Icon & Portrait Generator (VISUAL-01).

Synthesizes and post-processes:
  - Samurai (robeHue: 1884, #c83e37 crimson-lacquer & #d4af37 antique gold) class portraits
    at 256x256 (portrait-samurai.png) and 64x64 (portrait-samurai-64.png)
  - Ninja (robeHue: 1175, #1e2436 midnight-indigo & #2e9e6b shadow-emerald) class portraits
    at 256x256 (portrait-ninja.png) and 64x64 (portrait-ninja-64.png)
  - All 23 Samurai skill & milestone icon stems (12 canonical samurai.json IDs + 11 06-CONTEXT.md
    alias/passive badge IDs) at <id>.png (64x64), <id>@64.png (64x64), and <id>@48.png (48x48)
  - All 22 Ninja skill & milestone icon stems (13 canonical ninja.json IDs + 9 06-CONTEXT.md
    alias/passive badge IDs) at <id>.png (64x64), <id>@64.png (64x64), and <id>@48.png (48x48)
  - Visual contact sheet (mockups/assets/icons/contact-sheet.png)
  - SHA-256 & pixel-variance provenance manifest (mockups/assets/icons/manifest.json)
  - CLI verification gate (python3 tools/generate_icons.py --verify)
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import sys
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter, ImageFont, ImageStat

ROOT_DIR = Path(__file__).resolve().parent.parent
ICONS_DIR = ROOT_DIR / "mockups" / "assets" / "icons"
SAMURAI_DIR = ICONS_DIR / "samurai"
NINJA_DIR = ICONS_DIR / "ninja"
CONTACT_SHEET_PATH = ICONS_DIR / "contact-sheet.png"
MANIFEST_PATH = ICONS_DIR / "manifest.json"

SAMURAI_JSON = ROOT_DIR / "design" / "drop-in" / "samurai.json"
NINJA_JSON = ROOT_DIR / "design" / "drop-in" / "ninja.json"

AI_PORTRAIT_SAMURAI = Path(
    "/Users/brbrainerd/.gemini/antigravity/brain/2086db53-463a-4907-9d06-57f5fa8496e9/portrait_samurai_base_1794037728508.jpg"
)
AI_PORTRAIT_NINJA = Path(
    "/Users/brbrainerd/.gemini/antigravity/brain/2086db53-463a-4907-9d06-57f5fa8496e9/portrait_ninja_base_1794037736954.jpg"
)

CANVAS_SIZE = 256
MIN_STD_DEV = 12.0

# Color Tokens (from 06-UI-SPEC.md)
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
STEEL_LIGHT = (226, 232, 240, 255)     # #e2e8f0
STEEL_MID = (148, 163, 184, 255)       # #94a3b8
STEEL_DARK = (51, 65, 85, 255)         # #334155
OUTLINE_DARK = (6, 7, 6, 255)          # #060706

SAMURAI_CRIMSON = (200, 62, 55, 255)   # #c83e37 (robeHue 1884)
SAMURAI_GLOW = (255, 107, 74, 255)     # #ff6b4a
LIGHTNING_CYAN = (186, 230, 253, 255)  # #bae6fd

NINJA_EMERALD = (46, 158, 107, 255)    # #2e9e6b (robeHue 1175)
NINJA_GLOW = (104, 211, 145, 255)      # #68d391
NINJA_INDIGO = (30, 36, 54, 255)       # #1e2436
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
    ("samurai_lightning_r2", "L50 Skill II", "Lightning Strike II"),
    ("samurai_honorable_r2", "L60 Capstone", "Honorable Exec II"),
    # 11 06-CONTEXT.md Alias & Passive Badge IDs
    ("samurai_lightning_strike", "Alias L5", "Lightning Strike"),
    ("samurai_honorable_exec", "Alias L15", "Honorable Exec"),
    ("samurai_counter_attack", "Alias L25", "Counter Attack"),
    ("samurai_whirlwind_attack", "Bushido AoE", "Whirlwind Attack"),
    ("samurai_bladeweave", "Mastery", "Bladeweave"),
    ("samurai_crushing_blow", "Weapon", "Crushing Blow"),
    ("samurai_honorable_exec_r2", "Alias L60 II", "Honorable Exec II"),
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
    ("ninja_mirror_r2", "L50 Spell II", "Mirror Image II"),
    ("ninja_death_r2", "L60 Capstone", "Death Strike II"),
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


def create_radial_background(
    size: int,
    center_rgb: tuple[int, int, int],
    edge_rgb: tuple[int, int, int] = (11, 13, 10),
    glow_rgb: tuple[int, int, int] | None = None,
    seed_angle: float = 0.0,
) -> Image.Image:
    """Renders Layer 1 (Obsidian Void Background) + Layer 2 (Volumetric Class Rim & Center Glow)."""
    base = Image.new("RGBA", (size, size), (*edge_rgb, 255))
    grad = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    gdraw = ImageDraw.Draw(grad)
    cx, cy = size // 2, size // 2
    max_r = int(size * 0.62)
    for r in range(max_r, 0, -4):
        t = 1.0 - (r / max_r)
        cr = int(edge_rgb[0] + (center_rgb[0] - edge_rgb[0]) * (t ** 1.3))
        cg = int(edge_rgb[1] + (center_rgb[1] - edge_rgb[1]) * (t ** 1.3))
        cb = int(edge_rgb[2] + (center_rgb[2] - edge_rgb[2]) * (t ** 1.3))
        gdraw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(cr, cg, cb, 255))
    base = Image.alpha_composite(base, grad)

    glow_layer = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    ldraw = ImageDraw.Draw(glow_layer)
    accent = glow_rgb or center_rgb
    for i in range(12):
        ang = seed_angle + (i * math.pi / 6.0)
        r_in = 22
        r_out = 98 + (i % 3) * 14
        x1 = cx + math.cos(ang - 0.08) * r_out
        y1 = cy + math.sin(ang - 0.08) * r_out
        x2 = cx + math.cos(ang + 0.08) * r_out
        y2 = cy + math.sin(ang + 0.08) * r_out
        ldraw.polygon(
            [(cx + math.cos(ang) * r_in, cy + math.sin(ang) * r_in), (x1, y1), (x2, y2)],
            fill=(*accent[:3], 42 if i % 2 == 0 else 24),
        )
    ldraw.ellipse([cx - 72, cy - 72, cx + 72, cy + 72], fill=(*accent[:3], 68))
    ldraw.ellipse([cx - 42, cy - 42, cx + 42, cy + 42], fill=(*accent[:3], 95))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(radius=14))
    return Image.alpha_composite(base, glow_layer)


def draw_uo_beveled_frame(
    img: Image.Image,
    accent_rgba: tuple[int, int, int, int],
    is_rank2: bool = False,
    is_badge: bool = False,
) -> Image.Image:
    """Applies Layer 4: Authentic dark-fantasy Ultima Online beveled antique-gold & class-hue gump border."""
    out = img.copy()
    draw = ImageDraw.Draw(out, "RGBA")
    n = out.width

    draw.rectangle([0, 0, n - 1, n - 1], outline=BG_CANVAS, width=4)

    gold_top = GOLD_BRIGHT if (is_rank2 or is_badge) else GOLD_PRIMARY
    gold_bot = GOLD_SHADOW
    draw.rectangle([4, 4, n - 5, n - 5], outline=gold_top, width=8)
    draw.polygon(
        [(n - 12, 12), (n - 5, 5), (n - 5, n - 5), (5, n - 5), (12, n - 12), (n - 12, n - 12)],
        fill=gold_bot,
    )
    draw.line([(6, n - 10), (6, 6), (n - 10, 6)], fill=SPECULAR_CREAM, width=2)

    draw.rectangle([12, 12, n - 13, n - 13], outline=BG_PANEL, width=3)

    rim_color = GOLD_BRIGHT if is_rank2 else accent_rgba
    draw.rectangle([15, 15, n - 16, n - 16], outline=(*rim_color[:3], 225), width=4)
    draw.rectangle([19, 19, n - 20, n - 20], outline=(10, 12, 10, 220), width=2)

    corners = [(14, 14), (n - 15, 14), (14, n - 15), (n - 15, n - 15)]
    for cx, cy in corners:
        draw.polygon(
            [(cx, cy - 9), (cx + 9, cy), (cx, cy + 9), (cx - 9, cy)],
            fill=gold_top,
            outline=OUTLINE_DARK,
        )
        draw.ellipse([cx - 3, cy - 3, cx + 3, cy + 3], fill=SPECULAR_CREAM)

    if is_rank2:
        bx1, by1, bx2, by2 = n - 74, 18, n - 18, 66
        draw.rounded_rectangle(
            [bx1, by1, bx2, by2],
            radius=8,
            fill=(24, 18, 12, 245),
            outline=GOLD_BRIGHT,
            width=3,
        )
        for bar_x in (bx1 + 17, bx2 - 17):
            draw.rectangle([bar_x - 3, by1 + 11, bar_x + 3, by2 - 11], fill=SPECULAR_CREAM)
        draw.rectangle([bx1 + 10, by1 + 9, bx2 - 10, by1 + 13], fill=GOLD_BRIGHT)
        draw.rectangle([bx1 + 10, by2 - 13, bx2 - 10, by2 - 9], fill=GOLD_BRIGHT)

    return out


def draw_katana_blade(
    draw: ImageDraw.ImageDraw,
    p1: tuple[float, float],
    p2: tuple[float, float],
    width: float = 16.0,
    curve: float = 14.0,
    glow_rgba: tuple[int, int, int, int] | None = None,
) -> None:
    """Draws a curved high-contrast steel katana blade with blood-groove, tsuba guard, and hilt."""
    x1, y1 = p1
    x2, y2 = p2
    dx, dy = x2 - x1, y2 - y1
    length = math.hypot(dx, dy) or 1.0
    ux, uy = dx / length, dy / length
    nx, ny = -uy, ux

    mx = (x1 + x2) * 0.5 + nx * curve
    my = (y1 + y2) * 0.5 + ny * curve

    tx = x1 + ux * (length * 0.24)
    ty = y1 + uy * (length * 0.24)

    if glow_rgba:
        draw.line([p1, (mx, my), p2], fill=glow_rgba, width=int(width * 2.2))

    hx1, hy1 = tx - ux * (length * 0.24), ty - uy * (length * 0.24)
    hilt_poly = [
        (hx1 + nx * (width * 0.48), hy1 + ny * (width * 0.48)),
        (tx + nx * (width * 0.52), ty + ny * (width * 0.52)),
        (tx - nx * (width * 0.52), ty - ny * (width * 0.52)),
        (hx1 - nx * (width * 0.48), hy1 - ny * (width * 0.48)),
    ]
    draw.polygon(hilt_poly, fill=(45, 22, 22, 255), outline=OUTLINE_DARK)
    for step in range(1, 4):
        sx = hx1 + (tx - hx1) * (step / 4.0)
        sy = hy1 + (ty - hy1) * (step / 4.0)
        draw.polygon([(sx, sy - 5), (sx + 5, sy), (sx, sy + 5), (sx - 5, sy)], fill=GOLD_PRIMARY)

    blade_poly = [
        (tx + nx * (width * 0.55), ty + ny * (width * 0.55)),
        (mx + nx * (width * 0.65), my + ny * (width * 0.65)),
        (x2, y2),
        (mx - nx * (width * 0.42), my - ny * (width * 0.42)),
        (tx - nx * (width * 0.55), ty - ny * (width * 0.55)),
    ]
    draw.polygon(blade_poly, fill=STEEL_LIGHT, outline=OUTLINE_DARK)
    spine_poly = [
        (tx - nx * (width * 0.55), ty - ny * (width * 0.55)),
        (mx - nx * (width * 0.42), my - ny * (width * 0.42)),
        (x2, y2),
        (mx + nx * (width * 0.05), my + ny * (width * 0.05)),
        (tx + nx * (width * 0.05), ty + ny * (width * 0.05)),
    ]
    draw.polygon(spine_poly, fill=STEEL_MID)
    draw.line(
        [(tx + nx * (width * 0.4), ty + ny * (width * 0.4)), (mx + nx * (width * 0.5), my + ny * (width * 0.5)), (x2, y2)],
        fill=SPECULAR_CREAM,
        width=3,
    )

    tsuba_poly = [
        (tx + nx * (width * 1.45) - ux * 6, ty + ny * (width * 1.45) - uy * 6),
        (tx + nx * (width * 1.45) + ux * 6, ty + ny * (width * 1.45) + uy * 6),
        (tx - nx * (width * 1.45) + ux * 6, ty - ny * (width * 1.45) + uy * 6),
        (tx - nx * (width * 1.45) - ux * 6, ty - ny * (width * 1.45) - uy * 6),
    ]
    draw.polygon(tsuba_poly, fill=GOLD_BRIGHT, outline=OUTLINE_DARK)


def draw_samurai_motif(stem: str) -> Image.Image:
    """Renders distinct high-contrast Layer 1-4 artwork for each of the 23 Samurai icon stems."""
    is_r2 = stem.endswith("_r2")
    is_badge = stem in {
        "samurai_bushido_initiate",
        "samurai_inner_calm",
        "samurai_way_of_the_blade",
        "samurai_bushido_master",
    }
    seed = (sum(ord(c) * (i + 1) for i, c in enumerate(stem)) % 360) * math.pi / 180.0
    glow_col = (229, 193, 88) if (is_r2 or is_badge) else (200, 62, 55)
    canvas = create_radial_background(CANVAS_SIZE, (56, 20, 20), (11, 13, 10), glow_col, seed)

    layer = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, "RGBA")
    cx, cy = 128, 128

    if stem in {"samurai_way", "samurai_way_of_the_blade"}:
        r_mon = 76 if stem == "samurai_way" else 84
        d.ellipse([cx - r_mon, cy - r_mon, cx + r_mon, cy + r_mon], fill=(140, 28, 28, 220), outline=GOLD_BRIGHT, width=5)
        d.ellipse([cx - 52, cy - 52, cx + 52, cy + 52], outline=GOLD_PRIMARY, width=3)
        for i in range(8):
            ang = i * math.pi / 4.0 + (0.2 if stem != "samurai_way" else 0.0)
            px = cx + math.cos(ang) * 64
            py = cy + math.sin(ang) * 64
            d.polygon(
                [(cx, cy), (px - math.sin(ang) * 10, py + math.cos(ang) * 10), (px + math.sin(ang) * 10, py - math.cos(ang) * 10)],
                fill=GOLD_PRIMARY,
            )
        draw_katana_blade(d, (46, 206), (210, 44), width=16, curve=-10)
        draw_katana_blade(d, (206, 206), (48, 44), width=14, curve=10)
        if stem == "samurai_way_of_the_blade":
            d.polygon([(cx, 32), (cx + 18, 60), (cx, 88), (cx - 18, 60)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)

    elif stem in {"samurai_lightning", "samurai_lightning_strike", "samurai_lightning_r2"}:
        bolt_col = GOLD_BRIGHT if is_r2 else LIGHTNING_CYAN
        d.polygon([(36, 214), (108, 118), (94, 108), (168, 38), (222, 34), (144, 124), (164, 134), (72, 222)], fill=(*bolt_col[:3], 95))
        draw_katana_blade(d, (44, 210), (214, 40), width=18 if is_r2 else 16, curve=-12, glow_rgba=(125, 211, 252, 120))
        zig = [(204, 34), (148, 92), (174, 98), (108, 156), (132, 162), (56, 224)]
        d.line(zig, fill=GOLD_BRIGHT, width=10)
        d.line(zig, fill=SPECULAR_CREAM, width=4)
        if stem != "samurai_lightning":
            zig2 = [(62, 52), (114, 108), (96, 124), (158, 186), (202, 212)]
            d.line(zig2, fill=LIGHTNING_CYAN, width=8 if is_r2 else 5)
            d.line(zig2, fill=SPECULAR_CREAM, width=3)

    elif stem in {"samurai_perfection", "samurai_bushido_initiate"}:
        for ring_r, col in [(82, SAMURAI_CRIMSON), (64, GOLD_PRIMARY), (44, (40, 18, 18, 255))]:
            d.ellipse([cx - ring_r, cy - ring_r, cx + ring_r, cy + ring_r], fill=col, outline=OUTLINE_DARK, width=4)
        for i in range(8):
            ang = i * math.pi / 4.0
            x_tip = cx + math.cos(ang) * 94
            y_tip = cy + math.sin(ang) * 94
            x_l = cx + math.cos(ang - 0.22) * 54
            y_l = cy + math.sin(ang - 0.22) * 54
            x_r = cx + math.cos(ang + 0.22) * 54
            y_r = cy + math.sin(ang + 0.22) * 54
            d.polygon([(x_l, y_l), (x_tip, y_tip), (x_r, y_r)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        for idx, y_off in enumerate([146, 118, 90]):
            w_ch = 36 - idx * 4
            d.polygon(
                [(cx - w_ch, y_off + 18), (cx, y_off - 8), (cx + w_ch, y_off + 18), (cx + w_ch - 10, y_off + 26), (cx, y_off + 4), (cx - w_ch + 10, y_off + 26)],
                fill=SPECULAR_CREAM if idx == 2 else GOLD_BRIGHT,
                outline=OUTLINE_DARK,
            )
        if stem == "samurai_bushido_initiate":
            d.rounded_rectangle([54, 174, 202, 208], radius=8, fill=(180, 145, 95, 255), outline=OUTLINE_DARK, width=3)
            d.line([(68, 191), (188, 191)], fill=SAMURAI_CRIMSON, width=5)

    elif stem in {"samurai_honorable", "samurai_honorable_exec", "samurai_honorable_r2", "samurai_honorable_exec_r2"}:
        if is_r2:
            d.ellipse([cx - 88, cy - 88, cx + 88, cy + 88], outline=GOLD_BRIGHT, width=6)
            for i in range(12):
                a = i * math.pi / 6.0
                d.line([(cx + math.cos(a) * 76, cy + math.sin(a) * 76), (cx + math.cos(a) * 98, cy + math.sin(a) * 98)], fill=GOLD_BRIGHT, width=4)
        left_helm = [(52, 186), (44, 134), (78, 96), (114, 96), (110, 186)]
        right_helm = [(146, 98), (182, 98), (212, 138), (202, 188), (142, 188)]
        d.polygon(left_helm, fill=GOLD_PRIMARY, outline=OUTLINE_DARK)
        d.polygon(right_helm, fill=GOLD_PRIMARY, outline=OUTLINE_DARK)
        d.polygon([(74, 102), (38, 54), (62, 48), (98, 96)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        d.polygon([(182, 102), (218, 54), (194, 48), (158, 96)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        d.polygon([(112, 28), (144, 28), (136, 228), (120, 228)], fill=SAMURAI_CRIMSON)
        d.polygon([(122, 30), (134, 30), (128, 226)], fill=SPECULAR_CREAM)
        draw_katana_blade(d, (128, 26), (128, 224), width=20 if is_r2 else 16, curve=0, glow_rgba=(255, 80, 60, 150))

    elif stem in {"samurai_confidence", "samurai_inner_calm"}:
        for angle_deg in (-50, -25, 0, 25, 50):
            rad = math.radians(angle_deg - 90)
            px = cx + math.cos(rad) * 78
            py = cy + 36 + math.sin(rad) * 78
            d.polygon([(cx - 28, 188), (px, py), (cx + 28, 188)], fill=(46, 158, 107, 170), outline=GOLD_BRIGHT)
        d.polygon([(56, 146), (72, 186), (184, 186), (200, 146)], fill=SAMURAI_CRIMSON, outline=OUTLINE_DARK)
        d.pieslice([68, 72, 188, 176], start=180, end=360, fill=(60, 22, 22, 255), outline=GOLD_BRIGHT, width=4)
        d.polygon([(86, 124), (170, 124), (156, 174), (128, 186), (100, 174)], fill=GOLD_PRIMARY, outline=OUTLINE_DARK)
        d.polygon([(128, 96), (76, 42), (96, 38), (128, 78), (160, 38), (180, 42)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        for mx, my, mr in [(54, 78, 12), (202, 78, 12), (128, 44, 14), (66, 188, 10), (190, 188, 10)]:
            d.rectangle([mx - mr, my - 4, mx + mr, my + 4], fill=(104, 211, 145, 255), outline=OUTLINE_DARK)
            d.rectangle([mx - 4, my - mr, mx + 4, my + mr], fill=SPECULAR_CREAM, outline=OUTLINE_DARK)

    elif stem in {"samurai_counter", "samurai_counter_attack"}:
        d.pieslice([34, 34, 222, 222], start=200, end=350, fill=SAMURAI_CRIMSON, outline=GOLD_BRIGHT, width=4)
        d.pieslice([56, 56, 200, 200], start=195, end=355, fill=(38, 16, 16, 255))
        draw_katana_blade(d, (42, 62), (154, 154), width=14, curve=6)
        draw_katana_blade(d, (54, 206), (206, 54), width=18, curve=-10, glow_rgba=(255, 107, 74, 140))
        for i in range(10):
            ang = i * math.pi / 5.0
            r_len = 52 if i % 2 == 0 else 26
            d.polygon(
                [
                    (cx, cy),
                    (cx + math.cos(ang - 0.14) * 18, cy + math.sin(ang - 0.14) * 18),
                    (cx + math.cos(ang) * r_len, cy + math.sin(ang) * r_len),
                    (cx + math.cos(ang + 0.14) * 18, cy + math.sin(ang + 0.14) * 18),
                ],
                fill=SPECULAR_CREAM if i % 2 == 0 else GOLD_BRIGHT,
            )

    elif stem == "samurai_double_strike":
        for offset in (-22, 22):
            d.line([(42, 196 + offset), (196, 42 + offset)], fill=SAMURAI_GLOW, width=14)
            d.line([(42, 196 + offset), (196, 42 + offset)], fill=SPECULAR_CREAM, width=5)
        draw_katana_blade(d, (38, 184), (204, 36), width=15, curve=-10)
        draw_katana_blade(d, (56, 218), (218, 68), width=15, curve=10)
        d.arc([36, 36, 220, 220], start=110, end=260, fill=GOLD_BRIGHT, width=7)
        d.arc([36, 36, 220, 220], start=290, end=80, fill=SAMURAI_CRIMSON, width=7)

    elif stem == "samurai_evasion":
        for idx, x_shift in enumerate([-32, 0, 32]):
            alpha = 90 + idx * 80
            col = (186, 230, 253, alpha) if idx < 2 else SPECULAR_CREAM
            d.polygon(
                [(88 + x_shift, 44), (154 + x_shift, 86), (138 + x_shift, 208), (74 + x_shift, 176)],
                fill=(200, 62, 55, alpha // 2),
                outline=col,
                width=4,
            )
        draw_katana_blade(d, (92, 212), (186, 42), width=16, curve=-16, glow_rgba=(186, 230, 253, 140))
        for by in (74, 128, 178):
            d.line([(28, by), (112, by - 10), (74, by - 46)], fill=LIGHTNING_CYAN, width=6)
            d.ellipse([104, by - 18, 120, by - 2], fill=SPECULAR_CREAM)

    elif stem in {"samurai_momentum_strike", "samurai_whirlwind_attack"}:
        d.ellipse([34, 34, 222, 222], outline=SAMURAI_CRIMSON, width=18)
        d.arc([42, 42, 214, 214], start=20, end=310, fill=GOLD_BRIGHT, width=10)
        d.arc([58, 58, 198, 198], start=60, end=340, fill=SPECULAR_CREAM, width=6)
        if stem == "samurai_momentum_strike":
            for tx, ty in [(78, 92), (178, 164)]:
                d.polygon([(tx, ty - 28), (tx + 28, ty), (tx, ty + 28), (tx - 28, ty)], fill=SAMURAI_CRIMSON, outline=GOLD_BRIGHT, width=4)
                d.ellipse([tx - 10, ty - 10, tx + 10, ty + 10], fill=SPECULAR_CREAM)
            draw_katana_blade(d, (46, 192), (210, 64), width=16, curve=-18)
        else:
            for i in range(4):
                ang = i * math.pi / 2.0 + 0.4
                x1 = cx + math.cos(ang) * 20
                y1 = cy + math.sin(ang) * 20
                x2 = cx + math.cos(ang + 0.9) * 96
                y2 = cy + math.sin(ang + 0.9) * 96
                draw_katana_blade(d, (x1, y1), (x2, y2), width=13, curve=12)
            d.ellipse([cx - 24, cy - 24, cx + 24, cy + 24], fill=GOLD_BRIGHT, outline=OUTLINE_DARK, width=4)

    elif stem == "samurai_armor_ignore":
        d.polygon([(52, 62), (118, 54), (110, 196), (62, 182), (44, 124)], fill=STEEL_MID, outline=OUTLINE_DARK, width=4)
        d.polygon([(138, 54), (204, 62), (212, 124), (194, 182), (146, 196)], fill=STEEL_DARK, outline=OUTLINE_DARK, width=4)
        for fy in (86, 128, 168):
            d.line([(82, fy - 14), (128, fy), (174, fy + 14)], fill=SAMURAI_GLOW, width=6)
        draw_katana_blade(d, (36, 164), (222, 88), width=18, curve=0, glow_rgba=(255, 107, 74, 150))
        d.ellipse([114, 114, 142, 142], fill=SPECULAR_CREAM, outline=SAMURAI_CRIMSON, width=4)

    elif stem == "samurai_bladeweave":
        for i in range(3):
            y_off = 68 + i * 54
            d.arc([34, y_off - 40, 222, y_off + 40], start=0, end=180, fill=SAMURAI_CRIMSON if i % 2 == 0 else GOLD_BRIGHT, width=10)
            d.arc([34, y_off - 40, 222, y_off + 40], start=180, end=360, fill=LIGHTNING_CYAN, width=8)
        draw_katana_blade(d, (54, 206), (202, 48), width=16, curve=-12)
        draw_katana_blade(d, (202, 206), (54, 48), width=16, curve=12)

    elif stem == "samurai_crushing_blow":
        d.ellipse([38, 148, 218, 214], fill=(120, 32, 28, 210), outline=GOLD_BRIGHT, width=5)
        d.ellipse([68, 162, 188, 202], fill=GOLD_BRIGHT)
        draw_katana_blade(d, (128, 24), (128, 188), width=24, curve=4, glow_rgba=(255, 140, 60, 170))
        for sx, sy in [(56, 128), (74, 92), (198, 128), (182, 92)]:
            d.polygon([(sx, sy - 14), (sx + 14, sy + 8), (sx - 12, sy + 12)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)

    elif stem == "samurai_bushido_master":
        d.ellipse([38, 38, 218, 218], fill=SAMURAI_CRIMSON, outline=GOLD_BRIGHT, width=6)
        d.polygon([(128, 36), (208, 94), (178, 198), (78, 198), (48, 94)], fill=(48, 16, 16, 255), outline=GOLD_BRIGHT, width=4)
        d.polygon([(128, 52), (62, 34), (88, 108), (128, 88), (168, 108), (194, 34)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        d.polygon([(82, 112), (174, 112), (162, 186), (128, 204), (94, 186)], fill=GOLD_PRIMARY, outline=OUTLINE_DARK)
        d.ellipse([102, 132, 120, 146], fill=SPECULAR_CREAM)
        d.ellipse([136, 132, 154, 146], fill=SPECULAR_CREAM)

    shadow = layer.split()[3].point(lambda a: min(255, int(a * 0.85)))
    shadow_img = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    shadow_img.paste((0, 0, 0, 220), (4, 6), mask=shadow)
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=5))

    merged = Image.alpha_composite(canvas, shadow_img)
    merged = Image.alpha_composite(merged, layer)
    return draw_uo_beveled_frame(merged, SAMURAI_CRIMSON, is_rank2=is_r2, is_badge=is_badge)


def draw_ninja_motif(stem: str) -> Image.Image:
    """Renders distinct high-contrast Layer 1-4 artwork for each of the 22 Ninja icon stems."""
    is_r2 = stem.endswith("_r2")
    is_badge = stem in {
        "ninja_way_of_stealth",
        "ninja_shadow_discipline",
        "ninja_lethal_toxins",
        "ninja_master_assassin",
    }
    seed = (sum(ord(c) * (i + 3) for i, c in enumerate(stem)) % 360) * math.pi / 180.0
    glow_col = (229, 193, 88) if is_r2 else (46, 158, 107)
    canvas = create_radial_background(CANVAS_SIZE, (16, 44, 36), (11, 13, 10), glow_col, seed)

    layer = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    d = ImageDraw.Draw(layer, "RGBA")
    cx, cy = 128, 128

    if stem in {"ninja_shadowjump", "ninja_way_of_stealth"}:
        d.ellipse([44, 36, 212, 220], fill=(30, 24, 58, 230), outline=NINJA_EMERALD, width=5)
        d.arc([34, 28, 222, 224], start=35, end=245, fill=NINJA_GLOW, width=8)
        d.pieslice([116, 40, 204, 128], start=210, end=120, fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        d.polygon([(128, 62), (174, 116), (162, 198), (94, 198), (82, 116)], fill=NINJA_INDIGO, outline=NINJA_GLOW, width=3)
        d.polygon([(104, 112), (122, 118), (108, 124)], fill=SPECULAR_CREAM)
        d.polygon([(152, 112), (134, 118), (148, 124)], fill=SPECULAR_CREAM)

    elif stem in {"ninja_focus", "ninja_focus_attack"}:
        for r_ring, col in [(82, NINJA_EMERALD), (56, NINJA_GLOW), (28, SPECULAR_CREAM)]:
            d.ellipse([cx - r_ring, cy - r_ring, cx + r_ring, cy + r_ring], outline=col, width=5)
        d.line([(28, cy), (228, cy)], fill=NINJA_GLOW, width=4)
        d.line([(cx, 28), (cx, 228)], fill=NINJA_GLOW, width=4)
        kryss_pts = [(40, 216), (76, 162), (68, 142), (108, 108), (102, 92), (186, 42), (142, 120), (156, 134), (114, 168), (92, 182)]
        d.polygon(kryss_pts, fill=STEEL_LIGHT, outline=OUTLINE_DARK, width=4)
        d.ellipse([cx - 16, cy - 16, cx + 16, cy + 16], fill=SPECULAR_CREAM, outline=NINJA_EMERALD, width=4)

    elif stem in {"ninja_mirror", "ninja_mirror_image", "ninja_mirror_r2"}:
        offsets = [(-44, 14), (44, 14), (0, -14)] if is_r2 else [(-30, 10), (26, -10)]
        for idx, (ox, oy) in enumerate(offsets):
            is_front = idx == len(offsets) - 1
            fill_c = NINJA_INDIGO if is_front else (34, 88, 74, 185)
            rim_c = GOLD_BRIGHT if (is_front and is_r2) else NINJA_GLOW
            mx, my = cx + ox, cy + oy
            d.polygon(
                [(mx, my - 58), (mx + 46, my - 14), (mx + 36, my + 56), (mx, my + 70), (mx - 36, my + 56), (mx - 46, my - 14)],
                fill=fill_c,
                outline=rim_c,
                width=4,
            )
            d.polygon([(mx - 24, my - 6), (mx - 6, my), (mx - 20, my + 8)], fill=SPECULAR_CREAM if is_front else NINJA_GLOW)
            d.polygon([(mx + 24, my - 6), (mx + 6, my), (mx + 20, my + 8)], fill=SPECULAR_CREAM if is_front else NINJA_GLOW)

    elif stem in {"ninja_backstab", "ninja_shadow_strike"}:
        for i in range(6):
            ang = i * math.pi / 3.0 + 0.3
            d.arc([38, 38, 218, 218], start=int(math.degrees(ang)), end=int(math.degrees(ang) + 45), fill=NINJA_VIOLET, width=10)
        d.polygon([(128, 34), (148, 106), (220, 128), (148, 150), (128, 222), (108, 150), (36, 128), (108, 106)], fill=SAMURAI_CRIMSON, outline=NINJA_GLOW, width=3)
        draw_katana_blade(d, (48, 48), (204, 204), width=18, curve=18, glow_rgba=(104, 211, 145, 150))

    elif stem in {"ninja_death", "ninja_death_r2"}:
        pts = []
        for i in range(5):
            ang = -math.pi / 2.0 + i * (2.0 * math.pi / 5.0)
            pts.append((cx + math.cos(ang) * 76, cy + math.sin(ang) * 76))
        d.polygon(pts, fill=(42, 14, 24, 210), outline=SAMURAI_CRIMSON if is_r2 else NINJA_EMERALD, width=5)
        for i in range(5):
            d.line([pts[i], pts[(i + 2) % 5]], fill=GOLD_BRIGHT if is_r2 else NINJA_GLOW, width=3)
        d.ellipse([cx - 34, cy - 38, cx + 34, cy + 22], fill=STEEL_LIGHT, outline=OUTLINE_DARK, width=4)
        d.rectangle([cx - 20, cy + 10, cx + 20, cy + 38], fill=STEEL_LIGHT, outline=OUTLINE_DARK, width=4)
        d.ellipse([cx - 20, cy - 16, cx - 6, cy - 2], fill=SAMURAI_CRIMSON if is_r2 else NINJA_EMERALD)
        d.ellipse([cx + 6, cy - 16, cx + 20, cy - 2], fill=SAMURAI_CRIMSON if is_r2 else NINJA_EMERALD)
        for px, py in pts:
            d.ellipse([px - 14, py - 14, px + 14, py + 14], fill=GOLD_BRIGHT if is_r2 else NINJA_GLOW, outline=OUTLINE_DARK, width=3)

    elif stem in {"ninja_animal_form", "ninja_shadow_discipline"}:
        d.pieslice([28, 36, 228, 224], start=130, end=240, fill=NINJA_EMERALD, outline=NINJA_GLOW, width=4)
        d.pieslice([28, 36, 228, 224], start=300, end=50, fill=NINJA_EMERALD, outline=NINJA_GLOW, width=4)
        head = [(128, 48), (168, 36), (182, 96), (206, 134), (166, 184), (128, 212), (90, 184), (50, 134), (74, 96), (88, 36)]
        d.polygon(head, fill=NINJA_INDIGO, outline=GOLD_BRIGHT, width=4)
        d.polygon([(88, 122), (116, 134), (96, 144)], fill=SPECULAR_CREAM)
        d.polygon([(168, 122), (140, 134), (160, 144)], fill=SPECULAR_CREAM)
        d.polygon([(128, 76), (142, 98), (128, 120), (114, 98)], fill=NINJA_GLOW, outline=OUTLINE_DARK)

    elif stem in {"ninja_infectious_strike", "ninja_lethal_toxins"}:
        draw_katana_blade(d, (46, 198), (204, 42), width=17, curve=16, glow_rgba=(46, 158, 107, 170))
        for vx, vy, vr in [(96, 168, 16), (144, 138, 20), (182, 104, 15), (124, 196, 14)]:
            d.polygon([(vx, vy - vr * 1.4), (vx + vr, vy + 4), (vx, vy + vr), (vx - vr, vy + 4)], fill=NINJA_GLOW, outline=OUTLINE_DARK, width=3)
            d.ellipse([vx - 5, vy - 2, vx + 3, vy + 6], fill=SPECULAR_CREAM)
        if stem == "ninja_lethal_toxins":
            d.ellipse([54, 118, 134, 198], fill=(22, 98, 64, 240), outline=GOLD_BRIGHT, width=4)
            d.rectangle([82, 92, 106, 124], fill=GOLD_PRIMARY, outline=OUTLINE_DARK, width=3)

    elif stem == "ninja_smoke_bomb":
        for sx, sy, sr, col in [
            (78, 88, 44, (139, 92, 246, 190)),
            (172, 84, 48, (46, 158, 107, 200)),
            (128, 64, 52, (104, 211, 145, 210)),
            (66, 142, 38, (46, 158, 107, 190)),
            (188, 142, 38, (139, 92, 246, 190)),
        ]:
            d.ellipse([sx - sr, sy - sr, sx + sr, sy + sr], fill=col, outline=OUTLINE_DARK, width=3)
        d.ellipse([76, 104, 180, 214], fill=(214, 202, 178, 255), outline=OUTLINE_DARK, width=5)
        crack = [(84, 152), (114, 136), (128, 164), (152, 138), (174, 158)]
        d.line(crack, fill=NINJA_EMERALD, width=10)
        d.line(crack, fill=SPECULAR_CREAM, width=4)

    elif stem == "ninja_shuriken":
        star_pts = []
        for i in range(8):
            ang = i * math.pi / 4.0 + 0.15
            r = 86 if i % 2 == 0 else 28
            star_pts.append((cx + math.cos(ang) * r, cy + math.sin(ang) * r))
        d.polygon(star_pts, fill=STEEL_LIGHT, outline=OUTLINE_DARK, width=4)
        d.ellipse([cx - 18, cy - 18, cx + 18, cy + 18], fill=BG_CANVAS, outline=GOLD_BRIGHT, width=4)
        d.line([(36, 204), (214, 44)], fill=GOLD_BRIGHT, width=6)
        d.polygon([(214, 44), (184, 56), (198, 72)], fill=NINJA_GLOW, outline=OUTLINE_DARK)

    elif stem in {"ninja_ki_attack", "ninja_double_strike"}:
        for x_off in (56, 96, 136):
            d.arc([x_off - 40, 48, x_off + 60, 208], start=290, end=70, fill=GOLD_BRIGHT, width=6)
        for c_off in (-28, 0, 28):
            d.polygon(
                [
                    (46, 168 + c_off),
                    (148, 86 + c_off),
                    (214, 48 + c_off),
                    (162, 108 + c_off),
                    (62, 186 + c_off),
                ],
                fill=STEEL_LIGHT if c_off == 0 else NINJA_GLOW,
                outline=OUTLINE_DARK,
                width=3,
            )

    elif stem == "ninja_surprise_attack":
        d.polygon([(78, 64), (178, 64), (190, 138), (128, 206), (66, 138)], fill=GOLD_PRIMARY, outline=OUTLINE_DARK, width=4)
        d.line([(128, 56), (114, 128), (144, 152), (128, 212)], fill=BG_CANVAS, width=10)
        draw_katana_blade(d, (46, 204), (174, 58), width=15, curve=-14)
        d.polygon([(164, 54), (222, 88), (196, 112), (150, 74)], fill=STEEL_LIGHT, outline=OUTLINE_DARK, width=4)
        draw_katana_blade(d, (210, 204), (82, 58), width=15, curve=14)
        d.polygon([(92, 54), (34, 88), (60, 112), (106, 74)], fill=STEEL_LIGHT, outline=OUTLINE_DARK, width=4)

    elif stem == "ninja_armor_ignore":
        d.polygon([(58, 68), (198, 68), (182, 194), (74, 194)], fill=STEEL_DARK, outline=GOLD_PRIMARY, width=4)
        d.polygon([(128, 26), (140, 188), (116, 188)], fill=STEEL_LIGHT, outline=OUTLINE_DARK, width=4)
        d.arc([78, 88, 178, 176], start=180, end=360, fill=GOLD_BRIGHT, width=10)
        d.rectangle([118, 176, 138, 224], fill=NINJA_EMERALD, outline=OUTLINE_DARK, width=3)

    elif stem == "ninja_master_assassin":
        d.ellipse([38, 38, 218, 218], fill=NINJA_INDIGO, outline=GOLD_BRIGHT, width=6)
        d.polygon([(70, 78), (186, 78), (172, 188), (128, 212), (84, 188)], fill=(20, 26, 38, 255), outline=NINJA_GLOW, width=4)
        d.polygon([(82, 84), (48, 34), (106, 68)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        d.polygon([(174, 84), (208, 34), (150, 68)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        d.polygon([(88, 118), (118, 128), (96, 140)], fill=NINJA_GLOW)
        d.polygon([(168, 118), (138, 128), (160, 140)], fill=NINJA_GLOW)
        for fx in (102, 120, 136, 154):
            d.polygon([(fx - 6, 166), (fx + 6, 166), (fx, 186)], fill=SPECULAR_CREAM, outline=OUTLINE_DARK)

    shadow = layer.split()[3].point(lambda a: min(255, int(a * 0.85)))
    shadow_img = Image.new("RGBA", (CANVAS_SIZE, CANVAS_SIZE), (0, 0, 0, 0))
    shadow_img.paste((0, 0, 0, 220), (4, 6), mask=shadow)
    shadow_img = shadow_img.filter(ImageFilter.GaussianBlur(radius=5))

    merged = Image.alpha_composite(canvas, shadow_img)
    merged = Image.alpha_composite(merged, layer)
    return draw_uo_beveled_frame(merged, NINJA_EMERALD, is_rank2=is_r2, is_badge=is_badge)


def synthesize_procedural_portrait(is_samurai: bool) -> Image.Image:
    """Deterministic Pillow fallback portrait synthesizer if external AI base image is absent."""
    center = (58, 18, 18) if is_samurai else (16, 44, 36)
    glow = (200, 62, 55) if is_samurai else (46, 158, 107)
    img = create_radial_background(CANVAS_SIZE, center, (11, 13, 10), glow, 0.4)
    d = ImageDraw.Draw(img, "RGBA")
    if is_samurai:
        d.polygon([(28, 240), (54, 156), (128, 138), (202, 156), (228, 240)], fill=SAMURAI_CRIMSON, outline=GOLD_BRIGHT, width=4)
        d.pieslice([64, 54, 192, 166], start=180, end=360, fill=(44, 16, 16, 255), outline=GOLD_BRIGHT, width=4)
        d.polygon([(128, 86), (56, 28), (82, 24), (128, 68), (174, 24), (200, 28)], fill=GOLD_BRIGHT, outline=OUTLINE_DARK)
        d.polygon([(84, 106), (172, 106), (158, 162), (128, 176), (98, 162)], fill=STEEL_DARK, outline=GOLD_PRIMARY, width=3)
        draw_katana_blade(d, (42, 224), (218, 42), width=18, curve=-10, glow_rgba=(186, 230, 253, 140))
    else:
        d.polygon([(28, 240), (58, 152), (128, 136), (198, 152), (228, 240)], fill=NINJA_INDIGO, outline=NINJA_GLOW, width=4)
        d.polygon([(128, 44), (184, 96), (172, 174), (84, 174), (72, 96)], fill=NINJA_INDIGO, outline=NINJA_EMERALD, width=4)
        d.polygon([(94, 108), (120, 116), (102, 126)], fill=NINJA_GLOW)
        d.polygon([(162, 108), (136, 116), (154, 126)], fill=NINJA_GLOW)
        draw_katana_blade(d, (48, 220), (206, 62), width=16, curve=16, glow_rgba=(46, 158, 107, 150))
    return img


def build_class_portraits() -> None:
    """Loads or synthesizes Samurai & Ninja portraits and writes 256x256 and 64x64 framed PNGs."""
    SAMURAI_DIR.mkdir(parents=True, exist_ok=True)
    NINJA_DIR.mkdir(parents=True, exist_ok=True)

    configs = [
        (True, AI_PORTRAIT_SAMURAI, SAMURAI_DIR / "portrait-samurai.png", SAMURAI_DIR / "portrait-samurai-64.png", SAMURAI_CRIMSON),
        (False, AI_PORTRAIT_NINJA, NINJA_DIR / "portrait-ninja.png", NINJA_DIR / "portrait-ninja-64.png", NINJA_EMERALD),
    ]

    for is_samurai, ai_src, out_256, out_64, accent in configs:
        if ai_src.exists():
            raw = Image.open(ai_src).convert("RGBA")
            raw_256 = raw.resize((CANVAS_SIZE, CANVAS_SIZE), Image.Resampling.LANCZOS)
            framed_256 = draw_uo_beveled_frame(raw_256, accent, is_rank2=False, is_badge=True)
            framed_256.save(out_256, format="PNG", optimize=True)
            framed_64 = framed_256.resize((64, 64), Image.Resampling.LANCZOS)
            framed_64.save(out_64, format="PNG", optimize=True)
        elif out_256.exists() and out_64.exists():
            # Preserve committed AI portrait artifacts byte-for-byte when running in environments without the temp cache
            continue
        else:
            raw_256 = synthesize_procedural_portrait(is_samurai)
            framed_256 = draw_uo_beveled_frame(raw_256, accent, is_rank2=False, is_badge=True)
            framed_256.save(out_256, format="PNG", optimize=True)
            framed_64 = framed_256.resize((64, 64), Image.Resampling.LANCZOS)
            framed_64.save(out_64, format="PNG", optimize=True)


def export_icon_stem(master_256: Image.Image, out_dir: Path, stem: str) -> None:
    """Downsamples 256x256 master canvas via LANCZOS to <id>.png (64x64), <id>@64.png (64x64), and <id>@48.png (48x48)."""
    img_64 = master_256.resize((64, 64), Image.Resampling.LANCZOS)
    img_48 = master_256.resize((48, 48), Image.Resampling.LANCZOS)
    img_64.save(out_dir / f"{stem}.png", format="PNG", optimize=True)
    img_64.save(out_dir / f"{stem}@64.png", format="PNG", optimize=True)
    img_48.save(out_dir / f"{stem}@48.png", format="PNG", optimize=True)


def build_contact_sheet() -> None:
    """Composites mockups/assets/icons/contact-sheet.png showing both class portraits and all 23+22 64x64 icons."""
    width = 1440
    height = 1280
    sheet = Image.new("RGBA", (width, height), BG_CANVAS)
    draw = ImageDraw.Draw(sheet, "RGBA")
    font = ImageFont.load_default()

    # Outer antique-gold window frame
    draw.rectangle([8, 8, width - 9, height - 9], outline=GOLD_PRIMARY, width=3)
    draw.rectangle([14, 14, width - 15, height - 15], outline=BORDER_SUBTLE, width=1)

    # Header banner
    draw.rectangle([20, 20, width - 21, 76], fill=BG_PANEL, outline=GOLD_PRIMARY, width=2)
    draw.text(
        (38, 34),
        "UO IDLE v0.99.0 - CUSTOM DARK-FANTASY ICONOGRAPHY CONTACT SHEET (VISUAL-01)",
        fill=GOLD_TEXT,
        font=font,
    )
    draw.text(
        (38, 52),
        "Samurai (SM, ID 114, robeHue 1884 #c83e37): 2 Portraits + 23 Stems (69 Icons)   |   Ninja (NJ, ID 115, robeHue 1175 #2e9e6b): 2 Portraits + 22 Stems (66 Icons)",
        fill=TEXT_SECONDARY,
        font=font,
    )

    # Portraits Panel (Top row y=90..396)
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
        draw.text((x1 + 310, y1 + 172), "Frame: Beveled Antique Gold (#c9a227)", fill=TEXT_SECONDARY, font=font)
        draw.text((x1 + 310, y1 + 194), "Downsampling: 256 -> 64/48 LANCZOS", fill=TEXT_SECONDARY, font=font)

    # Helper to render an 8-column skill icon grid section
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
        "SAMURAI SKILL & MILESTONE ICONS (23 STEMS x 3 RESOLUTIONS: <id>.png 64x64, <id>@64.png 64x64, <id>@48.png 48x48)",
        SAMURAI_CRIMSON,
        SAMURAI_DIR,
        SAMURAI_STEMS,
    )
    render_icon_section(
        838,
        "NINJA SKILL & MILESTONE ICONS (22 STEMS x 3 RESOLUTIONS: <id>.png 64x64, <id>@64.png 64x64, <id>@48.png 48x48)",
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
        "totalFiles": len(files_meta),
        "samuraiStems": len(SAMURAI_STEMS),
        "ninjaStems": len(NINJA_STEMS),
        "files": files_meta,
    }
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    return manifest


def verify_all_icons() -> int:
    """Runs the --verify CLI gate checking JSON ID coverage, dimensions, stdDev >= 12.0, and SHA-256 parity."""
    errors: list[str] = []

    if not SAMURAI_JSON.exists():
        errors.append(f"Missing drop-in file: {SAMURAI_JSON}")
    if not NINJA_JSON.exists():
        errors.append(f"Missing drop-in file: {NINJA_JSON}")
    if not MANIFEST_PATH.exists():
        errors.append(f"Missing icon manifest: {MANIFEST_PATH}")
    if not CONTACT_SHEET_PATH.exists():
        errors.append(f"Missing icon contact sheet: {CONTACT_SHEET_PATH}")

    if errors:
        print(json.dumps({"ok": False, "errors": errors}))
        return 1

    samurai_data = json.loads(SAMURAI_JSON.read_text(encoding="utf-8"))
    ninja_data = json.loads(NINJA_JSON.read_text(encoding="utf-8"))
    manifest = json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))
    manifest_files: dict[str, dict[str, object]] = manifest.get("files", {})

    # Extract canonical IDs from samurai.json and ninja.json and union with 06-CONTEXT.md alias/badge IDs
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

    if errors:
        print(json.dumps({"ok": False, "errors": errors}))
        return 1

    print(
        json.dumps(
            {
                "ok": True,
                "samuraiStems": len(samurai_required_stems),
                "ninjaStems": len(ninja_required_stems),
                "totalFiles": len(manifest_files),
            }
        )
    )
    return 0


def generate_all_icons() -> None:
    """Generates all Samurai (71 files) and Ninja (68 files) portraits and icons, contact-sheet.png, and manifest.json."""
    build_class_portraits()
    for stem, _role, _label in SAMURAI_STEMS:
        master = draw_samurai_motif(stem)
        export_icon_stem(master, SAMURAI_DIR, stem)
    for stem, _role, _label in NINJA_STEMS:
        master = draw_ninja_motif(stem)
        export_icon_stem(master, NINJA_DIR, stem)
    build_contact_sheet()
    write_manifest()


def main() -> int:
    parser = argparse.ArgumentParser(description="Generate or verify UO Idle Samurai & Ninja dark-fantasy icons.")
    parser.add_argument("--verify", action="store_true", help="Verify all 140 icon/portrait/contact-sheet artifacts.")
    args = parser.parse_args()
    if args.verify:
        return verify_all_icons()
    generate_all_icons()
    return 0


if __name__ == "__main__":
    sys.exit(main())
