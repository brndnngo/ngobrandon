"use client";

import { useEffect, useRef, type ReactNode } from "react";

/* Two-pane snap from tablet. Stacked work inner-scrolls under the bio. */
const ENABLE_QUERY = "(min-width: 48rem)";
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";
const RESIST_PX = 160;
const INTENT_DECAY_MS = 100;

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
      resist: 0,
      touchY: null as number | null,
      unlock: 0,
      decay: 0,
    };

    const footer = root.querySelector<HTMLElement>(".home-footer");
    const footerHome = root.querySelector<HTMLElement>(
      ".home-snap-section:not(.home-snap-section--top)",
    );

    const pinFooter = (on: boolean) => {
      if (!footer) return;
      if (on) {
        root.appendChild(footer);
        return;
      }
      if (footerHome?.parentElement) {
        footerHome.parentElement.insertBefore(footer, footerHome);
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

    const resetIntent = () => {
      state.intent = 0;
      state.resist = 0;
      window.clearTimeout(state.decay);
    };

    const queueIntentDecay = () => {
      window.clearTimeout(state.decay);
      state.decay = window.setTimeout(resetIntent, INTENT_DECAY_MS);
    };

    const consumeTowardSnap = (delta: number) => {
      if (
        (delta > 0 && state.intent < 0) ||
        (delta < 0 && state.intent > 0)
      ) {
        state.intent = 0;
        state.resist = 0;
      }

      queueIntentDecay();

      const room = RESIST_PX - state.resist;
      if (room > 0) {
        const eat = Math.min(Math.abs(delta), room);
        state.resist += eat;
        const leftover = Math.abs(delta) - eat;
        if (leftover <= 0) return false;
        state.intent += Math.sign(delta) * leftover;
      } else {
        state.intent += delta;
      }

      return Math.abs(state.intent) >= threshold();
    };

    const goTo = (next: number) => {
      if (state.locked) return;
      const last = sections().length - 1;
      const clamped = Math.max(0, Math.min(last, next));
      if (clamped === state.index) {
        resetIntent();
        return;
      }

      state.index = clamped;
      resetIntent();
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

    const workEl = () => root.querySelector<HTMLElement>(".work-index");

    const workCanConsume = (deltaY: number) => {
      if (state.index !== 0 || deltaY === 0) return false;
      const work = workEl();
      if (!work) return false;
      const max = work.scrollHeight - work.clientHeight;
      if (max <= 1) return false;
      if (deltaY > 0) return work.scrollTop < max - 1;
      return work.scrollTop > 1;
    };

    const overWorkList = (target: EventTarget | null) =>
      target instanceof Element && Boolean(target.closest(".work-index"));

    const giveWheelToWork = (event: WheelEvent, delta: number) => {
      resetIntent();
      const work = workEl();
      if (!work) return;
      if (!overWorkList(event.target)) {
        event.preventDefault();
        work.scrollTop += delta;
      }
    };

    const onWheel = (event: WheelEvent) => {
      if (!enableMq.matches) return;
      const delta = wheelDeltaY(event);
      if (workCanConsume(delta)) {
        giveWheelToWork(event, delta);
        return;
      }
      event.preventDefault();
      if (Math.abs(event.deltaY) < 1 || state.locked) return;
      if (!consumeTowardSnap(delta)) return;

      const direction: 1 | -1 = state.intent > 0 ? 1 : -1;
      resetIntent();
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
      const y = event.touches[0].clientY;
      const deltaY = state.touchY === null ? 0 : state.touchY - y;
      if (workCanConsume(deltaY)) {
        resetIntent();
        const work = workEl();
        if (work && !overWorkList(target)) {
          event.preventDefault();
          work.scrollTop += deltaY;
          state.touchY = y;
        }
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
      if (workCanConsume(deltaY)) {
        resetIntent();
        return;
      }
      if (!consumeTowardSnap(deltaY)) return;
      const direction: 1 | -1 = deltaY > 0 ? 1 : -1;
      resetIntent();
      goBy(direction);
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
      resetIntent();
      state.locked = false;
      if (on) {
        pinFooter(true);
        root.scrollTop = 0;
        root.dataset.homeScroll = "";
        root.dataset.homeSection = String(state.index);
        applyOffset();
        return;
      }
      delete root.dataset.homeScroll;
      delete root.dataset.homeSection;
      track.style.removeProperty("--home-track-offset");
      pinFooter(false);
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
      window.clearTimeout(state.decay);
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
