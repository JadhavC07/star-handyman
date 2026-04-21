import { AxiosError } from "axios";

/** Best-effort human-readable message extraction from an axios / generic error. */
export const extractErrorMessage = (err: unknown): string => {
  if (err instanceof AxiosError) {
    const data = err.response?.data as
      | { message?: string; error?: string }
      | undefined;
    if (data?.message) return data.message;
    if (data?.error) return data.error;
    if (err.code === "ECONNABORTED") return "Request timed out. Please try again.";
    if (err.message === "Network Error") return "No internet connection.";
    return err.message;
  }
  if (err instanceof Error) return err.message;
  return "Something went wrong.";
};
