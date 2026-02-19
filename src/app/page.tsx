import { Constructor } from '@/components/constructor';

export default function Home() {
  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <header className="flex h-14 flex-shrink-0 items-center border-b border-slate-200 bg-white px-4 shadow-sm">
        <h1 className="text-xl font-bold text-emerald-700">Gomel-Flow</h1>
        <span className="ml-2 text-sm text-slate-500">Конструктор для малого бизнеса</span>
      </header>
      <div className="min-h-0 flex-1">
        <Constructor />
      </div>
    </div>
  );
}
