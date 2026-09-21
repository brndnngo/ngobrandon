"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navLinks, siteConfig } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="site-nav fixed inset-x-0 top-0 z-[999] h-(--nav-height) text-(--color-nav-foreground)"
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
            type="button"
            aria-label="Open menu"
            className="flex items-baseline gap-(--spacing-nav-kbd) text-body"
          >
            Menu
            <kbd className="inline-flex items-center rounded-(--nav-kbd-radius) bg-subtle px-(--nav-kbd-padding-x) py-(--nav-kbd-padding-y) font-sans text-[14px] leading-none font-normal tracking-[-0.05em] text-muted">
              ⌘K
            </kbd>
          </button>
        </div>
      </div>
    </header>
  );
}
