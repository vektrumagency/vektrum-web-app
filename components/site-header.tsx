"use client";

import { Locale } from "@/lib/site-config";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

type SiteHeaderProps = {
  locale: Locale;
  navItems: { href: string; label: string }[];
  bookCallUrl: string;
  ctaLabel: string;
};

export function SiteHeader({ locale, navItems, bookCallUrl, ctaLabel }: SiteHeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [overDark, setOverDark] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const enHref = `${pathname}?lang=en`;
  const ptHref = pathname;
  const homeHref = locale === "en" ? "/?lang=en" : "/";

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
            className="pointer-events-auto absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 rounded-full bg-white/10 px-2 py-2 backdrop-blur-xl backdrop-saturate-150 md:flex"
          >
            {navItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className={`group flex items-center whitespace-nowrap rounded-full px-3 py-2.5 text-sm transition-colors hover:bg-white hover:text-text ${
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
        <div className="relative mx-auto flex h-16 w-[90vw] items-center justify-end gap-6">
          <div className="relative hidden h-8 rounded-full bg-white/10 p-1 backdrop-blur-xl backdrop-saturate-150 md:flex">
            <div
              className={`absolute top-1 h-6 w-9 rounded-full bg-background transition-transform duration-200 ease-[var(--ease-out)] ${
                locale === "pt-PT" ? "translate-x-9" : "translate-x-0"
              }`}
            />
            <Link
              href={enHref}
              className={`relative z-10 flex h-6 w-9 items-center justify-center rounded-full text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
                locale === "en" ? "text-ink" : overDark ? "text-background/70 hover:text-background" : "text-text/60 hover:text-text"
              }`}
            >
              EN
            </Link>
            <Link
              href={ptHref}
              className={`relative z-10 flex h-6 w-9 items-center justify-center rounded-full text-xs font-bold uppercase tracking-wide transition-colors duration-200 ${
                locale === "pt-PT" ? "text-ink" : overDark ? "text-background/70 hover:text-background" : "text-text/60 hover:text-text"
              }`}
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
          <Link href={enHref} className={locale === "en" ? "text-background" : ""} onClick={() => setMenuOpen(false)}>
            EN
          </Link>
          <span>/</span>
          <Link
            href={ptHref}
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
