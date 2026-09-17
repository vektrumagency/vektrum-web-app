import type { Metadata } from "next";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SectionDivider } from "@/components/section-divider";
import { SectorGrid } from "@/components/sectors/sector-grid";
import { SectorsHero } from "@/components/sectors/sectors-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { sectorsContent } from "@/lib/sectors-content";
import { Locale } from "@/lib/site-config";
import { buildLanguageAlternates, getDiagnosisHref, SITE_URL } from "@/lib/site-links";

export function getSectorsIndexMetadata(locale: Locale): Metadata {
  if (locale === "en") {
    const title = "Vektrum | Projects and Portfolio";
    const description = "Real projects Vektrum has already built, with the sectors, work, and outcomes to show for it.";
    const ogDescription = "Real estate, ecommerce, and the practical automation systems Vektrum has built for each.";

    return {
      title,
      description,
      alternates: { canonical: "/en/projetos", languages: buildLanguageAlternates("/projetos") },
      openGraph: {
        title,
        description: ogDescription,
        url: `${SITE_URL}/en/projetos`,
        siteName: "Vektrum",
        type: "website",
        locale: "en_US",
        alternateLocale: "pt_PT"
      },
      twitter: { card: "summary_large_image", title, description: ogDescription }
    };
  }

  const title = "Vektrum | Projetos e Portefólio";
  const description = "Projetos reais que a Vektrum já construiu, com os setores, o trabalho e os resultados que provam isso.";
  const ogDescription = "Imobiliário, ecommerce, e os sistemas práticos de automação que a Vektrum já construiu em cada um.";

  return {
    title,
    description,
    alternates: { canonical: "/projetos", languages: buildLanguageAlternates("/projetos") },
    openGraph: {
      title,
      description: ogDescription,
      url: `${SITE_URL}/projetos`,
      siteName: "Vektrum",
      type: "website",
      locale: "pt_PT",
      alternateLocale: "en_US"
    },
    twitter: { card: "summary_large_image", title, description: ogDescription }
  };
}

export function SectorsIndexPageContent({ locale }: { locale: Locale }) {
  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const sectorsData = sectorsContent[locale];
  const diagnosisHref = getDiagnosisHref(locale);

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader
        locale={locale}
        navItems={content.navItems}
      />
      <main className="pb-20 md:pb-0">
        <SectorsHero
          eyebrow={sectorsData.labels.eyebrow}
          title={sectorsData.labels.title}
          description={sectorsData.labels.description}
          ctaLabel={content.hero.primaryCta}
          ctaHref={diagnosisHref}
          badgeLabel={sectorsData.labels.badgeLabel}
        />
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto w-[90vw] sm:w-[80vw]">
            <SectorGrid sectors={sectorsData.sectors} locale={locale} viewSectorLabel={sectorsData.labels.viewSectorLabel} />
          </div>
        </section>
        <FinalCtaSection section={content.finalCtaSection} ctaHref={diagnosisHref} tone="plain" />
      </main>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <SiteFooter footer={content.footer} email={config.brand.email} locale={locale} />
      <MobileStickyCta label={content.hero.primaryCta} href={diagnosisHref} />
      <NewsletterPopup locale={locale} />
    </div>
  );
}
