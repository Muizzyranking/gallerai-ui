"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { events as eventsApi, type UpdateEventPayload, type AccessMode, ApiError } from "@/lib/api";

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
      <label style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)" }}>{label}</label>
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
      <button type="button" onClick={() => onChange(!checked)} style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: checked ? "var(--coral)" : "var(--bg-3)",
        position: "relative", flexShrink: 0, transition: "background 0.2s",
      }}>
        <div style={{ width: 18, height: 18, borderRadius: "50%", background: "#fff", position: "absolute", top: 3, left: checked ? 22 : 3, transition: "left 0.2s", boxShadow: "0 1px 4px rgba(0,0,0,0.3)" }}/>
      </button>
    </div>
  );
}

function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <div style={{ background: "var(--bg-1)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--rule)", borderRadius: 10, overflow: "hidden" }}>
      <div style={{ padding: "18px 24px 14px", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)" }}>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "var(--ink)", marginBottom: desc ? 4 : 0 }}>{title}</h2>
        {desc && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink-2)" }}>{desc}</p>}
      </div>
      <div style={{ padding: "22px 24px" }}>{children}</div>
    </div>
  );
}

function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 12 }}
      style={{ position: "fixed", bottom: 24, right: 24, zIndex: 300, padding: "12px 18px", background: type === "success" ? "rgba(40,160,80,0.12)" : "rgba(255,107,107,0.1)", borderWidth: 1, borderStyle: "solid", borderColor: type === "success" ? "rgba(40,160,80,0.28)" : "rgba(255,107,107,0.28)", borderRadius: 7, fontFamily: "var(--font-body)", fontSize: "0.88rem", color: type === "success" ? "#5cc98b" : "var(--coral)", boxShadow: "0 8px 24px rgba(0,0,0,0.28)" }}>
      {msg}
    </motion.div>
  );
}

