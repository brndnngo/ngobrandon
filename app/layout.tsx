import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { fontVariables } from "@/app/fonts";
import { siteConfig } from "@/lib/site";
import { THEME_BOOT_SCRIPT } from "@/lib/theme/boot-script";
import { THEME_COLOR } from "@/lib/theme/resolve";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.name}`,
  },
  description:
    "Product designer in Los Angeles working across digital experiences, brand identity, and design systems.",
  alternates: {
    canonical: "/",
  },
};

export const viewport: Viewport = {
  themeColor: THEME_COLOR.light,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="light"
      data-nav-theme="light"
      suppressHydrationWarning
      className={`${fontVariables} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Script
          id="theme-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }}
        />
        {children}
      </body>
    </html>
  );
}
