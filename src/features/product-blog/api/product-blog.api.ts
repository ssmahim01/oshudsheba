import { request } from "@/lib/query";
import type { IResponse } from "@/types";
import type { IProductBlog } from "@/types/productBlog";

import { PRODUCT_BLOG_ENDPOINTS } from "../constants";

export interface IProductBlogFormData {
  title: string;
  shortDescription: string;
  content: string;
  thumbnail?: string;
  banner?: string;
  category: string;
  contentType: string;
  tags?: string[];
  featured?: boolean;
  status?: "PUBLISHED" | "DRAFT";
}

export interface ProductBlogQueryParams {
  page?: number;
  limit?: number;
  searchTerm?: string;
  status?: string;
  category?: string;
  contentType?: string;
  featured?: boolean;
  sort?: string;
}

export interface ProductBlogListResponse {
  success: boolean;
  message: string;
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPage: number;
  };
  data: { data: IProductBlog[] };
}

export interface ProductBlogResponse {
  success: boolean;
  message: string;
  data: IProductBlog;
}

export const productBlogApi = {
  create: (data: IProductBlogFormData) =>
    request<ProductBlogResponse>({ url: PRODUCT_BLOG_ENDPOINTS.root, method: "POST", data }),

  getAll: (params: ProductBlogQueryParams, signal?: AbortSignal) =>
    request<ProductBlogListResponse>({
      url: PRODUCT_BLOG_ENDPOINTS.root,
      method: "GET",
      params,
      signal,
    }),

  getOne: (idOrSlug: string, signal?: AbortSignal) =>
    request<ProductBlogResponse>({
      url: PRODUCT_BLOG_ENDPOINTS.byId(idOrSlug),
      method: "GET",
      signal,
    }),

  update: ({ id, data }: { id: string; data: Partial<IProductBlogFormData> }) =>
    request<ProductBlogResponse>({ url: PRODUCT_BLOG_ENDPOINTS.byId(id), method: "PATCH", data }),

  remove: (id: string) =>
    request<IResponse<null>>({ url: PRODUCT_BLOG_ENDPOINTS.byId(id), method: "DELETE" }),

  increaseView: (id: string) =>
    request<ProductBlogResponse>({ url: PRODUCT_BLOG_ENDPOINTS.view(id), method: "PATCH" }),
};
