import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { InlineCta } from "@/components/inline-cta";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { AboutSection } from "@/components/sections/about-section";
import { ContactSection } from "@/components/sections/contact-section";
import { FAQSection } from "@/components/sections/faq-section";
import { HeroSection } from "@/components/sections/hero-section";
import { ProcessSection } from "@/components/sections/process-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { ResultsSection } from "@/components/sections/results-section";
import { ServicesSection } from "@/components/sections/services-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { ValuePropSection } from "@/components/sections/value-prop-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { Locale } from "@/lib/site-config";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

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
          inlineTitle: "Quer automatizar isto na sua empresa?",
          inlineLabel: "Quero uma Auditoria de Automação",
          servicesLabel: "Pedir Auditoria Gratuita",
          processLabel: "Marcar Chamada de Descoberta",
          reviewsLabel: "Quero Resultados Semelhantes",
          faqLabel: "Falar com um Especialista"
        }
      : {
          inlineTitle: "Ready to automate this in your business?",
          inlineLabel: "Get a Free Automation Audit",
          servicesLabel: "Request Free Audit",
          processLabel: "Book Discovery Call",
          reviewsLabel: "I Want Similar Results",
          faqLabel: "Talk to a Specialist"
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
        <HeroSection hero={content.hero} heroStats={content.heroStats} />
        <ValuePropSection valueProp={content.valueProp} />
        <ServicesSection
          section={content.servicesSection}
          services={content.services}
          ctaLabel={ctaCopy.servicesLabel}
          ctaHref="#contact"
        />
        <InlineCta
          title={ctaCopy.inlineTitle}
          ctaLabel={ctaCopy.inlineLabel}
          ctaHref="#contact"
        />
        <ProcessSection
          section={content.processSection}
          processSteps={content.processSteps}
          ctaLabel={ctaCopy.processLabel}
          ctaHref={config.brand.bookCallUrl}
        />
        <WhyChooseSection section={content.whySection} differentiators={content.differentiators} />
        <ResultsSection section={content.resultsSection} results={content.results} />
        <UseCasesSection section={content.useCasesSection} useCases={content.useCases} />
        <ReviewsSection
          section={content.reviewsSection}
          reviews={content.reviews}
          ctaLabel={ctaCopy.reviewsLabel}
          ctaHref="#contact"
        />
        <AboutSection section={content.aboutSection} />
        <FAQSection
          section={content.faqSection}
          faqs={content.faqs}
          ctaLabel={ctaCopy.faqLabel}
          ctaHref={config.brand.bookCallUrl}
        />
        <ContactSection
          section={content.contactSection}
          bookCallUrl={config.brand.bookCallUrl}
          locale={locale}
        />
      </main>
      <SiteFooter footer={content.footer} email={config.brand.email} />
      <MobileStickyCta label={content.hero.primaryCta} href={config.brand.bookCallUrl} />
    </div>
  );
}
