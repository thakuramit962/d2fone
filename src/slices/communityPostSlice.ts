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

export interface CommunityPostState {
  likedPosts: String[];
  loading: boolean;
}

const initialState: CommunityPostState = {
  likedPosts: [],
  loading: false,
};

export const communityPostSlice = createSlice({
  name: "communityPostSlice",
  initialState,
  reducers: {
    updateCommunityPostState: (
      state,
      action: PayloadAction<Partial<CommunityPostState>>,
    ) => {
      return { ...state, ...action.payload };
    },
    resetCommunityPostState: () => initialState,
  },
});

export const { updateCommunityPostState, resetCommunityPostState } =
  communityPostSlice.actions;
export default communityPostSlice.reducer;
