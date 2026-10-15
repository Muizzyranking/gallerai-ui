const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Envelope<T> {
  message: string;
  data: T | null;
  errors?: FieldIssue[] | null;
  meta?: PageMeta | null;
}

export interface PageMeta {
  total: number;
  page: number;
  page_size: number;
  pages: number;
}

export interface FieldIssue {
  field: string;
  message: string;
  type?: string;
}

export type AccessMode = "public" | "private" | "link" | "code" | "approved_list" | "combined";
export type EventStatus = "active" | "inactive" | "archived";

export function isPrivateMode(mode: AccessMode | string | null | undefined): boolean {
  return mode !== "public" && mode !== "link";
}

export function accessModeLabel(mode: AccessMode | string | null | undefined): string {
  switch (mode) {
    case "private":
      return "Private";
    case "code":
      return "Access code";
    case "approved_list":
      return "Invite only";
    case "combined":
      return "Code + invite";
    default:
      return "Public";
  }
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  is_email_confirmed: boolean;
  pending_email: string | null;
  auth_provider: string | null;
  is_admin: boolean;
  is_active: boolean;
  face_updated_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface EventSettings {
  allow_attendee_uploads: boolean;
  require_upload_approval: boolean;
  downloads_enabled: boolean;
  gallery_visible: boolean;
}

export interface Event {
  id: string;
  owner_id: string | null;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_photo_url: string | null;
  status: EventStatus;
  is_private: boolean;
  access_mode: AccessMode;
  settings: EventSettings;
  created_at: string;
  updated_at: string;
}

/** FullEventResponse — organiser detail view, includes the access_code. */
export interface FullEvent extends Event {
  access_code: string | null;
}

export interface PublicEvent {
  id: string;
  title: string;
  description: string | null;
  event_date: string | null;
  cover_photo_url: string | null;
  is_private: boolean;
  access_mode: AccessMode;
  allow_attendee_uploads: boolean;
  require_upload_approval: boolean;
  downloads_enabled: boolean;
  gallery_visible: boolean;
  counts: MediaCounts;
}

export interface AccessConfig {
  access_mode: "public" | "private";
  access_code?: string | null;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  event_date?: string;
  access_config: AccessConfig;
  settings?: Partial<EventSettings>;
}

export interface UpdateEventPayload {
  title?: string;
  description?: string;
  event_date?: string;
  is_private?: boolean;
  status?: EventStatus;
  access_config?: AccessConfig;
  settings?: Partial<EventSettings>;
}

/* ══════════════════════════════════════════════════════════════
   MEDIA — gallery cards, uploads, bin, approval
   ══════════════════════════════════════════════════════════════ */

export type MediaType = "image" | "video";
export type MediaTypeFilter = "all" | MediaType;

export interface MediaUrls {
  thumbnail: string;
  display: string;
  download: string;
}

export interface MediaCard {
  id: string;
  event_id: string;
  media_type: MediaType;
  filename: string;
  mime_type: string;
  face_count: number;
  width: number | null;
  height: number | null;
  created_at: string;
  urls: MediaUrls;
  match_score: number | null;
}

export interface MediaCounts {
  total: number;
  images: number;
  videos: number;
}

export interface UploadResult {
  accepted: number;
  skipped: number;
  media_ids: string[];
}

export interface UploadProgress {
  total: number;
  completed: number;
  failed: number;
  percent: number;
  eta_seconds: number | null;
}

export interface BinEvent {
  event_id: string;
  title: string;
  deleted_count: number;
}

/** Creator triage view: card + pipeline state. */
export interface MediaManageCard extends MediaCard {
  status: string;
  storage_status: string;
  is_private: boolean;
  error_message: string | null;
}

export interface EmptyBinResult {
  removed: number;
}

export interface MemberInfo {
  id: string;
  user_id: string;
  email: string;
  display_name: string;
  status: string;
  created_at: string;
}

export interface ListParams {
  type?: MediaTypeFilter;
  page?: number;
  page_size?: number;
}

export interface Paginated<T> {
  items: T[];
  meta: PageMeta;
}

/* ══════════════════════════════════════════════════════════════
   FACES / GALLERY / DOWNLOADS
   ══════════════════════════════════════════════════════════════ */

export interface ScanJob {
  job_id: string;
  status: "queued";
}

export type ScanJobState = "queued" | "processing" | "done" | "failed";

export interface ScanJobStatus {
  job_id: string;
  status: ScanJobState;
  scan_token?: string | null;
  match_count?: number | null;
  expires_in_seconds?: number | null;
  error?: string | null;
}

/** Completed scan handed to the gallery view. */
export interface ScanComplete {
  scan_token: string;
  match_count: number;
}

export type FlagReason = "not_me" | "dislike" | "removed";

export interface FlagInput {
  media_id: string;
  reason: FlagReason;
  scan_token?: string | null;
  note?: string | null;
}

export interface FlagItem {
  id: string;
  media_id: string;
  reason: string;
  note: string | null;
  created_at: string;
}

export interface ZipInput {
  mode: "all" | "selection" | "scan";
  media_ids?: string[];
  scan_token?: string | null;
  media_type?: MediaTypeFilter;
}

export class ApiError extends Error {
  public status: number;
  public fieldErrors: Record<string, string>;
  public issues: FieldIssue[];

  constructor(status: number, message: string, issues?: FieldIssue[] | null) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.issues = issues ?? [];
    this.fieldErrors = {};
    for (const issue of this.issues) {
      const field = (issue.field ?? "").replace(/^(body|query|path)\./, "");
      if (field && !(field in this.fieldErrors)) this.fieldErrors[field] = issue.message;
    }
  }

  get hasFieldErrors(): boolean {
    return Object.keys(this.fieldErrors).length > 0;
  }
}

