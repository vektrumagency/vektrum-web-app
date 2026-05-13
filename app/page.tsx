import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { Metadata } from "next";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { ContactSection } from "@/components/sections/contact-section";
import { FAQSection } from "@/components/sections/faq-section";
import { FinalCtaSection } from "@/components/sections/final-cta-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ProblemSection } from "@/components/sections/problem-section";
import { ResultsSection } from "@/components/sections/results-section";
import { SavingsCalculatorSection } from "@/components/sections/savings-calculator-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { Locale } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const langParam = params.lang;
  const selected = Array.isArray(langParam) ? langParam[0] : langParam;
  const locale: Locale = selected === "pt-PT" ? "pt-PT" : "en";

  if (locale === "pt-PT") {
    return {
      title: "Vektrum | Auditoria Gratuita de Inteligência Artificial",
      description:
        "Marque uma auditoria gratuita de IA com a Vektrum e descubra oportunidades práticas de automação com IA, agentes de IA e automatização de processos empresariais.",
      alternates: {
        canonical: "/?lang=pt-PT"
      },
      openGraph: {
        title: "Vektrum | Auditoria Gratuita de Inteligência Artificial",
        description:
          "Descubra onde a inteligência artificial para empresas pode poupar tempo e reduzir trabalho manual com uma auditoria gratuita da Vektrum.",
        url: "https://vecktrum-agency.com/?lang=pt-PT",
        siteName: "Vektrum",
        type: "website"
      }
    };
  }

  return {
    title: "Vektrum | Free AI Audit for Business Automation",
    description:
      "Book a free AI audit with Vektrum to discover practical AI automation agency opportunities, AI agents for business, and AI workflow automation.",
    alternates: {
      canonical: "/"
    },
    openGraph: {
      title: "Vektrum | Free AI Audit for Business Automation",
      description:
        "Discover where AI automation can save time, reduce manual work, and improve business process automation with a free AI audit.",
      url: "https://vecktrum-agency.com",
      siteName: "Vektrum",
      type: "website"
    }
  };
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const langParam = params.lang;
  const selected = Array.isArray(langParam) ? langParam[0] : langParam;
  const locale: Locale = selected === "pt-PT" ? "pt-PT" : "en";
  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const ctaCopy =
    locale === "pt-PT"
      ? {
          servicesLabel: "Marcar Auditoria Gratuita",
          processLabel: "Marcar Auditoria Gratuita",
          faqLabel: "Falar sobre uma Auditoria Gratuita"
        }
      : {
          servicesLabel: "Book a Free AI Audit",
          processLabel: "Book a Free AI Audit",
          faqLabel: "Talk About a Free AI Audit"
        };

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <div className="page-gradient pointer-events-none fixed inset-0 -z-10" />
      <SiteHeader
        locale={locale}
        navItems={content.navItems}
        bookCallUrl={config.brand.bookCallUrl}
        ctaLabel={content.hero.primaryCta}
      />
      <main className="pb-20 md:pb-0">
        <HeroSection
          hero={content.hero}
          heroStats={content.heroStats}
          primaryHref={config.brand.bookCallUrl}
          secondaryHref="#process"
        />
        <ProblemSection section={content.problemSection} problems={content.problems} />
        <SolutionSection section={content.solutionSection} />
        <SavingsCalculatorSection
          section={content.calculatorSection}
          locale={locale}
          ctaHref={config.brand.bookCallUrl}
        />
        <ServicesSection
          section={content.servicesSection}
          services={content.services}
          ctaLabel={ctaCopy.servicesLabel}
          ctaHref={config.brand.bookCallUrl}
        />
        <ProcessSection
          section={content.processSection}
          processSteps={content.processSteps}
          ctaLabel={ctaCopy.processLabel}
          ctaHref={config.brand.bookCallUrl}
        />
        <ResultsSection section={content.resultsSection} results={content.results} />
        <UseCasesSection section={content.useCasesSection} useCases={content.useCases} />
        <WhyChooseSection section={content.whySection} differentiators={content.differentiators} />
        <FAQSection
          section={content.faqSection}
          faqs={content.faqs}
          ctaLabel={ctaCopy.faqLabel}
          ctaHref={config.brand.bookCallUrl}
        />
        <FinalCtaSection section={content.finalCtaSection} ctaHref={config.brand.bookCallUrl} />
        <ContactSection
          section={content.contactSection}
          bookCallUrl={config.brand.bookCallUrl}
          email={config.brand.email}
          locale={locale}
        />
      </main>
      <SiteFooter footer={content.footer} email={config.brand.email} />
      <MobileStickyCta label={content.hero.primaryCta} href={config.brand.bookCallUrl} />
    </div>
  );
}
