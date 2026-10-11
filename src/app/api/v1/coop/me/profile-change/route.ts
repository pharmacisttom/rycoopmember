import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { requireAuthenticatedMemberContext, UnauthorizedError } from "@/core/auth/context";
import { validateCsrfOrigin } from "@/core/security/csrf";
import { memberProfileUpdateSchema } from "@/modules/coop/schemas/member-profile-update";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { NextResponse } from "next/server";

async function readInput(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    const avatar = form.get("avatar");

    return {
      phone: String(form.get("phone") ?? ""),
      email: String(form.get("email") ?? ""),
      address: String(form.get("address") ?? ""),
      emergencyContact: String(form.get("emergencyContact") ?? ""),
      avatarFileName: avatar instanceof File && avatar.size > 0 ? avatar.name : undefined,
      note: String(form.get("note") ?? "")
    };
  }

  return request.json();
}

export async function POST(request: Request) {
  if (!validateCsrfOrigin(request)) {
    return fail("CSRF_FORBIDDEN", "คำขอไม่ถูกต้อง (CSRF check failed)", 403);
  }

  try {
    const context = await requireAuthenticatedMemberContext();
    const contentType = request.headers.get("content-type") ?? "";
    const input = memberProfileUpdateSchema.parse(await readInput(request));
    const data = await new CoopMemberService().createProfileUpdateRequest(context, input);

    if ((contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) && request.headers.get("x-sweetalert-form") !== "1") {
      return NextResponse.redirect(new URL("/member/requests", request.url), 303);
    }

    return ok(data);
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    return fail("PROFILE_CHANGE_INVALID", error instanceof Error ? error.message : "Cannot create profile change request", 400);
  }
}
