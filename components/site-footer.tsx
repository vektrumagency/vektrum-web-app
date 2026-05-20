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
    <footer className="border-t border-border/80 bg-background/88 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-3">
        <div>
          <BrandLogo showTagline />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            {footer.description ?? "AI automation systems for businesses that value speed, reliability, and operational clarity."}
          </p>
        </div>
        <nav aria-label="Footer links">
          <p className="text-sm font-semibold text-text">{footer.quickLinksTitle}</p>
          <div className="mt-3 flex flex-col gap-2">
            {footer.quickLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-muted transition-colors hover:text-text"
              >
                {link.label}
              </a>
            ))}
          </div>
        </nav>
        <div>
          <p className="text-sm font-semibold text-text">{footer.contactTitle}</p>
          <p className="mt-3 text-sm text-muted">
            {footer.contactNote ?? "Business inquiries and partnerships"}
          </p>
          <a
            href={`mailto:${email}`}
            className="mt-2 inline-block text-sm font-medium text-text transition-colors hover:text-text/80"
          >
            {email}
          </a>
          <p className="mt-2 text-xs text-muted">
            {footer.responseNote ?? "Typical response time: within one business day."}
          </p>
        </div>
      </div>
    </footer>
  );
}
