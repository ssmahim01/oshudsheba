import { request, type Untyped } from "@/lib/query";

import { buildOverviewUrl } from "../utils/build-overview-url";

export interface DashboardParams {
  "createdAt[gte]"?: string;
  "createdAt[lte]"?: string;
  orderStatus?: string;
}

export const dashboardApi = {
  getOverview: (params?: DashboardParams | void, signal?: AbortSignal) =>
    request<Untyped>({ url: buildOverviewUrl(params), signal }),
};
