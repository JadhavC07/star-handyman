import { extractErrorMessage } from "@/src/lib/errorMessage";
import { toast } from "@/src/lib/toast";
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

const isAuthError = (err: unknown): boolean =>
  err instanceof AxiosError && err.response?.status === 401;

// Retry up to 2x on network / 5xx / 408 / 429. Never retry other 4xx — they're
// deterministic client errors and retrying wastes battery + masks bugs.
const shouldRetry = (failureCount: number, err: unknown): boolean => {
  if (failureCount >= 2) return false;
  if (err instanceof AxiosError) {
    const status = err.response?.status;
    if (
      status &&
      status >= 400 &&
      status < 500 &&
      status !== 408 &&
      status !== 429
    ) {
      return false;
    }
  }
  return true;
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 min floor — hooks override upward
      gcTime: 10 * 60 * 1000,
      retry: shouldRetry,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 8000),
      refetchOnWindowFocus: false, // AppState on RN — noisy on mobile
      refetchOnReconnect: "always",
    },
    mutations: {
      retry: false,
    },
  },
  queryCache: new QueryCache({
    onError: (err, query) => {
      if (isAuthError(err)) return; // axios interceptor owns 401
      // Sentry.captureException(err, {
      //   tags: { source: "react-query", kind: "query" },
      //   extra: { queryKey: query.queryKey },
      // });
    },
  }),
  mutationCache: new MutationCache({
    onError: (err, _vars, _ctx, mutation) => {
      if (isAuthError(err)) return;
      // Sentry.captureException(err, {
      //   tags: { source: "react-query", kind: "mutation" },
      //   extra: { mutationKey: mutation.options.mutationKey },
      // });
      // Mutations can opt out with meta: { silent: true } (e.g. logout).
      if (mutation.meta?.silent) return;
      toast.error(extractErrorMessage(err));
    },
  }),
});
