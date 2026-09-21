import { block, panel, stats, steps } from "./pt";
import type { ProjectBody, ProjectCard, ProjectHero } from "@/lib/sanity/types";

export const seedCards: ProjectCard[] = [
  {
    slug: "wc",
    title: "Watch Club",
    cardTitle: "Social streaming built around shared moments",
    year: "2026",
    summary:
      "I joined as a senior product designer and became the product manager for a social streaming platform built around microdramas.",
    gated: true,
    order: 1,
    selected: true,
    discipline: "Experience design",
    color: "#171717",
  },
  {
    slug: "alchemy",
    title: "Amazon",
    indexTitle: "Amazon Alchemy",
    cardTitle: "Design systems for warehouses worldwide",
    year: "2025",
    summary:
      "I led key efforts on the Alchemy Design System as part of an ongoing 3-year initiative to unify design standards across the fulfillment network.",
    gated: true,
    order: 2,
    selected: true,
    discipline: "Design systems",
    color: "#FF9900",
  },
  {
    slug: "receive",
    title: "Amazon",
    indexTitle: "Amazon Receive",
    cardTitle: "Streamlining tracking & processing inventory",
    year: "2023",
    summary:
      "I led the design of two programs that replaced 20+ legacy tools and standardized how Amazon's fulfillment centers receive inventory.",
    gated: true,
    order: 3,
    discipline: "Product design",
    color: "#232F3E",
  },
  {
    slug: "literal",
    title: "Literal",
    cardTitle: "Reimagining reading for the new generation",
    year: "2021",
    summary:
      "I redesigned the reading experience for an EdTech platform serving 800K+ students nationwide.",
    gated: false,
    order: 4,
    discipline: "Product design",
    color: "#2B6CB0",
  },
  {
    slug: "playbook",
    title: "Playbook",
    cardTitle: "Laying the foundation for a scalable design system",
    year: "2020",
    summary:
      "I partnered with Playbook’s founding team to establish the company’s early visual and interaction foundations.",
    gated: false,
    order: 5,
    discipline: "Design systems",
    color: "#6B4F3A",
  },
  {
    slug: "ucla-hci",
    title: "UCLA HCI",
    cardTitle: "Natural language processing research under Professor Xiang Chen",
    year: "2020",
    summary:
      "Natural language processing research under Professor Xiang Chen.",
    gated: false,
    order: 6,
    discipline: "Research",
    color: "#2774AE",
    href: "https://hci.ucla.edu/",
  },
];

