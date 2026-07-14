'use client';

import { useEffect, useCallback, useRef } from 'react';

interface ShortcutHandlers {
  undo?: () => void;
  redo?: () => void;
  save?: () => void;
  exportPDF?: () => void;
}

/**
 * Registers global keyboard shortcuts for common resume editor actions.
 *
 * - Ctrl/Cmd + Z       → undo
 * - Ctrl/Cmd + Shift+Z → redo
 * - Ctrl/Cmd + S       → save (prevents default)
 * - Ctrl/Cmd + P       → exportPDF (prevents default)
 */
export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  // Use refs so the effect never re-registers on handler changes
  const handlersRef = useRef(handlers);

  useEffect(() => {
    handlersRef.current = handlers;
  }, [handlers]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;

    const key = e.key.toLowerCase();

    // Ctrl/Cmd + Shift + Z → Redo
    if (key === 'z' && e.shiftKey) {
      e.preventDefault();
      handlersRef.current.redo?.();
      return;
    }

    // Ctrl/Cmd + Z → Undo
    if (key === 'z' && !e.shiftKey) {
      e.preventDefault();
      handlersRef.current.undo?.();
      return;
    }

    // Ctrl/Cmd + S → Save
    if (key === 's') {
      e.preventDefault();
      handlersRef.current.save?.();
      return;
    }

    // Ctrl/Cmd + P → Export PDF
    if (key === 'p') {
      e.preventDefault();
      handlersRef.current.exportPDF?.();
      return;
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
}
