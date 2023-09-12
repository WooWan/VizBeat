import { useEffect, useState } from 'react';
import { Redis } from '@upstash/redis';

function useRedis() {
  const [redis, setRedis] = useState<Redis>(null!);

  useEffect(() => {
    const redis = new Redis({
      url: process.env.NEXT_PUBLIC_REDIS_URL as string,
      token: process.env.NEXT_PUBLIC_REDIS_TOKEN as string
    });
    setRedis(redis);
  }, []);

  return redis;
}

export default useRedis;
