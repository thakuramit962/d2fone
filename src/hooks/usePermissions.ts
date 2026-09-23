import API from "@/constants/api";
import { Camera } from "expo-camera";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
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
  requiredKeys?: PermissionKey[];
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
const EMPTY_SIGNATURE = "__EMPTY__";

const EAS_PROJECT_ID =
  Constants?.expoConfig?.extra?.eas?.projectId ??
  Constants?.easConfig?.projectId;

if (__DEV__ && !EAS_PROJECT_ID) {
  console.warn(
    "[usePermissions] Missing EAS projectId — push token registration will fail. " +
      "Set expo.extra.eas.projectId in app config.",
  );
}

let androidChannelPromise: Promise<void> | null = null;
const ensureAndroidNotificationChannel = (): Promise<void> => {
  if (Platform.OS !== "android") return Promise.resolve();
  if (androidChannelPromise) return androidChannelPromise;
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
      androidChannelPromise = null;
      console.warn("[usePermissions] setNotificationChannelAsync failed:", err);
    });
  androidChannelPromise = promise;
  return promise;
};

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

// FIXED: No more MediaLibrary - Uses Photo Picker logic
const safeGetGallery = async () => {
  try {
    // On Android 13+, Photo Picker needs NO permission
    if (Platform.OS === "android") {
      return { status: "granted", canAskAgain: true, granted: true } as any;
    }
    // iOS still needs permission check via ImagePicker
    return await ImagePicker.getMediaLibraryPermissionsAsync();
  } catch (err) {
    console.error("[usePermissions] getGallery failed:", err);
    return null;
  }
};

// ---------- Hook ----------
export const usePermissions = (
  options?: UsePermissionsOptions,
): UsePermissionsResult => {
  const appStateRefreshThrottleMs =
    options?.appStateRefreshThrottleMs ?? DEFAULT_APP_STATE_REFRESH_THROTTLE_MS;

  const requiredKeysSignature = useMemo(() => {
    if (options?.requiredKeys === undefined) {
      return [...DEFAULT_REQUIRED_KEYS].sort().join(",");
    }
    if (options.requiredKeys.length === 0) return EMPTY_SIGNATURE;
    return [...options.requiredKeys].sort().join(",");
  }, [options?.requiredKeys]);

  const requiredKeys = useMemo<PermissionKey[]>(() => {
    if (requiredKeysSignature === EMPTY_SIGNATURE) return [];
    return requiredKeysSignature.split(",") as PermissionKey[];
  }, [requiredKeysSignature]);

  const [permissions, setPermissions] =
    useState<PermissionState>(INITIAL_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const permissionsRef = useRef<PermissionState>(INITIAL_STATE);
  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const inFlightPromises = useRef<
    Partial<Record<PermissionKey, Promise<PermissionStatus>>>
  >({});
  const syncInFlightRef = useRef<Promise<void> | null>(null);
  const lastSyncedTokenRef = useRef<string | null>(null);
  const appStateRef = useRef<AppStateStatus>(AppState.currentState);
  const lastAppStateRefreshAtRef = useRef<number>(0);
  const commitSeqRef = useRef(0);

  const commitPermissions = useCallback(
    (
      updater: (prev: PermissionState) => PermissionState,
      opts?: { baseSeq?: number },
    ): boolean => {
      if (opts?.baseSeq !== undefined && opts.baseSeq !== commitSeqRef.current)
        return false;
      commitSeqRef.current += 1;
      const next = updater(permissionsRef.current);
      permissionsRef.current = next;
      if (mountedRef.current) setPermissions(next);
      return true;
    },
    [],
  );

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
    if (finalStatus === "granted") await syncPushTokenToServer();
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

  // FIXED GALLERY LOGIC
  const _requestGallery = async (): Promise<PermissionStatus> => {
    // Android 13+ : Photo Picker needs no permission at all
    if (Platform.OS === "android") {
      return "granted";
    }
    // iOS: use ImagePicker (not MediaLibrary)
    const current = await ImagePicker.getMediaLibraryPermissionsAsync();
    const classified = classify(current.status, current.canAskAgain);
    if (classified === "granted") return "granted";
    if (classified === "blocked") return "blocked";
    const req = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return classify(req.status, req.canAskAgain);
  };

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

  const refreshPermissions = useCallback(async (): Promise<PermissionState> => {
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
    return permissionsRef.current;
  }, [commitPermissions, syncPushTokenToServer]);

  useEffect(() => {
    (async () => {
      setIsLoading(true);
      try {
        const fresh = await refreshPermissions();
        if (fresh.notifications === "granted") await syncPushTokenToServer();
      } finally {
        if (mountedRef.current) setIsLoading(false);
      }
    })();
  }, [refreshPermissions, syncPushTokenToServer]);

  useEffect(() => {
    const sub = AppState.addEventListener("change", (next) => {
      const cameFromBackground =
        appStateRef.current.match(/inactive|background/) && next === "active";
      appStateRef.current = next;
      if (!cameFromBackground) return;
      const now = Date.now();
      if (now - lastAppStateRefreshAtRef.current < appStateRefreshThrottleMs)
        return;
      lastAppStateRefreshAtRef.current = now;
      refreshPermissions().catch((err) =>
        console.warn("[usePermissions] AppState refresh failed:", err),
      );
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
