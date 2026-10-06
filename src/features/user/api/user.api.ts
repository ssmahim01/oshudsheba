import { request, type Untyped } from "@/lib/query";
import type { GetQueryParams, IResponse, IUser, IUserApiResponse } from "@/types";
import type { IRegisterResponse } from "@/types/auth.types";

import { USER_ENDPOINTS } from "../constants";

export interface GetAllUsersResponse {
  success: boolean;
  data: IUser[];
  meta: {
    total: number;
    totalPage: number;
    totalStaffs: number;
    totalFixedSalary: number;
    totalSalaryByProduct: number;
    totalSalary: number;
  };
}

const list = (url: string, params: GetQueryParams | undefined, signal?: AbortSignal) =>
  request<GetAllUsersResponse>({ url, method: "GET", params, signal });

export const userApi = {
  register: (formData: FormData) =>
    request<IResponse<IRegisterResponse>>({
      url: USER_ENDPOINTS.create,
      method: "POST",
      data: formData,
    }),

  update: ({ id, data }: { id: string; data: FormData }) =>
    request<IResponse<IUser>>({ url: USER_ENDPOINTS.byId(id), method: "PATCH", data }),

  updatePermissions: ({ id, permissions }: Untyped) =>
    request<Untyped>({
      url: USER_ENDPOINTS.permissions(id),
      method: "PATCH",
      data: { permissions },
    }),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({ url: USER_ENDPOINTS.byId(id), method: "DELETE" }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<IUserApiResponse>({ url: USER_ENDPOINTS.byId(id), method: "GET", signal }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    list(USER_ENDPOINTS.all, params, signal),
  getCustomers: (params: GetQueryParams, signal?: AbortSignal) =>
    list(USER_ENDPOINTS.customers, params, signal),
  getMyCustomers: (params: GetQueryParams, signal?: AbortSignal) =>
    list(USER_ENDPOINTS.myCustomers, params, signal),
  getTrashUsers: (params: GetQueryParams, signal?: AbortSignal) =>
    list(USER_ENDPOINTS.trashUsers, params, signal),
  getTrashCustomers: (params: GetQueryParams, signal?: AbortSignal) =>
    list(USER_ENDPOINTS.trashCustomers, params, signal),

  getMe: (signal?: AbortSignal) =>
    request<IUserApiResponse>({ url: USER_ENDPOINTS.me, method: "GET", signal }),

  trashUser: ({ _id }: { _id: string }) =>
    request<IResponse<IUser>>({ url: USER_ENDPOINTS.trashUser(_id), method: "POST" }),

  trashCustomer: ({ _id }: { _id: string }) =>
    request<IResponse<IUser>>({ url: USER_ENDPOINTS.trashCustomer(_id), method: "POST" }),
};
