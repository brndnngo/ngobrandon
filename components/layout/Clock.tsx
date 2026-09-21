"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

const TIME_PLACEHOLDER = "00:00:00 AM";

function formatTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: siteConfig.timeZone,
  }).format(new Date());
}

export function Clock({
  variant = "default",
}: {
  variant?: "default" | "bar";
}) {
  // Rendered as a placeholder on the server so the markup matches before
  // hydration; the time would otherwise differ between server and client.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime());
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  const isBar = variant === "bar";

  return (
    <div
      className={
        isBar
          ? "flex items-center gap-4 text-body text-muted"
          : "flex items-center gap-2 text-body"
      }
      aria-label={siteConfig.city}
    >
      <span>{siteConfig.city}</span>
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
    </div>
  );
}
