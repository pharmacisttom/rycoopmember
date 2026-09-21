import { writeAuditLog } from "@/core/audit/audit";
import { requireAuthenticatedMember, type TomvisPrincipal } from "@/core/auth/context";
import { assertPermission } from "@/core/rbac/permissions";
import { coopPermissions } from "@/modules/coop/permissions/catalog";
import { mockMemberRepository, type MemberRepository } from "@/modules/coop/repositories/member-repository";
import type { AssetBeneficiaryAssignmentInput } from "@/modules/coop/schemas/asset-beneficiary";
import type { MemberProfileUpdateInput } from "@/modules/coop/schemas/member-profile-update";
import { maskCitizenId } from "@/core/security/masking";

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

  async createProfileUpdateRequest(context: TomvisPrincipal, input: MemberProfileUpdateInput) {
    assertPermission(context, coopPermissions.profileChangeRequest);
    const memberId = requireAuthenticatedMember(context);

    const dashboard = await this.repository.findDashboardByMember({
      organizationId: context.organizationId,
      memberId
    });

    if (!dashboard) {
      throw new Error("MEMBER_NOT_FOUND");
    }

    const request = {
      requestNumber: `REQ-${new Date().getFullYear() + 543}-${Math.floor(100000 + Math.random() * 899999)}`,
      memberNo: dashboard.profile.memberNo,
      status: "SUBMITTED" as const,
      requestedChanges: {
        phone: input.phone,
        email: input.email,
        address: input.address,
        emergencyContact: input.emergencyContact,
        avatarFileName: input.avatarFileName
      }
    };

    await writeAuditLog(context, "PROFILE_CHANGE_REQUEST_CREATED", {
      memberId,
      requestNumber: request.requestNumber,
      includesAvatar: Boolean(input.avatarFileName)
    });

    return request;
  }

  async createAssetBeneficiaryAssignment(context: TomvisPrincipal, input: AssetBeneficiaryAssignmentInput) {
    assertPermission(context, coopPermissions.beneficiaryAssign);
    const memberId = requireAuthenticatedMember(context);

    const dashboard = await this.repository.findDashboardByMember({
      organizationId: context.organizationId,
      memberId
    });

    if (!dashboard) {
      throw new Error("MEMBER_NOT_FOUND");
    }

    const assignment = {
      id: crypto.randomUUID(),
      requestNumber: `BEN-${new Date().getFullYear() + 543}-${Math.floor(100000 + Math.random() * 899999)}`,
      memberNo: dashboard.profile.memberNo,
      beneficiaryFullName: input.beneficiaryFullName,
      relationship: input.relationship,
      citizenIdMasked: maskCitizenId(input.citizenId),
      phone: input.phone,
      address: input.address,
      witnessName: input.witnessName,
      allocations: input.allocations,
      status: "READY_TO_SUBMIT" as const,
      generatedAt: new Date().toISOString()
    };

    await writeAuditLog(context, "ASSET_BENEFICIARY_ASSIGNMENT_CREATED", {
      memberId,
      requestNumber: assignment.requestNumber,
      allocationCount: assignment.allocations.length
    });

    return assignment;
  }
}
