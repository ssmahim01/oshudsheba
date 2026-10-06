import type { QueryFunction, QueryKey } from "@tanstack/react-query";

import type { CacheTag } from "./tags";

/** Plain, serialisable description of a query (also usable for server prefetch). */
export interface QuerySpec<TData> {
  queryKey: QueryKey;
  queryFn: QueryFunction<TData, QueryKey>;
  meta?: { tags: readonly CacheTag[] | ((data: unknown) => readonly CacheTag[]) };
}

export interface MutationSpec<TArg, TData> {
  mutationFn: (arg: TArg) => Promise<TData>;
  /** Tags to invalidate after the mutation succeeds. */
  invalidates?: (arg: TArg, data: TData) => readonly CacheTag[];
}

export const defineQuery = <TData>(spec: QuerySpec<TData>): QuerySpec<TData> =>
  spec;

export const defineMutation = <TArg, TData>(
  spec: MutationSpec<TArg, TData>,
): MutationSpec<TArg, TData> => spec;

/**
 * Endpoints that were declared without generics in RTK Query resolved to
 * loosely-typed data; pages rely on that, so they keep an explicit escape hatch.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Untyped = any;
