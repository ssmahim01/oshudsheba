import { defineMutation, defineQuery, tag } from "@/lib/query";

import { productBlogApi, type ProductBlogQueryParams } from "../api/product-blog.api";
import { productBlogKeys } from "../constants";

export const productBlogServices = {
  getAll: (params: ProductBlogQueryParams) =>
    defineQuery({
      queryKey: productBlogKeys.list(params),
      queryFn: ({ signal }) => productBlogApi.getAll(params, signal),
      meta: { tags: [tag("PRODUCT_BLOG")] },
    }),

  getOne: (idOrSlug: string) =>
    defineQuery({
      queryKey: productBlogKeys.detail(idOrSlug),
      queryFn: ({ signal }) => productBlogApi.getOne(idOrSlug, signal),
      meta: { tags: [tag("PRODUCT_BLOG", idOrSlug)] },
    }),

  create: defineMutation({
    mutationFn: productBlogApi.create,
    invalidates: () => [tag("PRODUCT_BLOG")],
  }),
  update: defineMutation({
    mutationFn: productBlogApi.update,
    invalidates: () => [tag("PRODUCT_BLOG")],
  }),
  remove: defineMutation({
    mutationFn: productBlogApi.remove,
    invalidates: () => [tag("PRODUCT_BLOG")],
  }),
  // Only refreshes that one blog (not the list), as before.
  increaseView: defineMutation({
    mutationFn: productBlogApi.increaseView,
    invalidates: (id) => [tag("PRODUCT_BLOG", id)],
  }),
};
