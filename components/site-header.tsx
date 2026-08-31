"use client";

import { Locale } from "@/lib/site-config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";

type SiteHeaderProps = {
  locale: Locale;
  navItems: { href: string; label: string }[];
  ctaHref: string;
  ctaLabel: string;
};

export function SiteHeader({ locale, navItems, ctaHref, ctaLabel }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const ptHref = pathname;
  const enHref = `${pathname}?lang=en`;
  const esHref = `${pathname}?lang=es`;
  const homeHref = locale === "en" ? "/?lang=en" : locale === "es" ? "/?lang=es" : "/";
  const languageOptions: { value: Locale; label: string; href: string }[] = [
    { value: "pt-PT", label: "PT", href: ptHref },
    { value: "en", label: "EN", href: enHref },
    { value: "es", label: "ES", href: esHref }
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const darkClasses = ["bg-accent", "bg-ink"];

    const hasDarkBg = (el: Element | null): boolean => {
      let current = el;
      while (current && current !== document.documentElement) {
        if (darkClasses.some((cls) => current!.classList.contains(cls))) return true;
        current = current.parentElement;
      }
      return false;
    };

    let rafId: number;
    const update = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        // Sample the element under the nav bar centre (y=80px clears the fixed header)
        const els = document.elementsFromPoint(window.innerWidth / 2, 80);
        const pageEl = els.find((el) => {
          const pos = window.getComputedStyle(el).position;
          return pos !== "fixed" && pos !== "sticky";
        }) ?? null;
        setOverDark(hasDarkBg(pageEl));
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!langMenuOpen) return;
    const onClickOutside = (event: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [langMenuOpen]);

  const burgerColor = overDark ? "bg-background" : "bg-text";

  return (
    <>
      <div className="pointer-events-none fixed top-4 z-[70] flex h-16 w-full items-center">
        <div className="relative mx-auto flex w-[90vw] items-center justify-between">
          <a
            href={homeHref}
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
                className={`h-11 w-auto shrink-0 object-contain ${overDark ? "brightness-0 invert" : ""}`}
              />
            </div>
          </a>
          <nav
            aria-label="Primary"
            className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-0.5 rounded-full bg-white/10 px-1.5 py-2 backdrop-blur-xl backdrop-saturate-150 xl:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center whitespace-nowrap rounded-full px-2 py-2.5 text-sm transition-colors hover:bg-white hover:text-text ${
                  overDark ? "text-background/90" : "text-text"
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
            className="pointer-events-auto flex h-9 w-9 shrink-0 flex-col items-center justify-center gap-1.5 rounded-full bg-white/10 backdrop-blur-xl backdrop-saturate-150 xl:hidden"
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
        <div className="relative mx-auto flex h-16 w-[90vw] items-center justify-end gap-3">
          <div ref={langMenuRef} className="relative hidden xl:block">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={langMenuOpen}
              onClick={() => setLangMenuOpen((open) => !open)}
              className={`flex h-8 items-center gap-1 rounded-full bg-white/10 px-2.5 text-xs font-bold uppercase tracking-wide backdrop-blur-xl backdrop-saturate-150 transition-colors duration-200 ${
                overDark ? "text-background" : "text-text"
              }`}
            >
              {languageOptions.find((option) => option.value === locale)?.label}
              <svg
                viewBox="0 0 10 6"
                aria-hidden="true"
                className={`h-2 w-2.5 shrink-0 transition-transform duration-200 ${langMenuOpen ? "rotate-180" : ""}`}
              >
                <path d="M1 1l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div
              role="listbox"
              className={`absolute right-0 top-full mt-2 flex min-w-[4rem] flex-col overflow-hidden rounded-2xl bg-background/95 p-1 shadow-lg backdrop-blur-xl backdrop-saturate-150 transition-all duration-150 ${
                langMenuOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
              }`}
            >
              {languageOptions.map((option) => (
                <Link
                  key={option.value}
                  href={option.href}
                  aria-current={locale === option.value ? "true" : undefined}
                  onClick={() => setLangMenuOpen(false)}
                  className={`flex h-8 items-center justify-center rounded-xl px-3 text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
                    locale === option.value ? "bg-ink text-background" : "text-ink/70 hover:bg-ink/10 hover:text-ink"
                  }`}
                >
                  {option.label}
                </Link>
              ))}
            </div>
          </div>
          <Link
            href={ctaHref}
            className="hidden max-w-[178px] shrink-0 truncate rounded-full bg-background px-3 py-1.5 text-center text-xs font-bold uppercase tracking-wide text-ink transition hover:-translate-y-0.5 hover:bg-pop xl:inline-flex sm:max-w-none sm:px-4 sm:py-2 sm:text-sm"
          >
            {ctaLabel}
          </Link>
        </div>
      </header>

      <div
        aria-hidden={!menuOpen}
        className={`fixed inset-0 z-[60] flex h-screen w-screen flex-col items-center justify-center gap-3 bg-ink px-6 transition-all duration-300 ease-[var(--ease-out)] xl:hidden ${
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
          {languageOptions.map((option, index) => (
            <span key={option.value} className="flex items-center gap-3">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              <Link
                href={option.href}
                aria-current={locale === option.value ? "true" : undefined}
                className={locale === option.value ? "text-background" : ""}
                onClick={() => setMenuOpen(false)}
              >
                {option.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
