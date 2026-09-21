import { z } from "zod";

export const memberLoginSchema = z.object({
  memberNo: z.string().min(3).max(30),
  citizenId: z.string().min(10).max(20),
  phoneVerificationCode: z.string().min(8).max(30)
});

export type MemberLoginInput = z.infer<typeof memberLoginSchema>;
