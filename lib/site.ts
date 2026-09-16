export const siteConfig = {
  name: "Brandon Ngo",
  role: "Senior product designer",
  email: "hey.brandonngo@gmail.com",
  timeZone: "America/Los_Angeles",
  city: "Los Angeles, CA",
  // Placeholder until the canonical domain is chosen from the six that
  // currently resolve to the Webflow site.
  url: "https://ngobrandon.com",
} as const;

export const navLinks = [
  { href: "/", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/film", label: "Film⁺" },
] as const;

export const socialLinks = [
  { href: "https://www.linkedin.com/in/brandonngo72/", label: "LinkedIn" },
  { href: "https://medium.com/@brandonngo", label: "Medium" },
  {
    href: "https://drive.google.com/file/d/1WnK3HvbBPPZeHgqlIpguvV_9lQP7q7wI/view?usp=sharing",
    label: "Resume",
  },
] as const;
