import type { Metadata } from "next";
import { HomeScroll } from "@/components/home/HomeScroll";
import { PhotoStrip } from "@/components/home/PhotoStrip";
import { WorkIndex } from "@/components/home/WorkIndex";
import { Bracket } from "@/components/layout/Bracket";
import { Clock } from "@/components/layout/Clock";
import { FooterRow } from "@/components/layout/FooterRow";
import { siteConfig } from "@/lib/site";
import { getProjectCards } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: { absolute: "Brandon Ngo — Senior product designer" },
  description:
    "Product designer in Los Angeles. Currently leading product and design at Watch Club.",
};

function HomeBio() {
  return (
    <div className="home-bio page-grid gap-y-6 pt-6">
      <p className="page-grid-intro font-display text-heading text-muted">
        <span className="text-foreground">{siteConfig.name}</span> is a product
        designer based in LA — working across product and design systems.
      </p>

      <div className="col-span-full">
        <Bracket direction="down" />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const projects = await getProjectCards();

  return (
    <HomeScroll>
      <section data-nav="light" className="home-snap-section home-snap-section--top">
        <div className="home-snap-section-inner">
          <HomeBio />

          <WorkIndex projects={projects} />
        </div>
      </section>

      <div className="home-end">
        <FooterRow className="home-footer" />

        <section data-nav="light" className="home-snap-section">
          <div className="home-snap-section-inner home-snap-section-inner--after-footer">
            <div className="home-photo-cluster">
              <PhotoStrip />
              <div className="page-grid">
                <div className="page-grid-bio home-wordmark-slot">
                  <p className="home-wordmark" aria-hidden>
                    {siteConfig.name}
                  </p>
                </div>
              </div>
            </div>

            <div className="page-grid home-photo-bar">
              <p className="home-photo-credit font-medium text-eyebrow text-muted">
                Built with Next.js + v0 © 2026
              </p>
              <div className="page-grid-clock home-photo-clock">
                <Clock variant="bar" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </HomeScroll>
  );
}
