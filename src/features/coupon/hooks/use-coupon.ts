"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { couponServices } from "../services/coupon.service";

export const useCreateCouponMutation = createMutationHook(couponServices.create);
export const useUpdateCouponMutation = createMutationHook(couponServices.update);
export const useDeleteCouponMutation = createMutationHook(couponServices.remove);
export const useApplyCouponMutation = createMutationHook(couponServices.apply);

export const useGetAllCouponsQuery = createQueryHook(couponServices.getAll);
