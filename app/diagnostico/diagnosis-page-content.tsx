import type { Metadata } from "next";
import { buildLanguageAlternates } from "@/lib/site-links";
import { DiagnosisClient } from "./diagnosis-client";
import { getSector, localize, type Locale } from "./diagnosis-config";

type DiagnosisSearchParams = Promise<Record<string, string | string[] | undefined>>;

function getCampaignSector(value: string | string[] | undefined) {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected && getSector(selected) ? selected : null;
}

export async function getDiagnosisMetadata(locale: Locale, searchParams: DiagnosisSearchParams): Promise<Metadata> {
  const params = await searchParams;
  const campaignSector = getCampaignSector(params.sector);
  const sector = campaignSector ? getSector(campaignSector) : null;
  const sectorLabel = sector ? localize(sector.label, locale) : null;

  return locale === "en"
    ? {
        title: sectorLabel ? `${sectorLabel} Automation Diagnosis | Vektrum` : "AI Automation Diagnosis | Vektrum",
        description: sectorLabel ? `Assess manual workflows in ${sectorLabel.toLowerCase()} and receive a prioritized automation report.` : "Answer a few quick questions and receive a personalized AI Automation Report.",
        alternates: { canonical: "/en/diagnostico", languages: buildLanguageAlternates("/diagnostico") }
      }
    : {
        title: sectorLabel ? `Diagnóstico de Automação para ${sectorLabel} | Vektrum` : "Diagnóstico de Automação com IA | Vektrum",
        description: sectorLabel ? `Avalie os processos manuais em ${sectorLabel.toLowerCase()} e receba um relatório de automação priorizado.` : "Responda a algumas perguntas rápidas e receba um Relatório de Automação com IA personalizado.",
        alternates: { canonical: "/diagnostico", languages: buildLanguageAlternates("/diagnostico") }
      };
}

export async function DiagnosisPageContent({ locale, searchParams }: { locale: Locale; searchParams: DiagnosisSearchParams }) {
  const params = await searchParams;
  return <DiagnosisClient locale={locale} campaignSectorId={getCampaignSector(params.sector)} />;
}
