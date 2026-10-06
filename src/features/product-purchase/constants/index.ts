import type { GetQueryParams } from "@/types";

export const PRODUCT_PURCHASE_ENDPOINTS = {
  root: "/product-purchase",
  create: "/product-purchase/create",
  stats: "/product-purchase/stats/overview",
  byId: (id: string) => `/product-purchase/${id}`,
  status: (id: string) => `/product-purchase/status/${id}`,
} as const;

export const productPurchaseKeys = {
  all: ["product-purchases"] as const,
  list: (params?: GetQueryParams) => [...productPurchaseKeys.all, "list", params] as const,
  detail: (id: string) => [...productPurchaseKeys.all, "detail", id] as const,
  stats: () => [...productPurchaseKeys.all, "stats"] as const,
};
