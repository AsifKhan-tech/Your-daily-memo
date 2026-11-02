import { createContext, useContext, useEffect, useState } from "react";

import { getUserProfile } from "../services/authService.js";
import { apiRequest } from "../../../lib/apiClient.js";

const AuthContext = createContext(null);

// Custom event used when the user's session expires.
const SESSION_EXPIRED_EVENT = "auth:session-expired";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Listen for session expiration events.
  useEffect(() => {
    function handleSessionExpired() {
      setUser(null);
      setIsLoading(false);
    }

    window.addEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);

    return () => {
      window.removeEventListener(SESSION_EXPIRED_EVENT, handleSessionExpired);
    };
  }, []);

  // Restore the authenticated user when the app loads.
  useEffect(() => {
    let isMounted = true;

    async function restoreUser() {
      try {
        const response = await getUserProfile();

        if (isMounted) {
          setUser(response.data);
        }
      } catch (error) {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    restoreUser();

    return () => {
      isMounted = false;
    };
  }, []);

  // Update authentication state after successful login.
  function login(userData) {
    setUser(userData);
    setIsLoading(false);
  }

  // Logout the user from the platform.
  async function logout() {
    await apiRequest("/auth/logout", {
      method: "POST",
    });

    setUser(null);
  }

  const value = {
    user,
    isAuthenticated: Boolean(user),
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to access authentication state.
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
