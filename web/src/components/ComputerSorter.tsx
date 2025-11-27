'use client';

import { useEffect } from 'react';
import SortingBoxComponent from './SortingBox';
import type { SortingBox } from '@/types';
import { getColor } from '@/utils/colors';
import { insertionSort } from '@/utils/sorting';

interface ComputerSorterProps {
  boxes: SortingBox[];
  speed: number;
  gameEnded: boolean;
  onSorted: () => void;
}

export default function ComputerSorter({
  boxes,
  speed,
  gameEnded,
  onSorted,
}: ComputerSorterProps) {
  useEffect(() => {
    if (boxes.length === 0 || gameEnded) return;

    const boxValues = boxes.map(b => b.value);
    let stopped = false;

    const runSort = async () => {
      await insertionSort(
        boxValues,
        speed,
        (updatedValues) => {
          // Update würde hier über State erfolgen, aber da wir direkt DOM manipulieren...
          // In echter React-Welt würde man hier setState aufrufen
        },
        () => stopped || gameEnded
      );
      
      if (!stopped && !gameEnded) {
        onSorted();
      }
    };

    runSort();

    return () => {
      stopped = true;
    };
  }, [boxes, speed, gameEnded, onSorted]);

  return (
    <div className="sorting">
      <p>COMPUTER</p>
      <div className="computer">
        {boxes.length === 0 ? (
          <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: 10 }}>
            Computer sortiert...
          </p>
        ) : (
          boxes.map((box, index) => (
            <SortingBoxComponent key={`computer-${index}`} box={box} isComputer />
          ))
        )}
      </div>
    </div>
  );
}
