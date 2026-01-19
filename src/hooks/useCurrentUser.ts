import { useContext } from "react";
import { UserContext, UserContextType } from "@/contexts/UserContext";

export function useCurrentUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useCurrentUser must be used within UserProvider");
  }
  return context;
}
