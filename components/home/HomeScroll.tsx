"use client";

import { useEffect, useRef, type ReactNode } from "react";

const ENABLE_QUERY = "(min-width: 64rem)";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;
  const tag = target.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
}

function wheelDeltaY(event: WheelEvent) {
  let delta = event.deltaY;
  if (event.deltaMode === 1) delta *= 16;
  if (event.deltaMode === 2) delta *= window.innerHeight;
  return delta;
}

export function HomeScroll({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const enableMq = window.matchMedia(ENABLE_QUERY);
    const reduceMq = window.matchMedia(REDUCE_QUERY);

    const state = {
      index: 0,
      locked: false,
      intent: 0,
      touchY: null as number | null,
      unlock: 0,
    };

    const footer = root.querySelector<HTMLElement>(".home-footer");
    const footerHome =
      footer?.nextElementSibling instanceof HTMLElement
        ? footer.nextElementSibling
        : null;

    const pinFooter = (on: boolean) => {
      if (!footer) return;
      if (on) {
        root.appendChild(footer);
        return;
      }
      if (footerHome && footerHome.parentElement === track) {
        track.insertBefore(footer, footerHome);
        return;
      }
      track.appendChild(footer);
    };

    const sections = () =>
      [...root.querySelectorAll<HTMLElement>(".home-snap-section")];

    const readToken = (name: string, fallback: number) => {
      const value = Number.parseFloat(
        getComputedStyle(root).getPropertyValue(name),
      );
      return Number.isFinite(value) ? value : fallback;
    };

    const threshold = () => readToken("--home-section-threshold", 34);
    const lockMs = () =>
      reduceMq.matches ? 0 : readToken("--home-section-duration", 760);

    const sectionY = (index: number) => {
      const items = sections();
      const first = items[0];
      const target = items[index];
      if (!first || !target) return 0;
      return target.offsetTop - first.offsetTop;
    };

    const applyOffset = () => {
      track.style.setProperty(
        "--home-track-offset",
        `${-sectionY(state.index)}px`,
      );
      root.dataset.homeSection = String(state.index);
    };

    const goTo = (next: number) => {
      if (state.locked) return;
      const items = sections();
      const last = items.length - 1;
      const clamped = Math.max(0, Math.min(last, next));
      if (clamped === state.index) {
        state.intent = 0;
        return;
      }

      state.index = clamped;
      state.intent = 0;
      state.locked = true;
      applyOffset();
      window.clearTimeout(state.unlock);
      state.unlock = window.setTimeout(() => {
        state.locked = false;
      }, lockMs());
    };

    const goBy = (direction: 1 | -1) => {
      goTo(state.index + direction);
    };

    const onWheel = (event: WheelEvent) => {
      if (!enableMq.matches) return;
      event.preventDefault();
      if (Math.abs(event.deltaY) < 1 || state.locked) return;

      state.intent += wheelDeltaY(event);
      if (Math.abs(state.intent) < threshold()) return;

      const direction: 1 | -1 = state.intent > 0 ? 1 : -1;
      state.intent = 0;
      goBy(direction);
    };

    const onTouchStart = (event: TouchEvent) => {
      if (!enableMq.matches || event.touches.length !== 1) return;
      state.touchY = event.touches[0].clientY;
    };

    const onTouchMove = (event: TouchEvent) => {
      if (!enableMq.matches || event.touches.length !== 1) return;
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest(".photo-strip-viewport")
      ) {
        return;
      }
      event.preventDefault();
    };

    const onTouchEnd = (event: TouchEvent) => {
      if (!enableMq.matches || state.locked) {
        state.touchY = null;
        return;
      }
      if (state.touchY === null || event.changedTouches.length !== 1) {
        state.touchY = null;
        return;
      }
      const deltaY = state.touchY - event.changedTouches[0].clientY;
      state.touchY = null;
      if (Math.abs(deltaY) < threshold()) return;
      goBy(deltaY > 0 ? 1 : -1);
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (!enableMq.matches || state.locked || isTypingTarget(event.target)) {
        return;
      }
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.key) {
        case "ArrowDown":
        case "PageDown":
        case " ":
          if (event.key === " " && event.target instanceof HTMLButtonElement) {
            return;
          }
          event.preventDefault();
          goBy(1);
          break;
        case "ArrowUp":
        case "PageUp":
          event.preventDefault();
          goBy(-1);
          break;
        case "Home":
          event.preventDefault();
          goTo(0);
          break;
        case "End":
          event.preventDefault();
          goTo(sections().length - 1);
          break;
        default:
          break;
      }
    };

    const onClick = (event: MouseEvent) => {
      if (!enableMq.matches) return;
      const link = (event.target as Element | null)?.closest("a[href^='#']");
      if (!(link instanceof HTMLAnchorElement)) return;
      const id = decodeURIComponent(link.hash.replace(/^#/, ""));
      if (!id) return;
      const el = document.getElementById(id);
      if (!el || !root.contains(el)) return;
      const items = sections();
      const index = items.findIndex(
        (section) => section === el || section.contains(el),
      );
      if (index < 0) return;
      event.preventDefault();
      goTo(index);
    };

    const setEnabled = (on: boolean) => {
      window.clearTimeout(state.unlock);
      state.locked = false;
      state.intent = 0;
      if (!on) {
        pinFooter(false);
        delete root.dataset.homeScroll;
        delete root.dataset.homeSection;
        track.style.removeProperty("--home-track-offset");
        return;
      }
      pinFooter(true);
      root.dataset.homeScroll = "";
      root.dataset.homeSection = String(state.index);
      applyOffset();
    };

    const onResize = () => {
      setEnabled(enableMq.matches);
    };

    setEnabled(enableMq.matches);

    root.addEventListener("wheel", onWheel, { passive: false });
    root.addEventListener("touchstart", onTouchStart, { passive: true });
    root.addEventListener("touchmove", onTouchMove, { passive: false });
    root.addEventListener("touchend", onTouchEnd);
    window.addEventListener("keydown", onKeyDown);
    root.addEventListener("click", onClick);
    window.addEventListener("resize", onResize);
    enableMq.addEventListener("change", onResize);
    reduceMq.addEventListener("change", onResize);

    return () => {
      window.clearTimeout(state.unlock);
      root.removeEventListener("wheel", onWheel);
      root.removeEventListener("touchstart", onTouchStart);
      root.removeEventListener("touchmove", onTouchMove);
      root.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("keydown", onKeyDown);
      root.removeEventListener("click", onClick);
      window.removeEventListener("resize", onResize);
      enableMq.removeEventListener("change", onResize);
      reduceMq.removeEventListener("change", onResize);
      pinFooter(false);
      delete root.dataset.homeScroll;
      delete root.dataset.homeSection;
      track.style.removeProperty("--home-track-offset");
    };
  }, []);

  return (
    <main ref={rootRef} className="home-snap">
      <div ref={trackRef} className="home-track">
        {children}
      </div>
    </main>
  );
}
