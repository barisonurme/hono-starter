import { z } from "zod";

export const verifyEmailSchema = z.object({
  email: z.email(),
  code: z.string().length(6, "Verification code must be 6 digits"),
});

export const confirmLoginSchema = z.object({
  email: z.email(),
  code: z.string().length(6, "Login code must be 6 digits"),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;
export type ConfirmLoginInput = z.infer<typeof confirmLoginSchema>;
