import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { requireAuthenticatedMemberContext, UnauthorizedError } from "@/core/auth/context";

export async function GET() {
  try {
    await requireAuthenticatedMemberContext();
    return ok({
      documents: [
        { id: "doc_member_certificate", type: "MEMBER_CERTIFICATE", name: "หนังสือรับรองสมาชิก" },
        { id: "doc_dividend_certificate", type: "DIVIDEND_CERTIFICATE", name: "หนังสือรับรองเงินปันผล" }
      ]
    });
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    return fail("COOP_ERROR", error instanceof Error ? error.message : "Cannot load documents", 500);
  }
}
