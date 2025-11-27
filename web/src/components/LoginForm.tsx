'use client';

import { useState } from 'react';
import type { Difficulty, Algorithm } from '@/types';

interface LoginFormProps {
  onLogin: (name: string, algorithm: Algorithm, difficulty: Difficulty, speed: number) => void;
}

const DIFFICULTY_CONFIG = {
  Easy: { speed: 2000, gradient: 'linear-gradient(135deg, #00ff88 0%, #00cc6a 100%)' },
  Medium: { speed: 1000, gradient: 'linear-gradient(135deg, #ffdd00 0%, #ffaa00 100%)' },
  Hard: { speed: 450, gradient: 'linear-gradient(135deg, #ff8800 0%, #ff5500 100%)' },
  SuperHard: { speed: 250, gradient: 'linear-gradient(135deg, #ff0055 0%, #cc0033 100%)' },
};

export default function LoginForm({ onLogin }: LoginFormProps) {
  const [name, setName] = useState('');
  const [algorithm, setAlgorithm] = useState<Algorithm>('InsertionSort');
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && difficulty) {
      onLogin(name.trim(), algorithm, difficulty, DIFFICULTY_CONFIG[difficulty].speed);
    }
  };

  const canSubmit = name.trim() && difficulty;

  return (
    <>
      <div className="overlay" id="loginOverlay"></div>
      <div className="containers" id="loginContainer" style={{ display: 'block' }}>
        <div className="login-header">
          <h1>SORTIERMEISTER</h1>
          <p>Melde dich an und fordere die Herausforderung an!</p>
        </div>

        <form id="loginForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="playerName">Dein Name</label>
            <input
              type="text"
              id="playerName"
              placeholder="Gib deinen Namen ein..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="algorithmSelect">Sortieralgorithmus</label>
            <select
              id="algorithmSelect"
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as Algorithm)}
            >
              <option value="InsertionSort">Insertion Sort</option>
              <option value="BubbleSort">Bubble Sort</option>
              <option value="SelectionSort">Selection Sort</option>
            </select>
          </div>

          <div className="form-group">
            <label>Wähle deinen Schwierigkeitsgrad</label>
            <div className="difficulty-buttons">
              {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => (
                <button
                  key={diff}
                  type="button"
                  className="difficulty-btn"
                  data-difficulty={diff}
                  data-speed={DIFFICULTY_CONFIG[diff].speed}
                  style={{
                    border: difficulty === diff ? '5px solid white' : '3px solid transparent',
                  }}
                  onClick={() => setDifficulty(diff)}
                >
                  {diff.replace(/([A-Z])/g, ' $1').trim().toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            id="startButton"
            disabled={!canSubmit}
            style={{ cursor: canSubmit ? 'pointer' : 'not-allowed' }}
          >
            SPIEL STARTEN
          </button>
        </form>
      </div>
    </>
  );
}
