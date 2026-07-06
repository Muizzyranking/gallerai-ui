"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { CameraIcon, CheckIcon, CloseIcon, DownloadIcon, FaceIcon, SearchIcon, UploadIcon } from "@/components/icons";
import Button from "@/components/ui/custom-button";
import ThemeToggle from "@/components/ui/ThemeToggle";
import { downloads as downloadsApi, type EventSettings, events as eventsApi, faces as facesApi, type GalleryPhoto, gallery as galleryApi, photos as photosApi } from "@/lib/api";

type ViewMode = "all" | "mine";
type ScanState = "idle" | "scanning" | "success" | "error";

interface ScanResult {
  scan_token: string;
  photos: GalleryPhoto[];
}
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

const getFullUrl = (path: string) => {
  if (path.startsWith("http")) return path;
  return `${BASE}/api/v1${path}`;
};

function TabButton({ active, onClick, children, count }: { active: boolean; onClick: () => void; children: React.ReactNode; count?: number }) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: "12px 20px",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontFamily: "var(--font-body)",
        fontSize: "0.95rem",
        fontWeight: active ? 600 : 400,
        color: active ? "var(--ink)" : "var(--ink-2)",
        borderBottom: `2px solid ${active ? "var(--coral)" : "transparent"}`,
        transition: "all 0.2s",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}
    >
      {children}
      {count !== undefined && (
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.7rem",
            padding: "2px 8px",
            borderRadius: 99,
            background: active ? "var(--coral-subtle)" : "var(--bg-2)",
            color: active ? "var(--coral)" : "var(--ink-2)",
          }}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ── Face Scan Modal ───────────────────────────────────────── */
function FaceScanModal({ isOpen, onClose, eventId, onScanComplete }: { isOpen: boolean; onClose: () => void; eventId: string; onScanComplete: (result: ScanResult) => void }) {
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState("");

  const scanMutation = useMutation({
    mutationFn: async (file: File) => {
      return facesApi.scanAnonymous(eventId, file) as Promise<ScanResult>;
    },
    onSuccess: (data) => {
      setScanState("success");
      onScanComplete(data);
      setTimeout(() => onClose(), 1500);
    },
    onError: () => {
      setScanState("error");
      setError("Couldn't find any matching photos. Try a clearer selfie with good lighting.");
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setScanState("idle");
      setError("");
    }
  };

  const handleScan = () => {
    if (!selectedFile) return;
    setScanState("scanning");
    scanMutation.mutate(selectedFile);
  };

  useEffect(() => {
    if (!isOpen) {
      setScanState("idle");
      setSelectedFile(null);
      setPreviewUrl(null);
      setError("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--bg-1)",
            borderRadius: 16,
            padding: 32,
            maxWidth: 480,
            width: "100%",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            border: "1px solid var(--rule)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              Find your photos
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-2)",
                padding: 4,
                display: "flex",
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--ink-2)",
              marginBottom: 24,
              lineHeight: 1.6,
            }}
          >
            Upload a selfie or take a photo to find all images where you appear in this gallery.
          </p>

          {/* Upload Area */}
          {scanState === "idle" && !previewUrl && (
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 16,
                padding: 40,
                border: "2px dashed var(--rule-strong)",
                borderRadius: 12,
                cursor: "pointer",
                transition: "all 0.2s",
                background: "var(--bg)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--coral)";
                (e.currentTarget as HTMLElement).style.background = "var(--coral-subtle)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "var(--rule-strong)";
                (e.currentTarget as HTMLElement).style.background = "var(--bg)";
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "var(--coral-subtle)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--coral)",
                }}
              >
                <CameraIcon size={28} />
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.95rem",
                    fontWeight: 500,
                    color: "var(--ink)",
                    marginBottom: 4,
                  }}
                >
                  Click to upload or take photo
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "0.8rem",
                    color: "var(--ink-2)",
                  }}
                >
                  JPG, PNG up to 10MB
                </div>
              </div>
              <input type="file" accept="image/*" capture="user" onChange={handleFileSelect} style={{ display: "none" }} />
            </label>
          )}

          {/* Preview */}
          {previewUrl && scanState !== "success" && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: "1",
                  borderRadius: 12,
                  overflow: "hidden",
                  marginBottom: 16,
                }}
              >
                <img src={previewUrl} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                {scanState === "scanning" && (
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(0,0,0,0.6)",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 16,
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        border: "3px solid var(--coral)",
                        borderTopColor: "transparent",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite",
                      }}
                    />
                    <span
                      style={{
                        color: "#fff",
                        fontFamily: "var(--font-body)",
                        fontSize: "0.9rem",
                      }}
                    >
                      Scanning for matches...
                    </span>
                  </div>
                )}
              </div>

              {scanState === "idle" && (
                <div style={{ display: "flex", gap: 12 }}>
                  <Button onClick={handleScan} variant="primary" className="flex-1">
                    <SearchIcon size={18} />
                    Find my photos
                  </Button>
                  <Button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    variant="secondary"
                  >
                    Retake
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Success State */}
          {scanState === "success" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                textAlign: "center",
                padding: 24,
              }}
            >
              <div
                style={{
                  width: 64,
                  height: 64,
                  borderRadius: "50%",
                  background: "#10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 16px",
                  color: "#fff",
                }}
              >
                <CheckIcon size={32} />
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.2rem",
                  fontWeight: 600,
                  color: "var(--ink)",
                  marginBottom: 8,
                }}
              >
                Found your photos!
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--ink-2)",
                }}
              >
                Switch to "My Photos" tab to see them
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {scanState === "error" && (
            <div
              style={{
                padding: 16,
                background: "rgba(255,107,107,0.1)",
                borderRadius: 8,
                border: "1px solid rgba(255,107,107,0.3)",
                marginBottom: 16,
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.9rem",
                  color: "var(--coral)",
                  textAlign: "center",
                }}
              >
                {error}
              </p>
            </div>
          )}

          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Upload Modal ──────────────────────────────────────────── */
