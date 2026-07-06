const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface ApiEnvelope<T> {
  message: string;
  data: T;
}

/**
 * "link"          → public — anyone with the URL can access
 * "code"          → requires an access code
 * "approved_list" → requires an email invite
 * "combined"      → requires both code AND invite
 *
 * Rule: access_mode === "link" means public. Everything else is private.
 */
export type AccessMode = "link" | "code" | "approved_list" | "combined";
export type EventStatus = "active" | "inactive" | "archived";

export function isPrivateMode(mode: AccessMode): boolean {
  return mode !== "link";
}

export function accessModeLabel(mode: AccessMode): string {
  switch (mode) {
    case "link":
      return "Public";
    case "code":
      return "Access code";
    case "approved_list":
      return "Invite only";
    case "combined":
      return "Code + invite";
  }
}

export interface User {
  id: string;
  email: string;
  display_name: string;
  face_updated_at: string | null;
  created_at: string;
}

export interface AuthTokenData {
  access_token: string;
  token_type: string;
}

export interface EventSettings {
  allow_attendee_uploads: boolean;
  require_upload_approval: boolean;
  downloads_enabled: boolean;
  gallery_visible: boolean;
}

/**
 * EventResponse — shape returned by the API.
 * access_mode and is_private are top-level fields.
 * There is NO access_config or access_code in the response.
 */
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

/**
 * AccessConfig — used only in CREATE request payloads.
 * Never present in a response.
 */
export interface AccessConfig {
  access_mode: AccessMode;
  access_code?: string | null;
}

/** Create payload — matches EventCreate pydantic schema */
export interface CreateEventPayload {
  title: string;
  description?: string;
  event_date?: string;
  access_config: AccessConfig;
  settings?: Partial<EventSettings>;
}

/**
 * Update payload — matches EventUpdate pydantic schema.
 * Note: access_mode cannot be changed after creation via this endpoint.
 * Use is_private to toggle private/public.
 */
export interface UpdateEventPayload {
  title?: string;
  description?: string;
  event_date?: string;
  is_private?: boolean;
  status?: EventStatus;
  settings?: Partial<EventSettings>;
}

export interface Photo {
  id: string;
  event_id: string;
  url: string;
  is_private: boolean;
  status?: "pending" | "approved" | "rejected";
  created_at: string;
}

export interface PhotoProcessingStatus {
  total: number;
  processed: number;
  pending: number;
  failed: number;
}

export interface Member {
  user_id: string;
  name: string;
  email: string;
  role: string;
}

export interface Invite {
  email: string;
  invited_at: string;
}

export interface ScanResult {
  scan_token?: string;
  photos: Photo[];
}

export interface GalleryPhoto extends Photo {
  flagged?: boolean;
}

export interface GalleryResponse {
  total: string;
  photos: GalleryPhoto[];
}

/* ══════════════════════════════════════════════════════════════
   TOKEN ACCESSOR
══════════════════════════════════════════════════════════════ */
let _getToken: (() => string | null) | null = null;
export function registerTokenAccessor(fn: () => string | null) {
  _getToken = fn;
}

/* ══════════════════════════════════════════════════════════════
   ERROR
══════════════════════════════════════════════════════════════ */
export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/* ══════════════════════════════════════════════════════════════
   CORE FETCH — unwraps { message, data } envelope
══════════════════════════════════════════════════════════════ */
async function request<T>(method: string, path: string, body?: unknown, options?: { formData?: FormData; public?: boolean }): Promise<T> {
  const token = _getToken?.();
  const headers: Record<string, string> = {};
  if (token && !options?.public) headers["Authorization"] = `Bearer ${token}`;
  if (body && !options?.formData) headers["Content-Type"] = "application/json";

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: options?.formData ? options.formData : body ? JSON.stringify(body) : undefined,
  });

  if (res.status === 204) return undefined as T;

  const json = await res.json().catch(() => null);

  if (!res.ok) {
    throw new ApiError(res.status, json?.detail ?? json?.message ?? res.statusText, json);
  }

  // Unwrap envelope
  if (json && typeof json === "object" && "data" in json) {
    return (json as ApiEnvelope<T>).data;
  }

  return json as T;
}

const get = <T>(p: string, pub = false) => request<T>("GET", p, undefined, { public: pub });
const post = <T>(p: string, b?: unknown) => request<T>("POST", p, b);
const patch = <T>(p: string, b?: unknown) => request<T>("PATCH", p, b);
const del = <T>(p: string) => request<T>("DELETE", p);
const postForm = <T>(p: string, fd: FormData) => request<T>("POST", p, undefined, { formData: fd });

/* ══════════════════════════════════════════════════════════════
   AUTH
══════════════════════════════════════════════════════════════ */
export const auth = {
  register: (p: { display_name: string; email: string; password: string }) => post<AuthTokenData>("/api/v1/auth/register", p),

  login: (p: { email: string; password: string }) => post<AuthTokenData>("/api/v1/auth/login", p),

  me: () => get<User>("/api/v1/auth/me"),
};

