"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { posServices } from "../services/pos.service";

export const useCreatePOSOrderMutation = createMutationHook(posServices.createOrder);
export const useUpdatePOSOrderStatusMutation = createMutationHook(posServices.updateOrderStatus);
export const useCancelPOSOrderMutation = createMutationHook(posServices.cancelOrder);

export const useGetAllPOSOrdersQuery = createQueryHook(posServices.getOrders);
export const useGetSinglePOSOrderQuery = createQueryHook(posServices.getOrder);
export const useGetPOSStatsQuery = createQueryHook(posServices.getStats);
export const useGetTodayPOSOrdersQuery = createQueryHook(posServices.getToday);
