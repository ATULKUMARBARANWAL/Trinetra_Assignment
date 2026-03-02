"use client";

import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch } from "@/core/store";
import { RootState } from "@/core/store/rootReducer";
import {
  refreshThunk,
  logout,
  loginSuccess,
} from "@/features/auth/authSlice";
import { clearSessionState } from "@/features/session/sessionSlice";

export default function useSession() {
  const dispatch = useDispatch<AppDispatch>();

  const expiry = useSelector(
    (state: RootState) => state.session.expiryTimestamp
  );

  const [isReady, setIsReady] = useState(false); // 🔥 important

  // =========================
  // 🔥 Restore Session
  // =========================
  useEffect(() => {
    const initSession = async () => {
      try {
        const accessToken =
          typeof window !== "undefined" &&
          localStorage.getItem("accessToken");

        const refreshToken =
          typeof window !== "undefined" &&
          localStorage.getItem("refreshToken");

        const user =
          typeof window !== "undefined" &&
          localStorage.getItem("user");

        if (accessToken && refreshToken && user) {
          // ✅ restore redux state
          dispatch(
            loginSuccess({
              accessToken,
              refreshToken,
              user: JSON.parse(user),
            })
          );

          // ✅ refresh token
          await dispatch(refreshThunk()).unwrap();
        }
      } catch (error) {
        console.error("Session restore failed:", error);

        dispatch(logout());
        dispatch(clearSessionState());
      } finally {
        setIsReady(true); // 🔥 session ready
      }
    };

    initSession();
  }, [dispatch]);

  // =========================
  // 🔥 Token Refresh Logic
  // =========================
  useEffect(() => {
    if (!expiry) return;

    const now = Date.now();
    const refreshTime = expiry - now - 5000;

    if (refreshTime <= 0) {
      dispatch(refreshThunk());
      return;
    }

    const timer = setTimeout(async () => {
      try {
        await dispatch(refreshThunk()).unwrap();
      } catch {
        dispatch(logout());
        dispatch(clearSessionState());
      }
    }, refreshTime);

    return () => clearTimeout(timer);
  }, [expiry, dispatch]);

  return isReady; // 🔥 return status
}