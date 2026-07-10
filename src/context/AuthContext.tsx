import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";
import { logEvent } from "../lib/logger";
import { getRequestMeta, getClientIP } from "../lib/requestMeta";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener?.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    const { client, userAgent, referer } = getRequestMeta();
    const ip = await getClientIP();

    if (error) {
      logEvent({
        category: "AUTH", severity: "WARNING",
        user: email, ip, method: "POST",
        resource: "/admin/login", statusCode: 401,
        message: `Inicio de sesión fallido: ${error.message}`,
        client, userAgent, referer,
      });
      return error.message;
    }

    logEvent({
      category: "AUTH", severity: "INFO",
      user: email, ip, method: "POST",
      resource: "/admin/login", statusCode: 200,
      message: "Inicio de sesión exitoso",
      client, userAgent, referer,
    });
    return null;
  };

  const logout = async () => {
    const { client, userAgent, referer } = getRequestMeta();
    const ip = await getClientIP();
    await supabase.auth.signOut();
    logEvent({
      category: "AUTH", severity: "INFO",
      user: user?.email || "desconocido", ip,
      method: "POST", resource: "/admin/logout", statusCode: 200,
      message: "Cierre de sesión",
      client, userAgent, referer,
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
}
