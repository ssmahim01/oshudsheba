"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { AUTH_ROUTES } from "@/constants/auth";
import { buildRegisterFormData } from "@/lib/auth/build-register-form-data";
import type { RegisterFormValues } from "@/lib/validations/auth";
import { registerUser } from "@/utils/registerUser";

interface UseRegisterOptions {
  redirectTo?: string;
}

export function useRegister({
  redirectTo = AUTH_ROUTES.login,
}: UseRegisterOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const submit = useCallback(
    async (values: RegisterFormValues): Promise<boolean> => {
      if (isLoading) return false;

      setIsLoading(true);

      try {
        const response = await registerUser(
          buildRegisterFormData(values),
        );

        if (!response.success) {
          toast.error(response.message || "Registration failed.");
          return false;
        }

        toast.success(response.message || "Account created successfully!");
        router.push(redirectTo);

        return true;
      } catch (error) {
        console.error("Register form error:", error);
        toast.error("Registration failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [ isLoading, redirectTo, router],
  );

  return { submit, isLoading };
}
