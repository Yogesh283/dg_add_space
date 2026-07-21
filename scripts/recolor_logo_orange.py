from PIL import Image
import os
import shutil

ORANGE = (255, 92, 26)  # #ff5c1a
BASE = r"c:\xampp\htdocs\DGapsapce\public\img"


def backup(name: str) -> str:
    src = os.path.join(BASE, name)
    bak = os.path.join(BASE, name.replace(".png", "-blue-backup.png"))
    if os.path.exists(src) and not os.path.exists(bak):
        shutil.copy2(src, bak)
        print("backed up", name)
    return bak if os.path.exists(bak) else src


def is_blueish(r: int, g: int, b: int, a: int) -> bool:
    if a < 20:
        return False
    if b > 70 and b >= r + 15 and b >= g - 10:
        # keep silver/white outlines
        if r > 180 and g > 180 and abs(r - g) < 40 and b > 180:
            return False
        # keep existing warm/orange
        if r > b and r > g:
            return False
        return True
    return False


def map_blue_to_orange(r: int, g: int, b: int, a: int) -> tuple[int, int, int, int]:
    brightness = max(r, g, b) / 255.0
    tint = g / 255.0
    factor = 0.35 + 0.65 * brightness
    if brightness > 0.85:
        factor = min(1.0, factor + 0.08)
    or_, og, ob = ORANGE
    nr = int(min(255, or_ * factor))
    ng = int(min(255, og * factor * (0.85 + 0.15 * tint)))
    nb = int(min(255, ob * factor))
    return (nr, ng, nb, a)


def recolor(path_in: str, path_out: str) -> None:
    im = Image.open(path_in).convert("RGBA")
    px = im.load()
    w, h = im.size
    changed = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_blueish(r, g, b, a):
                px[x, y] = map_blue_to_orange(r, g, b, a)
                changed += 1
    im.save(path_out, "PNG")
    print(path_out, "changed", changed, "of", w * h)


def main() -> None:
    logo_src = backup("logo.png")
    recolor(logo_src, os.path.join(BASE, "logo.png"))

    transparent = os.path.join(BASE, "logo-transparent.png")
    if os.path.exists(transparent):
        t_src = backup("logo-transparent.png")
        recolor(t_src, transparent)

    print("done")


if __name__ == "__main__":
    main()
