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

  const [isChecking, setIsChecking] = useState(true); // 🔥 new

  useEffect(() => {
    if (isAuthenticated === undefined) return; // wait if needed

    if (!isAuthenticated) {
      dispatch(resetDocuments());
      dispatch(resetChat());
      router.replace("/login");
    }

    setIsChecking(false); // done checking
  }, [isAuthenticated, router, dispatch]);

  // 🔥 show loader instead of blank
  if (isChecking) return <div>Loading...</div>;

  // 🔥 after check
  if (!isAuthenticated) return null;

  return <>{children}</>;
}