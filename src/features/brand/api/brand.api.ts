import { request } from "@/lib/query";
import type { GetQueryParams, IBrand, ICategory, IPaginationMeta, IResponse } from "@/types";

import { BRAND_ENDPOINTS } from "../constants";

export interface GetAllBrandsResponse {
  success: boolean;
  data: IBrand[];
  meta: IPaginationMeta;
}

export const brandApi = {
  create: (formData: FormData) =>
    request<IResponse<ICategory>>({ url: BRAND_ENDPOINTS.create, method: "POST", data: formData }),

  update: ({ id, formData }: { id: string; formData: FormData }) =>
    request<IResponse<ICategory>>({ url: BRAND_ENDPOINTS.byId(id), method: "PATCH", data: formData }),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({ url: BRAND_ENDPOINTS.byId(id), method: "DELETE" }),

  getOne: (slug: string, signal?: AbortSignal) =>
    request<IResponse<ICategory>>({ url: BRAND_ENDPOINTS.byId(slug), method: "GET", signal }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllBrandsResponse | undefined>({ url: BRAND_ENDPOINTS.all, method: "GET", params, signal }),

  getTrash: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllBrandsResponse>({ url: BRAND_ENDPOINTS.trash, method: "GET", params, signal }),

  trash: ({ _id }: { _id: string }) =>
    request<IResponse<IBrand>>({ url: BRAND_ENDPOINTS.trashOne(_id), method: "POST" }),

  getByProduct: (slug: string, signal?: AbortSignal) =>
    request<GetAllBrandsResponse>({ url: BRAND_ENDPOINTS.byProduct(slug), method: "GET", signal }),
};
