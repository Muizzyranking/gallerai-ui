"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { events as eventsApi, type Photo, type PhotoProcessingStatus, photos as photosApi } from "@/lib/api";

/* ── Icons ─────────────────────────────────────────────────── */
const UploadIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17,8 12,3 7,8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const ImageIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
    <circle cx="8.5" cy="8.5" r="1.5"/>
    <polyline points="21,15 16,10 5,21"/>
  </svg>
);

const CheckIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="20,6 9,17 4,12"/>
  </svg>
);

const XIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ProcessingIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" style={{ animation: "spin 1s linear infinite" }}>
    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
  </svg>
);

const ArrowLeftIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
);

const SettingsIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

/* ── Types ─────────────────────────────────────────────────── */
interface UploadingFile {
  id: string;
  file: File;
  progress: number;
  status: "pending" | "uploading" | "processing" | "complete" | "error";
  result?: Photo;
  error?: string;
}

/* ── Components ────────────────────────────────────────────── */
function ProgressBar({ progress, status }: { progress: number; status: UploadingFile["status"] }) {
  const getColor = () => {
    switch (status) {
      case "complete": return "#10b981";
      case "error": return "#ef4444";
      case "processing": return "#f59e0b";
      default: return "var(--coral)";
    }
  };

  return (
    <div style={{ width: "100%", height: 4, background: "var(--bg-3)", borderRadius: 2, overflow: "hidden" }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.3 }}
        style={{ height: "100%", background: getColor(), borderRadius: 2 }}
      />
    </div>
  );
}

function FilePreview({ file, onRemove, status, progress }: { 
  file: File; 
  onRemove: () => void;
  status: UploadingFile["status"];
  progress: number;
}) {
  const [preview, setPreview] = useState<string>("");

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const getStatusIcon = () => {
    switch (status) {
      case "complete": return <CheckIcon size={16} />;
      case "error": return <XIcon size={16} />;
      case "processing": return <ProcessingIcon size={16} />;
      case "uploading": return <ProcessingIcon size={16} />;
      default: return null;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "complete": return "#10b981";
      case "error": return "#ef4444";
      case "processing": return "#f59e0b";
      default: return "var(--ink-2)";
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: 12,
        background: "var(--bg-1)",
        border: "1px solid var(--rule)",
        borderRadius: 10,
        borderLeftWidth: 3,
        borderLeftColor: getStatusColor(),
      }}
    >
      {/* Thumbnail */}
      <div style={{ 
        width: 48, 
        height: 48, 
        borderRadius: 6, 
        background: "var(--bg-2)",
        overflow: "hidden",
        flexShrink: 0,
      }}>
        {file.type.startsWith("image/") ? (
          <img 
            src={URL.createObjectURL(file)} 
            alt="" 
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
            onLoad={(e) => setPreview((e.target as HTMLImageElement).src)}
          />
        ) : (
          <div style={{ 
            width: "100%", 
            height: "100%", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            color: "var(--ink-2)",
          }}>
            <ImageIcon size={20} />
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ 
          fontFamily: "var(--font-body)", 
          fontSize: "0.85rem", 
          color: "var(--ink)",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          marginBottom: 4,
        }}>
          {file.name}
        </div>
        <div style={{ 
          fontFamily: "var(--font-mono)", 
          fontSize: "0.7rem", 
          color: "var(--ink-2)",
          marginBottom: 6,
        }}>
          {formatSize(file.size)}
        </div>
        <ProgressBar progress={progress} status={status} />
      </div>

      {/* Status / Remove */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ 
          color: getStatusColor(),
          display: "flex",
          alignItems: "center",
        }}>
          {getStatusIcon()}
        </span>
        {(status === "pending" || status === "error") && (
          <button
            onClick={onRemove}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "var(--ink-2)",
              padding: 4,
              display: "flex",
              borderRadius: 4,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--coral)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"}
          >
            <XIcon size={16} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function DropZone({ onFiles, disabled }: { onFiles: (files: File[]) => void; disabled?: boolean }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    
    const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith("image/"));
    onFiles(files);
  }, [onFiles, disabled]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith("image/"));
    onFiles(files);
    e.target.value = ""; // Reset
  };

  return (
    <label
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
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
      <div style={{
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: isDragging ? "var(--coral)" : "var(--bg-2)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isDragging ? "#fff" : "var(--coral)",
        transition: "all 0.2s",
      }}>
        <UploadIcon size={28} />
      </div>
      <div style={{ textAlign: "center" }}>
        <div style={{ 
          fontFamily: "var(--font-body)", 
          fontSize: "1rem", 
          fontWeight: 500,
          color: "var(--ink)",
          marginBottom: 6,
        }}>
          {isDragging ? "Drop photos here" : "Click or drag photos here"}
        </div>
        <div style={{ 
          fontFamily: "var(--font-body)", 
          fontSize: "0.85rem", 
          color: "var(--ink-2)",
        }}>
          Supports JPG, PNG, HEIC up to 20MB each
        </div>
      </div>
      <input 
        type="file" 
        accept="image/*" 
        multiple 
        onChange={handleChange}
        disabled={disabled}
        style={{ display: "none" }}
      />
    </label>
  );
}

