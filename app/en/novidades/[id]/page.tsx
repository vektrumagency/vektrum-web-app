import type { Metadata } from "next";
import { getNovidadeMetadata, NovidadePageContent } from "@/app/novidades/[id]/novidade-content";

export const dynamic = "force-dynamic";

type NovidadePageParams = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: NovidadePageParams): Promise<Metadata> {
  const { id } = await params;
  return getNovidadeMetadata("en", id);
}

export default async function NovidadePageEn({ params }: NovidadePageParams) {
  const { id } = await params;
  return <NovidadePageContent locale="en" id={id} />;
}
