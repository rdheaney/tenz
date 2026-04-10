import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  stage: number;
  score: number;
  onNextStage: () => void;
  onReset: () => void;
};

export default function WinOverlay({ stage, score, onNextStage, onReset }: Props) {
  const scale = useRef(new Animated.Value(0.4)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const glowOpacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 14,
        bounciness: 10,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(glowOpacity, { toValue: 0.7, duration: 900, useNativeDriver: true }),
        Animated.timing(glowOpacity, { toValue: 0.2, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  return (
    <View style={styles.backdrop}>
      <Animated.View style={[styles.glow4, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.glow3, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.glow2, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.glow1, { opacity: glowOpacity }]} />
      <Animated.View style={[styles.card, { transform: [{ scale }], opacity }]}>
        <Text style={styles.winText}>Stage {stage} Complete!</Text>
        <Text style={styles.winSubtext}>Score: {score}</Text>
        <Pressable style={styles.button} onPress={onNextStage}>
          <Text style={styles.buttonText}>Stage {stage + 1} →</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.resetButton]} onPress={onReset}>
          <Text style={styles.buttonText}>New Game</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.overlayBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow1: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.winGlow,
    opacity: 0.45,
  },
  glow2: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.winGlow,
    opacity: 0.25,
  },
  glow3: {
    position: 'absolute',
    width: 360,
    height: 360,
    borderRadius: 180,
    backgroundColor: colors.winGlow,
    opacity: 0.12,
  },
  glow4: {
    position: 'absolute',
    width: 480,
    height: 480,
    borderRadius: 240,
    backgroundColor: colors.winGlow,
    opacity: 0.05,
  },
  card: {
    alignItems: 'center',
    gap: 20,
  },
  winText: {
    color: colors.winTitle,
    fontSize: 32,
    fontFamily: fonts.extraBold,
    textAlign: 'center',
  },
  winSubtext: {
    color: colors.winSubtitle,
    fontSize: 18,
    fontFamily: fonts.semiBold,
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
  buttonText: {
    color: '#fff',
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
});
