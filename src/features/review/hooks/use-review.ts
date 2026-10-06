"use client";

import { createMutationHook, createQueryHook } from "@/lib/query";

import { reviewServices as s } from "../services/review.service";

export const useCreateReviewMutation = createMutationHook(s.create);
export const useUpdateReviewMutation = createMutationHook(s.update);
export const useApproveReviewMutation = createMutationHook(s.approve);
export const useRejectReviewMutation = createMutationHook(s.reject);
export const useDeleteReviewMutation = createMutationHook(s.remove);

export const useGetAllReviewsQuery = createQueryHook(s.getAll);
export const useGetSingleReviewQuery = createQueryHook(s.getOne);
export const useGetProductReviewsQuery = createQueryHook(s.getByProduct);
export const useGetReviewStatsQuery = createQueryHook(s.getStats);
