import type { GetQueryParams } from "@/types";

export const PRODUCT_ENDPOINTS = {
  create: "/product/create-product",
  byId: (id: string) => `/product/${id}`,
  all: "/product/all-products",
  trash: "/product/all-trash-products",
  toggleFeatured: (id: string) => `/product/${id}/toggle-featured`,
  assignMissingBarcodes: "/product/assign-missing-barcodes",
  trashOne: (id: string) => `/product/product-trash/${id}`,
} as const;

export const productKeys = {
  all: ["products"] as const,
  detail: (slug: string) => [...productKeys.all, "detail", slug] as const,
  list: (params?: GetQueryParams) => [...productKeys.all, "list", params] as const,
  trash: (params?: GetQueryParams) => [...productKeys.all, "trash", params] as const,
};
