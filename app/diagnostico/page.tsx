import type { Metadata } from "next";
import { DiagnosisClient } from "./diagnosis-client";
import { getSector, localize, type Locale } from "./diagnosis-config";

type DiagnosisPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getLocale(value: string | string[] | undefined) {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected === "en" ? "en" : "pt-PT";
}

function getCampaignSector(value: string | string[] | undefined) {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected && getSector(selected) ? selected : null;
}

export async function generateMetadata({ searchParams }: DiagnosisPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = getLocale(params.lang) as Locale;
  const campaignSector = getCampaignSector(params.sector);
  const sector = campaignSector ? getSector(campaignSector) : null;
  const sectorLabel = sector ? localize(sector.label, locale) : null;

  return locale === "en"
    ? {
        title: sectorLabel ? `${sectorLabel} Automation Diagnosis | Vektrum` : "AI Automation Diagnosis | Vektrum",
        description: sectorLabel ? `Assess manual workflows in ${sectorLabel.toLowerCase()} and receive a prioritized automation report.` : "Answer a few quick questions and receive a personalized AI Automation Report.",
        alternates: { canonical: "/diagnostico?lang=en" }
      }
    : {
        title: sectorLabel ? `Diagnóstico de Automação para ${sectorLabel} | Vektrum` : "Diagnóstico de Automação com IA | Vektrum",
        description: sectorLabel ? `Avalie os processos manuais em ${sectorLabel.toLowerCase()} e receba um relatório de automação priorizado.` : "Responda a algumas perguntas rápidas e receba um Relatório de Automação com IA personalizado.",
        alternates: { canonical: "/diagnostico" }
      };
}

export default async function DiagnosisPage({ searchParams }: DiagnosisPageProps) {
  const params = await searchParams;
  return <DiagnosisClient locale={getLocale(params.lang)} campaignSectorId={getCampaignSector(params.sector)} />;
}
