"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { NavScrim } from "@/components/layout/NavScrim";
import { NavThemeController } from "@/components/motion/NavThemeController";
import { RevealController } from "@/components/motion/RevealController";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isInfo = pathname === "/info";

  return (
    <>
      <NavScrim />
      <Nav />
      <RevealController />
      <NavThemeController />
      {isHome ? (
        children
      ) : isInfo ? (
        <main className="flex-1 pt-(--nav-height)">{children}</main>
      ) : (
        <>
          <main className="page-column flex-1 pt-(--nav-height)">{children}</main>
          <Footer />
        </>
      )}
    </>
  );
}
