import { NextResponse } from "next/server";
import { coopSessionCookieName, getTomvisAuthContext } from "@/core/auth/context";
import { writeAuditLog } from "@/core/audit/audit";

export async function POST(request: Request) {
  try {
    await writeAuditLog(await getTomvisAuthContext(), "LOGOUT", {});
  } catch {
    // Logout should remain idempotent even if the session is missing or invalid.
  }

  const response = NextResponse.redirect(new URL("/login", request.url), 303);
  response.cookies.set(coopSessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0
  });

  return response;
}
