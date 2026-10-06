import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { brandApi } from "../api/brand.api";
import { brandKeys } from "../constants";

export const brandServices = {
  getOne: (slug: string) =>
    defineQuery({
      queryKey: brandKeys.detail(slug),
      queryFn: ({ signal }) => brandApi.getOne(slug, signal),
      meta: { tags: [tag("BRAND", slug)] },
    }),

  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: brandKeys.list(params),
      queryFn: ({ signal }) => brandApi.getAll(params, signal),
      meta: { tags: [tag("BRANDS")] },
    }),

  getTrash: (params: GetQueryParams) =>
    defineQuery({
      queryKey: brandKeys.trash(params),
      queryFn: ({ signal }) => brandApi.getTrash(params, signal),
      meta: { tags: [tag("BRANDS")] },
    }),

  getByProduct: (slug: string) =>
    defineQuery({
      queryKey: brandKeys.byProduct(slug),
      queryFn: ({ signal }) => brandApi.getByProduct(slug, signal),
      meta: { tags: [tag("BRANDS")] },
    }),

  create: defineMutation({
    mutationFn: brandApi.create,
    invalidates: () => [tag("BRANDS")],
  }),

  update: defineMutation({
    mutationFn: brandApi.update,
    invalidates: (arg) => [tag("BRANDS"), tag("BRAND", arg.id)],
  }),

  remove: defineMutation({
    mutationFn: brandApi.remove,
    invalidates: (id) => [tag("BRANDS"), tag("BRAND", id)],
  }),

  // Old endpoint invalidated { type, _id } (no id) = every BRAND tag. Preserved.
  trash: defineMutation({
    mutationFn: brandApi.trash,
    invalidates: () => [tag("BRANDS"), tag("BRAND")],
  }),
};
