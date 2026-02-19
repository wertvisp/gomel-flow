'use client';

import { createContext, useCallback, useContext, useState } from 'react';

type ToastMessage = { id: number; text: string; type?: 'success' | 'error' | 'info' };

const ToastContext = createContext<((text: string, type?: ToastMessage['type']) => void) | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const toast = useCallback((text: string, type: ToastMessage['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 2500);
  }, []);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`rounded-lg px-4 py-3 text-sm font-medium shadow-lg transition-all ${
              t.type === 'error'
                ? 'bg-red-100 text-red-800'
                : t.type === 'info'
                  ? 'bg-blue-100 text-blue-800'
                  : 'bg-emerald-600 text-white'
            }`}
          >
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  return ctx ?? ((text: string) => alert(text));
}
