"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { brandServices } from "../services/brand.service";

export const useCreateBrandMutation = createMutationHook(brandServices.create);
export const useUpdateBrandMutation = createMutationHook(brandServices.update);
export const useDeleteBrandMutation = createMutationHook(brandServices.remove);
export const useTrashUpdateBrandMutation = createMutationHook(brandServices.trash);

export const useGetSingleBrandQuery = createQueryHook(brandServices.getOne);
export const useGetAllBrandsQuery = createQueryHook(brandServices.getAll);
export const useGetAllTrashBrandsQuery = createQueryHook(brandServices.getTrash);
export const useGetAllBrandByProductQuery = createQueryHook(brandServices.getByProduct);
