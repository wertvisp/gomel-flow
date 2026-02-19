'use client';

import { useEffect } from 'react';

export function SuppressErrors() {
  useEffect(() => {
    const originalConsoleError = console.error;
    console.error = (...args: any[]) => {
      const message = args[0]?.toString() || '';
      if (
        message.includes('signal is aborted') ||
        message.includes('AbortError') ||
        message.includes('without reason')
      ) {
        return;
      }
      originalConsoleError(...args);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const message = event.reason?.message || '';
      const name = event.reason?.name || '';
      if (
        message.includes('signal is aborted') ||
        message.includes('without reason') ||
        message.includes('AbortError') ||
        name === 'AbortError'
      ) {
        event.preventDefault();
      }
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return null;
}
