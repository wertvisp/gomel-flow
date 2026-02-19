'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/lib/toast';

export function AuthModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const toast = useToast();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password: pass })
      : await supabase.auth.signInWithPassword({ email, password: pass });
    
    if (error) toast(error.message, 'error');
    else { toast('Успешно!', 'success'); onClose(); }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-80 rounded-3xl bg-white p-6 shadow-2xl">
        <h2 className="mb-4 text-xl font-bold">{isSignUp ? 'Создать аккаунт' : 'Войти'}</h2>
        <form onSubmit={handleAuth} className="space-y-3">
          <input type="email" placeholder="Email" className="w-full rounded-xl border p-3" onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Пароль" className="w-full rounded-xl border p-3" onChange={e => setPass(e.target.value)} />
          <button className="w-full rounded-xl bg-emerald-600 py-3 font-bold text-white transition-transform active:scale-95">
            {isSignUp ? 'Регистрация' : 'Вход'}
          </button>
        </form>
        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 w-full text-xs text-slate-400">
          {isSignUp ? 'Уже есть аккаунт?' : 'Нет аккаунта?'}
        </button>
      </div>
    </div>
  );
}