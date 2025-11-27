'use client';

import type { Difficulty } from '@/types';

interface GameResultModalProps {
  won: boolean;
  onPlayAgain: () => void;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onShowLeaderboard: () => void;
}

const DIFFICULTY_OPTIONS: Difficulty[] = ['Easy', 'Medium', 'Hard', 'SuperHard'];

export default function GameResultModal({
  won,
  onPlayAgain,
  onChangeDifficulty,
  onShowLeaderboard,
}: GameResultModalProps) {
  return (
    <>
      <div className="overlay" id="overlay1"></div>
      <div className="containers" id="popUpContainer" style={{ display: 'block' }}>
        <div className={`popups ${won ? 'win-popup' : 'lose-popup'}`}>
          {won ? 'GEWONNEN' : 'VERLOREN'}
        </div>

        <div className="replay-difficulty-buttons">
          <p style={{ gridColumn: '1 / -1', margin: 0, padding: 0, marginBottom: 20 }}>
            Nächste Runde?
          </p>
          {DIFFICULTY_OPTIONS.map((diff) => (
            <button
              key={diff}
              className="replay-difficulty-btn"
              data-difficulty={diff}
              onClick={() => onChangeDifficulty(diff)}
            >
              {diff.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
            </button>
          ))}
        </div>

        <div className="action-buttons">
          <button id="playAgainSameDifficultyButton" onClick={onPlayAgain}>
            NOCHMAL SPIELEN
          </button>
          <button id="showLeaderboardButton" onClick={onShowLeaderboard}>
            RANGLISTE
          </button>
        </div>
      </div>
    </>
  );
}
