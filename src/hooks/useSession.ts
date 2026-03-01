"use client"

import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { AppDispatch } from "@/core/store"
import { RootState } from "@/core/store/rootReducer"
import { refreshThunk, logout } from "@/features/auth/authSlice"
import { clearSessionState } from "@/features/session/sessionSlice"

export default function useSession() {
  const dispatch = useDispatch<AppDispatch>() // ✅ FIX HERE

  const expiry = useSelector(
    (state: RootState) => state.session.expiryTimestamp
  )

  useEffect(() => {
    if (!expiry) return

    const now = Date.now()
    const refreshTime = expiry - now - 5000

    if (refreshTime <= 0) {
      dispatch(refreshThunk())
      return
    }

    const timer = setTimeout(async () => {
      try {
        console.log("⏳ Triggering silent refresh (5s before expiry)...")
        await dispatch(refreshThunk()).unwrap()
      } catch {
        console.log("❌ Refresh failed inside hook. Logging out.")
        dispatch(logout())
        dispatch(clearSessionState())
      }
    }, refreshTime)

    return () => clearTimeout(timer)
  }, [expiry, dispatch])
}