#!/usr/bin/env bash
# Re-encode a photographic master for the site.
# Usage: scripts/encode-video.sh input.mov public/projects/wc/hero
set -euo pipefail

input="${1:?input file}"
stem="${2:?output stem without extension}"
mkdir -p "$(dirname "$stem")"

ffmpeg -y -i "$input" -an -vf "scale='min(1600,iw)':-2" -c:v libx264 -pix_fmt yuv420p -crf 23 -movflags +faststart "${stem}.mp4"
ffmpeg -y -i "$input" -an -vf "scale='min(1600,iw)':-2" -c:v libvpx-vp9 -b:v 0 -crf 32 "${stem}.webm"
ffmpeg -y -ss 00:00:01 -i "$input" -frames:v 1 -vf "scale='min(1600,iw)':-2" "${stem}.jpg"

echo "Wrote ${stem}.mp4, ${stem}.webm, ${stem}.jpg"
