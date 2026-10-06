export const COURIER_SETTINGS_ENDPOINTS = {
  create: "/courier-settings/create-courier-settings",
  all: "/courier-settings/all-courier-settings",
  byId: (id: string) => `/courier-settings/${id}`,
  byProvider: (provider: string) => `/courier-settings/provider/${provider}`,
  toggleStatus: (id: string) => `/courier-settings/${id}/toggle-status`,
} as const;

export const courierSettingsKeys = {
  all: ["courier-settings"] as const,
  list: (params?: Record<string, unknown>) => [...courierSettingsKeys.all, "list", params] as const,
  detail: (id: string) => [...courierSettingsKeys.all, "detail", id] as const,
  byProvider: (provider: string) => [...courierSettingsKeys.all, "provider", provider] as const,
};
