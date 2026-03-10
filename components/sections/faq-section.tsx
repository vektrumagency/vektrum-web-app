import { SectionShell } from "@/components/section-shell";

type FAQSectionProps = {
  section: { eyebrow: string; title: string; description: string };
  faqs: { question: string; answer: string }[];
};

export function FAQSection({ section, faqs }: FAQSectionProps) {
  return (
    <SectionShell
      id="faq"
      eyebrow={section.eyebrow}
      title={section.title}
      description={section.description}
    >
      <div className="space-y-3">
        {faqs.map((faq, index) => (
          <details
            key={faq.question}
            className="group rounded-2xl border border-border bg-white p-5 reveal"
            style={{ animationDelay: `${index * 70}ms` }}
          >
            <summary className="cursor-pointer list-none pr-8 font-medium text-text">
              {faq.question}
              <span className="float-right text-accent transition group-open:rotate-45">+</span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-muted">{faq.answer}</p>
          </details>
        ))}
      </div>
    </SectionShell>
  );
}
