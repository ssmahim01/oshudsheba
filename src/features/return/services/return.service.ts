import { defineMutation, defineQuery, tag, type Untyped } from "@/lib/query";

import { returnApi } from "../api/return.api";
import { returnKeys } from "../constants";

export const returnServices = {
  getAll: (params: Untyped) =>
    defineQuery({
      queryKey: returnKeys.list(params),
      queryFn: ({ signal }) => returnApi.getAll(params, signal),
      meta: { tags: [tag("RETURNS")] },
    }),

  getOne: (id: string) =>
    defineQuery({
      queryKey: returnKeys.detail(id),
      queryFn: ({ signal }) => returnApi.getOne(id, signal),
      meta: { tags: [tag("RETURN", id)] },
    }),

  create: defineMutation({
    mutationFn: (data: Untyped) => returnApi.create(data),
    invalidates: () => [tag("RETURNS"), tag("PRODUCTS"), tag("ORDERS")],
  }),
  updateStatus: defineMutation({
    mutationFn: returnApi.updateStatus,
    invalidates: (arg) => [tag("RETURN", arg.id), tag("RETURNS"), tag("PRODUCTS"), tag("ORDERS")],
  }),
  remove: defineMutation({
    mutationFn: returnApi.remove,
    invalidates: () => [tag("RETURNS")],
  }),
};
