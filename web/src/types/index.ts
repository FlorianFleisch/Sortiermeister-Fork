export type Difficulty = 'Easy' | 'Medium' | 'Hard' | 'SuperHard';

export type Algorithm = 'InsertionSort' | 'BubbleSort' | 'SelectionSort';

export interface Player {
  playerId: number;
  name: string;
  isNewPlayer: boolean;
}

export interface GameResult {
  timeInMs: number;
  won: boolean;
}

export interface LeaderboardEntry {
  rank: number;
  playerName: string;
  bestTimeInMs: number;
  algorithm: Algorithm;
  difficulty: Difficulty;
  achievedAt: string;
}

export interface GameState {
  currentPlayer: Player | null;
  difficulty: Difficulty | null;
  algorithm: Algorithm;
  speed: number;
  gameStartTime: number | null;
  gameEnded: boolean;
}

export interface SortingBox {
  value: number;
  background: string;
  textColor: string;
}

export interface ColorConfig {
  bg: string;
  text: string;
}
