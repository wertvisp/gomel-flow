export type ThemeName = 'modern' | 'classic' | 'minimal' | 'creative';

export interface Theme {
  id: ThemeName;
  name: string;
  description: string;
  preview: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    textLight: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
  };
}

export const themes: Record<ThemeName, Theme> = {
  modern: {
    id: 'modern',
    name: 'Современный',
    description: 'Яркие градиенты и плавные формы',
    preview: '🌈',
    colors: {
      primary: '#10b981',
      secondary: '#3b82f6',
      accent: '#8b5cf6',
      background: '#ffffff',
      text: '#0f172a',
      textLight: '#64748b',
    },
    fonts: {
      heading: 'Inter, sans-serif',
      body: 'Inter, sans-serif',
    },
    borderRadius: {
      sm: '12px',
      md: '20px',
      lg: '32px',
    },
    shadows: {
      sm: '0 2px 8px rgba(0,0,0,0.1)',
      md: '0 4px 16px rgba(0,0,0,0.1)',
      lg: '0 8px 32px rgba(0,0,0,0.15)',
    },
  },
  
  classic: {
    id: 'classic',
    name: 'Классический',
    description: 'Строгий профессиональный стиль',
    preview: '📋',
    colors: {
      primary: '#1e40af',
      secondary: '#475569',
      accent: '#dc2626',
      background: '#f8fafc',
      text: '#1e293b',
      textLight: '#64748b',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'Arial, sans-serif',
    },
    borderRadius: {
      sm: '4px',
      md: '8px',
      lg: '12px',
    },
    shadows: {
      sm: '0 1px 3px rgba(0,0,0,0.12)',
      md: '0 2px 8px rgba(0,0,0,0.15)',
      lg: '0 4px 16px rgba(0,0,0,0.2)',
    },
  },
  
  minimal: {
    id: 'minimal',
    name: 'Минималистичный',
    description: 'Чистота и простота',
    preview: '⚪',
    colors: {
      primary: '#000000',
      secondary: '#6b7280',
      accent: '#000000',
      background: '#ffffff',
      text: '#000000',
      textLight: '#6b7280',
    },
    fonts: {
      heading: 'Helvetica, Arial, sans-serif',
      body: 'Helvetica, Arial, sans-serif',
    },
    borderRadius: {
      sm: '0px',
      md: '0px',
      lg: '0px',
    },
    shadows: {
      sm: 'none',
      md: '0 1px 2px rgba(0,0,0,0.05)',
      lg: '0 2px 4px rgba(0,0,0,0.1)',
    },
  },
  
  creative: {
    id: 'creative',
    name: 'Креативный',
    description: 'Смелые цвета и формы',
    preview: '🎨',
    colors: {
      primary: '#f59e0b',
      secondary: '#ec4899',
      accent: '#8b5cf6',
      background: '#fef3c7',
      text: '#78350f',
      textLight: '#92400e',
    },
    fonts: {
      heading: 'Comic Sans MS, cursive',
      body: 'Arial, sans-serif',
    },
    borderRadius: {
      sm: '16px',
      md: '24px',
      lg: '48px',
    },
    shadows: {
      sm: '4px 4px 0px rgba(0,0,0,0.2)',
      md: '8px 8px 0px rgba(0,0,0,0.2)',
      lg: '12px 12px 0px rgba(0,0,0,0.2)',
    },
  },
};