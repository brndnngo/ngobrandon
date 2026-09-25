import { block } from "@/content/pt";
import {
  slugifyHeading,
  type CaseStudyBlock,
  type CaseStudyPage,
  type CaseStudyStat,
} from "@/lib/case-study";
import type { Collaborator } from "@/lib/sanity/types";

let keyCount = 0;
const key = () => `case-study-${++keyCount}`;

function section(input: {
  eyebrow?: string;
  heading: string;
  tocLabel?: string;
  includeInToc?: boolean;
  paragraphs: string[];
}): CaseStudyBlock {
  const label = input.tocLabel || input.eyebrow || input.heading;
  return {
    _type: "section",
    _key: key(),
    id: slugifyHeading(label),
    eyebrow: input.eyebrow,
    heading: input.heading,
    tocLabel: input.tocLabel,
    includeInToc: input.includeInToc !== false,
    body: input.paragraphs.map((text) => block(text)),
  };
}

function stats(items: CaseStudyStat[], note?: string): CaseStudyBlock {
  return { _type: "statRow", _key: key(), items, note };
}

function quote(quoteText: string, attribution: string): CaseStudyBlock {
  return { _type: "quote", _key: key(), quote: quoteText, attribution };
}

function page(input: {
  slug: string;
  title: string;
  description: string;
  timeline: string;
  role: string;
  collaborators: Collaborator[];
  blocks: CaseStudyBlock[];
}): CaseStudyPage {
  return {
    ...input,
    hero: null,
    legacyBody: null,
  };
}

