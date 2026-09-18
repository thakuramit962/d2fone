import * as Location from "expo-location";
import { useCallback, useEffect, useRef, useState } from "react";
import MapView from "react-native-maps";

export type PermissionState = "checking" | "granted" | "denied" | "unavailable";

export type LatLng = {
  latitude: number;
  longitude: number;
};

export type MapRegion = LatLng & {
  zoom: number;
};

export type ThrottledWatcher = {
  key: string;
  minDistanceMeters?: number;
  minIntervalMs?: number;
  onTrigger: (coords: Location.LocationObjectCoords) => void | Promise<void>;
};

export type UseLiveLocationOptions = {
  autoStart?: boolean;
  accuracy?: Location.Accuracy;
  watchTimeIntervalMs?: number;
  watchDistanceIntervalM?: number;
  reverseGeocode?: {
    enabled?: boolean;
    minDistanceMeters?: number;
    minIntervalMs?: number;
  };
  zoom?: number;
  onLocationUpdate?: (location: Location.LocationObject) => void;
  throttledCallbacks?: ThrottledWatcher[];
};

export type UseLiveLocationResult = {
  permissionState: PermissionState;
  region: MapRegion;
  coords: Location.LocationObjectCoords | null;
  address: string | null;
  refreshing: boolean;
  error: string | null;
  mapRef: React.RefObject<MapView | null>;
  requestPermissionAndStart: () => Promise<void>;
  refresh: () => Promise<void>;
  stopWatching: () => void;
};

const DEFAULT_REGION: MapRegion = {
  latitude: 28.4595,
  longitude: 77.0266,
  zoom: 15,
};

const DEFAULT_GEOCODE_MIN_DISTANCE_M = 50;
const DEFAULT_GEOCODE_MIN_INTERVAL_MS = 30_000;

