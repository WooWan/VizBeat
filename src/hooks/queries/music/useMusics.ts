import { useMutation, useQuery } from '@tanstack/react-query';
import { musicKey } from '@/hooks/queries/music/queryKeys';
import { fetchMusicFromYoutube, fetchMusics, separateMusic } from '@/service/musics';

export const useMusics = () => {
  return useQuery({
    queryKey: musicKey.all,
    queryFn: fetchMusics
  });
};

export const useSeparateMusic = () => {
  return useMutation({
    mutationFn: separateMusic
  });
};

export const useMusicSearch = (keyword: string) => {
  return useQuery({
    queryKey: ['spotify-music', keyword],
    queryFn: () => fetchMusicFromYoutube({ keyword }),
    enabled: !!keyword,
    retry: 0
  });
};
