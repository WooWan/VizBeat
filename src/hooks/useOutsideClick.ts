import React, { useEffect, useLayoutEffect, useRef } from 'react';

type Callback = (event: MouseEvent | TouchEvent) => void;

export function useClickAway<T extends HTMLElement>(cb: Callback): React.RefObject<T> {
  const ref = useRef<T>(null);
  const refCb = useRef<Callback>(cb);

  useLayoutEffect(() => {
    refCb.current = cb;
  });

  useEffect(() => {
    const handler = (e: MouseEvent | TouchEvent) => {
      const element = ref.current;
      if (element && !element.contains(e.target as Node)) {
        refCb.current(e);
      }
    };

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, []);

  return ref;
}
