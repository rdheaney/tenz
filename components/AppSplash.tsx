import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View, Text, Dimensions } from 'react-native';
import LogoSVG from './LogoSVG';
import { fonts, colors } from '../theme';

const { width } = Dimensions.get('window');
const LOGO_W = width * 0.75;
const LOGO_H = LOGO_W * (520 / 400);

type Props = {
  onDone: () => void;
};

export default function AppSplash({ onDone }: Props) {
  const scale = useRef(new Animated.Value(0.72)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Fade + spring in
    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        speed: 12,
        bounciness: 6,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Hold then fade out
    const timer = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }).start(() => onDone());
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <LogoSVG width={LOGO_W} height={LOGO_H} />
      </Animated.View>
      <Animated.View style={[styles.byline, { opacity }]}>
        <Text style={styles.bylineText}>by Chasing Moonrabbits</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#071a2e',
  },
  byline: {
    position: 'absolute',
    bottom: 48,
  },
  bylineText: {
    color: colors.textMuted,
    fontFamily: fonts.regular,
    fontSize: 13,
    letterSpacing: 1,
  },
});
