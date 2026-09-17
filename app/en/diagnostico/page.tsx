import type { Metadata } from "next";
import { DiagnosisPageContent, getDiagnosisMetadata } from "@/app/diagnostico/diagnosis-page-content";

type DiagnosisPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ searchParams }: DiagnosisPageProps): Promise<Metadata> {
  return getDiagnosisMetadata("en", searchParams);
}

export default async function DiagnosisPageEn({ searchParams }: DiagnosisPageProps) {
  return <DiagnosisPageContent locale="en" searchParams={searchParams} />;
}
