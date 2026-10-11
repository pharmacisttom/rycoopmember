import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { requireCoopAdminSession } from "@/core/auth/admin-context";
import { UnauthorizedError, ForbiddenError } from "@/core/auth/context";

export async function GET() {
  try {
    await requireCoopAdminSession();
    return fail("NOT_AVAILABLE","บริการนี้ยังไม่เชื่อมข้อมูลจริง",503);
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    if (error instanceof ForbiddenError) {
      return fail("FORBIDDEN", error.message, 403);
    }
    return fail("ADMIN_ERROR", error instanceof Error ? error.message : "Error", 500);
  }
}
