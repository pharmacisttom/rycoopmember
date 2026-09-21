import { describe, expect, it } from "vitest";
import { assetBeneficiaryAssignmentSchema } from "./asset-beneficiary";

describe("asset beneficiary assignment schema", () => {
  it("accepts a valid allocation request", () => {
    const result = assetBeneficiaryAssignmentSchema.safeParse({
      beneficiaryFullName: "นางสาวสมใจ ใจดี",
      relationship: "บุตร",
      citizenId: "1234567890123",
      phone: "0891112222",
      address: "อำเภอเมืองระยอง จังหวัดระยอง",
      witnessName: "นายวิชัย แสงดี",
      allocations: [
        { assetType: "SHARES", assetLabel: "หุ้นสะสม", percent: 60 },
        { assetType: "DEPOSITS", assetLabel: "เงินฝาก", percent: 40 }
      ]
    });

    expect(result.success).toBe(true);
  });

  it("rejects allocations over 100 percent", () => {
    const result = assetBeneficiaryAssignmentSchema.safeParse({
      beneficiaryFullName: "นางสาวสมใจ ใจดี",
      relationship: "บุตร",
      citizenId: "1234567890123",
      phone: "0891112222",
      address: "อำเภอเมืองระยอง จังหวัดระยอง",
      witnessName: "นายวิชัย แสงดี",
      allocations: [
        { assetType: "SHARES", assetLabel: "หุ้นสะสม", percent: 70 },
        { assetType: "DEPOSITS", assetLabel: "เงินฝาก", percent: 40 }
      ]
    });

    expect(result.success).toBe(false);
  });
});
