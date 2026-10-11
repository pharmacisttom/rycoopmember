import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { requireAuthenticatedMemberContext, UnauthorizedError } from "@/core/auth/context";
import { validateCsrfOrigin } from "@/core/security/csrf";
import { assetBeneficiaryAssignmentSchema } from "@/modules/coop/schemas/asset-beneficiary";
import { CoopMemberService } from "@/modules/coop/services/member-service";
import { NextResponse } from "next/server";

async function readInput(request: Request) {
  const contentType = request.headers.get("content-type") ?? "";

  if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    const assetTypes = form.getAll("assetType").map(String);
    const assetLabels = form.getAll("assetLabel").map(String);
    const percents = form.getAll("percent").map(String);
    const notes = form.getAll("note").map(String);

    return {
      beneficiaryFullName: String(form.get("beneficiaryFullName") ?? ""),
      relationship: String(form.get("relationship") ?? ""),
      citizenId: String(form.get("citizenId") ?? ""),
      phone: String(form.get("phone") ?? ""),
      address: String(form.get("address") ?? ""),
      witnessName: String(form.get("witnessName") ?? ""),
      allocations: assetTypes.map((assetType, index) => ({
        assetType,
        assetLabel: assetLabels[index] ?? assetType,
        percent: percents[index] ?? "0",
        note: notes[index] || undefined
      }))
    };
  }

  return request.json();
}

export async function GET() {
  try {
    const context = await requireAuthenticatedMemberContext();
    const data = await new CoopMemberService().getMyDashboard(context);
    return ok(data.assetBeneficiaryAssignments);
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    return fail("COOP_ERROR", error instanceof Error ? error.message : "Error", 500);
  }
}

export async function POST(request: Request) {
  if (!validateCsrfOrigin(request)) {
    return fail("CSRF_FORBIDDEN", "คำขอไม่ถูกต้อง (CSRF check failed)", 403);
  }

  try {
    const context = await requireAuthenticatedMemberContext();
    const contentType = request.headers.get("content-type") ?? "";
    const input = assetBeneficiaryAssignmentSchema.parse(await readInput(request));
    const data = await new CoopMemberService().createAssetBeneficiaryAssignment(context, input);
    if ((contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) && request.headers.get("x-sweetalert-form") !== "1") {
      return NextResponse.redirect(new URL("/member/beneficiaries/report", request.url), 303);
    }

    return ok(data);
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    return fail("BENEFICIARY_ASSIGNMENT_INVALID", error instanceof Error ? error.message : "Cannot create beneficiary assignment", 400);
  }
}
