import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_HOST = "admin.vecktrum-agency.com";

export function proxy(request: NextRequest) {
  const { pathname, hostname } = request.nextUrl;

  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (hostname !== ADMIN_HOST && hostname !== "localhost") {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.hostname = ADMIN_HOST;
    return NextResponse.redirect(url);
  }

  const isLogin = pathname === "/admin/login";
  const hasAuth = request.cookies.get("vektrum_admin_auth")?.value === "1";

  if (!isLogin && !hasAuth) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    return NextResponse.redirect(loginUrl);
  }

  if (isLogin && hasAuth) {
    const adminUrl = request.nextUrl.clone();
    adminUrl.pathname = "/admin";
    return NextResponse.redirect(adminUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"]
};
