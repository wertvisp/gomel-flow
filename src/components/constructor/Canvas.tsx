'use client';

import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import type { Block } from '@/types/block';
import { CanvasBlock } from './CanvasBlock';
import { ThemeName } from '@/lib/themes';

interface CanvasProps {
  blocks: Block[];
  setBlocks: (blocks: any) => void;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onRemove: (id: string) => void;
  theme?: ThemeName;
}

export function Canvas({ 
  blocks, 
  selectedId, 
  onSelect, 
  onRemove,
  theme = 'modern'
}: CanvasProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'canvas',
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        mx-auto min-h-[80vh] w-full max-w-4xl space-y-4 rounded-3xl border-4 border-dashed 
        p-8 transition-all duration-300
        ${isOver 
          ? 'border-emerald-500 bg-emerald-50/30 scale-[1.02]' 
          : 'border-slate-200 bg-transparent'}
      `}
    >
      {/* Подсказка когда холст пустой */}
      {blocks.length === 0 && (
        <div className="flex h-[60vh] flex-col items-center justify-center text-slate-400 pointer-events-none">
          <div className="text-6xl mb-4 opacity-50">📋</div>
          <p className="text-2xl font-semibold text-slate-300 mb-2">Холст пуст</p>
          <p className="text-sm text-slate-400">Перетащите блоки из палитры слева</p>
          <div className="mt-6 flex items-center gap-2 text-xs text-slate-300">
            <span className="inline-block w-4 h-4 bg-slate-200 rounded" />
            <span>Блоки можно перемещать и редактировать</span>
          </div>
        </div>
      )}

      {/* Список блоков */}
      <SortableContext 
        items={blocks.map((b) => b.id)} 
        strategy={verticalListSortingStrategy}
      >
        {blocks.map((block, index) => (
          <div key={block.id} className="relative">
            {/* Индикатор номера блока */}
            <div className="absolute -left-16 top-4 text-xs font-bold text-slate-300">
              #{index + 1}
            </div>
            
            <CanvasBlock
              block={block}
              isSelected={selectedId === block.id}
              onSelect={() => onSelect(block.id)}
              onDelete={() => onRemove(block.id)}
              theme={theme}
            />
          </div>
        ))}
      </SortableContext>

      {/* Подсказка после добавления блоков */}
      {blocks.length > 0 && (
        <div className="pt-8 pb-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full text-xs text-slate-500">
            <span>💡</span>
            <span>Кликните на блок для редактирования или перетащите для изменения порядка</span>
          </div>
        </div>
      )}
    </div>
  );
}