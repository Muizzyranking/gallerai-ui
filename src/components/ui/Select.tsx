"use client";

import { useEffect, useId, useRef, useState } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id?: string;
  label: string;
  value: string;
  options: (string | SelectOption)[];
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
}

/* Reusable custom select: button + listbox popover. Keyboard: Enter/Space/
   arrows open, Escape closes, Tab moves through options naturally. */
export default function Select({ id, label, value, options, onChange, placeholder = "Select…", error }: SelectProps) {
  const autoId = useId();
  const selectId = id ?? `select-${autoId}`;
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const normalized: SelectOption[] = options.map((o) => (typeof o === "string" ? { value: o, label: o } : o));
  const selected = normalized.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} style={{ position: "relative" }}>
      <span id={`${selectId}-label`} className="field-label">
        {label}
      </span>
      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-labelledby={`${selectId}-label ${selectId}`}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : undefined}
        onClick={() => setOpen((o) => !o)}
        onKeyDown={(e) => {
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !open) {
            e.preventDefault();
            setOpen(true);
          }
        }}
        className="field-input"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          cursor: "pointer",
          textAlign: "left",
          color: selected ? "var(--ink)" : "var(--ink-3)",
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selected ? selected.label : placeholder}</span>
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
          style={{ flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s ease", color: "var(--ink-3)" }}
        >
          <path d="m4 6 4 4 4-4" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-labelledby={`${selectId}-label`}
          className="card fade-in"
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            right: 0,
            zIndex: 30,
            listStyle: "none",
            margin: 0,
            padding: 6,
            maxHeight: 240,
            overflowY: "auto",
            background: "#fff",
          }}
        >
          {normalized.map((o) => {
            const isSelected = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                    triggerRef.current?.focus();
                  }}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    padding: "11px 12px",
                    border: "none",
                    borderRadius: 8,
                    background: isSelected ? "var(--accent-soft)" : "transparent",
                    color: isSelected ? "var(--accent-ink)" : "var(--ink)",
                    fontSize: "0.95rem",
                    fontWeight: isSelected ? 700 : 500,
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "var(--cream)";
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) (e.currentTarget as HTMLElement).style.background = "transparent";
                  }}
                >
                  {o.label}
                  {isSelected && (
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M3 8.5l3.2 3L13 4.5" />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {error && (
        <p id={`${selectId}-error`} role="alert" className="field-error" style={{ marginTop: 8 }}>
          {error}
        </p>
      )}
    </div>
  );
}
