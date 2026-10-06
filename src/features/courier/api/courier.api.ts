import { request } from "@/lib/query";
import type { Courier, CreateCourierRequest } from "@/types/courier";
import type { GetQueryParams } from "@/types/orders";

import { COURIER_ENDPOINTS } from "../constants";

export interface CourierResponse {
  success: boolean;
  data: Courier;
}

export interface GetAllCouriersResponse {
  success: boolean;
  data: Courier[];
  totalCount: number;
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface UpdateCourierStatusArg {
  _id: string;
  status?: string;
  deliveryStatus?: "NOT_SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "FAILED";
}

export const courierApi = {
  create: (data: CreateCourierRequest) =>
    request<CourierResponse>({
      url: COURIER_ENDPOINTS.create,
      method: "POST",
      data: { orderId: data.orderId, courierName: data.courierName },
    }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllCouriersResponse>({ url: COURIER_ENDPOINTS.list, method: "GET", params, signal }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<CourierResponse>({ url: COURIER_ENDPOINTS.byId(id), method: "GET", signal }),

  getByOrderId: (orderId: string, signal?: AbortSignal) =>
    request<CourierResponse>({ url: COURIER_ENDPOINTS.byOrderId(orderId), method: "GET", signal }),

  // NOTE: the RTK endpoint passed this payload as `body`, which the axios base
  // query ignored, so no payload was ever sent. It is sent as `data` now (the
  // evident intent). No page currently calls this endpoint.
  updateStatus: ({ _id, status, deliveryStatus }: UpdateCourierStatusArg) =>
    request<CourierResponse>({
      url: COURIER_ENDPOINTS.byId(_id),
      method: "PATCH",
      data: {
        ...(status && { status }),
        ...(deliveryStatus && { deliveryStatus }),
      },
    }),

  remove: (id: string) =>
    request<{ success: boolean }>({ url: COURIER_ENDPOINTS.byId(id), method: "DELETE" }),
};
