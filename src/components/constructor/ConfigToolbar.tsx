'use client';
import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  Save, LogOut, ShieldCheck, Play, RotateCcw, RotateCw, 
  Globe, User, Link2, FileDown
} from 'lucide-react';
import { setPreviewForView, encodeConfigForUrl } from '@/lib/configStorage';
import { exportToHtml } from '@/lib/exportHtml';

interface ConfigToolbarProps {
  project: any;
  onSave: () => void;
  onOpenAuth: () => void;
  undoActions: {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
  };
}

export function ConfigToolbar({ project, onSave, onOpenAuth, undoActions }: ConfigToolbarProps) {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { undo, redo, canUndo, canRedo } = undoActions;
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const getUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchRole(session.user.id);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Ошибка получения пользователя:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        await fetchRole(session.user.id);
      } else {
        setRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchRole = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', uid)
        .single();
      
      if (error) {
        setRole('user');
        return;
      }
      
      setRole(data?.role || 'user');
    } catch (error: any) {
      if (error.name !== 'AbortError') {
        console.warn('Ошибка получения роли:', error);
      }
      setRole('user');
    }
  };

  const handlePreview = () => {
    if (!project?.blocks || project.blocks.length === 0) {
      alert('⚠️ Добавьте блоки для предпросмотра');
      return;
    }
    setPreviewForView(project.blocks, project.theme || 'modern');
    window.open('/preview', '_blank');
  };

  const handleExportHtml = () => {
    if (!project?.blocks || project.blocks.length === 0) {
      alert('⚠️ Добавьте блоки для экспорта');
      return;
    }

    try {
      const html = exportToHtml(project.blocks, project.theme || 'modern');
      const blob = new Blob([html], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.name || 'site'}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка экспорта:', error);
      alert('❌ Ошибка при экспорте HTML');
    }
  };

  const handleCopyLink = async () => {
    if (!project?.blocks || project.blocks.length === 0) {
      alert('⚠️ Добавьте блоки для создания ссылки');
      return;
    }

    try {
      const encoded = encodeConfigForUrl(project.blocks, project.theme || 'modern');
      const url = `${window.location.origin}/view?data=${encoded}`;
      await navigator.clipboard.writeText(url);
      alert('✅ Ссылка скопирована в буфер обмена');
    } catch (error) {
      console.error('Ошибка копирования:', error);
      alert('❌ Ошибка при копировании ссылки');
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      window.location.reload();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z' && !e.shiftKey) {
          e.preventDefault();
          undo();
        }
        if (e.key === 'y' || (e.key === 'z' && e.shiftKey)) {
          e.preventDefault();
          redo();
        }
        if (e.key === 's') {
          e.preventDefault();
          onSave();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, onSave]);

  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6 shadow-sm z-50">
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Globe size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800 leading-tight">
              {project?.name || 'Мой лендинг'}
            </h2>
            <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Gomel-Flow Editor
            </p>
          </div>
        </div>

        <div className="flex items-center bg-slate-100 rounded-xl p-1">
          <button 
            onClick={undo} 
            disabled={!canUndo}
            className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Назад (Ctrl+Z)"
          >
            <RotateCcw size={16} className="text-slate-600" />
          </button>
          <button 
            onClick={redo} 
            disabled={!canRedo}
            className="p-2 rounded-lg hover:bg-white hover:shadow-sm disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            title="Вперед (Ctrl+Y)"
          >
            <RotateCw size={16} className="text-slate-600" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {role === 'admin' && (
          <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-[10px] font-black uppercase text-amber-600 border border-amber-100">
            <ShieldCheck size={12} /> Admin Mode
          </div>
        )}

        <button 
          onClick={handlePreview} 
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl transition-all"
          title="Предпросмотр"
        >
          <Play size={16} /> Предпросмотр
        </button>

        <button 
          onClick={handleExportHtml}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
          title="Скачать HTML"
        >
          <FileDown size={16} /> Скачать HTML
        </button>

        <button 
          onClick={handleCopyLink}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
          title="Скопировать ссылку"
        >
          <Link2 size={16} /> Копировать ссылку
        </button>

        <button 
          onClick={onSave} 
          className="flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2 text-sm font-bold text-white hover:bg-emerald-600 shadow-lg shadow-emerald-100 transition-all active:scale-95"
          title="Сохранить (Ctrl+S)"
        >
          <Save size={16} /> Сохранить
        </button>

        <div className="h-6 w-px bg-slate-200 mx-2" />

        {loading ? (
          <div className="w-8 h-8 rounded-full bg-slate-100 animate-pulse" />
        ) : user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-1.5">
              <User size={16} className="text-emerald-600" />
              <span className="text-xs font-medium text-emerald-700">
                {user.email?.split('@')[0] || 'Пользователь'}
              </span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
              title="Выйти"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={onOpenAuth}
            className="rounded-xl border-2 border-emerald-500 px-4 py-2 text-sm font-bold text-emerald-600 hover:bg-emerald-50 transition-all"
          >
            Войти
          </button>
        )}
      </div>
    </header>
  );
}