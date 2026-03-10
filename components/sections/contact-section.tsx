type ContactSectionProps = {
  section: { eyebrow: string; title: string; description: string; cta: string; submit: string };
  bookCallUrl: string;
  locale: "en" | "pt-PT";
};

export function ContactSection({ section, bookCallUrl, locale }: ContactSectionProps) {
  const labels =
    locale === "pt-PT"
      ? {
          name: "Nome",
          email: "Email",
          company: "Empresa",
          message: "Mensagem",
          namePlaceholder: "O seu nome",
          emailPlaceholder: "voce@empresa.com",
          companyPlaceholder: "Nome da empresa",
          messagePlaceholder: "Descreva os objetivos e bloqueios operacionais."
        }
      : {
          name: "Name",
          email: "Email",
          company: "Company",
          message: "Message",
          namePlaceholder: "Your name",
          emailPlaceholder: "you@company.com",
          companyPlaceholder: "Company name",
          messagePlaceholder: "Tell us your operational goals and bottlenecks."
        };
  return (
    <section id="contact" className="relative py-20 sm:py-28">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="reveal">
          <p className="mb-4 inline-flex rounded-full border border-border bg-white px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-muted">
            {section.eyebrow}
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-text sm:text-4xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
            {section.description}
          </p>
          <a
            href={bookCallUrl}
            className="mt-6 inline-flex rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-white transition hover:bg-blue-600"
          >
            {section.cta}
          </a>
        </div>
        <form
          className="reveal rounded-3xl border border-border bg-white p-6 shadow-glow md:p-8 lg:[animation-delay:160ms]"
          action="#"
          method="post"
          aria-label="Contact form"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="name">
                {labels.name}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent/50"
                placeholder={labels.namePlaceholder}
              />
            </div>
            <div className="sm:col-span-1">
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="email">
                {labels.email}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent/50"
                placeholder={labels.emailPlaceholder}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="company">
                {labels.company}
              </label>
              <input
                id="company"
                name="company"
                type="text"
                className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent/50"
                placeholder={labels.companyPlaceholder}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xs uppercase tracking-[0.14em] text-muted" htmlFor="message">
                {labels.message}
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                required
                className="w-full rounded-xl border border-border bg-slate-50 px-4 py-3 text-sm text-text outline-none transition placeholder:text-muted focus:border-accent/50"
                placeholder={labels.messagePlaceholder}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-5 inline-flex rounded-full bg-accent px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-blue-600"
          >
            {section.submit}
          </button>
        </form>
      </div>
    </section>
  );
}
