export const siteConfig = {
  name: "Brandon Ngo",
  role: "Senior product designer",
  email: "hey.brandonngo@gmail.com",
  timeZone: "America/Los_Angeles",
  city: "Los Angeles",
  // Placeholder until the canonical domain is chosen from the six that
  // currently resolve to the Webflow site.
  url: "https://ngobrandon.com",
} as const;

export const navLinks = [
  { href: "/", label: "Work" },
  { href: "/about", label: "Info" },
  { href: "/film", label: "Photo" },
] as const;

export const socialLinks = [
  { href: "https://www.linkedin.com/in/brandonngo72/", label: "LinkedIn" },
  { href: "#", label: "X" },
  { href: "https://medium.com/@brandonngo", label: "Medium" },
  { href: "#", label: "GitHub" },
] as const;
