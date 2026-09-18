"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { localizePath } from "@/lib/site-links";
import {
  readUtmAttribution,
  submitAutomationDiagnosis,
  type DiagnosisAnswerValue as AnswerValue,
  type DiagnosisSnapshot as DiagnosisAnswers,
  type UtmAttribution
} from "./diagnosis-api";
import {
  contactQuestion,
  getCampaignIntro,
  getFlow,
  getQuestionInsight,
  getSector,
  getVisibleQuestionOptions,
  localize,
  prioritySectorIds,
  sectors,
  type DiagnosisPhase,
  type Locale,
  type OptionDefinition,
  type OptionGroupDefinition,
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

const STORAGE_KEY = "vektrum-diagnosis-v3";
const PREVIOUS_STORAGE_KEY = "vektrum-diagnosis-v2";
const LEGACY_STORAGE_KEY = "vektrum-diagnosis-v1";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PT_PHONE_PATTERN = /^[239]\d{8}$/;

type ValidationIssue = { message: string; field: string };

function ChoiceGrid({
  choices,
  selected,
  multiple = false,
  locale,
  label,
  groups,
  fieldId,
  invalid,
  describedBy,
  onSelect
}: {
  choices: readonly OptionDefinition[];
  selected: AnswerValue;
  multiple?: boolean;
  locale: Locale;
  label: string;
  groups?: readonly OptionGroupDefinition[];
  fieldId: string;
  invalid?: boolean;
  describedBy?: string;
  onSelect: (value: string) => void;
}) {
  const selectedValues = Array.isArray(selected) ? selected : [selected];

  const renderChoices = (items: readonly OptionDefinition[], compact = false) => (
    <div className={`grid gap-2.5 ${compact ? "grid-cols-2 sm:grid-cols-3" : "sm:grid-cols-2"}`} role={multiple ? "group" : "radiogroup"}>
      {items.map((choice) => {
        const active = selectedValues.includes(choice.id);
        return (
          <button
            key={choice.id}
            type="button"
            role={multiple ? undefined : "radio"}
            aria-checked={multiple ? undefined : active}
            aria-pressed={multiple ? active : undefined}
            onClick={() => onSelect(choice.id)}
            className={`diagnosis-choice group ${compact ? "diagnosis-choice-compact" : ""} ${active ? "diagnosis-choice-active" : ""}`}
          >
            <span className="diagnosis-choice-mark" aria-hidden="true">{active ? "✓" : choice.mark}</span>
            <span>{localize(choice.label, locale)}</span>
          </button>
        );
      })}
    </div>
  );

  const groupedIds = new Set(groups?.flatMap((groupDefinition) => groupDefinition.optionIds) ?? []);
  const ungrouped = choices.filter((choice) => !groupedIds.has(choice.id));

  return (
    <fieldset data-field={fieldId} aria-invalid={invalid} aria-describedby={describedBy}>
      <legend className="sr-only">{label}</legend>
      <div className="space-y-5">
        {groups?.map((groupDefinition) => {
          const groupChoices = choices.filter((choice) => groupDefinition.optionIds.includes(choice.id));
          if (!groupChoices.length) return null;
          return (
            <div key={groupDefinition.id} className="diagnosis-option-group">
              <p className="mb-2.5 text-xs font-bold uppercase tracking-[0.14em] text-muted">
                {localize(groupDefinition.label, locale)}{groupDefinition.required ? <span className="ml-1 text-accent" aria-hidden="true">*</span> : null}
              </p>
              {renderChoices(groupChoices, groupDefinition.compact)}
            </div>
          );
        })}
        {groups?.length && ungrouped.length ? renderChoices(ungrouped) : null}
        {!groups?.length ? renderChoices(choices) : null}
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
  autoComplete,
  fieldId,
  invalid,
  describedBy,
  maxLength,
  prefix,
  onChange,
  onEnter
}: {
  label: string;
  value: string;
  placeholder: string;
  type?: string;
  inputMode?: "email" | "tel" | "url" | "text";
  autoComplete?: string;
  fieldId: string;
  invalid?: boolean;
  describedBy?: string;
  maxLength?: number;
  prefix?: string;
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
    <label className="block" data-field={fieldId}>
      <span className="mb-2 block text-sm font-semibold text-text">{label}</span>
      <div className="relative">
        {prefix ? (
          <span className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-base text-text sm:left-5 sm:text-lg">
            {prefix}
          </span>
        ) : null}
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={invalid}
          aria-describedby={describedBy}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          className={`diagnosis-input ${prefix ? "pl-[4.75rem] sm:pl-[5.5rem]" : ""}`}
        />
      </div>
    </label>
  );
}

export function DiagnosisClient({
  locale,
  campaignSectorId = null,
  prefill
}: {
  locale: Locale;
  campaignSectorId?: string | null;
  prefill?: { contactName?: string; email?: string; phone?: string };
}) {
  const t = uiCopy[locale];
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<DiagnosisAnswers>(() => ({
    ...EMPTY_ANSWERS,
    contactName: prefill?.contactName ?? EMPTY_ANSWERS.contactName,
    email: prefill?.email ?? EMPTY_ANSWERS.email,
    phone: prefill?.phone ?? EMPTY_ANSWERS.phone
  }));
  const [error, setError] = useState<ValidationIssue | null>(null);
  const [showAllSectors, setShowAllSectors] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [status, setStatus] = useState<"editing" | "submitting" | "success">("editing");
  const [hydrated, setHydrated] = useState(false);
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [utm, setUtm] = useState<UtmAttribution>(EMPTY_UTM);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submissionInFlight = useRef(false);
  const flow = useMemo(() => getFlow(answers.sectorId), [answers.sectorId]);
  const question = flow[step] ?? sectorQuestion;
  const campaignIntro = getCampaignIntro(campaignSectorId, locale);

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
      const stored = sessionStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(PREVIOUS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as {
          version?: number;
          started?: boolean;
          step?: number;
          questionId?: string;
          answers?: Partial<DiagnosisAnswers>;
          startedAt?: number | null;
          utm?: Partial<UtmAttribution>;
        };
        if ((parsed.version === 2 || parsed.version === 3) && parsed.answers) {
          const restored = {
            ...EMPTY_ANSWERS,
            ...parsed.answers,
            responses: parsed.answers.responses ?? {},
            otherResponses: parsed.answers.otherResponses ?? {}
          };
          const restoredFlow = getFlow(restored.sectorId);
          const questionStep = parsed.questionId ? restoredFlow.findIndex((item) => item.id === parsed.questionId) : -1;
          const maximumStep = restored.sectorId ? restoredFlow.length - 1 : 2;
          setStarted(Boolean(parsed.started));
          setStartedAt(typeof parsed.startedAt === "number" ? parsed.startedAt : parsed.started ? Date.now() : null);
          setUtm(mergeUtmAttribution(parsed.utm, currentUtm));
          setStep(Math.min(Math.max(questionStep >= 0 ? questionStep : parsed.step ?? 0, 0), maximumStep));
          setAnswers(restored);
          sessionStorage.removeItem(PREVIOUS_STORAGE_KEY);
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
      sessionStorage.removeItem(PREVIOUS_STORAGE_KEY);
      sessionStorage.removeItem(LEGACY_STORAGE_KEY);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated || status === "success") return;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ version: 3, started, step, questionId: question.id, answers, startedAt, utm }));
  }, [answers, hydrated, question.id, started, startedAt, status, step, utm]);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const clearError = () => setError(null);

  const showValidationIssue = (issue: ValidationIssue) => {
    setError(issue);
    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(`[data-field="${issue.field}"]`);
      const focusTarget = target?.matches("input, textarea, button, [tabindex]")
        ? target
        : target?.querySelector<HTMLElement>("input, textarea, button, [tabindex]");
      focusTarget?.focus();
      if (typeof target?.scrollIntoView === "function") target.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  };

  const updateField = <K extends keyof DiagnosisAnswers>(key: K, value: DiagnosisAnswers[K]) => {
    setAnswers((current) => ({ ...current, [key]: value }));
    clearError();
  };

  const updateResponse = (questionId: string, value: AnswerValue) => {
    setAnswers((current) => {
      const responses = { ...current.responses, [questionId]: value };
      for (const dependentQuestion of getFlow(current.sectorId)) {
        if (!dependentQuestion.optionVisibility?.some((rule) => rule.dependsOn === questionId)) continue;
        const visibleIds = new Set(getVisibleQuestionOptions(dependentQuestion, responses).map((option) => option.id));
        const existing = responses[dependentQuestion.id];
        if (Array.isArray(existing)) responses[dependentQuestion.id] = existing.filter((id) => visibleIds.has(id));
        else if (existing && !visibleIds.has(existing)) responses[dependentQuestion.id] = "";
      }
      return { ...current, responses };
    });
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
      setStep((current) => Math.min(current + 1, flow.length - 1));
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 420);
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
      showValidationIssue(validationError);
      return;
    }
    if (step === flow.length - 1) return;
    setDirection("forward");
    setError(null);
    setStep((current) => current + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    if (step === 0) {
      setStarted(false);
      return;
    }
    setDirection("back");
    setError(null);
    setStep((current) => current - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (submissionInFlight.current) return;
    const validationError = validateQuestion(contactQuestion, answers, t.errors);
    if (validationError) {
      showValidationIssue(validationError);
      return;
    }

    submissionInFlight.current = true;
    setStatus("submitting");
    setError(null);

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
      setError({ message: t.errors.submit, field: "contact" });
    }
  };

  const beginDiagnosis = () => {
    setStartedAt((current) => current ?? Date.now());
    setStarted(true);
  };

  const restart = () => {
    sessionStorage.removeItem(STORAGE_KEY);
    sessionStorage.removeItem(PREVIOUS_STORAGE_KEY);
    submissionInFlight.current = false;
    setAnswers(EMPTY_ANSWERS);
    setStep(0);
    setStarted(false);
    setStartedAt(null);
    setUtm(readUtmAttribution(window.location.search));
    setStatus("editing");
    setError(null);
  };

  const targetLocale = locale === "en" ? "pt-PT" : "en";
  const languageParams = new URLSearchParams();
  if (campaignSectorId) languageParams.set("sector", campaignSectorId);
  const languageHref = `${localizePath("/diagnostico", targetLocale)}${languageParams.size ? `?${languageParams.toString()}` : ""}`;
  const homeHref = localizePath("/", locale);
  const selectedValue = question.id === sectorQuestion.id
    ? answers.sectorId
    : answers.responses[question.id] ?? (question.kind === "multi" ? [] : "");
  const requiresContinue = question.kind !== "single" || (question.id !== sectorQuestion.id && hasOtherSelected(selectedValue));
  const visibleOptions = question.id === sectorQuestion.id
    ? getSectorChoices(showAllSectors, campaignSectorId)
    : getVisibleQuestionOptions(question, answers.responses);
  const insight = getQuestionInsight(question, selectedValue, locale);

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
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{campaignIntro?.eyebrow ?? t.introEyebrow}</p>
            <h1 className="mt-5 max-w-3xl text-balance text-[clamp(2.3rem,7vw,4.35rem)] font-semibold leading-[0.98] tracking-[-0.055em] text-text">{campaignIntro?.title ?? t.introTitle}</h1>
            <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-muted sm:text-lg">{campaignIntro?.body ?? t.introBody}</p>
            <button type="button" onClick={beginDiagnosis} className="diagnosis-primary mt-7 min-w-56">{t.start}<span aria-hidden="true">→</span></button>
            <p className="mt-3 text-xs text-muted/80">{t.startHint}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm font-medium text-muted">
              <span className="inline-flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-pop ring-4 ring-pop/20" />{t.duration}</span>
              <span className="hidden h-1 w-1 rounded-full bg-border sm:block" />
              <span>{t.privateNote}</span>
            </div>
            <ul className="mt-5 grid w-full max-w-2xl gap-2 text-left text-sm font-semibold text-text sm:grid-cols-3">
              {t.introProof.map((proof) => <li key={proof} className="rounded-xl border border-border/80 bg-surface/70 px-3 py-3"><span className="mr-2 text-accent" aria-hidden="true">✓</span>{proof}</li>)}
            </ul>
          </section>
        ) : status === "success" ? (
          <SuccessScreen copy={t} homeHref={homeHref} answers={answers} locale={locale} onRestart={restart} />
        ) : status === "submitting" ? (
          <LoadingScreen copy={t} />
        ) : (
          <section className="pb-12 pt-3 sm:pt-8">
            <Progress step={step} flow={flow} sectorId={answers.sectorId} locale={locale} copy={t} />
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
                  choices={visibleOptions}
                  invalidField={error?.field ?? null}
                  onFieldChange={updateField}
                  onResponseChange={updateResponse}
                  onOtherChange={updateOther}
                  onSingleSelect={selectSingle}
                  onMultiSelect={toggleMultiple}
                  onEnter={next}
                />
                {question.id === sectorQuestion.id && sectors.length > prioritySectorIds.length ? (
                  <button type="button" className="mt-4 min-h-11 text-sm font-bold text-accent underline decoration-accent/30 underline-offset-4" onClick={() => setShowAllSectors((current) => !current)}>
                    {showAllSectors ? t.showPrioritySectors : t.showAllSectors}
                  </button>
                ) : null}
                <div aria-live="polite" className="mt-4 min-h-6">
                  {error ? <p id="diagnosis-error" role="alert" className="flex items-start gap-2 text-sm font-medium text-red-700"><span aria-hidden="true">•</span>{error.message}</p> : insight ? <p className="diagnosis-insight"><span aria-hidden="true">↳</span>{insight}</p> : <p className="text-sm font-medium text-accent/80">{t.encouragement[Math.min(step, t.encouragement.length - 1)]}</p>}
                </div>
                <div className="diagnosis-actions mt-5 flex items-center justify-between gap-3 border-t border-border/70 pt-5 sm:mt-7 sm:pt-6">
                  <button type="button" onClick={goBack} className="diagnosis-secondary"><span aria-hidden="true">←</span>{t.back}</button>
                  {requiresContinue ? <button type="submit" className="diagnosis-primary">{question.kind === "contact" && error?.field === "contact" ? t.retry : question.kind === "contact" ? t.submit : t.continue}<span aria-hidden="true">→</span></button> : null}
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

function Progress({ step, flow, sectorId, locale, copy: t }: { step: number; flow: QuestionDefinition[]; sectorId: string; locale: Locale; copy: (typeof uiCopy)[Locale] }) {
  const phases: DiagnosisPhase[] = ["business", "operation", "impact", "report"];
  const phase = flow[step]?.phase ?? "business";
  const phaseIndex = phases.indexOf(phase);
  const rawPercentage = Math.round(((step + 1) / 15) * 100);
  const percentage = phase === "report" ? Math.min(rawPercentage, 94) : rawPercentage;
  const sector = getSector(sectorId);

  return (
    <div className="diagnosis-progress" aria-label={`${t.phase} ${phaseIndex + 1} ${t.of} ${phases.length}: ${t.phases[phase]}`}>
      <div className="mb-3 flex items-end justify-between gap-4 text-xs font-semibold text-muted">
        <div><span className="text-text">{t.phase} {phaseIndex + 1} {t.of} {phases.length} · {t.phases[phase]}</span>{sector ? <span className="mt-1 block font-medium text-muted">{t.selectedSector} {localize(sector.label, locale)}</span> : null}</div>
        <span className="text-sm font-bold tabular-nums text-accent">{percentage}%</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-border/65" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage} aria-valuetext={`${percentage}%`}>
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
  choices,
  invalidField,
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
  choices: readonly OptionDefinition[];
  invalidField: string | null;
  onFieldChange: <K extends keyof DiagnosisAnswers>(key: K, value: DiagnosisAnswers[K]) => void;
  onResponseChange: (questionId: string, value: AnswerValue) => void;
  onOtherChange: (questionId: string, value: string) => void;
  onSingleSelect: (question: QuestionDefinition, value: string) => void;
  onMultiSelect: (question: QuestionDefinition, value: string) => void;
  onEnter: () => void;
}) {
  const t = uiCopy[locale];

  if (question.kind === "company") {
    return <TextField fieldId="companyName" label={localize(question.title, locale)} value={answers.companyName} placeholder={t.placeholders.company} autoComplete="organization" invalid={invalidField === "companyName"} describedBy={invalidField === "companyName" ? "diagnosis-error" : undefined} maxLength={100} onChange={(value) => onFieldChange("companyName", value)} onEnter={onEnter} />;
  }

  if (question.kind === "website") {
    return (
      <div>
        {!answers.noWebsite ? <TextField fieldId="website" label={localize(question.title, locale)} value={answers.website} placeholder={t.placeholders.website} type="url" inputMode="url" autoComplete="url" invalid={invalidField === "website"} describedBy={invalidField === "website" ? "diagnosis-error" : undefined} maxLength={200} onChange={(value) => onFieldChange("website", value)} onEnter={onEnter} /> : null}
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
          choices={choices}
          selected={selected}
          multiple={question.kind === "multi"}
          locale={locale}
          label={localize(question.title, locale)}
          groups={question.optionGroups}
          fieldId={question.id}
          invalid={invalidField === question.id}
          describedBy={invalidField === question.id ? "diagnosis-error" : undefined}
          onSelect={(value) => question.kind === "single" ? onSingleSelect(question, value) : onMultiSelect(question, value)}
        />
        {otherSelected ? (
          <div className="mt-4">
            <TextField
              label={t.otherPlaceholder}
              fieldId={`${question.id}-other`}
              value={answers.otherResponses[question.id] ?? ""}
              placeholder={t.otherPlaceholder}
              invalid={invalidField === `${question.id}-other`}
              describedBy={invalidField === `${question.id}-other` ? "diagnosis-error" : undefined}
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
      <label className="block" data-field={question.id}>
        <span className="sr-only">{localize(question.title, locale)}</span>
        <textarea
          value={value}
          aria-invalid={invalidField === question.id}
          aria-describedby={invalidField === question.id ? "diagnosis-error" : undefined}
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
    <div className="space-y-4" data-field="contact" tabIndex={-1}>
      <TextField fieldId="contactName" label={t.labels.name} value={answers.contactName} placeholder={t.placeholders.name} autoComplete="name" invalid={invalidField === "contactName"} describedBy={invalidField === "contactName" ? "diagnosis-error" : undefined} maxLength={100} onChange={(value) => onFieldChange("contactName", value)} />
      <TextField fieldId="email" label={t.labels.email} value={answers.email} placeholder={t.placeholders.email} type="email" inputMode="email" autoComplete="email" invalid={invalidField === "email"} describedBy={invalidField === "email" ? "diagnosis-error" : undefined} maxLength={160} onChange={(value) => onFieldChange("email", value)} />
      <TextField fieldId="phone" label={`${t.labels.phone} · ${t.optional}`} value={answers.phone} placeholder={t.placeholders.phone} type="tel" inputMode="tel" autoComplete="tel" maxLength={20} prefix="🇵🇹 +351" invalid={invalidField === "phone"} describedBy={invalidField === "phone" ? "diagnosis-error" : undefined} onChange={(value) => onFieldChange("phone", value)} />
      <label data-field="privacyConsent" className={`flex cursor-pointer items-start gap-3 rounded-2xl border bg-surface/70 p-4 text-sm leading-relaxed text-muted transition hover:border-accent/35 ${invalidField === "privacyConsent" ? "border-red-500" : "border-border"}`}>
        <input type="checkbox" checked={answers.privacyConsent} aria-invalid={invalidField === "privacyConsent"} aria-describedby={invalidField === "privacyConsent" ? "diagnosis-error" : undefined} onChange={(event) => onFieldChange("privacyConsent", event.target.checked)} className="mt-0.5 h-5 w-5 shrink-0 rounded border-border accent-[rgb(var(--color-accent))]" />
        <span>{t.consentPrefix} <Link href={localizePath("/privacidade", locale)} target="_blank" className="font-semibold text-text underline decoration-accent/40 underline-offset-4 hover:text-accent">{t.privacy}</Link>.</span>
      </label>
    </div>
  );
}

function validateQuestion(question: QuestionDefinition, answers: DiagnosisAnswers, errors: (typeof uiCopy)[Locale]["errors"]) {
  if (question.kind === "company" && answers.companyName.trim().length < 2) return { message: errors.company, field: "companyName" };
  if (question.kind === "website" && !answers.noWebsite && answers.website.trim() && !isValidWebsite(answers.website)) return { message: errors.website, field: "website" };
  if (question.kind === "contact") {
    if (answers.contactName.trim().length < 2) return { message: errors.name, field: "contactName" };
    if (!EMAIL_PATTERN.test(answers.email.trim())) return { message: errors.email, field: "email" };
    if (answers.phone.trim() && !PT_PHONE_PATTERN.test(answers.phone.replace(/\s+/g, ""))) return { message: errors.phone, field: "phone" };
    if (!answers.privacyConsent) return { message: errors.consent, field: "privacyConsent" };
    return null;
  }

  const value = question.id === sectorQuestion.id ? answers.sectorId : answers.responses[question.id];
  if (question.kind === "single" && (typeof value !== "string" || !value)) return { message: errors.required, field: question.id };
  if (question.kind === "multi" && (!Array.isArray(value) || value.length === 0)) return { message: errors.multi, field: question.id };
  if (question.kind === "multi" && question.optionGroups?.some((groupDefinition) => groupDefinition.required && !groupDefinition.optionIds.some((id) => Array.isArray(value) && value.includes(id)))) {
    return { message: errors.group, field: question.id };
  }
  if (question.kind === "text" && (typeof value !== "string" || !value.trim())) return { message: errors.text, field: question.id };
  if (question.id !== sectorQuestion.id && hasOtherSelected(value ?? "") && !answers.otherResponses[question.id]?.trim()) return { message: errors.other, field: `${question.id}-other` };
  return null;
}

function getSectorChoices(showAll: boolean, campaignSectorId: string | null) {
  const options = sectorQuestion.options ?? [];
  if (showAll) return options;
  const featured = new Set<string>(prioritySectorIds);
  if (campaignSectorId) featured.add(campaignSectorId);
  return options
    .filter((option) => featured.has(option.id))
    .sort((left, right) => {
      if (left.id === campaignSectorId) return -1;
      if (right.id === campaignSectorId) return 1;
      return prioritySectorIds.indexOf(left.id as (typeof prioritySectorIds)[number]) - prioritySectorIds.indexOf(right.id as (typeof prioritySectorIds)[number]);
    });
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

function SuccessScreen({ copy: t, homeHref, answers, locale, onRestart }: { copy: (typeof uiCopy)[Locale]; homeHref: string; answers: DiagnosisAnswers; locale: Locale; onRestart: () => void }) {
  const sector = getSector(answers.sectorId);
  const sectorLabel = sector ? localize(sector.label, locale) : answers.sectorId;
  const objective = resolveOptionLabel("mainObjective", answers.responses.mainObjective, answers.sectorId, locale);
  const hours = resolveOptionLabel("repetitiveHours", answers.responses.repetitiveHours, answers.sectorId, locale);
  const bottleneckQuestion = sector?.questions.find((item) => item.legacyRole === "challenge" || item.legacyRole === "task") ?? sector?.questions.at(-1);
  const bottleneck = bottleneckQuestion ? resolveOptionLabel(bottleneckQuestion.id, answers.responses[bottleneckQuestion.id], answers.sectorId, locale) : "";
  const caseHref = answers.sectorId === "real-estate" ? "/projetos/imobiliario" : answers.sectorId === "commerce" ? "/projetos/ecommerce" : null;
  const recapLabels = locale === "en" ? ["Industry", "Priority", "Manual time", "Leading bottleneck"] : ["Setor", "Prioridade", "Tempo manual", "Principal bloqueio"];

  return (
    <section className="diagnosis-enter flex min-h-[calc(100svh-120px)] flex-col items-center justify-center pb-20 text-center">
      <div className="diagnosis-success-mark mb-8" aria-hidden="true"><span>✓</span></div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">{t.successEyebrow} · 100%</p>
      <h1 className="mt-4 max-w-2xl text-balance text-4xl font-semibold leading-[1.02] tracking-[-0.05em] text-text sm:text-6xl">{t.successTitle}</h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{t.successBody}</p>
      <div className="mt-5 rounded-2xl border border-accent/20 bg-accent/[0.06] px-5 py-4 text-sm text-text">
        <span className="block text-xs font-bold uppercase tracking-[0.14em] text-accent">{t.successDestination}</span>
        <strong className="mt-1 block break-all text-base">{answers.email}</strong>
      </div>
      <div className="mt-6 w-full max-w-2xl rounded-3xl border border-border bg-surface/80 p-5 text-left sm:p-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-accent">{t.successRecap}</p>
        <dl className="mt-4 grid gap-4 sm:grid-cols-2">
          {[[recapLabels[0], sectorLabel], [recapLabels[1], objective], [recapLabels[2], hours], [recapLabels[3], bottleneck]].filter(([, value]) => value).map(([label, value]) => (
            <div key={label}><dt className="text-xs font-semibold text-muted">{label}</dt><dd className="mt-1 font-semibold text-text">{value}</dd></div>
          ))}
        </dl>
      </div>
      <p className="mt-5 max-w-xl text-sm font-medium text-text/75">{t.successEmail}</p>
      <p className="mt-2 max-w-xl text-sm text-muted">{t.successNext}</p>
      <div className="mt-8 flex w-full max-w-lg flex-col justify-center gap-3 sm:flex-row">
        {caseHref ? <Link href={localizePath(caseHref, locale)} className="diagnosis-primary justify-center">{locale === "en" ? "See a relevant case" : "Ver um caso relevante"}<span aria-hidden="true">→</span></Link> : <Link href={homeHref} className="diagnosis-primary justify-center">{t.visit}<span aria-hidden="true">→</span></Link>}
        <button type="button" onClick={onRestart} className="diagnosis-secondary justify-center">{t.restart}</button>
      </div>
    </section>
  );
}

function resolveOptionLabel(questionId: string, value: AnswerValue | undefined, sectorId: string, locale: Locale) {
  const question = getFlow(sectorId).find((item) => item.id === questionId);
  const selectedId = Array.isArray(value) ? value[0] : value;
  return question?.options?.find((option) => option.id === selectedId)?.label[locale] ?? selectedId ?? "";
}
