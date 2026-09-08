import { NextResponse } from "next/server";
import { getSupabaseAdminClient } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid request body." }, { status: 400 });
  }

  const email = typeof (body as { email?: unknown })?.email === "string"
    ? (body as { email: string }).email.trim().toLowerCase()
    : "";

  if (!EMAIL_PATTERN.test(email)) {
    return NextResponse.json({ ok: false, message: "Invalid email address." }, { status: 400 });
  }

  const { error } = await getSupabaseAdminClient()
    .from("newsletter_subscribers")
    // Re-subscribing after a previous unsubscribe flips the row back to
    // confirmed instead of failing on the unique email constraint.
    .upsert(
      { email, status: "confirmed", source: "site", subscribed_at: new Date().toISOString(), unsubscribed_at: null },
      { onConflict: "email" },
    );

  if (error) {
    console.error("[newsletter-subscribe] insert failed", { message: error.message });
    return NextResponse.json({ ok: false, message: "Could not subscribe right now." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
