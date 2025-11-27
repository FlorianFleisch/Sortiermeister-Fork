'use client';

import { useState, useEffect, useCallback } from 'react';
import LoginForm from '@/components/LoginForm';
import PlayerInfo from '@/components/PlayerInfo';
import GameResultModal from '@/components/GameResultModal';
import Leaderboard from '@/components/Leaderboard';
import SortingBoxComponent from '@/components/SortingBox';
import { playerApi } from '@/services/api';
import { useGameState } from '@/hooks/useGameState';
import { getColor } from '@/utils/colors';
import { checkIfSorted, insertionSort } from '@/utils/sorting';
import type { Player, Difficulty, Algorithm, SortingBox } from '@/types';

export default function GamePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [algorithm, setAlgorithm] = useState<Algorithm>('InsertionSort');
  const [speed, setSpeed] = useState(1000);
  
  const [showResultModal, setShowResultModal] = useState(false);
  const [playerWon, setPlayerWon] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  
  const [playerBoxes, setPlayerBoxes] = useState<SortingBox[]>([]);
  const [computerBoxes, setComputerBoxes] = useState<SortingBox[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  const gameState = useGameState();

  const handleLogin = async (
    name: string,
    algo: Algorithm,
    diff: Difficulty,
    gameSpeed: number
  ) => {
    try {
      const player = await playerApi.login(name, algo, diff);
      setCurrentPlayer(player);
      setAlgorithm(algo);
      setDifficulty(diff);
      setSpeed(gameSpeed);
      setIsLoggedIn(true);
      startNewGame();
    } catch (error) {
      console.error('Login error:', error);
      alert('Login fehlgeschlagen. Bitte versuche es erneut.');
    }
  };

  const startNewGame = () => {
    gameState.initializeGame();
    setPlayerBoxes(gameState.playerBoxes);
    setComputerBoxes(gameState.computerBoxes);
    setGameStartTime(Date.now());
    setGameEnded(false);
    setShowResultModal(false);
    setActiveIndex(null);
  };

  useEffect(() => {
    if (gameState.computerBoxes.length > 0 && !gameEnded) {
      runComputerSort();
    }
  }, [gameState.computerBoxes]);

  const runComputerSort = async () => {
    const values = gameState.computerBoxes.map(b => b.value);
    let stopped = false;

    await insertionSort(
      values,
      speed,
      (updatedValues) => {
        const updated = updatedValues.map(val => {
          const color = getColor(val);
          return { value: val, background: color.bg, textColor: color.text };
        });
        setComputerBoxes(updated);
      },
      () => stopped || gameEnded
    );

    if (!stopped && !gameEnded) {
      handleComputerWin();
    }
  };

  const handleBoxClick = (index: number) => {
    if (gameEnded) return;

    if (activeIndex === null) {
      setActiveIndex(index);
    } else if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      const newBoxes = [...playerBoxes];
      [newBoxes[activeIndex], newBoxes[index]] = [newBoxes[index], newBoxes[activeIndex]];
      setPlayerBoxes(newBoxes);
      setActiveIndex(null);

      const values = newBoxes.map(b => b.value);
      if (checkIfSorted(values)) {
        handlePlayerWin();
      }
    }
  };

  const handlePlayerWin = async () => {
    setGameEnded(true);
    setPlayerWon(true);
    setShowResultModal(true);

    const timeInMs = Date.now() - (gameStartTime || Date.now());
    try {
      await playerApi.saveResult({ timeInMs, won: true });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const handleComputerWin = async () => {
    setGameEnded(true);
    setPlayerWon(false);
    setShowResultModal(true);

    const timeInMs = Date.now() - (gameStartTime || Date.now());
    try {
      await playerApi.saveResult({ timeInMs, won: false });
    } catch (error) {
      console.error('Error saving result:', error);
    }
  };

  const handlePlayAgain = () => {
    setShowResultModal(false);
    startNewGame();
  };

  const handleChangeDifficulty = (newDiff: Difficulty) => {
    const difficultySpeed: Record<Difficulty, number> = {
      Easy: 2000,
      Medium: 1000,
      Hard: 450,
      SuperHard: 250,
    };
    setDifficulty(newDiff);
    setSpeed(difficultySpeed[newDiff]);
    setShowResultModal(false);
    startNewGame();
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPlayer(null);
    gameState.resetGame();
  };

  const handleShowLeaderboardFromModal = () => {
    setShowResultModal(false);
    setShowLeaderboard(true);
  };

  if (!isLoggedIn) {
    return (
      <>
        <link rel="stylesheet" href="/styles/style.css" />
        <LoginForm onLogin={handleLogin} />
      </>
    );
  }

  return (
    <>
      <link rel="stylesheet" href="/styles/style.css" />

      <PlayerInfo
        playerName={currentPlayer?.name || ''}
        onLogout={handleLogout}
        onShowLeaderboard={() => setShowLeaderboard(true)}
      />

      <div className="sorting-container" id="gameContainer" style={{ display: 'block' }}>
        <div className="sorting">
          <p>COMPUTER</p>
          <div className="computer">
            {computerBoxes.map((box, index) => (
              <SortingBoxComponent key={`computer-${index}`} box={box} isComputer />
            ))}
          </div>

          <p style={{ marginTop: 20 }}>SPIELER</p>
          <div className="human">
            {playerBoxes.map((box, index) => (
              <SortingBoxComponent
                key={`player-${index}`}
                box={box}
                isActive={activeIndex === index}
                onClick={() => handleBoxClick(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {showResultModal && (
        <GameResultModal
          won={playerWon}
          onPlayAgain={handlePlayAgain}
          onChangeDifficulty={handleChangeDifficulty}
          onShowLeaderboard={handleShowLeaderboardFromModal}
        />
      )}

      <Leaderboard isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </>
  );
}