const studies: Record<string, CaseStudyPage> = {
  wc: page({
    slug: "wc",
    title: "Watch Club",
    description:
      "I joined as a senior product designer and owned the product roadmap for a social streaming platform built around microdramas. I led the pivot of our product from iOS-only to hybrid and designed its core social feature: clips, so fans can share the moments they love and pull each other back into the show.",
    timeline: "Apr 2026 - Sep 2026",
    role: "Senior product designer",
    collaborators: [
      { name: "Luka Vujnovac", role: "Software engineer (iOS)" },
      { name: "Sebastien Audeon", role: "Software engineer (iOS)" },
      { name: "Tina Holly", role: "Software engineer (Android)" },
      { name: "Brandon Pancost", role: "Software engineer (backend)" },
      { name: "Darcy McSwain", role: "Associate product designer" },
    ],
    blocks: [
      section({
        eyebrow: "Context",
        heading: "Television is still social. Streaming platforms aren't.",
        paragraphs: [
          "Traditional TV gave huge audiences the same program at the same time, with common reference points and shared conversation. Recommendation algorithms and subscription-based models replaced that with a personalized feed for every viewer.",
          "Streaming trained everyone to binge, and the weekly appointment collapsed with it. Now, everyone is watching different things and having conversations all over the internet.",
        ],
      }),
      section({
        heading: "People yearn for a community to talk about the shows they love.",
        includeInToc: false,
        paragraphs: [
          "For fandom-first shows, the appointment is the feature. Weekly drops give a show a week to live in people's heads instead of a weekend, and people long for community around a shared experience. As a result, fans built this infrastructure themselves with reaction videos, threads, and breakdowns, because the platforms they watch on gave them nowhere to do it. Streaming gave fans more to watch and nowhere to be together while they watched it.",
        ],
      }),
      section({
        eyebrow: "Key decisions",
        heading:
          "Watch Club believes that the streaming app and the fandom community should live in the same product.",
        paragraphs: [
          "The primary focus for the product team was to create a feedback loop where fans could talk about the best moments from the latest episode, go back to them together, and keep the conversation going. I led the product strategy and 0-1 design of three features that turn watching into something you do with other people.",
        ],
      }),
      section({
        heading: "Clips",
        tocLabel: "Clipping",
        paragraphs: [
          "The fastest way to talk about a scene is to show it. Fans select any moment from an episode, add their own take, and post it to the feed. Every clip keeps its timestamp, so anyone who sees it can drop into the episode at that exact second and be in the moment.",
        ],
      }),
      section({
        heading: "Scene Pack",
        paragraphs: [
          "Most fans want to join the conversation without doing the work of finding the moment themselves. Scene Pack holds curated sets of moments from each episode, browsable by season and week, that drop into your post like any other clip to get the conversation started faster.",
        ],
      }),
      section({
        heading: "Reclip",
        paragraphs: [
          "The fastest way to talk about a scene is to show it. Fans select any moment from an episode, add their own take, and post it to the feed. Every clip keeps its timestamp, so anyone who sees it can drop into the episode at that exact second and be in the moment.",
        ],
      }),
      section({
        eyebrow: "Impact",
        heading: "Clips sent fans back in to the show.",
        paragraphs: [
          "We shipped Clips, Scene Pack, and Reclip alongside mobile web to the beta cohort in one month. After rollout, what we watched for was whether the loop closed: if a moment posted by one fan pulled another one back to the show, and if that fan stayed for the next episode.",
        ],
      }),
      stats(
        [
          {
            kicker: "Usage *",
            value: "64%",
            label: "of all posts contained a clip media attachment",
          },
          {
            kicker: "Adoption *",
            value: "71%",
            label: "of fans reclipped a post from feed or player",
          },
          {
            kicker: "Playback *",
            value: "83%",
            label: "of clips sent a fan back into the full episode",
          },
        ],
        "* Engagement metrics from Amplitude closed beta over a 1-month period",
      ),
      section({
        heading: "Two weeks in, fans were still clipping.",
        includeInToc: false,
        paragraphs: [
          "We checked at three points: day 1 for comprehension, day 7 and day 14 to see whether the mechanics survived past novelty. Each interval paired fans who posted often with fans who rarely did, so we could tell whether the mechanics worked beyond the people already posting.",
        ],
      }),
      quote(
        "“Reclipping a post is easy and I think it's really cool to see what my friends think about the same scene.”",
        "On Reclip, 17, Oregon, United States",
      ),
      quote(
        "“I love being able to jump directly into an episode after I watch an intense clip so I can see all the other details going on at that moment.”",
        "On Clipping, 23, London, United Kingdom",
      ),
      quote(
        "“The [Scene Pack] feature is helpful because I can easily reference the [clip] I'm talking about when I want to post.”",
        "On Scene Pack, 21, Sofia, Bulgaria",
      ),
      section({
        heading:
          "Fans shared the moments they loved and pulled each other back into the show, building the kind of community streaming had stopped making room for.",
        includeInToc: false,
        paragraphs: [],
      }),
    ],
  }),
  alchemy: page({
    slug: "alchemy",
    title: "Amazon Alchemy",
    description:
      "I led design systems work on Alchemy, the design system behind the tools Amazon fulfillment associates use every shift. I helped rebuild it from a library teams copied into shared infrastructure they build on: semantic tokens, standard interaction patterns, and a model for teams to contribute back.",
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
    blocks: [
      section({
        eyebrow: "Context",
        heading:
          "Amazon's fulfillment centers run on internal tools built by dozens of product teams.",
        paragraphs: [
          "For years, each team built on its own, so the same button, error state, or scan flow looked and behaved differently from one tool to the next.",
          "Associates felt this the most. Many are cross-trained across roles and switch tools within a single shift, and every switch meant relearning where to look, what to tap, and how to recover from a mistake.",
        ],
      }),
      section({
        heading: "Tool inconsistency is costing Amazon over $156M every year.",
        includeInToc: false,
        paragraphs: [
          "Working with finance, Amazon Fulfillment Technologies estimated that tool inconsistency cost roughly $156M a year in slower development cycles, longer onboarding, and tool-specific training.",
          "To find where it came from, I audited component libraries and live pilot tools across the network, and we spoke with 24 partners across product teams. The same pattern kept showing up: teams were rebuilding the same components, drifting from standards, and filling gaps the system didn't cover.",
        ],
      }),
      section({
        eyebrow: "Key decisions",
        heading:
          "Alchemy had to become infrastructure that product teams can build on and adapt for new tools.",
        paragraphs: [
          "The old Alchemy was a set of components that teams copied into their own codebases. Once copied, they forked, and every fix had to be made again by every team.",
          "I led the work to rebuild it as a shared foundation: meaning lives in tokens, behavior lives in patterns, and teams have a clear way to contribute back instead of building around the system.",
        ],
      }),
      section({
        heading: "Tokens",
        paragraphs: [
          "In a fulfillment center, color tells an associate what to do next. I built a token chain that goes from raw value to base, semantic, and component tokens, so components reference meaning instead of hex codes. The same alert works in light and dark mode, and the same system maps status and process paths across inbound, outbound, and quality.",
        ],
      }),
      section({
        heading: "Built for the floor",
        paragraphs: [
          "Alchemy tools run on handheld scanners as often as desktop stations. I scaled type by device, using a wider ratio on desktop and tablet to hold hierarchy across panels and a tighter one on handhelds to cut scrolling. Frequent actions carry keypad shortcuts, and icons hold their meaning down to 16px, so associates can act without stopping to read.",
        ],
      }),
      section({
        heading: "Contribution model + governance",
        tocLabel: "Contribution model",
        paragraphs: [
          "I set up contribution pathways and review standards so teams could propose components through an intake form, get them reviewed, and ship them back into the system.",
          "Monthly demos, onboarding, a Slack community, and weekly accessibility office hours kept teams building with the system instead of around it.",
        ],
      }),
      section({
        eyebrow: "Impact",
        heading: "Teams stopped rebuilding and started shipping.",
        paragraphs: [
          "Six months in, we rolled out the first alpha to product teams. Designers and engineers spent less time debating patterns and more time on the problems specific to their tools, and associates got the same interactions wherever they worked.",
        ],
      }),
      stats([
        {
          kicker: "Speed",
          value: "40%",
          label: "less design + eng time for new tools",
        },
        {
          kicker: "Adoption",
          value: "24",
          label: "product teams onboarded to Alchemy 2.0",
        },
        {
          kicker: "Consolidation",
          value: "300+",
          label: "legacy patterns merged into shared components",
        },
      ]),
      section({
        heading: "A shared system, not a silo",
        includeInToc: false,
        paragraphs: [
          "After rollout, we checked in with product teams and associates. The people building tools talked about predictability and less back-and-forth, and those who used them talked about not having to stop and figure out what to do next.",
        ],
      }),
    ],
  }),
  receive: page({
    slug: "receive",
    title: "Amazon Receive",
    description:
      "I led the 0-1 design for Pallet Receive, the tool that replaced 20+ legacy receive tools across Amazon's fulfillment network. It turned all legacy receive processes into one guided flow that decides the path for associates, and it became the default for 250,000+ associates across the US and EMEA.",
    timeline: "Jul 2022 - Aug 2023",
    role: "Lead UX designer, enterprise systems",
    collaborators: [
      { name: "DD Chang", role: "Principal product manager" },
      { name: "Brad Sweet", role: "Senior product manager" },
      { name: "Ruslan Khmelyuk", role: "Engineering manager" },
      { name: "Eric Liao", role: "Senior software engineer" },
      { name: "Gina Donlin", role: "Senior UX researcher" },
      { name: "Hailei Schatz", role: "Operations" },
      { name: "Scott Nguyen", role: "Accessibility" },
    ],
    blocks: [
      section({
        eyebrow: "Context",
        heading: "Before a package reaches your door, someone has to receive it.",
        paragraphs: [
          "Every item that enters an Amazon fulfillment center starts on a pallet at the dock. Before it can be stored, picked, or shipped, an associate has to scan it, identify it, and send it to the right place.",
        ],
      }),
      section({
        heading: "20+ tools, and associates had to pick the right one.",
        includeInToc: false,
        paragraphs: [
          "Receiving had no standard process. With our senior UX researcher, I visited 8 fulfillment centers across different site types, then ran a three-day mapping workshop with product, engineering, and operations. Every site received inventory differently, and the biggest bottleneck was the same everywhere: associates were manually deciding how to route every pallet.",
        ],
      }),
      section({
        eyebrow: "Key decisions",
        heading:
          "Every tool was answering the same question: What is this pallet, and where should it go?",
        paragraphs: [
          "Some pallets arrive with complete shipment data, and others arrive with partial or missing information. The legacy tools handled each scenario with a separate tool. Instead of improving them one by one, we consolidated all of them into one adaptive flow. It resolves automatically when the data is there and guides associates step by step when it isn't.",
        ],
      }),
      section({
        heading: "Let the tool decide",
        paragraphs: [
          "After scanning the pallet label, associates classify it by flagging damage, mixed ASINs, or non-standard configurations. That one step sets the receive path that follows. On the happy path, when shipment data is linked to the barcode, the tool matches it, asks the associate to verify quantities, and routes the pallet on its own.",
        ],
      }),
      section({
        heading: "Always know the next action",
        paragraphs: [
          "I built the layout around one rule: associates should always know what to do next. The directive sits at the top, context stays in the footer, and secondary workflows live in the menu without interrupting the main flow. Where legacy tools relied on text, I designed illustrations of pallets, containers, scans, and damage, so associates can orient at a glance instead of reading.",
        ],
      }),
      section({
        eyebrow: "Impact",
        heading: "Associates stopped routing pallets manually.",
        paragraphs: [
          "What used to mean choosing between dozens of tools and routing inventory by hand now happens in one guided flow. Because associates flag pallet conditions up front, processing inaccuracies stayed under 2% network-wide.",
        ],
      }),
      stats(
        [
          {
            kicker: "Manual breakdown *",
            value: "88% → 3%",
            label: "of pallet inventory broken down by hand",
          },
          {
            kicker: "Cycle time *",
            value: "1:28 → 0:35 min",
            label: "minutes to receive one pallet into warehouse",
          },
          {
            kicker: "Adoption",
            value: "250,000+",
            label: "associates across US/EU fulfillment centers",
          },
        ],
        "* From 2024 Pallet Receive Status Updates (WK10 + WK35)",
      ),
      section({
        heading: "Localized and adapted across the world",
        includeInToc: false,
        paragraphs: [
          "Pallet Receive rolled out across US fulfillment centers in August 2023, then expanded to Europe in Q4, starting with France. Sites there had different warehouse configurations, so I worked with our localization team to adapt both strings and illustrations to their physical environment, then tested the French version with associates on the floor at CDG7. A year after rollout, Pallet Receive reached 250,000+ associates across US and EU fulfillment centers.",
        ],
      }),
    ],
  }),
};

export function seedCaseStudy(slug: string): CaseStudyPage | null {
  return studies[slug] ?? null;
}
