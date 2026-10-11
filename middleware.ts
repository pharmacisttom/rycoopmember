import { NextResponse, type NextRequest } from "next/server";

const protectedMemberPaths = ["/member"];
const protectedAdminPaths = ["/admin/coop"];
const sessionCookieName = "coop_member_session";
const adminSessionCookieName = "coop_admin_session";

export function middleware(request: NextRequest) {
  const isProtectedMemberPath = protectedMemberPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`));

  if (isProtectedMemberPath && !request.cookies.has(sessionCookieName)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const isProtectedAdminPath = protectedAdminPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`));
  if (isProtectedAdminPath && !request.cookies.has(adminSessionCookieName)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/admin/login";
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Cookie presence alone cannot establish a valid session. Keep login reachable.
  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/login", "/admin/coop/:path*", "/admin/login"]
};
