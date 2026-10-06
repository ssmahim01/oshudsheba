import { defineMutation, defineQuery, tag } from "@/lib/query";
import type { GetQueryParams } from "@/types";

import { categoryApi } from "../api/category.api";
import { categoryKeys } from "../constants";

export const categoryServices = {
  getOne: (slug: string) =>
    defineQuery({
      queryKey: categoryKeys.detail(slug),
      queryFn: ({ signal }) => categoryApi.getOne(slug, signal),
      meta: { tags: [tag("CATEGORY", slug)] },
    }),

  getAll: (params: GetQueryParams) =>
    defineQuery({
      queryKey: categoryKeys.list(params),
      queryFn: ({ signal }) => categoryApi.getAll(params, signal),
      meta: { tags: [tag("CATEGORIES")] },
    }),

  getTrash: (params: GetQueryParams) =>
    defineQuery({
      queryKey: categoryKeys.trash(params),
      queryFn: ({ signal }) => categoryApi.getTrash(params, signal),
      meta: { tags: [tag("CATEGORIES")] },
    }),

  getByProduct: (slug: string) =>
    defineQuery({
      queryKey: categoryKeys.byProduct(slug),
      queryFn: ({ signal }) => categoryApi.getByProduct(slug, signal),
      meta: { tags: [tag("CATEGORIES")] },
    }),

  create: defineMutation({
    mutationFn: categoryApi.create,
    invalidates: () => [tag("CATEGORIES")],
  }),

  update: defineMutation({
    mutationFn: categoryApi.update,
    invalidates: (arg) => [tag("CATEGORIES"), tag("CATEGORY", arg.id)],
  }),

  remove: defineMutation({
    mutationFn: categoryApi.remove,
    invalidates: (id) => [tag("CATEGORIES"), tag("CATEGORY", id)],
  }),

  // Old endpoint invalidated { type, _id } (no id) = every CATEGORY tag. Preserved.
  trash: defineMutation({
    mutationFn: categoryApi.trash,
    invalidates: () => [tag("CATEGORIES"), tag("CATEGORY")],
  }),
};
