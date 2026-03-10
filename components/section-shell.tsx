import { ReactNode } from "react";

type SectionShellProps = {
  id?: string;
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
};

export function SectionShell({
  id,
  eyebrow,
  title,
  description,
  children,
  className
}: SectionShellProps) {
  return (
    <section id={id} className={`relative py-16 sm:py-24 ${className ?? ""}`}>
      <div className="mx-auto w-full max-w-6xl px-6">
        <header className="mb-12 max-w-2xl">
          {eyebrow ? (
            <p className="mb-4 inline-flex rounded-full border border-border bg-surface/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
              {eyebrow}
            </p>
          ) : null}
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            {title}
          </h2>
          {description ? (
            <p className="mt-4 text-base leading-relaxed text-muted">{description}</p>
          ) : null}
        </header>
        {children}
      </div>
    </section>
  );
}
