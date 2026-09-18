import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

import config from "@/config";

export const axiosInstance = axios.create({
  baseURL: config.baseUrl,
  withCredentials: true,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

type QueueItem = {
  resolve: () => void;
  reject: (error: unknown) => void;
};

let isRefreshing = false;
let pendingQueue: QueueItem[] = [];

const processQueue = (error: unknown = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  pendingQueue = [];
};

const isRefreshRequest = (url?: string) => {
  return url?.includes("/auth/refresh-token") ?? false;
};

const isLogoutRequest = (url?: string) => {
  return url?.includes("/auth/logout") ?? false;
};

const isTokenExpiredError = (error: AxiosError) => {
  const status = error.response?.status;

  const responseData = error.response?.data as { message?: string } | undefined;

  return (
    status === 401 ||
    (status === 500 && responseData?.message === "jwt expired")
  );
};

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (
      !isTokenExpiredError(error) ||
      originalRequest._retry ||
      isRefreshRequest(originalRequest.url) ||
      isLogoutRequest(originalRequest.url)
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise<void>((resolve, reject) => {
        pendingQueue.push({
          resolve,
          reject,
        });
      }).then(() => axiosInstance(originalRequest));
    }

    isRefreshing = true;

    try {
      await axiosInstance.post("/auth/refresh-token");

      processQueue();

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);
