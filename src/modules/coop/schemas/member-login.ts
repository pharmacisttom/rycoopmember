import { z } from "zod";
export const memberLoginSchema = z.object({
  username: z.string().regex(/^\d{13}$/, "กรุณาระบุเลขบัตรประชาชน 13 หลัก"),
  password: z.string().min(1).max(200)
});
export type MemberLoginInput = z.infer<typeof memberLoginSchema>;
