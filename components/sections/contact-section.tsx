import { EyebrowTag } from "@/components/eyebrow-tag";

type ContactSectionProps = {
  section: { eyebrow: string; title: string; description: string; cta: string; submit: string };
  bookCallUrl: string;
  email: string;
  locale: "en" | "pt-PT";
};

export function ContactSection({ section, bookCallUrl, email, locale }: ContactSectionProps) {
  const labels =
    locale === "pt-PT"
      ? {
          items: ["Processos repetitivos", "Ferramentas atuais", "Primeiras oportunidades"],
          emailLabel: "Também pode contactar diretamente"
        }
      : {
          items: ["Repetitive workflows", "Current tools", "First opportunities"],
          emailLabel: "You can also contact us directly"
        };

  return (
    <section id="contact" className="relative overflow-hidden py-16 sm:py-24">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="reveal">
          <EyebrowTag label={section.eyebrow} className="mb-5 text-accent" />
          <h2 className="font-heading text-4xl uppercase leading-[0.95] tracking-tight text-text sm:text-5xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            {section.description}
          </p>
          <a
            href={bookCallUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-7 inline-flex w-full justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-background shadow-[0_18px_40px_-24px_rgb(var(--color-accent))] transition hover:-translate-y-0.5 hover:bg-accent-soft sm:w-auto"
          >
            {section.cta}
          </a>
        </div>
        <div className="reveal rounded-3xl border border-border bg-surface/85 p-6 shadow-glow md:p-8 lg:[animation-delay:160ms]">
          <div className="grid gap-3">
            {labels.items.map((item, index) => (
              <div key={item} className="flex items-center gap-4 rounded-2xl border border-border bg-background/55 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-accent/25 bg-accent/10 font-heading text-sm font-semibold text-accent-soft">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="text-sm font-medium text-text">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-6 rounded-2xl border border-accent/20 bg-accent/10 p-5">
            <p className="text-sm leading-relaxed text-muted">{labels.emailLabel}</p>
            <a
              href={`mailto:${email}`}
              className="mt-2 inline-flex text-sm font-semibold text-text transition hover:text-accent-soft"
            >
              {email}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
