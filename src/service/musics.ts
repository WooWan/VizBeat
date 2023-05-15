import { httpClient } from '@/service/httpClient';
import { Music } from '@prisma/client';

export const fetchMusics = async (): Promise<Music[]> => {
  const response = await httpClient.get('/musics');
  return response.data;
};
