import { fail, ok } from "@/core/api/response";
import { getTomvisAuthContext } from "@/core/auth/context";
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
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return ok(data.assetBeneficiaryAssignments);
}

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get("content-type") ?? "";
    const input = assetBeneficiaryAssignmentSchema.parse(await readInput(request));
    const data = await new CoopMemberService().createAssetBeneficiaryAssignment(await getTomvisAuthContext(), input);
    if ((contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) && request.headers.get("x-sweetalert-form") !== "1") {
      return NextResponse.redirect(new URL("/member/beneficiaries/report", request.url), 303);
    }

    return ok(data);
  } catch (error) {
    return fail("BENEFICIARY_ASSIGNMENT_INVALID", error instanceof Error ? error.message : "Cannot create beneficiary assignment", 400);
  }
}
