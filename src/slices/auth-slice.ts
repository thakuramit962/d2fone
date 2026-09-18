import { User } from "@/models/user";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface AuthState {
  isLoggedIn: boolean;
  currentUser: User | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  currentUser: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    updateAuth(state, action: PayloadAction<Partial<AuthState>>): void {
      const { isLoggedIn, currentUser, accessToken } = action.payload;
      if (isLoggedIn !== undefined) state.isLoggedIn = isLoggedIn;
      if (currentUser !== undefined) state.currentUser = currentUser;
      if (accessToken !== undefined) state.accessToken = accessToken;
    },

    patchUser(state, action: PayloadAction<Partial<User>>): void {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      } else {
        state.currentUser = action.payload as User;
      }
    },

    resetAuth(): AuthState {
      return { ...initialState };
    },
  },
});

export const { updateAuth, patchUser, resetAuth } = authSlice.actions;

export default authSlice.reducer;
