import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(2).max(50).email({ message: "Invalid email address" }),
  password: z.string().min(6).max(50),
});

export type LoginType = z.infer<typeof loginSchema>;
