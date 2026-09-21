"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CommandKIcon } from "@/components/layout/CommandIcons";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { navLinks, siteConfig } from "@/lib/site";
import type { ProjectCard } from "@/lib/sanity/types";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function isApplePlatform() {
  return /Mac|iPhone|iPad|iPod/.test(navigator.userAgent);
}

export function Nav({ projects }: { projects: ProjectCard[] }) {
  const pathname = usePathname();
  const menuRef = useRef<HTMLButtonElement>(null);
  const pathRef = useRef(pathname);
  const [open, setOpen] = useState(false);
  const [shortcut, setShortcut] = useState("⌘K");

  useEffect(() => {
    setShortcut(isApplePlatform() ? "⌘K" : "Ctrl K");
  }, []);

  useEffect(() => {
    if (pathRef.current === pathname) return;
    pathRef.current = pathname;
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.code !== "KeyK" && event.key.toLowerCase() !== "k") return;
      if (!(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((current) => !current);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className="site-nav fixed inset-x-0 top-0 z-[1100] h-(--nav-height) text-(--color-nav-foreground)"
        style={{ transition: "color 300ms ease" }}
      >
        <div className="page-grid h-full items-center">
          <Link href="/" className="page-grid-left text-body hover:opacity-60">
            {siteConfig.name}
          </Link>

          <div className="page-grid-right flex items-center justify-between gap-4">
            <nav aria-label="Primary" className="max-md:hidden">
              <ul className="flex items-center gap-(--spacing-nav)">
                {navLinks.map((link) => {
                  const active = isActive(pathname, link.href);
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        aria-current={active ? "page" : undefined}
                        className={
                          active
                            ? "text-body opacity-100"
                            : "text-body opacity-60 hover:opacity-100"
                        }
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>

            <button
              ref={menuRef}
              type="button"
              aria-label="Menu"
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls="command-palette"
              className="group flex cursor-pointer items-baseline gap-(--spacing-nav-kbd) text-body outline-none"
              onClick={() => setOpen((current) => !current)}
            >
              <span className="group-hover:opacity-60">Menu</span>
              <kbd className="site-nav-kbd">
                {shortcut === "⌘K" ? <CommandKIcon /> : shortcut}
              </kbd>
            </button>
          </div>
        </div>
      </header>

      <CommandPalette
        open={open}
        onOpenChange={setOpen}
        projects={projects}
        triggerRef={menuRef}
      />
    </>
  );
}
