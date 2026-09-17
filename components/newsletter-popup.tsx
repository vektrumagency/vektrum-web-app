"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/site-config";

const SUBSCRIBE_PATH = "/api/newsletter/subscribe";
const COOKIE_NAME = "vektrum_newsletter_popup";
const SHOW_DELAY_MS = 2500;
// Dismissed without subscribing: ask again on a later visit. Subscribed:
// don't nag someone who already gave their email.
const DISMISS_DAYS = 30;
const SUBSCRIBED_DAYS = 365;

const COPY: Record<Locale, {
  title: string;
  body: string;
  placeholder: string;
  submit: string;
  submitting: string;
  success: string;
  genericError: string;
  invalidEmail: string;
  close: string;
}> = {
  "pt-PT": {
    title: "Newsletter Semanal em IA",
    body: "Uma história de IA por semana, explicada do zero, mais um resumo do resto que aconteceu.",
    placeholder: "o-teu-email@exemplo.com",
    submit: "Subscrever",
    submitting: "A subscrever...",
    success: "Feito. Já estás na lista.",
    genericError: "Não foi possível agora. Tenta de novo.",
    invalidEmail: "Escreve um email válido.",
    close: "Fechar",
  },
  en: {
    title: "Weekly AI Newsletter",
    body: "One AI story a week, explained from zero background, plus a roundup of everything else that happened.",
    placeholder: "you@example.com",
    submit: "Subscribe",
    submitting: "Subscribing...",
    success: "Done. You're on the list.",
    genericError: "Could not subscribe right now. Try again.",
    invalidEmail: "Enter a valid email address.",
    close: "Close",
  },
};

function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; samesite=lax`;
}

export function NewsletterPopup({ locale }: { locale: Locale }) {
  const copy = COPY[locale];
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (getCookie(COOKIE_NAME)) return;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status !== "success") return;
    const timer = setTimeout(() => setOpen(false), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  // Closing after a successful subscribe must not downgrade the
  // already-set "subscribed" cookie (365 days) to "dismissed" (30 days).
  const dismiss = () => {
    if (status !== "success") setCookie(COOKIE_NAME, "dismissed", DISMISS_DAYS);
    setOpen(false);
  };

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={copy.title}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-ink/60 px-4 backdrop-blur-sm"
      onClick={(event) => {
        if (event.target === event.currentTarget) dismiss();
      }}
    >
      <div className="relative w-full max-w-sm rounded-2xl bg-background p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={dismiss}
          aria-label={copy.close}
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:bg-surface hover:text-text"
        >
          ✕
        </button>
        <p className="pr-8 text-xs font-bold uppercase tracking-[0.2em] text-accent">Semana em IA</p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight text-text">{copy.title}</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">{copy.body}</p>

        <form
          className="mt-5 flex flex-col gap-3"
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
              setCookie(COOKIE_NAME, "subscribed", SUBSCRIBED_DAYS);
            } catch {
              setStatus("error");
              setMessage(copy.genericError);
            }
          }}
        >
          <label className="sr-only" htmlFor="popup-newsletter-email">
            Email
          </label>
          <input
            id="popup-newsletter-email"
            type="email"
            required
            value={email}
            disabled={status === "submitting" || status === "success"}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={copy.placeholder}
            className="w-full rounded-full border border-border bg-surface px-5 py-3 text-sm text-text outline-none transition focus:border-accent disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === "submitting" || status === "success"}
            className="w-full rounded-full bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-background transition hover:-translate-y-0.5 hover:bg-pop disabled:translate-y-0 disabled:opacity-60"
          >
            {status === "submitting" ? copy.submitting : copy.submit}
          </button>
        </form>
        {message && (
          <p role="status" className={`mt-3 text-sm ${status === "error" ? "text-red-600" : "text-muted"}`}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
