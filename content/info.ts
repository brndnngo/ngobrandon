export type ExperienceItem = {
  name: string;
  description: string;
  year: string;
  logo: string;
  href?: string;
};

export type ExperienceGroup = {
  label: string;
  items: ExperienceItem[];
};

export const experienceGroups: ExperienceGroup[] = [
  {
    label: "Experience",
    items: [
      {
        name: "Watch Club",
        description: "Social streaming built around shared moments",
        year: "2026",
        logo: "/logos/watch-club.svg",
        href: "/project/wc",
      },
      {
        name: "Amazon",
        description:
          "Tools to optimize the associate experience in fulfillment centers all over the world",
        year: "2022 - 2026",
        logo: "/logos/amazon.svg",
        href: "/project/alchemy",
      },
      {
        name: "Literal",
        description: "A new way of reading for the next generation",
        year: "2021",
        logo: "/logos/literal.svg",
        href: "/project/literal",
      },
      {
        name: "Rollout",
        description:
          "Robotic processing automation (RPA) workflow management tool",
        year: "2020",
        logo: "/logos/rollout.svg",
        href: "/project/playbook",
      },
      {
        name: "UCLA HCI",
        description: "AI-assisted journaling platform for CBT therapy",
        year: "2020",
        logo: "/logos/ucla-hci.svg",
        href: "https://hci.ucla.edu/",
      },
      {
        name: "ResortPass",
        description: "Day passes to the best hotel experiences and amenities",
        year: "2019",
        logo: "/logos/resortpass.svg",
        href: "https://resortpass.com/",
      },
    ],
  },
  {
    label: "Giving back",
    items: [
      {
        name: "Queer Design Club",
        description:
          "Mentoring LGBTQIA+ youth to break into design spaces in tech",
        year: "2020",
        logo: "/logos/queer-design-club.svg",
        href: "https://www.queerdesign.club/",
      },
      {
        name: "Product Space",
        description: "Teaching design + product thinking to a cohort of students",
        year: "2019",
        logo: "/logos/product-space.svg",
        href: "https://productspaceucla.org/",
      },
    ],
  },
];
