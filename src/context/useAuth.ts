import { useContext } from "react";
import { AuthContext } from "./authContext";

export interface AuthContextValue {
  token: string | null;
  setToken: (token: string | null) => void;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
