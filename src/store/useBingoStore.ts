/**
 * Zustand store for Bingo state management
 * Persists to localStorage with persist middleware
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BingoStore, BingoCell, EditMode, BingoTheme } from '@/types/bingo';

/**
 * Generate initial 25 cells (5x5 grid)
 * Center cell (index 12) is marked as "FREE" and completed
 */
const generateInitialCells = (): BingoCell[] => {
  return Array.from({ length: 25 }, (_, index) => {
    const isFreeCell = index === 12;
    return {
      id: `cell-${index}`,
      text: isFreeCell ? 'FREE' : '',
      completed: isFreeCell,
    };
  });
};

/**
 * Default theme (Neo-Brutalism)
 */
const defaultTheme: BingoTheme = {
  backgroundColor: '#F4F4F5',
  accentColor: '#D9F99D',
  textColor: '#000000',
};

/**
 * Initial state
 */
const initialState = {
  cells: generateInitialCells(),
  mode: 'write' as EditMode,
  title: '2026年の目標ビンゴ',
  theme: defaultTheme,
  backgroundImageUrl: null as string | null,
  selectedTemplate: 'pastel-grid',
};

/**
 * Bingo Store Hook
 */
export const useBingoStore = create<BingoStore>()(
  persist(
    (set) => ({
      ...initialState,

      /**
       * Update cell text
       */
      updateCellText: (id: string, text: string) =>
        set((state) => ({
          cells: state.cells.map((cell) =>
            cell.id === id ? { ...cell, text } : cell
          ),
        })),

      /**
       * Toggle cell completion status
       */
      toggleCellComplete: (id: string) =>
        set((state) => ({
          cells: state.cells.map((cell) =>
            cell.id === id ? { ...cell, completed: !cell.completed } : cell
          ),
        })),

      /**
       * Swap two cells (for drag & drop reordering)
       */
      swapCells: (fromId: string, toId: string) =>
        set((state) => {
          const fromIndex = state.cells.findIndex((cell) => cell.id === fromId);
          const toIndex = state.cells.findIndex((cell) => cell.id === toId);

          if (fromIndex === -1 || toIndex === -1) {
            return state;
          }

          const newCells = [...state.cells];
          const temp = newCells[fromIndex];
          newCells[fromIndex] = newCells[toIndex];
          newCells[toIndex] = temp;

          return { cells: newCells };
        }),

      /**
       * Set edit mode
       */
      setMode: (mode: EditMode) => set({ mode }),

      /**
       * Set board title
       */
      setTitle: (title: string) => set({ title }),

      /**
       * Set theme
       */
      setTheme: (theme: BingoTheme) => set({ theme }),

      /**
       * Set background image URL (for user uploaded images)
       */
      setBackgroundImage: (url: string | null) => set({ backgroundImageUrl: url }),

      /**
       * Set selected template ID
       */
      setTemplate: (id: string) => set({ selectedTemplate: id, backgroundImageUrl: null }),

      /**
       * Reset board to initial state
       */
      resetBoard: () => set(initialState),
    }),
    {
      name: 'life-bingo-storage',
    }
  )
);
