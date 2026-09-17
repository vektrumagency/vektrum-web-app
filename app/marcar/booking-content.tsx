import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Booker } from "@/components/Booker";
import type { Locale } from "@/lib/site-config";
import { buildLanguageAlternates, localizePath } from "@/lib/site-links";

type BookingSearchParams = Promise<{ name?: string; email?: string }>;

const SHELL: Record<Locale, { brandLabel: string; skip: string }> = {
  "pt-PT": { brandLabel: "Vektrum — página inicial", skip: "Ir para o conteúdo" },
  en: { brandLabel: "Vektrum — homepage", skip: "Skip to content" }
};

export function getBookingMetadata(locale: Locale): Metadata {
  // Not an entry point: visitors land here from the diagnosis gate, and the
  // page is empty of indexable content until availability loads client-side.
  const robots = { index: false, follow: true };

  return locale === "en"
    ? {
        title: "Book a call | Vektrum",
        description: "Pick a time on our calendar and we'll talk about automating your manual processes.",
        alternates: { canonical: "/en/marcar", languages: buildLanguageAlternates("/marcar") },
        robots
      }
    : {
        title: "Marcar uma chamada | Vektrum",
        description: "Escolha um horário na nossa agenda e falamos sobre a automação dos seus processos manuais.",
        alternates: { canonical: "/marcar", languages: buildLanguageAlternates("/marcar") },
        robots
      };
}

export async function BookingPageContent({
  locale,
  searchParams
}: {
  locale: Locale;
  searchParams: BookingSearchParams;
}) {
  const params = await searchParams;
  const shell = SHELL[locale];

  return (
    <div className="diagnosis-shell flex min-h-[100svh] flex-col bg-background">
      <a
        href="#booking-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        {shell.skip}
      </a>

      <header className="relative z-20 mx-auto flex w-[calc(100%-32px)] max-w-6xl items-center justify-between py-5 sm:w-[calc(100%-64px)] sm:py-7">
        <Link
          href={localizePath("/", locale)}
          aria-label={shell.brandLabel}
          className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4"
        >
          <Image src="/vektrum-logo-transparent.png" alt="Vektrum" width={168} height={48} priority className="h-9 w-auto sm:h-10" />
        </Link>
      </header>

      <main
        id="booking-content"
        className="relative z-10 mx-auto flex w-[calc(100%-32px)] max-w-2xl flex-1 flex-col items-center justify-center pb-24 pt-6 sm:w-[calc(100%-64px)]"
      >
        <Booker name={params.name} email={params.email} locale={locale} />
      </main>
    </div>
  );
}
