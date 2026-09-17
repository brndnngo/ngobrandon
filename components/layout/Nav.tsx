"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bracket } from "@/components/layout/Bracket";
import { navLinks, siteConfig } from "@/lib/site";

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Nav() {
  const pathname = usePathname();

  return (
    <header
      className="fixed inset-x-0 top-0 z-[999] h-(--nav-height) text-(--color-nav-foreground)"
      style={{ transition: "color 300ms ease" }}
    >
      <div className="page-column relative flex h-full items-center justify-between">
        <Link href="/" className="text-body hover:opacity-60">
          {siteConfig.name}
        </Link>

        <nav aria-label="Primary">
          <ul className="flex items-center gap-6">
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

        <div className="pointer-events-none absolute inset-x-0 bottom-0">
          <Bracket direction="down" />
        </div>
      </div>
    </header>
  );
}