function UploadModal({ isOpen, onClose, eventId }: { isOpen: boolean; onClose: () => void; eventId: string }) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const qc = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => photosApi.attendeeUpload(eventId, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["gallery", eventId] });
      setFiles([]);
      onClose();
    },
  });

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(e.target.files || []);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    await uploadMutation.mutateAsync(files);
    setUploading(false);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.75)",
          backdropFilter: "blur(4px)",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 20,
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            background: "var(--bg-1)",
            borderRadius: 16,
            padding: 32,
            maxWidth: 520,
            width: "100%",
            maxHeight: "80vh",
            overflow: "auto",
            boxShadow: "0 25px 50px -12px rgba(0,0,0,0.5)",
            border: "1px solid var(--rule)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.5rem",
                fontWeight: 600,
                color: "var(--ink)",
              }}
            >
              Upload photos
            </h2>
            <button
              onClick={onClose}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "var(--ink-2)",
                padding: 4,
                display: "flex",
              }}
            >
              <CloseIcon />
            </button>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "0.95rem",
              color: "var(--ink-2)",
              marginBottom: 24,
            }}
          >
            Share your photos from this event. Uploads may require approval before appearing in the gallery.
          </p>

          {/* Drop Zone */}
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
              padding: 32,
              border: "2px dashed var(--rule-strong)",
              borderRadius: 12,
              cursor: "pointer",
              marginBottom: 24,
              background: "var(--bg)",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--coral)";
              (e.currentTarget as HTMLElement).style.background = "var(--coral-subtle)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "var(--rule-strong)";
              (e.currentTarget as HTMLElement).style.background = "var(--bg)";
            }}
          >
            <UploadIcon size={32} />
            <span
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "0.95rem",
                color: "var(--ink)",
              }}
            >
              Click to select photos
            </span>
            <input type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
          </label>

          {/* File List */}
          {files.length > 0 && (
            <div style={{ marginBottom: 24 }}>
              <div
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  color: "var(--ink-2)",
                  marginBottom: 12,
                }}
              >
                {files.length} file{files.length !== 1 ? "s" : ""} selected
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {files.map((file, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      padding: 12,
                      background: "var(--bg)",
                      borderRadius: 8,
                      border: "1px solid var(--rule)",
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 6,
                        background: "var(--bg-2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.7rem",
                        color: "var(--ink-2)",
                        overflow: "hidden",
                      }}
                    >
                      {file.type.startsWith("image/") ? <img src={URL.createObjectURL(file)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "IMG"}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          fontFamily: "var(--font-body)",
                          fontSize: "0.85rem",
                          color: "var(--ink)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {file.name}
                      </div>
                      <div
                        style={{
                          fontFamily: "var(--font-mono)",
                          fontSize: "0.7rem",
                          color: "var(--ink-2)",
                        }}
                      >
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(i)}
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--ink-2)",
                        padding: 4,
                        display: "flex",
                      }}
                    >
                      <CloseIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
            <Button onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button onClick={handleUpload} disabled={files.length === 0 || uploading} variant="primary">
              {uploading ? "Uploading..." : `Upload ${files.length > 0 ? `(${files.length})` : ""}`}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Photo Grid ────────────────────────────────────────────── */
