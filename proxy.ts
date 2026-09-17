import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_HOST = "admin.vektrum.agency";

export function proxy(request: NextRequest) {
  const { pathname, hostname, searchParams } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
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

  // Legacy `?lang=en` / `?lang=pt-PT` links (old bookmarks, indexed URLs, ad
  // campaigns) permanently redirect to the path-based locale routes so link
  // equity carries over. Every other query param (e.g. ?sector=... on the
  // diagnosis campaign links) is preserved.
  if (searchParams.has("lang")) {
    const isEn = searchParams.get("lang") === "en";
    const url = request.nextUrl.clone();
    url.searchParams.delete("lang");
    if (isEn && !pathname.startsWith("/en")) {
      url.pathname = pathname === "/" ? "/en" : `/en${pathname}`;
    }
    return NextResponse.redirect(url, 308);
  }

  const locale = pathname === "/en" || pathname.startsWith("/en/") ? "en" : "pt-PT";
  const headers = new Headers(request.headers);
  headers.set("x-locale", locale);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"]
};
