import type { GetQueryParams } from "@/types/orders";

export const COURIER_ENDPOINTS = {
  list: "/couriers",
  create: "/couriers/create",
  byId: (id: string) => `/couriers/${id}`,
  byOrderId: (orderId: string) => `/couriers/order/${orderId}`,
} as const;

export const courierKeys = {
  all: ["couriers"] as const,
  list: (params?: GetQueryParams) => [...courierKeys.all, "list", params] as const,
  detail: (id: string) => [...courierKeys.all, "detail", id] as const,
  byOrder: (orderId: string) => [...courierKeys.all, "by-order", orderId] as const,
};
