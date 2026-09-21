import { NextResponse, type NextRequest } from "next/server";

const protectedMemberPaths = ["/member"];
const sessionCookieName = "coop_member_session";

export function middleware(request: NextRequest) {
  const isProtectedMemberPath = protectedMemberPaths.some((path) => request.nextUrl.pathname === path || request.nextUrl.pathname.startsWith(`${path}/`));

  if (isProtectedMemberPath && !request.cookies.has(sessionCookieName)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("returnTo", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (request.nextUrl.pathname === "/login" && request.cookies.has(sessionCookieName)) {
    return NextResponse.redirect(new URL("/member", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/member/:path*", "/login"]
};
