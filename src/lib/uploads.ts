import { useEffect, useState } from "react";
import { media, type UploadProgress, type UploadResult } from "@/lib/api";

export const UPLOAD_CHUNK_SIZE = 25;
export const UPLOAD_PARALLEL_CHUNKS = 5;
export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 200 * 1024 * 1024;

export type QueuedFileStatus = "pending" | "uploading" | "complete" | "error";

export interface QueuedFile {
  id: string;
  file: File;
  status: QueuedFileStatus;
  error?: string;
  previewUrl?: string;
}

export interface RejectedFile {
  name: string;
  reason: string;
}

export function validateFiles(files: File[]): { accepted: File[]; rejected: RejectedFile[] } {
  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];
  for (const f of files) {
    const isImage = f.type.startsWith("image/");
    const isVideo = f.type.startsWith("video/");
    if (!isImage && !isVideo) {
      rejected.push({ name: f.name, reason: "Unsupported file type" });
      continue;
    }
    const limit = isImage ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES;
    if (f.size > limit) {
      rejected.push({ name: f.name, reason: `File exceeds ${isImage ? "10MB" : "200MB"} limit` });
      continue;
    }
    accepted.push(f);
  }
  return { accepted, rejected };
}

export function chunkFiles<T>(items: T[], size: number = UPLOAD_CHUNK_SIZE): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export interface ChunkUploadOptions {
  attendee?: boolean;
  /** Called after each chunk resolves with (#done, #total chunks). */
  onChunkDone?: (done: number, total: number) => void;
}

/** Upload files in parallel batches of 20–25. Aggregates accepted/skipped. */
export async function uploadInChunks(
  eventId: string,
  files: File[],
  options?: ChunkUploadOptions,
): Promise<UploadResult> {
  const chunks = chunkFiles(files);
  const total: UploadResult = { accepted: 0, skipped: 0, media_ids: [] };
  let done = 0;
  const send = options?.attendee ? media.attendeeUpload : media.upload;

  for (let i = 0; i < chunks.length; i += UPLOAD_PARALLEL_CHUNKS) {
    const batch = chunks.slice(i, i + UPLOAD_PARALLEL_CHUNKS);
    const results = await Promise.all(batch.map((c) => send(eventId, c)));
    for (const r of results) {
      total.accepted += r.accepted;
      total.skipped += r.skipped;
      total.media_ids.push(...r.media_ids);
      done += 1;
      options?.onChunkDone?.(done, chunks.length);
    }
  }
  return total;
}

/** Subscribe to the SSE upload-progress stream. Auto-reconnects; safe to
 *  open one per event and close on unmount. */
export function subscribeUploadProgress(
  eventId: string,
  onUpdate: (p: UploadProgress) => void,
  accessCode?: string,
): () => void {
  const es = new EventSource(media.progressUrl(eventId, accessCode));
  es.onmessage = (e) => {
    try {
      onUpdate(JSON.parse(e.data) as UploadProgress);
    } catch {
      // Ignore heartbeat / malformed frames.
    }
  };
  return () => es.close();
}

export function useUploadProgress(eventId: string | null, accessCode?: string): UploadProgress | null {
  const [progress, setProgress] = useState<UploadProgress | null>(null);
  useEffect(() => {
    if (!eventId) return;
    return subscribeUploadProgress(eventId, setProgress, accessCode);
  }, [eventId, accessCode]);
  return progress;
}

export async function pollCountsUntilStable(
  eventId: string,
  accessCode?: string,
  onTick?: (total: number) => void,
): Promise<void> {
  let last = -1;
  let stable = 0;
  for (let i = 0; i < 15 && stable < 2; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    try {
      const c = await media.counts(eventId, accessCode);
      onTick?.(c.total);
      if (c.total === last) stable += 1;
      else {
        stable = 0;
        last = c.total;
      }
    } catch {
      break;
    }
  }
}
