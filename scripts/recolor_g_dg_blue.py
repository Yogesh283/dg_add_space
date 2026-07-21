"""Clean logo: orange accents + blue G/DG only. No spill onto AD SPACE."""
from PIL import Image
import numpy as np
import os
from collections import deque

BASE = r"c:\xampp\htdocs\DGapsapce\public\img"
BLUE = np.array([26, 163, 255, 255], dtype=np.uint8)
ORANGE = (255, 92, 26)


def is_electric_blue(r, g, b, a):
    if a < 20:
        return False
    if r > 180 and g > 180 and abs(r - g) < 40 and b > 180:
        return False
    if r > b and r > g:
        return False
    return b > 70 and b >= r + 15 and b >= g - 10


def to_orange(r, g, b, a):
    brightness = max(r, g, b) / 255.0
    tint = g / 255.0
    factor = 0.35 + 0.65 * brightness
    if brightness > 0.85:
        factor = min(1.0, factor + 0.08)
    or_, og, ob = ORANGE
    return (
        int(min(255, or_ * factor)),
        int(min(255, og * factor * (0.85 + 0.15 * tint))),
        int(min(255, ob * factor)),
        a,
    )


def dilate(mask, radius, h, w):
    out = np.zeros((h, w), dtype=bool)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return out
    for dy in range(-radius, radius + 1):
        for dx in range(-radius, radius + 1):
            if dx * dx + dy * dy > radius * radius:
                continue
            ny, nx = ys + dy, xs + dx
            v = (ny >= 0) & (ny < h) & (nx >= 0) & (nx < w)
            out[ny[v], nx[v]] = True
    return out


def flood(blocked):
    h, w = blocked.shape
    reach = np.zeros((h, w), dtype=bool)
    q = deque()

    def push(y, x):
        if 0 <= y < h and 0 <= x < w and not blocked[y, x] and not reach[y, x]:
            reach[y, x] = True
            q.append((y, x))

    for x in range(w):
        push(0, x)
        push(h - 1, x)
    for y in range(h):
        push(y, 0)
        push(y, w - 1)
    while q:
        y, x = q.popleft()
        push(y + 1, x)
        push(y - 1, x)
        push(y, x + 1)
        push(y, x - 1)
    return reach


def orange_pass(arr):
    h, w = arr.shape[:2]
    for y in range(h):
        for x in range(w):
            r, g, b, a = map(int, arr[y, x])
            if is_electric_blue(r, g, b, a):
                arr[y, x] = to_orange(r, g, b, a)
    return arr


def fill_zone_blue(arr, zone, stroke_extra=None, radius=12):
    """Fill letter interiors inside zone with blue; never touch orange."""
    h, w = arr.shape[:2]
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    a = arr[:, :, 3].astype(np.int16)
    mx = np.maximum(np.maximum(r, g), b)
    orange = (a > 40) & (r > 140) & (r > g + 25) & (r > b + 35)

    silver = (
        (a > 40)
        & (mx >= 100)
        & (np.abs(r - g) < 50)
        & (np.abs(g - b) < 55)
        & ~orange
        & zone
    )
    dark = (a > 40) & (mx <= 100) & ~orange & zone
    stroke = silver | dark
    if stroke_extra is not None:
        stroke = stroke | (stroke_extra & zone)

    body = dilate(stroke, radius, h, w) & zone & ~orange
    bg = flood(body | orange)
    fill = body & ~bg & ~orange & ((a < 50) | (mx <= 110))
    arr[fill] = BLUE
    # restore silver outlines for crispness
    outline = silver
    # keep original outline colors from current pre-fill — already overwritten if in fill
    # re-paint silver as light edge: optional skip
    return int(fill.sum())


def build_main():
    bak = np.array(Image.open(os.path.join(BASE, "logo-blue-backup.png")).convert("RGBA"))
    arr = orange_pass(bak.copy())
    h, w = arr.shape[:2]
    xx = np.arange(w)[None, :]
    yy = np.arange(h)[:, None]

    # Find orange AD SPACE left edge to clip DG zone
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    a = arr[:, :, 3].astype(np.int16)
    orange = (a > 40) & (r > 140) & (r > g + 25) & (r > b + 35)
    title = orange & (yy > int(h * 0.15)) & (yy < int(h * 0.55))
    if title.any():
        ox = np.where(title.any(axis=0))[0]
        # AD SPACE starts after DG — take leftmost of large orange text block on right
        # split: icon orange is left, text orange is right
        mid = int(w * 0.40)
        right = ox[ox > mid]
        ad_left = int(right.min()) if len(right) else int(w * 0.55)
    else:
        ad_left = int(w * 0.55)

    icon_zone = (xx < int(w * 0.36)) & (yy > int(h * 0.05)) & (yy < int(h * 0.92))
    dg_zone = (xx > int(w * 0.30)) & (xx < ad_left - 8) & (yy > int(h * 0.12)) & (yy < int(h * 0.58))

    n1 = fill_zone_blue(arr, icon_zone, radius=14)
    n2 = fill_zone_blue(arr, dg_zone, radius=14)
    print(f"logo.png icon_blue={n1} dg_blue={n2} ad_left={ad_left}")

    # verify orange still strong
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    a = arr[:, :, 3].astype(np.int16)
    orange_n = int(((a > 40) & (r > 140) & (r > g + 25) & (r > b + 35)).sum())
    blue_n = int(((a > 40) & (b > 150) & (b > r + 40)).sum())
    print(f"  totals orange={orange_n} blue={blue_n}")
    Image.fromarray(arr, "RGBA").save(os.path.join(BASE, "logo.png"))


def build_transparent():
    bak = os.path.join(BASE, "logo-transparent-blue-backup.png")
    arr = orange_pass(np.array(Image.open(bak).convert("RGBA")))
    h, w = arr.shape[:2]
    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    a = arr[:, :, 3].astype(np.int16)
    mx = np.maximum(np.maximum(r, g), b)
    orange = (a > 40) & (r > 140) & (r > g + 25) & (r > b + 35)
    white = (a > 200) & (mx >= 200) & (np.abs(r - g) < 30)

    # Fully opaque near-black only
    dark = (a >= 250) & (mx <= 40) & ~orange & ~white
    xx = np.arange(w)[None, :]
    yy = np.arange(h)[:, None]

    # locate orange AD in title
    title_orange = orange & (yy > int(h * 0.30)) & (yy < int(h * 0.65))
    if title_orange.any():
        ox = np.where(title_orange.any(axis=0))[0]
        ad_left, ad_right = int(ox.min()), int(ox.max())
    else:
        ad_left, ad_right = int(w * 0.48), int(w * 0.58)

    # G in icon + lower arc of icon (black ring part) — user asked G
    icon = xx < ad_left - 10
    # DG only (left of AD), not SPACE (right of AD)
    dg = (xx >= ad_left - int(w * 0.20)) & (xx < ad_left - 2)
    # also include black SPACE? user said dg only — skip SPACE
    target = dark & (icon | dg)
    print("transparent target", int(target.sum()), "ad", ad_left, ad_right)
    arr[target] = BLUE
    Image.fromarray(arr, "RGBA").save(os.path.join(BASE, "logo-transparent.png"))


if __name__ == "__main__":
    build_main()
    build_transparent()
    # cleanup debug
    for f in ("_g_crop.png", "_t_crop.png", "_tmp.png", "_debug_dg_crop.png", "logo-source.png"):
        p = os.path.join(BASE, f)
        if os.path.exists(p):
            os.remove(p)
    print("done")
