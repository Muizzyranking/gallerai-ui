// create event
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { events as eventsApi, type CreateEventPayload, type AccessMode, ApiError } from "@/lib/api";

/* ── Primitives ──────────────────────────────────────────── */
const inputStyle: React.CSSProperties = {
  width: "100%", background: "var(--bg-2)",
  borderWidth: 1, borderStyle: "solid", borderColor: "var(--rule-strong)",
  borderRadius: 6, padding: "13px 16px",
  fontFamily: "var(--font-body)", fontSize: "0.95rem", color: "var(--ink)",
  outline: "none", transition: "border-color 0.18s",
};
const focus = (el: HTMLElement) => (el.style.borderColor = "rgba(255,107,107,0.55)");
const blur  = (el: HTMLElement) => (el.style.borderColor = "var(--rule-strong)");

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      <label style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)" }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)", lineHeight: 1.5 }}>{hint}</span>}
    </div>
  );
}

function Toggle({ label, desc, checked, onChange }: { label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, padding: "14px 0", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)" }}>
      <div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 500, color: "var(--ink)", marginBottom: 3 }}>{label}</div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)", lineHeight: 1.5 }}>{desc}</div>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        style={{
          width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
          background: checked ? "var(--coral)" : "var(--bg-3)",
          position: "relative", flexShrink: 0, transition: "background 0.2s",
        }}
      >
        <div style={{
          width: 18, height: 18, borderRadius: "50%", background: "#fff",
          position: "absolute", top: 3, transition: "left 0.2s",
          left: checked ? 22 : 3,
          boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
        }}/>
      </button>
    </div>
  );
}

