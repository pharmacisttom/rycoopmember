import { BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { fail, ok } from "@/core/api/response";
import { CoopWebReadonlyService } from "@/modules/coop/services/web-readonly-service";
import { rejectReadonlyRequest } from "../_lib/readonly-response";

export async function GET(request: Request) {
  const rejected = rejectReadonlyRequest(request);
  if (rejected) {
    return rejected;
  }

  try {
    return ok(await new CoopWebReadonlyService().getPublicSummary());
  } catch (error) {
    if(error instanceof BackendError) return fail("BACKEND_ERROR",error.message,error.status);
    return fail("WEB_SUMMARY_ERROR", error instanceof Error ? error.message : "Cannot load web summary", 500);
  }
}
