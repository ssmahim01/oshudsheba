"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { courierSettingsServices } from "../services/courier-settings.service";

export const useCreateCourierSettingsMutation = createMutationHook(courierSettingsServices.create);
export const useUpdateCourierSettingsMutation = createMutationHook(courierSettingsServices.update);
export const useToggleCourierSettingsStatusMutation = createMutationHook(
  courierSettingsServices.toggleStatus,
);
export const useDeleteCourierSettingsMutation = createMutationHook(courierSettingsServices.remove);

export const useGetAllCourierSettingsQuery = createQueryHook(courierSettingsServices.getAll);
export const useGetSingleCourierSettingsQuery = createQueryHook(courierSettingsServices.getOne);
export const useGetCourierSettingsByProviderQuery = createQueryHook(
  courierSettingsServices.getByProvider,
);
