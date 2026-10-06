import { defineMutation, defineQuery, tag } from "@/lib/query";

import { couponApi } from "../api/coupon.api";
import { couponKeys } from "../constants";
import type { GetCouponsQueryParams } from "../types";

export const couponServices = {
  getAll: (params: GetCouponsQueryParams) =>
    defineQuery({
      queryKey: couponKeys.list(params),
      queryFn: ({ signal }) => couponApi.getAll(params, signal),
      meta: { tags: [tag("COUPONS")] },
    }),

  create: defineMutation({ mutationFn: couponApi.create, invalidates: () => [tag("COUPONS")] }),
  update: defineMutation({ mutationFn: couponApi.update, invalidates: () => [tag("COUPONS")] }),
  remove: defineMutation({ mutationFn: couponApi.remove, invalidates: () => [tag("COUPONS")] }),
  // Applying a coupon does not change cached lists (as before).
  apply: defineMutation({ mutationFn: couponApi.apply }),
};
