import React, { createContext, useContext, useEffect, useState } from "react";
import {
  clearStoredUser,
  getStoredUser,
  setStoredUser,
  StoredUser,
} from "@/utils/storage";
import { saveUserProfile, UserProfileInput } from "@/services/authService";

interface AuthContextType {
  user: StoredUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: StoredUser) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (profile: UserProfileInput) => Promise<boolean>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updateProfile: async () => false,
  refreshUser: async () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshUser = async () => {
    try {
      const stored = await getStoredUser();
      setUser(stored && stored.isLoggedIn ? stored : null);
    } catch (e) {
      console.log("[AuthContext] error reading stored user:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (userData: StoredUser) => {
    const updated = { ...userData, isLoggedIn: true };
    await setStoredUser(updated);
    setUser(updated);
  };

  const logout = async () => {
    await clearStoredUser();
    setUser(null);
  };

  const updateProfile = async (profile: UserProfileInput): Promise<boolean> => {
    const result = await saveUserProfile(profile);
    if (result.success) {
      await refreshUser();
      return true;
    }
    return false;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user?.isLoggedIn,
        isLoading,
        login,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
