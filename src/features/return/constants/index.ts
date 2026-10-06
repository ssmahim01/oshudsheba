import type { Untyped } from "@/lib/query";

export const RETURN_ENDPOINTS = {
  create: "/returns/create-return",
  all: "/returns/all-returns",
  byId: (id: string) => `/returns/${id}`,
  status: (id: string) => `/returns/${id}/status`,
} as const;

export const returnKeys = {
  all: ["returns"] as const,
  list: (params?: Untyped) => [...returnKeys.all, "list", params] as const,
  detail: (id: string) => [...returnKeys.all, "detail", id] as const,
};
