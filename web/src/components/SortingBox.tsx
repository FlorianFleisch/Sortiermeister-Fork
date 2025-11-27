'use client';

import type { SortingBox } from '@/types';

interface SortingBoxComponentProps {
  box: SortingBox;
  isActive?: boolean;
  onClick?: () => void;
  isComputer?: boolean;
}

export default function SortingBoxComponent({
  box,
  isActive = false,
  onClick,
  isComputer = false,
}: SortingBoxComponentProps) {
  return (
    <div
      className={`box ${isComputer ? 'cbox' : ''} ${isActive ? 'active' : ''}`}
      onClick={onClick}
      style={{
        background: box.background,
        color: box.textColor,
        borderRadius: '10px',
        cursor: isComputer ? 'default' : 'pointer',
      }}
    >
      <span>{box.value}</span>
    </div>
  );
}
