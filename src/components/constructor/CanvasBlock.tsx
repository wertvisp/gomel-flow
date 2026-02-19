'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { Block } from '@/types/block';
import { BlockRenderer } from './BlockRenderer';
import { ThemeName } from '@/lib/themes';

interface CanvasBlockProps {
  block: Block;
  isSelected: boolean;
  onSelect: () => void;
  onDelete: () => void;
  theme?: ThemeName;
}

export function CanvasBlock({ 
  block, 
  isSelected, 
  onSelect, 
  onDelete, 
  theme = 'modern' 
}: CanvasBlockProps) {
  const { 
    attributes, 
    listeners, 
    setNodeRef, 
    transform, 
    transition, 
    isDragging 
  } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Получаем название типа блока для отображения
  const blockTypeNames: Record<string, string> = {
    header: 'Шапка',
    catalog: 'Каталог',
    button: 'Кнопка',
    contacts: 'Контакты',
    orderForm: 'Форма заказа',
    footer: 'Подвал',
  };

  const blockTypeName = blockTypeNames[block.type] || block.type;

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation(); 
        onSelect();
      }}
      className={`
        group relative cursor-pointer rounded-2xl border-2 transition-all duration-200
        ${isSelected 
          ? 'border-emerald-500 bg-white shadow-xl ring-4 ring-emerald-500/10' 
          : 'border-transparent bg-transparent hover:border-slate-300 hover:shadow-md'}
        ${isDragging ? 'z-50 opacity-50 shadow-2xl' : ''}
      `}
    >
      {/* Drag Handle (ручка для перетаскивания) */}
      <div 
        {...attributes} 
        {...listeners}
        className="absolute -left-12 top-1/2 -translate-y-1/2 p-3 opacity-0 transition-all group-hover:opacity-100 cursor-grab active:cursor-grabbing hover:scale-110"
        title="Перетащите для изменения порядка"
      >
        <div className="grid grid-cols-2 gap-1">
          {[...Array(6)].map((_, i) => (
            <div 
              key={i} 
              className="h-1.5 w-1.5 rounded-full bg-slate-400 group-hover:bg-emerald-500 transition-colors" 
            />
          ))}
        </div>
      </div>

      {/* Бейдж с типом блока */}
      {isSelected && (
        <div className="absolute -top-3 left-4 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full shadow-lg z-10">
          {blockTypeName}
        </div>
      )}

      {/* Рендер содержимого блока */}
      <BlockRenderer block={block} theme={theme} variant="editor" />

      {/* Кнопка удаления */}
      {isSelected && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="absolute -right-3 -top-3 flex h-9 w-9 items-center justify-center rounded-full bg-red-500 text-white shadow-lg transition-all hover:scale-110 hover:bg-red-600 active:scale-90 z-10 group/delete"
          title="Удалить блок"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="18" 
            height="18" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            className="group-hover/delete:rotate-90 transition-transform duration-200"
          >
            <path d="M18 6 6 18"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      )}

      {/* Индикатор при перетаскивании */}
      {isDragging && (
        <div className="absolute inset-0 flex items-center justify-center bg-emerald-500/20 rounded-2xl backdrop-blur-sm">
          <div className="bg-white px-6 py-3 rounded-full shadow-lg">
            <p className="text-sm font-bold text-emerald-600">Переместите блок...</p>
          </div>
        </div>
      )}

      {/* Подсветка при наведении (если блок не выбран) */}
      {!isSelected && (
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 rounded-2xl border-2 border-slate-300" />
          <div className="absolute top-2 right-2 bg-slate-700 text-white text-xs px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
            Кликните для редактирования
          </div>
        </div>
      )}
    </div>
  );
}