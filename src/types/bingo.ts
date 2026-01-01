/**
 * Type definitions for Bingo domain
 */

export interface BingoCell {
  id: string;
  text: string;
  completed: boolean;
}

export type EditMode = 'write' | 'move';

export interface BingoState {
  cells: BingoCell[];
  mode: EditMode;
}
