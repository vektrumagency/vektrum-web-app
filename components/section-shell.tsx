import { ReactNode } from "react";
import { EyebrowTag } from "@/components/eyebrow-tag";

type Tone = "cream" | "ink" | "accent";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
  tone?: Tone;
};

const toneStyles: Record<Tone, { section: string; eyebrow: string; title: string; description: string }> = {
  cream: {
    section: "bg-background text-text",
    eyebrow: "text-accent",
    title: "text-text",
    description: "text-muted"
  },
  ink: {
    section: "bg-ink text-background",
    eyebrow: "text-pop",
    title: "text-background",
    description: "text-background/70"
  },
  accent: {
    section: "bg-accent text-background",
    eyebrow: "text-pop",
    title: "text-background",
    description: "text-background/75"
  }
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  tone = "cream"
}: SectionShellProps) {
  const styles = toneStyles[tone];

  return (
    <section id={id} className={`relative py-16 sm:py-24 ${styles.section} ${className ?? ""}`}>
      <div className="mx-auto w-[90vw] sm:w-[80vw]">
        <header className="mb-12 max-w-3xl">
          {eyebrow ? <EyebrowTag label={eyebrow} className={`mb-5 ${styles.eyebrow}`} /> : null}
          <h2 className={`font-heading text-4xl uppercase leading-[1.3] tracking-tight sm:text-5xl md:text-6xl ${styles.title}`}>
            {title}
          </h2>
          {description ? (
            <p className={`mt-5 max-w-xl text-base leading-relaxed ${styles.description}`}>{description}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
