import { siteConfig } from "@/lib/site";
import {
  getSunTimes,
  nextSolarBoundary,
  sunTheme,
  type SunTimes,
} from "@/lib/theme/la-sun";

export type ThemeName = "light" | "dark";

export const THEME_OVERRIDE_KEY = "bn-theme-override";
export const THEME_COLOR = {
  light: "#ffffff",
  dark: "#111111",
} as const;

export type ThemeOverride = {
  theme: ThemeName;
  expiresAt: number;
};

export type DevQuery = {
  theme?: ThemeName;
  laTime?: { h: number; m: number };
};

type FormatPartMap = Record<string, string>;

function partsOf(date: Date, timeZone: string): FormatPartMap {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const map: FormatPartMap = {};
  for (const part of parts) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return map;
}

function tzOffsetMs(date: Date, timeZone: string) {
  const map = partsOf(date, timeZone);
  const asUtc = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour),
    Number(map.minute),
    Number(map.second),
  );
  return asUtc - date.getTime();
}

export function zonedLocalToDate(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  second: number,
  timeZone: string,
) {
  const wallAsUtc = Date.UTC(year, month - 1, day, hour, minute, second);
  let instant = wallAsUtc;
  for (let i = 0; i < 3; i++) {
    instant = wallAsUtc - tzOffsetMs(new Date(instant), timeZone);
  }
  return new Date(instant);
}

export function parseDevQuery(search: string): DevQuery {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const result: DevQuery = {};
  const theme = params.get("theme");
  if (theme === "light" || theme === "dark") result.theme = theme;
  const laTime = params.get("laTime");
  if (laTime) {
    const match = /^(\d{1,2}):(\d{2})(?::\d{2})?$/.exec(laTime);
    if (match) {
      const h = Number(match[1]);
      const m = Number(match[2]);
      if (h >= 0 && h <= 23 && m >= 0 && m <= 59) result.laTime = { h, m };
    }
  }
  return result;
}

let laTimeOrigin: { real: number; fake: number } | null = null;

export function getEffectiveNow(dev?: DevQuery): Date {
  const real = new Date();
  if (!dev?.laTime) {
    laTimeOrigin = null;
    return real;
  }
  const map = partsOf(real, siteConfig.timeZone);
  const fakeWall = zonedLocalToDate(
    Number(map.year),
    Number(map.month),
    Number(map.day),
    dev.laTime.h,
    dev.laTime.m,
    Number(map.second),
    siteConfig.timeZone,
  );
  if (!laTimeOrigin) {
    laTimeOrigin = { real: real.getTime(), fake: fakeWall.getTime() };
  }
  return new Date(laTimeOrigin.fake + (real.getTime() - laTimeOrigin.real));
}

export function formatLaTime(date: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: siteConfig.timeZone,
  }).format(date);
}

export function readOverride(nowMs: number): ThemeOverride | null {
  try {
    const raw = localStorage.getItem(THEME_OVERRIDE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ThemeOverride;
    if (
      (parsed.theme !== "light" && parsed.theme !== "dark") ||
      typeof parsed.expiresAt !== "number"
    ) {
      localStorage.removeItem(THEME_OVERRIDE_KEY);
      return null;
    }
    if (nowMs >= parsed.expiresAt) {
      localStorage.removeItem(THEME_OVERRIDE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

export function writeOverride(override: ThemeOverride) {
  try {
    localStorage.setItem(THEME_OVERRIDE_KEY, JSON.stringify(override));
  } catch {
    // Private mode or blocked storage: the session still toggles via applyTheme.
  }
}

export function resolveTheme(
  now: Date,
  dev?: DevQuery,
): {
  theme: ThemeName;
  times: SunTimes;
  nextBoundary: Date;
  natural: ThemeName;
} {
  const times = getSunTimes(now, siteConfig.lat, siteConfig.lng);
  const natural = sunTheme(now, times);
  const nextBoundary = nextSolarBoundary(
    now,
    times,
    siteConfig.lat,
    siteConfig.lng,
  );
  if (dev?.theme) {
    return { theme: dev.theme, times, nextBoundary, natural };
  }
  const override = readOverride(now.getTime());
  return {
    theme: override?.theme ?? natural,
    times,
    nextBoundary,
    natural,
  };
}

export function applyTheme(theme: ThemeName) {
  const root = document.documentElement;
  root.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", THEME_COLOR[theme]);
}

export function toggleThemeOverride(
  now: Date,
  current: ThemeName,
  dev?: DevQuery,
) {
  if (dev?.theme) return current;
  const next: ThemeName = current === "dark" ? "light" : "dark";
  const { nextBoundary } = resolveTheme(now);
  writeOverride({ theme: next, expiresAt: nextBoundary.getTime() });
  applyTheme(next);
  return next;
}
