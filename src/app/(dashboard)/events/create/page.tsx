"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field, PageHeader, Toggle } from "@/components/dashboard/primitives";
import Button from "@/components/ui/custom-button";
import { DatePicker, TimePicker } from "@/components/ui/DatePicker";
import { type AccessMode, ApiError, type CreateEventPayload, events as eventsApi, pickFieldError } from "@/lib/api";

export default function CreateEventPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

  const [showSettings, setShowSettings] = useState(false);
  const [allowAttendeeUploads, setAllowAttendeeUploads] = useState(false);
  const [requireApproval, setRequireApproval] = useState(true);
  const [downloadsEnabled, setDownloadsEnabled] = useState(true);
  const [galleryVisible, setGalleryVisible] = useState(true);

  const mutation = useMutation({
    mutationFn: (payload: CreateEventPayload) => eventsApi.create(payload),
    onSuccess: (event) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      router.push(`/events/${event.id}/upload`);
    },
    onError: (err) => {
      if (err instanceof ApiError && err.hasFieldErrors) {
        setFieldErrors(err.fieldErrors);
        // Keep the server message as a summary so the form is never silent.
        setApiError(err.message);
      } else {
        setFieldErrors({});
        setApiError(err instanceof ApiError ? err.message : "Something went wrong.");
      }
    },
  });

  const titleError = pickFieldError(fieldErrors, "title");
  const descriptionError = pickFieldError(fieldErrors, "description");
  const dateError = pickFieldError(fieldErrors, "event_date", "date");
  const accessCodeError = pickFieldError(fieldErrors, "access_code", "code");
  const unmappedErrors = Object.entries(fieldErrors).filter(
    ([k, v]) =>
      v &&
      k !== "title" &&
      k !== "description" &&
      k !== "event_date" &&
      k !== "date" &&
      k !== "access_code" &&
      k !== "code" &&
      !k.endsWith(".title") &&
      !k.endsWith(".description") &&
      !k.endsWith(".event_date") &&
      !k.endsWith(".access_code"),
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setFieldErrors({});
    if (!title.trim()) {
      setFieldErrors({ title: "Event name is required." });
      return;
    }
    mutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      event_date: date ? new Date(`${date}T${time || "00:00"}:00`).toISOString() : undefined,
      access_config: {
        access_mode: isPrivate ? "private" : "public",
        access_code: isPrivate && accessCode.trim() ? accessCode.trim() : undefined,
      },
      settings: {
        allow_attendee_uploads: allowAttendeeUploads,
        require_upload_approval: requireApproval,
        downloads_enabled: downloadsEnabled,
        gallery_visible: galleryVisible,
      },
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <PageHeader eyebrow="New event" title="Create an event" backHref="/dashboard" backLabel="Back to dashboard" />
      <p
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "0 clamp(20px,4vw,44px)",
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "var(--ink-2)",
          lineHeight: 1.6,
        }}
      >
        Set the basics now — gallery settings stay tucked away until you need them.
      </p>

      <div style={{ maxWidth: 880, margin: "0 auto", padding: "28px clamp(20px,4vw,44px) 64px" }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <Field label="Event name">
            <input
              type="text"
              required
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setFieldErrors((p) => ({ ...p, title: undefined }));
              }}
              placeholder="e.g. Amara & Kofi Wedding 2024"
              className="field-input"
              aria-invalid={!!titleError}
              aria-describedby={titleError ? "create-title-error" : undefined}
            />
            {titleError && (
              <p
                id="create-title-error"
                role="alert"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--coral)", marginTop: 6 }}
              >
                {titleError}
              </p>
            )}
          </Field>

          <Field label="Description" hint="Optional — shown on the gallery page.">
            <textarea
              rows={3}
              value={description}
              onChange={(e) => {
                setDesc(e.target.value);
                setFieldErrors((p) => ({ ...p, description: undefined }));
              }}
              placeholder="Welcome to our gallery. Find your photos below."
              className="field-input"
              style={{ resize: "vertical", lineHeight: 1.6 }}
              aria-invalid={!!descriptionError}
              aria-describedby={descriptionError ? "create-desc-error" : undefined}
            />
            {descriptionError && (
              <p
                id="create-desc-error"
                role="alert"
                style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--coral)", marginTop: 6 }}
              >
                {descriptionError}
              </p>
            )}
          </Field>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Event date">
              <DatePicker value={date} onChange={setDate} />
              {dateError && (
                <p
                  role="alert"
                  style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--coral)", marginTop: 6 }}
                >
                  {dateError}
                </p>
              )}
            </Field>
            <Field label="Event time" hint="Optional">
              <TimePicker value={time} onChange={setTime} />
            </Field>
          </div>

          <div>
            <div
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.88rem",
                fontWeight: 600,
                color: "var(--ink)",
                marginBottom: 12,
              }}
            >
              Access
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(
                [
                  { mode: "public", title: "Public", desc: "Anyone with the link can view" },
                  { mode: "private", title: "Private", desc: "Guests need the access code" },
                ] as { mode: AccessMode; title: string; desc: string }[]
              ).map((opt) => (
                <button
                  key={opt.mode}
                  type="button"
                  onClick={() => setIsPrivate(opt.mode === "private")}
                  aria-pressed={(opt.mode === "private") === isPrivate}
                  style={{
                    padding: "14px 16px",
                    borderRadius: 8,
                    cursor: "pointer",
                    textAlign: "left",
                    borderWidth: 1,
                    borderStyle: "solid",
                    transition: "all 0.15s",
                    borderColor:
                      (opt.mode === "private") === isPrivate ? "rgba(255,107,107,0.5)" : "var(--rule-strong)",
                    background: (opt.mode === "private") === isPrivate ? "var(--coral-subtle)" : "var(--bg-2)",
                  }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                      color: "var(--ink)",
                      marginBottom: 4,
                    }}
                  >
                    {opt.title}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "var(--ink-2)",
                      lineHeight: 1.4,
                    }}
                  >
                    {opt.desc}
                  </div>
                </button>
              ))}
            </div>

            {isPrivate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.22 }}
                style={{ overflow: "hidden" }}
              >
                <div style={{ paddingTop: 20 }}>
                  <Field
                    label="Access code"
                    hint="Optional — leave blank and a code is generated when the event is created."
                  >
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value);
                        setFieldErrors((p) => ({ ...p, access_code: undefined }));
                      }}
                      placeholder="e.g. KOFI2024"
                      className="field-input"
                      style={{ fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                      aria-invalid={!!accessCodeError}
                    />
                    {accessCodeError && (
                      <p
                        role="alert"
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.82rem",
                          color: "var(--coral)",
                          marginTop: 6,
                        }}
                      >
                        {accessCodeError}
                      </p>
                    )}
                  </Field>
                </div>
              </motion.div>
            )}
          </div>

          <div className="card" style={{ overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => setShowSettings((s) => !s)}
              aria-expanded={showSettings}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
                padding: "18px 20px",
                textAlign: "left",
              }}
            >
              <span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.92rem",
                    fontWeight: 700,
                    color: "var(--ink)",
                  }}
                >
                  Gallery settings
                </span>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    color: "var(--ink-2)",
                    marginTop: 2,
                  }}
                >
                  {allowAttendeeUploads ? "Guest uploads on" : "Guest uploads off"} ·{" "}
                  {downloadsEnabled ? "Downloads on" : "Downloads off"} ·{" "}
                  {galleryVisible ? "Gallery visible" : "Gallery hidden"}
                </span>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                style={{
                  flexShrink: 0,
                  color: "var(--ink-3)",
                  transform: showSettings ? "rotate(180deg)" : "none",
                  transition: "transform 0.2s ease",
                }}
              >
                <path d="m4 6 4 4 4-4" />
              </svg>
            </button>
            <div className={`settings-panel${showSettings ? " settings-panel-open" : ""}`}>
              <div style={{ overflow: "hidden" }}>
                <div
                  style={{
                    padding: "4px 20px 20px",
                    borderTopWidth: 1,
                    borderTopStyle: "solid",
                    borderTopColor: "var(--line)",
                  }}
                >
                  <Toggle
                    label="Allow attendee uploads"
                    desc="Guests can upload their own photos to this event."
                    checked={allowAttendeeUploads}
                    onChange={setAllowAttendeeUploads}
                  />
                  {allowAttendeeUploads && (
                    <Toggle
                      label="Require upload approval"
                      desc="Attendee photos need your approval before appearing in the gallery."
                      checked={requireApproval}
                      onChange={setRequireApproval}
                    />
                  )}
                  <Toggle
                    label="Enable downloads"
                    desc="Guests can download photos from this event."
                    checked={downloadsEnabled}
                    onChange={setDownloadsEnabled}
                  />
                  <Toggle
                    label="Gallery visible"
                    desc="The gallery page is accessible to attendees."
                    checked={galleryVisible}
                    onChange={setGalleryVisible}
                  />
                </div>
              </div>
            </div>
          </div>

          {apiError && (
            <div
              role="alert"
              style={{
                padding: "12px 16px",
                background: "rgba(255,107,107,0.08)",
                borderWidth: 1,
                borderStyle: "solid",
                borderColor: "rgba(255,107,107,0.28)",
                borderRadius: 6,
                fontFamily: "var(--font-body)",
                fontSize: "0.9rem",
                color: "var(--coral)",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: unmappedErrors.length > 0 ? 6 : 0 }}>{apiError}</div>
              {unmappedErrors.length > 0 && (
                <ul style={{ margin: 0, paddingLeft: 18, lineHeight: 1.6 }}>
                  {unmappedErrors.map(([field, msg]) => (
                    <li key={field}>
                      <strong style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem" }}>{field}</strong>: {msg}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Button type="submit" disabled={mutation.isPending || !title.trim()} variant="primary" className="flex-1">
              {mutation.isPending ? "Creating your event…" : "Create event →"}
            </Button>
            <Link
              href="/dashboard"
              className="btn-ghost"
              style={{ flex: 1, justifyContent: "center", minWidth: 120, display: "inline-flex", alignItems: "center" }}
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
      <style>{`
        .settings-panel {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition: grid-template-rows 0.32s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease;
        }
        .settings-panel-open {
          grid-template-rows: 1fr;
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .settings-panel { transition: none; }
        }
      `}</style>
    </div>
  );
}
