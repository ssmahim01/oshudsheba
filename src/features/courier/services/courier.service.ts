import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types/orders";

import { courierApi } from "../api/courier.api";
import { courierKeys } from "../constants";

export const courierServices = {
  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: courierKeys.list(params),
      queryFn: ({ signal }) => courierApi.getAll(params, signal),
      meta: { tags: [tag("COURIERS")] },
    }),

  getOne: (id: string) =>
    defineQuery({
      queryKey: courierKeys.detail(id),
      queryFn: ({ signal }) => courierApi.getOne(id, signal),
      meta: { tags: [tag("COURIER", id)] },
    }),

  getByOrderId: (orderId: string) =>
    defineQuery({
      queryKey: courierKeys.byOrder(orderId),
      queryFn: ({ signal }) => courierApi.getByOrderId(orderId, signal),
      meta: { tags: [tag("COURIER", orderId)] },
    }),

  create: defineMutation({
    mutationFn: courierApi.create,
    invalidates: () => [tag("COURIERS"), tag("ORDERS")],
  }),

  updateStatus: defineMutation({
    mutationFn: courierApi.updateStatus,
    invalidates: (arg) => [tag("COURIER", arg._id), tag("COURIERS"), tag("ORDERS")],
  }),

  remove: defineMutation({
    mutationFn: courierApi.remove,
    invalidates: () => [tag("COURIERS"), tag("ORDERS")],
  }),
};
