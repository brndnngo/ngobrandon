# Fonts

Three licensed faces are self-hosted so the site makes no third-party font
requests. None of them are in the repo yet — add the files listed below, then
replace the body of `app/fonts.ts` with the code at the bottom of this file.

Until that happens the site renders with the system fallbacks declared inside
the `var()` calls in `app/globals.css`, so the build stays green.

## Files to add to this directory

| File | Face | Notes |
| --- | --- | --- |
| `season-mix-var.woff2` | Season Mix VF | Single variable file covering weight 400–600. Replaces the four static TTFs currently on Webflow (~542 KiB total). |
| `acumin-pro-regular.woff2` | Acumin Pro 400 | Every element measured on the live site renders at weight 400. |
| `akkurat-mono-regular.woff2` | Akkurat Mono 400 | Used by the `#txt-desktop` element on the live site. |

Convert TTF or OTF sources to WOFF2 before adding them; WOFF2 typically saves
40–50% over TTF, and the variable Season Mix file should replace all four
statics on its own.

Add further Acumin weights only if a design genuinely uses them. The live site
does not.

## Code to activate

```ts
import localFont from "next/font/local";

const seasonMix = localFont({
  src: "./fonts/season-mix-var.woff2",
  weight: "400 600",
  variable: "--font-season-mix",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const acumin = localFont({
  src: "./fonts/acumin-pro-regular.woff2",
  weight: "400",
  variable: "--font-acumin",
  display: "swap",
  adjustFontFallback: "Arial",
});

const akkuratMono = localFont({
  src: "./fonts/akkurat-mono-regular.woff2",
  weight: "400",
  variable: "--font-akkurat-mono",
  display: "swap",
  adjustFontFallback: false,
});

export const fontVariables = [
  seasonMix.variable,
  acumin.variable,
  akkuratMono.variable,
].join(" ");
```

`adjustFontFallback` is the reason to prefer `next/font/local` over a
hand-written `@font-face`: Next generates a fallback with matched metrics via
`size-adjust`, so text does not reflow when the real face arrives.

## Swapping the body face

`app/globals.css` maps faces to roles in one place. Moving the body text from
Acumin Pro to Akkurat means changing `--font-sans` to point at
`--font-akkurat`. No component names a typeface, so nothing else changes.

Expect to retune tracking afterwards: the values in `@theme` are measured
against Acumin's metrics, and Akkurat has a different x-height and set width.
