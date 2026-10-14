"use client";

import { useCallback, useRef, useState } from "react";
import { ApiError } from "@/lib/api";
import { type QueuedFile, uploadInChunks, validateFiles } from "@/lib/uploads";

type RejectedFile = { id: string; name: string; reason: string };

export function useChunkedUpload() {
  const rejectedSeq = useRef(0);
  const [files, setFiles] = useState<QueuedFile[]>([]);
  const [rejected, setRejected] = useState<RejectedFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [chunkLabel, setChunkLabel] = useState("");
  const [uploadCount, setUploadCount] = useState(0);

  const handleFiles = useCallback((picked: File[]) => {
    const { accepted, rejected: bad } = validateFiles(picked);
    const queued: QueuedFile[] = accepted.map((file, i) => ({
      id: `${Date.now()}-${i}-${file.name}`,
      file,
      status: "pending",
      previewUrl: file.type.startsWith("image/") ? URL.createObjectURL(file) : undefined,
    }));
    const withIds: RejectedFile[] = bad.map((r) => ({
      id: String(++rejectedSeq.current),
      ...r,
    }));
    setFiles((prev) => [...prev, ...queued]);
    setRejected((prev) => [...prev, ...withIds]);
  }, []);

  const removeFile = useCallback(
    (id: string) => {
      const target = files.find((f) => f.id === id);
      if (target?.previewUrl) URL.revokeObjectURL(target.previewUrl);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    },
    [files],
  );

  const clear = useCallback(() => {
    for (const f of files) {
      if (f.previewUrl) URL.revokeObjectURL(f.previewUrl);
    }
    setFiles([]);
  }, [files]);

  const pendingCount = files.filter((f) => f.status === "pending").length;

  const upload = useCallback(
    async (eventId: string, attendee: boolean) => {
      const pending = files.filter((f) => f.status === "pending");
      if (pending.length === 0 || uploading) return null;
      setUploading(true);
      setUploadCount((c) => c + 1);
      setChunkLabel("");
      setFiles((prev) =>
        prev.map((f) => (pending.some((p) => p.id === f.id) ? { ...f, status: "uploading" as const } : f)),
      );
      try {
        const result = await uploadInChunks(
          eventId,
          pending.map((f) => f.file),
          {
            attendee,
            onChunkDone: (done, total) => setChunkLabel(`Uploading batch ${done} of ${total}…`),
          },
        );
        setChunkLabel("");
        setFiles((prev) =>
          prev.map((f) => (pending.some((p) => p.id === f.id) ? { ...f, status: "complete" as const } : f)),
        );
        return result;
      } catch (err) {
        const msg = err instanceof ApiError ? err.message : "Upload failed";
        setFiles((prev) =>
          prev.map((f) => (pending.some((p) => p.id === f.id) ? { ...f, status: "error" as const, error: msg } : f)),
        );
        throw err;
      } finally {
        setUploading(false);
      }
    },
    [files, uploading],
  );

  return { files, rejected, uploading, chunkLabel, uploadCount, pendingCount, handleFiles, removeFile, clear, upload };
}
