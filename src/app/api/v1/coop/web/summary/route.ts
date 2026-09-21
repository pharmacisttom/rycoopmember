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
    return fail("WEB_SUMMARY_ERROR", error instanceof Error ? error.message : "Cannot load web summary", 500);
  }
}
