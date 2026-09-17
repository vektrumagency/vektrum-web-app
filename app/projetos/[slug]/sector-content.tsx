import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SectionDivider } from "@/components/section-divider";
import { SectorHelpPoints } from "@/components/sectors/sector-help-points";
import { SectorPortfolio } from "@/components/sectors/sector-portfolio";
import { SectorsHero } from "@/components/sectors/sectors-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { getSector, getSectorProjects, sectorsContent } from "@/lib/sectors-content";
import { Locale } from "@/lib/site-config";
import { buildLanguageAlternates, getDiagnosisHref, localizePath, SITE_URL } from "@/lib/site-links";

export function getSectorMetadata(locale: Locale, slug: string): Metadata {
  const sector = getSector(locale, slug);

  if (!sector) {
    return { title: "Vektrum" };
  }

  const canonical = localizePath(`/projetos/${slug}`, locale);
  const title = `Vektrum | ${sector.title}`;

  return {
    title,
    description: sector.description,
    alternates: { canonical, languages: buildLanguageAlternates(`/projetos/${slug}`) },
    openGraph: {
      title,
      description: sector.description,
      url: `${SITE_URL}${canonical}`,
      siteName: "Vektrum",
      type: "website",
      locale: locale === "en" ? "en_US" : "pt_PT",
      alternateLocale: locale === "en" ? "pt_PT" : "en_US"
    },
    twitter: { card: "summary_large_image", title, description: sector.description }
  };
}

export function SectorPageContent({ locale, slug }: { locale: Locale; slug: string }) {
  const sector = getSector(locale, slug);

  if (!sector) {
    notFound();
  }

  const projects = getSectorProjects(locale, slug);
  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const labels = sectorsContent[locale].labels;
  const backHref = localizePath("/projetos", locale);
  const diagnosisHref = getDiagnosisHref(locale);

  const ctaSection = {
    eyebrow: content.finalCtaSection.eyebrow,
    title: labels.ctaTitle,
    description: content.finalCtaSection.description,
    cta: content.finalCtaSection.cta
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Vektrum", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: labels.backLabel, item: `${SITE_URL}${backHref}` },
      { "@type": "ListItem", position: 3, name: sector.title }
    ]
  };

  return (
    <div className="relative min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <SiteHeader
        locale={locale}
        navItems={content.navItems}
      />
      <main className="pb-20 md:pb-0">
        <SectorsHero
          title={sector.title}
          description={sector.description}
          ctaLabel={content.hero.primaryCta}
          ctaHref={diagnosisHref}
          badgeLabel={labels.badgeLabel}
          backHref={backHref}
          backLabel={labels.backLabel}
        />
        <SectorHelpPoints title={sector.helpTitle} helpPoints={sector.helpPoints} />
        <SectorPortfolio
          title={sector.projectsTitle}
          projects={projects}
          whatWeBuiltLabel={labels.whatWeBuiltLabel}
          resultsLabel={labels.resultsLabel}
        />
        <FinalCtaSection section={ctaSection} ctaHref={diagnosisHref} tone="plain" />
      </main>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <SiteFooter footer={content.footer} email={config.brand.email} locale={locale} />
      <MobileStickyCta label={content.hero.primaryCta} href={diagnosisHref} />
      <NewsletterPopup locale={locale} />
    </div>
  );
}
