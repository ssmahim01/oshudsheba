import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { posApi } from "../api/pos.api";
import { posKeys } from "../constants";

const ordersAndStats = () => [tag("ORDERS"), tag("POSSTATS")];

export const posServices = {
  getOrders: (params: GetQueryParams) =>
    defineQuery({
      queryKey: posKeys.orders(params),
      queryFn: ({ signal }) => posApi.getOrders(params, signal),
      meta: { tags: [tag("ORDERS")] },
    }),

  getOrder: (orderId: string) =>
    defineQuery({
      queryKey: posKeys.order(orderId),
      queryFn: ({ signal }) => posApi.getOrder(orderId, signal),
      meta: { tags: [tag("ORDERS")] },
    }),

  getStats: (_arg?: void) =>
    defineQuery({
      queryKey: posKeys.stats(),
      queryFn: ({ signal }) => posApi.getStats(signal),
      meta: { tags: [tag("POSSTATS")] },
    }),

  getToday: (_arg?: void) =>
    defineQuery({
      queryKey: posKeys.today(),
      queryFn: ({ signal }) => posApi.getToday(signal),
      meta: { tags: [tag("ORDERS")] },
    }),

  createOrder: defineMutation({ mutationFn: posApi.createOrder, invalidates: ordersAndStats }),
  updateOrderStatus: defineMutation({
    mutationFn: posApi.updateOrderStatus,
    invalidates: ordersAndStats,
  }),
  cancelOrder: defineMutation({ mutationFn: posApi.cancelOrder, invalidates: ordersAndStats }),
};
