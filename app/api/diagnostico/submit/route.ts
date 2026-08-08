const N8N_AUTOMATION_DIAGNOSIS_WEBHOOK =
  "https://n8n.vektrum.agency/webhook/inbound/automation-diagnosis";
const MAX_PAYLOAD_BYTES = 256 * 1024;
const WEBHOOK_TIMEOUT_MS = 18_000;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return Response.json(
      { error: "Expected an application/json request." },
      { status: 415, headers: { "Cache-Control": "no-store" } }
    );
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_PAYLOAD_BYTES) {
    return Response.json(
      { error: "Diagnosis payload is too large." },
      { status: 413, headers: { "Cache-Control": "no-store" } }
    );
  }

  let body: string;
  try {
    body = await request.text();
    if (new TextEncoder().encode(body).byteLength > MAX_PAYLOAD_BYTES) {
      return Response.json(
        { error: "Diagnosis payload is too large." },
        { status: 413, headers: { "Cache-Control": "no-store" } }
      );
    }
    JSON.parse(body);
  } catch {
    return Response.json(
      { error: "Invalid JSON payload." },
      { status: 400, headers: { "Cache-Control": "no-store" } }
    );
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    const webhookResponse = await fetch(N8N_AUTOMATION_DIAGNOSIS_WEBHOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body,
      cache: "no-store",
      signal: controller.signal
    });

    if (webhookResponse.status !== 200) {
      return Response.json(
        { error: "The automation workflow did not accept the diagnosis." },
        { status: 502, headers: { "Cache-Control": "no-store" } }
      );
    }

    return Response.json(
      { accepted: true },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch {
    return Response.json(
      { error: "The automation workflow is temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } }
    );
  } finally {
    clearTimeout(timeout);
  }
}
