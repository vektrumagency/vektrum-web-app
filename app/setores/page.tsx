import type { Metadata } from "next";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { SectionDivider } from "@/components/section-divider";
import { SectorGrid } from "@/components/sectors/sector-grid";
import { SectorsHero } from "@/components/sectors/sectors-hero";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { sectorsContent } from "@/lib/sectors-content";
import { Locale } from "@/lib/site-config";

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
      title: "Vektrum | Sectors and Portfolio",
      description: "The sectors where Vektrum has already built real automation systems, with the projects and outcomes to show for it.",
      alternates: { canonical: "/setores?lang=en" },
      openGraph: {
        title: "Vektrum | Sectors and Portfolio",
        description: "Real estate, ecommerce, and the practical automation systems Vektrum has built for each.",
        url: "https://vecktrum-agency.com/setores?lang=en",
        siteName: "Vektrum",
        type: "website"
      }
    };
  }

  return {
    title: "Vektrum | Setores e Portefólio",
    description: "Os setores onde a Vektrum já construiu sistemas reais de automação, com os projetos e resultados que provam isso.",
    alternates: { canonical: "/setores" },
    openGraph: {
      title: "Vektrum | Setores e Portefólio",
      description: "Imobiliário, ecommerce, e os sistemas práticos de automação que a Vektrum já construiu em cada um.",
      url: "https://vecktrum-agency.com/setores",
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

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader
        locale={locale}
        navItems={content.navItems}
        bookCallUrl={config.brand.bookCallUrl}
        ctaLabel={content.hero.primaryCta}
      />
      <main className="pb-20 md:pb-0">
        <SectorsHero
          eyebrow={sectorsData.labels.eyebrow}
          title={sectorsData.labels.title}
          description={sectorsData.labels.description}
          ctaLabel={content.hero.primaryCta}
          ctaHref={config.brand.bookCallUrl}
          badgeLabel={sectorsData.labels.badgeLabel}
        />
        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto w-[90vw] sm:w-[80vw]">
            <SectorGrid sectors={sectorsData.sectors} locale={locale} viewSectorLabel={sectorsData.labels.viewSectorLabel} />
          </div>
        </section>
        <FinalCtaSection section={content.finalCtaSection} ctaHref={config.brand.bookCallUrl} tone="plain" />
      </main>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <SiteFooter footer={content.footer} email={config.brand.email} locale={locale} />
      <MobileStickyCta label={content.hero.primaryCta} href={config.brand.bookCallUrl} />
    </div>
  );
}
