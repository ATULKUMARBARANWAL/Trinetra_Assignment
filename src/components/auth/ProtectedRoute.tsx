"use client"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
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

  const [isReady, setIsReady] = useState(false)

  // 🔥 wait for hydration (important)
  useEffect(() => {
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady) return

    if (!isAuthenticated) {
      dispatch(resetDocuments())
      dispatch(resetChat())

      router.replace("/login")
    }
  }, [isReady, isAuthenticated, router, dispatch])

  // 🔥 show loader while checking
  if (!isReady) {
    return (
      <div className="text-white text-center mt-10">
        Loading...
      </div>
    )
  }

  if (!isAuthenticated) return null

  return <>{children}</>
}