import axios from 'axios';
import { Redis } from '@upstash/redis';

export const nextClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    Accept: 'application/json'
  }
});

export const serverClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_SERVER_URL,
  headers: {
    'Content-Type': `application/json;charset=UTF-8`,
    Accept: 'application/json'
  }
});

export const redisClient = new Redis({
  url: process.env.NEXT_PUBLIC_REDIS_URL as string,
  token: process.env.NEXT_PUBLIC_REDIS_TOKEN as string
});
