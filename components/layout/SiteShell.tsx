"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { NavBracket } from "@/components/layout/NavBracket";
import { NavScrim } from "@/components/layout/NavScrim";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { NavThemeController } from "@/components/motion/NavThemeController";
import { RevealController } from "@/components/motion/RevealController";
import type { ProjectCard } from "@/lib/sanity/types";

export function SiteShell({
  children,
  projects,
}: {
  children: React.ReactNode;
  projects: ProjectCard[];
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isInfo = pathname === "/info";
  const isCaseStudy =
    pathname.startsWith("/project/") || pathname.startsWith("/gated/");

  return (
    <ThemeProvider>
      <NavScrim />
      <Nav projects={projects} />
      {isInfo || isCaseStudy ? <NavBracket /> : null}
      <RevealController />
      <NavThemeController />
      {isHome ? (
        children
      ) : isInfo || isCaseStudy ? (
        <main className="flex flex-1 flex-col pt-(--nav-height)">
          {children}
        </main>
      ) : (
        <>
          <main className="page-column flex-1 pt-(--nav-height)">{children}</main>
          <Footer />
        </>
      )}
    </ThemeProvider>
  );
}
