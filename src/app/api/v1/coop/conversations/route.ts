import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { requireAuthenticatedMemberContext, UnauthorizedError } from "@/core/auth/context";
import { validateCsrfOrigin } from "@/core/security/csrf";

export async function GET() {
  try {
    await requireAuthenticatedMemberContext();
    return ok({ conversations: [] });
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
    return fail("CSRF_FORBIDDEN", "คำขอไม่ถูกต้อง", 403);
  }

  try {
    await requireAuthenticatedMemberContext();
    return fail("NOT_AVAILABLE","บริการนี้ยังไม่พร้อมใช้งาน กรุณาติดต่อสหกรณ์",503);
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    return fail("COOP_ERROR", error instanceof Error ? error.message : "Error", 500);
  }
}
