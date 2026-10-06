"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { authServices } from "../services/auth.service";

export const useUserInfoQuery = createQueryHook(authServices.userInfo);
export const useRegisterMutation = createMutationHook(authServices.register);
export const useLoginMutation = createMutationHook(authServices.login);
export const useLogoutMutation = createMutationHook(authServices.logout);
export const useChangePasswordMutation = createMutationHook(authServices.changePassword);
export const useAdminChangePasswordMutation = createMutationHook(
  authServices.adminChangePassword,
);
