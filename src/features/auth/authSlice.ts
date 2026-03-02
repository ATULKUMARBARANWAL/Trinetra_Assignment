import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { mockLoginApi, mockRefreshApi } from "./authService";
import { setExpiry } from "@/features/session/sessionSlice";

interface User {
  id: string;
  email: string;
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
}

// 🔥 Restore from localStorage
const savedAuth =
  typeof window !== "undefined"
    ? {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        user: localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user") as string)
          : null,
      }
    : {
        accessToken: null,
        refreshToken: null,
        user: null,
      };

const initialState: AuthState = {
  accessToken: savedAuth.accessToken,
  refreshToken: savedAuth.refreshToken,
  user: savedAuth.user,
  isAuthenticated: !!savedAuth.accessToken,
};

/* ================================
   Login Thunk
================================ */

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    const response = await mockLoginApi(email, password);

    dispatch(
      loginSuccess({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      })
    );

    const expiryTime = Date.now() + response.expiresIn * 1000;

    dispatch(setExpiry(expiryTime));

    return response;
  }
);

/* ================================
   Refresh Thunk
================================ */

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      const state = getState() as any;
      const refreshToken = state.auth.refreshToken;

      const response = await mockRefreshApi(refreshToken);

      dispatch(updateAccessToken({ accessToken: response.accessToken }));

      const newExpiry = Date.now() + response.expiresIn * 1000;

      dispatch(setExpiry(newExpiry));

      return response;
    } catch (error) {
      dispatch(logout());
      return rejectWithValue("Refresh failed");
    }
  }
);

/* ================================
   Slice
================================ */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken: string;
        user: User;
      }>
    ) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.user = action.payload.user;
      state.isAuthenticated = true;

      // 🔥 Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      }
    },

    updateAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;

      // 🔥 Update token in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
      }
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      // 🔥 Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");
      }
    },
  },
});

export const { loginSuccess, updateAccessToken, logout } =
  authSlice.actions;

export default authSlice.reducer;