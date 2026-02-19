import { Suspense } from 'react';
import { ViewPageClient } from './ViewPageClient';

export default function ViewPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="animate-pulse text-slate-500">Загрузка...</div>
      </div>
    }>
      <ViewPageClient />
    </Suspense>
  );
}
