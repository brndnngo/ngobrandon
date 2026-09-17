import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { NavScrim } from "@/components/layout/NavScrim";
import { NavThemeController } from "@/components/motion/NavThemeController";
import { RevealController } from "@/components/motion/RevealController";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavScrim />
      <Nav />
      <RevealController />
      <NavThemeController />
      <main className="page-column flex-1 pt-(--nav-height)">{children}</main>
      <Footer />
    </>
  );
}
