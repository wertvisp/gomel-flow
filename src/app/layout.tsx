import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ToastProvider } from '@/lib/toast';
import { SuppressErrors } from '@/components/SuppressErrors';

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Gomel-Flow Builder | Конструктор сайтов',
  description: 'Создавайте профессиональные лендинги для вашего бизнеса без навыков программирования',
  keywords: ['конструктор сайтов', 'лендинг', 'малый бизнес', 'Гомель', 'Беларусь'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className="scroll-smooth">
      <head>
        <meta charSet="utf-8" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body 
        className={`${inter.className} antialiased text-slate-900 bg-white selection:bg-emerald-100 selection:text-emerald-900`}
        suppressHydrationWarning
      >
        <SuppressErrors />
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}