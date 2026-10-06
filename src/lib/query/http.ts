import { isAxiosError, type AxiosRequestConfig } from "axios";

import { axiosInstance } from "@/lib/axios";

/**
 * Error shape every page already reads (`error.status`, `error.data.message`).
 * It is identical to what the old `axiosBaseQuery` returned.
 */
export interface ApiError {
  status: number | string;
  data: unknown;
}

export function isApiError(value: unknown): value is ApiError {
  return (
    typeof value === "object" &&
    value !== null &&
    "status" in value &&
    "data" in value
  );
}

export function toApiError(error: unknown): ApiError {
  if (isApiError(error)) return error;

  if (isAxiosError(error)) {
    return {
      status: error.response?.status ?? "FETCH_ERROR",
      data: error.response?.data ?? error.message ?? "Something went wrong",
    };
  }

  return {
    status: "FETCH_ERROR",
    data: error instanceof Error ? error.message : "Something went wrong",
  };
}

/**
 * Single HTTP entry point for every feature API. Uses the shared axios
 * instance, so cookie auth and the refresh-token interceptor are unchanged.
 */
export async function request<TResponse>(
  config: AxiosRequestConfig,
): Promise<TResponse> {
  try {
    const response = await axiosInstance.request<TResponse>({
      withCredentials: true,
      ...config,
    });
    return response.data;
  } catch (error) {
    throw toApiError(error);
  }
}
