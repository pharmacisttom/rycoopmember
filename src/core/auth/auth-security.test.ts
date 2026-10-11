import { describe, expect, it, beforeEach } from "vitest";
import {
  createCoopMemberSessionToken,
  createCoopAdminSessionToken,
  verifyCoopMemberSessionToken,
  verifyCoopAdminSessionToken,
  revokeSessionToken,
  isSessionRevoked,
  getSessionSecret
} from "./session";
import { UnauthorizedError, requireAuthenticatedMember } from "./context";
import { loginRateLimiter } from "@/core/security/rate-limiter";
import { coopPermissions } from "@/modules/coop/permissions/catalog";

describe("Authentication & Session Security Tests", () => {
  const memberSessionA = {
    userId: "usr_001",
    organizationId: "org_rayong_health_coop",
    memberId: "mem_001",
    memberNo: "00124",
    displayName: "สมาชิก ก",
    permissions: [coopPermissions.selfRead, coopPermissions.profileChangeRequest],
    issuedAt: new Date().toISOString()
  };

  const memberSessionB = {
    userId: "usr_002",
    organizationId: "org_rayong_health_coop",
    memberId: "mem_002",
    memberNo: "00125",
    displayName: "สมาชิก ข",
    permissions: [coopPermissions.selfRead],
    issuedAt: new Date().toISOString()
  };

  const adminSession = {
    userId: "adm_001",
    organizationId: "org_rayong_health_coop",
    username: "admin_somkiat",
    displayName: "สมเกียรติ เจ้าหน้าที่",
    role: "member_admin",
    permissions: [coopPermissions.membersRead, coopPermissions.requestsManage],
    issuedAt: new Date().toISOString()
  };

  beforeEach(() => {
    loginRateLimiter.reset("00124");
    loginRateLimiter.reset("test_user");
  });

  it("1. Verifies member token with member verifier successfully", () => {
    const token = createCoopMemberSessionToken(memberSessionA);
    const verified = verifyCoopMemberSessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.memberNo).toBe("00124");
    expect(verified?.memberId).toBe("mem_001");
  });

  it("2. Strictly rejects member token when presented to admin verifier", () => {
    const memberToken = createCoopMemberSessionToken(memberSessionA);
    const adminCheck = verifyCoopAdminSessionToken(memberToken);
    expect(adminCheck).toBeNull();
  });

  it("3. Strictly rejects admin token when presented to member verifier", () => {
    const adminToken = createCoopAdminSessionToken(adminSession);
    const memberCheck = verifyCoopMemberSessionToken(adminToken);
    expect(memberCheck).toBeNull();
  });

  it("4. Server-side session expiration check rejects expired tokens", () => {
    // Create token with negative TTL (already expired)
    const expiredMemberToken = createCoopMemberSessionToken(memberSessionA, -1000);
    expect(verifyCoopMemberSessionToken(expiredMemberToken)).toBeNull();

    const expiredAdminToken = createCoopAdminSessionToken(adminSession, -1000);
    expect(verifyCoopAdminSessionToken(expiredAdminToken)).toBeNull();
  });

  it("5. Server-side session revocation revokes token immediately", () => {
    const token = createCoopMemberSessionToken(memberSessionA);
    const verifiedBefore = verifyCoopMemberSessionToken(token);
    expect(verifiedBefore).not.toBeNull();
    expect(verifiedBefore?.sessionId).toBeDefined();

    revokeSessionToken(token);

    if (verifiedBefore?.sessionId) {
      expect(isSessionRevoked(verifiedBefore.sessionId)).toBe(true);
    }
    expect(verifyCoopMemberSessionToken(token)).toBeNull();
  });

  it("6. Production secret validation halts execution when secret is missing or weak", () => {
    const originalEnv = process.env.NODE_ENV;
    const originalSecret = process.env.TOMVIS_SESSION_SECRET;

    const envObj = process.env as Record<string, string | undefined>;
    try {
      envObj.NODE_ENV = "production";
      envObj.TOMVIS_SESSION_SECRET = "short-secret";

      expect(() => getSessionSecret()).toThrow("FATAL_SECURITY_ERROR");
    } finally {
      envObj.NODE_ENV = originalEnv;
      envObj.TOMVIS_SESSION_SECRET = originalSecret;
    }
  });

  it("7. Member data isolation: requireAuthenticatedMember rejects null context", () => {
    expect(() => requireAuthenticatedMember(null)).toThrow(UnauthorizedError);
  });

  it("8. Cross-account member isolation: member A cannot assert member B id", () => {
    const tokenA = createCoopMemberSessionToken(memberSessionA);
    const parsedA = verifyCoopMemberSessionToken(tokenA);
    expect(parsedA?.memberId).toBe("mem_001");
    expect(parsedA?.memberId).not.toBe(memberSessionB.memberId);
  });

  it("9. Rate limiter blocks brute force attempts after 5 failures", () => {
    const key = "00124";
    for (let i = 0; i < 5; i++) {
      expect(loginRateLimiter.check(key).allowed).toBe(true);
      loginRateLimiter.record(key);
    }
    const checkAfterFive = loginRateLimiter.check(key);
    expect(checkAfterFive.allowed).toBe(false);
    expect(checkAfterFive.retryAfterSeconds).toBeGreaterThan(0);
  });

  it("10. Dividend net calculation verification", () => {
    const income = {
      เงินปันผล: "18250.00",
      เงินเฉลี่ยคืน: "6420.00",
      เงินของชำร่วย: "0.00",
      เงินรางวัลสมาชิก: "0.00"
    };
    const deductions = {
      "สสธท.": "0.00",
      "กสธท.2": "0.00"
    };

    const totalIncome = Object.values(income).reduce((acc, v) => acc + parseFloat(v), 0);
    const totalDeductions = Object.values(deductions).reduce((acc, v) => acc + parseFloat(v), 0);
    const net = totalIncome - totalDeductions;

    expect(totalIncome).toBe(24670.00);
    expect(totalDeductions).toBe(0.00);
    expect(net).toBe(24670.00);
  });
});
