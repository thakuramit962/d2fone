import axios from "axios";
import dayjs from "dayjs";
import * as Location from "expo-location";
import { useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import { WEATHER_API_KEY, WEATHER_API_URL } from "@/constants/appConstant";
import { updateWeatherReport } from "@/slices/weather-report-slice";
import { RootState } from "@/store/store";

const LOCATION_OPTIONS: Location.LocationOptions = {
  accuracy: Location.Accuracy.Balanced,
};

const REQUEST_TIMEOUT = 20000; // 20 seconds
const MAX_RETRIES = 2;

export default function useWeatherData() {
  const dispatch = useDispatch();
  const abortRef = useRef<AbortController | null>(null);

  const appLanguage = useSelector(
    (state: RootState) => state?.appSlice?.language,
  );

  const fetchWeatherDetails = useCallback(async () => {
    console.log("🌦️ Fetch weather sequence: STARTS");

    // 1. Cancel ongoing operations before spinning up a new cycle
    if (abortRef.current) {
      abortRef.current.abort();
    }
    abortRef.current = new AbortController();
    const currentSignal = abortRef.current.signal;

    dispatch(updateWeatherReport({ fetching: true, errorMessage: null }));

    try {
      // 2. Location Permission Guard
      let permission = await Location.getForegroundPermissionsAsync();

      if (permission.status !== "granted") {
        permission = await Location.requestForegroundPermissionsAsync();
      }

      if (permission.status !== "granted") {
        throw new Error("LOCATION_PERMISSION_DENIED");
      }

      if (currentSignal.aborted)
        throw new DOMException("Aborted", "AbortError");

      // 3. Optimized Location Fetching Strategy (No-Hang Safe Guard)
      let location: Location.LocationObject | null = null;

      try {
        location = await Location.getLastKnownPositionAsync();
        console.log("📍 Cached location fetched:", location);
      } catch (e) {
        console.warn("Could not get last known position:", e);
      }

      if (!location) {
        console.log("📍 Requesting fresh current position...");
        location = await Promise.race([
          Location.getCurrentPositionAsync(LOCATION_OPTIONS),
          new Promise<null>(
            (_, reject) =>
              setTimeout(() => reject(new Error("LOCATION_TIMEOUT")), 10000), // 10s hard-stop
          ),
        ]);
      }

      if (!location) {
        throw new Error("LOCATION_UNAVAILABLE");
      }

      if (currentSignal.aborted)
        throw new DOMException("Aborted", "AbortError");

      const { latitude, longitude } = location.coords;
      const url = `${WEATHER_API_URL}/forecast.json`;

      console.log(
        "🌐 Initiating weather API network call via Axios...",
        latitude,
        longitude,
      );

      // 4. Fire Axios request bundled with retry orchestration
      const response = await axiosWithRetry(
        url,
        {
          params: {
            key: WEATHER_API_KEY,
            q: `${latitude},${longitude}`,
            aqi: "yes",
            days: 7,
            alerts: "yes",
            lang: appLanguage,
          },
          signal: currentSignal,
          timeout: REQUEST_TIMEOUT,
        },
        MAX_RETRIES,
      );

      const data = response.data;
      if (!currentSignal.aborted) {
        dispatch(
          updateWeatherReport({
            data: {
              ...data,
              lastUpdated: dayjs().format("DD MMM YYYY, HH:mm:ss"),
            },
            fetching: false,
          }),
        );
      }
    } catch (err: any) {
      console.error("❌ Catch block triggered with error:", err);

      // Gracefully exit if this sequence was cancelled deliberately
      if (
        currentSignal.aborted ||
        axios.isCancel(err) ||
        err.name === "AbortError"
      ) {
        console.log("🛑 Request was intentionally aborted.");
        return;
      }

      let message = "Failed to load weather data";

      if (err.message === "LOCATION_PERMISSION_DENIED") {
        message = "Location permission is required to fetch weather updates.";
      } else if (
        err.message === "LOCATION_TIMEOUT" ||
        err.message === "LOCATION_UNAVAILABLE"
      ) {
        message = "Unable to determine your device location. Please try again.";
      } else if (
        err.code === "ECONNABORTED" ||
        err.message === "TIMEOUT_EXCEEDED"
      ) {
        message =
          "Connection timed out. Please check your internet connection.";
      } else if (err.response) {
        // Backend returned an error code (4xx, 5xx) outside our range
        message = `Server responded with error code: ${err.response.status}`;
      }

      dispatch(
        updateWeatherReport({
          errorMessage: message,
          fetching: false,
        }),
      );
    }
  }, [dispatch]);

  const cancelWeatherFetch = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      dispatch(updateWeatherReport({ fetching: false }));
    }
  }, [dispatch]);

  return {
    fetchWeatherDetails,
    cancelWeatherFetch,
  };
}

/**
 * Axios helper with clean retry engine execution loop
 */
async function axiosWithRetry(
  url: string,
  config: Parameters<typeof axios.get>[1] & { timeout: number },
  maxRetries: number,
): Promise<any> {
  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (config.signal?.aborted) throw new DOMException("Aborted", "AbortError");

    try {
      console.log(`📡 Axios network fetch attempt #${attempt + 1}`);
      return await axios.get(url, config);
    } catch (err: any) {
      lastError = err;

      // Immediately abort loop if parent cancellation fired
      if (config.signal?.aborted || axios.isCancel(err)) {
        throw new DOMException("Aborted", "AbortError");
      }

      // If we are at our final attempt limit, parse and rethrow
      if (attempt === maxRetries) {
        if (err.code === "ECONNABORTED") {
          throw new Error("TIMEOUT_EXCEEDED");
        }
        throw lastError;
      }
    }
  }

  throw lastError;
}
