import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { musicKey } from '@/hooks/queries/music/queryKeys';
import { fetchMusicFromYoutube, fetchMusics, separateMusic, fetchMusic } from '@/service/musics';
import { fetchAndStoreMusic } from '@/utils/fetchMusicIdb';
import { useToast } from '@/components/ui/use-toast';

export const useMusics = () => {
  return useQuery({
    queryKey: musicKey.all,
    queryFn: fetchMusics
  });
};

export const useMusic = (id: string) => {
  return useQuery({
    queryKey: musicKey.detail(id),
    queryFn: () => fetchMusic(id),
    enabled: !!id
  });
};

export const useSeparateMusic = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: separateMusic,
    onSuccess: () => {
      toast({
        variant: 'success',
        description: 'Your music is now live 🎸'
      });
      queryClient.invalidateQueries(musicKey.all);
    },
    onError: () => {
      toast({
        variant: 'destructive',
        description: 'Failed to upload music'
      });
    }
  });
};

export const useMusicSearch = (keyword: string) => {
  return useQuery({
    queryKey: ['spotify-music', keyword],
    queryFn: () => fetchMusicFromYoutube({ keyword }),
    enabled: !!keyword,
    suspense: true,
    retry: 0
  });
};

export const useAudioTracks = (id: string) => {
  const { data: music } = useMusic(id);

  return useQuery({
    queryKey: ['audio-tracks', id],
    queryFn: async () =>
      await Promise.all([
        fetchAndStoreMusic(music?.vocalUrl),
        fetchAndStoreMusic(music?.drumUrl),
        fetchAndStoreMusic(music?.guitarUrl),
        fetchAndStoreMusic(music?.bassUrl),
        fetchAndStoreMusic(music?.pianoUrl),
        fetchAndStoreMusic(music?.otherUrl)
      ]),
    enabled: !!music
  });
};
