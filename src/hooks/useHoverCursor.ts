import { useState, useEffect } from 'react';

export function useHoverCursor() {
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    document.body.style.cursor = isHovered ? 'pointer' : 'auto';
  }, [isHovered]);

  return [isHovered, setIsHovered] as const;
}
