import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { FooterCTA } from "@/components/layout/FooterCTA";

export const metadata: Metadata = {
  title: "About",
  description:
    "Product designer in Los Angeles with seven years of experience across Amazon, Watch Club, and early-stage startups.",
};

const WEBFLOW =
  "https://cdn.prod.website-files.com/5e0553880aa5291e8f7d47e0";

const history = [
  {
    href: "/project/wc",
    name: "Watch Club",
    dates: "Present",
    note: "Social streaming built around shared moments",
  },
  {
    href: "/project/alchemy",
    name: "Amazon",
    dates: "2022 – 2026",
    note: "Tools to optimize the associate experience in fulfillment centers all over the world",
  },
  {
    href: "/project/literal",
    name: "Literal",
    dates: "2021",
    note: "A new way of reading for the next generation",
  },
  {
    href: "/project/playbook",
    name: "Rollout",
    dates: "2020",
    note: "(fka Playbook) Platform for AI-powered workflow automations",
  },
  {
    href: "https://hci.ucla.edu/",
    name: "UCLA HCI",
    dates: "2020",
    note: "Natural language processing research under Professor Xiang Chen",
    external: true,
  },
  {
    href: "https://resortpass.com/",
    name: "ResortPass",
    dates: "2019",
    note: "Day passes to the best hotel experiences and amenities",
    external: true,
  },
];

const giving = [
  {
    href: "https://www.queerdesign.club/",
    name: "Queer Design Club",
    dates: "2021",
    note: "Mentoring LGBTQIA+ youth to break into design spaces in tech",
  },
  {
    href: "https://www.productspace.org/meet-the-team-1",
    name: "Product Space",
    dates: "2020",
    note: "Teaching design + product thinking to a cohort of students",
  },
];

function Row({
  href,
  name,
  dates,
  note,
  external,
}: {
  href: string;
  name: string;
  dates: string;
  note: string;
  external?: boolean;
}) {
  const Tag = external ? "a" : Link;
  const extra = external
    ? { target: "_blank", rel: "noreferrer" as const }
    : {};

  return (
    <li className="grid gap-2 border-t border-(--color-border) py-6 md:grid-cols-[8rem_1fr_8rem] md:items-baseline">
      <Tag href={href} {...extra} className="text-body hover:opacity-60">
        {name} {external ? <span aria-hidden>↗</span> : null}
      </Tag>
      <p className="text-body text-muted">{note}</p>
      <p className="text-eyebrow text-muted md:text-right">{dates}</p>
    </li>
  );
}

export default function AboutPage() {
  return (
    <>
      <section data-nav="light">
        <Container className="grid gap-12 py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <div data-reveal>
            <h1 className="max-w-[14ch] font-display text-display">
              Nice to meet you, I&rsquo;m Brandon.
            </h1>
            <div className="mt-10 max-w-prose space-y-5 text-body">
              <p>
                I&rsquo;m a product designer based in LA. I have over 7 years of
                experience designing products for emerging startups and
                established enterprises. I&rsquo;ve led the{" "}
                <Link href="/project/alchemy" className="underline underline-offset-4">
                  creation of design systems
                </Link>{" "}
                and{" "}
                <Link href="/project/receive" className="underline underline-offset-4">
                  tooling at Amazon
                </Link>{" "}
                to drive efficiency across the global fulfillment warehouse
                ecosystem. In the past, I&rsquo;ve taught product and design to a
                couple of fellows under{" "}
                <a
                  href="https://www.productspace.org/meet-the-team-1"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  Product Space
                </a>
                .
              </p>
              <p>
                I am constantly striving to push myself to learn more in
                whatever I do, reminding myself that{" "}
                <a
                  href="https://www.makeworkbetter.info/p/every-second-counts-the-bear-is-the"
                  target="_blank"
                  rel="noreferrer"
                  className="underline underline-offset-4"
                >
                  every second counts
                </a>
                . Design is one of those passions turned into a career — I am on
                a journey to create products that bring more value to people.
              </p>
            </div>
          </div>

          <div data-reveal className="relative aspect-[4/5] overflow-hidden bg-(--color-subtle)">
            <Image
              src={`${WEBFLOW}/6854dab4cbe3fb361e2604b0_image%2075.png`}
              alt="Portrait of Brandon Ngo"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
              priority
            />
          </div>
        </Container>
      </section>

      <section data-nav="light">
        <Container className="pb-24">
          <h2 data-reveal className="text-heading">
            Where I&rsquo;ve been
          </h2>
          <ul className="mt-8">
            {history.map((item) => (
              <Row key={item.name + item.dates} {...item} />
            ))}
          </ul>

          <h2 data-reveal className="mt-20 text-heading">
            Giving back
          </h2>
          <ul className="mt-8">
            {giving.map((item) => (
              <Row key={item.name} {...item} external />
            ))}
          </ul>

          <div data-reveal className="mt-20 max-w-prose">
            <h2 className="text-heading">Education</h2>
            <p className="mt-4 text-body">University of California, Los Angeles</p>
            <p className="text-body text-muted">
              B.S. Cognitive Science
              <br />
              Concentration in user experience + digital humanities
            </p>
          </div>
        </Container>
      </section>

      <FooterCTA />
    </>
  );
}
