import { useEffect, useState } from "react";
import { authClient } from "../auth-client";
import { apiFetch } from "../api";
import { UserGetResponseSchema, type UserGetResponse } from "@commit/types";

export function useAuth() {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserGetResponse | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const session = await authClient.getSession();

        if (!mounted) return;

        const sessionToken = session?.data?.session?.token ?? null;
        setToken(sessionToken);

        // Always ask API for the current user; apiFetch will attach
        // the appropriate headers (real session or dev header)
        const apiUser = await apiFetch("/users", {}, UserGetResponseSchema);

        setUser(apiUser);
      } catch (error) {
        console.error("[useAuth] Error getting session:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const isReviewerOrAdmin = user?.role === "reviewer" || user?.role === "admin";

  return { loading, token, user, isReviewerOrAdmin } as const;
}
