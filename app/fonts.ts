import localFont from "next/font/local";

/**
 * Font roles are consumed only as the CSS variables --font-season-mix,
 * --font-acumin and --font-akkurat-mono, which app/globals.css maps onto the
 * --font-display / --font-sans / --font-mono roles.
 *
 * Akkurat Mono is not registered yet: akkurat-mono-regular.woff2 is missing,
 * so --font-akkurat-mono stays undefined and the var() fallbacks in
 * globals.css supply the system mono stack.
 */

const seasonMix = localFont({
  src: [
    {
      path: "./fonts/SeasonMix-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/SeasonMix-LightItalic.woff2",
      weight: "300",
      style: "italic",
    },
    {
      path: "./fonts/SeasonMix-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/SeasonMix-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/SeasonMix-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/SeasonMix-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/SeasonMix-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/SeasonMix-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-season-mix",
  display: "swap",
  adjustFontFallback: "Times New Roman",
});

const acumin = localFont({
  src: [
    {
      path: "./fonts/AcuminPro-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/AcuminPro-Bold.woff",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-acumin",
  display: "swap",
  adjustFontFallback: "Arial",
});

export const fontVariables = [seasonMix.variable, acumin.variable].join(" ");
