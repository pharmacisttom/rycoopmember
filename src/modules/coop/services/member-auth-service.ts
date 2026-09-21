import { coopPermissions } from "@/modules/coop/permissions/catalog";
import type { MemberLoginInput } from "@/modules/coop/schemas/member-login";

const demoMemberCredential = {
  organizationId: "org_rayong_health_coop",
  userId: "user_demo_member",
  memberId: "member_demo_001",
  memberNo: "RYS-001245",
  displayName: "สมชาย ใจดี",
  citizenId: "1234567890456",
  currentPhone: "0899994821"
};

function onlyDigits(value: string): string {
  return value.replace(/\D/g, "");
}

export class CoopMemberAuthService {
  async login(input: MemberLoginInput) {
    const memberNoMatches = input.memberNo.trim().toUpperCase() === demoMemberCredential.memberNo;
    const citizenIdMatches = onlyDigits(input.citizenId) === demoMemberCredential.citizenId;
    const phoneMatches = onlyDigits(input.phoneVerificationCode) === demoMemberCredential.currentPhone;

    if (!memberNoMatches || !citizenIdMatches || !phoneMatches) {
      throw new Error("INVALID_MEMBER_LOGIN");
    }

    return {
      userId: demoMemberCredential.userId,
      organizationId: demoMemberCredential.organizationId,
      memberId: demoMemberCredential.memberId,
      memberNo: demoMemberCredential.memberNo,
      displayName: demoMemberCredential.displayName,
      permissions: [
        coopPermissions.selfRead,
        coopPermissions.profileChangeRequest,
        coopPermissions.beneficiaryAssign,
        coopPermissions.sharesRead,
        coopPermissions.depositsRead,
        coopPermissions.loansRead,
        coopPermissions.guaranteesRead,
        coopPermissions.dividendRead,
        coopPermissions.statementRead,
        coopPermissions.documentsRead,
        coopPermissions.welfareRead,
        coopPermissions.welfareRequest,
        coopPermissions.serviceRequest,
        coopPermissions.chatUse,
        coopPermissions.helpdeskCreate
      ],
      issuedAt: new Date().toISOString()
    };
  }
}
