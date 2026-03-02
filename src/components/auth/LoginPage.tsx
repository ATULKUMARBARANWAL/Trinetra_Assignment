"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/core/store";
import { loginThunk } from "@/features/auth/authSlice";
import { selectIsAuthenticated } from "@/features/auth/authSelectors";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { isValidEmail, isValidPassword } from "@/lib/utils";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isMounted, setIsMounted] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ✅ Wait for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // ✅ Redirect after login
  useEffect(() => {
    if (isMounted && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isMounted, isAuthenticated, router]);

  // ✅ Prevent blank screen
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is required");
      toast.error("Email is required ❌");
      return;
    }

    if (!isValidEmail(email)) {
      setError("Enter a valid email");
      toast.error("Invalid email format ❌");
      return;
    }

    if (!isValidPassword(password)) {
      toast.error("Password must be at least 6 characters ❌");
      return;
    }

    setLoading(true);

    const result = await dispatch(loginThunk({ email, password }));

    if (loginThunk.fulfilled.match(result)) {
      toast.success("Login successful 🎉");
      router.replace("/dashboard");
    } else {
      toast.error("Invalid credentials ❌");
      setError("Invalid credentials");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-black to-zinc-900 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 rounded-2xl bg-white/5 border border-white/10 text-white space-y-6"
      >
        <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 bg-zinc-900 rounded"
        />

        <button
          disabled={loading}
          className="w-full p-3 bg-indigo-600 rounded"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}