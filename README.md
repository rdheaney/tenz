# Tap Tenz

A React Native number-matching puzzle game inspired by Easybrain's Number Match. Built with Expo.

## How to Play

- The board starts with 18 numbers (1–9 twice, shuffled).
- Tap two numbers to match them if:
  - They are equal **or** sum to 10
  - The path between them (horizontal, vertical, diagonal, or row-wrap) contains only cleared cells
- Matched cells are cleared. Full rows of cleared cells collapse.
- Clear the entire board to advance to the next stage.
- If you run out of moves, tap **+ Add Numbers** to append a copy of all remaining numbers to the board.
- Use **Hint** to highlight a valid move (or signal that you need to add numbers). Hints are limited — earn more by making matches.

## Scoring

- **+2** per match
- **+1** per cleared cell between the two matched cells (distance bonus)

## Hints

- Start each game with **3 hints**
- Earn **+1 hint** every 5 successful matches
- Hints carry over between stages; reset on New Game

## Project Structure

```
tenz/
├── App.tsx                  # Entry point
├── components/
│   ├── GameBoard.tsx        # Main game component (useReducer, all state)
│   ├── Cell.tsx             # Single tile (memo'd)
│   └── HUD.tsx              # Score / stage / high score bar
├── types/
│   └── game.ts              # TypeScript types
└── utils/
    ├── gameLogic.ts         # Pure game logic (matching, scoring, board ops)
    └── useHighScore.ts      # AsyncStorage high score persistence
```

## Running Locally

```bash
cd tenz
npx expo start --tunnel   # use --tunnel if local network is blocked
```

Scan the QR code with Expo Go on your device.

## Todo

- [ ] Animations (cell clear fade, select pulse)
- [ ] UI polish / aesthetics pass
- [ ] EAS Build + App Store submission
