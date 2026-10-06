export const PRODUCT_BLOG_ENDPOINTS = {
  root: "/product-blog",
  byId: (idOrSlug: string) => `/product-blog/${idOrSlug}`,
  view: (id: string) => `/product-blog/${id}/view`,
} as const;

export const productBlogKeys = {
  all: ["product-blogs"] as const,
  list: (params?: unknown) => [...productBlogKeys.all, "list", params] as const,
  detail: (idOrSlug: string) => [...productBlogKeys.all, "detail", idOrSlug] as const,
};
