import { createHmac, timingSafeEqual } from "node:crypto";

export type CoopMemberSession = {
  userId: string;
  organizationId: string;
  memberId: string;
  memberNo: string;
  displayName: string;
  permissions: string[];
  issuedAt: string;
};

const sessionSecret = process.env.TOMVIS_SESSION_SECRET ?? "rycoopmember-dev-session-secret";

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret).update(payload).digest("base64url");
}

export function createCoopMemberSessionToken(session: CoopMemberSession): string {
  const payload = base64UrlEncode(JSON.stringify(session));
  return `${payload}.${sign(payload)}`;
}

export function verifyCoopMemberSessionToken(token?: string): CoopMemberSession | null {
  if (!token) {
    return null;
  }

  const [payload, signature] = token.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expected = sign(payload);
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
    return null;
  }

  try {
    return JSON.parse(base64UrlDecode(payload)) as CoopMemberSession;
  } catch {
    return null;
  }
}
