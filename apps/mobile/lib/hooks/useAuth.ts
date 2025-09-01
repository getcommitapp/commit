import { useEffect, useState } from "react";
import { authClient } from "../auth-client";
import { apiFetch } from "../api";
import { type UserGetResponse, UserGetResponseSchema } from "@commit/types";

export function useAuth() {
  const [isLoading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserGetResponse | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const session = await authClient.getSession();
      const sessionToken = session?.data?.session?.token ?? null;
      setToken(sessionToken);

      const apiUser = await apiFetch("/users", {}, UserGetResponseSchema);
      setUser(apiUser);
    } catch (error) {
      console.error("[useAuth] Error getting session:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    (async () => {
      await fetchUser();
    })();
  }, []);

  const isReviewerOrAdmin = user?.role === "reviewer" || user?.role === "admin";

  return {
    isLoading,
    token,
    user,
    isReviewerOrAdmin,
    refetch: fetchUser,
  } as const;
}
