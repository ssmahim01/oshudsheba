import type { GetQueryParams } from "@/types";

export const REVIEW_ENDPOINTS = {
  root: "/review",
  byId: (id: string) => `/review/${id}`,
  byProduct: (productId: string) => `/review/product/${productId}`,
  stats: "/review/stats",
  approve: (id: string) => `/review/${id}/approve`,
  reject: (id: string) => `/review/${id}/reject`,
} as const;

export const reviewKeys = {
  all: ["reviews"] as const,
  list: (params?: GetQueryParams) => [...reviewKeys.all, "list", params] as const,
  detail: (id: string) => [...reviewKeys.all, "detail", id] as const,
  byProduct: (productId: string) => [...reviewKeys.all, "by-product", productId] as const,
  stats: () => [...reviewKeys.all, "stats"] as const,
};
