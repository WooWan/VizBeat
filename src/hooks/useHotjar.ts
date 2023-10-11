import { envSchema } from '@/constants/env';
import { useEffect } from 'react';
import { hotjar } from 'react-hotjar';

function useHotjar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') {
      hotjar.initialize(envSchema.HOTJAR_ID, envSchema.HJSV);
    }
  }, []);
}

export default useHotjar;
