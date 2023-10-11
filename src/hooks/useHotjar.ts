import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';

function useHotjar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      hotjar.initialize(Number(process.env.NEXT_PUBLIC_HOTJAR_ID), Number(process.env.NEXT_PUBLIC_HJSV));
    }
  }, []);
}

export default useHotjar;
