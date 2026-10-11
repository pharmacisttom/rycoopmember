import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { NextResponse } from "next/server";
import { fail, ok } from "@/core/api/response";
import { coopSessionCookieName } from "@/core/auth/context";
import { createCoopMemberSessionToken } from "@/core/auth/session";
import { validateCsrfOrigin } from "@/core/security/csrf";
import { writeAuditLog } from "@/core/audit/audit";
import { memberLoginSchema } from "@/modules/coop/schemas/member-login";
import { CoopMemberAuthService } from "@/modules/coop/services/member-auth-service";

async function readInput(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    return {
      username: String(form.get("username") ?? ""), password: String(form.get("password") ?? "")
    };
  }

  return request.json();
}

function isHtmlForm(contentType: string): boolean {
  return contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded");
}

function isSweetAlertForm(request: Request): boolean {
  return request.headers.get("x-sweetalert-form") === "1";
}

export async function GET(request: Request) {
  return NextResponse.redirect(new URL("/login", request.url), 303);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!validateCsrfOrigin(request)) {
    return fail("CSRF_FORBIDDEN", "คำขอไม่ถูกต้อง", 403);
  }

  try {
    const input = memberLoginSchema.parse(await readInput(request));
    const session = await new CoopMemberAuthService().login(input);
    const token = createCoopMemberSessionToken(session);

    await writeAuditLog(
      {
        userId: session.userId,
        organizationId: session.organizationId,
        memberId: session.memberId,
        displayName: session.displayName,
        permissions: session.permissions
      },
      "LOGIN",
      { memberNo: session.memberNo }
    );

    const response = isHtmlForm(contentType) && !isSweetAlertForm(request)
      ? NextResponse.redirect(new URL("/member", request.url), 303)
      : ok({ memberNo: session.memberNo, displayName: session.displayName });

    response.cookies.set(coopSessionCookieName, token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 8
    });

    return response;
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (isHtmlForm(contentType) && !isSweetAlertForm(request)) {
      return NextResponse.redirect(new URL("/login?error=invalid", request.url), 303);
    }

    return fail("INVALID_MEMBER_LOGIN", error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ", 401);
  }
}
