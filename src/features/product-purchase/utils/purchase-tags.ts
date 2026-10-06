import { tag, type CacheTag } from "@/lib/query";

import type { GetAllProductPurchasesResponse } from "../api/product-purchase.api";

/**
 * Cache tags provided by the purchases list: one per purchase plus the list
 * tag. (Identical to the old `providesTags` callback.)
 */
export function providePurchaseListTags(data: unknown): readonly CacheTag[] {
  const result = data as GetAllProductPurchasesResponse | undefined;
  return result?.data
    ? [...result.data.map((purchase) => tag("PRODUCT_PURCHASE", purchase._id)), tag("PRODUCT_PURCHASES")]
    : [tag("PRODUCT_PURCHASES")];
}
