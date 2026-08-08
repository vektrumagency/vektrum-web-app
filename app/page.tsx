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
import { SectionDivider } from "@/components/section-divider";
import { SavingsCalculatorSection } from "@/components/sections/savings-calculator-section";
import { ServicesSection } from "@/components/sections/services-section";
import { SolutionSection } from "@/components/sections/solution-section";
import { UseCasesSection } from "@/components/sections/use-cases-section";
import { WhyChooseSection } from "@/components/sections/why-choose-section";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { Locale } from "@/lib/site-config";
import { getDiagnosisHref } from "@/lib/site-links";

export const dynamic = "force-dynamic";

type HomePageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: HomePageProps): Promise<Metadata> {
  const params = await searchParams;
  const langParam = params.lang;
  const selected = Array.isArray(langParam) ? langParam[0] : langParam;
  const locale: Locale = selected === "en" ? "en" : "pt-PT";

  if (locale === "pt-PT") {
    return {
      title: "Vektrum | Automação prática para empresas",
      description:
        "Automatize o trabalho que abranda o seu negócio com sistemas práticos que poupam tempo, reduzem trabalho manual e melhoram operações.",
      alternates: {
        canonical: "/?lang=pt-PT"
      },
      openGraph: {
        title: "Vektrum | Automação prática para empresas",
        description:
          "A Vektrum desenha e constrói automações práticas para leads, suporte, reporting, CRM, administração e follow-ups.",
        url: "https://vecktrum-agency.com/?lang=pt-PT",
        siteName: "Vektrum",
        type: "website"
      }
    };
  }

  return {
    title: "Vektrum | Practical Business Automation Systems",
    description:
      "Automate the work that slows your business down with practical systems for leads, support, reporting, CRM, admin workflows, and follow-ups.",
    alternates: {
      canonical: "/"
    },
    openGraph: {
      title: "Vektrum | Practical Business Automation Systems",
      description:
        "Vektrum designs and builds automation systems that save time, reduce manual work, and help teams operate faster.",
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
  const locale: Locale = selected === "en" ? "en" : "pt-PT";
  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const diagnosisHref = getDiagnosisHref(locale);
  const ctaCopy =
    locale === "pt-PT"
      ? {
          servicesLabel: "Auditoria gratuita de IA"
        }
      : {
          servicesLabel: "Free AI audit"
        };

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader
        locale={locale}
        navItems={content.navItems}
        ctaHref={diagnosisHref}
        ctaLabel={content.hero.primaryCta}
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
        <FinalCtaSection section={content.finalCtaSection} ctaHref={diagnosisHref} />
        <ContactSection
          section={content.contactSection}
          ctaHref={diagnosisHref}
          email={config.brand.email}
          locale={locale}
        />
      </main>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <SiteFooter footer={content.footer} email={config.brand.email} locale={locale} />
      <MobileStickyCta label={content.hero.primaryCta} href={diagnosisHref} />
    </div>
  );
}
