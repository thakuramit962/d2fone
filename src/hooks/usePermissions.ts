import API from "@/constants/api";
import { Camera } from "expo-camera";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Location from "expo-location";
import * as MediaLibrary from "expo-media-library";
import * as Notifications from "expo-notifications";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AppState, AppStateStatus, Linking, Platform } from "react-native";

// ---------- Types ----------
export type PermissionStatus =
  | "granted"
  | "denied"
  | "undetermined"
  | "blocked";

export type PermissionKey =
  | "location"
  | "notifications"
  | "camera"
  | "microphone"
  | "gallery";

export type PermissionState = Record<PermissionKey, PermissionStatus>;

export interface UsePermissionsOptions {
  /**
   * Which permissions gate `hasRequiredPermissions`.
   * Defaults to ['location'] when omitted entirely.
   * Pass an explicit `[]` to mean "nothing is required" — this is
   * respected as-is and does NOT fall back to the default.
   *
   * You can pass a fresh array literal on every render — the hook
   * derives a stable, order-independent signature internally, so
   * `hasRequiredPermissions` only recomputes when the actual *contents*
   * change, not when the array reference changes.
   */
  requiredKeys?: PermissionKey[];
  /**
   * Minimum time (ms) between OS permission re-checks triggered by
   * AppState transitions. Guards against rapid inactive→active→inactive
   * flicker (seen on some Android devices/OEM launchers) causing
   * redundant native calls. Default: 750ms.
   */
  appStateRefreshThrottleMs?: number;
}

export interface UsePermissionsResult {
  permissions: PermissionState;
  isLoading: boolean;

  requestPermission: (key: PermissionKey) => Promise<PermissionStatus>;
  requestLocation: () => Promise<PermissionStatus>;
  requestNotifications: () => Promise<PermissionStatus>;
  requestCamera: () => Promise<PermissionStatus>;
  requestMicrophone: () => Promise<PermissionStatus>;
  requestGallery: () => Promise<PermissionStatus>;

  refreshPermissions: () => Promise<PermissionState>;

  hasRequiredPermissions: boolean;

  openSettings: () => void;
  syncPushTokenToServer: () => void;
}

// ---------- Helpers ----------
const classify = (
  status: string | undefined | null,
  canAskAgain: boolean | undefined,
): PermissionStatus => {
  if (status === "granted") return "granted";
  if (status === "denied") {
    return canAskAgain === false ? "blocked" : "denied";
  }
  return "undetermined";
};

const INITIAL_STATE: PermissionState = {
  location: "undetermined",
  notifications: "undetermined",
  camera: "undetermined",
  microphone: "undetermined",
  gallery: "undetermined",
};

const DEFAULT_REQUIRED_KEYS: PermissionKey[] = ["location"];
const DEFAULT_APP_STATE_REFRESH_THROTTLE_MS = 750;

// Sentinel distinguishing "signature of an explicit empty array" from
// "caller omitted the option" — '' would otherwise be ambiguous.
const EMPTY_SIGNATURE = "__EMPTY__";

// Resolve EAS project ID once at module scope and warn in dev if missing.
const EAS_PROJECT_ID =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  Constants?.easConfig?.projectId;

if (__DEV__ && !EAS_PROJECT_ID) {
  console.warn(
    "[usePermissions] Missing EAS projectId — push token registration will fail. " +
      "Set expo.extra.eas.projectId in app config.",
  );
}

// ---------- Android notification channel (module-scope, created once) ----------
let androidChannelPromise: Promise<void> | null = null;

const ensureAndroidNotificationChannel = (): Promise<void> => {
  if (Platform.OS !== "android") return Promise.resolve();
  if (androidChannelPromise) return androidChannelPromise;

  // `setNotificationChannelAsync` resolves with a NotificationChannel (or
  // null); explicitly discard that value with `.then(() => undefined)`
  // before the assignment so the resulting promise is Promise<void>, not
  // Promise<NotificationChannel | null | void>. Assigning to a local const
  // first (rather than narrowing the mutable module-scope variable) keeps
  // the return type provably Promise<void> for TS.
  const promise: Promise<void> = Notifications.setNotificationChannelAsync(
    "default",
    {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    },
  )
    .then(() => undefined)
    .catch((err) => {
      // Allow a retry on the next attempt if this failed.
      androidChannelPromise = null;
      console.warn("[usePermissions] setNotificationChannelAsync failed:", err);
    });

  androidChannelPromise = promise;
  return promise;
};

