'use client';

import { useState } from 'react';
import { themes, ThemeName } from '@/lib/themes';

interface ThemeSelectorProps {
  currentTheme: ThemeName;
  onThemeChange: (theme: ThemeName) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-all"
      >
        🎨 Тема: <span className="font-bold text-slate-800">{themes[currentTheme].name}</span>
      </button>

      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setIsOpen(false)}
          />
          
          <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 z-50">
            <h3 className="text-sm font-bold text-slate-800 mb-3">Выберите тему оформления</h3>
            
            <div className="space-y-2">
              {Object.values(themes).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => {
                    onThemeChange(theme.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    currentTheme === theme.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <span className="text-3xl">{theme.preview}</span>
                    <div className="flex-1">
                      <div className="font-bold text-slate-800">{theme.name}</div>
                      <div className="text-xs text-slate-500 mt-1">{theme.description}</div>
                      
                      {/* Превью цветов */}
                      <div className="flex gap-1 mt-2">
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: theme.colors.primary }}
                          title="Primary"
                        />
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: theme.colors.secondary }}
                          title="Secondary"
                        />
                        <div 
                          className="w-6 h-6 rounded"
                          style={{ backgroundColor: theme.colors.accent }}
                          title="Accent"
                        />
                      </div>
                    </div>
                    
                    {currentTheme === theme.id && (
                      <div className="text-green-500 text-xl">✓</div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}