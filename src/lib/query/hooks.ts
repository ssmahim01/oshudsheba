"use client";

import { useCallback, useState } from "react";
import {
  keepPreviousData,
  skipToken,
  useMutation,
  useQuery,
} from "@tanstack/react-query";

import { getQueryClient } from "./client";
import type { ApiError } from "./http";
import type { MutationSpec, QuerySpec } from "./spec";
import { invalidateTags } from "./tags";

/*
 * Hook factories that expose the exact surface RTK Query hooks had, so pages
 * keep working unchanged:
 *   useXQuery(arg, { skip, pollingInterval, refetchOnMountOrArgChange })
 *       -> { data, currentData, error, isLoading, isFetching, isSuccess,
 *            isError, isUninitialized, status, refetch }
 *   useXMutation() -> [trigger(arg) -> Promise<{data}|{error}> & { unwrap() }, state]
 *   useLazyXQuery() -> [trigger(arg) (same shape), state]
 */

export interface QueryHookOptions {
  skip?: boolean;
  /** ms, same meaning as RTK Query. */
  pollingInterval?: number;
  /** `true` = always refetch on mount; number = seconds of allowed staleness. */
  refetchOnMountOrArgChange?: boolean | number;
}

type QueryStatus = "uninitialized" | "pending" | "fulfilled" | "rejected";

export interface QueryHookResult<TData> {
  data: TData | undefined;
  currentData: TData | undefined;
  error: ApiError | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  isUninitialized: boolean;
  status: QueryStatus;
  refetch: () => Promise<unknown>;
}

type Settled<TData> =
  | { data: TData; error?: undefined }
  | { error: ApiError; data?: undefined };

/** Like an RTK trigger result: never rejects, but exposes `.unwrap()`. */
export type TriggerResult<TData> = Promise<Settled<TData>> & {
  unwrap: () => Promise<TData>;
};

export type MutationTrigger<TArg, TData> = (arg: TArg) => TriggerResult<TData>;

export interface MutationHookState<TData> {
  data: TData | undefined;
  error: ApiError | undefined;
  isLoading: boolean;
  isSuccess: boolean;
  isError: boolean;
  isUninitialized: boolean;
  reset: () => void;
}

function settle<TData>(promise: Promise<TData>): TriggerResult<TData> {
  const settled: Promise<Settled<TData>> = promise.then(
    (data): Settled<TData> => ({ data }),
    (error: ApiError): Settled<TData> => ({ error }),
  );
  return Object.assign(settled, { unwrap: () => promise });
}

export function createQueryHook<TArg, TData>(
  build: (arg: TArg) => QuerySpec<TData>,
) {
  return function useQueryHook(
    arg: TArg,
    options: QueryHookOptions = {},
  ): QueryHookResult<TData> {
    const { skip = false, pollingInterval, refetchOnMountOrArgChange } = options;
    const spec = build(arg);

    const staleTime =
      refetchOnMountOrArgChange === true
        ? 0
        : typeof refetchOnMountOrArgChange === "number"
          ? refetchOnMountOrArgChange * 1000
          : undefined;

    const query = useQuery<TData, ApiError>(
      {
        queryKey: spec.queryKey,
        queryFn: spec.queryFn,
        meta: spec.meta,
        enabled: !skip,
        // RTK keeps returning the previous arg's `data` while a new arg loads.
        placeholderData: keepPreviousData,
        refetchInterval: pollingInterval && pollingInterval > 0 ? pollingInterval : false,
        staleTime,
      },
      getQueryClient(),
    );

    if (skip) {
      return {
        data: undefined,
        currentData: undefined,
        error: undefined,
        isLoading: false,
        isFetching: false,
        isSuccess: false,
        isError: false,
        isUninitialized: true,
        status: "uninitialized",
        refetch: query.refetch,
      };
    }

    return {
      data: query.data,
      currentData: query.isPlaceholderData ? undefined : query.data,
      error: query.error ?? undefined,
      isLoading: query.isLoading,
      isFetching: query.isFetching,
      isSuccess: query.isSuccess && !query.isPlaceholderData,
      isError: query.isError,
      isUninitialized: false,
      status: query.isError
        ? "rejected"
        : query.isSuccess
          ? "fulfilled"
          : "pending",
      refetch: query.refetch,
    };
  };
}

export function createMutationHook<TArg, TData>(spec: MutationSpec<TArg, TData>) {
  return function useMutationHook(): [
    MutationTrigger<TArg, TData>,
    MutationHookState<TData>,
  ] {
    const client = getQueryClient();
    const mutation = useMutation<TData, ApiError, TArg>(
      {
        mutationFn: spec.mutationFn,
        onSuccess: (data, arg) => {
          // Not awaited: like RTK, the mutation resolves before refetches finish.
          if (spec.invalidates) void invalidateTags(client, spec.invalidates(arg, data));
        },
      },
      client,
    );

    const { mutateAsync } = mutation;
    const trigger = useCallback<MutationTrigger<TArg, TData>>(
      (arg) => settle(mutateAsync(arg)),
      [mutateAsync],
    );

    return [
      trigger,
      {
        data: mutation.data,
        error: mutation.error ?? undefined,
        isLoading: mutation.isPending,
        isSuccess: mutation.isSuccess,
        isError: mutation.isError,
        isUninitialized: mutation.isIdle,
        reset: mutation.reset,
      },
    ];
  };
}

export interface LazyQueryState<TData> {
  data: TData | undefined;
  error: ApiError | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isSuccess: boolean;
  isError: boolean;
  isUninitialized: boolean;
}


export function createLazyQueryHook<TArg, TData>(
  build: (arg: TArg) => QuerySpec<TData>,
) {
  return function useLazyQueryHook(): [
    MutationTrigger<TArg, TData>,
    LazyQueryState<TData>,
  ] {
    const client = getQueryClient();
    const [current, setCurrent] = useState<{ arg: TArg } | null>(null);
    const spec = current ? build(current.arg) : null;

    // Observer only: fetching is driven by the trigger below.
    const query = useQuery<TData, ApiError>(
      {
        queryKey: spec?.queryKey ?? ["__lazy_idle__"],
        queryFn: spec ? spec.queryFn : skipToken,
        meta: spec?.meta,
        enabled: false,
      },
      client,
    );

    const trigger = useCallback<MutationTrigger<TArg, TData>>(
      (arg) => {
        setCurrent({ arg });
        const s = build(arg);
        return settle(
          client.fetchQuery<TData, ApiError>({
            queryKey: s.queryKey,
            queryFn: s.queryFn,
            meta: s.meta,
            staleTime: 0,
          }),
        );
      },
      [client],
    );

    return [
      trigger,
      {
        data: query.data,
        error: query.error ?? undefined,
        isLoading: query.isFetching && query.data === undefined,
        isFetching: query.isFetching,
        isSuccess: query.isSuccess,
        isError: query.isError,
        isUninitialized: current === null,
      },
    ];
  };
}
