import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  score: number;
  moves: number;
  stage: number;
  highScore: number;
  onHelp: () => void;
};

export default function HUD({ score, moves, stage, highScore, onHelp }: Props) {
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
      <View style={styles.rightGroup}>
        <View style={styles.stat}>
          <Text style={styles.label}>BEST</Text>
          <Text style={styles.value}>{highScore}</Text>
        </View>
        <Pressable style={styles.helpButton} onPress={onHelp} hitSlop={8}>
          <Text style={styles.helpButtonText}>?</Text>
        </Pressable>
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
    fontFamily: fonts.bold,
    color: colors.hudLabel,
    letterSpacing: 1,
  },
  value: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: colors.hudValue,
  },
  rightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  helpButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  helpButtonText: {
    color: colors.badgeBorder,
    fontFamily: fonts.bold,
    fontSize: 13,
    lineHeight: 16,
  },
  titleGroup: {
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.extraBold,
    color: colors.hudTitle,
    letterSpacing: 1,
  },
  stage: {
    fontSize: 11,
    fontFamily: fonts.semiBold,
    color: colors.hudStage,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
