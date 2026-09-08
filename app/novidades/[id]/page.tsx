import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MobileStickyCta } from "@/components/mobile-sticky-cta";
import { NewsletterPopup } from "@/components/newsletter-popup";
import { SectionDivider } from "@/components/section-divider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getRuntimeConfig } from "@/lib/runtime-config";
import { getSentIssue } from "@/lib/newsletter-issues";
import { Locale } from "@/lib/site-config";
import { getDiagnosisHref } from "@/lib/site-links";

export const dynamic = "force-dynamic";

type NovidadePageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function resolveLocale(langParam: string | string[] | undefined): Locale {
  const selected = Array.isArray(langParam) ? langParam[0] : langParam;
  return selected === "en" ? "en" : "pt-PT";
}

export async function generateMetadata({ params, searchParams }: NovidadePageProps): Promise<Metadata> {
  const { id } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const issue = await getSentIssue(id);

  if (!issue) {
    return { title: "Vektrum" };
  }

  const canonical = locale === "en" ? `/novidades/${id}?lang=en` : `/novidades/${id}`;

  return {
    title: `Vektrum | ${issue.subject}`,
    description: issue.body_text.slice(0, 160),
    alternates: { canonical },
    openGraph: {
      title: `Vektrum | ${issue.subject}`,
      description: issue.body_text.slice(0, 160),
      url: `https://vecktrum-agency.com${canonical}`,
      siteName: "Vektrum",
      type: "article"
    }
  };
}

const dateFormatter = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" });

export default async function NovidadePage({ params, searchParams }: NovidadePageProps) {
  const { id } = await params;
  const search = await searchParams;
  const locale = resolveLocale(search.lang);
  const issue = await getSentIssue(id);

  if (!issue) {
    notFound();
  }

  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const diagnosisHref = getDiagnosisHref(locale);
  const backHref = locale === "en" ? "/novidades?lang=en" : "/novidades";

  return (
    <div className="relative min-h-screen bg-background">
      <SiteHeader locale={locale} navItems={content.navItems} />
      <main className="pb-20 md:pb-0">
        <article className="py-16 pt-36 sm:pt-40 sm:py-24">
          <div className="mx-auto w-[90vw] max-w-3xl sm:w-[80vw]">
            <a
              href={backHref}
              className="text-xs font-semibold uppercase tracking-[0.2em] text-accent transition hover:text-accent-soft"
            >
              ← Novidades
            </a>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-muted">
              {dateFormatter.format(new Date(issue.sent_at))}
            </p>
            <h1 className="mt-3 font-heading text-3xl uppercase leading-[1.3] tracking-tight text-text sm:text-5xl">
              {issue.subject}
            </h1>
            <div
              className="mt-8 max-w-none text-base leading-relaxed text-text [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:text-accent-soft [&_h2]:mt-8 [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:uppercase [&_h2]:tracking-tight [&_h2]:text-text [&_li]:mb-2 [&_p]:mb-4 [&_p]:text-muted [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-muted"
              dangerouslySetInnerHTML={{ __html: issue.body_html }}
            />
          </div>
        </article>
      </main>
      <SectionDivider fromClassName="bg-background" toClassName="text-accent" />
      <SiteFooter footer={content.footer} email={config.brand.email} locale={locale} />
      <MobileStickyCta label={content.hero.primaryCta} href={diagnosisHref} />
      <NewsletterPopup locale={locale} />
    </div>
  );
}
