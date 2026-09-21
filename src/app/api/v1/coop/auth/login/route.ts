import { NextResponse } from "next/server";
import { fail, ok } from "@/core/api/response";
import { coopSessionCookieName } from "@/core/auth/context";
import { createCoopMemberSessionToken } from "@/core/auth/session";
import { writeAuditLog } from "@/core/audit/audit";
import { memberLoginSchema } from "@/modules/coop/schemas/member-login";
import { CoopMemberAuthService } from "@/modules/coop/services/member-auth-service";

async function readInput(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    return {
      memberNo: String(form.get("memberNo") ?? ""),
      citizenId: String(form.get("citizenId") ?? ""),
      phoneVerificationCode: String(form.get("phoneVerificationCode") ?? "")
    };
  }

  return request.json();
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
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

    const response = contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")
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
    return fail("INVALID_MEMBER_LOGIN", error instanceof Error ? error.message : "เข้าสู่ระบบไม่สำเร็จ", 401);
  }
}
