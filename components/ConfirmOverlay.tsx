import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

type Props = {
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmOverlay({ message, confirmLabel = 'Confirm', onConfirm, onCancel }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 180, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, speed: 20, bounciness: 5, useNativeDriver: true }),
    ]).start();
  }, []);

  const dismiss = (cb: () => void) => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 0, duration: 140, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 0.9, duration: 140, useNativeDriver: true }),
    ]).start(cb);
  };

  return (
    <View style={styles.backdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={() => dismiss(onCancel)} />
      <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
        <Text style={styles.message}>{message}</Text>
        <View style={styles.buttons}>
          <Pressable style={[styles.button, styles.cancelButton]} onPress={() => dismiss(onCancel)}>
            <Text style={styles.cancelText}>Cancel</Text>
          </Pressable>
          <Pressable style={[styles.button, styles.confirmButton]} onPress={() => dismiss(onConfirm)}>
            <Text style={styles.confirmText}>{confirmLabel}</Text>
          </Pressable>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 30,
  },
  card: {
    width: '78%',
    backgroundColor: colors.cardBg,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.badgeBorder,
    padding: 24,
    alignItems: 'center',
    gap: 20,
  },
  message: {
    color: colors.hudValue,
    fontFamily: fonts.semiBold,
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: colors.buttonReset,
  },
  cancelText: {
    color: colors.hudValue,
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
  confirmButton: {
    backgroundColor: '#7f1d1d',
    borderWidth: 1,
    borderColor: '#f87171',
  },
  confirmText: {
    color: '#fecaca',
    fontFamily: fonts.semiBold,
    fontSize: 14,
  },
});
