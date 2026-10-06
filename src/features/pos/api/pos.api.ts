import { request } from "@/lib/query";
import type { GetQueryParams } from "@/types";
import type { CreatePOSOrderPayload, POSOrder, POSStats } from "@/types/pos";

import { POS_ENDPOINTS } from "../constants";
import { buildPosOrdersUrl } from "../utils/build-orders-url";

export interface POSOrdersResponse {
  data: POSOrder[];
  meta: { total: number; page: number; limit: number };
}

export interface TodayPOSOrdersResponse {
  data: POSOrder[];
  meta: { total: number };
}

export const posApi = {
  createOrder: (data: CreatePOSOrderPayload) =>
    request<POSOrder>({ url: POS_ENDPOINTS.orders, method: "POST", data }),

  getOrders: (params: GetQueryParams, signal?: AbortSignal) =>
    request<POSOrdersResponse>({ url: buildPosOrdersUrl(params), method: "GET", signal }),

  getOrder: (orderId: string, signal?: AbortSignal) =>
    request<POSOrder>({ url: POS_ENDPOINTS.order(orderId), method: "GET", signal }),

  // NOTE: the RTK endpoint sent `{ status }` as `body`, which the axios base
  // query ignored (no payload was sent). Sent as `data` now, the evident
  // intent. No page currently calls this endpoint.
  updateOrderStatus: ({ orderId, status }: { orderId: string; status: POSOrder["status"] }) =>
    request<POSOrder>({
      url: POS_ENDPOINTS.orderStatus(orderId),
      method: "PATCH",
      data: { status },
    }),

  cancelOrder: (orderId: string) =>
    request<POSOrder>({ url: POS_ENDPOINTS.cancel(orderId), method: "POST" }),

  getStats: (signal?: AbortSignal) =>
    request<POSStats>({ url: POS_ENDPOINTS.stats, method: "GET", signal }),

  getToday: (signal?: AbortSignal) =>
    request<TodayPOSOrdersResponse>({ url: POS_ENDPOINTS.today, method: "GET", signal }),
};
