import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getSupabaseAdminClient } from "@/lib/supabase/server";
import { PrivacyLanguage } from "../../privacidade/privacy-language";

export const metadata: Metadata = { title: "Cancelar subscrição | Vektrum" };

type UnsubscribePageProps = { searchParams: Promise<Record<string, string | string[] | undefined>> };

async function unsubscribe(token: string): Promise<"unsubscribed" | "not_found" | "error"> {
  const client = getSupabaseAdminClient();

  const { data, error } = await client
    .from("newsletter_subscribers")
    .update({ status: "unsubscribed", unsubscribed_at: new Date().toISOString() })
    .eq("unsubscribe_token", token)
    .eq("status", "confirmed")
    .select("id")
    .maybeSingle();

  if (error) return "error";
  if (data) return "unsubscribed";

  // Either an unknown token, or a token that's already unsubscribed —
  // both should read as "you're not on the list" rather than an error.
  const { data: existing } = await client
    .from("newsletter_subscribers")
    .select("id")
    .eq("unsubscribe_token", token)
    .maybeSingle();

  return existing ? "unsubscribed" : "not_found";
}

export default async function UnsubscribePage({ searchParams }: UnsubscribePageProps) {
  const params = await searchParams;
  const token = Array.isArray(params.token) ? params.token[0] : params.token;
  const result = token ? await unsubscribe(token) : "not_found";

  const message =
    result === "unsubscribed"
      ? "Foste removido da lista da newsletter. Não vais receber mais emails."
      : result === "error"
        ? "Não foi possível processar o pedido agora. Tenta novamente mais tarde ou escreve-nos."
        : "Não encontrámos essa subscrição. O link pode já ter sido usado.";

  return (
    <div className="min-h-screen bg-background">
      <PrivacyLanguage language="pt-PT" />
      <header className="mx-auto flex w-[calc(100%-32px)] max-w-4xl items-center justify-between py-6 sm:w-[calc(100%-64px)] sm:py-8">
        <Link href="/" aria-label="Vektrum">
          <Image src="/vektrum-logo-transparent.png" alt="Vektrum" width={168} height={48} priority className="h-9 w-auto" />
        </Link>
      </header>
      <main className="mx-auto w-[calc(100%-32px)] max-w-3xl pb-24 pt-12 sm:w-[calc(100%-64px)] sm:pt-20">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">Semana em IA</p>
        <h1 className="mt-4 text-4xl font-semibold tracking-[-0.045em] text-text sm:text-6xl">
          Subscrição da newsletter
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">{message}</p>
        <div className="mt-8">
          <Link href="/" className="text-sm font-medium text-accent hover:text-pop">
            ← Voltar ao site
          </Link>
        </div>
      </main>
    </div>
  );
}
