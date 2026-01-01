/**
 * BingoCell Component
 * Displays a single cell in the bingo grid
 * Uses hand-drawn style with thick black border (no shadow)
 */

import { cn } from '@/lib/utils';
import type { BingoCell as BingoCellType } from '@/types/bingo';

interface BingoCellProps {
  cell: BingoCellType;
  backgroundColor?: string;
  onTap?: (id: string) => void;
}

export const BingoCell = (props: BingoCellProps) => {
  const handleClick = () => {
    props.onTap?.(props.cell.id);
  };

  return (
    <div
      className={cn(
        'aspect-square',
        'flex items-center justify-center',
        'border-3 border-black rounded-md',
        'text-sm font-medium text-center',
        'p-1 overflow-hidden',
        'transition-colors duration-150',
        'cursor-pointer select-none',
        props.cell.completed && 'bg-acid-lime/30'
      )}
      style={{
        backgroundColor: props.cell.completed
          ? undefined
          : props.backgroundColor ?? 'rgba(255, 255, 255, 0.85)',
      }}
      onClick={handleClick}
    >
      <span className="break-words line-clamp-4 leading-tight">
        {props.cell.text || (props.cell.id === 'cell-12' ? 'FREE' : '')}
      </span>
    </div>
  );
};
