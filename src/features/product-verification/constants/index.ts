export const PRODUCT_VERIFICATION_ENDPOINTS = {
  root: "/product-verifications",
  byId: (idOrSlug: string) => `/product-verifications/${idOrSlug}`,
  view: (id: string) => `/product-verifications/${id}/view`,
} as const;

export const productVerificationKeys = {
  all: ["product-verifications"] as const,
  list: (params?: unknown) => [...productVerificationKeys.all, "list", params] as const,
  detail: (idOrSlug: string) => [...productVerificationKeys.all, "detail", idOrSlug] as const,
};
