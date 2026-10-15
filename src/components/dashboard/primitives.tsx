"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Loader2, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

/* ── Page header ─────────────────────────────────────────── */
export function PageHeader({
  eyebrow,
  title,
  backHref,
  backLabel,
  actions,
}: {
  eyebrow: string;
  title: string;
  backHref?: string;
  backLabel?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: "clamp(28px,4vw,44px) clamp(20px,4vw,44px) 26px",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        {backHref && (
          <Link
            href={backHref}
            className="db-backlink"
            style={{ marginBottom: 20, display: "inline-flex", alignItems: "center", gap: 8, lineHeight: 1 }}
          >
            <ArrowLeft size={15} strokeWidth={2} aria-hidden="true" />
            {backLabel ?? "Back"}
          </Link>
        )}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <div>
            <p className="label-coral" style={{ marginBottom: 6 }}>
              {eyebrow}
            </p>
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.7rem,3.5vw,2.4rem)",
                fontWeight: 700,
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
                color: "var(--ink)",
                maxWidth: 520,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {title}
            </h1>
          </div>
          {actions && <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>{actions}</div>}
        </div>
      </div>
    </div>
  );
}

/* ── Form field ──────────────────────────────────────────── */
export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
      {/* biome-ignore lint/a11y/noLabelWithoutControl: the control is passed as children, wrapped by this label */}
      <label className="auth-label" style={{ marginBottom: 0 }}>
        {label}
      </label>
      {children}
      {hint && <span style={{ fontSize: "0.875rem", color: "var(--ink-3)", lineHeight: 1.5 }}>{hint}</span>}
    </div>
  );
}

/* ── Toggle row ──────────────────────────────────────────── */
export function Toggle({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 16,
        padding: "15px 0",
        borderBottom: "1px solid var(--rule)",
      }}
    >
      <div>
        <div style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--ink)", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: "0.875rem", color: "var(--ink-3)", lineHeight: 1.5 }}>{desc}</div>
      </div>
      <button
        type="button"
        aria-pressed={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        style={{
          width: 46,
          height: 26,
          borderRadius: 999,
          border: "none",
          cursor: "pointer",
          background: checked ? "var(--coral)" : "var(--surface-2)",
          boxShadow: checked ? "inset 0 0 0 1px rgba(255,83,72,0.4)" : "inset 0 0 0 1px var(--rule-strong)",
          position: "relative",
          flexShrink: 0,
          transition: "background 0.2s ease",
        }}
      >
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "50%",
            background: "#fff",
            position: "absolute",
            top: 3,
            left: checked ? 23 : 3,
            transition: "left 0.2s cubic-bezier(0.34,1.3,0.64,1)",
            boxShadow: "0 1px 4px rgba(0,0,0,0.25)",
            display: "block",
          }}
        />
      </button>
    </div>
  );
}

/* ── Section card ────────────────────────────────────────── */
export function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
  return (
    <section
      style={{
        background: "var(--surface)",
        border: "1px solid var(--rule)",
        borderRadius: "var(--r-card)",
        overflow: "hidden",
        boxShadow: "var(--shadow-card)",
      }}
    >
      <div style={{ padding: "20px 28px 14px", borderBottom: "1px solid var(--rule)" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.25rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            marginBottom: desc ? 4 : 0,
          }}
        >
          {title}
        </h2>
        {desc && <p style={{ fontSize: "0.9375rem", color: "var(--ink-3)" }}>{desc}</p>}
      </div>
      <div style={{ padding: "24px 28px 28px" }}>{children}</div>
    </section>
  );
}

/* ── Toast ───────────────────────────────────────────────── */
export function Toast({ msg, type }: { msg: string; type: "success" | "error" }) {
  return (
    <AnimatePresence>
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.96 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          aria-live="polite"
          style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "13px 18px",
            background: type === "success" ? "rgba(34,160,94,0.12)" : "rgba(217,58,48,0.1)",
            border: `1px solid ${type === "success" ? "rgba(34,160,94,0.35)" : "rgba(217,58,48,0.35)"}`,
            borderRadius: "var(--r-ctl)",
            backdropFilter: "blur(12px)",
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: type === "success" ? "#1e9e63" : "#d93a30",
            boxShadow: "var(--shadow-float)",
          }}
        >
          {type === "success" ? (
            <Check size={17} strokeWidth={2.5} aria-hidden="true" />
          ) : (
            <X size={17} strokeWidth={2.5} aria-hidden="true" />
          )}
          {msg}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ── Email invite tags ───────────────────────────────────── */
