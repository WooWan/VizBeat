import { useMutation, useQuery } from '@tanstack/react-query';
import { musicKey } from '@/hooks/queries/music/queryKeys';
import { fetchMusics, separateMusic } from '@/service/musics';

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
