import { communityPostSlice } from "@/slices/communityPostSlice";
import { sprayRequestsSlice } from "@/slices/spray-request-slice";
import { toastSlice } from "@/slices/toast-slice";
import { userOrdersSlice } from "@/slices/user-orders-slice";
import { weatherReportSlice } from "@/slices/weather-report-slice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers } from "redux";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import { appSlice } from "../slices/appSlice";
import authReducer from "../slices/auth-slice"; // ✅ reducer only — NOT action creators
import { themeSlice } from "../slices/color-mode-slice";
import { processingStateSlice } from "../slices/processing-state-slice";

// ─── Root Reducer ─────────────────────────────────────────────────────────────
// ✅ store.ts imports ONLY reducers from slices — never action creators.
//    Hooks/components import action creators directly from their slice files.
//    This is the canonical pattern that prevents circular dependencies.

const rootReducer = combineReducers({
  auth: authReducer,
  colorMode: themeSlice.reducer,
  processingState: processingStateSlice.reducer, // key: processingState (not processingStateSlice)
  appSlice: appSlice.reducer,
  communityPost: communityPostSlice.reducer,
  toast: toastSlice.reducer,
  weatherReport: weatherReportSlice.reducer,
  userOrders: userOrdersSlice.reducer,
  sprayRequests: sprayRequestsSlice.reducer,
});

// Export RootState from rootReducer (not store.getState) so slices can import
// it for selector typing without pulling in the full store at runtime.
export type RootState = ReturnType<typeof rootReducer>;

// ─── Persist Config ───────────────────────────────────────────────────────────

const persistConfig = {
  key: "root",
  version: 1,
  storage: AsyncStorage,
  whitelist: ["auth", "colorMode", "appSlice"] as (keyof RootState)[],
  // toast and processingState are transient — never persist them
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// ─── Store ────────────────────────────────────────────────────────────────────

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// ─── Persistor ────────────────────────────────────────────────────────────────
// Exported as a named singleton — import this in _layout.tsx instead of calling
// persistStore(store) there, which would create a second conflicting persistor.

export const persistor = persistStore(store);

// ─── Typed hooks ──────────────────────────────────────────────────────────────
// Use these everywhere instead of plain useDispatch / useSelector.

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
