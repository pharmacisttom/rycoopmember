import { describe, expect, it } from "vitest";
import { CoopMemberAuthService } from "./member-auth-service";

describe("CoopMemberAuthService", () => {
  it("allows login with member number, citizen id, and current phone", async () => {
    const session = await new CoopMemberAuthService().login({
      memberNo: "RYS-001245",
      citizenId: "1234567890456",
      phoneVerificationCode: "0899994821"
    });

    expect(session.memberId).toBe("member_demo_001");
    expect(session.memberNo).toBe("RYS-001245");
  });

  it("rejects login when phone verification does not match", async () => {
    await expect(
      new CoopMemberAuthService().login({
        memberNo: "RYS-001245",
        citizenId: "1234567890456",
        phoneVerificationCode: "0800000000"
      })
    ).rejects.toThrow("INVALID_MEMBER_LOGIN");
  });
});
