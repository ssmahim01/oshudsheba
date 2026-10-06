import { DASHBOARD_ENDPOINTS } from "../constants";
import type { DashboardParams } from "../api/dashboard.api";

/** Same URL the RTK endpoint built: falsy values are dropped, the rest go in the query string. */
export function buildOverviewUrl(params?: DashboardParams | void): string {
  let url: string = DASHBOARD_ENDPOINTS.overview;
  if (params) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    const queryString = queryParams.toString();
    if (queryString) url += `?${queryString}`;
  }
  return url;
}
