import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { requireAuthenticatedMemberContext, UnauthorizedError } from "@/core/auth/context";

export async function GET() {
  try {
    await requireAuthenticatedMemberContext();
    return ok({
      types: ["shares", "deposits", "loans", "payments", "interest", "dividend", "patronage", "welfare"],
      exportFormats: ["PDF", "EXCEL", "PRINT"]
    });
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    if (error instanceof UnauthorizedError) {
      return fail("UNAUTHORIZED", error.message, 401);
    }
    return fail("COOP_ERROR", error instanceof Error ? error.message : "Cannot load statements", 500);
  }
}
