"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ApiError, faces as facesApi, type ScanComplete } from "@/lib/api";

export type FaceScanPhase = "idle" | "scanning" | "success" | "error";

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Selfie scan state machine: stage → poll job → token. */
export function useFaceScan(eventId: string, accessCode?: string) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [phase, setPhase] = useState<FaceScanPhase>("idle");
  const [statusLine, setStatusLine] = useState("");
  const [error, setError] = useState("");
  const [matchCount, setMatchCount] = useState(0);
  const [session, setSession] = useState<ScanComplete | null>(null);
  const cancelledRef = useRef(false);

  useEffect(
    () => () => {
      cancelledRef.current = true;
    },
    [],
  );

  const selectFile = useCallback((f: File | null) => {
    setFile(f);
    setPreviewUrl(f ? URL.createObjectURL(f) : null);
    setPhase("idle");
    setStatusLine("");
    setError("");
    setSession(null);
  }, []);

  const reset = useCallback(() => {
    cancelledRef.current = true;
    setFile(null);
    setPreviewUrl(null);
    setPhase("idle");
    setStatusLine("");
    setError("");
    setMatchCount(0);
    setSession(null);
  }, []);

  const start = useCallback(async () => {
    if (!file || phase === "scanning") return;
    cancelledRef.current = false;
    setPhase("scanning");
    setError("");

    let jobId: string;
    try {
      jobId = (await facesApi.scan(eventId, file, accessCode)).job_id;
    } catch (err) {
      if (cancelledRef.current) return;
      setPhase("error");
      setError(
        err instanceof ApiError && (err.status === 400 || err.status === 413)
          ? "That file won't work — use a JPG/PNG selfie under 10MB."
          : err instanceof ApiError
            ? err.message
            : "Couldn't start the scan. Please try again.",
      );
      return;
    }

    setStatusLine("In queue…");
    for (let i = 0; i < 60; i++) {
      await wait(2000);
      if (cancelledRef.current) return;
      let s;
      try {
        s = await facesApi.scanStatus(eventId, jobId, accessCode);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setPhase("error");
          setError("Scan expired. Please try again.");
          return;
        }
        continue;
      }
      if (cancelledRef.current) return;
      if (s.status === "processing") setStatusLine("Analyzing your selfie…");
      if (s.status === "done") {
        const done: ScanComplete = { scan_token: s.scan_token ?? "", match_count: s.match_count ?? 0 };
        setMatchCount(done.match_count);
        setSession(done);
        setPhase("success");
        return;
      }
      if (s.status === "failed") {
        setPhase("error");
        setError(s.error || "Couldn't find a face. Try a clearer selfie with good lighting.");
        return;
      }
    }
    if (!cancelledRef.current) {
      setPhase("error");
      setError("Scan timed out. Please try again.");
    }
  }, [file, phase, eventId, accessCode]);

  return { file, previewUrl, phase, statusLine, error, matchCount, session, selectFile, reset, start };
}
