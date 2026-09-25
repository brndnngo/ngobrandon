"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Bracket } from "@/components/layout/Bracket";
import { CopyEmailButton } from "@/components/layout/CopyEmailButton";
import {
  projectColor,
  projectHref,
  projectIndexTitle,
  projectIsExternal,
} from "@/lib/project-card";
import { navLinks, socialLinks } from "@/lib/site";
import type { ProjectCard } from "@/lib/sanity/types";

const FOCUSABLE =
  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileMenu({
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
  const pathname = usePathname();
  const panelRef = useRef<HTMLDivElement>(null);
  const [present, setPresent] = useState(open);
  const [visible, setVisible] = useState(open);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setPresent(true);
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
    if (!present) return;
    document.documentElement.setAttribute("data-cmd-open", "");
    document.documentElement.setAttribute("data-mobile-menu", "");
    return () => {
      document.documentElement.removeAttribute("data-cmd-open");
      document.documentElement.removeAttribute("data-mobile-menu");
    };
  }, [present]);

  const close = useCallback(() => onOpenChange(false), [onOpenChange]);

  useEffect(() => {
    if (!open || !present) return;

    const panel = panelRef.current;
    panel?.focus();

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

      if (event.key !== "Tab" || !panel) return;
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
    }

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [close, open, present]);

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

  if (!mounted || !present) return null;

  return createPortal(
    <div
      ref={panelRef}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      tabIndex={-1}
      data-open={visible ? "true" : "false"}
      className="mobile-menu"
    >
      <div className="mobile-menu-body">
        <div className="page-grid">
          <div className="col-span-full">
            <Bracket orientation="down" />
          </div>
        </div>

        <div className="page-grid mobile-menu-grid">
          <nav aria-label="Primary" className="mobile-menu-pages">
            <ul>
              {navLinks.map((link) => {
                const active = isActive(pathname, link.href);
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      aria-current={active ? "page" : undefined}
                      className={
                        active
                          ? "mobile-menu-page"
                          : "mobile-menu-page mobile-menu-page--idle"
                      }
                      onClick={close}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {projects.length ? (
            <div className="mobile-menu-projects">
              <p className="mobile-menu-label">Selected projects</p>
              <ul>
                {projects.map((card) => {
                  const href = projectHref(card);
                  const external = projectIsExternal(card);
                  const title = projectIndexTitle(card);
                  const active = !external && isActive(pathname, href);
                  const className = active
                    ? "mobile-menu-project"
                    : "mobile-menu-project mobile-menu-project--idle";

                  const mark = (
                    <span
                      aria-hidden
                      className="mobile-menu-mark"
                      style={{ backgroundColor: projectColor(card) }}
                    />
                  );

                  return (
                    <li key={card.slug}>
                      {external ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer"
                          className={className}
                          onClick={close}
                        >
                          {mark}
                          <span>{title}</span>
                        </a>
                      ) : (
                        <Link href={href} className={className} onClick={close}>
                          {mark}
                          <span>{title}</span>
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="mobile-menu-foot">
          <div className="page-grid">
            <div className="col-span-full">
              <Bracket orientation="up" />
            </div>
          </div>
          <div className="page-grid mobile-menu-foot-row">
            <CopyEmailButton variant="plain" />
            <div>
              <p className="font-medium text-eyebrow text-muted">Connect with me</p>
              <ul className="mt-1 flex items-center gap-4">
                {socialLinks.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-body hover:opacity-60"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
