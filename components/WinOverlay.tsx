import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import Svg, { Defs, RadialGradient, Stop, Ellipse } from 'react-native-svg';
import { colors, fonts } from '../theme';

const AnimatedSvg = Animated.createAnimatedComponent(Svg);

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
      <AnimatedSvg
        style={[StyleSheet.absoluteFill, { opacity: glowOpacity }]}
        width="100%"
        height="100%"
        viewBox="0 0 400 800"
        preserveAspectRatio="xMidYMid meet"
      >
        <Defs>
          <RadialGradient id="glow" cx="50%" cy="50%" r="50%">
            <Stop offset="0%" stopColor={colors.winGlow} stopOpacity="0.8" />
            <Stop offset="35%" stopColor={colors.winGlow} stopOpacity="0.35" />
            <Stop offset="65%" stopColor={colors.winGlow} stopOpacity="0.1" />
            <Stop offset="100%" stopColor={colors.winGlow} stopOpacity="0" />
          </RadialGradient>
        </Defs>
        <Ellipse cx="200" cy="400" rx="260" ry="260" fill="url(#glow)" />
      </AnimatedSvg>
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
