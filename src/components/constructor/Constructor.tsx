'use client';
import { useState, useEffect } from 'react';
import { DndContext, closestCenter, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { ConfigToolbar } from './ConfigToolbar';
import { BlockPalette } from './BlockPalette';
import { Canvas } from './Canvas';
import { PropertiesPanel } from './PropertiesPanel';
import { AuthModal } from '../auth/AuthModal';
import { ProjectsModal } from './ProjectsModal';
import { TemplatesModal } from './TemplatesModal';
import { ThemeSelector } from './ThemeSelector';
import { saveProject, listProjects, createProject, deleteProject } from '@/lib/configStorage';
import { useBlocksHistory } from '@/lib/useHistory';
import { useToast } from '@/lib/toast';
import { blockDefinitions } from '@/lib/blockDefinitions';
import { templates } from '@/lib/templates';
import { cloneBlock } from '@/lib/blockUtils';
import { Block } from '@/types/block';
import { supabase } from '@/lib/supabase';
import { ThemeName } from '@/lib/themes';

export function Constructor() {
  const { blocks, setBlocks, undo, redo, canUndo, canRedo } = useBlocksHistory([]);
  const [showAuth, setShowAuth] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [project, setProject] = useState<any>({ 
    name: 'Мой сайт', 
    blocks: [],
    theme: 'modern' as ThemeName
  });
  const [projects, setProjects] = useState<any[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { 
        distance: 5 
      }
    })
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        if (session) {
          await loadProjects();
        }
      } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
      }
    };
    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsAuthenticated(!!session);
      
      if (session) {
        toast('Добро пожаловать!', 'success');
        await loadProjects();
      } else {
        toast('Вы вышли из аккаунта', 'info');
        setProjects([]);
        setProject({ name: 'Мой сайт', blocks: [], theme: 'modern' });
        setBlocks([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setProject((prev: any) => ({ ...prev, blocks }));
  }, [blocks]);

  const loadProjects = async () => {
    try {
      const list = await listProjects();
      setProjects(list);
      
      if (list.length > 0 && !project.id) {
        const firstProject = list[0];
        setProject(firstProject);
        setBlocks(firstProject.blocks || []);
      }
    } catch (error) {
      console.error('Ошибка загрузки проектов:', error);
    }
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    if (active.data.current?.isPaletteItem) {
      const type = active.data.current.type;
      const definition = blockDefinitions.find(d => d.type === type);
      if (definition) {
        const newBlock = definition.create();
        setBlocks((prev: Block[]) => [...prev, newBlock]);
        setSelectedBlockId(newBlock.id);
        toast('✓ Блок добавлен', 'success');
      }
      return;
    }

    if (active.id !== over.id) {
      setBlocks((items: Block[]) => {
        const oldIndex = items.findIndex((i) => i.id === active.id);
        const newIndex = items.findIndex((i) => i.id === over.id);
        if (oldIndex === -1 || newIndex === -1) return items;
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast('⚠ Войдите в аккаунт для сохранения', 'error');
      setShowAuth(true);
      return;
    }

    if (blocks.length === 0) {
      toast('⚠ Добавьте блоки перед сохранением', 'error');
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    try {
      const savedProject = await saveProject({ 
        ...project, 
        blocks,
        theme: project.theme || 'modern',
        name: project.name || 'Без названия'
      });
      
      setProject(savedProject);
      toast('✓ Проект сохранён!', 'success');
      await loadProjects();
    } catch (error: any) {
      console.error('Ошибка сохранения:', error);
      toast('❌ ' + (error.message || 'Ошибка сохранения'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewProject = async () => {
    if (!isAuthenticated) {
      toast('⚠ Войдите в аккаунт', 'error');
      setShowAuth(true);
      return;
    }

    if (isSaving) return;

    setIsSaving(true);
    try {
      const newProj = await createProject('Новый проект ' + new Date().toLocaleDateString());
      setProject({ ...newProj, theme: 'modern' });
      setBlocks([]);
      setSelectedBlockId(null);
      toast('✓ Создан новый проект', 'success');
      await loadProjects();
      setShowProjects(false);
    } catch (error: any) {
      console.error('Ошибка создания проекта:', error);
      toast('❌ ' + (error.message || 'Ошибка создания'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectProject = (selectedProject: any) => {
    if (blocks.length > 0 && !project.id) {
      if (!confirm('Несохранённые изменения будут потеряны. Продолжить?')) {
        return;
      }
    }

    setProject({
      ...selectedProject,
      theme: selectedProject.theme || 'modern'
    });
    setBlocks(selectedProject.blocks || []);
    setSelectedBlockId(null);
    toast(`📂 Загружен: ${selectedProject.name}`, 'info');
    setShowProjects(false);
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Удалить проект? Это действие нельзя отменить.')) return;
    
    if (isSaving) return;

    setIsSaving(true);
    try {
      await deleteProject(id);
      toast('✓ Проект удалён', 'success');
      await loadProjects();
      
      if (project.id === id) {
        setProject({ name: 'Мой сайт', blocks: [], theme: 'modern' });
        setBlocks([]);
        setSelectedBlockId(null);
      }
    } catch (error: any) {
      console.error('Ошибка удаления:', error);
      toast('❌ ' + (error.message || 'Ошибка удаления'), 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectTemplate = (template: any) => {
    if (blocks.length > 0) {
      if (!confirm('Текущие блоки будут заменены шаблоном. Продолжить?')) {
        return;
      }
    }

    try {
      const newBlocks = template.create();
      setBlocks(newBlocks);
      setProject({ ...project, name: template.name, blocks: newBlocks });
      setSelectedBlockId(null);
      toast(`✨ Загружен шаблон: ${template.name}`, 'success');
      setShowTemplates(false);
    } catch (error) {
      console.error('Ошибка загрузки шаблона:', error);
      toast('❌ Ошибка загрузки шаблона', 'error');
    }
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks(blocks.filter((b: Block) => b.id !== id));
    if (selectedBlockId === id) {
      setSelectedBlockId(null);
    }
    toast('🗑 Блок удалён', 'info');
  };

  const handleDuplicateBlock = (blockToClone: Block) => {
    try {
      const clone = cloneBlock(blockToClone);
      const currentIndex = blocks.findIndex((b: Block) => b.id === blockToClone.id);
      const newBlocks = [...blocks];
      newBlocks.splice(currentIndex + 1, 0, clone);
      setBlocks(newBlocks);
      setSelectedBlockId(clone.id);
      toast('📋 Блок дублирован', 'success');
    } catch (error) {
      console.error('Ошибка дублирования:', error);
      toast('❌ Ошибка дублирования блока', 'error');
    }
  };

  const handleUpdateBlock = (updatedBlock: Block) => {
    setBlocks(blocks.map((b: Block) => b.id === updatedBlock.id ? updatedBlock : b));
  };

  const handleThemeChange = (theme: ThemeName) => {
    setProject((prev: any) => ({ ...prev, theme }));
    toast(`🎨 Тема: ${theme}`, 'success');
  };

  const selectedBlock = blocks.find((b: Block) => b.id === selectedBlockId) || null;

  return (
    <DndContext 
      sensors={sensors} 
      collisionDetection={closestCenter} 
      onDragEnd={handleDragEnd}
    >
      <div className="flex h-full flex-col bg-slate-50 overflow-hidden">
        <ConfigToolbar 
          project={{ ...project, blocks }} 
          onSave={handleSave} 
          onOpenAuth={() => setShowAuth(true)}
          undoActions={{ undo, redo, canUndo, canRedo }}
        />
        
        <div className="flex items-center justify-between gap-2 px-6 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowProjects(true)}
              disabled={!isAuthenticated || isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              📂 Проекты {isAuthenticated && projects.length > 0 && `(${projects.length})`}
            </button>
            
            <button
              onClick={() => setShowTemplates(true)}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-all disabled:opacity-50"
            >
              ✨ Шаблоны
            </button>
            
            <button
              onClick={handleNewProject}
              disabled={!isAuthenticated || isSaving}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? '⏳ Загрузка...' : '➕ Новый проект'}
            </button>

            <div className="h-6 w-px bg-slate-200 mx-2" />
            
            <ThemeSelector 
              currentTheme={project.theme || 'modern'} 
              onThemeChange={handleThemeChange}
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Блоков: {blocks.length}</span>
            {isAuthenticated && <span>•</span>}
            {isAuthenticated && (
              <span className="text-emerald-600 font-medium">
                {isSaving ? '⏳ Сохранение...' : 'Авторизован ✓'}
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-1 overflow-hidden">
          <BlockPalette />
          
          <main className="flex-1 overflow-y-auto p-8 bg-slate-100">
            <Canvas 
              blocks={blocks} 
              setBlocks={setBlocks}
              selectedId={selectedBlockId}
              onSelect={setSelectedBlockId}
              onRemove={handleRemoveBlock}
              theme={project.theme || 'modern'}
            />
          </main>

          <PropertiesPanel 
            block={selectedBlock}
            onChange={handleUpdateBlock}
            onDuplicate={handleDuplicateBlock}
          />
        </div>

        {showAuth && <AuthModal onClose={() => setShowAuth(false)} />}
        
        {showProjects && (
          <ProjectsModal
            projects={projects}
            currentId={project?.id || null}
            onSelect={handleSelectProject}
            onNew={handleNewProject}
            onDelete={handleDeleteProject}
            onClose={() => setShowProjects(false)}
          />
        )}
        
        {showTemplates && (
          <TemplatesModal
            templates={templates}
            onSelect={handleSelectTemplate}
            onClose={() => setShowTemplates(false)}
          />
        )}

        {isSaving && (
          <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 z-50">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
            Сохранение...
          </div>
        )}
      </div>
    </DndContext>
  );
}