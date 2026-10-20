"use client";

import { useEffect, useRef, useState } from "react";
import { ConfirmModal, DangerZone, Field, PageHeader, SectionCard, Toast } from "@/components/dashboard/primitives";
import Button from "@/components/ui/custom-button";
import { useAuth } from "@/hooks/useAuth";
import { ApiError, auth } from "@/lib/api";

export default function AccountPage() {
  const { user, refreshUser, logout } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [deletePw, setDeletePw] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);
  const [changing, setChanging] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const pwRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (confirmDelete) {
      pwRef.current?.focus();
    }
  }, [confirmDelete]);

  useEffect(() => {
    if (user) {
      setDisplayName(user.display_name ?? "");
      setEmail(user.email ?? "");
    }
  }, [user]);

  const notify = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3200);
  };

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await auth.updateMe({ display_name: displayName.trim() || undefined, email: email.trim() || undefined });
      await refreshUser();
      notify("Profile updated.");
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Update failed.", false);
    } finally {
      setSaving(false);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChanging(true);
    try {
      await auth.changePassword({ current_password: currentPw, new_password: newPw });
      setCurrentPw("");
      setNewPw("");
      notify("Password changed.");
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Change failed.", false);
    } finally {
      setChanging(false);
    }
  };

  const deleteAccount = async () => {
    setDeleting(true);
    try {
      await auth.deleteMe({ current_password: deletePw });
      await logout();
    } catch (err) {
      notify(err instanceof ApiError ? err.message : "Delete failed.", false);
      setDeleting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <PageHeader
        eyebrow="Account"
        title={user?.display_name ? `${user.display_name.split(" ")[0]}'s account` : "Your account"}
      />
      {user && !user.is_email_confirmed && (
        <p
          style={{
            maxWidth: 880,
            margin: "0 auto",
            padding: "16px clamp(20px,4vw,44px) 0",
            fontFamily: "var(--font-body)",
            fontSize: "0.88rem",
            color: "var(--coral)",
          }}
        >
          Email not confirmed — check your inbox for the verification link.
        </p>
      )}

      <div
        style={{
          maxWidth: 880,
          margin: "0 auto",
          padding: "24px clamp(20px,4vw,44px) 64px",
          display: "flex",
          flexDirection: "column",
          gap: 22,
        }}
      >
        <SectionCard title="Profile">
          <form onSubmit={saveProfile} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Display name">
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="field-input"
              />
            </Field>
            <Field label="Email">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="field-input" />
            </Field>
            {user?.pending_email && (
              <p style={{ fontFamily: "var(--font-body)", fontSize: "0.82rem", color: "var(--ink-2)" }}>
                Pending change to {user.pending_email} — confirm via the link sent to that address.
              </p>
            )}
            <div>
              <Button type="submit" disabled={saving} variant="primary">
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </div>
          </form>
        </SectionCard>

        <SectionCard title="Change password">
          <form onSubmit={changePassword} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <Field label="Current password">
              <input
                type="password"
                required
                value={currentPw}
                onChange={(e) => setCurrentPw(e.target.value)}
                className="field-input"
                autoComplete="current-password"
              />
            </Field>
            <Field label="New password">
              <input
                type="password"
                required
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="field-input"
                autoComplete="new-password"
              />
            </Field>
            <div>
              <Button type="submit" disabled={changing} variant="secondary">
                {changing ? "Changing…" : "Change password"}
              </Button>
            </div>
          </form>
        </SectionCard>

        <DangerZone
          title="Danger zone"
          body="Deleting your account is permanent and cannot be undone."
          actionLabel="Delete my account"
          onAction={() => setConfirmDelete(true)}
        />
      </div>

      {confirmDelete && (
        <ConfirmModal
          title="Delete your account?"
          body="Enter your current password to confirm. This cannot be undone."
          confirmLabel="Yes, delete"
          loading={deleting}
          confirmDisabled={!deletePw}
          onConfirm={deleteAccount}
          onCancel={() => setConfirmDelete(false)}
        >
          <input
            ref={pwRef}
            type="password"
            value={deletePw}
            onChange={(e) => setDeletePw(e.target.value)}
            placeholder="Current password"
            className="field-input"
            autoComplete="current-password"
          />
        </ConfirmModal>
      )}
      <Toast msg={toast?.msg ?? ""} type={toast?.ok === false ? "error" : "success"} />
    </div>
  );
}
