import { writeAuditLog } from "@/core/audit/audit";
import { requireAuthenticatedMember, UnauthorizedError, type TomvisPrincipal } from "@/core/auth/context";
import { assertPermission } from "@/core/rbac/permissions";
import { coopPermissions } from "@/modules/coop/permissions/catalog";
import { defaultMemberRepository, type MemberRepository } from "@/modules/coop/repositories/member-repository";
import { legacyApiClient } from "@/modules/coop/adapters/legacy-api-client";
import type { AssetBeneficiaryAssignmentInput } from "@/modules/coop/schemas/asset-beneficiary";
import type { MemberProfileUpdateInput } from "@/modules/coop/schemas/member-profile-update";
import { BackendError } from "@/modules/coop/adapters/legacy-api-client";

export class CoopMemberService {
  constructor(private readonly repository: MemberRepository = defaultMemberRepository) {}

  async getMyDashboard(context: TomvisPrincipal | null) {
    if (!context) {
      throw new UnauthorizedError();
    }
    assertPermission(context, coopPermissions.selfRead);
    const memberId = requireAuthenticatedMember(context);

    const dashboard = await this.repository.findDashboardByMember({
      organizationId: context.organizationId,
      memberId,
      phpSessionId: context.phpSessionId
    });

    if (!dashboard) {
      throw new Error("MEMBER_NOT_FOUND");
    }

    await writeAuditLog(context, "PROFILE_VIEW", { memberId });
    return dashboard;
  }

  async createProfileUpdateRequest(context: TomvisPrincipal | null, input: MemberProfileUpdateInput) {
    if (!context) {
      throw new UnauthorizedError();
    }
    assertPermission(context, coopPermissions.profileChangeRequest);
    const memberId = requireAuthenticatedMember(context);

    // Persist real request to backend
    const savedRequest = await legacyApiClient.submitProfileUpdateRequest(
      memberId,
      input,
      context.phpSessionId
    );

    await writeAuditLog(context, "PROFILE_CHANGE_REQUEST_CREATED", {
      memberId,
      requestNumber: savedRequest.requestNumber,
      includesAvatar: Boolean(input.avatarFileName)
    });

    return savedRequest;
  }

  async createAssetBeneficiaryAssignment(context: TomvisPrincipal | null, input: AssetBeneficiaryAssignmentInput) {
    if (!context) {
      throw new UnauthorizedError();
    }
    throw new BackendError(503,"ระบบบันทึกผู้รับผลประโยชน์ยังไม่พร้อมใช้งาน กรุณาติดต่อสหกรณ์");
  }
}
