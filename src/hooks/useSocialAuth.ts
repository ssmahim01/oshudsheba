"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AUTH_ROUTES, STAFF_ROLES } from "@/constants/auth";
import { isUserRole, useUser, type User } from "@/context/UserContext";
import { googleLogin } from "@/utils/googleLogin";

export function useSocialAuth() {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const router = useRouter();

  const loginWithGoogle = useCallback(() => {
    if (isLoading) return;

    setIsLoading(true);

    window.location.assign("/api/backend/auth/google");
  }, [isLoading]);

  const completeGoogleLogin = useCallback(
    async (code: string): Promise<boolean> => {
      if (isLoading) return false;

      setIsLoading(true);

      try {
        const response = await googleLogin(code);

        if (!response.success) {
          toast.error(response.message || "Google login failed.");
          return false;
        }

        const userData = response.user?.user;

        if (!userData) {
          toast.error("User information was not received.");
          return false;
        }

        if (!isUserRole(userData.role)) {
          console.error("Unsupported user role:", userData.role);

          toast.error("Your account role is not supported.");
          return false;
        }

        const user: User = {
          ...userData,
          role: userData.role,
        };

        login(user);

        toast.success(
          response.message || "Logged in with Google successfully!",
        );

        router.replace(
          STAFF_ROLES.has(user.role)
            ? AUTH_ROUTES.staffDashboard
            : AUTH_ROUTES.home,
        );

        return true;
      } catch (error) {
        console.error("Google login error:", error);

        toast.error("Something went wrong. Please try again.");

        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, login, router],
  );

  return {
    loginWithGoogle,
    completeGoogleLogin,
    isLoading,
  };
}
