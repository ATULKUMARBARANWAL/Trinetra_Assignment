"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { selectIsAuthenticated } from "@/features/auth/authSelectors"
import { resetDocuments } from "@/features/document/documentSlice"
import { resetChat } from "@/features/chat/chatSlice"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const dispatch = useDispatch()

  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      // 🔥 clear state when not authenticated
      dispatch(resetDocuments())
      dispatch(resetChat())

      router.replace("/login")
    }
  }, [isAuthenticated, router, dispatch])

  if (!isAuthenticated) return null

  return <>{children}</>
}