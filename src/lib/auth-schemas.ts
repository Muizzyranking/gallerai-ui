import { z } from "zod";


const emailField = z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address.").max(254, "That email looks too long.");

const passwordField = z
  .string()
  .min(8, "Use at least 8 characters.")
  .max(128, "Use at most 128 characters.")
  .regex(/[A-Z]/, "Include at least one uppercase letter.")
  .regex(/\d/, "Include at least one number.");

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Enter your password."),
});

export const registerSchema = z.object({
  display_name: z.string().trim().min(2, "Use at least 2 characters.").max(80, "Keep it under 80 characters."),
  email: emailField,
  password: passwordField,
});

export const forgotPasswordSchema = z.object({
  email: emailField,
});

export const resendVerificationSchema = z.object({
  email: emailField,
});

export const resetPasswordSchema = z
  .object({
    password: passwordField,
    confirm: z.string().min(1, "Confirm your new password."),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match yet.",
    path: ["confirm"],
  });

export type FieldErrors = Record<string, string | undefined>;

/** Validate `values` against `schema`; returns field-keyed errors or null. */
export function validateFields<T>(schema: z.ZodType<T>, values: unknown): FieldErrors | null {
  const result = (schema as z.ZodType<unknown>).safeParse(values);
  if (result.success) return null;
  const errors: FieldErrors = {};
  for (const issue of result.error.issues) {
    const key = String(issue.path[0] ?? "form");
    errors[key] ??= issue.message;
  }
  return errors;
}
