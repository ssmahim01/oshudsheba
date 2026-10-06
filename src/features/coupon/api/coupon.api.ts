import { request } from "@/lib/query";

import { COUPON_ENDPOINTS } from "../constants";
import type {
  ApplyCouponPayload,
  ApplyCouponResponse,
  CreateCouponPayload,
  GetCouponsQueryParams,
  GetCouponsResponse,
  ICoupon,
  UpdateCouponPayload,
} from "../types";

export const couponApi = {
  create: (body: CreateCouponPayload) =>
    request<{ success: boolean; data: ICoupon }>({
      url: COUPON_ENDPOINTS.create,
      method: "POST",
      data: body,
    }),

  update: ({ id, ...body }: { id: string } & UpdateCouponPayload) =>
    request<{ success: boolean; data: ICoupon }>({
      url: COUPON_ENDPOINTS.byId(id),
      method: "PATCH",
      data: body,
    }),

  remove: ({ id }: { id: string }) =>
    request<{ success: boolean; message: string }>({
      url: COUPON_ENDPOINTS.byId(id),
      method: "DELETE",
    }),

  apply: (body: ApplyCouponPayload) =>
    request<{ success: boolean; data: ApplyCouponResponse }>({
      url: COUPON_ENDPOINTS.apply,
      method: "POST",
      data: body,
    }),

  getAll: (params: GetCouponsQueryParams, signal?: AbortSignal) =>
    request<GetCouponsResponse>({ url: COUPON_ENDPOINTS.list, method: "GET", params, signal }),
};
