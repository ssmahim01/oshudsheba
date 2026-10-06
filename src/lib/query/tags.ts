import type { QueryClient } from "@tanstack/react-query";

/** Same tag vocabulary the RTK `baseApi` used. */
export type CacheTagType =
  | "ME"
  | "USERS"
  | "USER"
  | "CUSTOMERS"
  | "CUSTOMER"
  | "PRODUCTS"
  | "PRODUCT"
  | "PRODUCT_VERIFICATION"
  | "PRODUCT_PURCHASES"
  | "PRODUCT_PURCHASE"
  | "BRANDS"
  | "BRAND"
  | "CATEGORIES"
  | "CATEGORY"
  | "ORDERS"
  | "ORDER"
  | "MY_ORDERS"
  | "RETURNS"
  | "RETURN"
  | "COURIERS"
  | "COURIER"
  | "COURIER_SETTINGS"
  | "COURIER_SETTING"
  | "DASHBOARD_OVERVIEW"
  | "DASHBOARD_STATS"
  | "POSSTATS"
  | "COUPONS"
  | "LEADS"
  | "LEAD"
  | "REVIEWS"
  | "REVIEW"
  | "PRODUCT_BLOG";

export type CacheTag = CacheTagType | `${CacheTagType}:${string}`;

/** `tag("ORDER", id)` -> "ORDER:<id>"; `tag("ORDER")` -> every ORDER tag. */
export function tag(type: CacheTagType, id?: string): CacheTag {
  return id ? `${type}:${id}` : type;
}

type TagsMeta = readonly CacheTag[] | ((data: unknown) => readonly CacheTag[]);

const typeOf = (value: CacheTag): CacheTagType =>
  value.split(":", 1)[0] as CacheTagType;

function providedTags(
  meta: Record<string, unknown> | undefined,
  data: unknown,
): readonly CacheTag[] {
  const tags = meta?.tags as TagsMeta | undefined;
  if (!tags) return [];
  return typeof tags === "function" ? tags(data) : tags;
}

/**
 * Tag-based invalidation with RTK Query semantics:
 * - "USER"      invalidates every query providing "USER" or "USER:<id>"
 * - "USER:<id>" invalidates only queries providing exactly that tag
 * Active matches refetch immediately, inactive ones on their next mount.
 */
export function invalidateTags(
  client: QueryClient,
  tags: readonly CacheTag[],
): Promise<void> {
  if (tags.length === 0) return Promise.resolve();
  const wanted = new Set<string>(tags);

  return client.invalidateQueries({
    predicate: (query) =>
      providedTags(query.meta, query.state.data).some(
        (provided) => wanted.has(provided) || wanted.has(typeOf(provided)),
      ),
  });
}
