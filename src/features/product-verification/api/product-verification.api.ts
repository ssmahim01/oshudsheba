import { request, type Untyped } from "@/lib/query";
import type { IResponse } from "@/types";

import { PRODUCT_VERIFICATION_ENDPOINTS } from "../constants";

export const productVerificationApi = {
  create: (data: Untyped) =>
    request<Untyped>({ url: PRODUCT_VERIFICATION_ENDPOINTS.root, method: "POST", data }),

  getAll: (params: Untyped, signal?: AbortSignal) =>
    request<Untyped>({
      url: PRODUCT_VERIFICATION_ENDPOINTS.root,
      method: "GET",
      params,
      signal,
    }),

  getOne: (idOrSlug: string, signal?: AbortSignal) =>
    request<Untyped>({
      url: PRODUCT_VERIFICATION_ENDPOINTS.byId(idOrSlug),
      method: "GET",
      signal,
    }),

  update: ({ id, data }: Untyped) =>
    request<Untyped>({
      url: PRODUCT_VERIFICATION_ENDPOINTS.byId(id),
      method: "PATCH",
      data,
    }),

  increaseView: (id: string) =>
    request<IResponse<{ views: number }>>({
      url: PRODUCT_VERIFICATION_ENDPOINTS.view(id),
      method: "PATCH",
    }),

  remove: (id: string) =>
    request<Untyped>({ url: PRODUCT_VERIFICATION_ENDPOINTS.byId(id), method: "DELETE" }),
};
