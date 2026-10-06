import { request, type Untyped } from "@/lib/query";
import type { IResponse } from "@/types";
import type { GetAllReturnsResponse, ReturnParcel } from "@/types/return";

import { RETURN_ENDPOINTS } from "../constants";

export interface UpdateReturnStatusArg {
  id: string;
  data: {
    returnStatus?: string;
    refundStatus?: string;
  };
}

export const returnApi = {
  create: (data: Untyped) =>
    request<ReturnParcel>({ url: RETURN_ENDPOINTS.create, method: "POST", data }),

  getAll: (params: Untyped, signal?: AbortSignal) =>
    request<GetAllReturnsResponse>({ url: RETURN_ENDPOINTS.all, method: "GET", params, signal }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<IResponse<ReturnParcel>>({ url: RETURN_ENDPOINTS.byId(id), method: "GET", signal }),

  updateStatus: ({ id, data }: UpdateReturnStatusArg) =>
    request<IResponse<ReturnParcel>>({ url: RETURN_ENDPOINTS.status(id), method: "PATCH", data }),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({ url: RETURN_ENDPOINTS.byId(id), method: "DELETE" }),
};
