import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { leadApi } from "../api/lead.api";
import { leadKeys } from "../constants";

export const leadServices = {
  getOne: (id: string) =>
    defineQuery({
      queryKey: leadKeys.detail(id),
      queryFn: ({ signal }) => leadApi.getOne(id, signal),
      meta: { tags: [tag("LEAD", id)] },
    }),

  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: leadKeys.list(params),
      queryFn: ({ signal }) => leadApi.getAll(params, signal),
      meta: { tags: [tag("LEADS")] },
    }),

  getTrash: (params: GetQueryParams) =>
    defineQuery({
      queryKey: leadKeys.trash(params),
      queryFn: ({ signal }) => leadApi.getTrash(params, signal),
      meta: { tags: [tag("LEADS")] },
    }),

  // No cache tags (as before): every trigger hits the network.
  checkFraud: (phone: string) =>
    defineQuery({
      queryKey: leadKeys.fraud(phone),
      queryFn: ({ signal }) => leadApi.checkFraud(phone, signal),
    }),

  create: defineMutation({ mutationFn: leadApi.create, invalidates: () => [tag("LEADS")] }),
  update: defineMutation({
    mutationFn: leadApi.update,
    invalidates: (arg) => [tag("LEADS"), tag("LEAD", arg.id)],
  }),
  remove: defineMutation({
    mutationFn: leadApi.remove,
    invalidates: (id) => [tag("LEADS"), tag("LEAD", id)],
  }),
  // Old code invalidated { type: "LEAD", _id } (no id) = every LEAD tag.
  trash: defineMutation({
    mutationFn: leadApi.trash,
    invalidates: () => [tag("LEADS"), tag("LEAD")],
  }),
};
