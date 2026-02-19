'use client';
import React, { useState } from 'react';
import type { Block } from '@/types/block';
import { themes, ThemeName } from '@/lib/themes';

interface BlockRendererProps {
  block: Block;
  variant?: 'editor' | 'published';
  theme?: ThemeName;
  onUpdate?: (id: string, updates: any) => void;
}

export function BlockRenderer({ 
  block, 
  variant = 'editor', 
  theme = 'modern',
  onUpdate 
}: BlockRendererProps) {
  const d: any = block;
  const isPublished = variant === 'published';
  const currentTheme = themes[theme];

  // Состояние формы
  const [formData, setFormData] = useState({ name: '', phone: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone) {
      alert('⚠️ Заполните имя и телефон');
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('📤 Отправка формы:', formData);
      
      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          phone: formData.phone,
          message: formData.message,
          title: d.title || 'Заявка с сайта'
        })
      });

      const result = await response.json();
      console.log('📥 Результат:', result);

      if (response.ok) {
        setSubmitted(true);
        setFormData({ name: '', phone: '', message: '' });
        setTimeout(() => setSubmitted(false), 5000);
      } else {
        throw new Error(result.error || 'Ошибка отправки');
      }
    } catch (error) {
      console.error('❌ Ошибка:', error);
      alert('❌ Ошибка отправки: ' + (error instanceof Error ? error.message : 'Неизвестная ошибка'));
    } finally {
      setIsSubmitting(false);
    }
  };

  switch (block.type) {
    case 'header':
      return (
        <div 
          className="p-10 text-center transition-all"
          style={{
            background: currentTheme.colors.background,
            borderRadius: currentTheme.borderRadius.lg,
            boxShadow: currentTheme.shadows.md,
          }}
        >
          <h1 
            className="text-5xl font-black mb-4 leading-tight"
            style={{
              color: currentTheme.colors.text,
              fontFamily: currentTheme.fonts.heading,
            }}
          >
            {d.title || 'Заголовок'}
          </h1>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{
              color: currentTheme.colors.textLight,
              fontFamily: currentTheme.fonts.body,
            }}
          >
            {d.subtitle || 'Подзаголовок'}
          </p>
        </div>
      );

    case 'catalog':
      return (
        <div 
          className="p-8 transition-all"
          style={{
            background: currentTheme.colors.background,
            borderRadius: currentTheme.borderRadius.lg,
            boxShadow: currentTheme.shadows.md,
          }}
        >
          <h2 
            className="text-3xl font-bold mb-6 text-center"
            style={{
              color: currentTheme.colors.text,
              fontFamily: currentTheme.fonts.heading,
            }}
          >
            {d.title || 'Каталог'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            {d.items?.map((item: any) => (
              <div 
                key={item.id} 
                className="flex justify-between items-center p-5 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${currentTheme.colors.primary}15`,
                  borderRadius: currentTheme.borderRadius.md,
                  fontFamily: currentTheme.fonts.body,
                  boxShadow: currentTheme.shadows.sm,
                }}
              >
                <span 
                  className="font-semibold"
                  style={{ color: currentTheme.colors.text }}
                >
                  {item.name}
                </span>
                <span 
                  className="font-bold text-xl"
                  style={{ color: currentTheme.colors.primary }}
                >
                  {item.price} BYN
                </span>
              </div>
            ))}
          </div>
        </div>
      );

    case 'button':
      return (
        <div 
          className="p-8 text-center"
          style={{
            background: currentTheme.colors.background,
            borderRadius: currentTheme.borderRadius.lg,
          }}
        >
          <a 
            href={d.url || '#'} 
            className="inline-block px-10 py-4 font-bold text-white transition-all hover:scale-105 active:scale-95"
            style={{
              backgroundColor: currentTheme.colors.primary,
              borderRadius: currentTheme.borderRadius.md,
              boxShadow: currentTheme.shadows.md,
              fontFamily: currentTheme.fonts.body,
            }}
          >
            {d.title || 'Кнопка'}
          </a>
        </div>
      );

    case 'contacts':
      return (
        <div 
          className="p-8"
          style={{
            background: currentTheme.colors.background,
            borderRadius: currentTheme.borderRadius.lg,
            boxShadow: currentTheme.shadows.md,
          }}
        >
          <h2 
            className="text-3xl font-bold mb-6 text-center"
            style={{
              color: currentTheme.colors.text,
              fontFamily: currentTheme.fonts.heading,
            }}
          >
            {d.title || 'Контакты'}
          </h2>
          <div className="space-y-3 max-w-lg mx-auto">
            {d.phone && (
              <div 
                className="flex items-center gap-4 p-5 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${currentTheme.colors.secondary}15`,
                  borderRadius: currentTheme.borderRadius.md,
                  fontFamily: currentTheme.fonts.body,
                  boxShadow: currentTheme.shadows.sm,
                }}
              >
                <span className="text-2xl">📞</span>
                <div>
                  <p 
                    className="text-xs uppercase font-bold mb-1"
                    style={{ color: currentTheme.colors.secondary }}
                  >
                    Телефон
                  </p>
                  <a 
                    href={`tel:${d.phone}`}
                    className="font-semibold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {d.phone}
                  </a>
                </div>
              </div>
            )}
            
            {d.email && (
              <div 
                className="flex items-center gap-4 p-5 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${currentTheme.colors.accent}15`,
                  borderRadius: currentTheme.borderRadius.md,
                  fontFamily: currentTheme.fonts.body,
                  boxShadow: currentTheme.shadows.sm,
                }}
              >
                <span className="text-2xl">📧</span>
                <div>
                  <p 
                    className="text-xs uppercase font-bold mb-1"
                    style={{ color: currentTheme.colors.accent }}
                  >
                    Email
                  </p>
                  <a 
                    href={`mailto:${d.email}`}
                    className="font-semibold break-all"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {d.email}
                  </a>
                </div>
              </div>
            )}
            
            {d.address && (
              <div 
                className="flex items-center gap-4 p-5 transition-all hover:scale-105"
                style={{
                  backgroundColor: `${currentTheme.colors.primary}15`,
                  borderRadius: currentTheme.borderRadius.md,
                  fontFamily: currentTheme.fonts.body,
                  boxShadow: currentTheme.shadows.sm,
                }}
              >
                <span className="text-2xl">📍</span>
                <div>
                  <p 
                    className="text-xs uppercase font-bold mb-1"
                    style={{ color: currentTheme.colors.primary }}
                  >
                    Адрес
                  </p>
                  <p 
                    className="font-semibold"
                    style={{ color: currentTheme.colors.text }}
                  >
                    {d.address}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      );

    case 'orderForm':
      return (
        <div 
          className="p-8 transition-all"
          style={{
            background: `linear-gradient(135deg, ${currentTheme.colors.primary}, ${currentTheme.colors.secondary})`,
            borderRadius: currentTheme.borderRadius.lg,
            boxShadow: currentTheme.shadows.lg,
          }}
        >
          <div 
            className="max-w-md mx-auto p-8"
            style={{
              background: currentTheme.colors.background,
              borderRadius: currentTheme.borderRadius.md,
              boxShadow: currentTheme.shadows.md,
            }}
          >
            <h2 
              className="text-3xl font-bold mb-2 text-center"
              style={{
                color: currentTheme.colors.text,
                fontFamily: currentTheme.fonts.heading,
              }}
            >
              {d.title || 'Оставьте заявку'}
            </h2>
            <p 
              className="text-center mb-6 text-sm"
              style={{
                color: currentTheme.colors.textLight,
                fontFamily: currentTheme.fonts.body,
              }}
            >
              Заполните форму и мы свяжемся с вами
            </p>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">✅</div>
                <p 
                  className="text-2xl font-bold mb-2"
                  style={{ 
                    color: currentTheme.colors.primary,
                    fontFamily: currentTheme.fonts.heading,
                  }}
                >
                  Заявка отправлена!
                </p>
                <p style={{ color: currentTheme.colors.textLight }}>
                  Мы свяжемся с вами в ближайшее время
                </p>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  placeholder="Ваше имя *"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border-2 outline-none transition-all"
                  style={{
                    borderRadius: currentTheme.borderRadius.sm,
                    borderColor: '#e2e8f0',
                    fontFamily: currentTheme.fonts.body,
                  }}
                  required
                  disabled={!isPublished}
                />
                
                <input
                  type="tel"
                  placeholder="Телефон *"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border-2 outline-none transition-all"
                  style={{
                    borderRadius: currentTheme.borderRadius.sm,
                    borderColor: '#e2e8f0',
                    fontFamily: currentTheme.fonts.body,
                  }}
                  required
                  disabled={!isPublished}
                />
                
                <textarea
                  placeholder="Ваше сообщение (необязательно)"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 border-2 outline-none resize-none transition-all"
                  style={{
                    borderRadius: currentTheme.borderRadius.sm,
                    borderColor: '#e2e8f0',
                    fontFamily: currentTheme.fonts.body,
                  }}
                  disabled={!isPublished}
                />
                
                <button
                  type="submit"
                  disabled={isSubmitting || !isPublished}
                  className="w-full text-white font-bold py-4 transition-all disabled:opacity-50"
                  style={{
                    backgroundColor: currentTheme.colors.primary,
                    borderRadius: currentTheme.borderRadius.sm,
                    boxShadow: currentTheme.shadows.md,
                    fontFamily: currentTheme.fonts.body,
                  }}
                >
                  {isSubmitting ? 'Отправка...' : (d.submitText || 'Отправить заявку')}
                </button>

                {!isPublished && (
                  <p 
                    className="text-xs text-center mt-2"
                    style={{ color: currentTheme.colors.textLight }}
                  >
                    ⚠️ Форма работает только на опубликованном сайте
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      );

    case 'footer':
      return (
        <div 
          className="p-8 text-center transition-all"
          style={{
            background: currentTheme.colors.text,
            borderRadius: currentTheme.borderRadius.lg,
            boxShadow: currentTheme.shadows.md,
          }}
        >
          <p 
            className="text-sm"
            style={{
              color: currentTheme.colors.textLight,
              fontFamily: currentTheme.fonts.body,
            }}
          >
            {d.text || '© 2026 Gomel-Flow. Все права защищены.'}
          </p>
        </div>
      );

    default:
      return (
        <div className="p-4 border-2 border-dashed border-gray-300 rounded-xl text-center text-gray-400">
          Неизвестный тип блока: {(block as any).type}
        </div>
      );
  }
}