"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { productBlogServices } from "../services/product-blog.service";

export const useCreateProductBlogMutation = createMutationHook(productBlogServices.create);
export const useUpdateProductBlogMutation = createMutationHook(productBlogServices.update);
export const useDeleteProductBlogMutation = createMutationHook(productBlogServices.remove);
export const useIncreaseProductBlogViewMutation = createMutationHook(
  productBlogServices.increaseView,
);

export const useGetAllProductBlogsQuery = createQueryHook(productBlogServices.getAll);
export const useGetSingleProductBlogQuery = createQueryHook(productBlogServices.getOne);
