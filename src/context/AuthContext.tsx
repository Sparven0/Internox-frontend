import { useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(
    localStorage.getItem("jwt_token") // ← läs från localStorage vid start
  );

  const setToken = (newToken: string | null) => {
    if (newToken) {
      localStorage.setItem("jwt_token", newToken); // ← spara vid login
    } else {
      localStorage.removeItem("jwt_token"); // ← rensa vid logout
    }
    setTokenState(newToken);
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}