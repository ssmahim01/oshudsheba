"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { getCurrentUser } from "@/utils/getCurrentUser";
import { logoutUser } from "@/utils/logoutUser";

export const USER_ROLES = [
  "CUSTOMER",
  "GENERALSTAFF",
  "MODERATOR",
  "PHARMACIST",
  "VENDOR",
  "MANAGER",
  "ADMIN",
  "TELESALES",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export type UserStatus = "ACTIVE" | "INACTIVE";

export interface User {
  _id: string;
  email?: string;
  phone?: string;
  role: UserRole;
  isActive?: UserStatus;
  isDeleted?: boolean;
  firstName?: string;
  lastName?: string;
  name?: string;
  avatar?: string;
  profileImage?: string;
  [key: string]: unknown;
}

export const isUserRole = (role: unknown): role is UserRole => {
  return (
    typeof role === "string" && (USER_ROLES as readonly string[]).includes(role)
  );
};

interface UserContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await getCurrentUser();
      setUser(currentUser ?? null);
    } catch (error) {
      console.error("Failed to load current user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const hydrateUser = async () => {
      try {
        const currentUser = await getCurrentUser();

        if (isMounted) {
          setUser(currentUser ?? null);
        }
      } catch (error) {
        console.error("User hydration error:", error);

        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void hydrateUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
    }
  }, []);

  const contextValue = useMemo<UserContextType>(
    () => ({
      user,
      loading,
      login,
      logout,
      refreshUser,
    }),
    [user, loading, login, logout, refreshUser],
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used inside UserProvider");
  }

  return context;
};
