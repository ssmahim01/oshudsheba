import { defineMutation, defineQuery, tag, type Untyped } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { userApi } from "../api/user.api";
import { userKeys } from "../constants";

export const userServices = {
  getOne: (id: string) =>
    defineQuery({
      queryKey: userKeys.detail(id),
      queryFn: ({ signal }) => userApi.getOne(id, signal),
      meta: { tags: [tag("USER", id)] },
    }),

  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: userKeys.list(params),
      queryFn: ({ signal }) => userApi.getAll(params, signal),
      meta: { tags: [tag("USERS")] },
    }),

  getCustomers: (params: GetQueryParams) =>
    defineQuery({
      queryKey: userKeys.customers(params),
      queryFn: ({ signal }) => userApi.getCustomers(params, signal),
      meta: { tags: [tag("CUSTOMERS")] },
    }),

  getMyCustomers: (params: GetQueryParams) =>
    defineQuery({
      queryKey: userKeys.myCustomers(params),
      queryFn: ({ signal }) => userApi.getMyCustomers(params, signal),
      meta: { tags: [tag("CUSTOMERS")] },
    }),

  getMe: (_arg?: void) =>
    defineQuery({
      queryKey: userKeys.me(),
      queryFn: ({ signal }) => userApi.getMe(signal),
      meta: { tags: [tag("ME"), tag("USER")] },
    }),

  getTrashUsers: (params: GetQueryParams) =>
    defineQuery({
      queryKey: userKeys.trashUsers(params),
      queryFn: ({ signal }) => userApi.getTrashUsers(params, signal),
      meta: { tags: [tag("USERS")] },
    }),

  getTrashCustomers: (params: GetQueryParams) =>
    defineQuery({
      queryKey: userKeys.trashCustomers(params),
      queryFn: ({ signal }) => userApi.getTrashCustomers(params, signal),
      meta: { tags: [tag("CUSTOMERS")] },
    }),

  register: defineMutation({
    mutationFn: userApi.register,
    invalidates: () => [tag("USERS")],
  }),

  update: defineMutation({
    mutationFn: userApi.update,
    invalidates: (arg) => [tag("USERS"), tag("USER", arg.id)],
  }),

  updatePermissions: defineMutation({
    mutationFn: (arg: Untyped) => userApi.updatePermissions(arg),
  }),

  remove: defineMutation({
    mutationFn: userApi.remove,
    invalidates: (id) => [tag("USERS"), tag("CUSTOMERS"), tag("USER", id), tag("CUSTOMER", id)],
  }),

  // The old endpoint built `{ type: "USER", _id }` (no `id`), which RTK treats
  // as "every USER tag". Kept as type-wide invalidation on purpose.
  trashUser: defineMutation({
    mutationFn: userApi.trashUser,
    invalidates: () => [tag("USERS"), tag("USER")],
  }),

  trashCustomer: defineMutation({
    mutationFn: userApi.trashCustomer,
    invalidates: () => [tag("CUSTOMERS"), tag("CUSTOMER")],
  }),
};
