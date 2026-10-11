# Video production for SONEDIS

Use this skill to create or revise small, responsive hero films from approved local assets.

## Goals

- Produce a real, browser-playable MP4 that fits the design and does not delay the page.
- Keep the source, process and limits honest: a moving camera effect on a photograph is not documentary footage, and generated artwork must be described as illustration.
- Preserve source assets and their provenance. Do not hotlink or replace the original logos or brand marks.
- Default to silent hero video. Sound requires a separate, explicit product decision and a user action.

## SONEDIS intro source and output

- Motion footage: two downloaded source MP4s cached under the system temporary directory `sonedis-pexels`; sources and license are recorded in `LICENCES.md`.
- Closing photograph: `public/assets/photos/palmeraie-1440.webp` (existing SONEDIS site asset).
- Generator: `scripts/create-intro-film.py`.
- Outputs: `public/assets/video/intro-biskra.mp4` and `public/assets/video/intro-poster.webp`.
- The opening and middle shots are actual licensed Pexels video footage; the final shot is a still site photo. Pexels footage has no verified Biskra location and must never be presented as footage from Biskra.

## Reproducible workflow

1. Inspect source resolution, crop, contrast and context. Confirm that each image is available locally and has a recorded source. Do not infer that a photograph depicts Biskra unless the source says so.
2. Use Python 3.10+, FFmpeg with `libx264`/`libwebp`, and `ffprobe`. Run `python scripts/create-intro-film.py` from any working directory. The script downloads/caches Pexels sources under the system temp directory `sonedis-pexels`; set `FFMPEG`/`FFPROBE` environment variables if binaries are not on `PATH`.
3. Use temporal footage for the moving portions, with controlled crossfades and pacing that feels intentional on desktop and mobile crops. Preserve the real motion in the source. Avoid relying on a static poster or a pan/zoom over a single still to imply that an MP4 is playing.
4. Encode H.264, `yuv420p`, MP4 with `+faststart`; omit audio (`-an`). Keep the opening short, the file below 4 MB, and the first frame/poster visually legible.
5. Extract the poster from a stable frame after the transition, not from the middle of a crossfade. Keep poster dimensions and crop aligned with the video.
6. Verify with `ffprobe`: stream codec/type, dimensions, frame rate, duration, file size, and absence of audio. Open the poster and inspect representative frames at the beginning, transition, and end. If available, play in at least Chromium and WebKit.
7. For GitHub Pages, confirm the generated assets are tracked and copied into `dist/assets/video/`; use Vite's `BASE_URL` so project sites resolve `/sonedis/assets/video/...`. Verify deployed MP4 and poster URLs return HTTP 200 with suitable `video/mp4` and `image/webp` media types.

## Browser integration checks

- Use `<video muted playsInline autoPlay loop>` only when the clip has a deliberate loop point. A one-time narrative intro should omit `loop`; make clear that it settles on the ending frame. Never add autoplay audio.
- Set a useful `poster`, `preload="metadata"` (or `none` if the film should wait), and explicit width/height or an aspect-ratio container to prevent layout shifts.
- Respect `prefers-reduced-motion`: keep the content visible and show the poster rather than autoplaying moving imagery. Make the still state intentional.
- Check for overlays, opacity/visibility animations, stacking contexts, incorrect base paths, and browser autoplay restrictions when a visitor reports a missing video.
- Avoid claiming performance scores unless measured on the deployed page. Report any codec, browser, rights, or network limitations.

## Rights and authenticity

- Only use assets supplied by the site owner or assets with verified licenses. Keep a source/licence note for every external asset. Do not copy visual material from reference repos without checking their license.
- Distinguish captured footage, still-image camera motion, and procedural illustration in the handoff. Identify stock footage as generic stock imagery unless its specific location is verified.
- Do not invent geographic, cultural, historical or product claims. If provenance of an image is uncertain, say so and ask for an authenticated source before labeling it as Biskra.

## Delivery report

Report output paths, tools/version, dimensions, codec, frame rate, duration, byte size, audio presence, poster size, representative-frame inspection, browser tests, deployment URL checks and unresolved provenance/measurement limits.
