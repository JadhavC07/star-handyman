import "@tanstack/react-query";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      /** Suppress the global toast for this mutation's errors. */
      silent?: boolean;
    };
  }
}
