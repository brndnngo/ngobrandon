import type { Metadata } from "next";
import Link from "next/link";
import { ProjectCardLink } from "@/components/home/ProjectCardLink";
import { Container } from "@/components/layout/Container";
import { FooterCTA } from "@/components/layout/FooterCTA";
import { getProjectCards } from "@/lib/sanity/fetch";

export const metadata: Metadata = {
  title: { absolute: "Brandon Ngo — Senior product designer" },
  description:
    "Product designer in Los Angeles. Currently leading product and design at Watch Club.",
};

export default async function HomePage() {
  const projects = await getProjectCards();

  return (
    <>
      <section data-nav="light">
        <Container className="grid gap-8 py-20 md:grid-cols-3">
          <p data-reveal className="text-body">
            I&rsquo;m a product designer based in LA.
          </p>
          <p data-reveal className="text-body">
            At the moment, I&rsquo;m leading product and design at{" "}
            <Link href="/project/wc" className="underline underline-offset-4">
              Watch Club
            </Link>
            <sup className="text-muted">1</sup>, a social streaming platform for
            microdramas.
            <br />
            <br />
            Before that I spent four years at{" "}
            <Link
              href="/project/receive"
              className="underline underline-offset-4"
            >
              Amazon
            </Link>
            <sup className="text-muted">2</sup> building tools for warehouse
            associates across the world.
          </p>
          <p data-reveal className="text-body">
            My background spans{" "}
            <Link
              href="/project/literal"
              className="underline underline-offset-4"
            >
              digital experiences
            </Link>
            <sup className="text-muted">3</sup>,{" "}
            <Link
              href="/project/playbook"
              className="underline underline-offset-4"
            >
              brand identity
            </Link>
            <sup className="text-muted">4</sup>, and{" "}
            <Link
              href="/project/alchemy"
              className="underline underline-offset-4"
            >
              design systems
            </Link>
            <sup className="text-muted">5</sup>. I&rsquo;ve led teams and worked
            hands-on to shape culture, experiences, and long-term direction.
          </p>
        </Container>
      </section>

      <section data-nav="light">
        <Container className="grid gap-16 pb-24 md:grid-cols-2">
          {projects.map((card) => (
            <ProjectCardLink key={card.slug} card={card} />
          ))}
        </Container>
      </section>

      <FooterCTA />
    </>
  );
}
