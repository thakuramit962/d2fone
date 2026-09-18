// ✅ Import action creators directly from auth-slice — NOT from store.ts.
//    Importing from store.ts creates a circular dependency:
//      useUser → store → persistedReducer → auth-slice → (back to useUser via RootState)
//    Importing RootState from store.ts is fine (type-only, erased at runtime).
//    Importing runtime values (actions) from store.ts is what causes the cycle.

import API from "@/constants/api";
import { Roles } from "@/models/roles";
import { User } from "@/models/user";
import { patchUser, resetAuth } from "@/slices/auth-slice"; // ← action creators, NOT from store
import { updateCommunityPostState } from "@/slices/communityPostSlice";
import { updateProcessingState } from "@/slices/processing-state-slice";
import { updateSprayRequests } from "@/slices/spray-request-slice";
import { updateToast } from "@/slices/toast-slice";
import { RootState } from "@/store/store"; // ← type import only, safe
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// ─── Public interface ─────────────────────────────────────────────────────────

export interface UseUserReturn {
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
  isFetchingUser: boolean;
}

interface AuthData {
  password?: string;
  username?: string;
  phone?: string;
  otp?: string;
  otp_id?: string;
}

// ─── API response shape ───────────────────────────────────────────────────────

interface FetchUserApiResponse {
  status: "success" | "error";
  msg?: string;
  data?: {
    user_data?: Partial<User> & { role?: { name: string } };
    farmer_data?: User["farmerDetails"];
  };
}

// ─── Selectors ────────────────────────────────────────────────────────────────
// Defined outside the hook — stable references, never recreated on render.

const selectIsLoggedIn = (state: RootState): boolean =>
  state.auth?.isLoggedIn ?? false;
const selectCurrentUser = (state: RootState): User | null =>
  state.auth?.currentUser ?? null;
const selectAccessToken = (state: RootState): string | null =>
  state.auth?.accessToken ?? null;

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUser(): UseUserReturn {
  const dispatch = useDispatch();

  const accessToken = useSelector(selectAccessToken);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const currentUser = useSelector(selectCurrentUser);

  const [isFetchingUser, setIsFetchingUser] = useState<boolean>(false);

  // Holds the AbortController for any in-flight fetchUser request
  const abortControllerRef = useRef<AbortController | null>(null);

  // Cancel in-flight request on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  // ── fetchUser ──────────────────────────────────────────────────────────────

  const fetchUser = useCallback(async (): Promise<void> => {
    if (!isLoggedIn) {
      console.warn("[useUser] fetchUser called while not logged in — skipped.");
      return;
    }

    // Cancel previous in-flight request (rapid re-invocation guard)
    abortControllerRef.current?.abort();
    abortControllerRef.current = new AbortController();

    setIsFetchingUser(true);
    dispatch(updateProcessingState(true));

    try {
      const response = await API.get<FetchUserApiResponse>(
        "fetch_single_user",
        {
          headers: { Accept: "application/json" },
          signal: abortControllerRef.current.signal,
        },
      );

      const { status, data, msg } = response.data;

      if (status === "success" && data?.user_data) {
        const { user_data, farmer_data } = data;

        const patch: Partial<User> = {
          ...user_data,
          ...(user_data.role?.name
            ? { role: user_data.role.name as Roles }
            : (currentUser?.role as Roles)
              ? { role: currentUser?.role as Roles }
              : {}),
          ...(farmer_data !== undefined ? { farmerDetails: farmer_data } : {}),
        };

        // patchUser merges only into currentUser; isLoggedIn / accessToken untouched
        dispatch(patchUser(patch));
      } else {
        console.warn(
          "[useUser] fetchUser: non-success response —",
          msg ?? "no message",
        );
      }
    } catch (error: unknown) {
      // AbortError = intentional cancel (unmount or rapid re-call) — suppress
      if (error instanceof Error && error.name === "AbortError") return;

      const apiMsg = (error as { response?: { data?: { msg?: string } } })
        ?.response?.data?.msg;
      const fallback =
        error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

      console.error("[useUser] fetchUser error:", apiMsg ?? fallback);

      dispatch(
        updateToast({
          title: "Network Error",
          severity: "error",
          message:
            "Failed to fetch user data. Please check your connection and try again.",
        }),
      );
    } finally {
      dispatch(updateProcessingState(false));
      setIsFetchingUser(false);
    }
  }, [dispatch, isLoggedIn, currentUser]);

  // ── logout ─────────────────────────────────────────────────────────────────

  const logout = useCallback(async (): Promise<void> => {
    // Stop any in-flight fetch so it cannot write stale data after state reset
    abortControllerRef.current?.abort();

    dispatch(updateProcessingState(true));

    try {
      dispatch(resetAuth()); // hard reset — returns fresh initialState
      dispatch(updateCommunityPostState({ likedPosts: [] }));
      dispatch(updateSprayRequests({ list: [], error: "", loading: false }));

      await AsyncStorage.clear();
      router.replace("/tabs/home");
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Logout failed unexpectedly.";
      console.error("[useUser] logout error:", message);

      dispatch(
        updateToast({
          title: "Logout Error",
          severity: "error",
          message: "Could not log out cleanly. Please try again.",
        }),
      );
    } finally {
      dispatch(updateProcessingState(false));
    }
  }, [dispatch]);

  return { fetchUser, isFetchingUser, logout };
}
