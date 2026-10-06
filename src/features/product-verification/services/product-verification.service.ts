import { defineMutation, defineQuery, tag, type Untyped } from "@/lib/query";

import { productVerificationApi } from "../api/product-verification.api";
import { productVerificationKeys } from "../constants";

const invalidate = () => [tag("PRODUCT_VERIFICATION")];

export const productVerificationServices = {
  getAll: (params: Untyped) =>
    defineQuery({
      queryKey: productVerificationKeys.list(params),
      queryFn: ({ signal }) => productVerificationApi.getAll(params, signal),
      meta: { tags: [tag("PRODUCT_VERIFICATION")] },
    }),

  // Provides the type-wide tag (not per-id), exactly like the old endpoint.
  getOne: (idOrSlug: string) =>
    defineQuery({
      queryKey: productVerificationKeys.detail(idOrSlug),
      queryFn: ({ signal }) => productVerificationApi.getOne(idOrSlug, signal),
      meta: { tags: [tag("PRODUCT_VERIFICATION")] },
    }),

  create: defineMutation({
    mutationFn: (data: Untyped) => productVerificationApi.create(data),
    invalidates: invalidate,
  }),
  update: defineMutation({
    mutationFn: (arg: Untyped) => productVerificationApi.update(arg),
    invalidates: invalidate,
  }),
  increaseView: defineMutation({
    mutationFn: productVerificationApi.increaseView,
    invalidates: invalidate,
  }),
  remove: defineMutation({
    mutationFn: productVerificationApi.remove,
    invalidates: invalidate,
  }),
};
