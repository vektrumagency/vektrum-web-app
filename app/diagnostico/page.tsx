import type { Metadata } from "next";
import { DiagnosisClient } from "./diagnosis-client";

type DiagnosisPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

function getLocale(value: string | string[] | undefined) {
  const selected = Array.isArray(value) ? value[0] : value;
  return selected === "en" ? "en" : "pt-PT";
}

export async function generateMetadata({ searchParams }: DiagnosisPageProps): Promise<Metadata> {
  const params = await searchParams;
  const locale = getLocale(params.lang);

  return locale === "en"
    ? {
        title: "AI Automation Diagnosis | Vektrum",
        description: "Answer a few quick questions and receive a personalized AI Automation Report.",
        alternates: { canonical: "/diagnostico?lang=en" }
      }
    : {
        title: "Diagnóstico de Automação com IA | Vektrum",
        description: "Responda a algumas perguntas rápidas e receba um Relatório de Automação com IA personalizado.",
        alternates: { canonical: "/diagnostico" }
      };
}

export default async function DiagnosisPage({ searchParams }: DiagnosisPageProps) {
  const params = await searchParams;
  return <DiagnosisClient locale={getLocale(params.lang)} />;
}