const heroes: Record<string, ProjectHero> = {
  wc: {
    slug: "wc",
    title: "Watch Club",
    summary:
      "I joined as a senior product designer and became the product manager for a social streaming platform built around microdramas. I pivoted the team and our product from iOS-only to hybrid and designed its core mechanic: clipping, so fans can share the moments they love and pull each other back into the show.",
    impact: [
      "64% of posts contained a clip from Clipping or Scene Pack",
      "71% of users reclipped a post from the feed or video player",
      "83% of clips sent a fan back into the full episode",
    ],
    timeline: "Apr 2026 – Present",
    role: "Senior product designer & product manager",
    collaborators: [
      { name: "Sebastien Audeon", role: "Software engineer (iOS)" },
      { name: "Tina Holly", role: "Software engineer (Android)" },
      { name: "Brandon Pancost", role: "Software engineer (Backend)" },
      { name: "Darcy McSwain", role: "Associate product designer" },
      { name: "Matthew Jacquez", role: "Growth marketing" },
      { name: "Devon Albert-Stone", role: "Producer" },
    ],
    gated: true,
  },
  alchemy: {
    slug: "alchemy",
    title: "Amazon",
    summary:
      "I led key efforts on the Alchemy Design System as part of an ongoing 3-year initiative to unify design standards and build scalable, inclusive, and localizable experiences across the fulfillment network.",
    impact: [
      "70+ standardized components & tokens adopted across teams",
      "24 product teams onboarded to the Alchemy Design System",
      "300+ legacy patterns consolidated into unified components",
      "40% reduction in design & engineering time for new features",
    ],
    timeline: "May 2023 – Jan 2026",
    role: "Lead UX designer, design systems",
    collaborators: [
      { name: "David Cleveland", role: "Senior UX designer" },
      { name: "Marie Banny", role: "Senior UX designer" },
      { name: "Sean Kendall", role: "Senior UX designer" },
      { name: "Ben Michoux", role: "Principal frontend engineer" },
      { name: "Zac Rogerson", role: "Senior frontend engineer" },
      { name: "Rachael Burno", role: "Principal UX researcher" },
    ],
    gated: true,
  },
  receive: {
    slug: "receive",
    title: "Amazon",
    summary:
      "I led the design of two programs that replaced 20+ legacy tools and standardized how Amazon's fulfillment centers receive inventory. By addressing bottlenecks in pallet inspection and material tracking, the work reduced packaging defects network-wide and became the default workflow for 250,000+ associates.",
    impact: [
      "250,000+ active users across US/EU fulfillment centers",
      "97% pallet receive adoption",
      "<2% depalletization defects network-wide",
      "20+ legacy tools deprecated",
    ],
    timeline: "Jul 2022 – Aug 2023",
    role: "Lead UX designer, enterprise systems",
    collaborators: [
      { name: "DD Chang", role: "Principal product manager" },
      { name: "Brad Sweet", role: "Senior product manager" },
      { name: "Ruslan Khmelyuk", role: "Engineering lead" },
      { name: "Eric Liao", role: "Senior software engineer" },
      { name: "Hailei Schatz", role: "Operations lead" },
      { name: "Gina Donlin", role: "Senior UX researcher" },
      { name: "Scott Nguyen", role: "Senior UX designer, accessibility" },
    ],
    gated: true,
  },
  literal: {
    slug: "literal",
    title: "Literal",
    summary:
      "I redesigned the reading experience for an EdTech platform serving 800K+ students nationwide, transforming how Gen Z engages with digital books by identifying key engagement barriers and rethinking how students discover and consume content.",
    impact: [
      "Redesigned the reader experience tailored to Gen Z reading habits",
      "Rebuilt the browse experience to reduce friction between discovery and commitment",
      "Designed a full component library covering buttons, navigation, dropdowns, and iconography",
      "Alpha pilot showed reading completion up 7% and session time up 11 minutes",
    ],
    timeline: "Sep 2020 – Feb 2021",
    role: "Product designer",
    collaborators: [
      { name: "Lawton Smith", role: "CEO, Product" },
      { name: "Michael Romrell", role: "CTO, Engineering lead" },
      { name: "Ricardo Cotillo", role: "Software engineer" },
      { name: "Acacia Fante", role: "Area partner manager" },
    ],
    gated: false,
  },
  playbook: {
    slug: "playbook",
    title: "Playbook",
    summary:
      "I partnered closely with Playbook’s founding team during a six-month contract to establish the company’s early visual and interaction foundations. The work focused on defining a flexible design system that could support both product development and early brand expression as the product and company shaped their identity.",
    impact: [
      "Defined a core design system spanning typography, color, layout, and component behavior",
      "Applied system foundations across product UI, marketing surfaces, and investor-facing materials",
      "Established a scalable visual foundation the company continued to build on as it matured",
    ],
    timeline: "Aug 2020 – Dec 2020",
    role: "Product designer",
    collaborators: [
      { name: "Alkarim Lalani", role: "CEO" },
      { name: "Blaise Bradley", role: "CTO" },
    ],
    gated: false,
  },
};

