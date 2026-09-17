import type { Metadata } from "next";
import { getPrivacyMetadata, PrivacyPageContent } from "@/app/privacidade/privacy-content";

export const metadata: Metadata = getPrivacyMetadata("en");

export default function PrivacyPageEn() {
  return <PrivacyPageContent locale="en" />;
}
