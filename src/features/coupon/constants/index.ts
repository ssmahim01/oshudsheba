import type { GetCouponsQueryParams } from "../types";

export const COUPON_ENDPOINTS = {
  list: "/coupon",
  create: "/coupon/create",
  byId: (id: string) => `/coupon/${id}`,
  apply: "/coupon/apply",
} as const;

export const couponKeys = {
  all: ["coupons"] as const,
  list: (params?: GetCouponsQueryParams) => [...couponKeys.all, "list", params] as const,
};
