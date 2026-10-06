import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types/orders";

import { ordersApi, type MyOrdersQueryParams } from "../api/orders.api";
import { orderKeys } from "../constants";
import type { MyOrderListKind, OrderListKind } from "../constants";

const listService = (kind: OrderListKind) => (params: GetQueryParams) =>
  defineQuery({
    queryKey: orderKeys.list(kind, params),
    queryFn: ({ signal }) => ordersApi.getList(kind, params, signal),
    meta: { tags: [tag("ORDERS")] },
  });

const myListService = (kind: MyOrderListKind) => (params: MyOrdersQueryParams) =>
  defineQuery({
    queryKey: orderKeys.mine(kind, params),
    queryFn: ({ signal }) => ordersApi.getMine(kind, params, signal),
    meta: { tags: [tag("ORDERS")] },
  });

const withOrder = (arg: { _id: string }) => [tag("ORDER", arg._id), tag("ORDERS")];

export const ordersServices = {
  getAll: listService("all"),
  getScheduled: listService("scheduled"),
  getHold: listService("hold"),
  getNoResponse: listService("noResponse"),
  getWaitingStock: listService("waitingStock"),

  getMy: myListService("all"),
  getMyScheduled: myListService("scheduled"),
  getMyHold: myListService("hold"),
  getMyWaitingForStock: myListService("waitingStock"),

  getOne: (id: string) =>
    defineQuery({
      queryKey: orderKeys.detail(id),
      queryFn: ({ signal }) => ordersApi.getOne(id, signal),
      meta: { tags: [tag("ORDER", id)] },
    }),

  // Untagged on purpose, as before.
  getDamagedProducts: (_arg?: void) =>
    defineQuery({
      queryKey: orderKeys.damagedProducts(),
      queryFn: ({ signal }) => ordersApi.getDamagedProducts(signal),
    }),

  create: defineMutation({
    mutationFn: ordersApi.create,
    invalidates: () => [tag("ORDERS"), tag("POSSTATS")],
  }),
  update: defineMutation({ mutationFn: ordersApi.update, invalidates: withOrder }),
  updateSeller: defineMutation({ mutationFn: ordersApi.updateSeller, invalidates: withOrder }),
  confirm: defineMutation({ mutationFn: ordersApi.confirm, invalidates: withOrder }),
  markNoResponse: defineMutation({ mutationFn: ordersApi.markNoResponse, invalidates: withOrder }),
  restoreNoResponse: defineMutation({
    mutationFn: ordersApi.restoreNoResponse,
    invalidates: (arg) => [...withOrder(arg), tag("PRODUCTS")],
  }),
  complete: defineMutation({
    mutationFn: ordersApi.complete,
    invalidates: (arg) => [...withOrder(arg), tag("COURIERS")],
  }),
  partialUpdate: defineMutation({
    mutationFn: ordersApi.partialUpdate,
    invalidates: () => [tag("ORDERS")],
  }),
  exchange: defineMutation({ mutationFn: ordersApi.exchange, invalidates: () => [tag("ORDERS")] }),
  markDamage: defineMutation({ mutationFn: ordersApi.markDamage, invalidates: () => [tag("ORDERS")] }),
  remove: defineMutation({ mutationFn: ordersApi.remove, invalidates: () => [tag("ORDERS")] }),
  cancel: defineMutation({
    mutationFn: ordersApi.cancel,
    invalidates: () => [tag("ORDERS"), tag("PRODUCTS")],
  }),
  updateManualDeliveryStatus: defineMutation({
    mutationFn: ordersApi.updateManualDeliveryStatus,
    invalidates: () => [tag("ORDERS")],
  }),
  updateDeliveryStatus: defineMutation({
    mutationFn: ordersApi.updateDeliveryStatus,
    invalidates: withOrder,
  }),
};
