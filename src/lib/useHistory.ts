'use client';
import { useState, useCallback } from 'react';

export function useBlocksHistory(initialBlocks: any[]) {
  const [blocks, _setBlocks] = useState(initialBlocks);
  const [history, setHistory] = useState([initialBlocks]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const setBlocks = useCallback((newBlocks: any) => {
    const nextBlocks = typeof newBlocks === 'function' ? newBlocks(blocks) : newBlocks;
    const newHistory = history.slice(0, currentIndex + 1);
    newHistory.push(nextBlocks);
    setHistory(newHistory);
    setCurrentIndex(newHistory.length - 1);
    _setBlocks(nextBlocks);
  }, [blocks, currentIndex, history]);

  const undo = useCallback(() => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      _setBlocks(history[prevIndex]);
    }
  }, [currentIndex, history]);

  const redo = useCallback(() => {
    if (currentIndex < history.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      _setBlocks(history[nextIndex]);
    }
  }, [currentIndex, history]);

  return { blocks, setBlocks, undo, redo, canUndo: currentIndex > 0, canRedo: currentIndex < history.length - 1 };
}