import { createContext, useContext, useMemo, useState } from "react";
import { api } from "./api";

const AuthContext = createContext(null);
const STORAGE_KEY = "agrimarket_session";

function loadSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(loadSession);

  function save(next) {
    setSession(next);
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else localStorage.removeItem(STORAGE_KEY);
  }

  const value = useMemo(
    () => ({
      user: session?.user || null,
      token: session?.token || null,
      async register(payload) {
        const data = await api("/api/auth/register", { method: "POST", body: payload });
        save(data);
        return data.user;
      },
      async login(payload) {
        const data = await api("/api/auth/login", { method: "POST", body: payload });
        save(data);
        return data.user;
      },
      logout() {
        save(null);
      },
    }),
    [session]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
