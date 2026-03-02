"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    const persist = localStorage.getItem("persist:root")

    if (persist) {
      const parsed = JSON.parse(persist)
      const auth = JSON.parse(parsed.auth)

      if (auth?.isAuthenticated) {
        router.replace("/dashboard")
      } else {
        router.replace("/login")
      }
    } else {
      router.replace("/login")
    }
  }, [router])

  return <div className="text-white">Loading...</div>
}