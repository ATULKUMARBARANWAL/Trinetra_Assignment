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
  isAuthenticated: boolean | null; // 🔥 allow null
}

/* ================================
   Initial State
================================ */

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: null, // 🔥 VERY IMPORTANT
};

/* ================================
   INIT FROM STORAGE (NEW)
================================ */

export const initAuth = createAsyncThunk(
  "auth/init",
  async (_, { dispatch }) => {
    if (typeof window === "undefined") return;

    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");
    const user = localStorage.getItem("user");

    if (accessToken && refreshToken && user) {
      dispatch(
        loginSuccess({
          accessToken,
          refreshToken,
          user: JSON.parse(user),
        })
      );
    } else {
      dispatch(logout());
    }
  }
);

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

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);
        localStorage.setItem("refreshToken", action.payload.refreshToken);
        localStorage.setItem("user", JSON.stringify(action.payload.user));

        // 🔥 set cookie for middleware
        document.cookie = `token=${action.payload.accessToken}; Path=/; Max-Age=86400; SameSite=Lax; Secure`;
      }
    },

    updateAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;

      if (typeof window !== "undefined") {
        localStorage.setItem("accessToken", action.payload.accessToken);

        document.cookie = `token=${action.payload.accessToken}; Path=/; Max-Age=86400; SameSite=Lax; Secure`;
      }
    },

    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      state.isAuthenticated = false;

      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("user");

        document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
      }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(initAuth.fulfilled, (state) => {
      // if loginSuccess was not called → mark as not authenticated
      if (state.isAuthenticated === null) {
        state.isAuthenticated = false;
      }
    });
  },
});

export const { loginSuccess, updateAccessToken, logout } =
  authSlice.actions;

export default authSlice.reducer;