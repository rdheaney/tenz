import { StatusBar } from 'expo-status-bar';
import GameBoard from './components/GameBoard';

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <GameBoard />
    </>
  );
}
