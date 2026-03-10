import { BrandLogo } from "@/components/brand-logo";
type SiteFooterProps = {
  footer: { quickLinksTitle: string; contactTitle: string; quickLinks: { label: string; href: string }[] };
  email: string;
};

export function SiteFooter({ footer, email }: SiteFooterProps) {
  return (
    <footer className="border-t border-border/80 bg-surface/80 py-10">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-6 md:grid-cols-3">
        <div>
          <BrandLogo showTagline />
          <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted">
            AI automation systems for businesses that value speed, reliability, and operational clarity.
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
          <a
            href={`mailto:${email}`}
            className="mt-3 inline-block text-sm text-muted transition-colors hover:text-text"
          >
            {email}
          </a>
          <div className="mt-4 flex gap-4 text-sm text-muted">
            <a
              href="https://www.linkedin.com/company/vektrum"
              target="_blank"
              rel="noreferrer"
              className="transition-colors hover:text-text"
            >
              LinkedIn
            </a>
            <a href="https://x.com/vektrum" target="_blank" rel="noreferrer" className="transition-colors hover:text-text">
              X
            </a>
            <a href={`mailto:${email}`} className="transition-colors hover:text-text">
              Email
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
