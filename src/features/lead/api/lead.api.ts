import { request, type Untyped } from "@/lib/query";
import type { GetQueryParams, IPaginationMeta, IResponse } from "@/types";
import type { ILead, ILeadApiResponse, ILeadResponse, LeadInput } from "@/types/lead.types";

import { LEAD_ENDPOINTS } from "../constants";

export interface GetAllLeadResponse {
  success: boolean;
  data: ILead[];
  meta: IPaginationMeta;
}

export const leadApi = {
  create: (formData: LeadInput) =>
    request<IResponse<ILeadResponse>>({
      url: LEAD_ENDPOINTS.create,
      method: "POST",
      data: formData,
    }),

  update: ({ id, data }: { id: string; data: LeadInput }) =>
    request<IResponse<ILead>>({ url: LEAD_ENDPOINTS.byId(id), method: "PATCH", data }),

  remove: (id: string) =>
    request<IResponse<{ id: string }>>({ url: LEAD_ENDPOINTS.byId(id), method: "DELETE" }),

  getOne: (id: string, signal?: AbortSignal) =>
    request<ILeadApiResponse>({ url: LEAD_ENDPOINTS.byId(id), method: "GET", signal }),

  checkFraud: (phone: string, signal?: AbortSignal) =>
    request<Untyped>({ url: LEAD_ENDPOINTS.fraudCheck(phone), method: "GET", signal }),

  getAll: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllLeadResponse>({ url: LEAD_ENDPOINTS.all, method: "GET", params, signal }),

  getTrash: (params: GetQueryParams, signal?: AbortSignal) =>
    request<GetAllLeadResponse>({ url: LEAD_ENDPOINTS.trash, method: "GET", params, signal }),

  trash: ({ _id }: { _id: string }) =>
    request<IResponse<ILead>>({ url: LEAD_ENDPOINTS.trashOne(_id), method: "POST" }),
};
