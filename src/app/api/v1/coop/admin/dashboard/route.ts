import { fail,ok } from "@/core/api/response";
import { requireCoopAdminPermission } from "@/core/auth/admin-context";
import { UnauthorizedError,ForbiddenError } from "@/core/auth/context";
import { legacyApiClient,BackendError } from "@/modules/coop/adapters/legacy-api-client";
export async function GET(request: Request) {
 try {
  const session=await requireCoopAdminPermission("coop.members.read");
  const query=new URL(request.url).search;
  return ok(await legacyApiClient.adminRead("/api/admin/members/dashboard"+query,session.phpSessionId));
 } catch(error) {
  if(error instanceof UnauthorizedError) return fail("UNAUTHORIZED",error.message,401);
  if(error instanceof ForbiddenError) return fail("FORBIDDEN",error.message,403);
  if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
  return fail("ADMIN_ERROR","ไม่สามารถโหลดข้อมูลได้",500);
 }
}
