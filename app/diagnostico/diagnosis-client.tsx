"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import {
  readUtmAttribution,
  submitAutomationDiagnosis,
  type DiagnosisAnswerValue as AnswerValue,
  type DiagnosisSnapshot as DiagnosisAnswers,
  type UtmAttribution
} from "./diagnosis-api";
import {
  contactQuestion,
  getFlow,
  getSector,
  localize,
  type Locale,
  type OptionDefinition,
  type QuestionDefinition,
  sectorQuestion,
  uiCopy
} from "./diagnosis-config";

type LegacyAnswers = Partial<{
  companyName: string;
  website: string;
  noWebsite: boolean;
  employeeRange: string;
  currentSoftware: string[];
  mainObjective: string;
  additionalContext: string;
  contactName: string;
  email: string;
  phone: string;
  privacyConsent: boolean;
}>;

const EMPTY_ANSWERS: DiagnosisAnswers = {
  companyName: "",
  website: "",
  noWebsite: false,
  sectorId: "",
  responses: {},
  otherResponses: {},
  contactName: "",
  email: "",
  phone: "",
  privacyConsent: false
};

const EMPTY_UTM: UtmAttribution = {
  source: null,
  medium: null,
  campaign: null,
  content: null,
  term: null
};

const STORAGE_KEY = "vektrum-diagnosis-v2";
const LEGACY_STORAGE_KEY = "vektrum-diagnosis-v1";
const TOTAL_STEPS = 15;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ChoiceGrid({
  choices,
  selected,
  multiple = false,
  locale,
  label,
  onSelect
}: {
  choices: readonly OptionDefinition[];
  selected: AnswerValue;
  multiple?: boolean;
  locale: Locale;
  label: string;
  onSelect: (value: string) => void;
}) {
  const selectedValues = Array.isArray(selected) ? selected : [selected];

  return (
    <fieldset>
      <legend className="sr-only">{label}</legend>
      <div className="grid gap-2.5 sm:grid-cols-2" role={multiple ? "group" : "radiogroup"}>
        {choices.map((choice) => {
          const active = selectedValues.includes(choice.id);
          return (
            <button
              key={choice.id}
              type="button"
              role={multiple ? undefined : "radio"}
              aria-checked={multiple ? undefined : active}
              aria-pressed={multiple ? active : undefined}
              onClick={() => onSelect(choice.id)}
              className={`diagnosis-choice group ${active ? "diagnosis-choice-active" : ""}`}
            >
              <span className="diagnosis-choice-mark" aria-hidden="true">{active ? "✓" : choice.mark}</span>
              <span>{localize(choice.label, locale)}</span>
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}

function TextField({
  label,
  value,
  placeholder,
  type = "text",
  inputMode,
  autoFocus = false,
  maxLength,
  onChange,
  onEnter
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  inputMode?: "email" | "tel" | "url" | "text";
  autoFocus?: boolean;
  maxLength?: number;
  onChange: (value: string) => void;
  onEnter?: () => void;
}) {
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && onEnter) {
      event.preventDefault();
      onEnter();
    }
  };

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-text">{label}</span>
      <input
        type={type}
        inputMode={inputMode}
        value={value}
        placeholder={placeholder}
        autoFocus={autoFocus}
        maxLength={maxLength}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        className="diagnosis-input"
      />
    </label>
  );
}

export function DiagnosisClient({ locale }: { locale: Locale }) {
  const t = uiCopy[locale];
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(EMPTY_ANSWERS);
  const [error, setError] = useState("");
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [status, setStatus] = useState<"editing" | "submitting" | "success">("editing");
  const [hydrated, setHydrated] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [utm, setUtm] = useState<UtmAttribution>(EMPTY_UTM);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submissionInFlight = useRef(false);
  const flow = useMemo(() => getFlow(answers.sectorId), [answers.sectorId]);
  const question = flow[step] ?? sectorQuestion;

  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = locale;
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [locale]);

  useEffect(() => {
    const currentUtm = readUtmAttribution(window.location.search);
    setUtm(currentUtm);
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          version?: number;
          started?: boolean;
          step?: number;
          answers?: Partial<DiagnosisAnswers>;
          startedAt?: number | null;
          utm?: Partial<UtmAttribution>;
        };
        if (parsed.version === 2 && parsed.answers) {
          const restored = {
            ...EMPTY_ANSWERS,
            ...parsed.answers,
            responses: parsed.answers.responses ?? {},
            otherResponses: parsed.answers.otherResponses ?? {}
          };
          const maximumStep = restored.sectorId ? TOTAL_STEPS - 1 : 2;
          setStarted(Boolean(parsed.started));
          setStartedAt(typeof parsed.startedAt === "number" ? parsed.startedAt : parsed.started ? Date.now() : null);
          setUtm(mergeUtmAttribution(parsed.utm, currentUtm));
          setStep(Math.min(Math.max(parsed.step ?? 0, 0), maximumStep));
          setAnswers(restored);
        }
      } else {
        const legacy = sessionStorage.getItem(LEGACY_STORAGE_KEY);
        if (legacy) {
          const parsed = JSON.parse(legacy) as { started?: boolean; answers?: LegacyAnswers };
          const old = parsed.answers ?? {};
          setStarted(Boolean(parsed.started));
          setStartedAt(parsed.started ? Date.now() : null);
          setStep(0);
          setAnswers({
            ...EMPTY_ANSWERS,
            companyName: old.companyName ?? "",
            website: old.website ?? "",
            noWebsite: old.noWebsite ?? false,
            responses: {},
            contactName: old.contactName ?? "",
            email: old.email ?? "",
            phone: old.phone ?? "",
            privacyConsent: old.privacyConsent ?? false
          });
          sessionStorage.removeItem(LEGACY_STORAGE_KEY);
        }
      }
    } catch {
      sessionStorage.removeItem(STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || status === "success") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 2, started, step, answers, startedAt, utm }));
  }, [answers, hydrated, started, startedAt, status, step, utm]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const clearError = () => setError("");

  const updateField = <K extends keyof DiagnosisAnswers>(key: K, value: DiagnosisAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    clearError();
  };

  const updateResponse = (questionId: string, value: AnswerValue) => {
    setAnswers((current) => ({
      ...current,
      responses: { ...current.responses, [questionId]: value }
    }));
    clearError();
  };

  const updateOther = (questionId: string, value: string) => {
    setAnswers((current) => ({
      ...current,
      otherResponses: { ...current.otherResponses, [questionId]: value }
    }));
    clearError();
  };

  const scheduleAdvance = () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => {
      setDirection("forward");
      setStep((current) => Math.min(current + 1, TOTAL_STEPS - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 260);
  };

  const selectSingle = (currentQuestion: QuestionDefinition, value: string) => {
    if (currentQuestion.id === sectorQuestion.id) {
      setAnswers((current) => {
        if (current.sectorId === value) return current;
        const previousSector = getSector(current.sectorId);
        const responses = { ...current.responses };
        const otherResponses = { ...current.otherResponses };
        previousSector?.questions.forEach((sectorItem) => {
          delete responses[sectorItem.id];
          delete otherResponses[sectorItem.id];
        });
        return { ...current, sectorId: value, responses, otherResponses };
      });
    } else {
      updateResponse(currentQuestion.id, value);
    }
    clearError();
    if (value !== "other" || currentQuestion.id === sectorQuestion.id) scheduleAdvance();
  };

  const toggleMultiple = (currentQuestion: QuestionDefinition, value: string) => {
    const options = currentQuestion.options ?? [];
    const selectedOption = options.find((item) => item.id === value);
    const current = answers.responses[currentQuestion.id];
    const selected = Array.isArray(current) ? current : [];
    let nextValues: string[];

    if (selectedOption?.exclusive) {
      nextValues = selected.includes(value) ? [] : [value];
    } else {
      const exclusiveIds = new Set(options.filter((item) => item.exclusive).map((item) => item.id));
      const withoutExclusive = selected.filter((item) => !exclusiveIds.has(item));
      nextValues = withoutExclusive.includes(value)
        ? withoutExclusive.filter((item) => item !== value)
        : [...withoutExclusive, value];
    }
    updateResponse(currentQuestion.id, nextValues);
  };

  const next = () => {
    const validationError = validateQuestion(question, answers, t.errors);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (step === TOTAL_STEPS - 1) return;
    setDirection("forward");
    setError("");
    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (step === 0) {
      setStarted(false);
      return;
    }
    setDirection("back");
    setError("");
    setStep((current) => current - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submissionInFlight.current) return;
    const validationError = validateQuestion(contactQuestion, answers, t.errors);
    if (validationError) {
      setError(validationError);
      return;
    }

    submissionInFlight.current = true;
    setStatus("submitting");
    setError("");

    try {
      await submitAutomationDiagnosis({
        answers,
        locale,
        startedAt: startedAt ?? Date.now(),
        utm
      });
      sessionStorage.removeItem(STORAGE_KEY);
      setStatus("success");
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("[automation-diagnosis] submit handler caught error", error);
      }
      submissionInFlight.current = false;
      setStatus("editing");
      setError(t.errors.submit);
    }
  };

  const beginDiagnosis = () => {
    setStartedAt((current) => current ?? Date.now());
    setStarted(true);
  };

  const restart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    submissionInFlight.current = false;
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setStarted(false);
    setStartedAt(null);
    setUtm(readUtmAttribution(window.location.search));
    setStatus("editing");
    setError("");
  };

  const languageHref = locale === "en" ? "/diagnostico" : "/diagnostico?lang=en";
  const homeHref = locale === "en" ? "/?lang=en" : "/?lang=pt-PT";
  const selectedValue = question.id === sectorQuestion.id
    ? answers.sectorId
    : answers.responses[question.id] ?? (question.kind === "multi" ? [] : "");
  const requiresContinue = question.kind !== "single" || (question.id !== sectorQuestion.id && hasOtherSelected(selectedValue));

  return (
    <div className="diagnosis-shell min-h-[100svh] bg-background">
      <a href="#diagnosis-content" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-white">{t.skip}</a>
      <header className="relative z-20 mx-auto flex w-[calc(100%-32px)] max-w-6xl items-center justify-between py-5 sm:w-[calc(100%-64px)] sm:py-7">
        <Link href={homeHref} aria-label={t.brandLabel} className="inline-flex items-center rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4">
          <Image src="/vektrum-logo-transparent.png" alt="Vektrum" width={168} height={48} priority className="h-9 w-auto sm:h-10" />
        </Link>
        <Link href={languageHref} className="rounded-full border border-border/90 bg-surface/80 px-3.5 py-2 text-xs font-bold tracking-[0.12em] text-muted transition hover:-translate-y-0.5 hover:border-accent/40 hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2" aria-label={t.language}>
          {t.languageCode}
        </Link>
      </header>

      <main id="diagnosis-content" className="relative z-10 mx-auto flex w-[calc(100%-32px)] max-w-3xl flex-1 flex-col pb-12 sm:w-[calc(100%-64px)]">
        {!started && status !== "success" ? (
          <section className="diagnosis-enter mx-auto flex min-h-[calc(100svh-120px)] w-full max-w-2xl flex-col items-center justify-center pb-24 pt-10 text-center sm:pb-28">
            <div className="mb-7 flex h-14 w-14 items-center justify-center rounded-2xl border border-accent/15 bg-accent/[0.07] shadow-glow" aria-hidden="true">
              <span className="relative h-5 w-5 rounded-full border-2 border-accent before:absolute before:inset-[4px] before:rounded-full before:bg-accent" />
            </div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.introEyebrow}</p>
            <h1 className="mt-5 text-balance text-[clamp(2.3rem,8vw,4.65rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-text">{t.introTitle}</h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{t.introBody}</p>
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-muted">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pop ring-4 ring-pop/20" />{t.duration}</span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              <span>{t.privateNote}</span>
            </div>
            <button type="button" onClick={beginDiagnosis} className="diagnosis-primary mt-9 min-w-56">{t.start}<span aria-hidden="true">→</span></button>
            <p className="mt-3 text-xs text-muted/80">{t.startHint}</p>
          </section>
        ) : status === "success" ? (
          <SuccessScreen copy={t} homeHref={homeHref} onRestart={restart} />
        ) : status === "submitting" ? (
          <LoadingScreen copy={t} />
        ) : (
          <section className="pb-12 pt-3 sm:pt-8">
            <Progress step={step} copy={t} />
            <div key={question.id} className={`mt-10 sm:mt-14 ${direction === "forward" ? "diagnosis-step-forward" : "diagnosis-step-back"}`}>
              <div className="mb-7 sm:mb-9" aria-live="polite">
                <div className="flex items-center gap-3">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{localize(question.eyebrow, locale)}</p>
                  {question.optional ? <span className="rounded-full bg-border/55 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-muted">{t.optional}</span> : null}
                </div>
                <h1 className="mt-3 text-balance text-3xl font-semibold leading-[1.05] tracking-[-0.04em] text-text sm:text-5xl">{localize(question.title, locale)}</h1>
                <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{localize(question.help, locale)}</p>
              </div>

              <form onSubmit={question.kind === "contact" ? submit : (event) => { event.preventDefault(); next(); }} noValidate>
                <QuestionInput
                  question={question}
                  answers={answers}
                  locale={locale}
                  selected={selectedValue}
                  onFieldChange={updateField}
                  onResponseChange={updateResponse}
                  onOtherChange={updateOther}
                  onSingleSelect={selectSingle}
                  onMultiSelect={toggleMultiple}
                  onEnter={next}
                />
                <div aria-live="polite" className="mt-4 min-h-6">
                  {error ? <p className="flex items-start gap-2 text-sm font-medium text-red-700"><span aria-hidden="true">•</span>{error}</p> : <p className="text-sm font-medium text-accent/80">{t.encouragement[step]}</p>}
                </div>
                <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-5 sm:mt-7 sm:pt-6">
                  <button type="button" onClick={goBack} className="diagnosis-secondary"><span aria-hidden="true">←</span>{t.back}</button>
                  {requiresContinue ? <button type="submit" className="diagnosis-primary">{question.kind === "contact" ? t.submit : t.continue}<span aria-hidden="true">→</span></button> : null}
                </div>
              </form>
            </div>
          </section>
        )}
      </main>
      <div className="pointer-events-none fixed -right-40 -top-40 h-[28rem] w-[28rem] rounded-full bg-accent/[0.055] blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none fixed -bottom-48 -left-40 h-[30rem] w-[30rem] rounded-full bg-pop/[0.10] blur-3xl" aria-hidden="true" />
    </div>
  );
}

