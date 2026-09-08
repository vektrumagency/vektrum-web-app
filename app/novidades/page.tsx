import type { Metadata } from "next";
import Link from "next/link";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SectionDivider } from "@/components/section-divider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { listSentIssues } from "@/lib/newsletter-issues";
import { Locale } from "@/lib/site-config";
import { getDiagnosisHref } from "@/lib/site-links";

export const dynamic = "force-dynamic";

type NovidadesPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function resolveLocale(langParam: string | string[] | undefined): Locale {
  const selected = Array.isArray(langParam) ? langParam[0] : langParam;
  return selected === "en" ? "en" : "pt-PT";
}

export async function generateMetadata({ searchParams }: NovidadesPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const canonical = locale === "en" ? "/novidades?lang=en" : "/novidades";

  return {
    title: "Vektrum | Novidades",
    description: "Edições anteriores da newsletter Semana em IA, publicadas no site.",
    alternates: { canonical },
    openGraph: {
      title: "Vektrum | Novidades",
      description: "Edições anteriores da newsletter Semana em IA, publicadas no site.",
      url: `https://vecktrum-agency.com${canonical}`,
      siteName: "Vektrum",
      type: "website"
    }
  };
}

const dateFormatter = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" });

function excerpt(text: string, maxLength: number): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).trimEnd()}…`;
}

export default async function NovidadesPage({ searchParams }: NovidadesPageProps) {
  const params = await searchParams;
  const locale = resolveLocale(params.lang);
  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const diagnosisHref = getDiagnosisHref(locale);
  const langSuffix = locale === "en" ? "?lang=en" : "";
  const issues = await listSentIssues();

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader locale={locale} navItems={content.navItems} />
      <main className="pb-20 md:pb-0">
        <section className="relative bg-accent pb-16 pt-36 sm:pt-28">
          <div className="mx-auto w-[90vw] sm:w-[80vw]">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-pop">Semana em IA</p>
            <h1 className="font-heading text-4xl uppercase leading-[1.3] tracking-tight text-background sm:text-6xl">
              Novidades
            </h1>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-background/75">
              Edições anteriores da newsletter semanal sobre IA, publicadas aqui para quem quer ler sem subscrever.
            </p>
          </div>
        </section>
        <SectionDivider fromClassName="bg-accent" toClassName="text-background" />

        <section className="bg-background py-16 sm:py-24">
          <div className="mx-auto w-[90vw] sm:w-[80vw]">
            {issues.length === 0 ? (
              <p className="max-w-xl text-base leading-relaxed text-muted">
                Ainda não há edições publicadas. A primeira chega brevemente.
              </p>
            ) : (
              <div className="grid gap-6 sm:grid-cols-2">
                {issues.map((issue) => (
                  <Link
                    key={issue.id}
                    href={`/novidades/${issue.id}${langSuffix}`}
                    className="flex flex-col rounded-2xl border border-border bg-surface p-6 transition duration-200 ease-[var(--ease-out)] hover:-translate-y-1 sm:p-8"
                  >
                    <span className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                      {dateFormatter.format(new Date(issue.sent_at))}
                    </span>
                    <h2 className="mt-3 font-heading text-2xl uppercase leading-[1.2] tracking-tight text-text">
                      {issue.subject}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{excerpt(issue.body_text, 160)}</p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <SiteFooter footer={content.footer} email={config.brand.email} locale={locale} />
      <MobileStickyCta label={content.hero.primaryCta} href={diagnosisHref} />
      <NewsletterPopup locale={locale} />
    </div>
  );
}
