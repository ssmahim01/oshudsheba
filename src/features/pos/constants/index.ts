import type { GetQueryParams } from "@/types";

export const POS_ENDPOINTS = {
  orders: "/pos/orders",
  order: (id: string) => `/pos/orders/${id}`,
  orderStatus: (id: string) => `/pos/orders/${id}/status`,
  cancel: (id: string) => `/pos/orders/${id}/cancel`,
  stats: "/pos/stats",
  today: "/pos/orders/today",
} as const;

export const posKeys = {
  all: ["pos"] as const,
  orders: (params?: GetQueryParams) => [...posKeys.all, "orders", params] as const,
  order: (id: string) => [...posKeys.all, "order", id] as const,
  stats: () => [...posKeys.all, "stats"] as const,
  today: () => [...posKeys.all, "today"] as const,
};
