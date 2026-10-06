import type { GetQueryParams } from "@/types";

export const USER_ENDPOINTS = {
  create: "/user/create-user",
  byId: (id: string) => `/user/${id}`,
  permissions: (id: string) => `/user/${id}/permissions`,
  all: "/user/all-users",
  customers: "/user/all-customers",
  myCustomers: "/user/my-customers",
  me: "/user/me",
  trashUsers: "/user/all-trash-users",
  trashCustomers: "/user/all-trash-customers",
  trashUser: (id: string) => `/user/user-trash/${id}`,
  trashCustomer: (id: string) => `/user/customer-trash/${id}`,
} as const;

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
  me: () => [...userKeys.all, "me"] as const,
  list: (params?: GetQueryParams) => [...userKeys.all, "list", params] as const,
  customers: (params?: GetQueryParams) => [...userKeys.all, "customers", params] as const,
  myCustomers: (params?: GetQueryParams) => [...userKeys.all, "my-customers", params] as const,
  trashUsers: (params?: GetQueryParams) => [...userKeys.all, "trash-users", params] as const,
  trashCustomers: (params?: GetQueryParams) => [...userKeys.all, "trash-customers", params] as const,
};
