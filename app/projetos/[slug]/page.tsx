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
import { getDiagnosisHref } from "@/lib/site-links";

export const dynamic = "force-dynamic";

type SectorPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function resolveLocale(langParam: string | string[] | undefined): Locale {
  const selected = Array.isArray(langParam) ? langParam[0] : langParam;
  return selected === "en" ? "en" : "pt-PT";
}

export async function generateMetadata({ params, searchParams }: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const sector = getSector(locale, slug);

  if (!sector) {
    return { title: "Vektrum" };
  }

  const canonical = locale === "en" ? `/projetos/${slug}?lang=en` : `/projetos/${slug}`;

  return {
    title: `Vektrum | ${sector.title}`,
    description: sector.description,
    alternates: { canonical },
    openGraph: {
      title: `Vektrum | ${sector.title}`,
      description: sector.description,
      url: `https://vecktrum-agency.com${canonical}`,
      siteName: "Vektrum",
      type: "website"
    }
  };
}

export default async function SectorPage({ params, searchParams }: SectorPageProps) {
  const { slug } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const sector = getSector(locale, slug);

  if (!sector) {
    notFound();
  }

  const projects = getSectorProjects(locale, slug);
  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const labels = sectorsContent[locale].labels;
  const backHref = locale === "en" ? "/projetos?lang=en" : "/projetos";
  const diagnosisHref = getDiagnosisHref(locale);

  const ctaSection = {
    eyebrow: content.finalCtaSection.eyebrow,
    title: labels.ctaTitle,
    description: content.finalCtaSection.description,
    cta: content.finalCtaSection.cta
  };

  return (
    <div className="relative min-h-screen bg-background">
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
