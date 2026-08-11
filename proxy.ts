import { NextResponse, type NextRequest } from "next/server";

// Cheap first gate: block /admin/* when the session cookie is absent.
// The admin panel layout performs the authoritative (cryptographic) check.
// (Next 16 renamed the "middleware" convention to "proxy".)
export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const hasCookie = req.cookies.has("formaza11_admin");
    if (!hasCookie) {
      const url = req.nextUrl.clone();
      url.pathname = "/admin/login";
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
