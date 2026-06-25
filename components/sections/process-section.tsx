import { EyebrowTag } from "@/components/eyebrow-tag";
import { SectionDivider } from "@/components/section-divider";

type ProcessSectionProps = {
  section: { eyebrow: string; title: string; description: string; note?: string };
  processSteps: { step: string; title: string; description: string }[];
  ctaLabel: string;
  ctaHref: string;
};

const THEMES = [
  { bg: "bg-ink", fg: "text-background", desc: "text-background/60", num: "text-background/20" },
  { bg: "bg-accent", fg: "text-background", desc: "text-background/65", num: "text-background/15" },
  { bg: "bg-ink", fg: "text-background", desc: "text-background/60", num: "text-background/20" },
  { bg: "bg-pop", fg: "text-ink", desc: "text-ink/60", num: "text-ink/10" },
];

export function ProcessSection({ section, processSteps, ctaLabel, ctaHref }: ProcessSectionProps) {
  return (
    <>
      <SectionDivider fromClassName="bg-background" toClassName="text-ink" />
      <section id="process" className="relative bg-background py-16 sm:py-24">
        <div className="mx-auto w-[90vw] sm:w-[80vw]">
          <header className="mb-12 max-w-3xl">
            <EyebrowTag label={section.eyebrow} className="mb-5 text-accent" />
            <h2 className="font-heading text-4xl uppercase leading-[0.95] tracking-tight text-text sm:text-5xl md:text-6xl">
              {section.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{section.description}</p>
          </header>

          <div className="relative pb-32">
            {processSteps.map((item, index) => {
              const theme = THEMES[index % THEMES.length];
              return (
                <article
                  key={item.title}
                  style={{ top: `${88 + index * 14}px`, zIndex: index + 1 }}
                  className={`sticky min-h-[70vh] overflow-hidden rounded-2xl p-8 sm:p-10 flex flex-col justify-between ${theme.bg}`}
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1">
                      <p className={`font-heading text-xs uppercase tracking-[0.3em] ${theme.desc}`}>
                        {item.step}
                      </p>
                      <h3 className={`mt-3 font-heading text-3xl uppercase leading-[0.92] tracking-tight sm:text-4xl lg:text-5xl ${theme.fg}`}>
                        {item.title}
                      </h3>
                      <p className={`mt-4 max-w-xl text-base leading-relaxed ${theme.desc}`}>
                        {item.description}
                      </p>
                    </div>
                    <span
                      aria-hidden
                      className={`hidden shrink-0 font-heading text-8xl font-black leading-none select-none lg:block ${theme.num}`}
                    >
                      {item.step}
                    </span>
                  </div>
                </article>
              );
            })}
          </div>

          {section.note ? (
            <p className="mb-6 text-center text-sm font-medium text-background/70">{section.note}</p>
          ) : null}
          <div className="flex justify-center">
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-pop px-6 py-3 text-sm font-bold uppercase tracking-wide text-ink transition hover:-translate-y-0.5"
            >
              {ctaLabel}
            </a>
          </div>
        </div>
      </section>
      <SectionDivider fromClassName="bg-ink" toClassName="text-background" flip />
    </>
  );
}
