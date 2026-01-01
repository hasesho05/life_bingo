/**
 * BingoBoard Component
 * Displays the 5x5 bingo grid with background support
 * Smart component that handles store interaction
 */

import { BingoCell } from './BingoCell';
import { getTemplateById } from '@/lib/templates';
import type { BingoCell as BingoCellType } from '@/types/bingo';

interface BingoBoardProps {
  cells: BingoCellType[];
  backgroundImageUrl: string | null;
  selectedTemplate: string;
  onCellTap?: (id: string) => void;
}

export const BingoBoard = (props: BingoBoardProps) => {
  const template = getTemplateById(props.selectedTemplate);

  const backgroundStyle = props.backgroundImageUrl
    ? {
        backgroundImage: `url(${props.backgroundImageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : {
        background: template?.style.background ?? '#F4F4F5',
      };

  const cellBackground = props.backgroundImageUrl
    ? 'rgba(255, 255, 255, 0.9)'
    : template?.style.cellBackground ?? 'rgba(255, 255, 255, 0.85)';

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div
        className="rounded-lg p-3 border-3 border-black"
        style={backgroundStyle}
      >
        <div className="grid grid-cols-5 gap-1">
          {props.cells.map((cell) => (
            <BingoCell
              key={cell.id}
              cell={cell}
              backgroundColor={cellBackground}
              onTap={props.onCellTap}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
