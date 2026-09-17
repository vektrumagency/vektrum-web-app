import type { Metadata } from "next";
import { getNovidadesMetadata, NovidadesPageContent } from "@/app/novidades/novidades-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = getNovidadesMetadata("pt-PT");

export default function NovidadesPage() {
  return <NovidadesPageContent locale="pt-PT" />;
}
