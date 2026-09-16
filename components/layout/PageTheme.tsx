"use client";

import { useEffect } from "react";

export function PageTheme({ theme }: { theme: "light" | "dark" }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.theme;
    root.dataset.theme = theme;
    return () => {
      root.dataset.theme = previous || "light";
    };
  }, [theme]);

  return null;
}
