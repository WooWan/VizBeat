import { nextClient, redisClient, serverClient } from '@/service/apiClient';
import { MusicUpload, YoutubeMusic } from '@/types/music';
import { isUploadWithFile, isUploadWithYoutube } from '@/utils/typeGuards';
import { Music } from '@prisma/client';
import axios from 'axios';

export const fetchMusics = async (): Promise<Music[]> => {
  const response = await nextClient.get('/musics');
  return response.data;
};

export const fetchMusic = async (id: string): Promise<Music> => {
  const response = await nextClient.get(`/stage/${id}`);
  return response.data;
};

export async function fetchMusicAudioFile(url: string): Promise<ArrayBuffer> {
  const response = await axios.get(url, {
    responseType: 'arraybuffer'
  });
  return response.data;
}

export const fetchMusicFromYoutube = async ({
  keyword,
  limit = 20
}: {
  keyword: string;
  limit?: number;
}): Promise<YoutubeMusic[]> => {
  const redis = redisClient;
  const params = {
    query: keyword,
    limit: limit
  };
  const cachedData = await redis.get(JSON.stringify(params));
  if (cachedData) {
    return cachedData as YoutubeMusic[];
  } else {
    const response = await serverClient.get('/youtube-search', {
      params: params
    });
    const cache = await redis.set(JSON.stringify(params), response.data, { ex: 60 * 60 * 24 });
    if (cache !== 200) console.log('caching failed!!');
    return response.data;
  }
};

export const separateMusic = (music: MusicUpload) => {
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  };
  const formData = new FormData();
  formData.append('title', music.title);
  formData.append('artist', music.artist);
  formData.append('albumCover', music.albumCover);

  if (isUploadWithFile(music)) {
    formData.append('audio', music.audioFile);
  } else if (isUploadWithYoutube(music)) {
    formData.append('videoId', music.id);
  }

  return axios.post(`${process.env.NEXT_PUBLIC_API_SERVER_URL}/music-separation`, formData, config);
};

export const deleteMusic = (music: Music) => {
  return nextClient.delete(`/music/${music.id}`);
};
