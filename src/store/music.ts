import { MusicAction, MusicPlayState, MusicState } from '@/store/types';
import { createAudio, mockData } from '@/utils/music';
import { Music } from '@prisma/client';
import { create } from 'zustand';

export const useMusicPlayStore = create<MusicPlayState>((set) => ({
  isMusicPlay: false,
  setIsMusicPlay: (isMusicPlay: boolean) => set({ isMusicPlay })
}));

export const useMusicStore = create<MusicState & MusicAction>()((set, get) => {
  return {
    audio: {
      drums: mockData(),
      audio: mockData()
    },
    isLoaded: false,
    isPlaying: false,
    api: {
      selectMusic(music: Music) {
        set({ music });
      },
      async load(url: string) {
        set({
          isLoaded: true,
          audio: {
            audio: await createAudio(url),
            drums: await createAudio(url)
          }
        });
      },
      playMusic() {
        const audio = get().audio.audio;
        audio.source?.start(0);
        set({ isPlaying: true });
      },
      playInstruments() {
        const audio = get().audio;
        const files = Object.values(audio);
        files.forEach(({ source }) => source?.start(0));
        set({ isPlaying: true });
      },
      stop() {
        const audio = get().audio;
        const files = Object.values(audio);
        files.forEach(({ source }) => {
          source?.stop();
        });
      }
    }
  };
});
