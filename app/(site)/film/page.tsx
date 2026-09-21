import type { Metadata } from "next";
import { Filmstrip } from "@/components/film/Filmstrip";
import { Container } from "@/components/layout/Container";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { filmFrames } from "@/content/film";

export const metadata: Metadata = {
  title: "Film+",
  description:
    "Slices of life taken on traditional film and a Fuji X100VI.",
};

export default function FilmPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <section data-nav="dark" className="pb-8">
        <Container className="flex items-end justify-between pt-16 pb-10">
          <div>
            <h1 className="font-display text-display">Film⁺</h1>
            <p className="mt-4 max-w-md text-body text-muted">
              Slices of life taken on traditional film and my Fuji X100VI.
            </p>
          </div>
        </Container>
        <Filmstrip frames={filmFrames} />
      </section>
      <FooterCTA />
    </div>
  );
}
