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
import { getDiagnosisHref } from "@/lib/site-links";

export const dynamic = "force-dynamic";

type SectorsIndexPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function resolveLocale(langParam: string | string[] | undefined): Locale {
  const selected = Array.isArray(langParam) ? langParam[0] : langParam;
  return selected === "en" ? "en" : "pt-PT";
}

export async function generateMetadata({ searchParams }: SectorsIndexPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);

  if (locale === "en") {
    return {
      title: "Vektrum | Projects and Portfolio",
      description: "Real projects Vektrum has already built, with the sectors, work, and outcomes to show for it.",
      alternates: { canonical: "/projetos?lang=en" },
      openGraph: {
        title: "Vektrum | Projects and Portfolio",
        description: "Real estate, ecommerce, and the practical automation systems Vektrum has built for each.",
        url: "https://vecktrum-agency.com/projetos?lang=en",
        siteName: "Vektrum",
        type: "website"
      }
    };
  }

  return {
    title: "Vektrum | Projetos e Portefólio",
    description: "Projetos reais que a Vektrum já construiu, com os setores, o trabalho e os resultados que provam isso.",
    alternates: { canonical: "/projetos" },
    openGraph: {
      title: "Vektrum | Projetos e Portefólio",
      description: "Imobiliário, ecommerce, e os sistemas práticos de automação que a Vektrum já construiu em cada um.",
      url: "https://vecktrum-agency.com/projetos",
      siteName: "Vektrum",
      type: "website"
    }
  };
}

export default async function SectorsIndexPage({ searchParams }: SectorsIndexPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
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
