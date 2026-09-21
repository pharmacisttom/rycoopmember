import { fail, ok } from "@/core/api/response";
import { getTomvisAuthContext } from "@/core/auth/context";
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
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const input = memberProfileUpdateSchema.parse(await readInput(request));
    const data = await new CoopMemberService().createProfileUpdateRequest(await getTomvisAuthContext(), input);
    if ((contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) && request.headers.get("x-sweetalert-form") !== "1") {
      return NextResponse.redirect(new URL("/member/requests", request.url), 303);
    }

    return ok(data);
  } catch (error) {
    return fail("PROFILE_CHANGE_INVALID", error instanceof Error ? error.message : "Cannot create profile change request", 400);
  }
}
