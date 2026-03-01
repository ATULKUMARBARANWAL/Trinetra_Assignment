import { RootState } from "@/core/store/rootReducer"

/* ================================
   Basic Selectors (Fine-Grained)
================================ */

export const selectAuthState = (state: RootState) => state.auth

export const selectAccessToken = (state: RootState) =>
  state.auth.accessToken

export const selectRefreshToken = (state: RootState) =>
  state.auth.refreshToken

export const selectUser = (state: RootState) =>
  state.auth.user

export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated