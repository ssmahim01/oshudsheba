"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { courierServices } from "../services/courier.service";

export const useCreateCourierMutation = createMutationHook(courierServices.create);
export const useUpdateCourierStatusMutation = createMutationHook(courierServices.updateStatus);
export const useDeleteCourierMutation = createMutationHook(courierServices.remove);

export const useGetAllCouriersQuery = createQueryHook(courierServices.getAll);
export const useGetSingleCourierQuery = createQueryHook(courierServices.getOne);
export const useGetCourierByOrderIdQuery = createQueryHook(courierServices.getByOrderId);
