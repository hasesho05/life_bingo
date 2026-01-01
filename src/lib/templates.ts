/**
 * Template definitions for Bingo board backgrounds
 * Uses CSS gradients for initial implementation
 */

export interface BingoTemplate {
  id: string;
  name: string;
  style: {
    background: string;
    cellBackground?: string;
  };
}

/**
 * Available templates for the Bingo board
 */
export const TEMPLATES: BingoTemplate[] = [
  {
    id: 'pastel-grid',
    name: 'パステルグリッド',
    style: {
      background: 'linear-gradient(135deg, #fce4ec 0%, #f3e5f5 50%, #e8eaf6 100%)',
      cellBackground: 'rgba(255, 255, 255, 0.85)',
    },
  },
  {
    id: 'sunset-warm',
    name: 'サンセット',
    style: {
      background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 50%, #ffccbc 100%)',
      cellBackground: 'rgba(255, 255, 255, 0.9)',
    },
  },
  {
    id: 'ocean-breeze',
    name: 'オーシャン',
    style: {
      background: 'linear-gradient(135deg, #e0f7fa 0%, #b2ebf2 50%, #b3e5fc 100%)',
      cellBackground: 'rgba(255, 255, 255, 0.85)',
    },
  },
];

/**
 * Get template by ID
 */
export const getTemplateById = (id: string): BingoTemplate | undefined => {
  return TEMPLATES.find((template) => template.id === id);
};

/**
 * Default template ID
 */
export const DEFAULT_TEMPLATE_ID = 'pastel-grid';
