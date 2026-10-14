"use client";

import { useCallback, useState } from "react";
import { UploadIcon } from "@/components/icons";
import { UPLOAD_CHUNK_SIZE } from "@/lib/uploads";

/** Drag-and-drop file picker (images + video). */
export default function DropZone({ onFiles, disabled }: { onFiles: (files: File[]) => void; disabled?: boolean }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      onFiles(Array.from(e.dataTransfer.files));
    },
    [onFiles, disabled],
  );

  return (
    <label
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        padding: "48px 32px",
        border: `2px dashed ${isDragging ? "var(--coral)" : "var(--rule-strong)"}`,
        borderRadius: 12,
        background: isDragging ? "var(--coral-subtle)" : "var(--bg)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        transition: "all 0.2s",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: isDragging ? "var(--coral)" : "var(--bg-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: isDragging ? "#fff" : "var(--coral)",
          transition: "all 0.2s",
        }}
      >
        <UploadIcon size={28} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "1rem",
            fontWeight: 500,
            color: "var(--ink)",
            marginBottom: 6,
          }}
        >
          {isDragging ? "Drop files here" : "Click or drag photos & videos here"}
        </div>
        <div style={{ fontFamily: "var(--font-body)", fontSize: "0.85rem", color: "var(--ink-2)" }}>
          Images up to 10MB · Videos up to 200MB · Batches of {UPLOAD_CHUNK_SIZE}
        </div>
      </div>
      <input
        type="file"
        accept="image/*,video/*"
        multiple
        onChange={(e) => {
          onFiles(Array.from(e.target.files || []));
          e.target.value = "";
        }}
        disabled={disabled}
        style={{ display: "none" }}
      />
    </label>
  );
}
