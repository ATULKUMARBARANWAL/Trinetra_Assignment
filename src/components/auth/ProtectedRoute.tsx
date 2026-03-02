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

  // 👇 loading state to prevent flicker / loop
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // wait for redux to initialize
    if (isAuthenticated === undefined) return

    if (!isAuthenticated) {
      dispatch(resetDocuments())
      dispatch(resetChat())

      router.replace("/login")
    } else {
      setIsChecking(false)
    }
  }, [isAuthenticated, router, dispatch])

  // 👇 prevent render during checking
  if (isChecking) return null

  return <>{children}</>
}