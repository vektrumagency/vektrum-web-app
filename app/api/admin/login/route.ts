import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { password } = (await req.json()) as { password?: string };
  const expected = process.env.ADMIN_PANEL_PASSWORD ?? "change-this-password";

  if (!password || password !== expected) {
    return NextResponse.json({ ok: false, message: "Invalid credentials" }, { status: 401 });
  }

  (await cookies()).set("vektrum_admin_auth", "1", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8
  });

  return NextResponse.json({ ok: true });
}
