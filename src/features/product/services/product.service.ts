import { defineMutation, defineQuery, tag, type Untyped } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { productApi } from "../api/product.api";
import { productKeys } from "../constants";

export const productServices = {
  getOne: (slug: string) =>
    defineQuery({
      queryKey: productKeys.detail(slug),
      queryFn: ({ signal }) => productApi.getOne(slug, signal),
      meta: { tags: [tag("PRODUCT", slug)] },
    }),

  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: productKeys.list(params),
      queryFn: ({ signal }) => productApi.getAll(params, signal),
      meta: { tags: [tag("PRODUCTS")] },
    }),

  getTrash: (params: GetQueryParams) =>
    defineQuery({
      queryKey: productKeys.trash(params),
      queryFn: ({ signal }) => productApi.getTrash(params, signal),
      meta: { tags: [tag("PRODUCTS")] },
    }),

  create: defineMutation({
    mutationFn: productApi.create,
    invalidates: () => [tag("PRODUCTS")],
  }),

  // Old code invalidated { type: "PRODUCT", _id } (no `id`) = every PRODUCT tag.
  update: defineMutation({
    mutationFn: productApi.update,
    invalidates: () => [tag("PRODUCTS"), tag("PRODUCT")],
  }),

  remove: defineMutation({
    mutationFn: productApi.remove,
    invalidates: (id) => [tag("PRODUCTS"), tag("PRODUCT", id)],
  }),

  toggleFeatured: defineMutation({
    mutationFn: (id: Untyped) => productApi.toggleFeatured(id),
    invalidates: () => [tag("PRODUCTS")],
  }),

  assignMissingBarcodes: defineMutation({
    mutationFn: (_arg?: void) => productApi.assignMissingBarcodes(),
    invalidates: () => [tag("PRODUCTS")],
  }),

  trash: defineMutation({
    mutationFn: productApi.trash,
    invalidates: () => [tag("PRODUCTS"), tag("PRODUCT")],
  }),
};
