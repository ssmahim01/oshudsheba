"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { userServices } from "../services/user.service";

export const useRegisterMutation = createMutationHook(userServices.register);
export const useUpdateUserMutation = createMutationHook(userServices.update);
export const useDeleteUserMutation = createMutationHook(userServices.remove);
export const useUpdateUserPermissionsMutation = createMutationHook(
  userServices.updatePermissions,
);
export const useTrashUpdateUserMutation = createMutationHook(userServices.trashUser);
export const useTrashUpdateCustomerMutation = createMutationHook(userServices.trashCustomer);

export const useGetSingleUserQuery = createQueryHook(userServices.getOne);
export const useGetAllUsersQuery = createQueryHook(userServices.getAll);
export const useGetAllCustomersQuery = createQueryHook(userServices.getCustomers);
export const useGetMyCustomersQuery = createQueryHook(userServices.getMyCustomers);
export const useGetMeQuery = createQueryHook(userServices.getMe);
export const useGetAllTrashUsersQuery = createQueryHook(userServices.getTrashUsers);
export const useGetAllTrashCustomersQuery = createQueryHook(userServices.getTrashCustomers);
