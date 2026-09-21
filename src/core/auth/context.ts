import { headers } from "next/headers";

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
