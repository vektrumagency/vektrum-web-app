import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getRuntimeConfig, setRuntimeConfig } from "@/lib/runtime-config";
import { SiteConfig } from "@/lib/site-config";

async function isAuthorized() {
  return (await cookies()).get("vektrum_admin_auth")?.value === "1";
}

export async function GET() {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, config: getRuntimeConfig() });
}

export async function PUT(req: Request) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const body = (await req.json()) as { config?: SiteConfig };
  if (!body.config) {
    return NextResponse.json({ ok: false, message: "Missing config" }, { status: 400 });
  }

  setRuntimeConfig(body.config);
  return NextResponse.json({ ok: true });
}
