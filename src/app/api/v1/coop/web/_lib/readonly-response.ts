import { fail } from "@/core/api/response";
import { isReadonlyMethod, verifyReadonlyApiToken } from "@/core/api/readonly-token";

export function rejectReadonlyRequest(request: Request) {
  if (!isReadonlyMethod(request)) {
    return fail("METHOD_NOT_ALLOWED", "Readonly web API accepts GET and HEAD only", 405);
  }

  if (!verifyReadonlyApiToken(request)) {
    return fail("UNAUTHORIZED_READONLY_API", "Invalid readonly API token", 401);
  }

  return null;
}
