import { request, type Untyped } from "@/lib/query";
import type { IResponse } from "@/types";
import type { GetQueryParams, Order, OrderResponse, UpdateOrderRequest } from "@/types/orders";

import { MY_ORDER_ENDPOINTS, ORDER_ENDPOINTS, ORDER_LIST_ENDPOINTS } from "../constants";
import type { MyOrderListKind, OrderListKind } from "../constants";

export interface GetAllOrdersResponse {
  success: boolean;
  data: Order[];
  totalCount: number;
  stats: {
    total: number;
    PENDING: number;
    CONFIRMED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
  meta?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface MyOrdersResponse {
  success: boolean;
  data: Order[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  stats: {
    total: number;
    PENDING: number;
    CONFIRMED: number;
    COMPLETED: number;
    CANCELLED: number;
  };
}

export interface MyOrdersQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  orderStatus?: string;
  sort?: string;
}

export type DeliveryStatusValue = "NOT_SHIPPED" | "IN_TRANSIT" | "DELIVERED" | "FAILED";

type IdArg = { _id: string };
type OrderMutationArg = { _id: string; data: UpdateOrderRequest };
type StatusArg = { _id: string; orderStatus: string };

const patch = <T>(url: string, data?: unknown) => request<T>({ url, method: "PATCH", data });
const post = <T>(url: string, data?: unknown) => request<T>({ url, method: "POST", data });

export const ordersApi = {
  create: (data: Untyped) => post<Order>(ORDER_ENDPOINTS.root, data),

  getList: (kind: OrderListKind, params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllOrdersResponse>({
      url: ORDER_LIST_ENDPOINTS[kind],
      method: "GET",
      params,
      signal,
    }),

  getMine: (kind: MyOrderListKind, params: MyOrdersQueryParams, signal?: AbortSignal) =>
    request<MyOrdersResponse>({
      url: MY_ORDER_ENDPOINTS[kind],
      method: "GET",
      params,
      signal,
    }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<OrderResponse>({ url: ORDER_ENDPOINTS.byId(id), method: "GET", signal }),

  update: ({ _id, data }: OrderMutationArg) => patch<OrderResponse>(ORDER_ENDPOINTS.byId(_id), data),

  updateSeller: ({ _id, data }: OrderMutationArg) =>
    patch<OrderResponse>(ORDER_ENDPOINTS.assignSeller(_id), data),

  confirm: ({ _id }: StatusArg) =>
    patch<OrderResponse>(ORDER_ENDPOINTS.confirmStatus(_id), { orderStatus: "CONFIRMED" }),

  markNoResponse: ({ _id }: StatusArg) =>
    patch<OrderResponse>(ORDER_ENDPOINTS.noResponse(_id), { orderStatus: "NO_RESPONSE" }),

  restoreNoResponse: ({ _id }: IdArg) =>
    patch<OrderResponse>(ORDER_ENDPOINTS.restoreNoResponse(_id)),

  complete: ({ _id }: StatusArg) =>
    patch<OrderResponse>(ORDER_ENDPOINTS.status(_id), { orderStatus: "COMPLETED" }),

  partialUpdate: (data: Untyped) => post<Untyped>(ORDER_ENDPOINTS.partialUpdate, data),
  exchange: (data: Untyped) => post<Untyped>(ORDER_ENDPOINTS.exchange, data),
  markDamage: (data: Untyped) => post<Untyped>(ORDER_ENDPOINTS.damage, data),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({ url: ORDER_ENDPOINTS.byId(id), method: "DELETE" }),

  getDamagedProducts: (signal?: AbortSignal) =>
    request<Untyped>({ url: ORDER_ENDPOINTS.damagedProducts, method: "GET", signal }),

  cancel: ({
    _id,
    ...data
  }: {
    _id: string;
    orderStatus: string;
    deliveryStatus: string;
  }) => patch<Untyped>(ORDER_ENDPOINTS.cancelStatus(_id), data),

  updateManualDeliveryStatus: ({ id, deliveryStatus }: Untyped) =>
    patch<Untyped>(ORDER_ENDPOINTS.manualDeliveryStatus(id), { deliveryStatus }),

  updateDeliveryStatus: ({
    _id,
    deliveryStatus,
  }: {
    _id: string;
    deliveryStatus: DeliveryStatusValue;
  }) => patch<OrderResponse>(ORDER_ENDPOINTS.byId(_id), { deliveryStatus }),
};
