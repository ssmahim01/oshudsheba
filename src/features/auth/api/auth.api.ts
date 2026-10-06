import { request, type Untyped } from "@/lib/query";
import type { IResponse, IUserApiResponse } from "@/types";
import type { IRegister, IRegisterResponse } from "@/types/auth.types";

import { AUTH_ENDPOINTS } from "../constants";

export interface IChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export interface IAdminChangePasswordPayload {
  userId: string;
  newPassword: string;
}

export interface IChangePasswordResponse {
  message: string;
  success: boolean;
}

export const authApi = {
  register: (userInfo: IRegister) =>
    request<IResponse<IRegisterResponse>>({
      url: AUTH_ENDPOINTS.register,
      method: "POST",
      data: userInfo,
    }),

  login: (userInfo: Untyped) =>
    request<Untyped>({ url: AUTH_ENDPOINTS.login, method: "POST", data: userInfo }),

  logout: () => request<Untyped>({ url: AUTH_ENDPOINTS.logout, method: "POST" }),

  userInfo: (signal?: AbortSignal) =>
    request<IUserApiResponse>({ url: AUTH_ENDPOINTS.me, method: "GET", signal }),

  changePassword: (payload: IChangePasswordPayload) =>
    request<IChangePasswordResponse>({
      url: AUTH_ENDPOINTS.changePassword,
      method: "POST",
      data: payload,
    }),

  adminChangePassword: (payload: IAdminChangePasswordPayload) =>
    request<IChangePasswordResponse>({
      url: AUTH_ENDPOINTS.adminChangePassword,
      method: "POST",
      data: payload,
    }),
};
