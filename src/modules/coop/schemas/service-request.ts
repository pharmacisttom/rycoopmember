import { z } from "zod";

export const serviceRequestSchema = z.object({
  type: z.enum([
    "PROFILE_CHANGE",
    "BANK_ACCOUNT_CHANGE",
    "STATEMENT",
    "CERTIFICATE",
    "BENEFICIARY_CHANGE",
    "LOAN_DOCUMENT",
    "WELFARE",
    "PAYMENT_ISSUE",
    "DIVIDEND_INQUIRY",
    "LOAN_INQUIRY",
    "SHARE_INQUIRY",
    "DEPOSIT_INQUIRY",
    "GENERAL"
  ]),
  subject: z.string().min(5).max(180),
  message: z.string().min(10).max(5000)
});

export type ServiceRequestInput = z.infer<typeof serviceRequestSchema>;
