"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { productServices } from "../services/product.service";

export const useCreateProductMutation = createMutationHook(productServices.create);
export const useUpdateProductMutation = createMutationHook(productServices.update);
export const useDeleteProductMutation = createMutationHook(productServices.remove);
export const useToggleFeaturedMutation = createMutationHook(productServices.toggleFeatured);
export const useAssignMissingBarcodesMutation = createMutationHook(
  productServices.assignMissingBarcodes,
);
export const useTrashUpdateProductMutation = createMutationHook(productServices.trash);

export const useGetSingleProductQuery = createQueryHook(productServices.getOne);
export const useGetAllProductsQuery = createQueryHook(productServices.getAll);
export const useGetAllTrashProductsQuery = createQueryHook(productServices.getTrash);
