import { selectedLanguage } from "@/models/language";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LocationCoords {
  latitude: number;
  longitude: number;
  accuracy: number | null;
  altitude: number | null;
  heading: number | null;
  speed: number | null;
  timestamp: number | null;
}

export interface AppState {
  hasOnboarded: boolean;
  locationCoords: LocationCoords | null;
  language: selectedLanguage;
}

const initialState: AppState = {
  hasOnboarded: false,
  locationCoords: null,
  language: "en",
};

export const appSlice = createSlice({
  name: "appSlice",
  initialState,
  reducers: {
    updateAppState: (state, action: PayloadAction<Partial<AppState>>) => {
      return { ...state, ...action.payload };
    },
    resetAppState: () => initialState,
  },
});

export const { updateAppState, resetAppState } = appSlice.actions;
export default appSlice.reducer;
