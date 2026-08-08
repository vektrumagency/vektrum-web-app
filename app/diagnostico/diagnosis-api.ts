import {
  getSector,
  localize,
  type Locale,
  type QuestionDefinition,
  universalQuestions
} from "./diagnosis-config";

export const AUTOMATION_DIAGNOSIS_SUBMIT_PATH = "/api/diagnostico/submit";

export type DiagnosisAnswerValue = string | string[];

export type DiagnosisSnapshot = {
  companyName: string;
  website: string;
  noWebsite: boolean;
  sectorId: string;
  responses: Record<string, DiagnosisAnswerValue>;
  otherResponses: Record<string, string>;
  contactName: string;
  email: string;
  phone: string;
  privacyConsent: boolean;
};

export type UtmAttribution = {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  content: string | null;
  term: string | null;
};

export type DiagnosisAnswerRecord = {
  questionId: string;
  question: string;
  responseType: QuestionDefinition["kind"];
  selected: DiagnosisAnswerValue;
  resolved: DiagnosisAnswerValue;
  labels: DiagnosisAnswerValue;
  otherText: string | null;
};

export type AutomationDiagnosisPayload = {
  company: {
    name: string;
    website: string | null;
    hasWebsite: boolean | null;
    sector: string;
    sectorLabel: string;
    employees: string;
    employeesLabel: string;
  };
  contact: {
    name: string;
    email: string;
    phone: string | null;
  };
  diagnosis: {
    privacyConsent: boolean;
    answers: {
      sectorSpecific: DiagnosisAnswerRecord[];
      universal: DiagnosisAnswerRecord[];
    };
  };
  metadata: {
    formVersion: "automation-diagnosis-v1";
    completedAt: string;
    durationSeconds: number;
    userAgent: string;
    language: Locale;
    timezone: string;
    page: string;
  };
  utm: UtmAttribution;
};

export type DiagnosisSubmissionInput = {
  answers: DiagnosisSnapshot;
  locale: Locale;
  startedAt: number;
  utm: UtmAttribution;
};

type PayloadRuntime = {
  completedAt: Date;
  userAgent: string;
  timezone: string;
  page: string;
};

export class DiagnosisSubmissionError extends Error {
  readonly status: number | null;

  constructor(message: string, status: number | null = null) {
    super(message);
    this.name = "DiagnosisSubmissionError";
    this.status = status;
  }
}

export function readUtmAttribution(search: string): UtmAttribution {
  const params = new URLSearchParams(search);
  const read = (key: string) => params.get(key)?.trim() || null;
  return {
    source: read("utm_source"),
    medium: read("utm_medium"),
    campaign: read("utm_campaign"),
    content: read("utm_content"),
    term: read("utm_term")
  };
}

export function buildAutomationDiagnosisPayload(
  input: DiagnosisSubmissionInput,
  runtime: PayloadRuntime
): AutomationDiagnosisPayload {
  const { answers, locale, startedAt, utm } = input;
  const sector = getSector(answers.sectorId);
  const employeeQuestion = universalQuestions.find((question) => question.id === "employeeRange");
  const employeeValue = getStringResponse(answers, "employeeRange");
  const employeeLabel = employeeQuestion
    ? getOptionLabel(employeeQuestion, employeeValue, locale)
    : employeeValue;
  const completedAtMs = runtime.completedAt.getTime();

  return {
    company: {
      name: answers.companyName.trim(),
      website: answers.noWebsite ? null : normalizeWebsite(answers.website),
      hasWebsite: answers.noWebsite ? false : answers.website.trim() ? true : null,
      sector: answers.sectorId,
      sectorLabel: sector ? localize(sector.label, locale) : answers.sectorId,
      employees: employeeValue,
      employeesLabel: employeeLabel
    },
    contact: {
      name: answers.contactName.trim(),
      email: answers.email.trim().toLowerCase(),
      phone: answers.phone.trim() || null
    },
    diagnosis: {
      privacyConsent: answers.privacyConsent,
      answers: {
        sectorSpecific: (sector?.questions ?? []).map((question) =>
          buildAnswerRecord(question, answers, locale)
        ),
        universal: universalQuestions.map((question) =>
          buildAnswerRecord(question, answers, locale)
        )
      }
    },
    metadata: {
      formVersion: "automation-diagnosis-v1",
      completedAt: runtime.completedAt.toISOString(),
      durationSeconds: Math.max(0, Math.round((completedAtMs - startedAt) / 1000)),
      userAgent: runtime.userAgent,
      language: locale,
      timezone: runtime.timezone,
      page: runtime.page
    },
    utm
  };
}

export async function submitAutomationDiagnosis(
  input: DiagnosisSubmissionInput
): Promise<AutomationDiagnosisPayload> {
  const completedAt = new Date();
  const payload = buildAutomationDiagnosisPayload(input, {
    completedAt,
    userAgent: navigator.userAgent,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    page: window.location.href
  });
  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 20000);

  try {
    const response = await fetch(AUTOMATION_DIAGNOSIS_SUBMIT_PATH, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal
    });

    if (response.status !== 200) {
      throw new DiagnosisSubmissionError(
        `The diagnosis submission returned HTTP ${response.status}.`,
        response.status
      );
    }

    return payload;
  } catch (error) {
    if (error instanceof DiagnosisSubmissionError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new DiagnosisSubmissionError("The diagnosis submission timed out.");
    }
    throw new DiagnosisSubmissionError("The diagnosis submission request failed.");
  } finally {
    window.clearTimeout(timeout);
  }
}

function buildAnswerRecord(
  question: QuestionDefinition,
  answers: DiagnosisSnapshot,
  locale: Locale
): DiagnosisAnswerRecord {
  const selected = answers.responses[question.id] ?? (question.kind === "multi" ? [] : "");
  const otherText = answers.otherResponses[question.id]?.trim() || null;

  if (question.kind === "text") {
    const value = typeof selected === "string" ? selected.trim() : "";
    return {
      questionId: question.id,
      question: localize(question.title, locale),
      responseType: question.kind,
      selected: value,
      resolved: value,
      labels: value,
      otherText: null
    };
  }

  const selectedValues = Array.isArray(selected) ? selected : [selected];
  const resolvedValues = selectedValues.map((value) => value === "other" ? otherText ?? "" : value);
  const labels = selectedValues.map((value) => {
    if (value === "other") return otherText ?? "";
    return getOptionLabel(question, value, locale);
  });

  return {
    questionId: question.id,
    question: localize(question.title, locale),
    responseType: question.kind,
    selected,
    resolved: Array.isArray(selected) ? resolvedValues : resolvedValues[0] ?? "",
    labels: Array.isArray(selected) ? labels : labels[0] ?? "",
    otherText
  };
}

function getOptionLabel(question: QuestionDefinition, optionId: string, locale: Locale) {
  const option = question.options?.find((item) => item.id === optionId);
  return option ? localize(option.label, locale) : optionId;
}

function getStringResponse(answers: DiagnosisSnapshot, questionId: string) {
  const value = answers.responses[questionId];
  return typeof value === "string" ? value : "";
}

function normalizeWebsite(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}
