import type { Metadata } from "next";
import { getHomeMetadata, HomePageContent } from "@/app/home-content";

export const dynamic = "force-dynamic";
export const metadata: Metadata = getHomeMetadata("en");

export default function HomePageEn() {
  return <HomePageContent locale="en" />;
}
