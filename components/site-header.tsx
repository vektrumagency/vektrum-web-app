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
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-6">
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
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-600"
        >
          {ctaLabel}
        </a>
      </div>
    </header>
  );
}
