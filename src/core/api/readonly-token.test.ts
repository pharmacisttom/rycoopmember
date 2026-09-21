import { describe, expect, it } from "vitest";
import { createHash } from "node:crypto";
import { verifyReadonlyApiToken } from "./readonly-token";

describe("readonly api token", () => {
  it("accepts a matching bearer token", () => {
    const token = "valid-token-for-test";
    process.env.WEB_READONLY_API_TOKEN_HASH = createHash("sha256").update(token).digest("hex");
    const request = new Request("https://example.test/api", {
      headers: {
        authorization: `Bearer ${token}`
      }
    });

    expect(verifyReadonlyApiToken(request)).toBe(true);
    delete process.env.WEB_READONLY_API_TOKEN_HASH;
  });

  it("rejects missing or invalid tokens", () => {
    expect(verifyReadonlyApiToken(new Request("https://example.test/api"))).toBe(false);
    expect(
      verifyReadonlyApiToken(
        new Request("https://example.test/api", {
          headers: { "x-api-token": "invalid" }
        })
      )
    ).toBe(false);
  });
});
