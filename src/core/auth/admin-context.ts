import { legacyApiClient, BackendError, mapAdminPermissions } from "@/modules/coop/adapters/legacy-api-client";
import { cookies } from "next/headers";
import { verifyCoopAdminSessionToken, type CoopAdminSession } from "@/core/auth/session";
import { UnauthorizedError, ForbiddenError } from "@/core/auth/context";

export const coopAdminSessionCookieName = "coop_admin_session";

export function getCoopAdminSession(): CoopAdminSession | null {
  const cookieStore = cookies();
  const token = cookieStore.get(coopAdminSessionCookieName)?.value;
  return verifyCoopAdminSessionToken(token);
}

export async function requireCoopAdminSession(): Promise<CoopAdminSession> {
  const session = getCoopAdminSession();
  if (!session) {
    throw new UnauthorizedError("กรุณาเข้าสู่ระบบเจ้าหน้าที่ก่อนทำรายการ");
  }

  // Double-check tokenType is ADMIN
  if (session.tokenType && session.tokenType !== "ADMIN") {
    throw new ForbiddenError("คุณไม่มีสิทธิ์เข้าถึงส่วนงานเจ้าหน้าที่");
  }

  const user = await legacyApiClient.authenticatedUser(session.phpSessionId).catch(error=>{
    if(error instanceof BackendError && [401,403].includes(error.status)) throw new UnauthorizedError();
    throw error;
  });
  if(String(user.id) !== session.userId || user.role === "member") throw new ForbiddenError();
  return {...session,role:user.role,permissions:mapAdminPermissions(user)};
}

export async function requireCoopAdminPermission(permission: string): Promise<CoopAdminSession> {
  const session = await requireCoopAdminSession();
  if (!session.permissions.includes(permission)) {
    throw new ForbiddenError(`ไม่มีสิทธิ์ดำเนินการ: ${permission}`);
  }

  return session;
}
