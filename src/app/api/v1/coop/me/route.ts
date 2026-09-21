import { fail, ok } from "@/core/api/response";
import { getTomvisAuthContext } from "@/core/auth/context";
import { CoopMemberService } from "@/modules/coop/services/member-service";

export async function GET() {
  try {
    const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
    return ok(data);
  } catch (error) {
    return fail("COOP_ME_ERROR", error instanceof Error ? error.message : "Cannot load member data", 403);
  }
}
