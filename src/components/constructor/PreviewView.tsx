'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPreviewForView } from '@/lib/configStorage';
import { BlockRenderer } from '@/components/constructor/BlockRenderer';
import type { Block } from '@/types/block';
import { ArrowLeft, ExternalLink } from 'lucide-react';

export default function PreviewPage() {
  const [blocks, setBlocks] = useState<Block[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const loadedBlocks = getPreviewForView();
      setBlocks(loadedBlocks);
    } catch (error) {
      console.error('Ошибка загрузки предпросмотра:', error);
      setBlocks([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Загрузка предпросмотра...</p>
        </div>
      </div>
    );
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-8">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">📭</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Нет данных для предпросмотра
          </h1>
          <p className="text-slate-600 mb-8">
            Добавьте блоки в конструкторе, чтобы увидеть как будет выглядеть ваш сайт
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-200"
          >
            <ArrowLeft size={20} />
            Вернуться в конструктор
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Верхняя панель */}
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 py-3 shadow-sm">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={18} />
          Вернуться в конструктор
        </Link>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
            Режим предпросмотра
          </span>
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-1">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-xs font-bold text-emerald-700">
              {blocks.length} {blocks.length === 1 ? 'блок' : blocks.length < 5 ? 'блока' : 'блоков'}
            </span>
          </div>
        </div>
      </header>

      {/* Контент */}
      <main className="py-8">
        <div className="mx-auto max-w-4xl">
          {/* Контейнер сайта */}
          <div className="bg-white shadow-2xl rounded-3xl overflow-hidden">
            <div className="divide-y divide-slate-100">
              {blocks.map((block, index) => (
                <div 
                  key={block.id} 
                  className="px-8 py-10 hover:bg-slate-50/50 transition-colors"
                >
                  <BlockRenderer block={block} variant="published" />
                </div>
              ))}
            </div>
          </div>

          {/* Информация о сайте */}
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-md">
              <span className="text-sm text-slate-500">Создано в</span>
              <span className="text-sm font-bold text-emerald-600">Gomel-Flow</span>
              <ExternalLink size={14} className="text-slate-400" />
            </div>
          </div>
        </div>
      </main>

      {/* Подсказка */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-xl text-sm font-medium">
        💡 Это предпросмотр. Вернитесь в конструктор для редактирования
      </div>
    </div>
  );
}
