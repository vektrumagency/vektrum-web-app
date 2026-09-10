import type { MetadataRoute } from "next";
import { listSentIssues } from "@/lib/newsletter-issues";
import { sectorsContent } from "@/lib/sectors-content";
import { localizePath, SITE_URL } from "@/lib/site-links";

function withLocales(ptPath: string): MetadataRoute.Sitemap {
  const enPath = localizePath(ptPath, "en");
  return [
    { url: `${SITE_URL}${ptPath}`, alternates: { languages: { en: `${SITE_URL}${enPath}` } } },
    { url: `${SITE_URL}${enPath}`, alternates: { languages: { "pt-PT": `${SITE_URL}${ptPath}` } } }
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = [
    ...withLocales("/"),
    ...withLocales("/projetos"),
    ...withLocales("/diagnostico"),
    ...withLocales("/privacidade"),
    ...withLocales("/novidades")
  ];

  const sectorEntries = sectorsContent["pt-PT"].sectors.flatMap((sector) => withLocales(`/projetos/${sector.slug}`));

  const issues = await listSentIssues();
  const issueEntries = issues.flatMap((issue) =>
    withLocales(`/novidades/${issue.id}`).map((entry) => ({ ...entry, lastModified: issue.sent_at }))
  );

  return [...staticEntries, ...sectorEntries, ...issueEntries];
}