function qs(params: Record<string, string | number | null | undefined>): string {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null || v === "") continue;
    sp.set(k, String(v));
  }
  const s = sp.toString();
  return s ? `?${s}` : "";
}

async function request<T>(method: string, path: string, body?: unknown, options?: { formData?: FormData }): Promise<T> {
  const isForm = !!options?.formData;
  const res = await fetch(`/api/proxy${path}`, {
    method,
    credentials: "include",
    headers: isForm ? {} : { "Content-Type": "application/json" },
    body: isForm ? options?.formData : body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok) {
    throw new ApiError(res.status, json?.message ?? res.statusText, json?.errors);
  }

  if (json && typeof json === "object" && "data" in json) {
    return (json as Envelope<T>).data as T;
  }

  return json as T;
}

async function requestPage<T>(path: string): Promise<Paginated<T>> {
  const res = await fetch(`/api/proxy${path}`, { credentials: "include" });

  const json = (await res.json().catch(() => null)) as Envelope<T[]> | null;

  if (!res.ok) {
    throw new ApiError(res.status, json?.message ?? res.statusText, json?.errors);
  }

  return {
    items: (json?.data ?? []) as T[],
    meta: json?.meta ?? { total: (json?.data ?? []).length, page: 1, page_size: (json?.data ?? []).length, pages: 1 },
  };
}

async function requestAuth<T>(method: string, path: string, body?: unknown): Promise<Envelope<T>> {
  const res = await fetch(path, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const json = (await res.json().catch(() => null)) as Envelope<T> | null;

  if (!res.ok) {
    throw new ApiError(res.status, json?.message ?? res.statusText, json?.errors);
  }

  return { message: json?.message ?? "Request processed successfully", data: (json?.data ?? null) as T | null };
}

const get = <T>(p: string) => request<T>("GET", p);
const post = <T>(p: string, b?: unknown) => request<T>("POST", p, b);
const patch = <T>(p: string, b?: unknown) => request<T>("PATCH", p, b);
const del = <T>(p: string) => request<T>("DELETE", p);
const delBody = <T>(p: string, b?: unknown) => request<T>("DELETE", p, b);
const postForm = <T>(p: string, fd: FormData) => request<T>("POST", p, undefined, { formData: fd });

export interface LoginResult {
  message: string;
  user: User | null;
}

export interface RegisterResult {
  message: string;
}

export const auth = {
  register: async (p: { display_name: string; email: string; password: string }): Promise<RegisterResult> => {
    const env = await requestAuth<null>("POST", "/api/auth/register", p);
    return { message: env.message };
  },

  registerConfirm: (p: { token: string }) => post<{ message?: string } | null>("/api/v1/auth/register/confirm", p),

  verifyEmail: (p: { token: string }) => post<{ message?: string } | null>("/api/v1/auth/verify-email", p),

  resendEmailVerification: (p: { email: string }) =>
    post<{ message?: string } | null>("/api/v1/auth/resend-email-verification", p),

  login: async (p: { email: string; password: string }): Promise<LoginResult> => {
    const env = await requestAuth<User>("POST", "/api/auth/login", p);
    return { message: env.message, user: env.data };
  },

  googleSignIn: async (idToken: string): Promise<LoginResult> => {
    const env = await requestAuth<User>("POST", "/api/auth/google", { id_token: idToken });
    return { message: env.message, user: env.data };
  },

  forgotPassword: (p: { email: string }) => post<{ message?: string } | null>("/api/v1/auth/forgot-password", p),

  resetPassword: (p: { token: string; new_password: string }) =>
    post<{ message?: string } | null>("/api/v1/auth/reset-password", p),

  changePassword: (p: { current_password: string; new_password: string }) =>
    post<{ message?: string } | null>("/api/v1/auth/change-password", p),

  me: async (): Promise<User> => {
    const env = await requestAuth<User>("GET", "/api/auth/me");
    if (!env.data) throw new ApiError(401, env.message || "Not signed in");
    return env.data;
  },

  updateMe: (p: { display_name?: string; email?: string }) => patch<User>("/api/v1/auth/me", p),

  deleteMe: (p: { current_password: string }) => delBody<void>("/api/v1/auth/me", p),

  logout: async (p?: { all_sessions?: boolean }): Promise<void> => {
    await requestAuth<null>("POST", "/api/auth/logout", p ?? {});
  },
};

/* ══════════════════════════════════════════════════════════════
   EVENTS
   ══════════════════════════════════════════════════════════════ */
export const events = {
  list: () => get<Event[]>("/api/v1/events"),

  create: (p: CreateEventPayload) => post<Event>("/api/v1/events", p),

  /** Full detail for organisers — includes access_code. */
  get: (id: string) => get<FullEvent>(`/api/v1/events/${id}`),

  update: (id: string, p: UpdateEventPayload) => patch<FullEvent>(`/api/v1/events/${id}`, p),

  delete: (id: string) => del<void>(`/api/v1/events/${id}`),

  verifyAccess: (id: string, access_code: string) =>
    post<{ message?: string } | null>(`/api/v1/events/${id}/access/verify`, { access_code }),

  /** Attendee header (title, description, flags, counts). Anon OK;
   *  pass access_code on first private-event request. */
  public: (id: string, access_code?: string) => get<PublicEvent>(`/api/v1/events/${id}/public${qs({ access_code })}`),

  addMember: (id: string, p: { user_id?: string; email?: string }) =>
    post<{ member_id: string }>(`/api/v1/events/${id}/members`, p),

  /** Creator only — co-organizers get 403. */
  listMembers: (id: string) => get<MemberInfo[]>(`/api/v1/events/${id}/members`),

  removeMember: (id: string, user_id: string) => del<void>(`/api/v1/events/${id}/members/${user_id}`),

  /** Organiser media list — excludes bin + pending-approval. No access code needed. */
  organizerMedia: (id: string, params?: ListParams) =>
    requestPage<MediaCard>(
      `/api/v1/events/${id}/media${qs({ type: params?.type ?? "all", page: params?.page ?? 1, page_size: params?.page_size ?? 50 })}`,
    ),

  /** Organiser tab counts for one event. */
  organizerCounts: (id: string) => get<MediaCounts>(`/api/v1/events/${id}/media/counts`),
};

/* ══════════════════════════════════════════════════════════════
   MEDIA — uploads, gallery listing, counts, bin, approval
   ══════════════════════════════════════════════════════════════ */
export const media = {
  /** Organiser bulk upload (multipart, repeated `files` field). */
  upload: (eventId: string, files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => {
      fd.append("files", f);
    });
    return postForm<UploadResult>(`/api/v1/media/${eventId}`, fd);
  },

  /** Attendee upload — anonymous OK when event allows it. */
  attendeeUpload: (eventId: string, files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => {
      fd.append("files", f);
    });
    return postForm<UploadResult>(`/api/v1/media/${eventId}/attendee-upload`, fd);
  },

  /** Paginated gallery listing with tab filter. Pass access_code on first
   *  private-event request; the backend cookie covers later requests. */
  list: (eventId: string, params?: ListParams & { access_code?: string }) =>
    requestPage<MediaCard>(
      `/api/v1/media/${eventId}${qs({ type: params?.type ?? "all", page: params?.page ?? 1, page_size: params?.page_size ?? 50, access_code: params?.access_code })}`,
    ),

  counts: (eventId: string, access_code?: string) =>
    get<MediaCounts>(`/api/v1/media/${eventId}/counts${qs({ access_code })}`),

  /** Organiser triage: every file with pipeline status + errors. */
  manage: (eventId: string, params?: ListParams) =>
    requestPage<MediaManageCard>(
      `/api/v1/media/${eventId}/manage${qs({ type: params?.type ?? "all", page: params?.page ?? 1, page_size: params?.page_size ?? 50 })}`,
    ),

  /** SSE upload-progress URL (same-origin via proxy so cookies attach). */
  progressUrl: (eventId: string, access_code?: string) =>
    `/api/proxy/api/v1/media/${eventId}/upload-progress${qs({ access_code })}`,

  /** Backend serve paths (thumbnail/display/download) must go through the
   *  proxy so Bearer + event-access cookies attach. */
  proxyUrl: (path: string) => {
    if (!path) return path;
    if (path.startsWith("http") || path.startsWith("/api/proxy/")) return path;
    return `/api/proxy${path}`;
  },

  /** Direct backend URL (no auth context) — avoid for gated content. */
  directUrl: (path: string) => {
    if (!path || path.startsWith("http")) return path;
    return `${BASE}${path}`;
  },

  softDelete: (eventId: string, mediaId: string) => del<void>(`/api/v1/media/${eventId}/${mediaId}`),

  bin: (eventId: string, params?: { page?: number; page_size?: number }) =>
    requestPage<MediaCard>(
      `/api/v1/media/${eventId}/bin${qs({ page: params?.page ?? 1, page_size: params?.page_size ?? 50 })}`,
    ),

  binEvents: (eventId: string) => get<BinEvent[]>(`/api/v1/media/${eventId}/bin/events`),

  restore: (eventId: string, mediaId: string) =>
    post<{ media_id: string }>(`/api/v1/media/${eventId}/${mediaId}/restore`),

  hardDelete: (eventId: string, mediaId: string) => del<void>(`/api/v1/media/${eventId}/${mediaId}/hard`),

  emptyBin: (eventId: string) => post<EmptyBinResult>(`/api/v1/media/${eventId}/bin/empty`),

  pendingApproval: (eventId: string, params?: { page?: number; page_size?: number }) =>
    requestPage<MediaCard>(
      `/api/v1/media/${eventId}/pending-approval${qs({ page: params?.page ?? 1, page_size: params?.page_size ?? 50 })}`,
    ),

  approve: (eventId: string, mediaId: string) =>
    post<{ media_id: string }>(`/api/v1/media/${eventId}/${mediaId}/approve`),

  reject: (eventId: string, mediaId: string) =>
    post<{ media_id: string }>(`/api/v1/media/${eventId}/${mediaId}/reject`),
};

