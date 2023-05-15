import { useQuery } from '@tanstack/react-query';
import { musicKey } from '@/hooks/queries/music/queryKeys';
import { fetchMusics } from '@/service/musics';

export const useMusics = () => {
  return useQuery({
    queryKey: musicKey.all,
    queryFn: fetchMusics
  });
};
