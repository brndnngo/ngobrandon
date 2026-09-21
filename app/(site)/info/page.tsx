import type { Metadata } from "next";
import { ExperienceGroup } from "@/components/info/ExperienceGroup";
import { Bracket } from "@/components/layout/Bracket";
import { FooterRow } from "@/components/layout/FooterRow";
import { Em } from "@/components/text/Em";
import { experienceGroups } from "@/content/info";

export const metadata: Metadata = {
  title: "About",
  description:
    "Product designer in Los Angeles with seven years of experience across Amazon, Watch Club, and early-stage startups.",
};

export default function InfoPage() {
  return (
    <>
      <section data-nav="light">
        <div className="page-grid pt-10">
          <div className="page-grid-inset">
            <h1 className="font-display text-title">
              Nice to meet you, I&rsquo;m Brandon.
            </h1>
            <div className="mt-2 flex flex-col gap-8">
              <p className="font-display text-heading text-muted">
                I am a Vietnamese-American product designer based in Los
                Angeles. I have over 7 years of experience designing for
                enterprises and startups, focused on{" "}
                <Em href="/project/receive">scaling internal tools</Em> and
                launching{" "}
                <Em href="/project/wc">consumer social features</Em>.
              </p>
              <p className="font-display text-heading text-muted">
                I&rsquo;ve led the creation of design systems and tooling at{" "}
                <Em href="/project/alchemy">Amazon</Em> to drive efficiency
                across the global fulfillment warehouse ecosystem. In the past,
                I&rsquo;ve taught product thinking and UX design to emerging
                talent under{" "}
                <Em href="https://productspaceucla.org/">Product Space</Em>.
              </p>
            </div>
          </div>

          <div className="page-grid-inset mt-8">
            <Bracket direction="down" />
          </div>
        </div>

        <div className="mt-8 pb-16">
          {experienceGroups.map((group, index) => (
            <div key={group.label}>
              {index > 0 ? (
                <div className="page-grid py-6">
                  <div className="page-grid-inset border-t border-foreground/20" />
                </div>
              ) : null}
              <ExperienceGroup group={group} />
            </div>
          ))}
        </div>
      </section>

      <FooterRow />
    </>
  );
}
