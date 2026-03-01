"use client"

import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { selectIsAuthenticated } from "@/features/auth/authSelectors"

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const isAuthenticated = useSelector(selectIsAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login")
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) return null

  return <>{children}</>
}