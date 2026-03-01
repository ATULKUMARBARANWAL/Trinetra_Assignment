"use client"

import useSession from "@/hooks/useSession"

export default function SessionManager({
  children,
}: {
  children: React.ReactNode
}) {
  useSession()

  return <>{children}</>
}