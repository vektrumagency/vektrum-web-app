import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Metadata } from "next";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { FAQSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { ResultsSection } from "@/components/sections/results-section";
import { SectionDivider } from "@/components/section-divider";
import { SavingsCalculatorSection } from "@/components/sections/savings-calculator-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { sectorsContent } from "@/lib/sectors-content";
import { Locale } from "@/lib/site-config";
import { buildLanguageAlternates, getDiagnosisHref, SITE_URL } from "@/lib/site-links";

export function getHomeMetadata(locale: Locale): Metadata {
  if (locale === "pt-PT") {
    const title = "Vektrum | Automação prática para empresas";
    const description =
      "Automatize o trabalho que abranda o seu negócio com sistemas práticos que poupam tempo, reduzem trabalho manual e melhoram operações.";
    const ogDescription =
      "A Vektrum desenha e constrói automações práticas para leads, suporte, reporting, CRM, administração e follow-ups.";

    return {
      title,
      description,
      alternates: {
        canonical: "/",
        languages: buildLanguageAlternates("/")
      },
      openGraph: {
        title,
        description: ogDescription,
        url: SITE_URL,
        siteName: "Vektrum",
        type: "website",
        locale: "pt_PT",
        alternateLocale: "en_US"
      },
      twitter: { card: "summary_large_image", title, description: ogDescription }
    };
  }

  const title = "Vektrum | Practical Business Automation Systems";
  const description =
    "Automate the work that slows your business down with practical systems for leads, support, reporting, CRM, admin workflows, and follow-ups.";
  const ogDescription =
    "Vektrum designs and builds automation systems that save time, reduce manual work, and help teams operate faster.";

  return {
    title,
    description,
    alternates: {
      canonical: "/en",
      languages: buildLanguageAlternates("/")
    },
    openGraph: {
      title,
      description: ogDescription,
      url: `${SITE_URL}/en`,
      siteName: "Vektrum",
      type: "website",
      locale: "en_US",
      alternateLocale: "pt_PT"
    },
    twitter: { card: "summary_large_image", title, description: ogDescription }
  };
}

export function HomePageContent({ locale }: { locale: Locale }) {
  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const diagnosisHref = getDiagnosisHref(locale);
  const sectorsData = sectorsContent[locale];
  const featuredProjects = sectorsData.sectors.flatMap((sector) =>
    (sectorsData.projects[sector.slug] ?? []).map((project) => ({
      sectorSlug: sector.slug,
      sectorLabel: sector.title,
      name: project.name,
      context: project.context,
      tags: project.tags
    }))
  );
  const ctaCopy =
    locale === "pt-PT"
      ? {
          servicesLabel: "Auditoria gratuita de IA"
        }
      : {
          servicesLabel: "Free AI audit"
        };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer
      }
    }))
  };

  return (
    <div className="relative min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <SiteHeader
        locale={locale}
        navItems={content.navItems}
      />
      <main className="pb-20 md:pb-0">
        <HeroSection
          hero={content.hero}
          heroStats={content.heroStats}
          primaryHref={diagnosisHref}
          secondaryHref="#process"
        />
        <SolutionSection section={content.solutionSection} />
        <ProblemSection section={content.problemSection} problems={content.problems} />
        <SavingsCalculatorSection
          section={content.calculatorSection}
          locale={locale}
          ctaHref={diagnosisHref}
        />
        <ServicesSection
          section={content.servicesSection}
          services={content.services}
          ctaLabel={ctaCopy.servicesLabel}
          ctaHref={diagnosisHref}
        />
        <ProjectsSection
          eyebrow={content.featuredProjectsSection.eyebrow}
          title={content.featuredProjectsSection.title}
          description={content.featuredProjectsSection.description}
          projects={featuredProjects}
          locale={locale}
        />
        <ProcessSection
          section={content.processSection}
          processSteps={content.processSteps}
        />
        <ResultsSection section={content.resultsSection} results={content.results} />
        <UseCasesSection section={content.useCasesSection} useCases={content.useCases} />
        <WhyChooseSection section={content.whySection} differentiators={content.differentiators} />
        <FAQSection
          section={content.faqSection}
          faqs={content.faqs}
        />
        <FinalCtaSection section={content.finalCtaSection} ctaHref={diagnosisHref} tone="plain" />
      </main>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <SiteFooter footer={content.footer} email={config.brand.email} locale={locale} />
      <MobileStickyCta label={content.hero.primaryCta} href={diagnosisHref} />
      <NewsletterPopup locale={locale} />
    </div>
  );
}
