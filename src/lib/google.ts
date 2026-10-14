const GIS_SRC = "https://accounts.google.com/gsi/client";

interface GooglePromptNotification {
  isNotDisplayed(): boolean;
  isSkippedMoment(): boolean;
  isDismissedMoment(): boolean;
  getNotDisplayedReason(): string;
  getSkippedReason(): string;
}

interface GoogleIdConfig {
  client_id: string;
  callback: (response: { credential?: string }) => void;
  auto_select?: boolean;
  cancel_on_tap_outside?: boolean;
  use_fedcm_for_prompt?: boolean;
}

interface GoogleAccounts {
  id: {
    initialize: (config: GoogleIdConfig) => void;
    prompt: (listener?: (n: GooglePromptNotification) => void) => void;
    cancel: () => void;
  };
}

declare global {
  interface Window {
    google?: { accounts: GoogleAccounts };
  }
}

let scriptPromise: Promise<void> | null = null;

function loadGoogleScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject(new Error("Google sign-in needs a browser."));
  if (window.google?.accounts?.id) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        scriptPromise = null;
        reject(new Error("Couldn't load Google sign-in. Check your connection and try again."));
      };
      document.head.appendChild(script);
    });
  }
  return scriptPromise;
}

/** Opens the Google account chooser and resolves with the ID token. */
export async function getGoogleIdToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  if (!clientId) throw new Error("Google sign-in isn't configured yet. Please use email instead.");

  await loadGoogleScript();
  const accounts = window.google?.accounts;
  if (!accounts?.id) throw new Error("Google sign-in failed to start. Please try again.");

  return new Promise<string>((resolve, reject) => {
    let settled = false;
    const done = (fn: () => void) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        accounts.id.cancel();
      } catch {
        /* noop */
      }
      fn();
    };
    const timer = setTimeout(
      () => done(() => reject(new Error("Google sign-in timed out. Please try again."))),
      120000,
    );

    accounts.id.initialize({
      client_id: clientId,
      auto_select: false,
      cancel_on_tap_outside: true,
      use_fedcm_for_prompt: true,
      callback: (response) => {
        done(() => {
          if (response?.credential) resolve(response.credential);
          else reject(new Error("Google sign-in was cancelled. Please try again."));
        });
      },
    });

    accounts.id.prompt((notification) => {
      try {
        if (notification.isDismissedMoment()) {
          done(() => reject(new Error("Google sign-in was closed. Please try again.")));
          return;
        }
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          const reason = notification.isNotDisplayed()
            ? notification.getNotDisplayedReason()
            : notification.getSkippedReason();
          done(() =>
            reject(
              new Error(
                reason === "opt_out_or_no_session" || reason === "no_session"
                  ? "No Google account is signed in on this browser. Sign in to Google first, then try again."
                  : "Google sign-in isn't available right now. Please try again or use email instead.",
              ),
            ),
          );
        }
      } catch {
        done(() => reject(new Error("Google sign-in isn't available right now. Please try again.")));
      }
    });
  });
}
