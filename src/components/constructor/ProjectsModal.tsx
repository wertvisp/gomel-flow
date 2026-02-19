'use client';

import { useState } from 'react';
import { X, FolderOpen, Trash2, Plus, Clock } from 'lucide-react';

interface ProjectsModalProps {
  projects: any[];
  currentId: string | null;
  onSelect: (project: any) => void;
  onNew: () => void;
  onDelete: (id: string) => Promise<void>;
  onClose: () => void;
}

export function ProjectsModal({
  projects,
  currentId,
  onSelect,
  onNew,
  onDelete,
  onClose,
}: ProjectsModalProps) {
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Удалить проект "${name}"? Это действие нельзя отменить.`)) {
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Ошибка удаления:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <FolderOpen size={24} className="text-emerald-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Мои проекты</h2>
              <p className="text-sm text-slate-500">
                {projects.length} {projects.length === 1 ? 'проект' : projects.length < 5 ? 'проекта' : 'проектов'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Закрыть"
          >
            <X size={24} className="text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="text-6xl mb-4">📂</div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">
                Нет сохранённых проектов
              </h3>
              <p className="text-slate-500 mb-6">
                Создайте свой первый проект
              </p>
              <button
                onClick={onNew}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-lg font-bold hover:bg-emerald-600 transition-all"
              >
                <Plus size={20} />
                Создать проект
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`
                    group relative p-5 rounded-xl border-2 transition-all cursor-pointer
                    ${currentId === project.id
                      ? 'border-emerald-500 bg-emerald-50 shadow-lg'
                      : 'border-slate-200 hover:border-emerald-300 hover:shadow-md'
                    }
                  `}
                  onClick={() => onSelect(project)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-800 truncate text-lg">
                        {project.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Clock size={14} className="text-slate-400 flex-shrink-0" />
                        <p className="text-xs text-slate-500">
                          {formatDate(project.updated_at)}
                        </p>
                      </div>
                    </div>

                    {currentId === project.id && (
                      <div className="flex-shrink-0 ml-2 px-2 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full">
                        Текущий
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-slate-600">
                      <span className="font-medium">{project.blocks?.length || 0}</span> блоков
                      {project.theme && (
                        <span className="ml-3 text-slate-400">• {project.theme}</span>
                      )}
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(project.id, project.name);
                      }}
                      disabled={deletingId === project.id}
                      className={`p-2 rounded-lg transition-all ${
                        deletingId === project.id
                          ? 'bg-slate-200 cursor-not-allowed'
                          : 'hover:bg-red-50 text-slate-400 hover:text-red-500'
                      }`}
                      title="Удалить проект"
                    >
                      {deletingId === project.id ? (
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-slate-400 border-t-transparent" />
                      ) : (
                        <Trash2 size={18} />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
          <button
            onClick={onNew}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-100"
          >
            <Plus size={20} />
            Новый проект
          </button>

          <button
            onClick={onClose}
            className="px-6 py-3 text-slate-600 hover:bg-slate-200 rounded-xl font-medium transition-all"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
}