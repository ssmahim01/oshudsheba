"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { returnServices } from "../services/return.service";

export const useCreateReturnMutation = createMutationHook(returnServices.create);
export const useUpdateReturnStatusMutation = createMutationHook(returnServices.updateStatus);
export const useDeleteReturnMutation = createMutationHook(returnServices.remove);

export const useGetAllReturnsQuery = createQueryHook(returnServices.getAll);
export const useGetSingleReturnQuery = createQueryHook(returnServices.getOne);
