/**
 * BingoCell Component
 * Individual cell in the bingo grid
 * Dumb component - receives data via props
 */

import { motion } from 'motion/react';
import { cn } from '@/lib/utils';
import type { BingoCell as BingoCellType } from '@/types/bingo';

interface BingoCellProps {
  cell: BingoCellType;
  onTap?: (id: string) => void;
}

export const BingoCell = (props: BingoCellProps) => {
  // Handlers
  const handleTap = () => {
    props.onTap?.(props.cell.id);
  };

  // Calculate font size based on text length
  const getFontSizeClass = () => {
    const textLength = props.cell.text.length;
    if (textLength === 0) return 'text-sm';
    if (textLength <= 4) return 'text-base';
    if (textLength <= 8) return 'text-sm';
    if (textLength <= 12) return 'text-xs';
    return 'text-[10px]';
  };

  // Check if this is the FREE cell
  const isFreeCell = props.cell.text === 'FREE';

  // Render
  return (
    <motion.button
      type="button"
      onClick={handleTap}
      className={cn(
        'aspect-square',
        'w-full',
        'flex items-center justify-center',
        'p-1',
        'border-3 border-off-black',
        'bg-white',
        'cursor-pointer',
        'select-none',
        'overflow-hidden',
        'transition-shadow duration-100',
        getFontSizeClass(),
        isFreeCell && 'bg-acid-lime font-bold',
        props.cell.completed && !isFreeCell && 'bg-acid-lime/50'
      )}
      whileTap={{
        scale: 0.95,
        boxShadow: '2px 2px 0px 0px #000000',
      }}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 25,
      }}
    >
      <span className="text-center leading-tight break-words hyphens-auto">
        {props.cell.text || (
          <span className="text-gray-400 text-xs">+</span>
        )}
      </span>
    </motion.button>
  );
};
