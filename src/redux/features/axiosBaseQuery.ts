
import type {
  BaseQueryFn,
} from "@reduxjs/toolkit/query";

import type {
  AxiosRequestConfig,
  AxiosError,
} from "axios";

import { axiosInstance } from "@/lib/axios";

interface AxiosBaseQueryArgs {
  url: string;
  method?: AxiosRequestConfig["method"];
  data?: AxiosRequestConfig["data"];
  params?: AxiosRequestConfig["params"];
  headers?: AxiosRequestConfig["headers"];
}

interface AxiosBaseQueryError {
  status: number | string;
  data: unknown;
}

const axiosBaseQuery =
  (): BaseQueryFn<
    AxiosBaseQueryArgs,
    unknown,
    AxiosBaseQueryError
  > =>
  async (
    { url, method = "GET", data, params, headers },
    { signal }
  ) => {
    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
        withCredentials: true,
        signal,
      });

      return {
        data: result.data,
      };
    } catch (error) {
      const axiosError = error as AxiosError;

      return {
        error: {
          status: axiosError.response?.status ?? "FETCH_ERROR",
          data:
            axiosError.response?.data ??
            axiosError.message ??
            "Something went wrong",
        },
      };
    }
  };

export default axiosBaseQuery;