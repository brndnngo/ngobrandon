"use client";

import { usePathname } from "next/navigation";
import { ScrollTrigger, gsap, useGSAP } from "@/components/motion/gsap";

/**
 * Replaces the `mix-blend-mode: exclusion` approach, which could not work: the
 * nav sits above a `backdrop-filter` scrim, and that filter establishes a
 * backdrop root the blend mode cannot see past. Exclusion against a mid-grey
 * backdrop also resolves to mid-grey, so text over video was never legible.
 *
 * Each section declares the treatment it wants via `data-nav`, and the section
 * currently under the nav sets `data-nav-theme` on the document. The colour
 * itself comes from a CSS variable, so the transition is pure CSS.
 *
 * No-JS default is `data-nav-theme="light"` on `<html>`, matching the majority
 * of pages. Dark pages (film) set the attribute on their root section too.
 */
const NAV_LINE = 35;

export function NavThemeController() {
  const pathname = usePathname();

  useGSAP(
    () => {
      const root = document.documentElement;
      const sections = gsap.utils.toArray<HTMLElement>("[data-nav]");

      if (sections.length === 0) return;

      const apply = (section: HTMLElement) => {
        root.dataset.navTheme =
          section.dataset.nav === "dark" ? "dark" : "light";
      };

      const triggers = sections.map((section) =>
        ScrollTrigger.create({
          trigger: section,
          start: `top ${NAV_LINE}px`,
          end: `bottom ${NAV_LINE}px`,
          onEnter: () => apply(section),
          onEnterBack: () => apply(section),
        }),
      );

      return () => {
        triggers.forEach((trigger) => trigger.kill());
        root.dataset.navTheme = "light";
      };
    },
    { dependencies: [pathname], revertOnUpdate: true },
  );

  return null;
}
