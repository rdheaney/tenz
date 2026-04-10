import React, { useReducer, useCallback, useEffect } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Pressable, Text } from 'react-native';
import Cell from './Cell';
import HUD from './HUD';
import { GameState, GameAction } from '../types/game';
import { useHighScore } from '../utils/useHighScore';
import {
  generateBoard,
  getSelectedCells,
  isValidMatch,
  applyMatch,
  clearSelections,
  appendRows,
  collapseEmptyRows,
  isGameWon,
  getMatchDistance,
  hasValidMoves,
  COLS,
} from '../utils/gameLogic';

const initialState: GameState = {
  cells: generateBoard(),
  score: 0,
  moves: 0,
  stage: 1,
  gameOver: false,
  canAppend: false,
  appendCount: 0,
};

function reducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SELECT_CELL': {
      const { cells, score, moves } = state;
      const tapped = cells.find(c => c.id === action.id);
      if (!tapped || tapped.cleared) return state;

      const selected = getSelectedCells(cells);

      // Deselect if tapping the already-selected cell
      if (tapped.selected) {
        return {
          ...state,
          cells: clearSelections(cells),
        };
      }

      // First selection
      if (selected.length === 0) {
        return {
          ...state,
          cells: cells.map(c => c.id === action.id ? { ...c, selected: true } : c),
        };
      }

      // Second selection — check for match
      const first = selected[0];
      if (isValidMatch(cells, first, tapped)) {
        const distance = getMatchDistance(cells, first, tapped);
        const matched = applyMatch(cells, first, tapped);
        const newCells = collapseEmptyRows(matched);
        const newScore = score + 2 + distance;
        const won = isGameWon(newCells);
        return {
          ...state,
          cells: newCells,
          score: newScore,
          moves: moves + 1,
          gameOver: won,
          canAppend: !won && !hasValidMoves(newCells),
        };
      }

      // No match — select the new cell instead
      return {
        ...state,
        cells: cells.map(c => ({ ...c, selected: c.id === action.id })),
      };
    }

    case 'APPEND_ROWS': {
      const newCells = appendRows(state.cells);
      return {
        ...state,
        cells: newCells,
        canAppend: !hasValidMoves(newCells),
        appendCount: state.appendCount + 1,
      };
    }

    case 'NEXT_STAGE': {
      const newCells = generateBoard();
      return {
        ...state,
        cells: newCells,
        moves: 0,
        stage: state.stage + 1,
        gameOver: false,
        canAppend: !hasValidMoves(newCells),
        appendCount: 0,
      };
    }

    case 'RESET': {
      return { ...initialState, cells: generateBoard() };
    }

    default:
      return state;
  }
}

export default function GameBoard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cells, score, moves, stage, gameOver, canAppend, appendCount } = state;
  const { highScore, updateHighScore } = useHighScore();

  useEffect(() => {
    if (gameOver) updateHighScore(score);
  }, [gameOver]);

  const handlePress = useCallback((id: number) => {
    dispatch({ type: 'SELECT_CELL', id });
  }, []);

  const handleAppend = useCallback(() => {
    dispatch({ type: 'APPEND_ROWS' });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleNextStage = useCallback(() => {
    dispatch({ type: 'NEXT_STAGE' });
  }, []);

  // Pad cells to fill last row
  const remainder = cells.length % COLS;
  const padded = remainder === 0 ? cells : [
    ...cells,
    ...Array(COLS - remainder).fill(null),
  ];

  const rows: (typeof cells[0] | null)[][] = [];
  for (let i = 0; i < padded.length; i += COLS) {
    rows.push(padded.slice(i, i + COLS));
  }

  return (
    <SafeAreaView style={styles.container}>
      <HUD score={score} moves={moves} stage={stage} highScore={highScore} />
      <FlatList
        data={rows}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((cell, i) =>
              cell ? (
                <Cell
                  key={cell.id}
                  value={cell.value}
                  cleared={cell.cleared}
                  selected={cell.selected}
                  onPress={() => handlePress(cell.id)}
                />
              ) : (
                <View key={`pad-${i}`} style={styles.pad} />
              )
            )}
          </View>
        )}
        contentContainerStyle={styles.board}
      />
      <View style={styles.footer}>
        <View style={styles.badgeWrapper}>
          <Pressable
            style={styles.button}
            onPress={handleAppend}
          >
            <Text style={styles.buttonText}>+ Add Numbers</Text>
          </Pressable>
          {appendCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{appendCount}</Text>
            </View>
          )}
        </View>
        <Pressable style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>New Game</Text>
        </Pressable>
      </View>
      {gameOver && (
        <View style={styles.overlay}>
          <Text style={styles.winText}>Stage {stage} Complete! 🎉</Text>
          <Text style={styles.winSubtext}>Score: {score}</Text>
          <Pressable style={styles.button} onPress={handleNextStage}>
            <Text style={styles.buttonText}>Stage {stage + 1} →</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.resetButton]} onPress={handleReset}>
            <Text style={styles.buttonText}>New Game</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f1a',
  },
  board: {
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
  },
  pad: {
    width: 0,
    height: 0,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    padding: 12,
  },
  button: {
    backgroundColor: '#4f46e5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: '#374151',
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  badgeWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#e11d48',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
  },
  winText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
  },
  winSubtext: {
    color: '#818cf8',
    fontSize: 18,
    fontWeight: '600',
  },
});
