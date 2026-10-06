import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { reviewApi } from "../api/review.api";
import { reviewKeys } from "../constants";

const withReview = (id: string) => [tag("REVIEWS"), tag("REVIEW", id)];

export const reviewServices = {
  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: reviewKeys.list(params),
      queryFn: ({ signal }) => reviewApi.getAll(params, signal),
      meta: { tags: [tag("REVIEWS")] },
    }),

  getOne: (id: string) =>
    defineQuery({
      queryKey: reviewKeys.detail(id),
      queryFn: ({ signal }) => reviewApi.getOne(id, signal),
      meta: { tags: [tag("REVIEW", id)] },
    }),

  getByProduct: (productId: string) =>
    defineQuery({
      queryKey: reviewKeys.byProduct(productId),
      queryFn: ({ signal }) => reviewApi.getByProduct(productId, signal),
      meta: { tags: [tag("REVIEWS")] },
    }),

  getStats: (_arg?: void) =>
    defineQuery({
      queryKey: reviewKeys.stats(),
      queryFn: ({ signal }) => reviewApi.getStats(signal),
      meta: { tags: [tag("REVIEWS")] },
    }),

  create: defineMutation({ mutationFn: reviewApi.create, invalidates: () => [tag("REVIEWS")] }),
  update: defineMutation({
    mutationFn: reviewApi.update,
    invalidates: (arg) => withReview(arg.id),
  }),
  approve: defineMutation({ mutationFn: reviewApi.approve, invalidates: withReview }),
  reject: defineMutation({ mutationFn: reviewApi.reject, invalidates: withReview }),
  remove: defineMutation({ mutationFn: reviewApi.remove, invalidates: withReview }),
};
