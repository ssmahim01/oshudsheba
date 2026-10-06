import { QueryClient, isServer } from "@tanstack/react-query";

/** Mirrors the old RTK Query `keepUnusedDataFor: 60`. */
export const QUERY_GC_TIME_MS = 60_000;

function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Same model as the old RTK setup: data stays fresh until it is
        // invalidated (see `invalidateTags`) or garbage collected.
        staleTime: Infinity,
        gcTime: QUERY_GC_TIME_MS,
        retry: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
      },
      mutations: {
        retry: false,
      },
    },
  });
}

let browserClient: QueryClient | undefined;

/**
 * One shared client in the browser, a fresh one per call on the server so
 * data never leaks between requests. Hooks pass this client explicitly, so
 * they work whether or not a <QueryClientProvider> is mounted.
 */
export function getQueryClient(): QueryClient {
  if (isServer) return makeQueryClient();
  browserClient ??= makeQueryClient();
  return browserClient;
}
