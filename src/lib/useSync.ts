'use client';
import { useEffect, useRef } from 'react';
import { saveProject, Project } from './configStorage';

export function useAutosave(project: Project | null) {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!project) return;
    if (timer.current) clearTimeout(timer.current);

    timer.current = setTimeout(() => {
      saveProject(project).catch(console.error);
    }, 3000);

    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [project]);
}