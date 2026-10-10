from __future__ import annotations

import math
import random
import subprocess
import tempfile
from pathlib import Path

from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "video"
PALM = ROOT / "public" / "assets" / "photos" / "palmeraie-1440.webp"
FFMPEG = "ffmpeg"
W, H, FPS = 1920, 1080, 24


def dune_frame(path: Path) -> None:
    image = Image.new("RGB", (W, H))
    draw = ImageDraw.Draw(image)
    sky = [
        (0, (232, 182, 115)),
        (int(H * 0.32), (249, 215, 156)),
        (int(H * 0.62), (226, 166, 103)),
        (H, (170, 89, 52)),
    ]
    for y in range(H):
        for index in range(len(sky) - 1):
            y0, c0 = sky[index]
            y1, c1 = sky[index + 1]
            if y0 <= y <= y1:
                p = (y - y0) / max(1, y1 - y0)
                color = tuple(round(a + (b - a) * p) for a, b in zip(c0, c1))
                draw.line((0, y, W, y), fill=color)
                break

    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    glow_draw = ImageDraw.Draw(glow)
    glow_draw.ellipse((1160, 225, 1580, 645), fill=(255, 229, 171, 105))
    glow = glow.filter(ImageFilter.GaussianBlur(95))
    image = Image.alpha_composite(image.convert("RGBA"), glow)
    ImageDraw.Draw(image).ellipse((1295, 310, 1450, 465), fill=(255, 232, 184, 235))

    def dune(base: int, amp1: float, amp2: float, phase: float, color0: tuple[int, int, int], color1: tuple[int, int, int]) -> None:
        mask = Image.new("L", (W, H), 0)
        mask_draw = ImageDraw.Draw(mask)
        points = []
        for x in range(-16, W + 20, 6):
            y = base + amp1 * math.sin(x / 520 + phase) + amp2 * math.sin(x / 205 + phase * 1.8)
            points.append((x, round(y)))
        mask_draw.polygon(points + [(W + 10, H), (-10, H)], fill=255)
        gradient = Image.new("RGB", (1, H))
        gd = ImageDraw.Draw(gradient)
        top = min(y for _, y in points)
        for y in range(max(0, top), H):
            p = max(0.0, min(1.0, (y - top) / max(1, H - top)))
            shade = p**0.7
            c = tuple(round(a + (b - a) * shade) for a, b in zip(color0, color1))
            gd.point((0, y), fill=c)
        gradient = gradient.resize((W, H))
        image.paste(gradient, (0, 0), mask)
        ridge = []
        for x in range(0, W + 1, 8):
            y = base + amp1 * math.sin(x / 520 + phase) + amp2 * math.sin(x / 205 + phase * 1.8)
            ridge.append((x, round(y)))
        ImageDraw.Draw(image).line(ridge, fill=(255, 221, 166, 100), width=3)

    dune(610, 100, 18, 0.4, (199, 126, 69), (170, 86, 52))
    dune(755, 120, 24, 2.4, (197, 116, 60), (145, 68, 45))
    dune(875, 78, 18, 4.0, (168, 83, 48), (111, 51, 39))

    rng = random.Random(1965)
    dust = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    dust_draw = ImageDraw.Draw(dust)
    for _ in range(250):
        x = rng.randint(0, W - 1)
        y = rng.randint(400, H - 1)
        radius = rng.choice((1, 1, 1, 2, 3))
        dust_draw.ellipse((x, y, x + radius, y + radius), fill=(255, 225, 173, rng.randint(18, 75)))
    image = Image.alpha_composite(image, dust)
    grain = Image.effect_noise((W, H), 38).convert("RGB")
    image = Image.blend(image.convert("RGB"), grain, 0.085)
    image.save(path, quality=94)


def main() -> None:
    if not PALM.exists():
        raise SystemExit(f"Missing source image: {PALM}")
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="sonedis-intro-") as temp:
        temp_path = Path(temp)
        desert = temp_path / "desert.jpg"
        dune_frame(desert)

        video_out = OUT / "intro-biskra.mp4"
        subprocess.run(
            [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-loop", "1", "-framerate", str(FPS), "-t", "4.4", "-i", str(desert), "-loop", "1", "-framerate", str(FPS), "-t", "4.4", "-i", str(PALM), "-filter_complex", "[0:v]scale=1365:768:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(zoom+0.00022,1.045)':d=1:x='iw/2-(iw/zoom/2)+12*sin(on/80)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=24,trim=duration=4.4,setpts=PTS-STARTPTS[v0];[1:v]scale=1365:768:force_original_aspect_ratio=increase,crop=1280:720,zoompan=z='min(zoom+0.00016,1.035)':d=1:x='iw/2-(iw/zoom/2)-10*sin(on/100)':y='ih/2-(ih/zoom/2)+5*sin(on/110)':s=1280x720:fps=24,trim=duration=4.4,setpts=PTS-STARTPTS,eq=contrast=0.96:saturation=1.18:brightness=0.09:gamma=1.18,colorbalance=rs=0.06:gs=0.02:bs=-0.04[v1];[v0][v1]xfade=transition=fade:duration=0.9:offset=3.5[v]", "-map", "[v]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "25", "-movflags", "+faststart", "-pix_fmt", "yuv420p", str(video_out)],
            check=True,
        )
        subprocess.run(
            [FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-ss", "3.8", "-i", str(video_out), "-frames:v", "1", "-c:v", "libwebp", "-q:v", "70", str(OUT / "intro-poster.webp")],
            check=True,
        )
    if (OUT / "intro-poster.webp").stat().st_size < 10_000:
        raise SystemExit("Generated poster is unexpectedly small; refusing to keep an invalid image.")
    print(f"Created {video_out} and {OUT / 'intro-poster.webp'}")


if __name__ == "__main__":
    main()