/* ── Invite tags ─────────────────────────────────────────── */
function InviteInput({ emails, onChange }: { emails: string[]; onChange: (e: string[]) => void }) {
  const [input, setInput] = useState("");
  const [err,   setErr]   = useState("");

  const add = () => {
    const v = input.trim().toLowerCase();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr("Invalid email"); return; }
    if (emails.includes(v)) { setErr("Already added"); return; }
    onChange([...emails, v]);
    setInput(""); setErr("");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="email" value={input} placeholder="guest@example.com"
          onChange={e => { setInput(e.target.value); setErr(""); }}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          style={{ ...inputStyle, flex: 1 }}
          onFocus={e => focus(e.target as HTMLElement)}
          onBlur={e  => blur(e.target as HTMLElement)}
        />
        <button type="button" onClick={add} className="btn-ghost" style={{ padding: "12px 18px", whiteSpace: "nowrap" }}>
          Add
        </button>
      </div>
      {err && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--coral)", marginTop: 6 }}>{err}</p>}
      {emails.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {emails.map(em => (
            <div key={em} style={{
              display: "flex", alignItems: "center", gap: 7,
              background: "var(--bg-3)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--rule-strong)",
              borderRadius: 99, padding: "5px 12px 5px 14px",
              fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink)",
            }}>
              {em}
              <button type="button" onClick={() => onChange(emails.filter(x => x !== em))}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 0, display: "flex" }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <path d="M2 2l7 7M9 2L2 9"/>
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function CreateEventPage() {
  const router = useRouter();
  const qc     = useQueryClient();

  const [title,       setTitle]       = useState("");
  const [description, setDesc]        = useState("");
  const [date,        setDate]        = useState("");
  const [time,        setTime]        = useState("");
  const [isPrivate,   setIsPrivate]   = useState(false);
  const [accessCode,  setAccessCode]  = useState("");
  const [invites,     setInvites]     = useState<string[]>([]);
  const [apiError,    setApiError]    = useState("");

  // Event settings
  const [allowAttendeeUploads, setAllowAttendeeUploads]  = useState(false);
  const [requireApproval,      setRequireApproval]        = useState(true);
  const [downloadsEnabled,     setDownloadsEnabled]       = useState(true);
  const [galleryVisible,       setGalleryVisible]         = useState(true);

  const mutation = useMutation({
    mutationFn: (payload: CreateEventPayload) => eventsApi.create(payload),
    onSuccess: (event) => {
      qc.invalidateQueries({ queryKey: ["events"] });
      router.push(`/events/${event.id}/upload`);
    },
    onError: (err) => {
      setApiError(err instanceof ApiError ? err.message : "Something went wrong.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!title.trim()) return;

    const payload: CreateEventPayload = {
      title:       title.trim(),
      description: description.trim() || undefined,
      event_date:  date ? new Date(`${date}T${time || "00:00"}:00`).toISOString() : undefined,
      access_config: {
        access_mode:  isPrivate ? "private" : "link",
        access_code:  isPrivate && accessCode.trim() ? accessCode.trim() : undefined,
      },
      settings: {
        allow_attendee_uploads:  allowAttendeeUploads,
        require_upload_approval: requireApproval,
        downloads_enabled:       downloadsEnabled,
        gallery_visible:         galleryVisible,
      },
    };

    mutation.mutate(payload);
  };

  const PAD = "clamp(20px, 4vw, 44px)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: `40px ${PAD} 28px`, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)" }}>
        <Link href="/dashboard"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--ink-2)", textDecoration: "none", marginBottom: 24, transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M11 7H3M6 3L2 7l4 4"/>
          </svg>
          Back to dashboard
        </Link>
        <p className="label-coral" style={{ marginBottom: 8 }}>New event</p>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 600, color: "var(--ink)", lineHeight: 1 }}>
          Create an event
        </h1>
      </div>

      {/* Form */}
      <div style={{ padding: `36px ${PAD}`, maxWidth: 660 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>

          {/* Name */}
          <Field label="Event name">
            <input type="text" required value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="e.g. Amara & Kofi Wedding 2024"
              style={inputStyle}
              onFocus={e => focus(e.target as HTMLElement)}
              onBlur={e  => blur(e.target as HTMLElement)}
            />
          </Field>

          {/* Description */}
          <Field label="Description" hint="Optional — shown on the gallery page.">
            <textarea rows={3} value={description}
              onChange={e => setDesc(e.target.value)}
              placeholder="Welcome to our gallery. Find your photos below."
              style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
              onFocus={e => focus(e.target as HTMLElement)}
              onBlur={e  => blur(e.target as HTMLElement)}
            />
          </Field>

          {/* Date + time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            <Field label="Event date">
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                style={inputStyle}
                onFocus={e => focus(e.target as HTMLElement)}
                onBlur={e  => blur(e.target as HTMLElement)}
              />
            </Field>
            <Field label="Event time" hint="Optional">
              <input type="time" value={time} onChange={e => setTime(e.target.value)}
                style={inputStyle}
                onFocus={e => focus(e.target as HTMLElement)}
                onBlur={e  => blur(e.target as HTMLElement)}
              />
            </Field>
          </div>

          {/* ── Access ── */}
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)", marginBottom: 12 }}>
              Access
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {(["link", "private"] as AccessMode[]).map(mode => (
                <button key={mode} type="button"
                  onClick={() => setIsPrivate(mode === "private")}
                  style={{
                    padding: "14px 16px", borderRadius: 8, cursor: "pointer", textAlign: "left",
                    borderWidth: 1, borderStyle: "solid", transition: "all 0.15s",
                    borderColor: (mode === "private") === isPrivate ? "rgba(255,107,107,0.5)" : "var(--rule-strong)",
                    background:  (mode === "private") === isPrivate ? "var(--coral-subtle)" : "var(--bg-2)",
                  }}
                >
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                    {mode === "link" ? "Public" : "Private"}
                  </div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)", lineHeight: 1.4 }}>
                    {mode === "link" ? "Anyone with the link can view" : "Requires access code or invite"}
                  </div>
                </button>
              ))}
            </div>

            {isPrivate && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                transition={{ duration: 0.22 }} style={{ overflow: "hidden" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingTop: 20 }}>
                  <Field label="Access code" hint="Leave blank to rely on email invites only.">
                    <input type="text" value={accessCode}
                      onChange={e => setAccessCode(e.target.value)}
                      placeholder="e.g. KOFI2024"
                      style={{ ...inputStyle, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                      onFocus={e => focus(e.target as HTMLElement)}
                      onBlur={e  => blur(e.target as HTMLElement)}
                    />
                  </Field>
                  <Field label="Invite guests by email" hint="Invited guests bypass the access code.">
                    <InviteInput emails={invites} onChange={setInvites} />
                  </Field>
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Settings ── */}
          <div>
            <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
              Gallery settings
            </div>
            <div style={{ borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "var(--rule)" }}>
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

          {/* Error */}
          {apiError && (
            <div style={{ padding: "12px 16px", background: "rgba(255,107,107,0.08)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,107,107,0.28)", borderRadius: 6, fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--coral)" }}>
              {apiError}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button type="submit" disabled={mutation.isPending || !title.trim()} className="btn-primary"
              style={{ flex: 1, justifyContent: "center", minWidth: 160, opacity: mutation.isPending || !title.trim() ? 0.6 : 1 }}>
              {mutation.isPending ? "Creating…" : "Create event →"}
            </button>
            <Link href="/dashboard" className="btn-ghost" style={{ flex: 1, justifyContent: "center", minWidth: 120 }}>
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