const bodies: Record<string, ProjectBody> = {
  playbook: [
    block("Building early foundations for credibility", "h2"),
    block(
      "Playbook (now Rollout) was an early-stage startup focused on AI workflow automation, coming off a recent round of VC funding. The team needed visual assets that could clearly represent the company to shareholders, while also establishing a visual foundation that wouldn’t need rework as the company matured. My focus was on defining the core design system early, and using early brand and marketing work to ensure those foundations could support a company with a rapidly evolving product still defining its voice and direction.",
    ),
    block(
      "With the product and brand still evolving, the system needed to be flexible without becoming vague.",
      "h3",
    ),
    block(
      "I focused on defining a small set of structural decisions — typography, color, and component behavior — that could support both marketing surfaces and product UI without fragmenting as new use cases emerged.",
    ),
    panel({
      eyebrow: "System foundations",
      title: "Component behavior",
      body: "A constrained set of type, color, and interaction rules that could stretch across product, marketing, and investor surfaces.",
    }),
    block("Validating the system through real use", "h2"),
    block(
      "Once the foundations were in place, the system was used across both product and marketing to validate that it could support real content, real workflows, and evolving requirements. Templates, dashboards, and pitch decks surfaced different constraints, but relied on the same underlying structure.",
    ),
    block("Setting the system up to scale", "h2"),
    block(
      "As Playbook was still early in shaping its identity, the system was designed to be intentionally constrained — favoring clear structure over exhaustive coverage. By establishing a small, flexible set of foundations and validating them through real use, the team was able to grow the product and brand without revisiting core design decisions.",
    ),
  ],
  literal: [
    block("Gen Z isn’t reading less — they’re reading differently.", "h2"),
    block(
      "Between TikTok, texting, and other social media, students are used to consuming information in short, interactive bursts — not sitting down with long-form text. Literal had 800K+ students on the platform, but engagement data revealed a problem: students were scrolling through books without actually reading.",
    ),
    block("Reading on Literal feels sterile and disengaging.", "h2"),
    block(
      "After interviewing 50 middle and high school students, a pattern emerged: Literal needed to feel more interactive and social like the apps students are already using, but missed the mark when it came to execution.",
    ),
    block(
      "The existing experience was wildly inconsistent and hard to use.",
      "h3",
    ),
    block(
      "The PWA had been built fast with cluttered layouts, poor contrast, inconsistent components, and a browse experience with no true discovery mechanic. Students weren't disengaged because they didn't want to read — the product made reading feel like work.",
    ),
    block("Redesigning around two experiences", "h2"),
    block(
      "I reorganized the platform around the two moments that determine whether a student engages with a book at all: finding one worth reading, and actually getting through it.",
    ),
    steps([
      {
        title: "Readability",
        body: "How students move through the content and consume text.",
      },
      {
        title: "Discoverability",
        body: "How students explore books and content that feel worth reading.",
      },
    ]),
    block("A reading experience designed for focus", "h2"),
    block(
      "The new reader transforms traditional text into a conversational format that matches how students already consume content. Colors, mood, and atmosphere shift dynamically to match the story.",
    ),
    block("Built for the way students browse", "h2"),
    block(
      "Students wouldn't engage with books that felt like assignments. Redesigning the discovery experience around familiar streaming conventions like cinematic covers and personalized recommendations reduced the barrier between curiosity and commitment.",
    ),
    block("Reading more, dropping off less", "h2"),
    block(
      "Alpha testing showed the redesign moving in the right direction — reading completion increased from 25% to 32% and average session time grew from 17 to 28 minutes over a 1-month pilot in Utah.",
    ),
    stats([
      { value: "25% → 41%", label: "of books completed" },
      { value: "17 min → 28 min", label: "per reading session" },
    ]),
  ],
  wc: [
    block("Television is still social. Streaming platforms aren't.", "h2"),
    block(
      "Traditional TV gave huge audiences the same program at the same time, with common reference points and shared conversation. Recommendation algorithms and subscription-based models replaced that with a personalized feed for every viewer. Streaming trained everyone to binge, and the weekly appointment collapsed with it.",
    ),
    block(
      "People yearn for a community where they can talk about the shows they love.",
      "h3",
    ),
    block(
      "For fandom-first shows, the appointment is the feature. Weekly drops give a show a week to live in people's heads instead of a weekend. Fans built this infrastructure themselves with reaction videos, threads, and breakdowns, because the platforms they watch on gave them nowhere to do it.",
    ),
    block(
      "The streaming app and the fandom home should be the same product.",
      "h2",
    ),
    block(
      "Because Watch Club owns both the show and the space where people talk about it, we can do things no pure-play streamer or social network can. I led the product and design of three features that turn watching into something you do with other people:",
    ),
    steps([
      {
        title: "Clipping",
        body: "Fans select any moment from an episode, add their own take, and post it to the feed. Every clip keeps its timestamp, so anyone who sees it can drop into the episode at that exact second.",
      },
      {
        title: "Scene Pack",
        body: "Curated sets of moments from each episode, browsable by season and week, that drop into a post like any other clip. Clipping serves the fans who create; Scene Pack serves the fans who just want to point at the moment.",
      },
      {
        title: "Reclip",
        body: "Every clip in the feed is something another fan can talk back to. Attribution follows each clip: reuse it as-is and the original creator stays credited.",
      },
    ]),
    block("Clips sent fans back into the show.", "h2"),
    block(
      "We shipped Clipping, Scene Pack, and Reclip alongside mobile web to the beta cohort in one month. After rollout, what we watched for was whether the loop closed: if a moment posted by one fan pulled another one back to the show.",
    ),
    stats([
      {
        value: "64%",
        label: "of posts contained a clip from Clipping or Scene Pack",
      },
      {
        value: "71%",
        label: "of fans reclipped a post from the feed or video player",
      },
      { value: "83%", label: "of clips sent a fan back into the full episode" },
    ]),
    block("Two weeks in, fans were still clipping.", "h3"),
    block(
      "We checked at three points: day 1 for comprehension, day 7 and day 14 to see whether the mechanics survived past novelty. Fans picked it up without instruction and were still clipping by D14.",
    ),
  ],
  alchemy: [
    block(
      "Tool inconsistency is costing Amazon over $156M every year.",
      "h2",
    ),
    block(
      "Within Amazon’s fulfillment ecosystem, product teams have independently developed tools without a unified design system. Working with our finance team, Amazon Fulfillment Technologies estimated that tool inconsistencies contribute to roughly $156 million in annual losses due to extended development cycles, inconsistent user interfaces, and slower onboarding.",
    ),
    block("Lack of design consistency becomes a lack of trust.", "h2"),
    block(
      "We spoke with 24 partners across multiple product teams, spanning both legacy and new tools. These conversations revealed systemic gaps in the existing design infrastructure that made tools harder to develop, slower to use, and difficult to scale.",
    ),
    block("Defining Alchemy's framework & identity", "h2"),
    block(
      "I led a collaborative effort with my PM and other designers to define our product specs, ensuring they reflected both shared values and practical needs.",
    ),
    steps([
      {
        title: "Accelerate design-to-engineering velocity",
        body: "Standardize components, tokens, and specs so designs translate directly into code.",
      },
      {
        title: "Create cohesive cross-platform experiences",
        body: "Unify behavior, language, and visual systems across web, tablet, and mobile for all internal tools.",
      },
      {
        title: "Improve accessibility compliance",
        body: "Incorporate WCAG into foundations so teams ship compliant experiences with low effort.",
      },
      {
        title: "Enable flexible global expression",
        body: "Maintain coherence while enabling localization and content flexibility.",
      },
    ]),
    block("A component library for hundreds of teams.", "h2"),
    block(
      "Alchemy was re-architected as a shared system rather than a collection of isolated solutions. The design systems team defined common patterns, components, and behaviors that scale across workflows, platforms, and teams.",
    ),
    block("Turning the design system into operational impact", "h2"),
    stats([
      {
        value: "40%",
        label: "Reduction in design + engineering time for new tools",
      },
      {
        value: "70+",
        label: "Standardized components & tokens adopted across teams",
      },
      {
        value: "300+",
        label: "Legacy patterns consolidated into unified components",
      },
      { value: "24", label: "Product teams onboarded to Alchemy" },
    ]),
    block("A shared system, not a silo", "h2"),
    block(
      "Alchemy was designed to scale beyond a centralized design systems team. I led key efforts on establishing clear contribution pathways, review standards, and collaboration mechanisms that allow teams to extend the system while preserving consistency.",
    ),
  ],
  receive: [
    block("The Amazon you don't see", "h2"),
    block(
      "Before a package arrives at your door, it passes through a fulfillment center where every item is scanned, sorted, and routed by warehouse associates. This is the part of Amazon most people never see — a scattered reality where speed and accuracy matter most.",
    ),
    block(
      "Over 20+ legacy tools had been independently built to receive inventory across Amazon's fulfillment network.",
      "h3",
    ),
    block(
      "The fragmentation created slowdowns, accuracy issues, and forced associates into manual decision-making at every step.",
    ),
    block("Aligning stakeholders on a unified vision", "h2"),
    block(
      "I kicked off the project with a 3-day future state mapping workshop, bringing together product, engineering, and operations partners to align on the end-to-end receive process. Working with Operations, I mapped the flow and found a critical bottleneck: associates were manually deciding how to route and receive inventory.",
    ),
    block("Streamline 20+ legacy tools into one", "h2"),
    block(
      "Rather than improving individual tools, our team set out to consolidate 20+ legacy receive tools into a single program designed to handle every receive path through one guided workflow.",
    ),
    block("Architecting the Receive tool", "h2"),
    block(
      "I designed a layout framework around one principle: associates should always know their next action. Primary directives sit at the top, context persists in the footer, and secondary workflows are accessible through the menu without interrupting the main flow. This later became the standard interaction pattern used across Operations for future associate tools.",
    ),
    block("Three levels of progressive investigation", "h3"),
    block(
      "The Receive tool starts at the pallet level and progressively investigates deeper — from pallet to container to individual item — only when the shipment data can't be resolved at the current level.",
    ),
    panel({
      eyebrow: "Lightbox",
      title: "One of many legacy Receive tools",
      body: "Figures in this case study can open in a lightbox so dense warehouse UI can be inspected at full size.",
    }),
    stats([
      {
        value: "12% → 97%",
        label: "of inventory resolved at pallet level",
      },
      { value: "< 2%", label: "of depalletization defects network-wide" },
      {
        value: "250,000+",
        label: "associates across US/EMEA fulfillment centers",
      },
      { value: "20+", label: "legacy Receive tools deprecated" },
    ]),
  ],
};

export function seedHero(slug: string): ProjectHero | null {
  return heroes[slug] ?? null;
}

export function seedBody(slug: string): ProjectBody {
  return bodies[slug] ?? [];
}
