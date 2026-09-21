import { ok } from "@/core/api/response";
import { getTomvisAuthContext } from "@/core/auth/context";
import { CoopMemberService } from "@/modules/coop/services/member-service";

export async function GET() {
  const data = await new CoopMemberService().getMyDashboard(await getTomvisAuthContext());
  return ok(data.welfare);
}
