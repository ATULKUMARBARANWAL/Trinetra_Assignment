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

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    if (!isAuthenticated) {
      dispatch(resetDocuments());
      dispatch(resetChat());
      router.replace("/login");
    }
  }, [isMounted, isAuthenticated, router, dispatch]);

  // ✅ Prevent blank screen
  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}