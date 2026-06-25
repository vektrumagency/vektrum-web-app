import { SectionShell } from "@/components/section-shell";

type ResultsSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  results: string[];
};

export function ResultsSection({ section, results }: ResultsSectionProps) {
  return (
    <SectionShell eyebrow={section.eyebrow} title={section.title} description={section.description}>
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 25s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="relative w-full overflow-hidden py-4 my-8">
        {/* Premium Edge Gradient Masks */}
        <div className="absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>

        <div className="animate-marquee flex gap-4">
          {[...results, ...results].map((item, index) => (
            <article
              key={item + "-" + index}
              className="aspect-square w-48 sm:w-56 shrink-0 flex flex-col justify-center items-center rounded-2xl bg-surface p-6 text-center shadow-sm select-none border border-transparent hover:border-accent/10 transition-colors"
            >
              <p className="text-sm sm:text-base leading-relaxed text-text font-semibold">{item}</p>
            </article>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}
