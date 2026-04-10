import React, { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, SafeAreaView, Pressable, Text, LayoutAnimation, Platform, UIManager } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import { colors, fonts } from '../theme';

// Enable LayoutAnimation on Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import Cell from './Cell';
import HUD from './HUD';
import ScoreToast from './ScoreToast';
import WinOverlay from './WinOverlay';
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
  findHint,
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
  appendParity: 1,
  hintsRemaining: 3,
  hintCells: null,
  highlightAppend: false,
};

function reducer(state: GameState, action: GameAction): GameState {
  // Clear any active hint on every action except HINT/CLEAR_HINT
  if (action.type !== 'HINT' && action.type !== 'CLEAR_HINT') {
    state = { ...state, hintCells: null, highlightAppend: false };
  }
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
        const newMoves = moves + 1;
        const won = isGameWon(newCells);
        const earnedHint = newMoves % 5 === 0 ? 1 : 0;
        return {
          ...state,
          cells: newCells,
          score: newScore,
          moves: newMoves,
          gameOver: won,
          canAppend: !won && !hasValidMoves(newCells),
          hintsRemaining: state.hintsRemaining + earnedHint,
        };
      }

      // No match — select the new cell instead
      return {
        ...state,
        cells: cells.map(c => ({ ...c, selected: c.id === action.id })),
      };
    }

    case 'APPEND_ROWS': {
      const newCells = appendRows(state.cells, state.appendParity);
      return {
        ...state,
        cells: newCells,
        canAppend: !hasValidMoves(newCells),
        appendCount: state.appendCount + 1,
        appendParity: state.appendParity === 0 ? 1 : 0,
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
        appendParity: 1,
      };
    }

    case 'RESET': {
      return { ...initialState, cells: generateBoard() };
    }

    case 'HINT': {
      if (state.hintsRemaining <= 0) return state;
      const remaining = state.hintsRemaining - 1;
      if (state.canAppend) {
        return { ...state, highlightAppend: true, hintsRemaining: remaining };
      }
      const pair = findHint(state.cells);
      if (!pair) return state;
      return { ...state, hintCells: pair, hintsRemaining: remaining };
    }

    case 'CLEAR_HINT': {
      return { ...state, hintCells: null, highlightAppend: false };
    }

    default:
      return state;
  }
}

export default function GameBoard() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { cells, score, moves, stage, gameOver, canAppend, appendCount, hintsRemaining, hintCells, highlightAppend } = state;
  const { highScore, updateHighScore } = useHighScore();

  // Score toast + haptics
  const prevScoreRef = useRef(score);
  const [toast, setToast] = useState<{ id: number; value: number } | null>(null);
  useEffect(() => {
    const earned = score - prevScoreRef.current;
    if (earned > 0) {
      setToast(t => ({ id: (t?.id ?? 0) + 1, value: earned }));
      if (earned >= 8) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } else if (earned >= 5) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } else {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    }
    prevScoreRef.current = score;
  }, [score]);

  useEffect(() => {
    if (gameOver) {
      updateHighScore(score);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, [gameOver]);

  const handlePress = useCallback((id: number) => {
    dispatch({ type: 'SELECT_CELL', id });
  }, []);

  const handleAppend = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    dispatch({ type: 'APPEND_ROWS' });
  }, []);

  const handleReset = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const handleHint = useCallback(() => {
    dispatch({ type: 'HINT' });
    setTimeout(() => dispatch({ type: 'CLEAR_HINT' }), 2000);
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
    <LinearGradient
      colors={[colors.bgGradientTop, colors.bgGradientBottom]}
      style={styles.gradient}
    >
      <SafeAreaView style={styles.container}>
      <HUD score={score} moves={moves} stage={stage} highScore={highScore} />
      <View style={styles.hudDivider} />
      <FlatList
        data={rows}
        keyExtractor={(_, i) => String(i)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item: row }) => (
          <View style={styles.row}>
            {row.map((cell, i) =>
              cell ? (
                <Cell
                  key={cell.id}
                  value={cell.value}
                  cleared={cell.cleared}
                  selected={cell.selected}
                  hinted={hintCells !== null && (hintCells[0] === cell.id || hintCells[1] === cell.id)}
                  generation={cell.generation}
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
            style={[styles.button, highlightAppend && styles.buttonHighlight]}
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
        <View style={styles.badgeWrapper}>
          <Pressable
            style={[styles.button, hintsRemaining === 0 && styles.buttonDisabled]}
            onPress={handleHint}
            disabled={hintsRemaining === 0}
          >
            <Text style={styles.buttonText}>Hint</Text>
          </Pressable>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{hintsRemaining}</Text>
          </View>
        </View>
        <Pressable style={[styles.button, styles.resetButton]} onPress={handleReset}>
          <Text style={styles.buttonText}>New Game</Text>
        </Pressable>
      </View>
      {toast && <ScoreToast value={toast.value} id={toast.id} />}
      {gameOver && (
        <WinOverlay
          stage={stage}
          score={score}
          onNextStage={handleNextStage}
          onReset={handleReset}
        />
      )}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  board: {
    paddingHorizontal: 10,
    paddingTop: 8,
    overflow: 'visible',
  },
  row: {
    flexDirection: 'row',
    overflow: 'visible',
  },
  pad: {
    width: 0,
    height: 0,
  },
  hudDivider: {
    height: 1,
    backgroundColor: colors.cellBorder,
    opacity: 0.4,
    marginHorizontal: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    padding: 12,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  resetButton: {
    backgroundColor: colors.buttonReset,
  },
  buttonDisabled: {
    opacity: colors.buttonDisabledOpacity,
  },
  buttonHighlight: {
    backgroundColor: colors.buttonHighlight,
    borderWidth: 1,
    borderColor: colors.buttonHighlightBorder,
  },
  badgeWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.badgeBg,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: colors.badgeText,
    fontSize: 11,
    fontFamily: fonts.bold,
  },
  buttonText: {
    color: '#fff',
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
});
