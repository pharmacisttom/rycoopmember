import { legacyApiClient, BackendError } from "@/modules/coop/adapters/legacy-api-client";
import { cookies } from "next/headers";
import { verifyCoopMemberSessionToken, type CoopMemberSession } from "@/core/auth/session";

export const coopSessionCookieName = "coop_member_session";

export class UnauthorizedError extends Error {
  readonly statusCode = 401;
  constructor(message = "กรุณาเข้าสู่ระบบก่อนทำรายการ") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends Error {
  readonly statusCode = 403;
  constructor(message = "ไม่มีสิทธิ์เข้าถึงข้อมูลหรือดำเนินการนี้") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export type TomvisPrincipal = {
  userId: string;
  organizationId: string;
  memberId: string;
  memberNo: string;
  displayName: string;
  permissions: string[];
  phpSessionId?: string;
};

export async function getTomvisAuthContext(): Promise<TomvisPrincipal | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(coopSessionCookieName)?.value;
  if (!token) {
    return null;
  }

  const session = verifyCoopMemberSessionToken(token);
  if (!session) {
    return null;
  }

  try {
    const user = await legacyApiClient.authenticatedUser(session.phpSessionId);
    if (String(user.id) !== session.userId || user.role !== "member") return null;
  } catch(error) {
    if(error instanceof BackendError && [401,403].includes(error.status)) return null;
    throw error;
  }
  return {
    userId: session.userId,
    organizationId: session.organizationId,
    memberId: session.memberId,
    memberNo: session.memberNo,
    displayName: session.displayName,
    permissions: ["coop.self.read","coop.profile.change.request","coop.dividend.read"],
    phpSessionId: session.phpSessionId
  };
}

export async function requireAuthenticatedMemberContext(): Promise<TomvisPrincipal> {
  const context = await getTomvisAuthContext();
  if (!context) {
    throw new UnauthorizedError("กรุณาเข้าสู่ระบบสมาชิกก่อนทำรายการ");
  }

  return context;
}

export function requireAuthenticatedMember(context: TomvisPrincipal | null): string {
  if (!context || !context.memberId) {
    throw new UnauthorizedError("AUTHENTICATED_MEMBER_REQUIRED");
  }

  return context.memberId;
}

export function getRawMemberSession(): CoopMemberSession | null {
  const cookieStore = cookies();
  const token = cookieStore.get(coopSessionCookieName)?.value;
  return verifyCoopMemberSessionToken(token);
}
