import type { GetQueryParams } from "@/types";

export const CATEGORY_ENDPOINTS = {
  create: "/category/create-category",
  byId: (id: string) => `/category/${id}`,
  all: "/category/all-categories",
  trash: "/category/all-trash-categories",
  trashOne: (id: string) => `/category/category-trash/${id}`,
  byProduct: (slug: string) => `/category/category-by-product/${slug}`,
} as const;

export const categoryKeys = {
  all: ["categories"] as const,
  detail: (slug: string) => [...categoryKeys.all, "detail", slug] as const,
  list: (params?: GetQueryParams) => [...categoryKeys.all, "list", params] as const,
  trash: (params?: GetQueryParams) => [...categoryKeys.all, "trash", params] as const,
  byProduct: (slug: string) => [...categoryKeys.all, "by-product", slug] as const,
};
