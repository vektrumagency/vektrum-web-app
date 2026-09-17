import type { Metadata } from "next";
import { getPrivacyMetadata, PrivacyPageContent } from "@/app/privacidade/privacy-content";

export const metadata: Metadata = getPrivacyMetadata("pt-PT");

export default function PrivacyPage() {
  return <PrivacyPageContent locale="pt-PT" />;
}