function distanceMeters(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const dLat = ((b.latitude - a.latitude) * Math.PI) / 180;
  const dLon = ((b.longitude - a.longitude) * Math.PI) / 180;
  const lat1 = (a.latitude * Math.PI) / 180;
  const lat2 = (b.latitude * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function formatPlace(
  place: Location.LocationGeocodedAddress | null | undefined,
): string | null {
  if (!place) return null;
  return (
    [
      place.name,
      place.street,
      place.city,
      place.region,
      place.postalCode,
      place.country,
    ]
      .filter(Boolean)
      .join(", ") || null
  );
}

export default function useLiveLocation(
  options: UseLiveLocationOptions = {},
): UseLiveLocationResult {
  const {
    autoStart = true,
    accuracy = Location.Accuracy.High,
    watchTimeIntervalMs = 5000,
    watchDistanceIntervalM = 10,
    reverseGeocode = {},
    zoom = 12.5,
    onLocationUpdate,
    throttledCallbacks = [],
  } = options;

  const geocodeEnabled = reverseGeocode.enabled ?? true;
  const geocodeMinDistanceM =
    reverseGeocode.minDistanceMeters ?? DEFAULT_GEOCODE_MIN_DISTANCE_M;
  const geocodeMinIntervalMs =
    reverseGeocode.minIntervalMs ?? DEFAULT_GEOCODE_MIN_INTERVAL_MS;

  const [permissionState, setPermissionState] =
    useState<PermissionState>("checking");
  const [region, setRegion] = useState<MapRegion>(DEFAULT_REGION);
  const [coords, setCoords] = useState<Location.LocationObjectCoords | null>(
    null,
  );
  const [address, setAddress] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mapRef = useRef<MapView>(null);
  const watchSubscription = useRef<Location.LocationSubscription | null>(null);

  const isMountedRef = useRef(true);

  const optsRef = useRef({
    zoom,
    onLocationUpdate,
    throttledCallbacks,
    geocodeEnabled,
    geocodeMinDistanceM,
    geocodeMinIntervalMs,
  });
  useEffect(() => {
    optsRef.current = {
      zoom,
      onLocationUpdate,
      throttledCallbacks,
      geocodeEnabled,
      geocodeMinDistanceM,
      geocodeMinIntervalMs,
    };
  }, [
    zoom,
    onLocationUpdate,
    throttledCallbacks,
    geocodeEnabled,
    geocodeMinDistanceM,
    geocodeMinIntervalMs,
  ]);

  const lastGeocodeRef = useRef<{ coords: LatLng; time: number } | null>(null);
  const lastThrottledFireRef = useRef<
    Map<string, { coords: LatLng; time: number }>
  >(new Map());

  const stopWatching = useCallback(() => {
    watchSubscription.current?.remove();
    watchSubscription.current = null;
  }, []);

  const handleNewLocation = useCallback(
    async (loc: Location.LocationObject) => {
      if (!isMountedRef.current) return;

      const { latitude, longitude } = loc.coords;
      const {
        zoom: currentZoom,
        onLocationUpdate: onUpdate,
        throttledCallbacks: watchers,
        geocodeEnabled: geoEnabled,
        geocodeMinDistanceM: geoMinDist,
        geocodeMinIntervalMs: geoMinInterval,
      } = optsRef.current;

      setCoords(loc.coords);
      setRegion({ latitude, longitude, zoom: currentZoom });
      setError(null);

      mapRef.current?.animateCamera(
        { center: { latitude, longitude }, zoom: currentZoom },
        { duration: 500 },
      );

      onUpdate?.(loc);

      if (geoEnabled) {
        const now = Date.now();
        const last = lastGeocodeRef.current;
        const moved = last
          ? distanceMeters(last.coords, { latitude, longitude })
          : Infinity;
        const stale = last ? now - last.time > geoMinInterval : true;

        if (moved >= geoMinDist || stale) {
          lastGeocodeRef.current = {
            coords: { latitude, longitude },
            time: now,
          };
          try {
            const [place] = await Location.reverseGeocodeAsync({
              latitude,
              longitude,
            });
            if (isMountedRef.current) setAddress(formatPlace(place));
          } catch {
            // Best-effort — keep the previously resolved address on failure.
          }
        }
      }

      const now = Date.now();
      for (const watcher of watchers) {
        const minDistance = watcher.minDistanceMeters ?? 100;
        const minInterval = watcher.minIntervalMs ?? 20_000;
        const last = lastThrottledFireRef.current.get(watcher.key);
        const moved = last
          ? distanceMeters(last.coords, { latitude, longitude })
          : Infinity;
        const stale = last ? now - last.time > minInterval : true;

        if (moved >= minDistance || stale) {
          lastThrottledFireRef.current.set(watcher.key, {
            coords: { latitude, longitude },
            time: now,
          });
          try {
            await watcher.onTrigger(loc.coords);
          } catch (e) {
            // Individual watcher failures shouldn't break location tracking.
            console.error(
              `useLiveLocation: throttled callback "${watcher.key}" failed`,
              e,
            );
          }
        }
      }
    },
    [],
  );

  const fetchCurrentLocation = useCallback(async () => {
    try {
      const current = await Location.getCurrentPositionAsync({ accuracy });
      await handleNewLocation(current);
    } catch (e) {
      if (isMountedRef.current) {
        setError(
          "Unable to fetch your current location. Please check your device settings and try again.",
        );
      }
      console.error("useLiveLocation: failed to fetch current location", e);
    }
  }, [accuracy, handleNewLocation]);

  const startWatchingLocation = useCallback(async () => {
    await fetchCurrentLocation();
    if (!isMountedRef.current) return;

    stopWatching();

    const subscription = await Location.watchPositionAsync(
      {
        accuracy,
        timeInterval: watchTimeIntervalMs,
        distanceInterval: watchDistanceIntervalM,
      },
      (loc) => handleNewLocation(loc),
    );

    if (!isMountedRef.current) {
      subscription.remove();
      return;
    }

    watchSubscription.current = subscription;
  }, [
    fetchCurrentLocation,
    stopWatching,
    accuracy,
    watchTimeIntervalMs,
    watchDistanceIntervalM,
    handleNewLocation,
  ]);

  const requestPermissionAndStart = useCallback(async () => {
    setPermissionState("checking");
    setError(null);

    try {
      const servicesEnabled = await Location.hasServicesEnabledAsync();
      if (!servicesEnabled) {
        if (isMountedRef.current) {
          setPermissionState("unavailable");
          setError("Location services are turned off on this device.");
        }
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();
      if (!isMountedRef.current) return;

      if (status !== "granted") {
        setPermissionState("denied");
        return;
      }

      setPermissionState("granted");
      await startWatchingLocation();
    } catch (e) {
      if (isMountedRef.current) {
        setPermissionState("denied");
        setError("Something went wrong while requesting location permission.");
      }
      console.error("useLiveLocation: permission request failed", e);
    }
  }, [startWatchingLocation]);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (!isMountedRef.current) return;

      if (status !== "granted") {
        await requestPermissionAndStart();
      } else {
        setPermissionState("granted");
        await fetchCurrentLocation();
      }
    } finally {
      if (isMountedRef.current) setRefreshing(false);
    }
  }, [fetchCurrentLocation, requestPermissionAndStart]);

  useEffect(() => {
    isMountedRef.current = true;

    if (autoStart) {
      requestPermissionAndStart();
    }

    return () => {
      isMountedRef.current = false;
      stopWatching();
    };
  }, []);

  return {
    permissionState,
    region,
    coords,
    address,
    refreshing,
    error,
    mapRef,
    requestPermissionAndStart,
    refresh,
    stopWatching,
  };
}
