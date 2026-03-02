"use client";

import { useSelector, useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { selectIsAuthenticated } from "@/features/auth/authSelectors";
import { resetDocuments } from "@/features/document/documentSlice";
import { resetChat } from "@/features/chat/chatSlice";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();

  const isAuthenticated = useSelector(selectIsAuthenticated);

  const [isMounted, setIsMounted] = useState(false);

  // ✅ wait for hydration
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted && !isAuthenticated) {
      // 🔥 clear state when not authenticated
      dispatch(resetDocuments());
      dispatch(resetChat());

      router.replace("/login");
    }
  }, [isMounted, isAuthenticated, router, dispatch]);

  // ❌ prevent SSR mismatch / flicker
  if (!isMounted) return null;

  // ❌ block until auth ready
  if (!isAuthenticated) return null;

  return <>{children}</>;
}