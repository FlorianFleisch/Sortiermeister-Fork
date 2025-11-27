export const checkIfSorted = (boxes: number[]): boolean => {
  for (let i = 1; i < boxes.length; i++) {
    if (boxes[i - 1] > boxes[i]) {
      return false;
    }
  }
  return true;
};

export const insertionSort = async (
  boxes: number[],
  speed: number,
  onUpdate: (boxes: number[]) => void,
  shouldStop: () => boolean
): Promise<void> => {
  const arr = [...boxes];
  
  for (let i = 1; i < arr.length; i++) {
    if (shouldStop()) return;
    
    let j = i;
    while (j > 0 && arr[j] < arr[j - 1]) {
      if (shouldStop()) return;
      
      [arr[j], arr[j - 1]] = [arr[j - 1], arr[j]];
      onUpdate([...arr]);
      await new Promise(resolve => setTimeout(resolve, speed));
      j--;
    }
  }
};
