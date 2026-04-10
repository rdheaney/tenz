import { Cell } from '../types/game';

export const COLS = 9;

export function generateBoard(): Cell[] {
  const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = values.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [values[i], values[j]] = [values[j], values[i]];
  }
  return values.map((value, id) => ({ id, value, cleared: false, selected: false, generation: 0 }));
}

export function getSelectedCells(cells: Cell[]): Cell[] {
  return cells.filter(c => c.selected);
}

export function isMatch(a: Cell, b: Cell): boolean {
  return a.value === b.value || a.value + b.value === 10;
}

// Returns all cell ids strictly between a and b along a path, or null if no valid path exists.
// Checks horizontal, vertical, diagonal, and row-wrap paths.
function getCellsBetween(cells: Cell[], a: Cell, b: Cell): number[] | null {
  const totalCols = COLS;
  const aRow = Math.floor(a.id / totalCols);
  const aCol = a.id % totalCols;
  const bRow = Math.floor(b.id / totalCols);
  const bCol = b.id % totalCols;

  const rowDiff = bRow - aRow;
  const colDiff = bCol - aCol;
  const steps = Math.max(Math.abs(rowDiff), Math.abs(colDiff));

  // Adjacent cells (distance 1) — always a valid path, no cells between
  if (steps === 1) return [];

  // Horizontal — same row
  if (rowDiff === 0) {
    const minCol = Math.min(aCol, bCol);
    const maxCol = Math.max(aCol, bCol);
    const between: number[] = [];
    for (let c = minCol + 1; c < maxCol; c++) {
      between.push(aRow * totalCols + c);
    }
    return between;
  }

  // Vertical — same column
  if (colDiff === 0) {
    const minRow = Math.min(aRow, bRow);
    const maxRow = Math.max(aRow, bRow);
    const between: number[] = [];
    for (let r = minRow + 1; r < maxRow; r++) {
      between.push(r * totalCols + aCol);
    }
    return between;
  }

  // Diagonal — same step count in both directions
  if (Math.abs(rowDiff) === Math.abs(colDiff)) {
    const rowStep = rowDiff > 0 ? 1 : -1;
    const colStep = colDiff > 0 ? 1 : -1;
    const between: number[] = [];
    for (let s = 1; s < steps; s++) {
      const r = aRow + s * rowStep;
      const c = aCol + s * colStep;
      between.push(r * totalCols + c);
    }
    return between;
  }

  // Row-wrap path: end of a's row → start of b's row (linear through array)
  if (aRow !== bRow) {
    const from = Math.min(a.id, b.id);
    const to = Math.max(a.id, b.id);
    const between: number[] = [];
    for (let i = from + 1; i < to; i++) {
      between.push(i);
    }
    return between;
  }

  return null;
}

export function isValidMatch(cells: Cell[], a: Cell, b: Cell): boolean {
  if (a.id === b.id) return false;
  if (!isMatch(a, b)) return false;

  const between = getCellsBetween(cells, a, b);
  if (between === null) return false;

  // All cells between must be cleared
  return between.every(id => cells[id]?.cleared ?? true);
}

export function getMatchDistance(cells: Cell[], a: Cell, b: Cell): number {
  const between = getCellsBetween(cells, a, b);
  return between ? between.length : 0;
}

export function applyMatch(cells: Cell[], a: Cell, b: Cell): Cell[] {
  return cells.map(c =>
    c.id === a.id || c.id === b.id
      ? { ...c, cleared: true, selected: false }
      : c
  );
}

export function clearSelections(cells: Cell[]): Cell[] {
  return cells.map(c => ({ ...c, selected: false }));
}

export function appendRows(cells: Cell[], generation: number): Cell[] {
  const uncleared = cells.filter(c => !c.cleared);
  const startId = cells.length;
  const newCells = uncleared.map((c, i) => ({
    ...c,
    id: startId + i,
    selected: false,
    generation,
  }));
  return [...cells, ...newCells];
}

// Remove any rows where every cell is cleared, then re-index ids
export function collapseEmptyRows(cells: Cell[]): Cell[] {
  const rows: Cell[][] = [];
  for (let i = 0; i < cells.length; i += COLS) {
    rows.push(cells.slice(i, i + COLS));
  }
  const nonEmptyRows = rows.filter(row => row.some(c => !c.cleared));
  const flat = nonEmptyRows.flat();
  return flat.map((c, i) => ({ ...c, id: i }));
}

export function hasValidMoves(cells: Cell[]): boolean {
  const active = cells.filter(c => !c.cleared);
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      if (isValidMatch(cells, active[i], active[j])) return true;
    }
  }
  return false;
}

export function isGameWon(cells: Cell[]): boolean {
  return cells.every(c => c.cleared);
}

export function findHint(cells: Cell[]): [number, number] | null {
  const active = cells.filter(c => !c.cleared);
  for (let i = 0; i < active.length; i++) {
    for (let j = i + 1; j < active.length; j++) {
      if (isValidMatch(cells, active[i], active[j])) {
        return [active[i].id, active[j].id];
      }
    }
  }
  return null;
}
