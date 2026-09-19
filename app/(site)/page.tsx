import type { Metadata } from "next";
import Link from "next/link";
import { PhotoStrip } from "@/components/home/PhotoStrip";
import { WorkIndex } from "@/components/home/WorkIndex";
import { Bracket } from "@/components/layout/Bracket";
import { Clock } from "@/components/layout/Clock";
import { FooterRow } from "@/components/layout/FooterRow";
import { filmFrames } from "@/content/film";
import { siteConfig } from "@/lib/site";
import { getProjectCards } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: { absolute: "Brandon Ngo — Senior product designer" },
  description:
    "Product designer in Los Angeles. Currently leading product and design at Watch Club.",
};

function HomeBio() {
  return (
    <div className="home-bio page-grid gap-y-6 pt-4 pb-8">
      <p className="page-grid-left text-heading text-muted">
        <span className="text-foreground">{siteConfig.name}</span> is a product
        designer based in LA — working across product and design systems.
      </p>

      <div className="page-grid-bio flex flex-col gap-4">
        <p className="text-body">
          At the moment, I&rsquo;m leading product and design at Watch Club, a
          social streaming platform for microdramas. Before that I spent four
          years at Amazon building tools for warehouse associates across the
          world.
        </p>
        <p className="text-body">
          My background spans digital experiences, brand identity, and design
          systems. I&rsquo;ve led teams and worked hands-on to shape culture,
          experiences, and long-term direction.
        </p>
      </div>

      <div className="col-span-full">
        <Bracket direction="down" />
      </div>
    </div>
  );
}

export default async function HomePage() {
  const projects = await getProjectCards();

  return (
    <main className="home-snap">
      <section data-nav="light" className="home-snap-section home-snap-section--top">
        <div className="home-snap-section-inner">
          <HomeBio />

          <WorkIndex projects={projects} />
        </div>
      </section>

      <FooterRow className="home-footer" />

      <section data-nav="light" className="home-snap-section">
        <div className="home-snap-section-inner home-snap-section-inner--after-footer">
          <div className="flex flex-1 flex-col justify-center">
            <PhotoStrip photos={filmFrames} />
            <div className="page-grid">
              <div className="page-grid-bio home-wordmark-slot">
                <p className="home-wordmark" aria-hidden>
                  {siteConfig.name}
                </p>
              </div>
            </div>
          </div>

          <div className="page-grid pb-6">
            <Link
              href="/film"
              className="page-grid-left text-body text-muted hover:opacity-60"
            >
              More photos here
            </Link>
            <div className="page-grid-clock justify-self-end">
              <Clock variant="bar" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
