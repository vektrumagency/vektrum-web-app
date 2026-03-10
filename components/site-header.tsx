import { BrandLogo } from "@/components/brand-logo";
import { Locale } from "@/lib/site-config";
import Link from "next/link";

type SiteHeaderProps = {
  locale: Locale;
  navItems: { href: string; label: string }[];
  bookCallUrl: string;
  ctaLabel: string;
};

export function SiteHeader({ locale, navItems, bookCallUrl, ctaLabel }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-surface/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <BrandLogo compact className="shrink-0" />
        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm text-muted transition-colors hover:text-text"
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="hidden items-center gap-2 md:flex">
          <Link href="/?lang=en" className={`text-xs ${locale === "en" ? "text-text" : "text-muted hover:text-text"}`}>
            EN
          </Link>
          <span className="text-xs text-muted">/</span>
          <Link
            href="/?lang=pt-PT"
            className={`text-xs ${locale === "pt-PT" ? "text-text" : "text-muted hover:text-text"}`}
          >
            PT
          </Link>
        </div>
        <a
          href={bookCallUrl}
          className="rounded-full bg-accent px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-blue-600 sm:px-4 sm:py-2 sm:text-sm"
        >
          {ctaLabel}
        </a>
      </div>
      <div className="md:hidden">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 pb-3">
          <nav aria-label="Mobile primary" className="flex min-w-0 flex-1 gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-border bg-background/60 px-3 py-1.5 text-xs text-muted"
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="shrink-0 text-xs text-muted">
            <Link href="/?lang=en" className={locale === "en" ? "text-text" : ""}>
              EN
            </Link>
            <span className="px-1">/</span>
            <Link href="/?lang=pt-PT" className={locale === "pt-PT" ? "text-text" : ""}>
              PT
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
