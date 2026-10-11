import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { coopSessionCookieName } from "@/core/auth/context";
import { verifyCoopMemberSessionToken,revokeSessionToken } from "@/core/auth/session";
import { validateCsrfOrigin } from "@/core/security/csrf";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
import { fail } from "@/core/api/response";
export async function POST(request: Request) {
 if(!validateCsrfOrigin(request)) return fail("CSRF_FORBIDDEN","คำขอไม่ถูกต้อง",403);
 const token=cookies().get(coopSessionCookieName)?.value;
 const session=verifyCoopMemberSessionToken(token);
 try {await legacyApiClient.logout(session?.phpSessionId);} catch { /* Local revocation still applies. */ }
 revokeSessionToken(token);
 const response=NextResponse.redirect(new URL("/login",request.url),303);
 response.cookies.set(coopSessionCookieName,"",{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:0});
 return response;
}
