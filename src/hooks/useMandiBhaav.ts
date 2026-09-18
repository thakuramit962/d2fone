import { MANDIBHAAV_API_KEY } from "@/constants/appConstant";
import {
  BhaavFilters,
  BhaavItem,
  BhaavState,
  GroupedCommodity,
} from "@/models/mandibhaav";
// import {

// } from "@/models/mandibhaav";
import axios, { AxiosError, CancelTokenSource } from "axios";
import dayjs from "dayjs";
import { useCallback, useRef, useState } from "react";

// ── Constants ─────────────────────────────────────

const BASE_URL =
  "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";

const DEFAULT_PARAMS = {
  "api-key": MANDIBHAAV_API_KEY,
  format: "json",
  limit: 100,
};

const INITIAL_STATE: BhaavState = {
  loading: false,
  list: [],
  mandis: [],
  districts: [],
  error: null,
  total: 0,
  updatedAt: null,
};

// ── Utils ─────────────────────────────────────────

function buildParams(filters: BhaavFilters) {
  const params: Record<string, string | number> = {
    "filters[state.keyword]": filters.state,
  };

  if (filters.district) params["filters[district]"] = filters.district;

  if (filters.market) params["filters[market]"] = filters.market;

  if (filters.commodity) params["filters[commodity]"] = filters.commodity;

  if (filters.variety) params["filters[variety]"] = filters.variety;

  if (filters.grade) params["filters[grade]"] = filters.grade;

  if (filters.arrival_date)
    params["filters[arrival_date]"] = filters.arrival_date;

  if (filters.offset) params["offset"] = filters.offset ?? 200;

  return params;
}

function extractUnique(data: BhaavItem[], key: keyof BhaavItem) {
  return Array.from(
    new Set(data.map((item) => item[key]?.trim()).filter(Boolean)),
  ).sort();
}

// ── Hook ──────────────────────────────────────────

export default function useMandiBhaav() {
  const [bhaav, setBhaav] = useState<BhaavState>(INITIAL_STATE);

  const cancelTokenRef = useRef<CancelTokenSource | null>(null);

  const cacheRef = useRef<Map<string, BhaavItem[]>>(new Map());

  // Create cache key
  const createCacheKey = (filters: BhaavFilters) => JSON.stringify(filters);

  const fetchMandiBhaav = useCallback(async (filters: BhaavFilters) => {
    const cacheKey = createCacheKey(filters);

    // Check cache first
    if (cacheRef.current.has(cacheKey)) {
      const cached = cacheRef.current.get(cacheKey)!;

      setBhaav((prev) => ({
        ...prev,
        list: cached,
        mandis: extractUnique(cached, "market"),
        districts: extractUnique(cached, "district"),
        loading: false,
      }));

      return;
    }

    // Cancel previous request
    cancelTokenRef.current?.cancel("Superseded");

    cancelTokenRef.current = axios.CancelToken.source();

    setBhaav((prev) => ({
      ...prev,
      loading: true,
      error: null,
    }));

    try {
      const params = {
        ...DEFAULT_PARAMS,
        ...buildParams(filters),
      };

      const { data } = await axios.get(BASE_URL, {
        params,
        cancelToken: cancelTokenRef.current.token,
        timeout: 10_000,
      });

      if (data?.status !== "ok") {
        throw new Error(data?.message ?? "API returned error");
      }

      const records: BhaavItem[] = data.records ?? [];

      // Cache response
      cacheRef.current.set(cacheKey, records);

      setBhaav((prev) => {
        const merged =
          filters.offset && filters.offset > 0
            ? [...prev.list, ...records]
            : records;

        return {
          loading: false,
          list: merged,
          mandis: extractUnique(merged, "market"),
          districts: extractUnique(merged, "district"),
          error: null,
          total: Number(data.total) ?? 0,
          updatedAt: dayjs().format("DD MMM YYYY [@]HH:mm:ss"),
        };
      });
    } catch (err) {
      if (axios.isCancel(err)) return;

      const message =
        err instanceof AxiosError
          ? (err.response?.data?.message ?? err.message)
          : "Something went wrong";

      setBhaav((prev) => ({
        ...prev,
        loading: false,
        error: message,
        updatedAt: dayjs().format("DD MMM YYYY [@]HH:mm:ss"),
      }));
    }
  }, []);

  const reset = useCallback(() => {
    cancelTokenRef.current?.cancel();
    cacheRef.current.clear();
    setBhaav(INITIAL_STATE);
  }, []);

  // Derived helpers
  const isEmpty = !bhaav.loading && bhaav.list.length === 0 && !bhaav.error;

  const hasMore = bhaav.list.length < bhaav.total;

  // ─── Helpers ─────────────────────────────────────────────────────────────────
  function groupAndSort(data: BhaavItem[]): GroupedCommodity[] {
    const map: Record<string, BhaavItem[]> = {};
    for (const item of data) {
      const key = item.commodity || "Unknown";
      if (!map[key]) map[key] = [];
      map[key].push(item);
    }
    return Object.entries(map)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([commodity, items]) => ({ commodity, items }));
  }

  function formatPrice(p: string | number) {
    const n = Number(p);
    return isNaN(n) ? String(p) : `₹${n.toLocaleString("en-IN")}`;
  }

  function formatDate(d: string) {
    if (!d) return "";
    // e.g. "13/04/2025" → "13 Apr"
    const parts = d.split("/");
    if (parts.length === 3) {
      const date = new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
      return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    }
    return d;
  }

  return {
    bhaav,
    fetchMandiBhaav,
    reset,
    isEmpty,
    hasMore,
    groupAndSort,
    formatPrice,
    formatDate,
  };
}
