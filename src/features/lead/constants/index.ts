import type { GetQueryParams } from "@/types";

export const LEAD_ENDPOINTS = {
  create: "/lead/create-lead",
  byId: (id: string) => `/lead/${id}`,
  all: "/lead/all-leads",
  trash: "/lead/all-trash-leads",
  trashOne: (id: string) => `/lead/lead-trash/${id}`,
  fraudCheck: (phone: string) => `/lead/fraud-check?phone=${phone}`,
} as const;

export const leadKeys = {
  all: ["leads"] as const,
  detail: (id: string) => [...leadKeys.all, "detail", id] as const,
  list: (params?: GetQueryParams) => [...leadKeys.all, "list", params] as const,
  trash: (params?: GetQueryParams) => [...leadKeys.all, "trash", params] as const,
  fraud: (phone: string) => [...leadKeys.all, "fraud-check", phone] as const,
};
