import Link from "next/link";
import { Locale } from "@/lib/site-config";
import { Sector } from "@/lib/sectors-content";

type SectorGridProps = {
  sectors: Sector[];
  locale: Locale;
  viewSectorLabel: string;
};

const THEMES = [
  { bg: "bg-ink", fg: "text-background", desc: "text-background/65" },
  { bg: "bg-accent", fg: "text-background", desc: "text-background/70" }
];

export function SectorGrid({ sectors, locale, viewSectorLabel }: SectorGridProps) {
  const langSuffix = locale === "en" ? "?lang=en" : locale === "es" ? "?lang=es" : "";

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {sectors.map((sector, index) => {
        const theme = THEMES[index % THEMES.length];

        return (
          <Link
            key={sector.slug}
            href={`/setores/${sector.slug}${langSuffix}`}
            className={`group flex flex-col justify-between gap-10 rounded-2xl p-8 transition duration-200 ease-[var(--ease-out)] hover:-translate-y-1 sm:p-10 ${theme.bg}`}
          >
            <div>
              <h3 className={`font-heading text-3xl uppercase leading-[1.3] tracking-tight sm:text-4xl ${theme.fg}`}>
                {sector.title}
              </h3>
              <p className={`mt-4 max-w-md text-sm leading-relaxed ${theme.desc}`}>{sector.description}</p>
            </div>
            <span className={`inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wide ${theme.fg}`}>
              {viewSectorLabel}
              <span aria-hidden="true" className="transition-transform duration-200 group-hover:translate-x-1">
                →
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
