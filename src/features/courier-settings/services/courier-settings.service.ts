import { defineMutation, defineQuery, tag, type Untyped } from "@/lib/query";

import { courierSettingsApi } from "../api/courier-settings.api";
import { courierSettingsKeys } from "../constants";

export const courierSettingsServices = {
  getAll: (params: Record<string, Untyped>) =>
    defineQuery({
      queryKey: courierSettingsKeys.list(params),
      queryFn: ({ signal }) => courierSettingsApi.getAll(params, signal),
      meta: { tags: [tag("COURIER_SETTINGS")] },
    }),

  getOne: (id: string) =>
    defineQuery({
      queryKey: courierSettingsKeys.detail(id),
      queryFn: ({ signal }) => courierSettingsApi.getOne(id, signal),
      meta: { tags: [tag("COURIER_SETTING", id)] },
    }),

  getByProvider: (provider: string) =>
    defineQuery({
      queryKey: courierSettingsKeys.byProvider(provider),
      queryFn: ({ signal }) => courierSettingsApi.getByProvider(provider, signal),
      meta: { tags: [tag("COURIER_SETTINGS")] },
    }),

  create: defineMutation({
    mutationFn: courierSettingsApi.create,
    invalidates: () => [tag("COURIER_SETTINGS")],
  }),

  update: defineMutation({
    mutationFn: courierSettingsApi.update,
    invalidates: (arg) => [tag("COURIER_SETTINGS"), tag("COURIER_SETTING", arg.id)],
  }),

  toggleStatus: defineMutation({
    mutationFn: courierSettingsApi.toggleStatus,
    invalidates: (id) => [tag("COURIER_SETTINGS"), tag("COURIER_SETTING", id)],
  }),

  remove: defineMutation({
    mutationFn: courierSettingsApi.remove,
    invalidates: () => [tag("COURIER_SETTINGS")],
  }),
};
