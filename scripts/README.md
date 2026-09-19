# Media pipeline

Case study stills and film photos currently load from the Webflow CDN as a
temporary source. The scripts in this folder move that library into Sanity and
prepare video / Lottie in the formats the site actually needs.

## Inventory

`pnpm exec tsx scripts/inventory-webflow.ts`

Writes `content/assets/inventory.json` from the Webflow Assets API. Needs
`WEBFLOW_SITE_ID` (default `5e0553880aa5291e8f7d47e0`) and a token if you run
it outside Cursor's Webflow MCP.

Classification rules:

- `.json` / `.lottie` whose payload is mostly vectors → keep as Lottie
- `.json` containing `assets` entries with `p` data URIs or embedded raster
  (`w`/`h` bitmaps) → photographic, re-encode as video
- `.mp4` / `.mov` / `.webm` → video
- images → stills

## Alt text

`content/assets/alt-text.json` is the local mapping. Do not write alt text back
to Webflow; this file is the source of truth the upload script reads.

## Upload to Sanity

Requires `NEXT_PUBLIC_SANITY_PROJECT_ID`, `SANITY_API_WRITE_TOKEN`, and
`NEXT_PUBLIC_SANITY_DATASET`.

`pnpm exec tsx scripts/upload-to-sanity.ts`

Downloads each inventoried asset and creates a Sanity asset, copying alt text
from `alt-text.json`.

## Encode video

`scripts/encode-video.sh <input> <stem>`

Caps the long edge at 1600px, strips audio, writes:

- `<stem>.mp4`  H.264  CRF 23
- `<stem>.webm` VP9    CRF 32
- `<stem>.jpg`  poster frame

The nine-cell Watch Club hero should be pre-composited in Premiere / After
Effects into one file before encoding. Do not ship nine looping videos.

## Lottie

Genuine vector animations: `npx @dotlottie/cli convert input.json output.lottie`

The player is `components/case-study/LottieAnimation.tsx`, loaded with
`next/dynamic` so the bundle is absent from pages that don't use it.

## Hosting decision

Until the encoded files exist, hosting is:

- Stills and short loops (< ~8 MB): Sanity assets or `public/projects/<slug>/`
- Watch Club hero and any clip still over ~8 MB after encode: add
  `sanity-plugin-mux-input` and upload inside the Studio so playback is HLS.

Do not add Mux until those sizes are measured. Adaptive streaming is extra
moving parts for clips that may fit in Blob / Sanity.
