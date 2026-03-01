import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit"
import { mockLoginApi, mockRefreshApi } from "./authService"
import { setExpiry } from "@/features/session/sessionSlice"

interface User {
  id: string
  email: string
}

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
}

/* ================================
   Login Thunk
================================ */

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (
    { email, password }: { email: string; password: string },
    { dispatch }
  ) => {
    console.log("🔐 Login started...")

    const response = await mockLoginApi(email, password)

    console.log("✅ Login successful")
    console.log("Access Token:", response.accessToken)

    dispatch(
      loginSuccess({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        user: response.user,
      })
    )

    const expiryTime = Date.now() + response.expiresIn * 1000
    console.log("⏳ Token expires at:", new Date(expiryTime))

    dispatch(setExpiry(expiryTime))

    return response
  }
)

/* ================================
   Refresh Thunk
================================ */

export const refreshThunk = createAsyncThunk(
  "auth/refresh",
  async (_, { getState, dispatch, rejectWithValue }) => {
    try {
      console.log("🔄 Attempting silent refresh...")

      const state = getState() as any
      const refreshToken = state.auth.refreshToken

      const response = await mockRefreshApi(refreshToken)

      console.log("✅ Token refreshed successfully")
      console.log("New Access Token:", response.accessToken)

      dispatch(updateAccessToken({ accessToken: response.accessToken }))

      const newExpiry = Date.now() + response.expiresIn * 1000
      console.log("⏳ New expiry set at:", new Date(newExpiry))

      dispatch(setExpiry(newExpiry))

      return response
    } catch (error) {
      console.log("❌ Refresh failed. Logging out.")

      dispatch(logout())
      return rejectWithValue("Refresh failed")
    }
  }
)

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
        accessToken: string
        refreshToken: string
        user: User
      }>
    ) => {
       state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.user = action.payload.user
      state.isAuthenticated = true
    },

    updateAccessToken: (
      state,
      action: PayloadAction<{ accessToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken
    },

    logout: (state) => {
      console.log("🚪 User logged out")

      state.accessToken = null
      state.refreshToken = null
      state.user = null
      state.isAuthenticated = false
    },
  },
})

export const { loginSuccess, updateAccessToken, logout } =
  authSlice.actions

export default authSlice.reducer