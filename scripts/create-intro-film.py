"""Color-grade and optimize the SONEDIS silent hero film.

Requirements: Python 3.10+, FFmpeg with libx264/libwebp, and ffprobe.
Run: python scripts/create-intro-film.py
The licensed Pexels source is cached under the system temp directory.
"""

from __future__ import annotations

import json
import os
import shutil
import subprocess
import tempfile
import urllib.request
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "assets" / "video"
SOURCE_DIR = Path(tempfile.gettempdir()) / "sonedis-pexels"
SOURCE = (
    "date-fruit-blue-sky-pexels-14160251.mp4",
    "https://videos.pexels.com/video-files/14160251/14160251-uhd_4096_2160_30fps.mp4",
    32_471_416,
)
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
FFPROBE = os.environ.get("FFPROBE", "ffprobe")
FILM = OUT / "intro-dates-14160251.mp4"
POSTER = OUT / "intro-dates-14160251.webp"
MAX_VIDEO_BYTES = 5_000_000


def run(args: list[str]) -> None:
    subprocess.run(args, check=True)


def ensure_source() -> Path:
    """Reuse the Pexels source cache; otherwise download it to the temp dir."""
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    filename, url, expected_size = SOURCE
    path = SOURCE_DIR / filename
    if path.exists() and path.stat().st_size == expected_size:
        return path
    temporary = path.with_suffix(path.suffix + ".part")
    request = urllib.request.Request(url, headers={"User-Agent": "SONEDIS-media-build/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=90) as response, temporary.open("wb") as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
        if temporary.stat().st_size != expected_size:
            raise RuntimeError(
                f"Unexpected source size: {temporary.stat().st_size:,}; expected {expected_size:,} bytes."
            )
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    return path


def probe(path: Path) -> dict[str, Any]:
    result = subprocess.run(
        [
            FFPROBE, "-v", "error", "-show_entries",
            "format=duration,size", "-show_entries",
            "stream=codec_name,codec_type,width,height,avg_frame_rate,profile,pix_fmt",
            "-of", "json", str(path),
        ],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def verify() -> None:
    info = probe(FILM)
    streams = info.get("streams", [])
    video = next((stream for stream in streams if stream.get("codec_type") == "video"), None)
    assert video and video.get("codec_name") == "h264", "Expected an H.264 video stream."
    assert (video.get("width"), video.get("height")) == (1920, 1080), "Expected 1080p output."
    assert video.get("pix_fmt") == "yuv420p", "Expected browser-compatible 4:2:0 output."
    assert not any(stream.get("codec_type") == "audio" for stream in streams), "Intro must be silent."
    duration = float(info["format"]["duration"])
    size = int(info["format"]["size"])
    assert 10.0 <= duration <= 11.0, f"Unexpected video duration: {duration:.2f}s"
    assert size <= MAX_VIDEO_BYTES, f"Video exceeds {MAX_VIDEO_BYTES:,} bytes: {size:,}"
    poster_stream = probe(POSTER)["streams"][0]
    assert poster_stream.get("codec_name") == "webp"
    assert (poster_stream.get("width"), poster_stream.get("height")) == (1920, 1080)
    print(
        f"Verified: {video.get('profile')} H.264 1920x1080 at {video.get('avg_frame_rate')}, "
        f"{duration:.3f}s, {size:,} bytes, silent."
    )
    print(f"Verified poster: WEBP 1920x1080, {POSTER.stat().st_size:,} bytes.")


def main() -> None:
    if shutil.which(FFMPEG) is None or shutil.which(FFPROBE) is None:
        raise SystemExit("FFmpeg and ffprobe must be available on PATH (or set FFMPEG/FFPROBE).")
    OUT.mkdir(parents=True, exist_ok=True)
    source = ensure_source()

    # Use just the user's selected shot. A restrained warm grade enriches the fruit
    # and foliage without changing the natural blue sky or suggesting a false place.
    run([
        FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
        "-ss", "3", "-t", "10.5", "-i", str(source),
        "-vf",
        "scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,fps=24,"
        "setsar=1,eq=contrast=1.055:saturation=1.10:brightness=0.002:gamma=1.015,"
        "colorbalance=rs=0.012:bs=-0.012:rm=0.015:bm=-0.018:rh=0.025:gh=0.008:bh=-0.025,"
        "unsharp=5:5:0.22:5:5:0.0,format=yuv420p",
        "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
        "-maxrate", "3.5M", "-bufsize", "7M", "-profile:v", "high", "-level", "4.0",
        "-movflags", "+faststart", "-color_primaries", "bt709", "-color_trc", "bt709",
        "-colorspace", "bt709", str(FILM),
    ])
    run([
        FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-ss", "2.5",
        "-i", str(FILM), "-frames:v", "1", "-vf", "scale=1920:1080",
        "-c:v", "libwebp", "-quality", "86", str(POSTER),
    ])
    verify()


if __name__ == "__main__":
    main()
