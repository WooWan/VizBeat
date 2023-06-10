import { create } from 'zustand';

type MusicPlayState = {
  isMusicPlay: boolean;
  setIsMusicPlay: (isMusicPlay: boolean) => void;
};

export const useMusicPlayStore = create<MusicPlayState>((set) => ({
  isMusicPlay: false,
  setIsMusicPlay: (isMusicPlay: boolean) => set({ isMusicPlay })
}));
