import { useEffect, useRef, useState } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  SpaceGrotesk_400Regular,
  SpaceGrotesk_500Medium,
  SpaceGrotesk_600SemiBold,
  SpaceGrotesk_700Bold,
} from '@expo-google-fonts/space-grotesk';
import GameBoard from './components/GameBoard';

SplashScreen.preventAutoHideAsync();

const HOLD_MS = 2500;
const FADE_MS = 400;

export default function App() {
  const [fontsLoaded] = useFonts({
    SpaceGrotesk_400Regular,
    SpaceGrotesk_500Medium,
    SpaceGrotesk_600SemiBold,
    SpaceGrotesk_700Bold,
  });
  const [splashDone, setSplashDone] = useState(false);
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (!fontsLoaded) return;
    SplashScreen.hideAsync();
    const hold = setTimeout(() => {
      Animated.timing(opacity, {
        toValue: 0,
        duration: FADE_MS,
        useNativeDriver: true,
      }).start(() => setSplashDone(true));
    }, HOLD_MS);
    return () => clearTimeout(hold);
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <>
      <StatusBar style="light" />
      {!splashDone && (
        <Animated.View style={[StyleSheet.absoluteFill, { opacity, backgroundColor: '#071a2e', zIndex: 10 }]}>
          <Image
            source={require('./assets/splash.png')}
            style={{ flex: 1, width: '100%', height: '100%' }}
            resizeMode="contain"
          />
        </Animated.View>
      )}
      <GameBoard />
    </>
  );
}
