import { request, type Untyped } from "@/lib/query";
import type { GetQueryParams, IPaginationMeta, IProduct, IResponse } from "@/types";

import { PRODUCT_ENDPOINTS } from "../constants";

export interface GetAllProductsResponse {
  success: boolean;
  data: IProduct[];
  meta: IPaginationMeta;
}

export const productApi = {
  create: (formData: FormData) =>
    request<IResponse<IProduct>>({
      url: PRODUCT_ENDPOINTS.create,
      method: "POST",
      data: formData,
    }),

  update: ({ _id, formData }: { _id: string; formData: FormData }) =>
    request<IResponse<IProduct>>({
      url: PRODUCT_ENDPOINTS.byId(_id),
      method: "PATCH",
      data: formData,
    }),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({ url: PRODUCT_ENDPOINTS.byId(id), method: "DELETE" }),

  getOne: (slug: string, signal?: AbortSignal) =>
    request<IResponse<IProduct>>({ url: PRODUCT_ENDPOINTS.byId(slug), method: "GET", signal }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllProductsResponse>({ url: PRODUCT_ENDPOINTS.all, method: "GET", params, signal }),

  getTrash: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllProductsResponse>({ url: PRODUCT_ENDPOINTS.trash, method: "GET", params, signal }),

  toggleFeatured: (id: Untyped) =>
    request<Untyped>({ url: PRODUCT_ENDPOINTS.toggleFeatured(id), method: "PATCH" }),

  assignMissingBarcodes: () =>
    request<Untyped>({ url: PRODUCT_ENDPOINTS.assignMissingBarcodes, method: "POST" }),

  trash: ({ _id }: { _id: string }) =>
    request<IResponse<IProduct>>({ url: PRODUCT_ENDPOINTS.trashOne(_id), method: "POST" }),
};
