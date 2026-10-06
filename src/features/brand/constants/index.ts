import type { GetQueryParams } from "@/types";

export const BRAND_ENDPOINTS = {
  create: "/brand/create-brand",
  byId: (id: string) => `/brand/${id}`,
  all: "/brand/all-brands",
  trash: "/brand/all-trash-brands",
  trashOne: (id: string) => `/brand/brand-trash/${id}`,
  byProduct: (slug: string) => `/brand/brand-by-product/${slug}`,
} as const;

export const brandKeys = {
  all: ["brands"] as const,
  detail: (slug: string) => [...brandKeys.all, "detail", slug] as const,
  list: (params?: GetQueryParams) => [...brandKeys.all, "list", params] as const,
  trash: (params?: GetQueryParams) => [...brandKeys.all, "trash", params] as const,
  byProduct: (slug: string) => [...brandKeys.all, "by-product", slug] as const,
};
