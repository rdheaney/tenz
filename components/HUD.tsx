import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type Props = {
  score: number;
  moves: number;
  stage: number;
  highScore: number;
};

export default function HUD({ score, moves, stage, highScore }: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.stat}>
        <Text style={styles.label}>SCORE</Text>
        <Text style={styles.value}>{score}</Text>
      </View>
      <View style={styles.titleGroup}>
        <Text style={styles.title}>Tap Tenz</Text>
        <Text style={styles.stage}>Stage {stage}</Text>
      </View>
      <View style={styles.stat}>
        <Text style={styles.label}>BEST</Text>
        <Text style={styles.value}>{highScore}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  stat: {
    alignItems: 'center',
    minWidth: 60,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#e2e8f0',
  },
  titleGroup: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#818cf8',
    letterSpacing: 1,
  },
  stage: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748b',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
