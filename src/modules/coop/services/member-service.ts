import { writeAuditLog } from "@/core/audit/audit";
import { requireAuthenticatedMember, type TomvisPrincipal } from "@/core/auth/context";
import { assertPermission } from "@/core/rbac/permissions";
import { coopPermissions } from "@/modules/coop/permissions/catalog";
import { mockMemberRepository, type MemberRepository } from "@/modules/coop/repositories/member-repository";

export class CoopMemberService {
  constructor(private readonly repository: MemberRepository = mockMemberRepository) {}

  async getMyDashboard(context: TomvisPrincipal) {
    assertPermission(context, coopPermissions.selfRead);
    const memberId = requireAuthenticatedMember(context);

    const dashboard = await this.repository.findDashboardByMember({
      organizationId: context.organizationId,
      memberId
    });

    if (!dashboard) {
      throw new Error("MEMBER_NOT_FOUND");
    }

    await writeAuditLog(context, "PROFILE_VIEW", { memberId });
    return dashboard;
  }
}
