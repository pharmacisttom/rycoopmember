import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { coopAdminSessionCookieName } from "@/core/auth/admin-context";
import { verifyCoopAdminSessionToken,revokeSessionToken } from "@/core/auth/session";
import { validateCsrfOrigin } from "@/core/security/csrf";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
import { fail } from "@/core/api/response";
export async function POST(request: Request) {
 if(!validateCsrfOrigin(request)) return fail("CSRF_FORBIDDEN","คำขอไม่ถูกต้อง",403);
 const token=cookies().get(coopAdminSessionCookieName)?.value;
 const session=verifyCoopAdminSessionToken(token);
 try {await legacyApiClient.logout(session?.phpSessionId);} catch { /* Local revocation still applies. */ }
 revokeSessionToken(token);
 const response=NextResponse.redirect(new URL("/admin/login",request.url),303);
 response.cookies.set(coopAdminSessionCookieName,"",{httpOnly:true,sameSite:"lax",secure:process.env.NODE_ENV==="production",path:"/",maxAge:0});
 return response;
}
