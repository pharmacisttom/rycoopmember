import { z } from "zod";

export const memberProfileUpdateSchema = z.object({
  phone: z.string().min(8).max(30),
  email: z.string().email(),
  address: z.string().min(10).max(500),
  emergencyContact: z.string().min(8).max(200),
  avatarFileName: z.string().max(180).optional(),
  note: z.string().max(1000).optional()
});

export type MemberProfileUpdateInput = z.infer<typeof memberProfileUpdateSchema>;