/* ══════════════════════════════════════════════════════════════
   EVENTS
══════════════════════════════════════════════════════════════ */
export const events = {
  /** Events the current user manages (organiser/owner) */
  list: () => get<Event[]>("/api/v1/events"),

  /** Events the current user is attending (member) */
  attending: () => get<Event[]>("/api/v1/events/attending"),

  create: (p: CreateEventPayload) => post<Event>("/api/v1/events", p),

  get: (id: string) => get<Event>(`/api/v1/events/${id}`),

  update: (id: string, p: UpdateEventPayload) => patch<Event>(`/api/v1/events/${id}`, p),

  delete: (id: string) => del<void>(`/api/v1/events/${id}`),

  leave: (id: string) => del<void>(`/api/v1/events/${id}/leave`),

  verifyAccess: (id: string, access_code: string) => post<{ verified: boolean }>(`/api/v1/events/${id}/access/verify`, { access_code }),

  addMember: (id: string, user_id: string) => post<Member>(`/api/v1/events/${id}/members`, { user_id }),

  removeMember: (id: string, user_id: string) => del<void>(`/api/v1/events/${id}/members/${user_id}`),

  addInvites: (id: string, emails: string[]) => post<Invite[]>(`/api/v1/events/${id}/invites`, { emails }),

  revokeInvite: (id: string, email: string) => del<void>(`/api/v1/events/${id}/invites/${encodeURIComponent(email)}`),
};

/* ══════════════════════════════════════════════════════════════
   PHOTOS
══════════════════════════════════════════════════════════════ */
export const photos = {
  /** Organiser bulk upload */
  bulkUpload: (eventId: string, files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    return postForm<Photo[]>(`/api/v1/events/${eventId}/photos`, fd);
  },

  /** Attendee upload — goes through approval if required */
  attendeeUpload: (eventId: string, files: File[]) => {
    const fd = new FormData();
    files.forEach((f) => fd.append("files", f));
    return postForm<Photo[]>(`/api/v1/events/${eventId}/photos/attendee`, fd);
  },

  list: (eventId: string) => get<Photo[]>(`/api/v1/events/${eventId}/photos`),

  status: (eventId: string) => get<PhotoProcessingStatus>(`/api/v1/events/${eventId}/photos/status`),

  pendingApproval: (eventId: string) => get<Photo[]>(`/api/v1/events/${eventId}/photos/pending-approval`),

  approve: (eventId: string, photoId: string) => post<Photo>(`/api/v1/events/${eventId}/photos/${photoId}/approve`),

  reject: (eventId: string, photoId: string) => post<Photo>(`/api/v1/events/${eventId}/photos/${photoId}/reject`),

  serveUrl: (eventId: string, photoId: string) => `${BASE}/api/v1/events/${eventId}/photos/serve/${photoId}`,

  updateVisibility: (eventId: string, photoId: string, is_private: boolean) =>
    patch<Photo>(`/api/v1/events/${eventId}/photos/${photoId}`, { is_private }),

  delete: (eventId: string, photoId: string) => del<void>(`/api/v1/events/${eventId}/photos/${photoId}`),
};

/* ══════════════════════════════════════════════════════════════
   FACES
══════════════════════════════════════════════════════════════ */
export const faces = {
  scan: (eventId: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return postForm<ScanResult>(`/api/v1/events/${eventId}/faces/scan`, fd);
  },

  scanAnonymous: (eventId: string, file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    return postForm<ScanResult>(`/api/v1/events/${eventId}/faces/scan/anonymous`, fd);
  },

  claim: (eventId: string, scan_token: string) => post<ScanResult>(`/api/v1/events/${eventId}/faces/claim`, { scan_token }),
};

/* ══════════════════════════════════════════════════════════════
   GALLERY
══════════════════════════════════════════════════════════════ */
export const gallery = {
  full: (eventId: string) => get<GalleryResponse>(`/api/v1/events/${eventId}/gallery`, true),

  me: (eventId: string) => get<GalleryResponse>(`/api/v1/events/${eventId}/gallery/me`),

  anonymous: (eventId: string, scan_token: string) =>
    get<GalleryResponse>(`/api/v1/events/${eventId}/gallery/anonymous?scan_token=${encodeURIComponent(scan_token)}`, true),

  flag: (eventId: string, photoId: string) => post<void>(`/api/v1/events/${eventId}/gallery/${photoId}/flag`),

  unflag: (eventId: string, photoId: string) => del<void>(`/api/v1/events/${eventId}/gallery/${photoId}/flag`),
};

/* ══════════════════════════════════════════════════════════════
   DOWNLOADS
══════════════════════════════════════════════════════════════ */
export const downloads = {
  singleUrl: (eventId: string, photoId: string) => `${BASE}/api/v1/events/${eventId}/photos/${photoId}/download`,

  allMatchedUrl: (eventId: string) => `${BASE}/api/v1/events/${eventId}/gallery/me/download`,
};

/* ══════════════════════════════════════════════════════════════
   HEALTH
══════════════════════════════════════════════════════════════ */
export const health = {
  check: () => get<{ status: string }>("/health", true),
};
