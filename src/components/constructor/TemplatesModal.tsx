'use client';

import type { Template } from '@/lib/templates';

interface TemplatesModalProps {
  templates: Template[];
  onSelect: (template: Template) => void;
  onClose: () => void;
}

export function TemplatesModal({ templates, onSelect, onClose }: TemplatesModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-4 text-lg font-semibold text-slate-800">Готовые шаблоны</h2>
        <p className="mb-4 text-sm text-slate-500">
          Выберите шаблон — он загрузится как новый проект
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              type="button"
              onClick={() => onSelect(tpl)}
              className="flex flex-col items-center gap-2 rounded-xl border-2 border-slate-200 p-6 text-left transition-colors hover:border-emerald-500 hover:bg-emerald-50"
            >
              <span className="text-4xl">{tpl.icon}</span>
              <span className="font-semibold text-slate-800">{tpl.name}</span>
              <span className="text-center text-xs text-slate-500">{tpl.description}</span>
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-slate-300 py-2 font-medium text-slate-700 hover:bg-slate-100"
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
