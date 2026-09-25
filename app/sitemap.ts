import type { MetadataRoute } from "next";
import { getProjectCards } from "@/lib/sanity/fetch";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projects = await getProjectCards();
  const publicProjects = projects.filter(
    (project) => !project.gated && !project.href,
  );

  return [
    { url: siteConfig.url, lastModified: new Date() },
    { url: `${siteConfig.url}/info`, lastModified: new Date() },
    ...publicProjects.map((project) => ({
      url: `${siteConfig.url}/project/${project.slug}`,
      lastModified: new Date(),
    })),
  ];
}
