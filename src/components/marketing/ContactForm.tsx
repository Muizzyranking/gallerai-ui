"use client";

import { useState } from "react";
import { z } from "zod";
import Select from "@/components/ui/Select";
import { site } from "@/content/site";

const contactSchema = z.object({
  name: z.string().trim().min(2, "Tell us your name (2+ characters).").max(80, "Keep it under 80 characters."),
  email: z.string().trim().min(1, "Enter your email address.").email("Enter a valid email address.").max(254, "That email looks too long."),
  topic: z.string().min(1, "Pick a topic."),
  message: z.string().trim().min(20, "Give us a little more detail (20+ characters).").max(2000, "Keep it under 2000 characters."),
});

type ContactValues = z.infer<typeof contactSchema>;
type ContactErrors = Partial<Record<keyof ContactValues, string>>;

const TOPICS = ["Planning an event", "Photographer workflow", "Venues & seasons", "Support", "Privacy & data", "Something else"];

/* No backend yet: submit opens the visitor's mail app with a prefilled
   message to the editable contact address, then shows confirmation. */
export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", topic: TOPICS[0], message: "" });
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [sent, setSent] = useState(false);

  const update = <K extends keyof ContactValues>(key: K, value: string) => {
    const next = { ...form, [key]: value };
    setForm(next);
    if (!submitted && !errors[key]) return;
    const result = contactSchema.safeParse(next);
    const fieldError = result.success ? undefined : result.error.issues.find((i) => String(i.path[0]) === key)?.message;
    setErrors((prev) => ({ ...prev, [key]: fieldError }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const next: ContactErrors = {};
      for (const issue of result.error.issues) {
        const key = String(issue.path[0]) as keyof ContactValues;
        next[key] ??= issue.message;
      }
      setErrors(next);
      return;
    }
    setErrors({});
    const subject = encodeURIComponent(`[${form.topic}] ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${site.contactEmail}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  if (sent) {
    return (
      <div className="card fade-in" style={{ padding: "36px 32px", textAlign: "center" }}>
        <span
          aria-hidden="true"
          style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: "var(--leaf-soft)",
            color: "var(--leaf)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 18,
            fontSize: "1.5rem",
            fontWeight: 800,
          }}
        >
          ✓
        </span>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 800, marginBottom: 10 }}>Message ready in your mail app</h2>
        <p className="body-text" style={{ marginBottom: 6 }}>
          Your mail app should have opened with everything prefilled to <strong style={{ color: "var(--ink)" }}>{site.contactEmail}</strong>. Just hit
          send.
        </p>
        <p className="small-text">Nothing opened? Write to us directly at {site.contactEmail}.</p>
      </div>
    );
  }

  const input = (key: keyof ContactValues) => ({
    "aria-invalid": !!errors[key],
    "aria-describedby": errors[key] ? `contact-${key}-error` : undefined,
  });

  return (
    <form onSubmit={onSubmit} noValidate className="card" style={{ padding: "32px 30px", display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }} className="contact-row">
        <div>
          <label htmlFor="contact-name" className="field-label">
            Your name
          </label>
          <input
            id="contact-name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Ada Okafor"
            className="field-input"
            {...input("name")}
          />
          {errors.name && (
            <p id="contact-name-error" role="alert" className="field-error" style={{ marginTop: 8 }}>
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label htmlFor="contact-email" className="field-label">
            Email
          </label>
          <input
            id="contact-email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            className="field-input"
            {...input("email")}
          />
          {errors.email && (
            <p id="contact-email-error" role="alert" className="field-error" style={{ marginTop: 8 }}>
              {errors.email}
            </p>
          )}
        </div>
      </div>

      <Select id="contact-topic" label="What is this about?" value={form.topic} options={TOPICS} onChange={(v) => update("topic", v)} />

      <div>
        <label htmlFor="contact-message" className="field-label">
          Message
        </label>
        <textarea
          id="contact-message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us your event date, guest count, and what you need…"
          className="field-input"
          rows={5}
          style={{ resize: "vertical", minHeight: 130 }}
          {...input("message")}
        />
        {errors.message ? (
          <p id="contact-message-error" role="alert" className="field-error" style={{ marginTop: 8 }}>
            {errors.message}
          </p>
        ) : (
          <p className="field-help">Event date, guest count, and anything about photographers or access codes.</p>
        )}
      </div>

      <button type="submit" className="btn-primary" style={{ width: "100%" }}>
        Send message
      </button>

      <style>{`
        @media (max-width: 640px) {
          .contact-row { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </form>
  );
}
