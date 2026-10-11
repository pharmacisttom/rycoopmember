import type { MemberLoginInput } from "@/modules/coop/schemas/member-login";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
export class CoopMemberAuthService {
  async login(input: MemberLoginInput) { return legacyApiClient.memberLogin(input); }
}
