import { request } from "@/lib/query";
import type { GetQueryParams, IResponse } from "@/types";
import type { IReview } from "@/types/types.review";

import { REVIEW_ENDPOINTS } from "../constants";

export interface IReviewStats {
  totalReviews: number;
  approvedReviews: number;
  pendingReviews: number;
  rejectedReviews: number;
  averageRating: number;
}

export interface GetReviewsResponse {
  success: boolean;
  data: IReview[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
}

export const reviewApi = {
  create: (data: Partial<IReview>) =>
    request<IResponse<IReview>>({ url: REVIEW_ENDPOINTS.root, method: "POST", data }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetReviewsResponse>({ url: REVIEW_ENDPOINTS.root, method: "GET", params, signal }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<IResponse<IReview>>({ url: REVIEW_ENDPOINTS.byId(id), method: "GET", signal }),

  getByProduct: (productId: string, signal?: AbortSignal) =>
    request<IResponse<IReview[]>>({
      url: REVIEW_ENDPOINTS.byProduct(productId),
      method: "GET",
      signal,
    }),

  getStats: (signal?: AbortSignal) =>
    request<IResponse<IReviewStats>>({ url: REVIEW_ENDPOINTS.stats, method: "GET", signal }),

  update: ({ id, data }: { id: string; data: Partial<IReview> }) =>
    request<IResponse<IReview>>({ url: REVIEW_ENDPOINTS.byId(id), method: "PATCH", data }),

  approve: (id: string) =>
    request<IResponse<IReview>>({ url: REVIEW_ENDPOINTS.approve(id), method: "PATCH" }),

  reject: (id: string) =>
    request<IResponse<IReview>>({ url: REVIEW_ENDPOINTS.reject(id), method: "PATCH" }),

  remove: (id: string) =>
    request<IResponse<null>>({ url: REVIEW_ENDPOINTS.byId(id), method: "DELETE" }),
};
