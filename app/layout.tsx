import type { Metadata } from "next";
import { fontVariables } from "@/app/fonts";
import { Footer } from "@/components/layout/Footer";
import { Nav } from "@/components/layout/Nav";
import { NavScrim } from "@/components/layout/NavScrim";
import { siteConfig } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "Product designer in Los Angeles working across digital experiences, brand identity, and design systems.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-nav-theme="light"
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <NavScrim />
        <Nav />
        <main className="flex-1 pt-(--nav-height)">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
