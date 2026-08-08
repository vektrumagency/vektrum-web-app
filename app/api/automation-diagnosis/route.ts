const MAX_PAYLOAD_BYTES = 256 * 1024;
const WEBHOOK_TIMEOUT_MS = 18_000;
const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(error: string, status: number) {
  return Response.json(
    { error },
    { status, headers: { "Cache-Control": "no-store" } }
  );
}

export async function POST(request: Request) {
  const webhookUrl = process.env.AUTOMATION_DIAGNOSIS_WEBHOOK_URL?.trim();
  if (!webhookUrl) {
    console.error("[automation-diagnosis] AUTOMATION_DIAGNOSIS_WEBHOOK_URL is not configured.");
    return jsonError("The diagnosis service is temporarily unavailable.", 503);
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().includes("application/json")) {
    return jsonError("Expected an application/json request.", 415);
  }

  const declaredLength = Number(request.headers.get("content-length") ?? 0);
  if (declaredLength > MAX_PAYLOAD_BYTES) {
    return jsonError("Diagnosis payload is too large.", 413);
  }

  let payload: unknown;
  try {
    const body = await request.text();
    if (!body.trim()) return jsonError("A diagnosis payload is required.", 400);
    if (new TextEncoder().encode(body).byteLength > MAX_PAYLOAD_BYTES) {
      return jsonError("Diagnosis payload is too large.", 413);
    }

    payload = JSON.parse(body);
    if (typeof payload !== "object" || payload === null || Array.isArray(payload)) {
      return jsonError("A diagnosis payload is required.", 400);
    }
  } catch {
    return jsonError("Invalid JSON payload.", 400);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

  try {
    if (IS_DEVELOPMENT) {
      console.debug(
        "[automation-diagnosis] forwarding request",
        JSON.stringify({ url: webhookUrl, method: "POST", payload }, null, 2)
      );
    }

    const webhookResponse = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload),
      cache: "no-store",
      signal: controller.signal
    });
    const responseText = await webhookResponse.text();

    if (IS_DEVELOPMENT) {
      console.debug("[automation-diagnosis] webhook response", {
        status: webhookResponse.status,
        body: responseText
      });
    }

    if (!webhookResponse.ok) {
      console.error("[automation-diagnosis] webhook rejected submission", {
        status: webhookResponse.status
      });
      return jsonError("The automation workflow did not accept the diagnosis.", 502);
    }

    return Response.json(
      { accepted: true },
      { status: 200, headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    if (IS_DEVELOPMENT) console.error("[automation-diagnosis] caught error", error);
    else console.error("[automation-diagnosis] webhook request failed.");
    return jsonError("The automation workflow is temporarily unavailable.", 502);
  } finally {
    clearTimeout(timeout);
  }
}
