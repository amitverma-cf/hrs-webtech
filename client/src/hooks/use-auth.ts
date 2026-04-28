import { useState, useCallback } from "react";
import { authService } from "../services/auth.service";

export function useAuth() {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = useCallback(async (credentials: any) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      setUser(data);
      return data;
    } catch (err: any) {
      const message = err.response?.data?.error || "Login failed";
      setError(message);
      throw new Error(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return { user, login, logout, isLoading, error };
}
