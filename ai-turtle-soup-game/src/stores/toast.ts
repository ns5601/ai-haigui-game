import { create } from 'zustand';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
  createdAt: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id' | 'createdAt'>) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newToast: Toast = {
      ...toast,
      id,
      createdAt: Date.now(),
      duration: toast.duration || 5000,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }));

    // 自动移除
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id)
        }));
      }, newToast.duration);
    }
  },
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }));
  },
  clearToasts: () => {
    set({ toasts: [] });
  },
}));

// 快捷方法
export const toast = {
  success: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: 'success',
      title,
      description,
      duration,
    });
  },
  error: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: 'error',
      title,
      description,
      duration,
    });
  },
  warning: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: 'warning',
      title,
      description,
      duration,
    });
  },
  info: (title: string, description?: string, duration?: number) => {
    useToastStore.getState().addToast({
      type: 'info',
      title,
      description,
      duration,
    });
  },
};