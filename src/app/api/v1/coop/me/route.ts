import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { requireAuthenticatedMemberContext, UnauthorizedError } from "@/core/auth/context";
import { CoopMemberService } from "@/modules/coop/services/member-service";

export async function GET() {
  try {
    const context = await requireAuthenticatedMemberContext();
    const data = await new CoopMemberService().getMyDashboard(context);
    return ok(data);
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    return fail("COOP_ME_ERROR", error instanceof Error ? error.message : "Cannot load member data", 500);
  }
}
