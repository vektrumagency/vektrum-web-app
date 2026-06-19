import { BrandLogo } from "@/components/brand-logo";
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
};

export function SiteFooter({ footer, email }: SiteFooterProps) {
  return (
    <footer className="bg-ink py-12">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-3">
        <div>
          <BrandLogo showTagline light />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-background/65">
            {footer.description ?? "AI automation systems for businesses that value speed, reliability, and operational clarity."}
          </p>
        </div>
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
