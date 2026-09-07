"use client";

import { useAuth } from "@/components/AuthProvider";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackHandler() {
  const { refresh } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    if (token) {
      import("@/lib/auth").then(({ setToken }) => {
        setToken(token);
        refresh().then(() => router.push("/dashboard"));
      });
    } else {
      router.push("/auth/login");
    }
  }, [token, refresh, router]);

  return (
    <main className="flex min-h-screen items-center justify-center font-mono text-xs">
      <p className="text-zinc-400">Authenticating session...</p>
    </main>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center font-mono text-xs">
          <p className="text-zinc-500">Loading credentials...</p>
        </main>
      }
    >
      <CallbackHandler />
    </Suspense>
  );
}