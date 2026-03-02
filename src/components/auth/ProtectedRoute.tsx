"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const persist = localStorage.getItem("persist:root");

    if (!persist) {
      router.replace("/login");
      return;
    }

    try {
      const parsed = JSON.parse(persist);
      const auth = JSON.parse(parsed.auth);

      if (auth?.isAuthenticated) {
        setReady(true);
      } else {
        router.replace("/login");
      }
    } catch {
      router.replace("/login");
    }
  }, [router]);

  if (!ready) {
    return (
      <div className="text-white text-center mt-10">
        Loading...
      </div>
    );
  }

  return <>{children}</>;
}