/* eslint-disable @next/next/no-img-element */
import { Locale } from "@/lib/site-config";
import { NewsletterFooterForm } from "@/components/newsletter-footer-form";

type SiteFooterProps = {
  footer: {
    description?: string;
    quickLinksTitle: string;
    contactTitle: string;
    contactNote?: string;
    responseNote?: string;
    quickLinks: { label: string; href: string }[];
  };
  email: string;
  locale?: Locale;
};

export function SiteFooter({ footer, email, locale = "pt-PT" }: SiteFooterProps) {
  const homeHref = locale === "en" ? "/?lang=en" : "/";

  return (
    <footer className="bg-accent py-12">
      <div className="mx-auto grid w-[90vw] sm:w-[80vw] gap-10 md:grid-cols-4">
        <div>
          <a href={homeHref} aria-label="Vektrum" className="inline-flex items-center gap-3 px-1 py-1">
            <img src="/vektrum-icon.png" alt="Vektrum" className="h-10 w-auto object-contain" />
            <img src="/vektrum-wordmark.png" alt="" aria-hidden="true" className="h-10 w-auto object-contain brightness-0 invert" />
          </a>
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-background/65">
            {footer.description ?? "AI automation systems for businesses that value speed, reliability, and operational clarity."}
          </p>
        </div>
        <NewsletterFooterForm locale={locale} />
        <nav aria-label="Footer links">
          <p className="text-sm font-bold uppercase tracking-wide text-pop">{footer.quickLinksTitle}</p>
          <div className="mt-3 flex flex-col gap-2">
            {footer.quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-background/70 transition-colors hover:text-background"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        <div>
          <p className="text-sm font-bold uppercase tracking-wide text-pop">{footer.contactTitle}</p>
          <p className="mt-3 text-sm text-background/70">
            {footer.contactNote ?? "Business inquiries and partnerships"}
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block text-sm font-medium text-background transition-colors hover:text-pop"
          >
            {email}
          </a>
          <p className="mt-2 text-xs text-background/55">
            {footer.responseNote ?? "Typical response time: within one business day."}
          </p>
        </div>
      </div>
    </footer>
  );
}
