/**
 * Type definitions for Bingo domain
 */

export interface BingoCell {
  id: string;
  text: string;
  completed: boolean;
}

export type EditMode = 'write' | 'move';

export interface BingoTheme {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
}

export interface BingoState {
  cells: BingoCell[];
  mode: EditMode;
  title: string;
  theme: BingoTheme;
}

export interface BingoActions {
  updateCellText: (id: string, text: string) => void;
  toggleCellComplete: (id: string) => void;
  swapCells: (fromId: string, toId: string) => void;
  setMode: (mode: EditMode) => void;
  setTitle: (title: string) => void;
  setTheme: (theme: BingoTheme) => void;
  resetBoard: () => void;
}

export interface BingoStore extends BingoState, BingoActions {}
