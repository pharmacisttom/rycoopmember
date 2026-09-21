import { describe, expect, it } from "vitest";
import { maskBankAccount, maskCitizenId } from "./masking";

describe("PII masking", () => {
  it("masks Thai citizen id with only safe digits visible", () => {
    expect(maskCitizenId("1234567890456")).toBe("1-XXXX-XXXXX-45-6");
  });

  it("masks bank account numbers", () => {
    expect(maskBankAccount("1234567890")).toBe("XXX-X-56789-0");
  });
});
