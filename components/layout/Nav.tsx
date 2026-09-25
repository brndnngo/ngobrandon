"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CommandKIcon } from "@/components/layout/CommandIcons";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { MenuCloseIcon, MenuLinesIcon } from "@/components/layout/MenuIcons";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { navLinks, siteConfig } from "@/lib/site";
import type { ProjectCard } from "@/lib/sanity/types";

const PHONE_QUERY = "(hover: none) and (pointer: coarse)";

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
  const [phone, setPhone] = useState(false);
  const [shortcut, setShortcut] = useState("⌘K");
  const phoneRef = useRef(phone);

  useEffect(() => {
    setShortcut(isApplePlatform() ? "⌘K" : "Ctrl K");
  }, []);

  useEffect(() => {
    const query = window.matchMedia(PHONE_QUERY);
    const apply = () => setPhone(query.matches);
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (phoneRef.current === phone) return;
    phoneRef.current = phone;
    setOpen(false);
  }, [phone]);

  useEffect(() => {
    if (pathRef.current === pathname) return;
    pathRef.current = pathname;
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (phone) return;

    function onKey(event: KeyboardEvent) {
      if (event.code !== "KeyK" && event.key.toLowerCase() !== "k") return;
      if (!(event.metaKey || event.ctrlKey)) return;
      event.preventDefault();
      setOpen((current) => !current);
    }

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [phone]);

  return (
    <>
      <header
        className="site-nav fixed inset-x-0 top-0 z-[1100] box-border h-(--nav-height) py-2 max-md:py-0 text-(--color-nav-foreground)"
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
              aria-label={phone && open ? "Close" : "Menu"}
              aria-haspopup="dialog"
              aria-expanded={open}
              aria-controls={phone ? "mobile-menu" : "command-palette"}
              className={`group flex cursor-pointer items-center gap-(--spacing-nav-kbd) text-body outline-none${phone ? " menu-icon-button" : ""}`}
              onClick={() => setOpen((current) => !current)}
            >
              {phone ? (
                open ? <MenuCloseIcon /> : <MenuLinesIcon />
              ) : (
                <>
                  <span className="group-hover:opacity-60">Menu</span>
                  <kbd className="site-nav-kbd">
                    {shortcut === "⌘K" ? <CommandKIcon /> : shortcut}
                  </kbd>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {phone ? (
        <MobileMenu
          open={open}
          onOpenChange={setOpen}
          projects={projects}
          triggerRef={menuRef}
        />
      ) : (
        <CommandPalette
          open={open}
          onOpenChange={setOpen}
          projects={projects}
          triggerRef={menuRef}
        />
      )}
    </>
  );
}
