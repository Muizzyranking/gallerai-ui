const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export interface Envelope<T> {
  message: string;
  data: T | null;
  errors?: FieldIssue[] | null;
  meta?: unknown;
}

export interface FieldIssue {
  field: string;
  message: string;
  type?: string;
}

export type AccessMode = "link" | "code" | "approved_list" | "combined" | "private";
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
    case "private":
      return "Private";
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
  access_config?: AccessConfig;
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

  resendEmailVerification: (p: { email: string }) => post<{ message?: string } | null>("/api/v1/auth/resend-email-verification", p),

  login: async (p: { email: string; password: string }): Promise<LoginResult> => {
    const env = await requestAuth<User>("POST", "/api/auth/login", p);
    return { message: env.message, user: env.data };
  },

  forgotPassword: (p: { email: string }) => post<{ message?: string } | null>("/api/v1/auth/forgot-password", p),

  resetPassword: (p: { token: string; new_password: string }) => post<{ message?: string } | null>("/api/v1/auth/reset-password", p),

  me: async (): Promise<User> => {
    const env = await requestAuth<User>("GET", "/api/auth/me");
    if (!env.data) throw new ApiError(401, env.message || "Not signed in");
    return env.data;
  },

  logout: async (): Promise<void> => {
    await requestAuth<null>("POST", "/api/auth/logout");
  },
};

/* ══════════════════════════════════════════════════════════════
   EVENTS
══════════════════════════════════════════════════════════════ */
export const events = {
  list: () => get<Event[]>("/api/v1/events"),

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
  full: (eventId: string) => get<GalleryResponse>(`/api/v1/events/${eventId}/gallery`),

  me: (eventId: string) => get<GalleryResponse>(`/api/v1/events/${eventId}/gallery/me`),

  anonymous: (eventId: string, scan_token: string) =>
    get<GalleryResponse>(`/api/v1/events/${eventId}/gallery/anonymous?scan_token=${encodeURIComponent(scan_token)}`),

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
  check: () => get<{ status: string }>("/health"),
};
