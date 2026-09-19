import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { buildAutomationDiagnosisPayload, type DiagnosisSnapshot } from "./diagnosis-api";
import { legacySectors, sectorQuestion, sectors, universalQuestions } from "./diagnosis-config";

const EXPECTED_SECTOR_QUESTION_IDS: Record<string, string[]> = {
  "accounting-consulting": ["accounting_document_intake", "accounting_time_consumers", "accounting_client_communication", "accounting_software", "accounting_priority_task"],
  "legal-admin": ["legal_case_intake", "legal_deadlines", "legal_documents", "legal_software", "legal_repetitive_task"],
  "real-estate": ["realestate_lead_sources", "realestate_followup", "realestate_listings", "realestate_software", "realestate_bottleneck"],
  "finance-insurance": ["finance_document_intake", "finance_renewals", "finance_communication", "finance_software", "finance_repetitive_task"],
  healthcare: ["healthcare_booking", "healthcare_confirmation", "healthcare_reminders", "healthcare_software", "healthcare_bottleneck"],
  construction: ["construction_quotes", "construction_team_communication", "construction_projects", "construction_software", "construction_bottleneck"],
  commerce: ["commerce_order_sources", "commerce_inventory", "commerce_customer_channels", "commerce_software", "commerce_repetitive_task"],
  logistics: ["logistics_request_sources", "logistics_routes", "logistics_driver_communication", "logistics_software", "logistics_bottleneck"],
  hospitality: ["hospitality_reservations", "hospitality_shifts", "hospitality_suppliers", "hospitality_software", "hospitality_repetitive_task"],
  education: ["education_enrolment", "education_communication", "education_payments", "education_software", "education_repetitive_task"],
  manufacturing: ["manufacturing_orders", "manufacturing_planning", "manufacturing_inventory", "manufacturing_software", "manufacturing_bottleneck"],
  "marketing-agency": ["agency_client_sources", "agency_approvals", "agency_projects", "agency_software", "agency_repetitive_task"],
  other: ["other_time_area", "other_work_intake", "other_customer_communication", "other_operational_software", "other_repetitive_task"]
};

const EXPECTED_UNIVERSAL = [
  ["employeeRange", "single"],
  ["dailySoftware", "multi"],
  ["repetitiveHours", "single"],
  ["mainObjective", "single"],
  ["automationMaturity", "single"],
  ["automationWish", "text"]
] as const;

const EXPECTED_SECTOR_KINDS: Record<string, string[]> = {
  "accounting-consulting": ["multi", "multi", "multi", "multi", "single"],
  "legal-admin": ["multi", "single", "single", "multi", "single"],
  "real-estate": ["multi", "single", "single", "multi", "single"],
  "finance-insurance": ["multi", "single", "multi", "multi", "single"],
  healthcare: ["multi", "single", "single", "multi", "single"],
  construction: ["single", "multi", "single", "multi", "single"],
  commerce: ["multi", "single", "multi", "multi", "single"],
  logistics: ["multi", "single", "multi", "multi", "single"],
  hospitality: ["multi", "single", "single", "multi", "single"],
  education: ["multi", "multi", "single", "multi", "single"],
  manufacturing: ["multi", "single", "single", "multi", "single"],
  "marketing-agency": ["multi", "single", "single", "multi", "single"],
  other: ["multi", "multi", "multi", "multi", "single"]
};

const LEGACY_OPTION_FINGERPRINT = "51cfaf3d8bf44de0383a0c6af4732437d710c3bdc0bffe0ea1a5ef2a6755aefb";

function makeAnswers(sectorId: string): DiagnosisSnapshot {
  const sector = sectors.find((item) => item.id === sectorId)!;
  const responses: DiagnosisSnapshot["responses"] = {};
  for (const question of [...sector.questions, ...universalQuestions]) {
    responses[question.id] = question.kind === "multi"
      ? [question.options?.find((option) => !option.exclusive)?.id ?? "sample"]
      : question.kind === "text"
        ? "A concrete workflow"
        : question.options?.[0]?.id ?? "sample";
  }
  return {
    companyName: "Example, Lda.", website: "example.pt", noWebsite: false, sectorId,
    responses, otherResponses: {}, contactName: "Ana Example", email: "ANA@example.pt",
    phoneCountry: "PT", phone: "", privacyConsent: true
  };
}

