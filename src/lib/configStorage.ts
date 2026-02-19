import { supabase } from './supabase';

export interface Project {
  id?: string;
  name: string;
  blocks: any[];
  theme?: string;
  user_id?: string;
  updated_at?: string;
  created_at?: string;
}

export async function createProject(name: string): Promise<Project> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Авторизуйтесь для создания проекта");
  }

  const { data, error } = await supabase
    .from('projects')
    .insert({ 
      name: name || 'Без названия', 
      blocks: [], 
      theme: 'modern',
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error('Ошибка создания проекта:', error);
    throw new Error(error.message || 'Ошибка создания проекта');
  }
  
  return data as Project;
}

export async function saveProject(project: Project): Promise<Project> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Авторизуйтесь для сохранения");
  }

  const projectData = {
    name: project.name || 'Без названия',
    blocks: project.blocks || [],
    theme: project.theme || 'modern',
    user_id: user.id,
    updated_at: new Date().toISOString(),
  };

  let data: any;
  let error: any;

  if (project.id) {
    const result = await supabase
      .from('projects')
      .update(projectData)
      .eq('id', project.id)
      .eq('user_id', user.id)
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  } else {
    const result = await supabase
      .from('projects')
      .insert({ 
        ...projectData, 
        created_at: new Date().toISOString() 
      })
      .select()
      .single();
    
    data = result.data;
    error = result.error;
  }

  if (error) {
    console.error('Ошибка сохранения:', error);
    throw new Error(error.message || 'Ошибка сохранения');
  }
  
  if (!data) {
    throw new Error('Нет данных после сохранения');
  }
  
  return data as Project;
}

export async function listProjects(): Promise<Project[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) return [];

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Ошибка загрузки проектов:', error);
    return [];
  }
  
  return (data || []) as Project[];
}

export async function deleteProject(id: string): Promise<void> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error("Авторизуйтесь для удаления");
  }

  console.log('🗑 Удаление проекта:', id);
  const startTime = Date.now();

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id);

  const elapsed = Date.now() - startTime;
  console.log(`⏱ Удаление заняло: ${elapsed}ms`);

  if (error) {
    console.error('Ошибка удаления:', error);
    throw new Error(error.message || 'Ошибка удаления проекта');
  }
}

export function setPreviewForView(blocks: any[], theme?: string): void {
  if (typeof window !== 'undefined') {
    try {
      sessionStorage.setItem('gomel_flow_preview', JSON.stringify(blocks));
      sessionStorage.setItem('gomel_flow_preview_theme', theme || 'modern');
    } catch (error) {
      console.error('Ошибка сохранения preview:', error);
    }
  }
}

export function getPreviewForView(): any[] {
  if (typeof window !== 'undefined') {
    try {
      const data = sessionStorage.getItem('gomel_flow_preview');
      if (data) return JSON.parse(data);
    } catch (error) {
      console.error('Ошибка загрузки preview:', error);
    }
  }
  return [];
}

export function getPreviewTheme(): string {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('gomel_flow_preview_theme') || 'modern';
  }
  return 'modern';
}

export function encodeConfigForUrl(blocks: any[], theme?: string): string {
  try {
    const data = { blocks, theme: theme || 'modern' };
    return btoa(encodeURIComponent(JSON.stringify(data)));
  } catch (e) {
    return '';
  }
}

export function decodeConfigFromUrl(encoded: string): { blocks: any[]; theme: string } | null {
  try {
    const decoded = decodeURIComponent(atob(encoded));
    const data = JSON.parse(decoded);
    
    if (data.blocks && Array.isArray(data.blocks)) {
      return {
        blocks: data.blocks,
        theme: data.theme || 'modern'
      };
    }
    
    return null;
  } catch (error) {
    console.error('Ошибка декодирования:', error);
    return null;
  }
}