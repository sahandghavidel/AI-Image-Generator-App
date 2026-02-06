"use client";

import { AuthUIProvider } from "@daveyplate/better-auth-ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";

import { authClient } from "~/lib/auth-client";

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <AuthUIProvider
      authClient={authClient}
      navigate={(...args) => router.push(...args)}
      replace={(...args) => router.replace(...args)}
      onSessionChange={async () => {
        // Clear router cache (protected routes)
        router.refresh();

        // Check if user is authenticated and redirect to dashboard
        try {
          const session = await authClient.getSession();
          if (typeof window === "undefined") return;

          const currentPath = window.location.pathname;
          const isOnAuthPage = currentPath.startsWith("/auth/");
          const isOnDashboard = currentPath.startsWith("/dashboard");

          if (session.data?.user) {
            // Only redirect if we're on an auth page
            if (isOnAuthPage) {
              router.push("/dashboard");
            }
          } else {
            // If the user signs out while on a protected route, send them back to auth
            if (isOnDashboard) {
              router.replace("/auth/sign-up");
            }
          }
        } catch (error) {
          // Session check failed, user likely logged out
          console.log("Session check failed:", error);
        }
      }}
      Link={Link}
    >
      {children}
    </AuthUIProvider>
  );
}
