"use client";

import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site";

function formatTime() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: siteConfig.timeZone,
  }).format(new Date());
}

export function Clock() {
  // Rendered empty on the server so the markup matches before hydration; the
  // time would otherwise differ between server and client render.
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    setTime(formatTime());
    const id = setInterval(() => setTime(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono text-eyebrow text-muted">
      <span>{siteConfig.city}</span>
      {time ? <time suppressHydrationWarning>{time}</time> : null}
    </div>
  );
}