/* ── Invite input ────────────────────────────────────────── */
function InviteInput({ emails, onChange }: { emails: string[]; onChange: (e: string[]) => void }) {
  const [input, setInput] = useState("");
  const [err,   setErr]   = useState("");
  const add = () => {
    const v = input.trim().toLowerCase();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) { setErr("Invalid email"); return; }
    if (emails.includes(v)) { setErr("Already added"); return; }
    onChange([...emails, v]); setInput(""); setErr("");
  };
  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input type="email" value={input} placeholder="guest@example.com"
          onChange={e => { setInput(e.target.value); setErr(""); }}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add(); } }}
          style={{ ...inputStyle, flex: 1 }}
          onFocus={e => focus(e.target as HTMLElement)} onBlur={e => blur(e.target as HTMLElement)}
        />
        <button type="button" onClick={add} className="btn-ghost" style={{ padding: "12px 18px", whiteSpace: "nowrap" }}>Add</button>
      </div>
      {err && <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--coral)", marginTop: 6 }}>{err}</p>}
      {emails.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
          {emails.map(em => (
            <div key={em} style={{ display: "flex", alignItems: "center", gap: 7, background: "var(--bg-3)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--rule-strong)", borderRadius: 99, padding: "5px 12px 5px 14px", fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink)" }}>
              {em}
              <button type="button" onClick={() => onChange(emails.filter(x => x !== em))} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--ink-3)", padding: 0, display: "flex" }}>
                <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M2 2l7 7M9 2L2 9"/></svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Page ─────────────────────────────────────────────────── */
export default function EventSettingsPage() {
  const { id }  = useParams<{ id: string }>();
  const router  = useRouter();
  const qc      = useQueryClient();

  const [toast,       setToast]       = useState<{ msg: string; type: "success" | "error" } | null>(null);
  const [confirmDel,  setConfirmDel]  = useState(false);

  // Form state
  const [title,        setTitle]        = useState("");
  const [description,  setDesc]         = useState("");
  const [date,         setDate]         = useState("");
  const [time,         setTime]         = useState("");
  const [isPrivate,    setIsPrivate]    = useState(false);
  const [accessCode,   setAccessCode]   = useState("");
  const [invites,      setInvites]      = useState<string[]>([]);
  const [allowUploads, setAllowUploads] = useState(false);
  const [reqApproval,  setReqApproval]  = useState(true);
  const [dlEnabled,    setDlEnabled]    = useState(true);
  const [galleryVis,   setGalleryVis]   = useState(true);

  const showToast = (msg: string, type: "success" | "error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3200);
  };

  const { data: event, isLoading } = useQuery({
    queryKey: ["event", id],
    queryFn:  () => eventsApi.get(id),
  });

  // Sync form when event loads
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
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["event", id] }); qc.invalidateQueries({ queryKey: ["events"] }); showToast("Event updated.", "success"); },
    onError:   (err) => showToast(err instanceof ApiError ? err.message : "Update failed.", "error"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => eventsApi.delete(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["events"] }); router.push("/dashboard"); },
    onError:   (err) => showToast(err instanceof ApiError ? err.message : "Delete failed.", "error"),
  });

  const addInviteMutation = useMutation({
    mutationFn: (emails: string[]) => eventsApi.addInvites(id, emails),
    onSuccess: () => { setInvites([]); showToast("Invites sent.", "success"); },
    onError:   (err) => showToast(err instanceof ApiError ? err.message : "Failed.", "error"),
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateMutation.mutate({
      title:        title.trim(),
      description:  description.trim() || undefined,
      event_date:   date ? new Date(`${date}T${time || "00:00"}:00`).toISOString() : undefined,
      access_config: {
        access_mode:  isPrivate ? "private" as AccessMode : "link" as AccessMode,
        access_code:  isPrivate && accessCode.trim() ? accessCode.trim() : undefined,
      },
      settings: {
        allow_attendee_uploads:  allowUploads,
        require_upload_approval: reqApproval,
        downloads_enabled:       dlEnabled,
        gallery_visible:         galleryVis,
      },
    });
  };

  const PAD = "clamp(20px, 4vw, 44px)";

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="var(--coral)" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 0.8s linear infinite" }}>
          <path d="M10 1v3M10 16v3M1 10h3M16 10h3M2.93 2.93l2.12 2.12M14.95 14.95l2.12 2.12M2.93 17.07l2.12-2.12M14.95 5.05l2.12-2.12"/>
        </svg>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      </div>
    );
  }
  if (!event) return null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* Header */}
      <div style={{ padding: `40px ${PAD} 28px`, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "var(--rule)" }}>
        <Link href="/dashboard"
          style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--ink-2)", textDecoration: "none", marginBottom: 24, transition: "color 0.15s" }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--ink-2)")}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 7H3M6 3L2 7l4 4"/></svg>
          Back to dashboard
        </Link>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div>
            <p className="label-coral" style={{ marginBottom: 8 }}>Event settings</p>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 600, color: "var(--ink)", lineHeight: 1, maxWidth: 480, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {event.title}
            </h1>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Link href={`/events/${id}/upload`} className="btn-ghost" style={{ padding: "10px 18px" }}>Upload photos</Link>
            <Link href={`/events/${id}`} target="_blank" className="btn-primary" style={{ padding: "10px 18px" }}>View gallery ↗</Link>
          </div>
        </div>
      </div>

      <div style={{ padding: `32px ${PAD}`, maxWidth: 700, display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── Details ── */}
        <SectionCard title="Event details">
          <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Field label="Event name">
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)}
                style={inputStyle} onFocus={e => focus(e.target as HTMLElement)} onBlur={e => blur(e.target as HTMLElement)}/>
            </Field>
            <Field label="Description">
              <textarea value={description} onChange={e => setDesc(e.target.value)} rows={3}
                style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                onFocus={e => focus(e.target as HTMLElement)} onBlur={e => blur(e.target as HTMLElement)}/>
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <Field label="Date">
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  style={inputStyle} onFocus={e => focus(e.target as HTMLElement)} onBlur={e => blur(e.target as HTMLElement)}/>
              </Field>
              <Field label="Time" hint="Optional">
                <input type="time" value={time} onChange={e => setTime(e.target.value)}
                  style={inputStyle} onFocus={e => focus(e.target as HTMLElement)} onBlur={e => blur(e.target as HTMLElement)}/>
              </Field>
            </div>

            {/* Access */}
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)", marginBottom: 10 }}>Access</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                {(["link","private"] as AccessMode[]).map(mode => (
                  <button key={mode} type="button" onClick={() => setIsPrivate(mode === "private")}
                    style={{ padding: "13px 15px", borderRadius: 8, cursor: "pointer", textAlign: "left", transition: "all 0.15s", borderWidth: 1, borderStyle: "solid", borderColor: (mode==="private")===isPrivate ? "rgba(255,107,107,0.5)" : "var(--rule-strong)", background: (mode==="private")===isPrivate ? "var(--coral-subtle)" : "var(--bg-2)" }}>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", fontWeight: 600, color: "var(--ink)", marginBottom: 3 }}>
                      {mode === "link" ? "Public" : "Private"}
                    </div>
                    <div style={{ fontFamily: "var(--font-body)", fontSize: "0.78rem", color: "var(--ink-2)", lineHeight: 1.4 }}>
                      {mode === "link" ? "Anyone with the link" : "Code or invite required"}
                    </div>
                  </button>
                ))}
              </div>
              {isPrivate && (
                <motion.div initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }} transition={{ duration: 0.2 }} style={{ overflow:"hidden" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16, paddingTop: 16 }}>
                    <Field label="Access code" hint="Leave blank to allow invited guests only.">
                      <input type="text" value={accessCode} onChange={e => setAccessCode(e.target.value)}
                        placeholder="e.g. KOFI2024"
                        style={{ ...inputStyle, fontFamily: "var(--font-mono)", letterSpacing: "0.1em", textTransform: "uppercase" }}
                        onFocus={e => focus(e.target as HTMLElement)} onBlur={e => blur(e.target as HTMLElement)}/>
                    </Field>
                    <Field label="Add more invites">
                      <InviteInput emails={invites} onChange={setInvites} />
                    </Field>
                    {invites.length > 0 && (
                      <button type="button"
                        onClick={() => addInviteMutation.mutate(invites)}
                        disabled={addInviteMutation.isPending}
                        className="btn-ghost" style={{ alignSelf: "flex-start", padding: "10px 20px" }}>
                        {addInviteMutation.isPending ? "Sending…" : `Send ${invites.length} invite${invites.length > 1 ? "s" : ""}`}
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </div>

            {/* Settings toggles */}
            <div>
              <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>Gallery settings</div>
              <div style={{ borderTopWidth: 1, borderTopStyle: "solid", borderTopColor: "var(--rule)" }}>
                <Toggle label="Allow attendee uploads" desc="Guests can upload their own photos." checked={allowUploads} onChange={setAllowUploads}/>
                {allowUploads && <Toggle label="Require upload approval" desc="Review attendee photos before they appear in the gallery." checked={reqApproval} onChange={setReqApproval}/>}
                <Toggle label="Enable downloads" desc="Guests can download photos." checked={dlEnabled} onChange={setDlEnabled}/>
                <Toggle label="Gallery visible" desc="The gallery page is accessible to attendees." checked={galleryVis} onChange={setGalleryVis}/>
              </div>
            </div>

            <div>
              <button type="submit" disabled={updateMutation.isPending} className="btn-primary"
                style={{ opacity: updateMutation.isPending ? 0.65 : 1 }}>
                {updateMutation.isPending ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </SectionCard>

        {/* ── Share link ── */}
        <SectionCard title="Share link">
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <div style={{ flex: 1, background: "var(--bg-2)", borderWidth: 1, borderStyle: "solid", borderColor: "var(--rule-strong)", borderRadius: 6, padding: "12px 16px", fontFamily: "var(--font-mono)", fontSize: "0.82rem", color: "var(--ink-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {typeof window !== "undefined" ? `${window.location.origin}/events/${id}` : `/events/${id}`}
            </div>
            <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/events/${id}`).then(() => showToast("Link copied!", "success")); }}
              className="btn-ghost" style={{ padding: "12px 18px", whiteSpace: "nowrap", flexShrink: 0 }}>
              Copy
            </button>
          </div>
        </SectionCard>

        {/* ── Danger ── */}
        <div style={{ background: "rgba(200,50,50,0.05)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(200,60,60,0.2)", borderRadius: 10, padding: "22px 24px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem", fontWeight: 600, color: "#e05555", marginBottom: 8 }}>Danger zone</h2>
          <p style={{ fontFamily: "var(--font-body)", fontSize: "0.9rem", color: "var(--ink-2)", marginBottom: 18, lineHeight: 1.65 }}>
            Deleting this event permanently removes all photos and data. This cannot be undone.
          </p>
          <button onClick={() => setConfirmDel(true)}
            style={{ padding: "10px 20px", background: "transparent", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(200,60,60,0.35)", borderRadius: 5, cursor: "pointer", fontFamily: "var(--font-body)", fontSize: "0.88rem", fontWeight: 600, color: "#e05555", transition: "background 0.15s" }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "rgba(200,60,60,0.1)")}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
          >Delete this event</button>
        </div>
      </div>

      {/* Delete modal */}
      {confirmDel && (
        <div style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.65)", padding: "0 20px" }}>
          <motion.div initial={{ opacity:0, scale:0.94 }} animate={{ opacity:1, scale:1 }}
            style={{ background: "var(--bg-2)", borderWidth:1, borderStyle:"solid", borderColor:"var(--rule-strong)", borderRadius:12, padding:32, maxWidth:420, width:"100%" }}>
            <h3 style={{ fontFamily:"var(--font-display)", fontSize:"1.8rem", color:"var(--ink)", marginBottom:10 }}>Delete "{event.title}"?</h3>
            <p style={{ fontFamily:"var(--font-body)", fontSize:"0.95rem", color:"var(--ink-2)", lineHeight:1.65, marginBottom:28 }}>
              This permanently deletes the event and all its photos. It cannot be undone.
            </p>
            <div style={{ display:"flex", gap:10, justifyContent:"flex-end" }}>
              <button onClick={() => setConfirmDel(false)} className="btn-ghost" style={{ padding:"10px 22px" }}>Cancel</button>
              <button onClick={() => deleteMutation.mutate()} disabled={deleteMutation.isPending}
                style={{ padding:"10px 22px", background:"#c0392b", color:"#fff", border:"none", borderRadius:4, cursor:"pointer", fontFamily:"var(--font-body)", fontSize:"0.88rem", fontWeight:700, opacity: deleteMutation.isPending ? 0.7 : 1 }}>
                {deleteMutation.isPending ? "Deleting…" : "Yes, delete"}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <AnimatePresence>{toast && <Toast msg={toast.msg} type={toast.type} />}</AnimatePresence>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