export function InviteInput({ emails, onChange }: { emails: string[]; onChange: (e: string[]) => void }) {
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");

  const add = () => {
    const v = input.trim().toLowerCase();
    if (!v) return;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      setErr("Invalid email");
      return;
    }
    if (emails.includes(v)) {
      setErr("Already added");
      return;
    }
    onChange([...emails, v]);
    setInput("");
    setErr("");
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10 }}>
        <input
          type="email"
          value={input}
          placeholder="guest@example.com"
          onChange={(e) => {
            setInput(e.target.value);
            setErr("");
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          className="field-input"
          style={{ flex: 1 }}
        />
        <button type="button" onClick={add} className="btn-ghost" style={{ whiteSpace: "nowrap" }}>
          Add
        </button>
      </div>
      {err && <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#d93a30", marginTop: 7 }}>{err}</p>}
      {emails.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
          {emails.map((em) => (
            <span
              key={em}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: "var(--coral-soft)",
                border: "1px solid rgba(255,83,72,0.25)",
                borderRadius: 999,
                padding: "6px 8px 6px 14px",
                fontSize: "0.875rem",
                fontWeight: 500,
                color: "var(--coral-deep)",
              }}
            >
              {em}
              <button
                type="button"
                aria-label={`Remove ${em}`}
                onClick={() => onChange(emails.filter((x) => x !== em))}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--coral-deep)",
                  opacity: 0.7,
                  padding: 3,
                  display: "flex",
                  borderRadius: "50%",
                }}
              >
                <X size={13} strokeWidth={2.5} aria-hidden="true" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Danger zone card ────────────────────────────────────── */
export function DangerZone({
  title,
  body,
  actionLabel,
  onAction,
}: {
  title: string;
  body: string;
  actionLabel: string;
  onAction: () => void;
}) {
  return (
    <div
      style={{
        background: "rgba(217,58,48,0.04)",
        border: "1px solid rgba(217,58,48,0.25)",
        borderRadius: "var(--r-card)",
        padding: "24px 28px",
      }}
    >
      <h2
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.25rem",
          fontWeight: 700,
          color: "#c93327",
          marginBottom: 8,
        }}
      >
        {title}
      </h2>
      <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", marginBottom: 18, lineHeight: 1.6 }}>{body}</p>
      <button type="button" onClick={onAction} className="dz-btn">
        {actionLabel}
      </button>
      <style>{`
        .dz-btn {
          padding: 10px 20px;
          background: transparent;
          border: 1px solid rgba(217,58,48,0.4);
          border-radius: var(--r-ctl);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 600;
          color: #c93327;
          transition: background 0.15s ease, transform 0.15s ease;
        }
        .dz-btn:hover { background: rgba(217,58,48,0.08); }
        .dz-btn:active { transform: scale(0.98); }
        html[data-theme="dark"] .dz-btn { color: #ff8578; border-color: rgba(255,133,120,0.4); }
        html[data-theme="dark"] .dz-btn:hover { background: rgba(255,133,120,0.1); }
      `}</style>
    </div>
  );
}

/* ── Confirm modal ───────────────────────────────────────── */
export function ConfirmModal({
  title,
  body,
  confirmLabel,
  onConfirm,
  onCancel,
  loading,
  children,
  confirmDisabled,
}: {
  title: string;
  body: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  children?: React.ReactNode;
  confirmDisabled?: boolean;
}) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(12,10,14,0.6)",
        backdropFilter: "blur(4px)",
        padding: "0 20px",
      }}
      role="dialog"
      aria-modal="true"
      aria-label={title}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--rule)",
          borderRadius: "var(--r-card)",
          padding: 30,
          maxWidth: 430,
          width: "100%",
          boxShadow: "var(--shadow-float)",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-display)",
            fontSize: "1.45rem",
            fontWeight: 700,
            letterSpacing: "-0.01em",
            color: "var(--ink)",
            marginBottom: 10,
          }}
        >
          {title}
        </h3>
        <p style={{ fontSize: "0.9375rem", color: "var(--ink-2)", lineHeight: 1.65, marginBottom: children ? 18 : 26 }}>
          {body}
        </p>
        {children && <div style={{ marginBottom: 22 }}>{children}</div>}
        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button type="button" onClick={onCancel} className="btn-ghost" style={{ padding: "10px 20px" }}>
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading || confirmDisabled} className="dz-confirm">
            {loading ? <Loader2 size={16} className="spin" aria-hidden="true" /> : null}
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </motion.div>
      <style>{`
        .spin { animation: spin 0.8s linear infinite; }
        .dz-confirm {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 20px;
          background: #c93327;
          color: #fff;
          border: none;
          border-radius: var(--r-ctl);
          cursor: pointer;
          font-family: var(--font-body);
          font-size: 0.9375rem;
          font-weight: 700;
          transition: transform 0.15s ease, filter 0.15s ease;
        }
        .dz-confirm:hover { filter: brightness(1.06); transform: translateY(-1px); }
        .dz-confirm:active { transform: scale(0.98); }
        .dz-confirm:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
      `}</style>
    </div>
  );
}

/* ── Full-page spinner ───────────────────────────────────── */
export function PageSpinner() {
  return (
    <div
      style={{
        minHeight: "60vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Loader2 size={26} color="var(--coral)" className="spin" aria-hidden="true" />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
