import { request } from "@/lib/query";
import type { GetQueryParams, ICategory, IPaginationMeta, IResponse } from "@/types";

import { CATEGORY_ENDPOINTS } from "../constants";

export interface GetAllCategoriesResponse {
  success: boolean;
  data: ICategory[];
  meta: IPaginationMeta;
}

export const categoryApi = {
  create: (formData: FormData) =>
    request<IResponse<ICategory>>({ url: CATEGORY_ENDPOINTS.create, method: "POST", data: formData }),

  update: ({ id, formData }: { id: string; formData: FormData }) =>
    request<IResponse<ICategory>>({ url: CATEGORY_ENDPOINTS.byId(id), method: "PATCH", data: formData }),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({ url: CATEGORY_ENDPOINTS.byId(id), method: "DELETE" }),

  getOne: (slug: string, signal?: AbortSignal) =>
    request<IResponse<ICategory>>({ url: CATEGORY_ENDPOINTS.byId(slug), method: "GET", signal }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllCategoriesResponse | undefined>({ url: CATEGORY_ENDPOINTS.all, method: "GET", params, signal }),

  getTrash: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllCategoriesResponse>({ url: CATEGORY_ENDPOINTS.trash, method: "GET", params, signal }),

  trash: ({ _id }: { _id: string }) =>
    request<IResponse<ICategory>>({ url: CATEGORY_ENDPOINTS.trashOne(_id), method: "POST" }),

  getByProduct: (slug: string, signal?: AbortSignal) =>
    request<GetAllCategoriesResponse>({ url: CATEGORY_ENDPOINTS.byProduct(slug), method: "GET", signal }),
};
