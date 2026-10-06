"use client";

import { createLazyQueryHook, createMutationHook, createQueryHook } from "@/lib/query";

import { leadServices } from "../services/lead.service";

export const useCreateLeadMutation = createMutationHook(leadServices.create);
export const useUpdateLeadMutation = createMutationHook(leadServices.update);
export const useDeleteLeadMutation = createMutationHook(leadServices.remove);
export const useTrashUpdateLeadMutation = createMutationHook(leadServices.trash);

export const useGetSingleLeadQuery = createQueryHook(leadServices.getOne);
export const useGetAllLeadQuery = createQueryHook(leadServices.getAll);
export const useGetAllTrashLeadsQuery = createQueryHook(leadServices.getTrash);
export const useLazyCheckFraudQuery = createLazyQueryHook(leadServices.checkFraud);
