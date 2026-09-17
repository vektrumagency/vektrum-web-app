"use client";

import { useState } from "react";
import type { Locale } from "@/lib/site-config";

const SUBSCRIBE_PATH = "/api/newsletter/subscribe";

const COPY: Record<Locale, {
  title: string;
  placeholder: string;
  submit: string;
  submitting: string;
  success: string;
  genericError: string;
  invalidEmail: string;
}> = {
  "pt-PT": {
    title: "Newsletter Semanal em IA",
    placeholder: "o-teu-email@exemplo.com",
    submit: "Subscrever",
    submitting: "...",
    success: "Feito, já estás na lista.",
    genericError: "Não foi possível agora. Tenta de novo.",
    invalidEmail: "Escreve um email válido.",
  },
  en: {
    title: "Semana em IA Newsletter",
    placeholder: "you@example.com",
    submit: "Subscribe",
    submitting: "...",
    success: "Done, you're on the list.",
    genericError: "Could not subscribe right now. Try again.",
    invalidEmail: "Enter a valid email address.",
  },
};

export function NewsletterFooterForm({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <p className="text-sm font-bold uppercase tracking-wide text-pop">{copy.title}</p>
      <form
        className="mt-3 flex max-w-xs gap-2"
        onSubmit={async (event) => {
          event.preventDefault();
          if (status === "submitting" || status === "success") return;
          setStatus("submitting");
          setMessage(null);

          try {
            const response = await fetch(SUBSCRIBE_PATH, {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({ email }),
            });
            const payload = (await response.json()) as { ok: boolean; message?: string };

            if (!response.ok || !payload.ok) {
              setStatus("error");
              setMessage(response.status === 400 ? copy.invalidEmail : copy.genericError);
              return;
            }

            setStatus("success");
            setMessage(copy.success);
          } catch {
            setStatus("error");
            setMessage(copy.genericError);
          }
        }}
      >
        <label className="sr-only" htmlFor="footer-newsletter-email">
          Email
        </label>
        <input
          id="footer-newsletter-email"
          type="email"
          required
          value={email}
          disabled={status === "submitting" || status === "success"}
          onChange={(event) => setEmail(event.target.value)}
          placeholder={copy.placeholder}
          className="w-full min-w-0 rounded-full border border-background/25 bg-background/10 px-4 py-2 text-sm text-background placeholder:text-background/50 outline-none transition focus:border-background/60 disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "submitting" || status === "success"}
          className="shrink-0 rounded-full bg-background px-4 py-2 text-xs font-bold uppercase tracking-wide text-ink transition hover:bg-pop disabled:opacity-60"
        >
          {status === "submitting" ? copy.submitting : copy.submit}
        </button>
      </form>
      {message && (
        <p role="status" className={`mt-2 text-xs ${status === "error" ? "text-red-300" : "text-background/70"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