function Progress({ step, copy: t }: { step: number; copy: (typeof uiCopy)[Locale] }) {
  const current = step + 1;
  const remaining = TOTAL_STEPS - current;
  const percentage = Math.round((current / TOTAL_STEPS) * 100);

  return (
    <div aria-label={`${t.step} ${current} ${t.of} ${TOTAL_STEPS}`}>
      <div className="mb-3 flex items-end justify-between gap-4 text-xs font-semibold text-muted">
        <div><span className="text-text">{t.step} {current} {t.of} {TOTAL_STEPS}</span><span className="mx-2 text-border">·</span><span>{remaining === 1 ? t.remainingOne : `${remaining} ${t.remainingMany}`}</span></div>
        <span className="text-sm font-bold tabular-nums text-accent">{percentage}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border/65" role="progressbar" aria-valuemin={1} aria-valuemax={TOTAL_STEPS} aria-valuenow={current} aria-valuetext={`${percentage}%`}>
        <div className="h-full rounded-full bg-accent transition-[width] duration-500 ease-[var(--ease-out)]" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

function QuestionInput({
  question,
  answers,
  locale,
  selected,
  onFieldChange,
  onResponseChange,
  onOtherChange,
  onSingleSelect,
  onMultiSelect,
  onEnter
}: {
  question: QuestionDefinition;
  answers: DiagnosisAnswers;
  locale: Locale;
  selected: AnswerValue;
  onFieldChange: <K extends keyof DiagnosisAnswers>(key: K, value: DiagnosisAnswers[K]) => void;
  onResponseChange: (questionId: string, value: AnswerValue) => void;
  onOtherChange: (questionId: string, value: string) => void;
  onSingleSelect: (question: QuestionDefinition, value: string) => void;
  onMultiSelect: (question: QuestionDefinition, value: string) => void;
  onEnter: () => void;
}) {
  const t = uiCopy[locale];

  if (question.kind === "company") {
    return <TextField label={localize(question.title, locale)} value={answers.companyName} placeholder={t.placeholders.company} autoFocus maxLength={100} onChange={(value) => onFieldChange("companyName", value)} onEnter={onEnter} />;
  }

  if (question.kind === "website") {
    return (
      <div>
        {!answers.noWebsite ? <TextField label={localize(question.title, locale)} value={answers.website} placeholder={t.placeholders.website} type="url" inputMode="url" autoFocus maxLength={200} onChange={(value) => onFieldChange("website", value)} onEnter={onEnter} /> : null}
        <button
          type="button"
          aria-pressed={answers.noWebsite}
          onClick={() => {
            onFieldChange("noWebsite", !answers.noWebsite);
            if (!answers.noWebsite) onFieldChange("website", "");
          }}
          className={`diagnosis-choice mt-3 ${answers.noWebsite ? "diagnosis-choice-active" : ""}`}
        >
          <span className="diagnosis-choice-mark" aria-hidden="true">{answers.noWebsite ? "✓" : "—"}</span>
          <span>{t.noWebsite}</span>
        </button>
      </div>
    );
  }

  if (question.kind === "single" || question.kind === "multi") {
    const otherSelected = question.id !== sectorQuestion.id && hasOtherSelected(selected);
    return (
      <>
        <ChoiceGrid
          choices={question.options ?? []}
          selected={selected}
          multiple={question.kind === "multi"}
          locale={locale}
          label={localize(question.title, locale)}
          onSelect={(value) => question.kind === "single" ? onSingleSelect(question, value) : onMultiSelect(question, value)}
        />
        {otherSelected ? (
          <div className="mt-4">
            <TextField
              label={t.otherPlaceholder}
              value={answers.otherResponses[question.id] ?? ""}
              placeholder={t.otherPlaceholder}
              autoFocus
              maxLength={160}
              onChange={(value) => onOtherChange(question.id, value)}
              onEnter={question.kind === "single" ? onEnter : undefined}
            />
          </div>
        ) : null}
      </>
    );
  }

  if (question.kind === "text") {
    const value = typeof selected === "string" ? selected : "";
    const maxLength = question.maxLength ?? 500;
    return (
      <label className="block">
        <span className="sr-only">{localize(question.title, locale)}</span>
        <textarea
          autoFocus
          value={value}
          maxLength={maxLength}
          rows={6}
          placeholder={question.placeholder ? localize(question.placeholder, locale) : ""}
          onChange={(event) => onResponseChange(question.id, event.target.value)}
          className="diagnosis-input min-h-40 resize-y"
        />
        <span className="mt-2 block text-right text-xs tabular-nums text-muted">{value.length}/{maxLength} {t.labels.chars}</span>
      </label>
    );
  }

  return (
    <div className="space-y-4">
      <TextField label={t.labels.name} value={answers.contactName} placeholder={t.placeholders.name} autoFocus maxLength={100} onChange={(value) => onFieldChange("contactName", value)} />
      <TextField label={t.labels.email} value={answers.email} placeholder={t.placeholders.email} type="email" inputMode="email" maxLength={160} onChange={(value) => onFieldChange("email", value)} />
      <TextField label={`${t.labels.phone} · ${t.optional}`} value={answers.phone} placeholder={t.placeholders.phone} type="tel" inputMode="tel" maxLength={40} onChange={(value) => onFieldChange("phone", value)} />
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border bg-surface/70 p-4 text-sm leading-relaxed text-muted transition hover:border-accent/35">
        <input type="checkbox" checked={answers.privacyConsent} onChange={(event) => onFieldChange("privacyConsent", event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-border accent-[rgb(var(--color-accent))]" />
        <span>{t.consentPrefix} <Link href={locale === "en" ? "/privacidade?lang=en" : "/privacidade"} target="_blank" className="font-semibold text-text underline decoration-accent/40 underline-offset-4 hover:text-accent">{t.privacy}</Link>.</span>
      </label>
    </div>
  );
}

function validateQuestion(question: QuestionDefinition, answers: DiagnosisAnswers, errors: (typeof uiCopy)[Locale]["errors"]) {
  if (question.kind === "company" && answers.companyName.trim().length < 2) return errors.company;
  if (question.kind === "website" && !answers.noWebsite && answers.website.trim() && !isValidWebsite(answers.website)) return errors.website;
  if (question.kind === "contact") {
    if (answers.contactName.trim().length < 2) return errors.name;
    if (!EMAIL_PATTERN.test(answers.email.trim())) return errors.email;
    if (!answers.privacyConsent) return errors.consent;
    return "";
  }

  const value = question.id === sectorQuestion.id ? answers.sectorId : answers.responses[question.id];
  if (question.kind === "single" && (typeof value !== "string" || !value)) return errors.required;
  if (question.kind === "multi" && (!Array.isArray(value) || value.length === 0)) return errors.multi;
  if (question.kind === "text" && (typeof value !== "string" || !value.trim())) return errors.text;
  if (question.id !== sectorQuestion.id && hasOtherSelected(value ?? "") && !answers.otherResponses[question.id]?.trim()) return errors.other;
  return "";
}

function hasOtherSelected(value: AnswerValue) {
  return Array.isArray(value) ? value.includes("other") : value === "other";
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

function isValidWebsite(value: string) {
  try {
    const url = new URL(normalizeWebsite(value) ?? "");
    return (url.protocol === "http:" || url.protocol === "https:") && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function mergeUtmAttribution(saved: Partial<UtmAttribution> | undefined, current: UtmAttribution): UtmAttribution {
  return {
    source: saved?.source ?? current.source,
    medium: saved?.medium ?? current.medium,
    campaign: saved?.campaign ?? current.campaign,
    content: saved?.content ?? current.content,
    term: saved?.term ?? current.term
  };
}

function LoadingScreen({ copy: t }: { copy: (typeof uiCopy)[Locale] }) {
  return <section className="diagnosis-enter flex min-h-[calc(100svh-120px)] flex-col items-center justify-center pb-24 text-center" aria-live="polite" aria-busy="true"><div className="diagnosis-loader mb-8" aria-hidden="true"><span /><span /><span /></div><p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.loadingEyebrow}</p><h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-text sm:text-6xl">{t.loadingTitle}</h1><p className="mt-4 max-w-lg text-base leading-relaxed text-muted sm:text-lg">{t.loadingBody}</p></section>;
}

function SuccessScreen({ copy: t, homeHref, onRestart }: { copy: (typeof uiCopy)[Locale]; homeHref: string; onRestart: () => void }) {
  return <section className="diagnosis-enter flex min-h-[calc(100svh-120px)] flex-col items-center justify-center pb-20 text-center"><div className="diagnosis-success-mark mb-8" aria-hidden="true"><span>✓</span></div><p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.successEyebrow}</p><h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-text sm:text-6xl">{t.successTitle}</h1><p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t.successBody}</p><p className="mt-3 max-w-xl text-sm font-medium text-text/75">{t.successEmail}</p><div className="mt-9 flex w-full max-w-md flex-col justify-center gap-3 sm:flex-row"><Link href={homeHref} className="diagnosis-primary justify-center">{t.visit}<span aria-hidden="true">→</span></Link><button type="button" onClick={onRestart} className="diagnosis-secondary justify-center">{t.restart}</button></div></section>;
}
