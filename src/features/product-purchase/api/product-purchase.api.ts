import { request, type Untyped } from "@/lib/query";
import type { GetQueryParams, IPaginationMeta, IResponse } from "@/types";
import type { IProductPurchase, IPurchase } from "@/types/purchase";

import { PRODUCT_PURCHASE_ENDPOINTS } from "../constants";

export interface GetAllProductPurchasesResponse {
  success: boolean;
  data: IPurchase[];
  meta: IPaginationMeta;
}

export const productPurchaseApi = {
  create: (data: Partial<IProductPurchase>) =>
    request<IResponse<IProductPurchase>>({
      url: PRODUCT_PURCHASE_ENDPOINTS.create,
      method: "POST",
      data,
    }),

  getStats: (signal?: AbortSignal) =>
    request<Untyped>({ url: PRODUCT_PURCHASE_ENDPOINTS.stats, method: "GET", signal }),

  update: ({ _id, data }: { _id: string; data: Partial<IProductPurchase> }) =>
    request<IResponse<IProductPurchase>>({
      url: PRODUCT_PURCHASE_ENDPOINTS.byId(_id),
      method: "PATCH",
      data,
    }),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({
      url: PRODUCT_PURCHASE_ENDPOINTS.byId(id),
      method: "DELETE",
    }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<IResponse<IProductPurchase>>({
      url: PRODUCT_PURCHASE_ENDPOINTS.byId(id),
      method: "GET",
      signal,
    }),

  updateStatus: ({
    _id,
    ...data
  }: {
    _id: string;
    purchaseStatus?: string;
    paymentStatus?: string;
  }) =>
    request<IResponse<IPurchase>>({
      url: PRODUCT_PURCHASE_ENDPOINTS.status(_id),
      method: "PATCH",
      data,
    }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllProductPurchasesResponse>({
      url: PRODUCT_PURCHASE_ENDPOINTS.root,
      method: "GET",
      params,
      signal,
    }),
};
