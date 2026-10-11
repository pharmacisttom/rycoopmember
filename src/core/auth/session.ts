import { createHmac, createHash, randomUUID, timingSafeEqual } from "node:crypto";

export type CoopMemberSession = {
  tokenType?: "MEMBER";
  sessionId?: string;
  userId: string;
  organizationId: string;
  memberId: string;
  memberNo: string;
  displayName: string;
  permissions: string[];
  issuedAt: string;
  expiresAt?: number;
  phpSessionId?: string;
};

export type CoopAdminSession = {
  tokenType?: "ADMIN";
  sessionId?: string;
  userId: string;
  organizationId: string;
  username: string;
  displayName: string;
  role?: string;
  permissions: string[];
  issuedAt: string;
  expiresAt?: number;
  phpSessionId?: string;
};

const DEFAULT_DEV_SECRET = "rycoopmember-dev-session-secret-long-enough-for-local-testing-32b";
const DEFAULT_SESSION_TTL_MS = 8 * 60 * 60 * 1000; // 8 hours

// Revocation set
const revokedSessions = new Set<string>();
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
function revokedPath(id: string) {
 const dir=resolve(process.env.SESSION_STATE_DIR || ".session-state"); mkdirSync(dir,{recursive:true,mode:0o700});
 return join(dir,"revoked-"+createHash("sha256").update(id).digest("hex")+".json");
}

export function getSessionSecret(): string {
  const secret = process.env.TOMVIS_SESSION_SECRET;
  if (process.env.NODE_ENV === "production") {
    if (
      !secret ||
      secret === "change-this-long-random-secret" ||
      secret.startsWith("generate-a-secure-random-") ||
      secret === "rycoopmember-dev-session-secret" ||
      secret === DEFAULT_DEV_SECRET ||
      secret.length < 32
    ) {
      throw new Error(
        "FATAL_SECURITY_ERROR: TOMVIS_SESSION_SECRET must be configured with at least 32 characters in production"
      );
    }
  }

  return secret ?? DEFAULT_DEV_SECRET;
}

function base64UrlEncode(value: string): string {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string): string {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("base64url");
}

export function createCoopMemberSessionToken(
  session: CoopMemberSession,
  ttlMs: number = DEFAULT_SESSION_TTL_MS
): string {
  const now = Date.now();
  const payloadData: CoopMemberSession & { tokenType: "MEMBER"; expiresAt: number; sessionId: string } = {
    ...session,
    tokenType: "MEMBER",
    sessionId: session.sessionId ?? randomUUID(),
    issuedAt: session.issuedAt || new Date(now).toISOString(),
    expiresAt: session.expiresAt ?? now + ttlMs
  };

  const payload = base64UrlEncode(JSON.stringify(payloadData));
  return `${payload}.${sign(payload)}`;
}

export function createCoopAdminSessionToken(
  session: CoopAdminSession,
  ttlMs: number = DEFAULT_SESSION_TTL_MS
): string {
  const now = Date.now();
  const payloadData: CoopAdminSession & { tokenType: "ADMIN"; expiresAt: number; sessionId: string } = {
    ...session,
    tokenType: "ADMIN",
    sessionId: session.sessionId ?? randomUUID(),
    issuedAt: session.issuedAt || new Date(now).toISOString(),
    expiresAt: session.expiresAt ?? now + ttlMs
  };

  const payload = base64UrlEncode(JSON.stringify(payloadData));
  return `${payload}.${sign(payload)}`;
}

export function verifyCoopMemberSessionToken(token?: string): CoopMemberSession | null {
  const parsed = verifySessionToken<CoopMemberSession & { tokenType?: string; expiresAt?: number; sessionId?: string }>(token);
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  // Strictly require MEMBER token type
  if (parsed.tokenType !== "MEMBER") {
    return null;
  }

  // Server-side expiration check
  if (!Number.isFinite(parsed.expiresAt) || Date.now() >= parsed.expiresAt!) {
    return null;
  }

  // Revocation check
  if (typeof parsed.sessionId !== "string" || isSessionRevoked(parsed.sessionId)) {
    return null;
  }

  if (typeof parsed.userId !== "string" || !parsed.userId || !Array.isArray(parsed.permissions) || !parsed.permissions.every(p=>typeof p === "string")) return null;
  return parsed;
}

export function verifyCoopAdminSessionToken(token?: string): CoopAdminSession | null {
  const parsed = verifySessionToken<CoopAdminSession & { tokenType?: string; expiresAt?: number; sessionId?: string }>(token);
  if (!parsed || typeof parsed !== "object") {
    return null;
  }

  // Strictly require ADMIN token type
  if (parsed.tokenType !== "ADMIN") {
    return null;
  }

  // Server-side expiration check
  if (!Number.isFinite(parsed.expiresAt) || Date.now() >= parsed.expiresAt!) {
    return null;
  }

  // Revocation check
  if (typeof parsed.sessionId !== "string" || isSessionRevoked(parsed.sessionId)) {
    return null;
  }

  if (typeof parsed.userId !== "string" || !parsed.userId || !Array.isArray(parsed.permissions) || !parsed.permissions.every(p=>typeof p === "string")) return null;
  return parsed;
}

export function revokeSessionToken(token?: string): void {
  if (!token) return;
  const [payload] = token.split(".");
  if (!payload) return;
  try {
    const data = JSON.parse(base64UrlDecode(payload));
    if (data.sessionId) {
      // Only authenticated tokens may create revocation records.
      const checked=verifySessionToken<{sessionId:string;expiresAt:number}>(token);
      if(!checked || typeof checked.sessionId!=="string" || !Number.isFinite(checked.expiresAt)) return;
      revokedSessions.add(data.sessionId);
      writeFileSync(revokedPath(data.sessionId),JSON.stringify({expires:checked.expiresAt}),{mode:0o600});
    }
  } catch {}
}

export function isSessionRevoked(sessionId: string): boolean {
  if(revokedSessions.has(sessionId)) return true;
  const file=revokedPath(sessionId);
  if(!existsSync(file)) return false;
  try {return JSON.parse(readFileSync(file,"utf8")).expires > Date.now();} catch {return true;}
}

function verifySessionToken<T>(token?: string): T | null {
  if (!token) {
    return null;
  }

  const parts = token.split(".");
  if(parts.length !== 2) return null;
  const [payload, signature] = parts;
  if (!payload || !signature) {
    return null;
  }

  try {
    const expected = sign(payload);
    const expectedBuffer = Buffer.from(expected);
    const actualBuffer = Buffer.from(signature);

    if (expectedBuffer.length !== actualBuffer.length || !timingSafeEqual(expectedBuffer, actualBuffer)) {
      return null;
    }

    return JSON.parse(base64UrlDecode(payload)) as T;
  } catch {
    return null;
  }
}
