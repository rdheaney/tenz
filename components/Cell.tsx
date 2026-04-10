import React, { memo, useEffect, useRef } from 'react';
import { Pressable, Text, StyleSheet, Dimensions, Animated } from 'react-native';
import { colors, fonts } from '../theme';

const { width } = Dimensions.get('window');
const COLS = 9;
const CELL_SIZE = Math.floor((width - 20 - COLS * 4) / COLS);

type Props = {
  value: number;
  cleared: boolean;
  selected: boolean;
  hinted: boolean;
  generation: number;
  onPress: () => void;
};

const Cell = memo(({ value, cleared, selected, hinted, generation, onPress }: Props) => {
  const scale = useRef(new Animated.Value(1)).current;

  // Select pulse
  useEffect(() => {
    Animated.spring(scale, {
      toValue: selected ? 1.15 : 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 8,
    }).start();
  }, [selected]);

  if (cleared) {
    return <Pressable style={styles.cleared} />;
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ scale }], zIndex: selected ? 2 : 0 }]}>
      <Pressable
        style={[styles.cell, generation === 1 && styles.cellAppended, selected && styles.selected, hinted && styles.hinted]}
        onPress={onPress}
      >
        <Text style={[styles.text, selected && styles.selectedText]}>
          {value}
        </Text>
      </Pressable>
    </Animated.View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 2,
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.cellBg,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.cellBorder,
  },
  selected: {
    backgroundColor: colors.selectedBg,
    borderColor: colors.selectedBorder,
  },
  cellAppended: {
    backgroundColor: colors.cellBgAppended,
    borderColor: colors.cellBorderAppended,
  },
  hinted: {
    backgroundColor: colors.hintedBg,
    borderColor: colors.hintedBorder,
  },
  cleared: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 2,
    borderWidth: 1,
    borderColor: colors.clearedBorder,
    borderRadius: 8,
  },
  text: {
    fontSize: CELL_SIZE * 0.45,
    fontFamily: fonts.bold,
    color: colors.textPrimary,
  },
  selectedText: {
    color: colors.textSelected,
  },
});

export default Cell;
