import { get, put } from "@vercel/blob";
import { NextResponse } from "next/server";
import type { SavedDecision, SavedDecisionReviewStatus, SavedReviewOverlay } from "@/app/order2party/categories/types";

export const runtime = "nodejs";

const BLOB_PATH = "order2party/category-review-v1.json";
const REVIEW_ID = "order2party-category-review-v1";
const PROJECT = "Order2Party";
const PROPOSAL_VERSION = "v1";
const JSON_CONTENT_TYPE = "application/json";

// TODO: Protect this review page/API before sharing publicly with the client.

function getEmptyOverlay(updatedAt: string | null = null): SavedReviewOverlay {
  return {
    review_id: REVIEW_ID,
    project: PROJECT,
    proposal_version: PROPOSAL_VERSION,
    updated_at: updatedAt,
    decisions: {}
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isSavedDecisionStatus(value: unknown): value is SavedDecisionReviewStatus {
  return value === "approved" || value === "rejected" || value === "needs_changes";
}

function normalizeOverlay(value: unknown): SavedReviewOverlay {
  if (!isRecord(value) || !isRecord(value.decisions)) {
    return getEmptyOverlay();
  }

  const decisions: Record<string, SavedDecision> = {};

  for (const [actionId, decisionUnknown] of Object.entries(value.decisions)) {
    if (!isRecord(decisionUnknown)) continue;
    if (typeof decisionUnknown.action_id !== "string" || !decisionUnknown.action_id.trim()) continue;
    if (typeof decisionUnknown.node_id !== "string" || !decisionUnknown.node_id.trim()) continue;
    if (!isSavedDecisionStatus(decisionUnknown.review_status)) continue;
    if (typeof decisionUnknown.reviewed_at !== "string" || !decisionUnknown.reviewed_at.trim()) continue;

    decisions[actionId] = {
      action_id: decisionUnknown.action_id,
      node_id: decisionUnknown.node_id,
      review_status: decisionUnknown.review_status,
      review_comment: typeof decisionUnknown.review_comment === "string" ? decisionUnknown.review_comment : null,
      reviewed_by: typeof decisionUnknown.reviewed_by === "string" ? decisionUnknown.reviewed_by : null,
      reviewed_at: decisionUnknown.reviewed_at
    };
  }

  return {
    review_id: REVIEW_ID,
    project: PROJECT,
    proposal_version: PROPOSAL_VERSION,
    updated_at: typeof value.updated_at === "string" ? value.updated_at : null,
    decisions
  };
}

async function readOverlayFromBlob(): Promise<SavedReviewOverlay> {
  const result = await get(BLOB_PATH, {
    access: "private",
    useCache: false
  });

  if (!result || result.statusCode !== 200 || !result.stream) {
    return getEmptyOverlay();
  }

  try {
    const text = await new Response(result.stream).text();
    return normalizeOverlay(JSON.parse(text));
  } catch {
    return getEmptyOverlay();
  }
}

async function writeOverlayToBlob(overlay: SavedReviewOverlay) {
  await put(BLOB_PATH, JSON.stringify(overlay, null, 2), {
    access: "private",
    allowOverwrite: true,
    contentType: JSON_CONTENT_TYPE
  });
}

function validateDecisionPayload(body: unknown):
  | { ok: true; decision: Omit<SavedDecision, "reviewed_at"> }
  | { ok: false; message: string } {
  if (!isRecord(body)) {
    return { ok: false, message: "Invalid JSON body." };
  }

  if (typeof body.action_id !== "string" || !body.action_id.trim()) {
    return { ok: false, message: "action_id must be a non-empty string." };
  }

  if (typeof body.node_id !== "string" || !body.node_id.trim()) {
    return { ok: false, message: "node_id must be a non-empty string." };
  }

  if (!isSavedDecisionStatus(body.review_status)) {
    return { ok: false, message: "review_status must be approved, rejected, or needs_changes." };
  }

  return {
    ok: true,
    decision: {
      action_id: body.action_id.trim(),
      node_id: body.node_id.trim(),
      review_status: body.review_status,
      review_comment: typeof body.review_comment === "string" && body.review_comment.trim()
        ? body.review_comment
        : null,
      reviewed_by: typeof body.reviewed_by === "string" && body.reviewed_by.trim()
        ? body.reviewed_by.trim()
        : null
    }
  };
}

export async function GET() {
  try {
    return NextResponse.json(await readOverlayFromBlob());
  } catch (error) {
    console.error("[order2party-category-review] failed to read overlay", error);
    return NextResponse.json(
      { ok: false, message: "Could not read saved review overlay." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "Invalid JSON body." }, { status: 400 });
  }

  const validated = validateDecisionPayload(body);
  if (!validated.ok) {
    return NextResponse.json({ ok: false, message: validated.message }, { status: 400 });
  }

  try {
    const overlay = await readOverlayFromBlob();
    const reviewedAt = new Date().toISOString();
    const savedDecision: SavedDecision = {
      ...validated.decision,
      reviewed_at: reviewedAt
    };

    overlay.decisions[savedDecision.action_id] = savedDecision;
    overlay.updated_at = reviewedAt;

    await writeOverlayToBlob(overlay);

    return NextResponse.json({
      ok: true,
      decision: savedDecision,
      overlay,
      summary: {
        decisions: Object.keys(overlay.decisions).length,
        updated_at: overlay.updated_at
      }
    });
  } catch (error) {
    console.error("[order2party-category-review] failed to save decision", error);
    return NextResponse.json(
      { ok: false, message: "Could not save review decision." },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const actionId = url.searchParams.get("action_id")?.trim();

    if (actionId) {
      const overlay = await readOverlayFromBlob();
      delete overlay.decisions[actionId];
      overlay.updated_at = new Date().toISOString();
      await writeOverlayToBlob(overlay);

      return NextResponse.json({
        ok: true,
        removed_action_id: actionId,
        overlay,
        summary: {
          decisions: Object.keys(overlay.decisions).length,
          updated_at: overlay.updated_at
        }
      });
    }

    const overlay = getEmptyOverlay(new Date().toISOString());
    await writeOverlayToBlob(overlay);
    return NextResponse.json(overlay);
  } catch (error) {
    console.error("[order2party-category-review] failed to reset overlay", error);
    return NextResponse.json(
      { ok: false, message: "Could not clear saved review decisions." },
      { status: 500 }
    );
  }
}
