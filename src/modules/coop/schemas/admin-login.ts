import { z } from "zod";

export const adminLoginSchema = z.object({
  username: z.string().min(3).max(80),
  password: z.string().min(8).max(120)
});

export type AdminLoginInput = z.infer<typeof adminLoginSchema>;
