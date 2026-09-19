"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { readUtmAttribution, type UtmAttribution } from "./diagnosis-api";
import { DiagnosisClient } from "./diagnosis-client";
import { localize, type Locale } from "./diagnosis-config";
import { localizePath } from "@/lib/site-links";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PT_PHONE_PATTERN = /^[239]\d{8}$/;
const LEAD_SUBMITTED_KEY = "vektrum_lead_submitted";

type GateStep = "form" | "choice";

type Lead = { name: string; email: string; phone: string };

type FieldErrors = Partial<Record<"name" | "email" | "phone" | "privacyConsent", string>>;

const COPY = {
  "pt-PT": {
    eyebrow: "Diagnóstico de automação",
    title: "Vamos começar pelo essencial",
    body: "Deixe-nos os seus contactos e escolha como quer continuar: marcar uma chamada connosco ou responder ao diagnóstico completo.",
    name: "Nome",
    namePlaceholder: "O seu nome",
    email: "Email profissional",
    emailPlaceholder: "nome@empresa.pt",
    phone: "Telefone",
    phonePlaceholder: "912 345 678",
    consentPrefix: "Autorizo a Vektrum a tratar estes dados para me contactar sobre este pedido. Li a",
    privacy: "Política de Privacidade",
    submit: "Continuar",
    errors: {
      name: "Indique o seu nome.",
      email: "Introduza um endereço de email válido.",
      phone: "Introduza um número de telemóvel ou telefone português válido (9 dígitos).",
      consent: "É necessário aceitar o tratamento dos dados para continuar."
    },
    choiceEyebrow: "Obrigado, {name}",
    thanksReturning: "Obrigado pelo seu contacto",
    choiceTitle: "Como prefere continuar?",
    choiceBody: "Pode marcar uma chamada connosco agora ou responder a algumas perguntas para receber um relatório personalizado.",
    bookTitle: "Marcar reunião",
    bookBody: "Escolha um horário na nossa agenda e falamos consigo diretamente.",
    bookCta: "Marcar reunião",
    diagnosisTitle: "Continuar para o diagnóstico",
    diagnosisBody: "Responda a algumas perguntas adaptadas ao seu setor e receba um relatório com oportunidades priorizadas.",
    diagnosisCta: "Continuar para o diagnóstico",
    brandLabel: "Vektrum — página inicial",
    skip: "Ir para o conteúdo"
  },
  en: {
    eyebrow: "Automation diagnosis",
    title: "Let's start with the basics",
    body: "Leave us your contact details and choose how you'd like to continue: book a call with us or answer the full diagnosis.",
    name: "Name",
    namePlaceholder: "Your name",
    email: "Work email",
    emailPlaceholder: "name@company.com",
    phone: "Phone",
    phonePlaceholder: "912 345 678",
    consentPrefix: "I authorize Vektrum to process this information to contact me about this request. I have read the",
    privacy: "Privacy Policy",
    submit: "Continue",
    errors: {
      name: "Enter your name.",
      email: "Enter a valid email address.",
      phone: "Enter a valid Portuguese phone number (9 digits).",
      consent: "You need to accept data processing to continue."
    },
    choiceEyebrow: "Thanks, {name}",
    thanksReturning: "Thank you for your contact",
    choiceTitle: "How would you like to continue?",
    choiceBody: "You can book a call with us now or answer a few questions to get a personalized report.",
    bookTitle: "Book a meeting",
    bookBody: "Pick a time on our calendar and we'll talk directly.",
    bookCta: "Book a meeting",
    diagnosisTitle: "Continue to the diagnosis",
    diagnosisBody: "Answer a few questions tailored to your industry and get a report with prioritized opportunities.",
    diagnosisCta: "Continue to diagnosis",
    brandLabel: "Vektrum — homepage",
    skip: "Skip to content"
  }
} satisfies Record<Locale, Record<string, unknown>>;

