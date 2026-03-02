"use client"

import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/core/store"
import { loginThunk } from "@/features/auth/authSlice"
import { selectIsAuthenticated } from "@/features/auth/authSelectors"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"

// ✅ Import from utils
import { isValidEmail, isValidPassword } from "@/lib/utils"

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()

  const isAuthenticated = useSelector(selectIsAuthenticated)

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // 🔥 Block login page if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/dashboard")
    }
  }, [isAuthenticated, router])

  // 🚀 Prevent login UI flash
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        Redirecting to dashboard...
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // ✅ Email validation using utils
    if (!email) {
      setError("Email is required")
      toast.error("Email is required ❌")
      return
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email")
      toast.error("Invalid email format ❌")
      return
    }

    // ✅ Password validation using utils
    if (!isValidPassword(password)) {

      toast.error("Password must be at least 6 characters ❌")
      return
    }

    setLoading(true)

    const result = await dispatch(loginThunk({ email, password }))

    if (loginThunk.fulfilled.match(result)) {
      toast.success("Login successful 🎉")
      router.replace("/dashboard")
    } else {
      toast.error("Invalid credentials ❌")
      setError("Invalid credentials")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-2xl text-white space-y-6 transition-all"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome Back
          </h1>

          <p className="text-sm text-zinc-400 leading-relaxed">
            Mock authentication enabled.  
            Use any valid email like{" "}
            <span className="text-indigo-400 font-medium">
              dummy@gmail.com
            </span>{" "}
            and a password with at least{" "}
            <span className="text-white font-medium">
              6 characters
            </span>.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-2 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <input
            className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            type="password"
            placeholder="Password (min 6 characters)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full p-3 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition font-semibold disabled:opacity-50"
          type="submit"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>

        <p className="text-center text-xs text-zinc-500">
          © 2026 Your App. All rights reserved.
        </p>
      </form>
    </div>
  )
}