// ---------- Per-permission OS calls, isolated so one broken/unlinked
// native module can't take down the whole hook. Each returns
// 'undetermined' + logs on unexpected failure rather than throwing,
// which keeps requestPermission/refreshPermissions callers deterministic.
const safeGetLocation = () =>
  Location.getForegroundPermissionsAsync().catch((err) => {
    console.error(
      "[usePermissions] getForegroundPermissionsAsync failed:",
      err,
    );
    return null;
  });

const safeGetNotifications = () =>
  Notifications.getPermissionsAsync().catch((err) => {
    console.error(
      "[usePermissions] Notifications.getPermissionsAsync failed:",
      err,
    );
    return null;
  });

const safeGetCamera = () =>
  Camera.getCameraPermissionsAsync().catch((err: any) => {
    console.error("[usePermissions] getCameraPermissionsAsync failed:", err);
    return null;
  });

const safeGetMicrophone = () =>
  Camera.getMicrophonePermissionsAsync().catch((err: any) => {
    console.error(
      "[usePermissions] getMicrophonePermissionsAsync failed:",
      err,
    );
    return null;
  });

const safeGetGallery = () =>
  MediaLibrary.getPermissionsAsync().catch((err) => {
    console.error(
      "[usePermissions] MediaLibrary.getPermissionsAsync failed:",
      err,
    );
    return null;
  });

