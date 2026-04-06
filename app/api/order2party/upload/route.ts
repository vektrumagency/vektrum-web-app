import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 60;

const EXCEL_EXTENSIONS = [".xlsx", ".xls"];
const EXCEL_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel"
]);

function isExcelFilename(filename: string) {
  const lower = filename.toLowerCase();
  return EXCEL_EXTENSIONS.some((ext) => lower.endsWith(ext));
}

function safeNumber(input: string | undefined, fallback: number) {
  const parsed = Number(input);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function extractMessage(payload: unknown, fallback: string) {
  if (typeof payload === "string" && payload.trim()) {
    return payload;
  }

  if (payload && typeof payload === "object" && "message" in payload) {
    const msg = (payload as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) {
      return msg;
    }
  }

  return fallback;
}

function formatTargetForLog(url: string) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return "invalid-url";
  }
}

export async function POST(request: Request) {
  const orchestratorUrl = process.env.ORDER2PARTY_ORCHESTRATOR_URL;
  const orchestratorSecret = process.env.ORDER2PARTY_ORCHESTRATOR_SECRET;
  const expectedPin = process.env.ORDER2PARTY_PORTAL_PIN;
  const maxFileMb = safeNumber(process.env.ORDER2PARTY_MAX_FILE_MB, 4);
  const timeoutMs = safeNumber(process.env.ORDER2PARTY_ORCHESTRATOR_TIMEOUT_MS, 25000);
  const maxFileBytes = maxFileMb * 1024 * 1024;
  const requestId = crypto.randomUUID();
  const orchestratorHeaderName = "x-order2party-secret";

  if (!orchestratorUrl || !orchestratorSecret || !expectedPin) {
    console.error("[order2party-upload] missing configuration", {
      requestId,
      orchestratorUrlSet: Boolean(orchestratorUrl),
      orchestratorSecretSet: Boolean(orchestratorSecret),
      portalPinSet: Boolean(expectedPin)
    });

    return NextResponse.json(
      { ok: false, message: "Upload portal is not configured.", requestId },
      { status: 500 }
    );
  }

  let formData: FormData;

  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { ok: false, message: "Invalid form data.", requestId },
      { status: 400 }
    );
  }

  const pin = formData.get("pin");
  const supplier = formData.get("supplier");
  const file = formData.get("file");

  if (typeof pin !== "string" || pin.trim() !== expectedPin) {
    return NextResponse.json(
      { ok: false, message: "Invalid access PIN.", requestId },
      { status: 401 }
    );
  }

  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, message: "Missing upload file.", requestId },
      { status: 400 }
    );
  }

  if (!isExcelFilename(file.name)) {
    return NextResponse.json(
      { ok: false, message: "Only .xlsx or .xls files are allowed.", requestId },
      { status: 400 }
    );
  }

  if (file.type && !EXCEL_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { ok: false, message: "Invalid file type.", requestId },
      { status: 400 }
    );
  }

  if (file.size > maxFileBytes) {
    return NextResponse.json(
      {
        ok: false,
        message: `File is too large. Max allowed size is ${maxFileMb} MB.`,
        requestId
      },
      { status: 413 }
    );
  }

  const upstreamBody = new FormData();
  upstreamBody.set("file", file, file.name);
  upstreamBody.set("source", "order2party");

  if (typeof supplier === "string" && supplier.trim()) {
    upstreamBody.set("supplier", supplier.trim());
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    console.info("[order2party-upload] forwarding to orchestrator", {
      requestId,
      target: formatTargetForLog(orchestratorUrl),
      headerName: orchestratorHeaderName,
      headerAttached: Boolean(orchestratorSecret)
    });

    const upstreamResponse = await fetch(orchestratorUrl, {
      method: "POST",
      headers: {
        [orchestratorHeaderName]: orchestratorSecret,
        "x-request-id": requestId
      },
      body: upstreamBody,
      signal: controller.signal,
      cache: "no-store"
    });

    console.info("[order2party-upload] orchestrator response", {
      requestId,
      status: upstreamResponse.status
    });

    const contentType = upstreamResponse.headers.get("content-type") ?? "";
    const isJson = contentType.toLowerCase().includes("application/json");
    const upstreamPayload = isJson ? await upstreamResponse.json() : await upstreamResponse.text();

    if (!upstreamResponse.ok) {
      const message = extractMessage(upstreamPayload, "Orchestrator returned an error.");
      const status = upstreamResponse.status >= 500 ? 502 : upstreamResponse.status;

      return NextResponse.json(
        { ok: false, message, requestId },
        { status }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "File uploaded successfully.",
      requestId
    });
  } catch (error) {
    const isAbort = error instanceof Error && error.name === "AbortError";
    const message = isAbort
      ? "Orchestrator timeout. Please try again."
      : "Could not reach orchestrator. Please try again.";

    console.error("[order2party-upload] orchestrator request failed", {
      requestId,
      timedOut: isAbort
    });

    return NextResponse.json(
      { ok: false, message, requestId },
      { status: isAbort ? 504 : 502 }
    );
  } finally {
    clearTimeout(timeout);
  }
}
