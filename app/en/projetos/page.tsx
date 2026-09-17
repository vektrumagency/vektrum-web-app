import type { Metadata } from "next";
import { getSectorsIndexMetadata, SectorsIndexPageContent } from "@/app/projetos/sectors-index-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = getSectorsIndexMetadata("en");

export default function SectorsIndexPageEn() {
  return <SectorsIndexPageContent locale="en" />;
}
