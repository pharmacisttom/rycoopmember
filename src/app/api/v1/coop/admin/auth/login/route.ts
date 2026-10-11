import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { NextResponse } from "next/server";
import { fail, ok } from "@/core/api/response";
import { writeAuditLog } from "@/core/audit/audit";
import { coopAdminSessionCookieName } from "@/core/auth/admin-context";
import { createCoopAdminSessionToken } from "@/core/auth/session";
import { validateCsrfOrigin } from "@/core/security/csrf";
import { adminLoginSchema } from "@/modules/coop/schemas/admin-login";
import { CoopAdminAuthService } from "@/modules/coop/services/admin-auth-service";

async function readInput(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    return {
      username: String(form.get("username") ?? ""),
      password: String(form.get("password") ?? "")
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
  return NextResponse.redirect(new URL("/admin/login", request.url), 303);
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (!validateCsrfOrigin(request)) {
    return fail("CSRF_FORBIDDEN", "คำขอไม่ถูกต้อง", 403);
  }

  try {
    const input = adminLoginSchema.parse(await readInput(request));
    const session = await new CoopAdminAuthService().login(input);
    const token = createCoopAdminSessionToken(session);

    await writeAuditLog(
      {
        userId: session.userId,
        organizationId: session.organizationId,
        displayName: session.displayName,
        permissions: session.permissions
      },
      "ADMIN_LOGIN",
      { username: session.username }
    );

    const response = isHtmlForm(contentType) && !isSweetAlertForm(request)
      ? NextResponse.redirect(new URL("/admin/coop", request.url), 303)
      : ok({ username: session.username, displayName: session.displayName });

    response.cookies.set(coopAdminSessionCookieName, token, {
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
      return NextResponse.redirect(new URL("/admin/login?error=invalid", request.url), 303);
    }

    return fail("INVALID_ADMIN_LOGIN", error instanceof Error ? error.message : "เข้าสู่ระบบแอดมินไม่สำเร็จ", 401);
  }
}
