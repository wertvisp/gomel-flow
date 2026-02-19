'use client';

import React, { useState, useEffect } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { 
  Layout, 
  Package, 
  Phone, 
  Square, 
  FileText, 
  CreditCard 
} from 'lucide-react';

interface BlockPaletteItemProps {
  type: string;
  label: string;
  icon: React.ReactNode;
}

function BlockPaletteItem({ type, label, icon }: BlockPaletteItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${type}`,
    data: {
      type,
      isPaletteItem: true,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`
        flex items-center gap-3 rounded-xl border-2 border-dashed border-slate-200 
        bg-white p-3 shadow-sm transition-all cursor-grab active:cursor-grabbing
        hover:border-emerald-400 hover:shadow-md
        ${isDragging ? 'opacity-50 ring-2 ring-emerald-500' : ''}
      `}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-slate-600">
        {icon}
      </div>
      <span className="font-medium text-slate-700">{label}</span>
    </div>
  );
}

export function BlockPalette() {
  const [mounted, setMounted] = useState(false);

  // Решаем проблему гидратации: рендерим контент только после монтирования в браузере
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Заглушка (Skeleton) того же размера, чтобы верстка не прыгала
    return <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-4" />;
  }

  return (
    <aside className="w-64 flex-shrink-0 border-r border-slate-200 bg-slate-50 p-4 overflow-y-auto">
      <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-slate-400">
        Компоненты
      </h2>
      <div className="space-y-3">
        <BlockPaletteItem type="header" label="Шапка" icon={<Layout size={20} />} />
        <BlockPaletteItem type="catalog" label="Каталог" icon={<Package size={20} />} />
        <BlockPaletteItem type="contacts" label="Контакты" icon={<Phone size={20} />} />
        <BlockPaletteItem type="button" label="Кнопка" icon={<Square size={20} />} />
        <BlockPaletteItem type="orderForm" label="Форма заказа" icon={<FileText size={20} />} />
        <BlockPaletteItem type="footer" label="Подвал" icon={<CreditCard size={20} />} />
      </div>
    </aside>
  );
}