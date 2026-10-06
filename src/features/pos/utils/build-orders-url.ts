import type { GetQueryParams } from "@/types";

import { POS_ENDPOINTS } from "../constants";

/** Same URL the RTK endpoint built: undefined/null dropped, values stringified. */
export function buildPosOrdersUrl(params: GetQueryParams): string {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  return `${POS_ENDPOINTS.orders}?${searchParams.toString()}`;
}
