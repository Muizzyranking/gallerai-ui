"use client";

import { useState } from "react";

export function PasswordField({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
  error,
  helpText,
  labelExtra,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: "current-password" | "new-password";
  placeholder: string;
  error?: string;
  helpText?: string;
  labelExtra?: React.ReactNode;
}) {
  const [show, setShow] = useState(false);
  const noteId = error || helpText ? `${id}-note` : undefined;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
        <label htmlFor={id} className="field-label" style={{ marginBottom: 0 }}>
          {label}
        </label>
        {labelExtra}
      </div>
      <div style={{ position: "relative" }}>
        <input
          id={id}
          type={show ? "text" : "password"}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="field-input"
          style={{ paddingRight: 52 }}
          aria-invalid={!!error}
          aria-describedby={noteId}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          style={{
            position: "absolute",
            right: 12,
            top: "50%",
            transform: "translateY(-50%)",
            background: "var(--cream)",
            border: "1px solid var(--line)",
            borderRadius: 8,
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "0.8rem",
            fontWeight: 700,
            color: "var(--ink-2)",
          }}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      {error ? (
        <p id={noteId} role="alert" className="field-error" style={{ marginTop: 8 }}>
          {error}
        </p>
      ) : helpText ? (
        <p id={noteId} className="field-help">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  id,
  label,
  type = "text",
  autoComplete,
  value,
  onChange,
  placeholder,
  error,
  helpText,
}: {
  id: string;
  label: string;
  type?: string;
  autoComplete?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  helpText?: string;
}) {
  const noteId = error || helpText ? `${id}-note` : undefined;
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label}
      </label>
      <input
        id={id}
        type={type}
        autoComplete={autoComplete}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="field-input"
        aria-invalid={!!error}
        aria-describedby={noteId}
      />
      {error ? (
        <p id={noteId} role="alert" className="field-error" style={{ marginTop: 8 }}>
          {error}
        </p>
      ) : helpText ? (
        <p id={noteId} className="field-help">
          {helpText}
        </p>
      ) : null}
    </div>
  );
}
