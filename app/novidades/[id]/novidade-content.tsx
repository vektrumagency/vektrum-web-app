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
import { buildLanguageAlternates, getDiagnosisHref, localizePath, SITE_URL } from "@/lib/site-links";

export async function getNovidadeMetadata(locale: Locale, id: string): Promise<Metadata> {
  const issue = await getSentIssue(id);

  if (!issue) {
    return { title: "Vektrum" };
  }

  const canonical = localizePath(`/novidades/${id}`, locale);
  const title = `Vektrum | ${issue.subject}`;
  const description = issue.body_text.slice(0, 160);

  return {
    title,
    description,
    alternates: { canonical, languages: buildLanguageAlternates(`/novidades/${id}`) },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonical}`,
      siteName: "Vektrum",
      type: "article",
      publishedTime: issue.sent_at
    },
    twitter: { card: "summary_large_image", title, description }
  };
}

const dateFormatter = new Intl.DateTimeFormat("pt-PT", { day: "numeric", month: "long", year: "numeric" });

export async function NovidadePageContent({ locale, id }: { locale: Locale; id: string }) {
  const issue = await getSentIssue(id);

  if (!issue) {
    notFound();
  }

  const config = getRuntimeConfig();
  const content = config.locales[locale];
  const diagnosisHref = getDiagnosisHref(locale);
  const backHref = localizePath("/novidades", locale);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: issue.subject,
    datePublished: issue.sent_at,
    author: { "@type": "Organization", name: "Vektrum" },
    publisher: { "@type": "Organization", name: "Vektrum" },
    mainEntityOfPage: `${SITE_URL}/novidades/${id}`
  };

  return (
    <div className="relative min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
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
