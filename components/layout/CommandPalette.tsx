"use client";

import { useRouter } from "next/navigation";
import {
  Fragment,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import {
  projectColor,
  projectHref,
  projectIndexTitle,
  projectIsExternal,
  projectIsSelected,
} from "@/lib/project-card";
import { navLinks } from "@/lib/site";
import type { ProjectCard } from "@/lib/sanity/types";

type PaletteItem = {
  id: string;
  label: string;
  href: string;
  kind: "page" | "project";
  color?: string;
  external?: boolean;
};

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

function isCoarsePointer() {
  return window.matchMedia("(pointer: coarse)").matches;
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle
        cx="7"
        cy="7"
        r="4.4"
        stroke="currentColor"
        strokeWidth="1.25"
      />
      <path
        d="M10.4 10.4L13.5 13.5"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function CommandPalette({
  open,
  onOpenChange,
  projects,
  triggerRef,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: ProjectCard[];
  triggerRef: RefObject<HTMLButtonElement | null>;
}) {
  const router = useRouter();
  const listId = useId();
  const labelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [present, setPresent] = useState(open);
  const [visible, setVisible] = useState(open);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [mounted, setMounted] = useState(false);

  const needle = query.trim().toLowerCase();

  const items = useMemo<PaletteItem[]>(() => {
    const pages: PaletteItem[] = navLinks.map((link) => ({
      id: `page:${link.href}`,
      label: link.label,
      href: link.href,
      kind: "page",
    }));
    const projectItems: PaletteItem[] = (projects ?? [])
      .filter((card) => (needle ? true : projectIsSelected(card)))
      .map((card) => ({
        id: `project:${card.slug}`,
        label: projectIndexTitle(card),
        href: projectHref(card),
        kind: "project",
        color: projectColor(card),
        external: projectIsExternal(card),
      }));
    const all = [...pages, ...projectItems];
    if (!needle) return all;
    return all.filter((item) => item.label.toLowerCase().includes(needle));
  }, [needle, projects]);

  const active = items[selected] ?? null;
  const activeId = active ? `${listId}-${active.id}` : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setPresent(true);
      setQuery("");
      setSelected(0);
      const frame = requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
      return () => cancelAnimationFrame(frame);
    }

    setVisible(false);
    const timeout = window.setTimeout(() => setPresent(false), 150);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    setSelected(0);
  }, [query]);

  useEffect(() => {
    if (!present) return;
    document.documentElement.setAttribute("data-cmd-open", "");
    return () => document.documentElement.removeAttribute("data-cmd-open");
  }, [present]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  const go = useCallback(
    (item: PaletteItem) => {
      onOpenChange(false);
      if (item.external) {
        window.open(item.href, "_blank", "noreferrer");
        return;
      }
      router.push(item.href);
    },
    [onOpenChange, router],
  );

  const itemsRef = useRef(items);
  const selectedRef = useRef(selected);
  const goRef = useRef(go);
  itemsRef.current = items;
  selectedRef.current = selected;
  goRef.current = go;

  useEffect(() => {
    if (!open || !present) return;

    const panel = panelRef.current;
    const coarse = isCoarsePointer();
    if (!coarse) inputRef.current?.focus();
    else panel?.focus();

    function focusables() {
      if (!panel) return [];
      return [...panel.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => !el.hasAttribute("disabled") && el.tabIndex !== -1,
      );
    }

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "Tab" && panel) {
        const nodes = focusables();
        if (nodes.length === 0) {
          event.preventDefault();
          panel.focus();
          return;
        }
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        const current = document.activeElement;
        if (event.shiftKey && (current === first || !panel.contains(current))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && current === last) {
          event.preventDefault();
          first.focus();
        }
        return;
      }

      const currentItems = itemsRef.current;
      if (!currentItems.length) return;

      if (event.key === "ArrowDown") {
        event.preventDefault();
        setSelected((index) => (index + 1) % currentItems.length);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setSelected(
          (index) => (index - 1 + currentItems.length) % currentItems.length,
        );
        return;
      }
      if (event.key === "Enter") {
        const target = event.target as HTMLElement | null;
        if (target?.closest("button")) return;
        event.preventDefault();
        const next = currentItems[selectedRef.current];
        if (next) goRef.current(next);
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
    };
  }, [close, open, present, triggerRef]);

  const wasOpen = useRef(false);

  useEffect(() => {
    if (open) {
      wasOpen.current = true;
      return;
    }
    if (!wasOpen.current) return;
    wasOpen.current = false;
    triggerRef.current?.focus();
  }, [open, triggerRef]);

  useEffect(() => {
    if (!activeId) return;
    document.getElementById(activeId)?.scrollIntoView({ block: "nearest" });
  }, [activeId]);

  function onInputKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
    }
  }

  if (!mounted || !present) return null;

  return createPortal(
    <div
      className="command-palette-root"
      data-open={visible ? "true" : "false"}
    >
      <div
        className="command-palette-backdrop"
        onClick={close}
      />
      <div
        ref={panelRef}
        id="command-palette"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className="command-palette"
      >
        <div className="command-palette-header">
          <label className="command-palette-search" htmlFor={`${listId}-input`}>
            <SearchIcon />
            <span id={labelId} className="sr-only">
              Search pages and projects
            </span>
            <input
              ref={inputRef}
              id={`${listId}-input`}
              className="command-palette-input text-body"
              type="text"
              value={query}
              placeholder="Search pages & projects"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-activedescendant={activeId}
              aria-autocomplete="list"
              onChange={(event) => setQuery(event.target.value)}
              onKeyDown={onInputKeyDown}
            />
          </label>
          <button
            type="button"
            className="command-palette-close"
            onClick={close}
          >
            Close
            <span className="command-palette-kbd" aria-hidden>
              Esc
            </span>
          </button>
        </div>

        {items.length ? (
          <ul
            id={listId}
            role="listbox"
            aria-label="Pages and projects"
            className="command-palette-list"
          >
            {items.some((item) => item.kind === "page") ? (
              <li role="presentation" className="command-palette-heading">
                Pages
              </li>
            ) : null}
            {items.map((item, index) => {
              const prev = items[index - 1];
              const showProjectsHeading =
                item.kind === "project" && prev?.kind !== "project";
              const optionId = `${listId}-${item.id}`;
              const isSelected = index === selected;
              return (
                <Fragment key={item.id}>
                  {showProjectsHeading ? (
                    <li role="presentation" className="command-palette-heading">
                      {needle ? "Projects" : "Selected projects"}
                    </li>
                  ) : null}
                  <li
                    id={optionId}
                    role="option"
                    aria-selected={isSelected}
                    data-kind={item.kind}
                    className="command-palette-option text-body cursor-pointer"
                    onMouseEnter={() => setSelected(index)}
                    onClick={() => go(item)}
                  >
                    {item.kind === "project" ? (
                      <span
                        aria-hidden
                        className="size-2"
                        style={{ backgroundColor: item.color }}
                      />
                    ) : null}
                    <span className="truncate">{item.label}</span>
                  </li>
                </Fragment>
              );
            })}
          </ul>
        ) : (
          <p className="command-palette-list command-palette-empty text-body">
            No results found.
          </p>
        )}

        <div className="command-palette-footer" aria-hidden>
          <div className="command-palette-hint">
            <span className="command-palette-kbd command-palette-kbd--key">↑</span>
            <span className="command-palette-kbd command-palette-kbd--key">↓</span>
            <span>Navigate</span>
          </div>
          <div className="command-palette-hint">
            <span>Go</span>
            <span className="command-palette-go">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/icons/command-go.svg"
                alt=""
                width={21}
                height={21}
              />
            </span>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
