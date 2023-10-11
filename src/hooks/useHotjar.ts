import { useEffect } from 'react';

function useHotjar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      import('react-hotjar').then((hotjarLib) => {
        hotjarLib.hotjar.initialize(Number(process.env.NEXT_PUBLIC_HOTJAR_ID), Number(process.env.NEXT_PUBLIC_HJSV));
      });
    }
  }, []);
}

export default useHotjar;
