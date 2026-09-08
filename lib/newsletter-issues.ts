import "server-only";

import { getSupabaseAdminClient } from "@/lib/supabase/server";

export type NewsletterIssueSummary = {
  id: string;
  week_of: string;
  subject: string;
  body_text: string;
  sent_at: string;
};

export type NewsletterIssueDetail = NewsletterIssueSummary & { body_html: string };

// newsletter_issues has no anon/authenticated grants (see
// vektrum-crm/supabase/migrations/20260903120000_newsletter.sql) — same
// admin-client-only access as newsletter_subscribers. Every query here
// filters status = "sent" explicitly so a draft or approved-but-unsent
// edition is never reachable publicly, even by guessing an id.

export async function listSentIssues(): Promise<NewsletterIssueSummary[]> {
  const { data, error } = await getSupabaseAdminClient()
    .from("newsletter_issues")
    .select("id, week_of, subject, body_text, sent_at")
    .eq("status", "sent")
    .order("sent_at", { ascending: false });

  if (error) {
    console.error("[newsletter-issues] listSentIssues failed", { message: error.message });
    return [];
  }

  return data as NewsletterIssueSummary[];
}

export async function getSentIssue(id: string): Promise<NewsletterIssueDetail | null> {
  const { data, error } = await getSupabaseAdminClient()
    .from("newsletter_issues")
    .select("id, week_of, subject, body_text, body_html, sent_at")
    .eq("status", "sent")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("[newsletter-issues] getSentIssue failed", { message: error.message });
    return null;
  }

  return data as NewsletterIssueDetail | null;
}
