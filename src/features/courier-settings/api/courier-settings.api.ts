import { request, type Untyped } from "@/lib/query";
import type { IResponse } from "@/types";
import type {
  CourierSettings,
  CourierSettingsResponse,
  GetAllCourierSettingsResponse,
} from "@/types/courierSettings";

import { COURIER_SETTINGS_ENDPOINTS } from "../constants";

export const courierSettingsApi = {
  create: (data: Untyped) =>
    request<CourierSettingsResponse>({
      url: COURIER_SETTINGS_ENDPOINTS.create,
      method: "POST",
      data,
    }),

  getAll: (params: Record<string, Untyped>, signal?: AbortSignal) =>
    request<GetAllCourierSettingsResponse>({
      url: COURIER_SETTINGS_ENDPOINTS.all,
      method: "GET",
      params,
      signal,
    }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<CourierSettingsResponse>({
      url: COURIER_SETTINGS_ENDPOINTS.byId(id),
      method: "GET",
      signal,
    }),

  getByProvider: (provider: string, signal?: AbortSignal) =>
    request<CourierSettingsResponse>({
      url: COURIER_SETTINGS_ENDPOINTS.byProvider(provider),
      method: "GET",
      signal,
    }),

  update: ({ id, data }: { id: string; data: Partial<CourierSettings> }) =>
    request<CourierSettingsResponse>({
      url: COURIER_SETTINGS_ENDPOINTS.byId(id),
      method: "PATCH",
      data,
    }),

  toggleStatus: (id: string) =>
    request<CourierSettingsResponse>({
      url: COURIER_SETTINGS_ENDPOINTS.toggleStatus(id),
      method: "PATCH",
    }),

  remove: (id: string) =>
    request<IResponse<null>>({ url: COURIER_SETTINGS_ENDPOINTS.byId(id), method: "DELETE" }),
};
