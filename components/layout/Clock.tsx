"use client";

import { siteConfig } from "@/lib/site";
import { useTheme } from "@/components/layout/ThemeProvider";

const TIME_PLACEHOLDER = "00:00:00 AM";

export function Clock({
  variant = "default",
}: {
  variant?: "default" | "bar";
}) {
  const { theme, time, toggle } = useTheme();
  const isBar = variant === "bar";
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={theme === "dark"}
      aria-label={`Use ${next} appearance`}
      className={
        isBar
          ? "theme-clock flex items-center gap-4 text-body text-muted"
          : "theme-clock flex items-center gap-2 text-body"
      }
    >
      <span className="flex items-center gap-1">
        <span className="theme-clock-mark" aria-hidden />
        <span>{siteConfig.city}</span>
      </span>
      <span className="relative inline-block tabular-nums">
        <span aria-hidden className="invisible">
          {TIME_PLACEHOLDER}
        </span>
        {time ? (
          <time
            aria-hidden
            className="absolute inset-0"
            suppressHydrationWarning
          >
            {time}
          </time>
        ) : null}
      </span>
    </button>
  );
}
