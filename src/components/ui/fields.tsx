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
