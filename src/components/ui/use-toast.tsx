"use client";

import { create } from "zustand";

interface Toast {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (index: number) => void;
}

const useToastStore = create<ToastState>((set) => ({
  toasts: [],
  addToast: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, toast],
    })),
  removeToast: (index) =>
    set((state) => ({
      toasts: state.toasts.filter((_, i) => i !== index),
    })),
}));

export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    toast: (props: Toast) => {
      addToast({
        ...props,
        duration: props.duration ?? 5000,
      });
      // Auto remove toast after duration
      setTimeout(() => {
        const toasts = useToastStore.getState().toasts;
        const index = toasts.findIndex((t) => t === props);
        if (index !== -1) {
          useToastStore.getState().removeToast(index);
        }
      }, props.duration ?? 5000);
    },
  };
}

export function Toaster() {
  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  return (
    <div className="fixed bottom-0 right-0 z-50 w-full max-w-md p-4 space-y-4">
      {toasts.map((toast, index) => (
        <div
          key={index}
          className={`p-4 rounded-lg shadow-lg transform transition-all duration-300 ${
            toast.variant === "destructive"
              ? "bg-red-500 text-white"
              : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
          }`}
        >
          {toast.title && (
            <div className="font-semibold mb-1">{toast.title}</div>
          )}
          {toast.description && <div>{toast.description}</div>}
          <button
            onClick={() => removeToast(index)}
            className="absolute top-2 right-2 text-sm opacity-70 hover:opacity-100"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
