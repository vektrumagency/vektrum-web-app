import { describe, expect, it } from "vitest";
import { getFlow, getVisibleQuestionOptions, prioritySectorIds, sectors, universalQuestions } from "./diagnosis-config";

describe("diagnosis configuration", () => {
  it("keeps every option ID unique within its question", () => {
    for (const sector of sectors) {
      for (const question of sector.questions) {
        const ids = question.options?.map((option) => option.id) ?? [];
        expect(new Set(ids).size, question.id).toBe(ids.length);
      }
    }
    for (const question of universalQuestions) {
      const ids = question.options?.map((option) => option.id) ?? [];
      expect(new Set(ids).size, question.id).toBe(ids.length);
    }
  });

  it("references only options and dependencies that exist", () => {
    const allQuestions = new Map(sectors.flatMap((sector) => sector.questions).concat(universalQuestions).map((question) => [question.id, question]));
    for (const question of allQuestions.values()) {
      const optionIds = new Set(question.options?.map((option) => option.id));
      question.optionGroups?.forEach((group) => group.optionIds.forEach((id) => expect(optionIds.has(id), `${question.id}:${id}`).toBe(true)));
      question.optionVisibility?.forEach((rule) => {
        expect(allQuestions.has(rule.dependsOn), `${question.id}:${rule.dependsOn}`).toBe(true);
        rule.optionIds.forEach((id) => expect(optionIds.has(id), `${question.id}:${id}`).toBe(true));
      });
    }
  });

  it("recognizes every priority sector and preserves a 15-record flow", () => {
    prioritySectorIds.forEach((id) => expect(sectors.some((sector) => sector.id === id)).toBe(true));
    sectors.forEach((sector) => expect(getFlow(sector.id)).toHaveLength(15));
  });

  it("filters hospitality choices by the selected operation subtype", () => {
    const hospitality = sectors.find((sector) => sector.id === "hospitality")!;
    const software = hospitality.questions.find((question) => question.id === "hospitality_software")!;
    const accommodationIds = getVisibleQuestionOptions(software, { hospitality_reservations: ["accommodation"] }).map((option) => option.id);
    const restaurantIds = getVisibleQuestionOptions(software, { hospitality_reservations: ["restaurant"] }).map((option) => option.id);
    expect(accommodationIds).toContain("pms");
    expect(accommodationIds).not.toContain("delivery-management");
    expect(restaurantIds).toContain("delivery-management");
    expect(restaurantIds).not.toContain("pms");
  });
});
