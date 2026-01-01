/**
 * BingoBoard Component
 * 5x5 grid layout for the bingo game
 * Smart component - accesses Zustand store
 */

import { useBingoStore } from '@/store/useBingoStore';
import { BingoCell } from './BingoCell';
import { cn } from '@/lib/utils';

interface BingoBoardProps {
  className?: string;
}

export const BingoBoard = (props: BingoBoardProps) => {
  // Store access (Smart Component)
  const cells = useBingoStore((state) => state.cells);
  const title = useBingoStore((state) => state.title);
  const toggleCellComplete = useBingoStore((state) => state.toggleCellComplete);

  // Handlers
  const handleCellTap = (id: string) => {
    toggleCellComplete(id);
  };

  // Render
  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto',
        'p-4',
        props.className
      )}
    >
      {/* Board Title */}
      <h2 className="text-xl font-bold text-center mb-4 text-off-black">
        {title}
      </h2>

      {/* Bingo Card Container - Floating Card Style */}
      <div
        className={cn(
          'bg-white',
          'border-3 border-off-black',
          'shadow-hard-lg',
          'p-2',
          'rounded-sm'
        )}
      >
        {/* 5x5 Grid */}
        <div className="grid grid-cols-5 gap-0">
          {cells.map((cell) => (
            <BingoCell
              key={cell.id}
              cell={cell}
              onTap={handleCellTap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
