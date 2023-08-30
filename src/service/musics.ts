import { nextClient, spotifyClient } from '@/service/apiClient';
import { SpotifyMusic } from '@/types/spotify';
import { Music } from '@prisma/client';
import axios from 'axios';

export const fetchMusics = async (): Promise<Music[]> => {
  const response = await nextClient.get('/musics');
  return response.data;
};

export const fetchMusicFromSpotify = async (musicKeyword: string): Promise<SpotifyMusic> => {
  const res = await spotifyClient().get('/search', {
    params: {
      q: musicKeyword,
      type: 'track',
      limit: 4
    }
  });
  return res.data;
};

export const separateMusic = (formData: FormData) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  return axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/music-separation`, formData, config);
};
