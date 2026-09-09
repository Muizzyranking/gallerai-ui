import { useState } from "react";
import type { z } from "zod";
import { type FieldErrors, validateFields } from "@/lib/auth-schemas";

export function useAuthForm<T extends Record<string, string>>(
  schema: z.ZodType<T>,
  initial: T,
  normalize: (values: T) => T = (v) => v,
) {
  const [form, setForm] = useState<T>(initial);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (key: keyof T, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (!submitted && !fieldErrors[key as string]) return;
    const errors = validateFields(schema, normalize(next)) ?? {};
    setFieldErrors((prev) => ({ ...prev, [key]: errors[key as string] }));
  };

  const validateAll = () => {
    setSubmitted(true);
    const errors = validateFields(schema, normalize(form));
    setFieldErrors(errors ?? {});
    return errors;
  };

  return { form, setForm, fieldErrors, apiError, setApiError, loading, setLoading, update, validateAll };
}
