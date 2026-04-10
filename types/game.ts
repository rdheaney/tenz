export type Cell = {
  id: number;
  value: number;
  cleared: boolean;
  selected: boolean;
};

export type GameState = {
  cells: Cell[];
  score: number;
  moves: number;
  stage: number;
  gameOver: boolean;
  canAppend: boolean;
  appendCount: number;
};

export type GameAction =
  | { type: 'SELECT_CELL'; id: number }
  | { type: 'APPEND_ROWS' }
  | { type: 'NEXT_STAGE' }
  | { type: 'RESET' };
