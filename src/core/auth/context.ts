import { cookies, headers } from "next/headers";
import { verifyCoopMemberSessionToken } from "@/core/auth/session";

export const coopSessionCookieName = "coop_member_session";

export type TomvisPrincipal = {
  userId: string;
  organizationId: string;
  memberId?: string;
  displayName: string;
  permissions: string[];
};

const defaultPermissions = [
  "coop.self.read",
  "coop.profile.change.request",
  "coop.beneficiary.assign",
  "coop.shares.read",
  "coop.deposits.read",
  "coop.loans.read",
  "coop.guarantees.read",
  "coop.dividend.read",
  "coop.statement.read",
  "coop.documents.read",
  "coop.welfare.read",
  "coop.welfare.request",
  "coop.service.request",
  "coop.chat.use",
  "coop.helpdesk.create"
];

export async function getTomvisAuthContext(): Promise<TomvisPrincipal> {
  const session = verifyCoopMemberSessionToken(cookies().get(coopSessionCookieName)?.value);
  if (session) {
    return {
      userId: session.userId,
      organizationId: session.organizationId,
      memberId: session.memberId,
      displayName: session.displayName,
      permissions: session.permissions
    };
  }

  const requestHeaders = headers();

  return {
    userId: requestHeaders.get("x-tomvis-user-id") ?? "user_demo_member",
    organizationId: requestHeaders.get("x-tomvis-organization-id") ?? "org_rayong_health_coop",
    memberId: requestHeaders.get("x-tomvis-member-id") ?? "member_demo_001",
    displayName: requestHeaders.get("x-tomvis-display-name") ?? "สมชาย ใจดี",
    permissions: requestHeaders.get("x-tomvis-permissions")?.split(",") ?? defaultPermissions
  };
}

export function requireAuthenticatedMember(context: TomvisPrincipal): string {
  if (!context.memberId) {
    throw new Error("AUTHENTICATED_MEMBER_REQUIRED");
  }

  return context.memberId;
}
