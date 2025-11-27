'use client';

import { useState } from 'react';
import SortingBoxComponent from './SortingBox';
import type { SortingBox } from '@/types';
import { getColor } from '@/utils/colors';
import { checkIfSorted } from '@/utils/sorting';

interface PlayerSorterProps {
  boxes: SortingBox[];
  gameEnded: boolean;
  onWin: () => void;
}

export default function PlayerSorter({ boxes, gameEnded, onWin }: PlayerSorterProps) {
  const [playerBoxes, setPlayerBoxes] = useState<SortingBox[]>(boxes);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleBoxClick = (index: number) => {
    if (gameEnded) return;

    if (activeIndex === null) {
      setActiveIndex(index);
    } else if (activeIndex === index) {
      setActiveIndex(null);
    } else {
      // Swap
      const newBoxes = [...playerBoxes];
      [newBoxes[activeIndex], newBoxes[index]] = [newBoxes[index], newBoxes[activeIndex]];
      setPlayerBoxes(newBoxes);
      setActiveIndex(null);

      // Check win
      const values = newBoxes.map(b => b.value);
      if (checkIfSorted(values)) {
        onWin();
      }
    }
  };

  return (
    <div className="sorting">
      <p style={{ marginTop: 20 }}>SPIELER</p>
      <div className="human">
        {playerBoxes.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: 10 }}>
            Klicke auf die Zahlen zum Tauschen!
          </p>
        ) : (
          playerBoxes.map((box, index) => (
            <SortingBoxComponent
              key={`player-${index}`}
              box={box}
              isActive={activeIndex === index}
              onClick={() => handleBoxClick(index)}
            />
          ))
        )}
      </div>
    </div>
  );
}
