import type { Metadata } from "next";
import { getNovidadesMetadata, NovidadesPageContent } from "@/app/novidades/novidades-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = getNovidadesMetadata("en");

export default function NovidadesPageEn() {
  return <NovidadesPageContent locale="en" />;
}
