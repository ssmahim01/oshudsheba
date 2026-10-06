import { defineQuery, tag } from "@/lib/query";

import { dashboardApi, type DashboardParams } from "../api/dashboard.api";
import { dashboardKeys } from "../constants";

export const dashboardServices = {
  getOverview: (params?: DashboardParams | void) =>
    defineQuery({
      queryKey: dashboardKeys.overview(params),
      queryFn: ({ signal }) => dashboardApi.getOverview(params, signal),
      meta: { tags: [tag("DASHBOARD_OVERVIEW")] },
    }),
};
