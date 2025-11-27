'use client';

import { useState, useEffect, useCallback } from 'react';
import type { SortingBox } from '@/types';
import { generateUniqueNumbers, getColor, shuffleArray } from '@/utils/colors';

export const useGameState = () => {
  const [computerBoxes, setComputerBoxes] = useState<SortingBox[]>([]);
  const [playerBoxes, setPlayerBoxes] = useState<SortingBox[]>([]);
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [gameEnded, setGameEnded] = useState(false);

  const initializeGame = useCallback(() => {
    const numbers = generateUniqueNumbers(10);
    const boxes = numbers.map((num) => {
      const color = getColor(num);
      return {
        value: num,
        background: color.bg,
        textColor: color.text,
      };
    });

    setComputerBoxes([...boxes]);
    setPlayerBoxes(shuffleArray([...boxes]));
    setGameStartTime(Date.now());
    setGameEnded(false);
  }, []);

  const resetGame = useCallback(() => {
    setComputerBoxes([]);
    setPlayerBoxes([]);
    setGameStartTime(null);
    setGameEnded(false);
  }, []);

  return {
    computerBoxes,
    setComputerBoxes,
    playerBoxes,
    setPlayerBoxes,
    gameStartTime,
    gameEnded,
    setGameEnded,
    initializeGame,
    resetGame,
  };
};
