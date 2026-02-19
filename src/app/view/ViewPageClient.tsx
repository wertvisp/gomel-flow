'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { decodeConfigFromUrl } from '@/lib/configStorage';
import { BlockRenderer } from '@/components/constructor/BlockRenderer';
import type { Block } from '@/types/block';
import type { ThemeName } from '@/lib/themes';
import { ArrowLeft, Globe } from 'lucide-react';

export function ViewPageClient() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [theme, setTheme] = useState<ThemeName>('modern');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    try {
      const dataParam = searchParams.get('data');
      
      if (dataParam) {
        const decoded = decodeConfigFromUrl(dataParam);
        if (decoded && decoded.blocks.length > 0) {
          setBlocks(decoded.blocks);
          setTheme(decoded.theme as ThemeName);
        } else {
          setError('Некорректные данные в ссылке');
          setBlocks([]);
        }
      } else {
        setBlocks([]);
      }
    } catch (err) {
      console.error('Ошибка загрузки данных:', err);
      setError('Ошибка загрузки страницы');
      setBlocks([]);
    } finally {
      setIsLoading(false);
    }
  }, [searchParams]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4" />
          <p className="text-slate-500 font-medium">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">⚠️</div>
          <h1 className="text-3xl font-bold text-red-800 mb-4">
            Ошибка загрузки
          </h1>
          <p className="text-red-600 mb-8">{error}</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-8 py-4 font-bold text-white hover:bg-red-600 transition-all"
          >
            <ArrowLeft size={20} />
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  if (!blocks || blocks.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-8">
        <div className="text-center max-w-md">
          <div className="text-8xl mb-6">📭</div>
          <h1 className="text-3xl font-bold text-slate-800 mb-4">
            Страница пуста
          </h1>
          <p className="text-slate-600 mb-8">
            Эта страница не содержит блоков. Создайте свой сайт!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-8 py-4 font-bold text-white hover:bg-emerald-600 transition-all"
          >
            <Globe size={20} />
            Создать сайт
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/95 backdrop-blur-sm px-6 py-3 shadow-sm">
        <Link 
          href="/" 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-emerald-600 transition-colors"
        >
          <ArrowLeft size={16} />
          Gomel-Flow
        </Link>
        
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Тема:</span>
          <span className="font-bold text-slate-600">{theme}</span>
        </div>
      </header>

      <main>
        <div className="mx-auto max-w-4xl">
          <div className="bg-white shadow-2xl">
            <div className="divide-y divide-slate-100">
              {blocks.map((block) => (
                <div key={block.id} className="px-8 py-10">
                  <BlockRenderer 
                    block={block} 
                    variant="published"
                    theme={theme}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="mt-16 pb-8 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-600 transition-colors"
        >
          <Globe size={16} />
          <span>Создайте свой сайт бесплатно в <strong>Gomel-Flow</strong></span>
        </Link>
      </footer>
    </div>
  );
}