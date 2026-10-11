"""Build a silent live-action intro from licensed Pexels clips + SONEDIS photo.

Requirements: Python 3.10+, FFmpeg with libx264/libwebp, and ffprobe.
Run: python scripts/create-intro-film.py
The two Pexels source MP4s are cached in the system temp directory and are
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
PALM_PHOTO = ROOT / "public" / "assets" / "photos" / "palmeraie-1440.webp"
FFMPEG = os.environ.get("FFMPEG", "ffmpeg")
FFPROBE = os.environ.get("FFPROBE", "ffprobe")
FILM = OUT / "intro-biskra.mp4"
POSTER = OUT / "intro-poster.webp"
MAX_VIDEO_BYTES = 4_000_000

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
    assert 9.0 <= duration <= 10.0, f"Unexpected montage duration: {duration:.2f}s"
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
    if not PALM_PHOTO.exists():
        raise SystemExit(f"Missing local SONEDIS grove photograph: {PALM_PHOTO}")
    OUT.mkdir(parents=True, exist_ok=True)
    dunes = ensure_source(*SOURCES["dunes"])
    date_palm = ensure_source(*SOURCES["date_palm"])

    # Real motion: wind-rippled dunes → date-palm fronds moving in the breeze
    # → the local SONEDIS grove image. The stock footage is not identified as Biskra.
    run([
        FFMPEG, "-hide_banner", "-loglevel", "error", "-y",
        "-ss", "12", "-t", "3.7", "-i", str(dunes),
        "-ss", "6", "-t", "3.7", "-i", str(date_palm),
        "-loop", "1", "-framerate", "24", "-t", "3.7", "-i", str(PALM_PHOTO),
        "-filter_complex",
        "[0:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,"
        "trim=duration=3.7,setpts=PTS-STARTPTS,eq=contrast=1.02:saturation=1.06:brightness=0.01[dunes];"
        "[1:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,fps=24,"
        "trim=duration=3.7,setpts=PTS-STARTPTS,eq=contrast=1.02:saturation=1.08:brightness=0.01[palm];"
        "[2:v]scale=1280:720:force_original_aspect_ratio=increase,crop=1280:720,"
        "zoompan=z='min(zoom+0.00018,1.025)':d=1:x='iw/2-(iw/zoom/2)':"
        "y='ih/2-(ih/zoom/2)':s=1280x720:fps=24,trim=duration=3.7,setpts=PTS-STARTPTS,"
        "eq=contrast=1.02:saturation=1.06:brightness=0.01[grove];"
        "[dunes][palm]xfade=transition=fade:duration=0.7:offset=3.0[first];"
        "[first][grove]xfade=transition=fade:duration=0.75:offset=6.0[out]",
        "-map", "[out]", "-an", "-c:v", "libx264", "-preset", "slow", "-crf", "24",
        "-profile:v", "main", "-level", "3.1", "-movflags", "+faststart", "-pix_fmt", "yuv420p", str(FILM),
    ])
    # Capture the stable local-grove closing shot, after both live clips/fades.
    run([FFMPEG, "-hide_banner", "-loglevel", "error", "-y", "-ss", "9.2", "-i", str(FILM), "-frames:v", "1", "-vf", "scale=1280:720", "-c:v", "libwebp", "-quality", "78", str(POSTER)])
    verify()


if __name__ == "__main__":
    main()
