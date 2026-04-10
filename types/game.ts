export type Cell = {
  id: number;
  value: number;
  cleared: boolean;
  selected: boolean;
  generation: number;
};

export type GameState = {
  cells: Cell[];
  score: number;
  moves: number;
  stage: number;
  gameOver: boolean;
  canAppend: boolean;
  appendCount: number;
  appendParity: number;
  hintsRemaining: number;
  hintCells: [number, number] | null;
  highlightAppend: boolean;
};

export type GameAction =
  | { type: 'SELECT_CELL'; id: number }
  | { type: 'APPEND_ROWS' }
  | { type: 'NEXT_STAGE' }
  | { type: 'RESET' }
  | { type: 'HINT' }
  | { type: 'CLEAR_HINT' };
