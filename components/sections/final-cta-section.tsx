import { ScallopBadge } from "@/components/scallop-badge";
import { SectionDivider } from "@/components/section-divider";
import Link from "next/link";

type FinalCtaSectionProps = {
  section: {
    eyebrow: string;
    title: string;
    description: string;
    cta: string;
  };
  ctaHref: string;
  tone?: "accent" | "plain";
};

const TONE_STYLES = {
  accent: {
    section: "bg-accent",
    eyebrow: "text-pop",
    title: "text-background",
    description: "text-background/75",
    cta: "bg-background text-ink hover:bg-pop"
  },
  plain: {
    section: "bg-background",
    eyebrow: "text-accent",
    title: "text-text",
    description: "text-muted",
    cta: "bg-accent text-background hover:bg-accent-soft"
  }
};

export function FinalCtaSection({ section, ctaHref, tone = "accent" }: FinalCtaSectionProps) {
  const styles = TONE_STYLES[tone];

  return (
    <>
      {tone === "accent" ? <SectionDivider fromClassName="bg-background" toClassName="text-accent" /> : null}
      <section id="final-cta" className={`relative overflow-hidden py-16 sm:py-24 ${styles.section}`}>
        <div className="relative mx-auto w-[90vw] sm:w-[80vw]">
          <p className={`mb-4 text-xs font-semibold uppercase tracking-[0.2em] ${styles.eyebrow}`}>{section.eyebrow}</p>
          <div
            className={`flex flex-col items-start gap-8 sm:flex-row sm:items-center ${
              tone === "accent" ? "sm:justify-between" : ""
            }`}
          >
            <div className="max-w-2xl">
              <h2 className={`font-heading text-4xl uppercase leading-[1.3] tracking-tight sm:text-5xl md:text-6xl ${styles.title}`}>
                {section.title}
              </h2>
              <p className={`mt-5 max-w-xl text-base leading-relaxed ${styles.description}`}>{section.description}</p>
              <Link
                href={ctaHref}
                className={`mt-8 inline-flex rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide transition hover:-translate-y-0.5 ${styles.cta}`}
              >
                {section.cta}
              </Link>
            </div>
            {tone === "accent" ? (
              <ScallopBadge className="text-pop" rotateClassName="flex h-32 w-32 shrink-0">
                <span className="text-xs font-bold uppercase leading-tight text-ink">{section.cta}</span>
              </ScallopBadge>
            ) : null}
          </div>
        </div>
      </section>
    </>
  );
}
