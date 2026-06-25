"use client";

import { Locale } from "@/lib/site-config";
import Link from "next/link";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  locale: Locale;
  navItems: { href: string; label: string }[];
  bookCallUrl: string;
  ctaLabel: string;
};

export function SiteHeader({ locale, navItems, bookCallUrl, ctaLabel }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("home");
    if (!hero) return;
    const observer = new IntersectionObserver(([entry]) => setOverHero(entry.isIntersecting), {
      rootMargin: "-65px 0px 0px 0px",
      threshold: 0
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const burgerColor = overHero ? "bg-background" : "bg-text";

  return (
    <>
      <div className="pointer-events-none fixed top-4 z-[70] flex h-16 w-full items-center">
        <div className="relative mx-auto flex w-[90vw] items-center justify-between">
          <a
            href="#home"
            aria-label="Vektrum"
            className="pointer-events-auto inline-flex h-11 shrink-0 items-center"
          >
            <img src="/vektrum-icon.png" alt="Vektrum" className="h-11 w-auto shrink-0 object-contain" />
            <div
              className={`h-11 shrink-0 overflow-hidden transition-[width] duration-500 ease-[var(--ease-out)] ${
                scrolled ? "w-0" : "w-[129px]"
              }`}
            >
              <img
                src="/vektrum-wordmark.png"
                alt=""
                aria-hidden="true"
                className={`h-11 w-auto shrink-0 object-contain ${overHero ? "brightness-0 invert" : ""}`}
              />
            </div>
          </a>
          <nav
            aria-label="Primary"
            className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 px-2 py-2 backdrop-blur-xl backdrop-saturate-150 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center whitespace-nowrap rounded-full px-3 py-2.5 text-sm transition-colors hover:bg-white hover:text-text ${
                  overHero ? "text-background/90" : "text-text"
                }`}
              >
                <span className="h-1.5 w-0 shrink-0 rounded-full bg-accent opacity-0 transition-all duration-200 group-hover:mr-2 group-hover:w-1.5 group-hover:opacity-100" />
                {item.label}
              </a>
            ))}
          </nav>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="pointer-events-auto flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 md:hidden"
          >
            <span
              className={`h-0.5 w-4 rounded-full transition-transform duration-200 ${burgerColor} ${
                menuOpen ? "translate-y-[3.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-4 rounded-full transition-transform duration-200 ${burgerColor} ${
                menuOpen ? "-translate-y-[3.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      <header className="absolute inset-x-0 top-4 z-40">
        <div className="relative mx-auto flex h-16 w-[90vw] items-center justify-end gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Link
              href="/?lang=en"
              className={`text-xs ${locale === "en" ? "text-background" : "text-background/70 hover:text-background"}`}
            >
              EN
            </Link>
            <span className="text-xs text-background/60">/</span>
            <Link
              href="/?lang=pt-PT"
              className={`text-xs ${locale === "pt-PT" ? "text-background" : "text-background/70 hover:text-background"}`}
            >
              PT
            </Link>
          </div>
          <a
            href={bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden max-w-[178px] shrink-0 truncate rounded-full bg-background px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-pop md:inline-flex sm:max-w-none sm:px-4 sm:py-2 sm:text-sm"
          >
            {ctaLabel}
          </a>
        </div>
      </header>

      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[60] flex h-screen w-screen flex-col items-center justify-center gap-3 bg-ink px-6 transition-all duration-300 ease-[var(--ease-out)] md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <nav aria-label="Mobile primary" className="flex flex-col items-center gap-3">
          {navItems.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className="font-heading text-4xl uppercase leading-none text-background transition-all duration-300 ease-[var(--ease-out)] hover:text-pop"
              style={{
                transitionProperty: "opacity, transform",
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(16px)",
                transitionDelay: menuOpen ? `${100 + index * 60}ms` : "0ms"
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
        <div className="mt-6 flex items-center gap-3 text-sm text-background/70">
          <Link href="/?lang=en" className={locale === "en" ? "text-background" : ""} onClick={() => setMenuOpen(false)}>
            EN
          </Link>
          <span>/</span>
          <Link
            href="/?lang=pt-PT"
            className={locale === "pt-PT" ? "text-background" : ""}
            onClick={() => setMenuOpen(false)}
          >
            PT
          </Link>
        </div>
      </div>
    </>
  );
}
