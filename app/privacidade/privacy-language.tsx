"use client";

import { useEffect } from "react";

export function PrivacyLanguage({ language }: { language: "pt-PT" | "en" | "es" }) {
  useEffect(() => {
    const previousLanguage = document.documentElement.lang;
    document.documentElement.lang = language;
    return () => {
      document.documentElement.lang = previousLanguage;
    };
  }, [language]);

  return null;
}
