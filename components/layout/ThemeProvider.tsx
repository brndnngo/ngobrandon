"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyTheme,
  formatLaTime,
  getEffectiveNow,
  parseDevQuery,
  resolveTheme,
  toggleThemeOverride,
  type DevQuery,
  type ThemeName,
} from "@/lib/theme/resolve";

type ThemeContextValue = {
  theme: ThemeName;
  time: string | null;
  toggle: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readDevQuery(): DevQuery | undefined {
  if (process.env.NODE_ENV === "production") return undefined;
  return parseDevQuery(window.location.search);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<ThemeName>("light");
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const applied = document.documentElement.dataset.theme;
    if (applied === "light" || applied === "dark") setTheme(applied);

    const tick = () => {
      const dev = readDevQuery();
      const now = getEffectiveNow(dev);
      setTime(formatLaTime(now));
      const resolved = resolveTheme(now, dev);
      applyTheme(resolved.theme);
      setTheme(resolved.theme);
    };

    tick();
    const id = window.setInterval(tick, 1000);
    const raf = window.requestAnimationFrame(() => {
      document.documentElement.setAttribute("data-theme-ready", "");
    });

    function onKey(event: KeyboardEvent) {
      if (event.code !== "KeyD" && event.key.toLowerCase() !== "d") return;
      if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) {
        return;
      }
      const target = event.target;
      if (target instanceof HTMLElement) {
        const tag = target.tagName;
        if (
          tag === "INPUT" ||
          tag === "TEXTAREA" ||
          tag === "SELECT" ||
          target.isContentEditable
        ) {
          return;
        }
      }
      event.preventDefault();
      const dev = readDevQuery();
      const now = getEffectiveNow(dev);
      setTheme((current) => toggleThemeOverride(now, current, dev));
    }

    window.addEventListener("keydown", onKey);

    return () => {
      window.clearInterval(id);
      window.cancelAnimationFrame(raf);
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  const toggle = useCallback(() => {
    const dev = readDevQuery();
    const now = getEffectiveNow(dev);
    const next = toggleThemeOverride(now, theme, dev);
    setTheme(next);
  }, [theme]);

  const value = useMemo(
    () => ({ theme, time, toggle }),
    [theme, time, toggle],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return value;
}
