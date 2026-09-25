"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

/** Strong ease-out. Most of the travel happens immediately, then it settles. */
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

function easeOut(progress: number) {
  return cubicBezier(EASE_OUT, progress);
}

function cubicBezier(
  [x1, y1, x2, y2]: readonly [number, number, number, number],
  progress: number,
) {
  if (progress <= 0) return 0;
  if (progress >= 1) return 1;

  const cx = 3 * x1;
  const bx = 3 * (x2 - x1) - cx;
  const ax = 1 - cx - bx;
  const cy = 3 * y1;
  const by = 3 * (y2 - y1) - cy;
  const ay = 1 - cy - by;
  const sampleX = (t: number) => ((ax * t + bx) * t + cx) * t;
  const sampleY = (t: number) => ((ay * t + by) * t + cy) * t;
  const sampleDX = (t: number) => (3 * ax * t + 2 * bx) * t + cx;

  let t = progress;
  for (let i = 0; i < 8; i += 1) {
    const error = sampleX(t) - progress;
    const slope = sampleDX(t);
    if (Math.abs(error) < 1e-5 || Math.abs(slope) < 1e-6) break;
    t -= error / slope;
  }
  return sampleY(t);
}

function readingOffset() {
  const navHeight = Number.parseFloat(
    getComputedStyle(document.documentElement).getPropertyValue("--nav-height"),
  );
  return (Number.isFinite(navHeight) ? navHeight : 0) + 8;
}

export type TocGroup = {
  id: string;
  label: string;
  children: { id: string; label: string }[];
};

function NavLink({
  id,
  label,
  current,
  lit,
  onClick,
}: {
  id: string;
  label: string;
  current: boolean;
  lit: boolean;
  onClick: (event: MouseEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <a
      href={`#${id}`}
      className={`cs-nav-link relative block text-body${current ? " is-current" : ""}${lit ? " is-lit" : ""}`}
      aria-current={current ? "location" : undefined}
      onClick={onClick}
    >
      <span aria-hidden className="cs-nav-mark" />
      {label}
    </a>
  );
}

function scrollToSection(id: string, motion: { frame: number }) {
  const targetElement = document.getElementById(id);
  if (!targetElement) return;

  const destination = Math.max(
    0,
    window.scrollY + targetElement.getBoundingClientRect().top - readingOffset(),
  );
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const start = window.scrollY;
  const distance = destination - start;

  window.cancelAnimationFrame(motion.frame);
  if (reduce || Math.abs(distance) < 2) {
    window.scrollTo(0, destination);
    return;
  }

  const duration = Math.min(900, Math.max(480, Math.abs(distance) * 0.45));
  const started = performance.now();

  const tick = (now: number) => {
    const progress = Math.min(1, (now - started) / duration);
    window.scrollTo(0, start + distance * easeOut(progress));
    if (progress < 1) {
      motion.frame = window.requestAnimationFrame(tick);
      return;
    }
    motion.frame = 0;
  };

  motion.frame = window.requestAnimationFrame(tick);
}

export function SideNav({ items }: { items: TocGroup[] }) {
  const navRef = useRef<HTMLElement>(null);
  const motionRef = useRef({ frame: 0 });
  const [active, setActive] = useState(items[0]?.id ?? "");
  const [away, setAway] = useState(false);

  useEffect(() => {
    const ids = items.flatMap((group) => [
      group.id,
      ...group.children.map((child) => child.id),
    ]);
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    if (!elements.length) return;

    const update = () => {
      const navHeight =
        Number.parseFloat(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--nav-height",
          ),
        ) || 0;
      const line = navHeight + 8;
      let current = elements[0];
      for (const element of elements) {
        if (element.getBoundingClientRect().top <= line) current = element;
      }
      setActive((previous) => (previous === current.id ? previous : current.id));

      const nav = navRef.current;
      const footer = nav?.closest("article")?.querySelector("footer");
      if (nav && footer) {
        const footerTop = footer.getBoundingClientRect().top;
        const navBottom = nav.getBoundingClientRect().bottom;
        const nextAway = footerTop < navBottom + 24;
        setAway((previous) => (previous === nextAway ? previous : nextAway));
      }
    };

    const stop = () => {
      window.cancelAnimationFrame(motionRef.current.frame);
      motionRef.current.frame = 0;
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("hashchange", update);
    window.addEventListener("wheel", stop, { passive: true });
    window.addEventListener("touchmove", stop, { passive: true });
    return () => {
      stop();
      window.removeEventListener("scroll", update);
      window.removeEventListener("hashchange", update);
      window.removeEventListener("wheel", stop);
      window.removeEventListener("touchmove", stop);
    };
  }, [items]);

  const follow = (id: string) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    scrollToSection(id, motionRef.current);
    const nextHash = `#${id}`;
    if (window.location.hash !== nextHash) {
      window.history.pushState(null, "", nextHash);
    }
  };

  if (!items.length) return null;

  return (
    <nav
      ref={navRef}
      className={`cs-nav hidden lg:block${away ? " is-away" : ""}`}
      aria-label="On this page"
    >
      <ol className="flex flex-col gap-cs-nav-gap pl-4">
        {items.map((group) => {
          const childCurrent = group.children.some((child) => child.id === active);
          return (
            <li key={group.id} className="flex flex-col gap-cs-nav-gap">
              <NavLink
                id={group.id}
                label={group.label}
                current={active === group.id}
                lit={active === group.id || childCurrent}
                onClick={follow(group.id)}
              />
              {group.children.length > 0 ? (
                <ol className="flex flex-col gap-cs-nav-gap pl-cs-nav-indent">
                  {group.children.map((child) => (
                    <li key={child.id}>
                      <NavLink
                        id={child.id}
                        label={child.label}
                        current={active === child.id}
                        lit={active === child.id}
                        onClick={follow(child.id)}
                      />
                    </li>
                  ))}
                </ol>
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
