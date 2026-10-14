"use client";

import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useState } from "react";
import { ApiError, type EventSettings, events as eventsApi, type PublicEvent } from "@/lib/api";

const codeKey = (eventId: string) => `access_code_${eventId}`;

/** Attendee access context: stored passcode, public header, verify gate. */
export function useGalleryAccess(eventId: string) {
  const [accessCode, setAccessCode] = useState<string | undefined>(undefined);
  const [codeRejected, setCodeRejected] = useState(false);

  useEffect(() => {
    try {
      setAccessCode(sessionStorage.getItem(codeKey(eventId)) ?? undefined);
    } catch {
      // ignore
    }
  }, [eventId]);

  const publicQuery = useQuery({
    queryKey: ["public", eventId, accessCode ?? ""],
    queryFn: () => eventsApi.public(eventId, accessCode),
    retry: false,
  });
  const eventInfo: PublicEvent | undefined = publicQuery.data;
  const needsCode = publicQuery.error instanceof ApiError && publicQuery.error.status === 403;
  const notFound = publicQuery.error instanceof ApiError && publicQuery.error.status === 404;

  const verify = useCallback(
    async (code: string): Promise<boolean> => {
      try {
        await eventsApi.verifyAccess(eventId, code);
        try {
          sessionStorage.setItem(codeKey(eventId), code);
        } catch {
          // ignore
        }
        setAccessCode(code);
        setCodeRejected(false);
        return true;
      } catch {
        setCodeRejected(true);
        return false;
      }
    },
    [eventId],
  );

  const settings: EventSettings = eventInfo
    ? {
        allow_attendee_uploads: eventInfo.allow_attendee_uploads,
        require_upload_approval: eventInfo.require_upload_approval,
        downloads_enabled: eventInfo.downloads_enabled,
        gallery_visible: eventInfo.gallery_visible,
      }
    : { allow_attendee_uploads: false, require_upload_approval: true, downloads_enabled: true, gallery_visible: true };

  return { eventInfo, accessCode, needsCode, notFound, codeRejected, verify, settings, counts: eventInfo?.counts };
}
