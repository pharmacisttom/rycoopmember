import { z } from "zod";

export const assetBeneficiaryAllocationSchema = z.object({
  assetType: z.enum(["SHARES", "DEPOSITS", "DIVIDEND", "PATRONAGE_REFUND", "WELFARE", "OTHER"]),
  assetLabel: z.string().min(2).max(120),
  percent: z.coerce.number().min(1).max(100),
  note: z.string().max(500).optional()
});

export const assetBeneficiaryAssignmentSchema = z
  .object({
    beneficiaryFullName: z.string().min(3).max(180),
    relationship: z.string().min(2).max(80),
    citizenId: z.string().min(10).max(20),
    phone: z.string().min(8).max(30),
    address: z.string().min(10).max(500),
    witnessName: z.string().min(3).max(180),
    allocations: z.array(assetBeneficiaryAllocationSchema).min(1).max(8)
  })
  .superRefine((value, context) => {
    const totalPercent = value.allocations.reduce((sum, item) => sum + item.percent, 0);

    if (totalPercent > 100) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["allocations"],
        message: "Allocation percent must not exceed 100"
      });
    }
  });

export type AssetBeneficiaryAssignmentInput = z.infer<typeof assetBeneficiaryAssignmentSchema>;
