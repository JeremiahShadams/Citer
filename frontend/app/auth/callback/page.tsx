"use client";

import { useAuth } from "@/components/AuthProvider";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
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
    <main className="flex min-h-screen items-center justify-center">
      <p className="text-zinc-400">Signing you in...</p>
    </main>
  );
}