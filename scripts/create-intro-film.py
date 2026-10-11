"""Build a silent live-action intro from licensed Pexels clips.

Requirements: Python 3.10+, FFmpeg with libx264/libwebp, and ffprobe.
Run: python scripts/create-intro-film.py
The Pexels source MP4s are cached in the system temp directory and are
downloaded there automatically if they are missing.
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
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
FFPROBE = os.environ.get("FFPROBE", "ffprobe")
FILM = OUT / "intro-biskra.mp4"
POSTER = OUT / "intro-poster.webp"
MAX_VIDEO_BYTES = 8_000_000
TARGET_VIDEO_BYTES = 6_500_000

SOURCES = {
    "dunes": (
        "dunes-pexels-27721174.mp4",
        "https://videos.pexels.com/video-files/27721174/12210758_3840_2160_30fps.mp4",
        176_794_152,
    ),
    "date_palm": (
        "date-palm-pexels-14158721.mp4",
        "https://videos.pexels.com/video-files/14158721/14158721-uhd_4096_2160_30fps.mp4",
        41_045_232,
    ),
    "oasis": (
        "oasis-aerial-pexels-17629832.mp4",
        "https://videos.pexels.com/video-files/17629832/17629832-uhd_3840_2160_60fps.mp4",
        83_093_931,
    ),
}


def ensure_source(filename: str, url: str, expected_size: int) -> Path:
    """Reuse the local source cache; otherwise download to the ignored temp dir."""
    SOURCE_DIR.mkdir(parents=True, exist_ok=True)
    path = SOURCE_DIR / filename
    if path.exists() and path.stat().st_size == expected_size:
        return path
    temporary = path.with_suffix(path.suffix + ".part")
    request = urllib.request.Request(url, headers={"User-Agent": "SONEDIS-media-build/1.0"})
    try:
        with urllib.request.urlopen(request, timeout=60) as response, temporary.open("wb") as output:
            while chunk := response.read(1024 * 1024):
                output.write(chunk)
        if temporary.stat().st_size != expected_size:
            raise RuntimeError(
                f"Unexpected source size for {filename}: {temporary.stat().st_size:,} bytes; "
                f"expected {expected_size:,}. Check the Pexels download URL/source record."
            )
        temporary.replace(path)
    finally:
        temporary.unlink(missing_ok=True)
    return path


def run(args: list[str]) -> None:
    subprocess.run(args, check=True)


def probe() -> dict[str, Any]:
    result = subprocess.run(
        [FFPROBE, "-v", "error", "-show_entries", "format=duration,size", "-show_entries", "stream=codec_name,codec_type,width,height,avg_frame_rate", "-of", "json", str(FILM)],
        check=True,
        capture_output=True,
        text=True,
    )
    return json.loads(result.stdout)


def verify() -> None:
    info = probe()
    streams = info.get("streams", [])
    video = next((stream for stream in streams if stream.get("codec_type") == "video"), None)
    assert video and video.get("codec_name") == "h264", "Expected an H.264 video stream."
    assert video.get("width") == 1280 and video.get("height") == 720, "Expected 1280x720 output."
    assert not any(stream.get("codec_type") == "audio" for stream in streams), "Intro must be silent."
    duration = float(info["format"]["duration"])
    size = int(info["format"]["size"])
    assert 10.0 <= duration <= 11.0, f"Unexpected montage duration: {duration:.2f}s"
    assert size <= MAX_VIDEO_BYTES, f"Video exceeds {MAX_VIDEO_BYTES:,} bytes: {size:,}"
    poster_info = subprocess.run(
        [FFPROBE, "-v", "error", "-show_entries", "stream=codec_name,width,height", "-of", "json", str(POSTER)],
        check=True,
        capture_output=True,
        text=True,
    )
    poster = json.loads(poster_info.stdout)["streams"][0]
    assert poster.get("codec_name") == "webp" and (poster.get("width"), poster.get("height")) == (1280, 720)
    print(f"Verified: H.264 1280x720 at {video.get('avg_frame_rate')}, {duration:.3f}s, {size:,} bytes, silent.")
    print(f"Verified poster: WEBP 1280x720, {POSTER.stat().st_size:,} bytes.")


def main() -> None:
    if shutil.which(FFMPEG) is None or shutil.which(FFPROBE) is None:
        raise SystemExit("FFmpeg and ffprobe must be available on PATH (or set FFMPEG/FFPROBE).")
    OUT.mkdir(parents=True, exist_ok=True)
    dunes = ensure_source(*SOURCES["dunes"])
    date_palm = ensure_source(*SOURCES["date_palm"])
    oasis = ensure_source(*SOURCES["oasis"])

    # Real motion: wind-rippled dunes → close date-palm leaves → aerial oasis.
    # The Pexels footage is not identified as Biskra.
    run([
        FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
        "-ss", "12", "-t", "3.8", "-i", str(dunes),
        "-ss", "6", "-t", "3.8", "-i", str(date_palm),
        "-ss", "5", "-t", "4.1", "-i", str(oasis),
        "-filter_complex",
        "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,"
        "trim=duration=3.8,setpts=PTS-STARTPTS,eq=contrast=1.02:saturation=1.06:brightness=0.01[dunes];"
        "[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,"
        "trim=duration=3.8,setpts=PTS-STARTPTS,eq=contrast=1.02:saturation=1.08:brightness=0.01[palm];"
        "[2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,"
        "trim=duration=4.1,setpts=PTS-STARTPTS,eq=contrast=1.02:saturation=1.08:brightness=0.005[oasis];"
        "[dunes][palm]xfade=transition=fade:duration=0.6:offset=3.2[first];"
        "[first][oasis]xfade=transition=fade:duration=0.6:offset=6.4[out]",
        "-map", "[out]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "21",
        "-maxrate", "6M", "-bufsize", "12M", "-profile:v", "high", "-level", "4.0",
        "-movflags", "+faststart", "-pix_fmt", "yuv420p", "-color_primaries", "bt709",
        "-color_trc", "bt709", "-colorspace", "bt709", str(FILM),
    ])
    # Capture a stable aerial-grove frame for instant page rendering.
    run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-ss", "9.6", "-i", str(FILM), "-frames:v", "1", "-vf", "scale=1280:720", "-c:v", "libwebp", "-quality", "86", str(POSTER)])
    verify()


if __name__ == "__main__":
    main()
