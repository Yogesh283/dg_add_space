from PIL import Image
import numpy as np
import os
from collections import deque

BASE = r"c:\xampp\htdocs\DGapsapce\public\img"
ORANGE = (255, 92, 26)
BLUE = (26, 163, 255, 255)


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


def dilate(mask: np.ndarray, radius: int) -> np.ndarray:
    h, w = mask.shape
    out = np.zeros_like(mask, dtype=bool)
    ys, xs = np.where(mask)
    if len(xs) == 0:
        return out
    rr = radius
    for dy in range(-rr, rr + 1):
        for dx in range(-rr, rr + 1):
            if dx * dx + dy * dy > rr * rr:
                continue
            ny = ys + dy
            nx = xs + dx
            valid = (ny >= 0) & (ny < h) & (nx >= 0) & (nx < w)
            out[ny[valid], nx[valid]] = True
    return out


def morph_close(mask: np.ndarray, radius: int) -> np.ndarray:
    return ~dilate(~dilate(mask, radius), radius)


def flood_from_border(blocked: np.ndarray) -> np.ndarray:
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


def build(src_path: str, out_path: str, close_r: int, tagline_ratio: float):
    src = Image.open(src_path).convert("RGBA")
    arr = np.array(src)
    h, w = arr.shape[:2]
    tagline_y = int(h * tagline_ratio)

    # Keep original silver outline colors for restore
    outline_backup = arr.copy()

    # blue -> orange
    for y in range(h):
        for x in range(w):
            r, g, b, a = map(int, arr[y, x])
            if is_electric_blue(r, g, b, a):
                arr[y, x] = to_orange(r, g, b, a)

    r = arr[:, :, 0].astype(np.int16)
    g = arr[:, :, 1].astype(np.int16)
    b = arr[:, :, 2].astype(np.int16)
    a = arr[:, :, 3].astype(np.int16)
    orange = (a > 40) & (r > 140) & (r > g + 25) & (r > b + 35)
    mx = np.maximum(np.maximum(r, g), b)

    silver = (
        (a > 40)
        & (mx >= 100)
        & (np.abs(r - g) < 50)
        & (np.abs(g - b) < 55)
        & ~orange
    )
    yy = np.arange(h)[:, None]
    silver = silver & (yy < tagline_y)

    # Solid letter bodies from sealed outlines
    sealed = morph_close(silver, close_r)
    bg = flood_from_border(sealed)
    letters = sealed & ~bg & ~orange & (yy < tagline_y)

    # Paint FULL letter body solid blue (no holes)
    arr[letters] = BLUE

    # Restore crisp silver/white outlines on top
    arr[silver] = outline_backup[silver]

    Image.fromarray(arr, "RGBA").save(out_path)
    print(out_path, "solid blue letters:", int(letters.sum()))


def main():
    build(
        os.path.join(BASE, "logo-blue-backup.png"),
        os.path.join(BASE, "logo.png"),
        close_r=26,
        tagline_ratio=0.60,
    )
    t = os.path.join(BASE, "logo-transparent-blue-backup.png")
    if os.path.exists(t):
        build(t, os.path.join(BASE, "logo-transparent.png"), close_r=20, tagline_ratio=0.70)
    print("done")


if __name__ == "__main__":
    main()
