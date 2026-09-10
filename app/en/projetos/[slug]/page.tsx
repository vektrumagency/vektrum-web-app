import type { Metadata } from "next";
import { getSectorMetadata, SectorPageContent } from "@/app/projetos/[slug]/sector-content";

export const dynamic = "force-dynamic";

type SectorPageParams = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: SectorPageParams): Promise<Metadata> {
  const { slug } = await params;
  return getSectorMetadata("en", slug);
}

export default async function SectorPageEn({ params }: SectorPageParams) {
  const { slug } = await params;
  return <SectorPageContent locale="en" slug={slug} />;
}
