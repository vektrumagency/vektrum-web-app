import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const base = process.env.N8N_BOOKING_BASE;
  const secret = process.env.N8N_BOOKING_SECRET;

  if (!base || !secret) {
    return NextResponse.json({ status: "error", message: "Booking service not configured" }, { status: 500 });
  }

  const search = request.nextUrl.search;
  const upstream = await fetch(`${base}/disponibilidade${search}`, {
    method: "GET",
    headers: { "x-booking-secret": secret },
    cache: "no-store"
  });

  const body = await upstream.text();
  return new NextResponse(body, {
    status: upstream.status,
    headers: { "content-type": upstream.headers.get("content-type") ?? "application/json" }
  });
}
