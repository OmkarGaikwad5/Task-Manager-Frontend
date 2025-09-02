import React, { createContext, useContext, useEffect, useState } from "react";
import { api, setAuthToken } from "../api";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/api/auth/me")
      .then(res => {
        setAuthToken(res.data.token); // <-- optional if token is sent
        setUser(res.data.user);
      })
      .catch(() => { })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/api/auth/login", { email, password });
    setAuthToken(data.token);
    setUser(data.user);
  };

  const register = async (name, email, password) => {
    const { data } = await api.post("/api/auth/register", { name, email, password });
    setAuthToken(data.token);
    setUser(data.user);
  };

  const logout = async () => {
    await api.post("/api/auth/logout");
    setUser(null);
    setAuthToken(null);
  };

  const value = { user, login, register, logout, loading };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-xs sm:max-w-sm md:max-w-md shadow-lg">
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm sm:text-base text-center text-muted-foreground">
              Loading user...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
