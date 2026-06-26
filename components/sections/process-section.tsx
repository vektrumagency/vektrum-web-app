import { EyebrowTag } from "@/components/eyebrow-tag";
import { SectionDivider } from "@/components/section-divider";

type ProcessSectionProps = {
  section: { eyebrow: string; title: string; description: string; note?: string };
  processSteps: { step: string; title: string; description: string }[];
  ctaLabel: string;
  ctaHref: string;
};

export function ProcessSection({ section, processSteps, ctaLabel, ctaHref }: ProcessSectionProps) {
  return (
    <>
      <SectionDivider fromClassName="bg-background" toClassName="text-ink" />
      <section id="process" className="relative bg-background py-16 sm:py-24">
        <div className="mx-auto w-[90vw] sm:w-[80vw]">
          <header className="mb-12 max-w-3xl">
            <EyebrowTag label={section.eyebrow} className="mb-5 text-accent" />
            <h2 className="font-heading text-4xl uppercase leading-[1.3] tracking-tight text-text sm:text-5xl md:text-6xl">
              {section.title}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">{section.description}</p>
          </header>

          {/* Mobile view: Vertical Curved Timeline Graph */}
          <div className="relative block h-[600px] md:hidden my-16 max-w-sm mx-auto">
            {/* Vertical wavy connecting line */}
            <svg viewBox="0 0 200 600" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 70 80 C 70 160, 130 160, 130 240 C 130 320, 70 320, 70 400 C 70 480, 130 480, 130 560"
                fill="none"
                stroke="rgb(var(--color-accent))"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {/* The interactive points */}
            {processSteps.map((item, index) => {
              const isEven = index % 2 === 0;
              const pos = {
                left: isEven ? "35%" : "65%",
                top: `${13.33 + index * 26.67}%`,
              };

              return (
                <div
                  key={item.title}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="group relative flex flex-col items-center">
                    
                    {/* Interactive pill */}
                    <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-full shadow-glow transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-background cursor-pointer select-none group-hover:border-accent group-hover:bg-background">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-background">
                        {item.step}
                      </span>
                      <span className="font-body text-[11px] font-bold text-text uppercase tracking-wider transition-colors group-hover:text-accent">
                        {item.title}
                      </span>
                    </div>

                    {/* Tooltip Description */}
                    <div className={`pointer-events-none absolute bottom-full left-1/2 mb-4 w-60 z-50 scale-95 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 ${
                      isEven ? "-translate-x-[35%]" : "-translate-x-[65%]"
                    }`}>
                      <div className="bg-background text-text p-3.5 rounded-xl shadow-glow text-[11px] leading-relaxed border border-border text-left relative">
                        <p className="font-bold text-accent mb-1 font-body text-[11px] uppercase tracking-wider">{item.title}</p>
                        <p className="text-muted leading-relaxed">{item.description}</p>
                        {/* Tooltip arrow */}
                        <div className={`absolute top-full h-2 w-2 -translate-y-1/2 rotate-45 bg-background border-r border-b border-border -translate-x-1/2 ${
                          isEven ? "left-[35%]" : "left-[65%]"
                        }`}></div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {/* Desktop view: Horizontal Curved Timeline Graph */}
          <div className="relative hidden h-64 md:block my-16">
            {/* Horizontal wavy connecting line */}
            <svg viewBox="0 0 1000 160" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none">
              <path
                d="M 125 40 C 250 40, 250 120, 375 120 C 500 120, 500 40, 625 40 C 750 40, 750 120, 875 120"
                fill="none"
                stroke="rgb(var(--color-accent))"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>

            {/* The interactive points */}
            {processSteps.map((item, index) => {
              const pos = {
                left: `${12.5 + index * 25}%`,
                top: index % 2 === 0 ? "25%" : "75%",
              };

              return (
                <div
                  key={item.title}
                  style={{ left: pos.left, top: pos.top }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-10"
                >
                  <div className="group relative flex flex-col items-center">
                    
                    {/* Interactive pill */}
                    <div className="flex items-center gap-2 bg-surface border border-border px-4 py-2 rounded-full shadow-glow transition-all duration-300 hover:scale-105 hover:border-accent hover:bg-background cursor-pointer select-none group-hover:border-accent group-hover:bg-background">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-background">
                        {item.step}
                      </span>
                      <span className="font-body text-[11px] font-bold text-text uppercase tracking-wider transition-colors group-hover:text-accent">
                        {item.title}
                      </span>
                    </div>

                    {/* Tooltip Description */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 mb-4 w-64 -translate-x-1/2 scale-95 opacity-0 transition-all duration-200 ease-out group-hover:pointer-events-auto group-hover:scale-100 group-hover:opacity-100 z-50">
                      <div className="bg-background text-text p-3.5 rounded-xl shadow-glow text-[11px] leading-relaxed border border-border text-left">
                        <p className="font-bold text-accent mb-1 font-body text-[11px] uppercase tracking-wider">{item.title}</p>
                        <p className="text-muted leading-relaxed">{item.description}</p>
                        {/* Tooltip arrow */}
                        <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-background border-r border-b border-border"></div>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>

          {section.note ? (
            <p className="mb-6 text-center text-sm font-medium text-background/70">{section.note}</p>
          ) : null}

        </div>
      </section>
      <SectionDivider fromClassName="bg-ink" toClassName="text-background" flip />
    </>
  );
}
