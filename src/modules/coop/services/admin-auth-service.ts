import type { AdminLoginInput } from "@/modules/coop/schemas/admin-login";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
export class CoopAdminAuthService {
  async login(input: AdminLoginInput) { return legacyApiClient.adminLogin(input); }
}
