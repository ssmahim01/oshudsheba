"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { productVerificationServices as s } from "../services/product-verification.service";

export const useCreateProductVerificationMutation = createMutationHook(s.create);
export const useUpdateProductVerificationMutation = createMutationHook(s.update);
export const useDeleteProductVerificationMutation = createMutationHook(s.remove);
export const useIncreaseVerificationViewMutation = createMutationHook(s.increaseView);

export const useGetAllProductVerificationsQuery = createQueryHook(s.getAll);
export const useGetSingleProductVerificationQuery = createQueryHook(s.getOne);
