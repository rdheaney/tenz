import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HIGH_SCORE_KEY = 'tenz_high_score';

export function useHighScore() {
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    AsyncStorage.getItem(HIGH_SCORE_KEY).then(val => {
      if (val) setHighScore(parseInt(val, 10));
    });
  }, []);

  const updateHighScore = async (score: number) => {
    if (score > highScore) {
      setHighScore(score);
      await AsyncStorage.setItem(HIGH_SCORE_KEY, String(score));
    }
  };

  return { highScore, updateHighScore };
}