export function DiagnosisGate({ locale, campaignSectorId = null }: { locale: Locale; campaignSectorId?: string | null }) {
  const t = COPY[locale];
  const router = useRouter();
  const [step, setStep] = useState<GateStep>("form");
  const [lead, setLead] = useState<Lead>({ name: "", email: "", phone: "" });
  const [privacyConsent, setPrivacyConsent] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [showLongForm, setShowLongForm] = useState(false);
  const [returning, setReturning] = useState(false);
  const startedAt = useRef<number>(Date.now());
  const homeHref = localizePath("/", locale);

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [locale]);

  useEffect(() => {
    try {
      if (typeof window !== "undefined" && window.localStorage.getItem(LEAD_SUBMITTED_KEY)) {
        setReturning(true);
        setStep("choice");
      }
    } catch {
      /* localStorage unavailable (private mode) — just show the form */
    }
  }, []);

  const validate = (): FieldErrors => {
    const issues: FieldErrors = {};
    if (lead.name.trim().length < 2) issues.name = t.errors.name;
    if (!EMAIL_PATTERN.test(lead.email.trim())) issues.email = t.errors.email;
    if (!PT_PHONE_PATTERN.test(lead.phone.replace(/\s+/g, ""))) issues.phone = t.errors.phone;
    if (!privacyConsent) issues.privacyConsent = t.errors.consent;
    return issues;
  };

  const submitLead = async (event: FormEvent) => {
    event.preventDefault();
    const issues = validate();
    if (Object.keys(issues).length) {
      setErrors(issues);
      return;
    }
    setErrors({});
    setSubmitting(true);

    const utm = readUtmAttribution(window.location.search);
    const payload = buildLeadPayload(lead, utm, locale, startedAt.current);

    try {
      await fetch("/api/automation-diagnosis", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        cache: "no-store"
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[diagnosis-gate] lead submission failed (best-effort, continuing)", error);
      }
    } finally {
      try {
        window.localStorage.setItem(LEAD_SUBMITTED_KEY, new Date().toISOString());
      } catch {
        /* ignore */
      }
      setSubmitting(false);
      setStep("choice");
    }
  };

  const goToBooking = () => {
    const params = new URLSearchParams();
    params.set("name", lead.name.trim());
    params.set("email", lead.email.trim());
    router.push(`${localizePath("/marcar", locale)}?${params.toString()}`);
  };

  const continueToDiagnosis = () => {
    setShowLongForm(true);
  };

  if (showLongForm) {
    return (
      <DiagnosisClient
        locale={locale}
        campaignSectorId={campaignSectorId}
        prefill={{ contactName: lead.name, email: lead.email, phone: lead.phone }}
      />
    );
  }

  return (
    <div className="diagnosis-shell min-h-[100svh] bg-background">
      <a href="#gate-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white">{t.skip}</a>
      <header className="relative z-20 mx-auto flex w-[calc(100%-32px)] max-w-6xl items-center justify-between py-5 sm:w-[calc(100%-64px)] sm:py-7">
        <Link href={homeHref} aria-label={t.brandLabel} className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4">
          <Image src="/vektrum-logo-transparent.png" alt="Vektrum" width={168} height={48} priority className="h-9 w-auto sm:h-10" />
        </Link>
      </header>

      <main id="gate-content" className="relative z-10 mx-auto flex w-[calc(100%-32px)] max-w-2xl flex-1 flex-col items-center justify-center pb-24 pt-6 sm:w-[calc(100%-64px)]">
        {step === "form" ? (
          <section className="diagnosis-enter w-full text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.eyebrow}</p>
            <h1 className="mt-5 text-balance text-[clamp(2rem,6vw,3.4rem)] font-semibold leading-[1.02] tracking-[-0.05em] text-text">{t.title}</h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{t.body}</p>

            <form onSubmit={submitLead} noValidate className="mt-8 space-y-4 text-left">
              <label className="block" data-field="name">
                <span className="mb-2 block text-sm font-semibold text-text">{t.name}</span>
                <input
                  type="text"
                  value={lead.name}
                  placeholder={t.namePlaceholder}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.name)}
                  maxLength={100}
                  onChange={(event) => setLead((current) => ({ ...current, name: event.target.value }))}
                  className="diagnosis-input"
                />
                {errors.name ? <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{errors.name}</p> : null}
              </label>

              <label className="block" data-field="email">
                <span className="mb-2 block text-sm font-semibold text-text">{t.email}</span>
                <input
                  type="email"
                  inputMode="email"
                  value={lead.email}
                  placeholder={t.emailPlaceholder}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  maxLength={160}
                  onChange={(event) => setLead((current) => ({ ...current, email: event.target.value }))}
                  className="diagnosis-input"
                />
                {errors.email ? <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{errors.email}</p> : null}
              </label>

              <label className="block" data-field="phone">
                <span className="mb-2 block text-sm font-semibold text-text">{t.phone}</span>
                <div className="relative">
                  <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-text sm:left-5 sm:text-lg">
                    🇵🇹 +351
                  </span>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={lead.phone}
                    placeholder={t.phonePlaceholder}
                    autoComplete="tel"
                    aria-invalid={Boolean(errors.phone)}
                    maxLength={20}
                    onChange={(event) => setLead((current) => ({ ...current, phone: event.target.value }))}
                    className="diagnosis-input pl-[4.75rem] sm:pl-[5.5rem]"
                  />
                </div>
                {errors.phone ? <p role="alert" className="mt-1.5 text-sm font-medium text-red-700">{errors.phone}</p> : null}
              </label>

              <label data-field="privacyConsent" className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-surface/70 p-4 text-sm leading-relaxed text-muted transition hover:border-accent/35 ${errors.privacyConsent ? "border-red-500" : "border-border"}`}>
                <input
                  type="checkbox"
                  checked={privacyConsent}
                  aria-invalid={Boolean(errors.privacyConsent)}
                  onChange={(event) => setPrivacyConsent(event.target.checked)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded border-border accent-[rgb(var(--color-accent))]"
                />
                <span>{t.consentPrefix} <Link href={localizePath("/privacidade", locale)} target="_blank" className="font-semibold text-text underline decoration-accent/40 underline-offset-4 hover:text-accent">{t.privacy}</Link>.</span>
              </label>
              {errors.privacyConsent ? <p role="alert" className="text-sm font-medium text-red-700">{errors.privacyConsent}</p> : null}

              <button type="submit" disabled={submitting} className="diagnosis-primary mt-2 w-full justify-center disabled:opacity-60">
                {t.submit}<span aria-hidden="true">→</span>
              </button>
            </form>
          </section>
        ) : (
          <section className="diagnosis-enter w-full text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{returning ? t.thanksReturning : t.choiceEyebrow.replace("{name}", lead.name.split(" ")[0] || lead.name)}</p>
            <h1 className="mt-5 text-balance text-[clamp(1.9rem,5.5vw,3rem)] font-semibold leading-[1.05] tracking-[-0.05em] text-text">{t.choiceTitle}</h1>
            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{t.choiceBody}</p>

            <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
              <button type="button" onClick={goToBooking} className="flex flex-col items-start gap-2 rounded-3xl border border-border bg-surface/80 p-6 text-left transition hover:-translate-y-0.5 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <span className="text-lg font-semibold text-text">{t.bookTitle}</span>
                <span className="text-sm text-muted">{t.bookBody}</span>
                <span className="diagnosis-primary mt-3 justify-center">{t.bookCta}<span aria-hidden="true">→</span></span>
              </button>
              <button type="button" onClick={continueToDiagnosis} className="flex flex-col items-start gap-2 rounded-3xl border border-border bg-surface/80 p-6 text-left transition hover:-translate-y-0.5 hover:border-accent/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent">
                <span className="text-lg font-semibold text-text">{t.diagnosisTitle}</span>
                <span className="text-sm text-muted">{t.diagnosisBody}</span>
                <span className="diagnosis-secondary mt-3 justify-center">{t.diagnosisCta}<span aria-hidden="true">→</span></span>
              </button>
            </div>
          </section>
        )}
      </main>
      <div className="pointer-events-none fixed -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/[0.055] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none fixed -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-pop/[0.10] blur-3xl" aria-hidden="true" />
    </div>
  );
}

export function buildLeadPayload(lead: Lead, utm: UtmAttribution, locale: Locale, startedAtMs: number) {
  return {
    leadType: "short",
    contact: {
      name: lead.name.trim(),
      email: lead.email.trim().toLowerCase(),
      phone: lead.phone.trim() ? `+351 ${lead.phone.trim()}` : null
    },
    metadata: {
      formVersion: "automation-diagnosis-lead-v1",
      submittedAt: new Date().toISOString(),
      durationSeconds: Math.max(0, Math.round((Date.now() - startedAtMs) / 1000)),
      language: locale,
      page: typeof window !== "undefined" ? window.location.href : "",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : ""
    },
    utm
  };
}

// Referenced for locale-aware label lookups elsewhere; keeps `localize` imported for parity with diagnosis-config usage.
void localize;
