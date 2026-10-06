import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { productPurchaseApi } from "../api/product-purchase.api";
import { productPurchaseKeys } from "../constants";
import { providePurchaseListTags } from "../utils/purchase-tags";

const purchaseWrite = (id: string) => [
  tag("PRODUCT_PURCHASES"),
  tag("PRODUCTS"),
  tag("PRODUCT_PURCHASE", id),
];

export const productPurchaseServices = {
  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: productPurchaseKeys.list(params),
      queryFn: ({ signal }) => productPurchaseApi.getAll(params, signal),
      meta: { tags: providePurchaseListTags },
    }),

  getOne: (id: string) =>
    defineQuery({
      queryKey: productPurchaseKeys.detail(id),
      queryFn: ({ signal }) => productPurchaseApi.getOne(id, signal),
      meta: { tags: [tag("PRODUCT_PURCHASE", id)] },
    }),

  getStats: (_arg?: void) =>
    defineQuery({
      queryKey: productPurchaseKeys.stats(),
      queryFn: ({ signal }) => productPurchaseApi.getStats(signal),
      meta: { tags: [tag("PRODUCT_PURCHASES")] },
    }),

  create: defineMutation({
    mutationFn: productPurchaseApi.create,
    invalidates: () => [tag("PRODUCT_PURCHASES"), tag("PRODUCTS")],
  }),
  update: defineMutation({
    mutationFn: productPurchaseApi.update,
    invalidates: (arg) => purchaseWrite(arg._id),
  }),
  remove: defineMutation({
    mutationFn: productPurchaseApi.remove,
    invalidates: (id) => purchaseWrite(id),
  }),
  updateStatus: defineMutation({
    mutationFn: productPurchaseApi.updateStatus,
    invalidates: (arg) => purchaseWrite(arg._id),
  }),
};
