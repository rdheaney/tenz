import React, { memo } from 'react';
import { Pressable, Text, StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const COLS = 9;
const CELL_SIZE = Math.floor((width - 20) / COLS);

type Props = {
  value: number;
  cleared: boolean;
  selected: boolean;
  onPress: () => void;
};

const Cell = memo(({ value, cleared, selected, onPress }: Props) => {
  if (cleared) {
    return <Pressable style={styles.cleared} />;
  }

  return (
    <Pressable
      style={[styles.cell, selected && styles.selected]}
      onPress={onPress}
    >
      <Text style={[styles.text, selected && styles.selectedText]}>
        {value}
      </Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  cell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e1e2e',
    borderRadius: 4,
    margin: 1,
    borderWidth: 1,
    borderColor: '#333',
  },
  selected: {
    backgroundColor: '#4f46e5',
    borderColor: '#818cf8',
  },
  cleared: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    margin: 1,
    borderWidth: 1,
    borderColor: '#1e1e2e',
    borderRadius: 4,
  },
  text: {
    fontSize: CELL_SIZE * 0.45,
    fontWeight: '600',
    color: '#e2e8f0',
  },
  selectedText: {
    color: '#fff',
  },
});

export default Cell;