/* ══════════════════════════════════════════════════════════════
   FACES — anonymous selfie scan jobs (no login, ever)
   ML runs on workers; the API stages + enqueues, frontend polls.
   ══════════════════════════════════════════════════════════════ */
export const faces = {
  /** Stage a selfie → 202 {job_id, status:"queued"}. */
  scan: (eventId: string, file: File, access_code?: string) => {
    const fd = new FormData();
    fd.append("file", file);
    return postForm<ScanJob>(`/api/v1/events/${eventId}/faces/scan${qs({ access_code })}`, fd);
  },

  /** Poll every ~2s → queued | processing | done | failed. */
  scanStatus: (eventId: string, jobId: string, access_code?: string) =>
    get<ScanJobStatus>(`/api/v1/events/${eventId}/faces/scan/${jobId}${qs({ access_code })}`),
};

/* ══════════════════════════════════════════════════════════════
   GALLERY — attendee-oriented listing, matches, flags
   ══════════════════════════════════════════════════════════════ */
export const gallery = {
  full: (eventId: string, params?: ListParams & { access_code?: string }) =>
    requestPage<MediaCard>(
      `/api/v1/events/${eventId}/gallery${qs({ type: params?.type ?? "all", page: params?.page ?? 1, page_size: params?.page_size ?? 50, access_code: params?.access_code })}`,
    ),

  anonymous: (eventId: string, token: string, params?: ListParams) =>
    requestPage<MediaCard>(
      `/api/v1/events/${eventId}/gallery/anonymous${qs({ token, type: params?.type ?? "all", page: params?.page ?? 1, page_size: params?.page_size ?? 50 })}`,
    ),

  /** Anonymous feedback — never deletes media, pure organiser signal. */
  flag: (eventId: string, p: FlagInput) => post<{ flag_id: string }>(`/api/v1/events/${eventId}/gallery/flag`, p),

  flags: (eventId: string, params?: ListParams) =>
    requestPage<FlagItem>(
      `/api/v1/events/${eventId}/gallery/flags${qs({ type: params?.type ?? "all", page: params?.page ?? 1, page_size: params?.page_size ?? 50 })}`,
    ),
};

/* ══════════════════════════════════════════════════════════════
   DOWNLOADS
   ══════════════════════════════════════════════════════════════ */
export const downloads = {
  /** Single file — proxied so event-access cookies attach. */
  singleUrl: (eventId: string, mediaId: string) => `/api/proxy/api/v1/events/${eventId}/downloads/${mediaId}/download`,

  /** Zip stream (all | selection | scan). Triggers a browser download. */
  zip: async (eventId: string, p: ZipInput): Promise<void> => {
    const res = await fetch(`/api/proxy/api/v1/events/${eventId}/downloads/zip`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });
    if (!res.ok) {
      const json = (await res.json().catch(() => null)) as Envelope<null> | null;
      throw new ApiError(res.status, json?.message ?? res.statusText, json?.errors);
    }
    const blob = await res.blob();
    const disposition = res.headers.get("content-disposition") ?? "";
    const match = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i);
    const filename = match?.[1] ? decodeURIComponent(match[1].replace(/"/g, "")) : `event-${eventId}.zip`;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 10_000);
  },
};

/* ══════════════════════════════════════════════════════════════
   HEALTH
   ══════════════════════════════════════════════════════════════ */
export const health = {
  check: () => get<{ status: string }>("/health"),
};
