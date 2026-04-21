import { create } from "zustand";
import { haptic } from "./haptics";

export type ToastVariant = "error" | "success" | "info";

export interface Toast {
  id: number;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastState {
  toasts: Toast[];
  show: (message: string, opts?: { variant?: ToastVariant; duration?: number }) => number;
  dismiss: (id: number) => void;
}

let nextId = 1;

export const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  show: (message, opts) => {
    const id = nextId++;
    const toast: Toast = {
      id,
      message,
      variant: opts?.variant ?? "info",
      duration: opts?.duration ?? 3500,
    };
    set((s) => ({ toasts: [...s.toasts, toast] }));
    return id;
  },
  dismiss: (id) =>
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

interface ToastOpts {
  duration?: number;
}

// Imperative API for non-React callers (react-query cache, axios, etc.)
export const toast = {
  error: (message: string, opts?: ToastOpts) => {
    haptic.error();
    return useToastStore.getState().show(message, { ...opts, variant: "error" });
  },
  success: (message: string, opts?: ToastOpts) => {
    haptic.success();
    return useToastStore.getState().show(message, { ...opts, variant: "success" });
  },
  info: (message: string, opts?: ToastOpts) =>
    useToastStore.getState().show(message, { ...opts, variant: "info" }),
  dismiss: (id: number) => useToastStore.getState().dismiss(id),
};
