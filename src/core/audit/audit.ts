import type { TomvisPrincipal } from "@/core/auth/context";

export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "ADMIN_LOGIN"
  | "ADMIN_LOGOUT"
  | "PROFILE_VIEW"
  | "PROFILE_CHANGE_REQUEST_CREATED"
  | "ASSET_BENEFICIARY_ASSIGNMENT_CREATED"
  | "SENSITIVE_DATA_VIEW"
  | "STATEMENT_EXPORT"
  | "DOCUMENT_DOWNLOAD"
  | "SERVICE_REQUEST_CREATED"
  | "TICKET_CREATED"
  | "CHAT_MESSAGE_SENT";

export type AuditActor = {
  userId: string;
  organizationId: string;
  displayName?: string;
  permissions?: string[];
  memberNo?: string;
  memberId?: string;
};

export async function writeAuditLog(
  context: AuditActor,
  action: AuditAction,
  metadata: Record<string, unknown>
): Promise<void> {
  console.info("[tomvis-audit]", {
    action,
    actorUserId: context.userId,
    organizationId: context.organizationId,
    metadata,
    occurredAt: new Date().toISOString()
  });
}
