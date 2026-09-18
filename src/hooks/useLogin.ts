"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AUTH_ROUTES, STAFF_ROLES } from "@/constants/auth";
import { isUserRole, useUser, type User } from "@/context/UserContext";
import type { LoginFormValues } from "@/lib/validations/auth";
import { loginUser } from "@/utils/loginUser";

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useUser();
  const router = useRouter();

  const submit = useCallback(
    async (data: LoginFormValues): Promise<boolean> => {
      if (isLoading) return false;
      console.log("hello");

      setIsLoading(true);

      try {
        const response = await loginUser(data);

        if (!response.success) {
          toast.error(response.message || "Login failed.");
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

        toast.success(response.message || "Login successful!");

        router.push(
          STAFF_ROLES.has(user.role)
            ? AUTH_ROUTES.staffDashboard
            : AUTH_ROUTES.home,
        );

        return true;
      } catch (error) {
        console.error("Login form error:", error);
        toast.error("Something went wrong. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, login, router],
  );

  return { submit, isLoading };
}