function ProcessingStatus({ status }: { status: PhotoProcessingStatus | undefined }) {
  if (!status) return null;

  const total = status.total || 0;
  const processed = status.processed || 0;
  const pending = status.pending || 0;
  const failed = status.failed || 0;

  if (total === 0) return null;

  return (
    <div style={{
      padding: 16,
      background: "var(--bg-1)",
      border: "1px solid var(--rule)",
      borderRadius: 10,
      marginBottom: 24,
    }}>
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: 12,
      }}>
        <h4 style={{ 
          fontFamily: "var(--font-body)", 
          fontSize: "0.9rem", 
          fontWeight: 600,
          color: "var(--ink)",
        }}>
          Processing Status
        </h4>
        <span style={{ 
          fontFamily: "var(--font-mono)", 
          fontSize: "0.75rem",
          color: "var(--ink-2)",
        }}>
          {processed}/{total} complete
        </span>
      </div>
      
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#10b981" }} />
          <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)" }}>
            {processed} processed
          </span>
        </div>
        {pending > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f59e0b" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)" }}>
              {pending} pending
            </span>
          </div>
        )}
        {failed > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ef4444" }} />
            <span style={{ fontFamily: "var(--font-body)", fontSize: "0.8rem", color: "var(--ink-2)" }}>
              {failed} failed
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main Page ─────────────────────────────────────────────── */
export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id as string;
  const qc = useQueryClient();

  const [files, setFiles] = useState<UploadingFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Fetch event details
  const { data: event, isLoading: eventLoading } = useQuery({
    queryKey: ["event", eventId],
    queryFn: () => eventsApi.get(eventId),
  });

  // Fetch processing status
  const { data: processingStatus } = useQuery({
    queryKey: ["photos-status", eventId],
    queryFn: () => photosApi.status(eventId),
    refetchInterval: 5000, // Poll every 5 seconds
  });

  // Fetch existing photos
  const { data: existingPhotos = [] } = useQuery({
    queryKey: ["photos", eventId],
    queryFn: () => photosApi.list(eventId),
  });

  const uploadMutation = useMutation({
    mutationFn: (files: File[]) => photosApi.bulkUpload(eventId, files),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["photos", eventId] });
      qc.invalidateQueries({ queryKey: ["photos-status", eventId] });
    },
  });

  const handleFiles = (newFiles: File[]) => {
    const uploads: UploadingFile[] = newFiles.map((file, i) => ({
      id: `${Date.now()}-${i}`,
      file,
      progress: 0,
      status: "pending",
    }));
    setFiles(prev => [...prev, ...uploads]);
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleUpload = async () => {
    const pendingFiles = files.filter(f => f.status === "pending");
    if (pendingFiles.length === 0) return;

    setIsUploading(true);

    // Update status to uploading
    setFiles(prev => prev.map(f => 
      pendingFiles.find(pf => pf.id === f.id) 
        ? { ...f, status: "uploading", progress: 10 }
        : f
    ));

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map(f => 
          f.status === "uploading" && f.progress < 90
            ? { ...f, progress: f.progress + 10 }
            : f
        ));
      }, 200);

      const result = await uploadMutation.mutateAsync(pendingFiles.map(f => f.file));
      
      clearInterval(progressInterval);

      // Mark as complete
      setFiles(prev => prev.map(f => {
        const pendingMatch = pendingFiles.find(pf => pf.id === f.id);
        if (pendingMatch) {
          const uploadedPhoto = result.find((p: Photo) => 
            p.url.includes(pendingMatch.file.name.split('.')[0])
          );
          return { 
            ...f, 
            status: "complete", 
            progress: 100,
            result: uploadedPhoto,
          };
        }
        return f;
      }));

      // After a delay, mark as processing (face recognition)
      setTimeout(() => {
        setFiles(prev => prev.map(f => 
          pendingFiles.find(pf => pf.id === f.id)
            ? { ...f, status: "processing" }
            : f
        ));
      }, 500);

    } catch (error) {
      setFiles(prev => prev.map(f => 
        pendingFiles.find(pf => pf.id === f.id)
          ? { ...f, status: "error", error: "Upload failed" }
          : f
      ));
    } finally {
      setIsUploading(false);
    }
  };

  const pendingCount = files.filter(f => f.status === "pending").length;
  const completedCount = files.filter(f => f.status === "complete" || f.status === "processing").length;

  if (eventLoading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        background: "var(--bg)",
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: "3px solid var(--coral)",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 1s linear infinite",
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const PAD = "clamp(20px, 4vw, 44px)";

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      {/* ── Header ────────────────────────────────────────────── */}
      <div style={{ 
        padding: `32px ${PAD} 24px`,
        borderBottom: "1px solid var(--rule)",
        background: "var(--bg-1)",
      }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          {/* Breadcrumb */}
          <Link 
            href={`/events/${eventId}/settings`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-body)",
              fontSize: "0.85rem",
              color: "var(--ink-2)",
              textDecoration: "none",
              marginBottom: 16,
              transition: "color 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--ink)"}
            onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"}
          >
            <ArrowLeftIcon size={14} />
            Back to event settings
          </Link>

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <p className="label-coral" style={{ marginBottom: 8 }}>Upload Photos</p>
              <h1 style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "clamp(1.8rem, 4vw, 2.4rem)", 
                fontWeight: 600,
                color: "var(--ink)",
                lineHeight: 1.2,
              }}>
                {event?.title}
              </h1>
              <p style={{ 
                fontFamily: "var(--font-body)", 
                fontSize: "0.9rem", 
                color: "var(--ink-2)",
                marginTop: 8,
              }}>
                {existingPhotos.length} photos in gallery
              </p>
            </div>

            <Link 
              href={`/events/${eventId}/settings`}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 18px",
                background: "var(--bg-2)",
                border: "1px solid var(--rule-strong)",
                borderRadius: 8,
                fontFamily: "var(--font-body)",
                fontSize: "0.85rem",
                fontWeight: 500,
                color: "var(--ink)",
                textDecoration: "none",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--bg-3)";
                el.style.borderColor = "var(--ink-3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.background = "var(--bg-2)";
                el.style.borderColor = "var(--rule-strong)";
              }}
            >
              <SettingsIcon size={16} />
              Event Settings
            </Link>
          </div>
        </div>
      </div>

      {/* ── Content ───────────────────────────────────────────── */}
      <div style={{ padding: `32px ${PAD}`, maxWidth: 800, margin: "0 auto" }}>
        
        {/* Processing Status */}
        <ProcessingStatus status={processingStatus} />

        {/* Upload Area */}
        <div style={{ marginBottom: 32 }}>
          <DropZone 
            onFiles={handleFiles} 
            disabled={isUploading}
          />
        </div>

        {/* File List */}
        <AnimatePresence>
          {files.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              style={{ marginBottom: 24 }}
            >
              <div style={{ 
                display: "flex", 
                alignItems: "center", 
                justifyContent: "space-between",
                marginBottom: 16,
              }}>
                <h3 style={{ 
                  fontFamily: "var(--font-body)", 
                  fontSize: "1rem", 
                  fontWeight: 600,
                  color: "var(--ink)",
                }}>
                  Queue ({files.length})
                </h3>
                {pendingCount > 0 && (
                  <button
                    onClick={() => setFiles([])}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontFamily: "var(--font-body)",
                      fontSize: "0.8rem",
                      color: "var(--ink-2)",
                      transition: "color 0.15s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "var(--coral)"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "var(--ink-2)"}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <AnimatePresence>
                  {files.map((file) => (
                    <FilePreview
                      key={file.id}
                      file={file.file}
                      status={file.status}
                      progress={file.progress}
                      onRemove={() => removeFile(file.id)}
                    />
                  ))}
                </AnimatePresence>
              </div>

              {/* Upload Button */}
              {pendingCount > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  style={{ marginTop: 24 }}
                >
                  <button
                    onClick={handleUpload}
                    disabled={isUploading}
                    style={{
                      width: "100%",
                      padding: "14px 24px",
                      background: "var(--coral)",
                      border: "none",
                      borderRadius: 8,
                      fontFamily: "var(--font-body)",
                      fontSize: "0.95rem",
                      fontWeight: 600,
                      color: "#fff",
                      cursor: isUploading ? "not-allowed" : "pointer",
                      opacity: isUploading ? 0.7 : 1,
                      transition: "all 0.2s",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: 8,
                    }}
                    onMouseEnter={(e) => {
                      if (!isUploading) (e.currentTarget as HTMLElement).style.background = "#e55a5a";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.background = "var(--coral)";
                    }}
                  >
                    {isUploading ? (
                      <>
                        <ProcessingIcon size={18} />
                        Uploading {pendingCount} photos...
                      </>
                    ) : (
                      <>
                        <UploadIcon size={18} />
                        Upload {pendingCount} photo{pendingCount !== 1 ? "s" : ""}
                      </>
                    )}
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Message */}
        {completedCount > 0 && pendingCount === 0 && files.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              padding: 20,
              background: "rgba(16,185,129,0.1)",
              border: "1px solid rgba(16,185,129,0.3)",
              borderRadius: 10,
              textAlign: "center",
            }}
          >
            <div style={{ 
              width: 48, 
              height: 48, 
              borderRadius: "50%", 
              background: "#10b981",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 12px",
              color: "#fff",
            }}>
              <CheckIcon size={24} />
            </div>
            <h3 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "1.1rem", 
              fontWeight: 600,
              color: "var(--ink)",
              marginBottom: 8,
            }}>
              Upload complete!
            </h3>
            <p style={{ 
              fontFamily: "var(--font-body)", 
              fontSize: "0.9rem", 
              color: "var(--ink-2)",
              marginBottom: 16,
            }}>
              {completedCount} photo{completedCount !== 1 ? "s" : ""} uploaded. Face recognition is processing in the background.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                onClick={() => setFiles([])}
                style={{
                  padding: "10px 20px",
                  background: "var(--bg-2)",
                  border: "1px solid var(--rule-strong)",
                  borderRadius: 6,
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "var(--ink)",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--bg-3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = "var(--bg-2)";
                }}
              >
                Upload more
              </button>
              <Link
                href={`/events/${eventId}/settings`}
                style={{
                  padding: "10px 20px",
                  background: "var(--coral)",
                  border: "none",
                  borderRadius: 6,
                  fontFamily: "var(--font-body)",
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#fff",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "#e55a5a";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.background = "var(--coral)";
                }}
              >
                Back to settings
              </Link>
            </div>
          </motion.div>
        )}

        {/* Tips */}
        <div style={{ 
          marginTop: 48,
          padding: 24,
          background: "var(--bg-1)",
          border: "1px solid var(--rule)",
          borderRadius: 10,
        }}>
          <h4 style={{ 
            fontFamily: "var(--font-body)", 
            fontSize: "0.9rem", 
            fontWeight: 600,
            color: "var(--ink)",
            marginBottom: 12,
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
            Tips for best results
          </h4>
          <ul style={{ 
            margin: 0, 
            paddingLeft: 20,
            fontFamily: "var(--font-body)",
            fontSize: "0.85rem",
            color: "var(--ink-2)",
            lineHeight: 1.8,
          }}>
            <li>Upload high-resolution photos for better face recognition accuracy</li>
            <li>Photos with clear, front-facing faces work best</li>
            <li>Avoid heavily filtered or edited images</li>
            <li>Processing time varies based on number of faces detected</li>
          </ul>
        </div>
      </div>

      <style>{`
        .label-coral {
          font-family: var(--font-mono);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          color: var(--coral);
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
