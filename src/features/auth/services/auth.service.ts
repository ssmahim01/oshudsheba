import { defineMutation, defineQuery, type Untyped } from "@/lib/query";
import type { IRegister } from "@/types/auth.types";

import {
  authApi,
  type IAdminChangePasswordPayload,
  type IChangePasswordPayload,
} from "../api/auth.api";
import { authKeys } from "../constants";

export const authServices = {
  // No cache tags on purpose: matches the old `userInfo` endpoint.
  userInfo: (_arg?: void) =>
    defineQuery({
      queryKey: authKeys.userInfo(),
      queryFn: ({ signal }) => authApi.userInfo(signal),
    }),

  register: defineMutation({
    mutationFn: (userInfo: IRegister) => authApi.register(userInfo),
  }),
  login: defineMutation({
    mutationFn: (userInfo: Untyped) => authApi.login(userInfo),
  }),
  logout: defineMutation({
    mutationFn: (_arg?: void) => authApi.logout(),
  }),
  changePassword: defineMutation({
    mutationFn: (payload: IChangePasswordPayload) => authApi.changePassword(payload),
  }),
  adminChangePassword: defineMutation({
    mutationFn: (payload: IAdminChangePasswordPayload) =>
      authApi.adminChangePassword(payload),
  }),
};
