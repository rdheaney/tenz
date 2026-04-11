import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '../theme';

type Props = {
  onClose: () => void;
};

const RULES = [
  {
    heading: 'Goal',
    body: 'Clear all numbers from the board to complete each stage.',
  },
  {
    heading: 'Making a match',
    body: 'Tap two numbers that add up to 10 — or two numbers that match — to clear them both.',
  },
  {
    heading: 'Valid pairs',
    body: '1+9  ·  2+8  ·  3+7  ·  4+6  ·  5+5',
  },
  {
    heading: 'Line of sight',
    body: 'The two tiles must be connected horizontally, vertically, or diagonally — with only empty cells between them. They can also wrap from the end of one row to the start of the next.',
  },
  {
    heading: 'Scoring',
    body: 'Closer matches score less points. Adjacent tiles score least; longer gaps score more.',
  },
  {
    heading: '+ Add Numbers',
    body: 'Stuck? Append a fresh set of numbers to the bottom of the board. The counter shows how many times you\'ve added.',
  },
  {
    heading: 'Hints',
    body: 'Tap Hint to highlight a valid pair. You start with 3 hints, and earn 1 more every 5 matches.',
  },
];

export default function HelpOverlay({ onClose }: Props) {
  const { height: screenHeight } = useWindowDimensions();
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.spring(translateY, { toValue: 0, speed: 18, bounciness: 6, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleClose = () => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 160, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 30, duration: 160, useNativeDriver: true }),
    ]).start(onClose);
  };

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
      <Animated.View style={[styles.card, { opacity, transform: [{ translateY }] }]}>
        <View style={styles.cardInner}>
          <Text style={styles.title}>How to Play</Text>
          <View style={{ maxHeight: screenHeight * 0.55 }}>
            <ScrollView showsVerticalScrollIndicator={false}>
              {RULES.map((rule) => (
                <View key={rule.heading} style={styles.rule}>
                  <Text style={styles.ruleHeading}>{rule.heading}</Text>
                  <Text style={styles.ruleBody}>{rule.body}</Text>
                </View>
              ))}
            </ScrollView>
            <LinearGradient
              colors={['rgba(10,37,64,0)', 'rgba(10,37,64,1)']}
              style={styles.scrollFade}
              pointerEvents="none"
            />
          </View>
          <Pressable style={styles.closeButton} onPress={handleClose}>
            <Text style={styles.closeText}>Got it</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
  },
  card: {
    width: '86%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    overflow: 'hidden',
  },
  cardInner: {
    padding: 24,
  },
  title: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.winTitle,
    marginBottom: 16,
    textAlign: 'center',
  },
  rule: {
    marginBottom: 16,
  },
  scrollFade: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 48,
  },
  ruleHeading: {
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.winGlow,
    letterSpacing: 0.5,
    marginBottom: 3,
    textTransform: 'uppercase',
  },
  ruleBody: {
    fontSize: 14,
    fontFamily: fonts.regular,
    color: colors.hudValue,
    lineHeight: 21,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: colors.buttonPrimary,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  closeText: {
    color: '#fff',
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
});
