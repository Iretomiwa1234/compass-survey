import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getCurrentUser, CurrentUser } from "@/lib/auth";
import { getAuthToken } from "@/lib/session";

export type UserContextType = {
  user: CurrentUser | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<CurrentUser | null>;
};

export const UserContext = createContext<UserContextType>({
  user: null,
  isLoading: false,
  error: null,
  refetch: async () => null,
});

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async (): Promise<CurrentUser | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const token = getAuthToken();
      if (!token) {
        setIsLoading(false);
        return null;
      }

      const userData = await getCurrentUser();
      setUser(userData);
      return userData;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to fetch user";
      setError(message);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        error,
        refetch: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