describe("automation diagnosis n8n contract", () => {
  it("keeps the frozen question IDs, response types, and array lengths", () => {
    expect(sectors).toHaveLength(13);
    for (const sector of sectors) {
      expect(sector.questions.map((question) => question.id)).toEqual(EXPECTED_SECTOR_QUESTION_IDS[sector.id]);
      expect(sector.questions.map((question) => question.kind)).toEqual(EXPECTED_SECTOR_KINDS[sector.id]);
      expect(sector.questions).toHaveLength(5);
    }
    expect(universalQuestions.map((question) => [question.id, question.kind])).toEqual(EXPECTED_UNIVERSAL);
  });

  it("keeps every legacy option ID in its original position", () => {
    const universalAdditions = new Set(["sector-software", "project-management", "booking", "billing", "not-sure"]);
    const optionQuestions = [...legacySectors.flatMap((sector) => sector.questions), ...universalQuestions, sectorQuestion].filter((question) => question.options);
    const legacySource = optionQuestions.map((question) => {
      const legacyIds = question.options!.filter((option) => !universalAdditions.has(option.id) || !["dailySoftware", "repetitiveHours"].includes(question.id)).map((option) => option.id);
      return `${question.id}:${legacyIds.join("|")}`;
    }).join("\n");
    expect(optionQuestions).toHaveLength(71);
    expect(createHash("sha256").update(legacySource).digest("hex")).toBe(LEGACY_OPTION_FINGERPRINT);

    const enhancedById = new Map(sectors.flatMap((sector) => sector.questions).map((question) => [question.id, question]));
    legacySectors.flatMap((sector) => sector.questions).forEach((legacyQuestion) => {
      const currentIds = new Set(enhancedById.get(legacyQuestion.id)?.options?.map((option) => option.id));
      legacyQuestion.options?.forEach((option) => expect(currentIds.has(option.id), `${legacyQuestion.id}:${option.id}`).toBe(true));
    });
  });

  it.each(Object.keys(EXPECTED_SECTOR_QUESTION_IDS))("builds an unchanged payload envelope for %s", (sectorId) => {
    const payload = buildAutomationDiagnosisPayload({
      answers: makeAnswers(sectorId), locale: "pt-PT", startedAt: Date.parse("2026-08-10T11:59:00.000Z"),
      utm: { source: "meta", medium: "paid", campaign: "diagnostic", content: null, term: null }
    }, {
      completedAt: new Date("2026-08-10T12:00:00.000Z"), userAgent: "test", timezone: "Europe/Lisbon", page: "https://vektrum.pt/diagnostico"
    });

    expect(Object.keys(payload)).toEqual(["company", "contact", "diagnosis", "metadata", "utm"]);
    expect(Object.keys(payload.company)).toEqual(["name", "website", "hasWebsite", "sector", "sectorLabel", "employees", "employeesLabel"]);
    expect(Object.keys(payload.contact)).toEqual(["name", "email", "phone"]);
    expect(payload.metadata.formVersion).toBe("automation-diagnosis-v1");
    expect(payload.diagnosis.answers.sectorSpecific).toHaveLength(5);
    expect(payload.diagnosis.answers.universal).toHaveLength(6);
    expect(payload.diagnosis.answers.sectorSpecific.map(({ questionId }) => questionId)).toEqual(EXPECTED_SECTOR_QUESTION_IDS[sectorId]);
    expect(payload.diagnosis.answers.universal.map(({ questionId }) => questionId)).toEqual(EXPECTED_UNIVERSAL.map(([id]) => id));
    for (const record of [...payload.diagnosis.answers.sectorSpecific, ...payload.diagnosis.answers.universal]) {
      expect(Object.keys(record)).toEqual(["questionId", "question", "responseType", "selected", "resolved", "labels", "otherText"]);
      expect(["single", "multi", "text"]).toContain(record.responseType);
    }
    expect(payload.company.website).toBe("https://example.pt");
    expect(payload.contact.email).toBe("ana@example.pt");
    expect(payload.contact.phone).toBeNull();
  });
});
