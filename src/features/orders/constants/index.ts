import type { GetQueryParams } from "@/types/orders";

export const ORDER_ENDPOINTS = {
  root: "/order",
  byId: (id: string) => `/order/${id}`,
  assignSeller: (id: string) => `/order/${id}/assign-seller`,
  confirmStatus: (id: string) => `/order/${id}/confirm-status`,
  noResponse: (id: string) => `/order/${id}/no-response`,
  restoreNoResponse: (id: string) => `/order/${id}/restore-no-response`,
  status: (id: string) => `/order/${id}/status`,
  cancelStatus: (id: string) => `/order/${id}/cancel-status`,
  manualDeliveryStatus: (id: string) => `/order/manual-delivery-status/${id}`,
  partialUpdate: "/order/partial-update",
  exchange: "/order/exchange",
  damage: "/order/damage",
  damagedProducts: "/order/damaged-products",
} as const;

/** Admin/staff order lists (all share the ORDERS tag). */
export const ORDER_LIST_ENDPOINTS = {
  all: "/order",
  scheduled: "/order/scheduled-orders",
  hold: "/order/hold-orders",
  noResponse: "/order/no-response",
  waitingStock: "/order/waiting-stock",
} as const;

/** "My orders" lists for the signed-in seller. */
export const MY_ORDER_ENDPOINTS = {
  all: "/order/my-orders",
  scheduled: "/order/my-scheduled-orders",
  hold: "/order/my-hold-orders",
  waitingStock: "/order/my-waiting-for-stock",
} as const;

export type OrderListKind = keyof typeof ORDER_LIST_ENDPOINTS;
export type MyOrderListKind = keyof typeof MY_ORDER_ENDPOINTS;

export const orderKeys = {
  all: ["orders"] as const,
  list: (kind: OrderListKind, params?: GetQueryParams) =>
    [...orderKeys.all, "list", kind, params] as const,
  mine: (kind: MyOrderListKind, params?: unknown) =>
    [...orderKeys.all, "mine", kind, params] as const,
  detail: (id: string) => [...orderKeys.all, "detail", id] as const,
  damagedProducts: () => [...orderKeys.all, "damaged-products"] as const,
};