function PhotoGrid({ photos, onDownload, emptyState }: { photos: GalleryPhoto[]; onDownload: (photo: GalleryPhoto) => void; emptyState: React.ReactNode }) {
  if (!photos || photos.length === 0) {
    return <>{emptyState}</>;
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 16,
      }}
    >
      {photos.map((photo, i) => (
        <motion.div
          key={photo.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          style={{
            position: "relative",
            aspectRatio: "1",
            borderRadius: 12,
            overflow: "hidden",
            background: "var(--bg-2)",
            cursor: "pointer",
            group: "photo",
          }}
          onMouseEnter={(e) => {
            const overlay = (e.currentTarget as HTMLElement).querySelector(".photo-overlay") as HTMLElement;
            if (overlay) overlay.style.opacity = "1";
          }}
          onMouseLeave={(e) => {
            const overlay = (e.currentTarget as HTMLElement).querySelector(".photo-overlay") as HTMLElement;
            if (overlay) overlay.style.opacity = "0";
          }}
        >
          <img
            src={getFullUrl(photo.url)}
            alt=""
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.3s",
            }}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.transform = "scale(1)";
            }}
          />

          {/* Hover Overlay */}
          <div
            className="photo-overlay"
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              opacity: 0,
              transition: "opacity 0.2s",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              padding: 16,
            }}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDownload(photo);
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "8px 16px",
                background: "rgba(255,255,255,0.95)",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--ink)",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "#fff";
                (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.95)";
                (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
              }}
            >
              <DownloadIcon size={16} />
              Download
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ── Empty States ──────────────────────────────────────────── */
function EmptyStateScanPrompt({ onScan }: { onScan: () => void }) {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: "50%",
          background: "var(--coral-subtle)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 24px",
          color: "var(--coral)",
        }}
      >
        <FaceIcon size={40} />
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.3rem",
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 12,
        }}
      >
        Find your photos
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.95rem",
          color: "var(--ink-2)",
          marginBottom: 24,
          maxWidth: 400,
          margin: "0 auto 24px",
          lineHeight: 1.6,
        }}
      >
        Take a quick selfie to find all photos where you appear in this gallery. No account needed.
      </p>
      <Button onClick={onScan} variant="primary">
        <CameraIcon size={18} />
        Scan for my photos
      </Button>
    </div>
  );
}

