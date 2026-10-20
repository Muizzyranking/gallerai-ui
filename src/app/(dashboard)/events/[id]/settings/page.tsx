"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ConfirmModal,
  DangerZone,
  Field,
  PageHeader,
  PageSpinner,
  SectionCard,
  Toast,
  Toggle,
} from "@/components/dashboard/primitives";
import ManageCard from "@/components/settings/ManageCard";
import MemberRoster from "@/components/settings/MemberRoster";
import ShareCard from "@/components/settings/ShareCard";
import Button from "@/components/ui/custom-button";
import { DatePicker, TimePicker } from "@/components/ui/DatePicker";
import { type AccessMode, ApiError, events as eventsApi, pickFieldError, type UpdateEventPayload } from "@/lib/api";

export default function EventSettingsPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const qc = useQueryClient();

  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const [apiError, setApiError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

  const [title, setTitle] = useState("");
  const [description, setDesc] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [accessCode, setAccessCode] = useState("");
  const [allowUploads, setAllowUploads] = useState(false);
  const [reqApproval, setReqApproval] = useState(true);
  const [dlEnabled, setDlEnabled] = useState(true);
  const [galleryVis, setGalleryVis] = useState(true);

  const notify = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn: () => eventsApi.get(id),
  });

  useEffect(() => {
    if (!event) return;
    setTitle(event.title);
    setDesc(event.description ?? "");
    setIsPrivate(event.is_private);
    setAllowUploads(event.settings.allow_attendee_uploads);
    setReqApproval(event.settings.require_upload_approval);
    setDlEnabled(event.settings.downloads_enabled);
    setGalleryVis(event.settings.gallery_visible);
    if (event.event_date) {
      const d = new Date(event.event_date);
      setDate(d.toISOString().split("T")[0]);
      setTime(d.toTimeString().slice(0, 5));
    }
  }, [event]);

  const updateMutation = useMutation({
    mutationFn: (p: UpdateEventPayload) => eventsApi.update(id, p),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["event", id] });
      qc.invalidateQueries({ queryKey: ["events"] });
      setApiError("");
      setFieldErrors({});
      notify("Event updated.", "success");
    },
    onError: (err) => {
      const msg = err instanceof ApiError ? err.message : "Update failed.";
      if (err instanceof ApiError && err.hasFieldErrors) {
        setFieldErrors(err.fieldErrors);
        setApiError(msg);
      } else {
        setFieldErrors({});
        setApiError(msg);
      }
      notify(msg, "error");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => eventsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["events"] });
      router.push("/dashboard");
    },
    onError: (err) => notify(err instanceof ApiError ? err.message : "Delete failed.", "error"),
  });

  if (isLoading) return <PageSpinner />;
  if (!event) return null;

  const titleError = pickFieldError(fieldErrors, "title");
  const descriptionError = pickFieldError(fieldErrors, "description");
  const dateError = pickFieldError(fieldErrors, "event_date", "date");
  const accessCodeError = pickFieldError(fieldErrors, "access_code", "code");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    setFieldErrors({});
    if (!title.trim()) {
      setFieldErrors({ title: "Event name is required." });
      return;
    }
    updateMutation.mutate({
      title: title.trim(),
      description: description.trim() || undefined,
      event_date: date ? new Date(`${date}T${time || "00:00"}:00`).toISOString() : undefined,
      access_config: {
        access_mode: isPrivate ? "private" : "public",
        access_code: isPrivate && accessCode.trim() ? accessCode.trim() : undefined,
      },
      settings: {
        allow_attendee_uploads: allowUploads,
        require_upload_approval: reqApproval,
        downloads_enabled: dlEnabled,
        gallery_visible: galleryVis,
      },
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <PageHeader
        eyebrow="Event settings"
        title={event.title}
        backHref="/dashboard"
        backLabel="Back to dashboard"
        actions={
          <>
            <Link href={`/events/${id}/upload`} className="btn-ghost" style={{ padding: "10px 18px" }}>
              Upload photos
            </Link>
            <Link href={`/events/${id}`} target="_blank" className="btn-primary" style={{ padding: "10px 18px" }}>
              View gallery ↗
            </Link>
          </>
        }
      />

      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "24px clamp(20px, 4vw, 44px) 64px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <ManageCard eventId={id} />

        <SectionCard title="Event details">
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Event name">
              <input
                type="text"
                required
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  setFieldErrors((p) => ({ ...p, title: undefined }));
                }}
                className="field-input"
                aria-invalid={!!titleError}
              />
              {titleError && (
                <p
                  role="alert"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    color: "var(--coral)",
                    marginTop: 6,
                  }}
                >
                  {titleError}
                </p>
              )}
            </Field>
            <Field label="Description">
              <textarea
                value={description}
                onChange={(e) => {
                  setDesc(e.target.value);
                  setFieldErrors((p) => ({ ...p, description: undefined }));
                }}
                rows={3}
                className="field-input"
                style={{ resize: "vertical", lineHeight: 1.6 }}
                aria-invalid={!!descriptionError}
              />
              {descriptionError && (
                <p
                  role="alert"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.82rem",
                    color: "var(--coral)",
                    marginTop: 6,
                  }}
                >
                  {descriptionError}
                </p>
              )}
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Date">
                <DatePicker value={date} onChange={setDate} />
                {dateError && (
                  <p
                    role="alert"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "0.82rem",
                      color: "var(--coral)",
                      marginTop: 6,
                    }}
                  >
                    {dateError}
                  </p>
                )}
              </Field>
              <Field label="Time" hint="Optional">
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
                  marginBottom: 10,
                }}
              >
                Access
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(
                  [
                    { mode: "public", title: "Public", desc: "Anyone with the link" },
                    { mode: "private", title: "Private", desc: "Code required" },
                  ] as { mode: AccessMode; title: string; desc: string }[]
                ).map((opt) => (
                  <button
                    key={opt.mode}
                    type="button"
                    onClick={() => setIsPrivate(opt.mode === "private")}
                    style={{
                      padding: "13px 15px",
                      borderRadius: 8,
                      cursor: "pointer",
                      textAlign: "left",
                      transition: "all 0.15s",
                      borderWidth: 1,
                      borderStyle: "solid",
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
                        marginBottom: 3,
                      }}
                    >
                      {opt.title}
                    </div>
                    <div
                      style={{
                        fontFamily: "var(--font-body)",
                        fontSize: "0.78rem",
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
                <div style={{ paddingTop: 16 }}>
                  <Field
                    label="Access code"
                    hint={
                      event.access_code
                        ? `Current code: ${event.access_code} — change it here or leave as-is.`
                        : "Leave blank and the backend generates one on save."
                    }
                  >
                    <input
                      type="text"
                      value={accessCode}
                      onChange={(e) => {
                        setAccessCode(e.target.value);
                        setFieldErrors((p) => ({ ...p, access_code: undefined }));
                      }}
                      placeholder={event.access_code ?? "e.g. KOFI2024"}
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
              )}
            </div>

            <div>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.88rem",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 4,
                }}
              >
                Gallery settings
              </div>
              <div style={{ borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "var(--rule)" }}>
                <Toggle
                  label="Allow attendee uploads"
                  desc="Guests can upload their own photos."
                  checked={allowUploads}
                  onChange={setAllowUploads}
                />
                {allowUploads && (
                  <Toggle
                    label="Require upload approval"
                    desc="Review attendee photos before they appear in the gallery."
                    checked={reqApproval}
                    onChange={setReqApproval}
                  />
                )}
                <Toggle
                  label="Enable downloads"
                  desc="Guests can download photos."
                  checked={dlEnabled}
                  onChange={setDlEnabled}
                />
                <Toggle
                  label="Gallery visible"
                  desc="The gallery page is accessible to attendees."
                  checked={galleryVis}
                  onChange={setGalleryVis}
                />
              </div>
            </div>

            <div>
              <Button type="submit" disabled={updateMutation.isPending} variant="primary">
                {updateMutation.isPending ? "Saving…" : "Save changes"}
              </Button>
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
                {apiError}
              </div>
            )}
          </form>
        </SectionCard>

        <MemberRoster eventId={id} notify={(msg, ok) => notify(msg, ok ? "success" : "error")} />

        <ShareCard eventId={id} accessCode={event.access_code} isPrivate={event.is_private} />

        <DangerZone
          title="Danger zone"
          body="Deleting this event permanently removes all photos and data. This cannot be undone."
          actionLabel="Delete this event"
          onAction={() => setConfirmDel(true)}
        />
      </div>

      {confirmDel && (
        <ConfirmModal
          title={`Delete "${event.title}"?`}
          body="This permanently deletes the event and all its photos. It cannot be undone."
          confirmLabel="Yes, delete"
          loading={deleteMutation.isPending}
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setConfirmDel(false)}
        />
      )}
      <Toast msg={toast?.msg ?? ""} type={toast?.type ?? "success"} />
    </div>
  );
}
