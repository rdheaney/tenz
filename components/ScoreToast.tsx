import React, { useEffect, useRef } from 'react';
import { Animated, Text, StyleSheet } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  value: number;
  id: number;
};

function getTier(value: number): { label: string; color: string } {
  if (value >= 8) return { label: `+${value} !!`, color: colors.toastHigh };
  if (value >= 5) return { label: `+${value} !`,  color: colors.toastMedium };
  return { label: `+${value}`, color: colors.toastNormal };
}

export default function ScoreToast({ value, id }: Props) {
  const translateY = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { label, color } = getTier(value);

  useEffect(() => {
    translateY.setValue(0);
    opacity.setValue(1);
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -80,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(opacity, {
          toValue: 0,
          duration: 600,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [id]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[styles.container, { transform: [{ translateY }], opacity }]}
    >
      <Text style={[styles.text, { color }]}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '45%',
    alignItems: 'center',
  },
  text: {
    fontSize: 32,
    fontFamily: fonts.extraBold,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
});
