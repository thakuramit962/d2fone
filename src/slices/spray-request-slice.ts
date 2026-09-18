import { SprayRequestState } from "@/models/sprayRequest";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: SprayRequestState = {
  loading: false,
  error: null,
  list: [],
};

export const sprayRequestsSlice = createSlice({
  name: "sprayRequests",
  initialState,
  reducers: {
    updateSprayRequests: (
      state,
      action: PayloadAction<Partial<SprayRequestState>>,
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { updateSprayRequests } = sprayRequestsSlice.actions;
export default sprayRequestsSlice.reducer;
