"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { productPurchaseServices as s } from "../services/product-purchase.service";

export const useCreateProductPurchaseMutation = createMutationHook(s.create);
export const useUpdateProductPurchaseMutation = createMutationHook(s.update);
export const useDeleteProductPurchaseMutation = createMutationHook(s.remove);
export const useUpdatePurchaseStatusMutation = createMutationHook(s.updateStatus);

export const useGetAllProductPurchasesQuery = createQueryHook(s.getAll);
export const useGetSingleProductPurchaseQuery = createQueryHook(s.getOne);
export const useGetPurchaseStatsQuery = createQueryHook(s.getStats);
