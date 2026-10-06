"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { ordersServices as s } from "../services/orders.service";

// Queries
export const useGetAllOrdersQuery = createQueryHook(s.getAll);
export const useGetAllScheduledOrdersQuery = createQueryHook(s.getScheduled);
export const useGetAllholdOrdersQuery = createQueryHook(s.getHold);
export const useGetAllNoResponseOrdersQuery = createQueryHook(s.getNoResponse);
export const useGetAllWaitingStockOrdersQuery = createQueryHook(s.getWaitingStock);
export const useGetSingleOrderQuery = createQueryHook(s.getOne);
export const useGetAllDamagedProductsQuery = createQueryHook(s.getDamagedProducts);

export const useGetMyOrdersQuery = createQueryHook(s.getMy);
export const useGetMyScheduledOrdersQuery = createQueryHook(s.getMyScheduled);
export const useGetMyHoldOrdersQuery = createQueryHook(s.getMyHold);
export const useGetMyWaitingForStockOrdersQuery = createQueryHook(s.getMyWaitingForStock);

// Mutations
export const useCreateOrderMutation = createMutationHook(s.create);
export const useUpdateOrderMutation = createMutationHook(s.update);
export const useUpdateSellerMutation = createMutationHook(s.updateSeller);
export const useConfirmOrderMutation = createMutationHook(s.confirm);
export const useMarkNoResponseMutation = createMutationHook(s.markNoResponse);
export const useRestoreNoResponseMutation = createMutationHook(s.restoreNoResponse);
export const useCompleteOrderMutation = createMutationHook(s.complete);
export const usePartialUpdateOrderMutation = createMutationHook(s.partialUpdate);
export const useExchangeOrderMutation = createMutationHook(s.exchange);
export const useMarkDamageMutation = createMutationHook(s.markDamage);
export const useDeleteOrderMutation = createMutationHook(s.remove);
export const useCancelOrderMutation = createMutationHook(s.cancel);
export const useUpdateManualDeliveryStatusMutation = createMutationHook(
  s.updateManualDeliveryStatus,
);
export const useUpdateDeliveryStatusMutation = createMutationHook(s.updateDeliveryStatus);