function EmptyStateNoPhotos() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          width: 64,
          height: 64,
          borderRadius: "50%",
          background: "var(--bg-2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 20px",
          color: "var(--ink-2)",
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <path d="M21 15l-5-5L5 21" />
        </svg>
      </div>
      <h3
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "1.2rem",
          fontWeight: 600,
          color: "var(--ink)",
          marginBottom: 8,
        }}
      >
        No photos yet
      </h3>
      <p
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "0.9rem",
          color: "var(--ink-2)",
        }}
      >
        Photos will appear here once they're uploaded.
      </p>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function EventGalleryPage() {
  const params = useParams();
  const eventId = params.id as string;
  const qc = useQueryClient();

  const [viewMode, setViewMode] = useState<ViewMode>("all");
  const [scanModalOpen, setScanModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [scanToken, setScanToken] = useState<string | null>(null);
  const [myPhotos, setMyPhotos] = useState<GalleryPhoto[]>([]);

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsApi.get(eventId),
  });

  // Fetch all gallery photos
  const { data: galleryData, isLoading: photosLoading } = useQuery({
    queryKey: ["gallery", eventId],
    queryFn: () => galleryApi.full(eventId),
  });
  const allPhotos = galleryData?.photos || [];

  const handleScanComplete = useCallback(
    (result: ScanResult) => {
      setScanToken(result.scan_token);
      setMyPhotos(result.photos);
      setViewMode("mine");
      sessionStorage.setItem(`scan_token_${eventId}`, result.scan_token);
    },
    [eventId],
  );

  useEffect(() => {
    const existingToken = sessionStorage.getItem(`scan_token_${eventId}`);
    if (existingToken) {
      setScanToken(existingToken);
      galleryApi.anonymous(eventId, existingToken).then((response) => {
        setMyPhotos(response.photos);
      });
    }
  }, [eventId]);

  const handleDownload = (photo: GalleryPhoto) => {
    const url = downloadsApi.singleUrl(eventId, photo.id);
    window.open(url, "_blank");
  };

  const handleDownloadAllMine = () => {
    const url = downloadsApi.allMatchedUrl(eventId);
    window.open(url, "_blank");
  };

  const isLoading = eventLoading || photosLoading;

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid var(--coral)",
            borderTopColor: "transparent",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!event) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: 20,
        }}
      >
        <div style={{ textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.5rem",
              color: "var(--ink)",
              marginBottom: 8,
            }}
          >
            Event not found
          </h1>
          <p
            style={{
              fontFamily: "var(--font-body)",
              color: "var(--ink-2)",
            }}
          >
            This event may have been removed or is no longer available.
          </p>
        </div>
      </div>
    );
  }

  const settings: EventSettings = event.settings || {
    allow_attendee_uploads: false,
    require_upload_approval: true,
    downloads_enabled: true,
    gallery_visible: true,
  };

  const formattedDate = event.event_date
    ? new Date(event.event_date).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Header ────────────────────────────────────────────── */}
      <div
        style={{
          position: "relative",
          height: event.cover_photo_url ? 320 : 200,
          background: event.cover_photo_url ? `linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6)), url(${event.cover_photo_url})` : "var(--bg-2)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "clamp(20px, 5vw, 60px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            width: "100%",
          }}
        >
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {formattedDate && (
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8rem",
                  color: event.cover_photo_url ? "rgba(255,255,255,0.8)" : "var(--ink-2)",
                  textTransform: "uppercase",
                  letterSpacing: "0.1em",
                  marginBottom: 12,
                }}
              >
                {formattedDate}
              </div>
            )}
            <h1
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 600,
                color: event.cover_photo_url ? "#fff" : "var(--ink)",
                marginBottom: 12,
                lineHeight: 1.1,
              }}
            >
              {event.title}
            </h1>
            {event.description && (
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "1.1rem",
                  color: event.cover_photo_url ? "rgba(255,255,255,0.9)" : "var(--ink-2)",
                  maxWidth: 600,
                  lineHeight: 1.6,
                }}
              >
                {event.description}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* ── Controls Bar ──────────────────────────────────────── */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          background: "var(--bg)",
          borderBottom: "1px solid var(--rule)",
          padding: "0 clamp(20px, 5vw, 60px)",
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
            padding: "16px 0",
          }}
        >
          {/* Tabs */}
          <div style={{ display: "flex", gap: 8 }}>
            <TabButton active={viewMode === "all"} onClick={() => setViewMode("all")} count={allPhotos.length}>
              All Photos
            </TabButton>
            <TabButton active={viewMode === "mine"} onClick={() => setViewMode("mine")} count={scanToken ? myPhotos.length : undefined}>
              My Photos
            </TabButton>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {viewMode === "mine" && scanToken && myPhotos.length > 0 && (
              <Button onClick={handleDownloadAllMine} variant="secondary">
                <DownloadIcon size={18} />
                Download all my photos
              </Button>
            )}

            <Button onClick={() => setScanModalOpen(true)} variant="secondary">
              <FaceIcon size={18} />
              {scanToken ? "Scan again" : "Find my photos"}
            </Button>

            {settings.allow_attendee_uploads && (
              <Button onClick={() => setUploadModalOpen(true)} variant="primary">
                <UploadIcon size={18} />
                Upload photos
              </Button>
            )}
            <div style={{ marginLeft: 8, paddingLeft: 12, borderLeft: "1px solid var(--rule)" }}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>

      {/* ── Gallery Content ───────────────────────────────────── */}
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "32px clamp(20px, 5vw, 60px) 60px",
        }}
      >
        <AnimatePresence mode="wait">
          {viewMode === "all" ? (
            <motion.div key="all" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {allPhotos.length === 0 ? <EmptyStateNoPhotos /> : <PhotoGrid photos={viewMode === "all" ? allPhotos : myPhotos} onDownload={handleDownload} emptyState={<EmptyStateNoPhotos />} />}
            </motion.div>
          ) : (
            <motion.div key="mine" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}>
              {!scanToken ? (
                <EmptyStateScanPrompt onScan={() => setScanModalOpen(true)} />
              ) : myPhotos.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60 }}>
                  <p
                    style={{
                      fontFamily: "var(--font-body)",
                      color: "var(--ink-2)",
                      marginBottom: 20,
                    }}
                  >
                    No photos found matching your face.
                  </p>
                  <Button onClick={() => setScanModalOpen(true)} variant="primary">
                    Try another photo
                  </Button>
                </div>
              ) : (
                <PhotoGrid
                  photos={myPhotos}
                  onDownload={handleDownload}
                  emptyState={
                    <div style={{ textAlign: "center", padding: 60 }}>
                      <p style={{ fontFamily: "var(--font-body)", color: "var(--ink-2)" }}>No photos found</p>
                    </div>
                  }
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Modals ────────────────────────────────────────────── */}
      <FaceScanModal isOpen={scanModalOpen} onClose={() => setScanModalOpen(false)} eventId={eventId} onScanComplete={handleScanComplete} />

      <UploadModal isOpen={uploadModalOpen} onClose={() => setUploadModalOpen(false)} eventId={eventId} />

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer
        style={{
          borderTop: "1px solid var(--rule)",
          padding: "40px clamp(20px, 5vw, 60px)",
          textAlign: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            marginBottom: 12,
          }}
        >
          <svg width="20" height="20" viewBox="0 0 26 26" fill="none">
            <rect width="26" height="26" rx="5" fill="var(--coral)" />
            <path d="M7 13.5L11.5 18L19 8" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--ink)",
            }}
          >
            Galler<em style={{ fontStyle: "italic", color: "var(--coral)" }}>AI</em>
          </span>
        </div>
        <p
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            color: "var(--ink-2)",
          }}
        >
          Powered by AI face recognition
        </p>
      </footer>
    </div>
  );
}
