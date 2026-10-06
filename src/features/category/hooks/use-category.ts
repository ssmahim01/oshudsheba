"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { categoryServices } from "../services/category.service";

export const useCreateCategoryMutation = createMutationHook(categoryServices.create);
export const useUpdateCategoryMutation = createMutationHook(categoryServices.update);
export const useDeleteCategoryMutation = createMutationHook(categoryServices.remove);
export const useTrashUpdateCategoryMutation = createMutationHook(categoryServices.trash);

export const useGetSingleCategoryQuery = createQueryHook(categoryServices.getOne);
export const useGetAllCategoriesQuery = createQueryHook(categoryServices.getAll);
export const useGetAllTrashCategoriesQuery = createQueryHook(categoryServices.getTrash);
export const useGetAllCategoryByProductQuery = createQueryHook(categoryServices.getByProduct);
