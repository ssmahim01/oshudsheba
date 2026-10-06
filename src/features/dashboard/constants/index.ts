import type { DashboardParams } from "../api/dashboard.api";

export const DASHBOARD_ENDPOINTS = {
  overview: "/dashboard/overview",
} as const;

export const dashboardKeys = {
  all: ["dashboard"] as const,
  overview: (params?: DashboardParams | void) =>
    [...dashboardKeys.all, "overview", params ?? null] as const,
};