// ---------- Hook ----------
export const usePermissions = (
  options?: UsePermissionsOptions,
): UsePermissionsResult => {
  const appStateRefreshThrottleMs =
    options?.appStateRefreshThrottleMs ?? DEFAULT_APP_STATE_REFRESH_THROTTLE_MS;

  // Stable, order-independent signature for the caller's requiredKeys.
  // Explicitly distinguishes "omitted" (-> default) from "[]" (-> nothing
  // required), so an intentional empty array is honored instead of
  // silently falling back to the default.
  const requiredKeysSignature = useMemo(() => {
    if (options?.requiredKeys === undefined) {
      return [...DEFAULT_REQUIRED_KEYS].sort().join(",");
    }
    if (options.requiredKeys.length === 0) return EMPTY_SIGNATURE;
    return [...options.requiredKeys].sort().join(",");
  }, [options?.requiredKeys]);

  // Derive the actual array from the signature. Even if the caller passes
  // a new array literal every render, `requiredKeys` only gets a new
  // identity when its *contents* actually change.
  const requiredKeys = useMemo<PermissionKey[]>(() => {
    if (requiredKeysSignature === EMPTY_SIGNATURE) return [];
    return requiredKeysSignature.split(",") as PermissionKey[];
  }, [requiredKeysSignature]);

  const [permissions, setPermissions] =
    useState<PermissionState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Mirrors `permissions` synchronously so callbacks can read the latest
  // value without depending on the state object.
  const permissionsRef = useRef<PermissionState>(INITIAL_STATE);

  // Guards every setState call against firing after unmount. We still
  // update permissionsRef even post-unmount so any promise that's still
  // resolving (e.g. a request the caller kicked off right before
  // navigating away) reflects the latest known truth if read directly.
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // Per-permission in-flight promises — dedupes same-key concurrent requests
  // AND lets late callers await the real result instead of a stale status.
  const inFlightPromises = useRef<
    Partial<Record<PermissionKey, Promise<PermissionStatus>>>
  >({});

  // Dedupe guard for push-token sync — coalesces concurrent calls.
  const syncInFlightRef = useRef<Promise<void> | null>(null);
  const lastSyncedTokenRef = useRef<string | null>(null);

  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastAppStateRefreshAtRef = useRef<number>(0);

  // Monotonic counter so a slow `refreshPermissions` can't clobber a
  // faster, more recent `requestPermission` commit that resolved while
  // the refresh's OS calls were still in flight. Each write records the
  // sequence it was based on; a refresh only commits if no newer write
  // has landed since it started.
  const commitSeqRef = useRef(0);

  // Central setter — keeps state + ref in lockstep. `force` bypasses the
  // sequence check for writes that must always win (individual permission
  // requests always represent the freshest possible truth for that key).
  const commitPermissions = useCallback(
    (
      updater: (prev: PermissionState) => PermissionState,
      opts?: { baseSeq?: number },
    ): boolean => {
      if (
        opts?.baseSeq !== undefined &&
        opts.baseSeq !== commitSeqRef.current
      ) {
        // A newer write landed while this one was computing — drop it.
        return false;
      }

      commitSeqRef.current += 1;
      const next = updater(permissionsRef.current);
      permissionsRef.current = next;

      if (mountedRef.current) {
        setPermissions(next);
      }
      return true;
    },
    [],
  );

  // ---------- API: sync expo push token ----------
  const syncPushTokenToServer = useCallback(async (): Promise<void> => {
    if (syncInFlightRef.current) return syncInFlightRef.current;

    const run = async () => {
      if (Device.isDevice === false) return;
      if (!EAS_PROJECT_ID) return;

      try {
        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: EAS_PROJECT_ID,
        });

        const token = tokenData?.data;
        if (!token) return;

        if (lastSyncedTokenRef.current === token) return;
        lastSyncedTokenRef.current = token;
        await API.post("/save-fcm-token", {
          device_token: token,
          device_type: Platform.OS,
          deviceName: Device.deviceName ?? "unknown",
          deviceId: Device.osBuildId ?? undefined,
        });
      } catch (err) {
        lastSyncedTokenRef.current = null;
        console.warn("[usePermissions] push token sync failed:", err);
      }
    };

    const promise = run().finally(() => {
      syncInFlightRef.current = null;
    });
    syncInFlightRef.current = promise;
    return promise;
  }, []);

  // ---------- Internal: individual requesters ----------
  // Each swallows unexpected native-module errors into 'denied' at the
  // call site above rather than here, but the read-before-request step
  // uses the same `safeGet*` helpers as refresh for consistent failure
  // handling.
  const _requestLocation = async (): Promise<PermissionStatus> => {
    const current = await safeGetLocation();
    const classified = current
      ? classify(current.status, current.canAskAgain)
      : "undetermined";
    if (classified === "granted") return "granted";
    if (classified === "blocked") return "blocked";

    const req = await Location.requestForegroundPermissionsAsync();
    return classify(req.status, req.canAskAgain);
  };

  const _requestNotifications = async (): Promise<PermissionStatus> => {
    await ensureAndroidNotificationChannel();

    const current = await safeGetNotifications();
    let finalStatus = current
      ? classify(current.status, current.canAskAgain)
      : "undetermined";

    if (finalStatus !== "granted") {
      if (finalStatus === "blocked") return "blocked";

      const req = await Notifications.requestPermissionsAsync({
        ios: { allowAlert: true, allowBadge: true, allowSound: true },
      });
      finalStatus = classify(req.status, req.canAskAgain);
    }

    if (finalStatus === "granted") {
      await syncPushTokenToServer();
    }

    return finalStatus;
  };

  const _requestCamera = async (): Promise<PermissionStatus> => {
    const current = await safeGetCamera();
    const classified = current
      ? classify(
          current.granted ? "granted" : current.status,
          current.canAskAgain,
        )
      : "undetermined";
    if (classified === "granted") return "granted";
    if (classified === "blocked") return "blocked";

    const req = await Camera.requestCameraPermissionsAsync();
    return classify(req.status, req.canAskAgain);
  };

  const _requestMicrophone = async (): Promise<PermissionStatus> => {
    const current = await safeGetMicrophone();
    const classified = current
      ? classify(
          current.granted ? "granted" : current.status,
          current.canAskAgain,
        )
      : "undetermined";
    if (classified === "granted") return "granted";
    if (classified === "blocked") return "blocked";

    const req = await Camera.requestMicrophonePermissionsAsync();
    return classify(req.status, req.canAskAgain);
  };

  const _requestGallery = async (): Promise<PermissionStatus> => {
    const current = await safeGetGallery();
    const classified = current
      ? classify(
          current.granted ? "granted" : current.status,
          current.canAskAgain,
        )
      : "undetermined";
    if (classified === "granted") return "granted";
    if (classified === "blocked") return "blocked";

    const req = await MediaLibrary.requestPermissionsAsync();
    return classify(req.status, req.canAskAgain);
  };

  // ---------- Public: request a single permission ----------
  const requestPermission = useCallback(
    (key: PermissionKey): Promise<PermissionStatus> => {
      const existing = inFlightPromises.current[key];
      if (existing) return existing;

      const promise = (async (): Promise<PermissionStatus> => {
        try {
          let status: PermissionStatus = "undetermined";

          switch (key) {
            case "location":
              status = await _requestLocation();
              break;
            case "notifications":
              status = await _requestNotifications();
              break;
            case "camera":
              status = await _requestCamera();
              break;
            case "microphone":
              status = await _requestMicrophone();
              break;
            case "gallery":
              status = await _requestGallery();
              break;
          }

          // Individual requests always win — they represent an explicit,
          // just-completed user action, so no baseSeq guard here.
          commitPermissions((prev) => ({ ...prev, [key]: status }));
          return status;
        } catch (err) {
          console.error(`[usePermissions] request ${key} failed:`, err);
          commitPermissions((prev) => ({ ...prev, [key]: "denied" }));
          return "denied";
        } finally {
          delete inFlightPromises.current[key];
        }
      })();

      inFlightPromises.current[key] = promise;
      return promise;
    },
    [commitPermissions, syncPushTokenToServer],
  );

  // ---------- Public: individual named wrappers ----------
  const requestLocation = useCallback(
    () => requestPermission("location"),
    [requestPermission],
  );
  const requestNotifications = useCallback(
    () => requestPermission("notifications"),
    [requestPermission],
  );
  const requestCamera = useCallback(
    () => requestPermission("camera"),
    [requestPermission],
  );
  const requestMicrophone = useCallback(
    () => requestPermission("microphone"),
    [requestPermission],
  );
  const requestGallery = useCallback(
    () => requestPermission("gallery"),
    [requestPermission],
  );

  // ---------- Public: refresh (no prompts) ----------
  const refreshPermissions = useCallback(async (): Promise<PermissionState> => {
    // Record the sequence BEFORE starting async work. If any individual
    // requestPermission commits while we're awaiting the OS calls below,
    // commitSeqRef advances and our eventual commit is dropped instead of
    // stomping on the more recent, more specific result.
    const baseSeq = commitSeqRef.current;
    const prevSnapshot = permissionsRef.current;

    const [loc, notif, cam, mic, gal] = await Promise.all([
      safeGetLocation(),
      safeGetNotifications(),
      safeGetCamera(),
      safeGetMicrophone(),
      safeGetGallery(),
    ]);

    const fresh: PermissionState = {
      location: loc
        ? classify(loc.status, loc.canAskAgain)
        : prevSnapshot.location,
      notifications: notif
        ? classify(notif.status, notif.canAskAgain)
        : prevSnapshot.notifications,
      camera: cam
        ? classify(cam.granted ? "granted" : cam.status, cam.canAskAgain)
        : prevSnapshot.camera,
      microphone: mic
        ? classify(mic.granted ? "granted" : mic.status, mic.canAskAgain)
        : prevSnapshot.microphone,
      gallery: gal
        ? classify(gal.granted ? "granted" : gal.status, gal.canAskAgain)
        : prevSnapshot.gallery,
    };

    const committed = commitPermissions(() => fresh, { baseSeq });

    if (
      committed &&
      prevSnapshot.notifications !== fresh.notifications &&
      fresh.notifications === "granted"
    ) {
      lastSyncedTokenRef.current = null;
      void syncPushTokenToServer();
    }

    // Return the freshest known state either way — even if our own write
    // was superseded, permissionsRef.current now reflects whichever
    // commit actually won, which is what callers should see.
    return permissionsRef.current;
  }, [commitPermissions, syncPushTokenToServer]);

  // ---------- Initial bootstrap (read-only, no prompts) ----------
  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const fresh = await refreshPermissions();
        if (fresh.notifications === "granted") {
          await syncPushTokenToServer();
        }
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();
  }, [refreshPermissions, syncPushTokenToServer]);

  // ---------- Re-check on app focus, throttled against rapid flicker ----------
  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const cameFromBackground =
        appStateRef.current.match(/inactive|background/) && next === "active";
      appStateRef.current = next;

      if (!cameFromBackground) return;

      const now = Date.now();
      if (now - lastAppStateRefreshAtRef.current < appStateRefreshThrottleMs) {
        return;
      }
      lastAppStateRefreshAtRef.current = now;

      refreshPermissions().catch((err) => {
        console.warn("[usePermissions] AppState refresh failed:", err);
      });
    });

    return () => sub.remove();
  }, [refreshPermissions, appStateRefreshThrottleMs]);

  const openSettings = useCallback(() => {
    Linking.openSettings().catch((err) =>
      console.warn("[usePermissions] openSettings failed:", err),
    );
  }, []);

  const hasRequiredPermissions = useMemo(
    () =>
      requiredKeys.length === 0 ||
      requiredKeys.every((key) => permissions[key] === "granted"),
    [permissions, requiredKeys],
  );

  return useMemo(
    () => ({
      permissions,
      isLoading,
      requestPermission,
      requestLocation,
      requestNotifications,
      requestCamera,
      requestMicrophone,
      requestGallery,
      refreshPermissions,
      hasRequiredPermissions,
      openSettings,
      syncPushTokenToServer,
    }),
    [
      permissions,
      isLoading,
      requestPermission,
      requestLocation,
      requestNotifications,
      requestCamera,
      requestMicrophone,
      requestGallery,
      refreshPermissions,
      hasRequiredPermissions,
      openSettings,
      syncPushTokenToServer,
    ],
  );
};
