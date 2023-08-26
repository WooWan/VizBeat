import { MusicAction, MusicState } from '@/store/types';
import { InstrumentType } from '@/types/instrument';
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { devtools } from 'zustand/middleware';

export const useMusicStore = create(
  devtools(
    immer<MusicState & MusicAction>((set, get) => {
      return {
        instruments: {
          bass: {
            isMuted: false,
            audio: null,
            volume: 0.5
          },
          guitar: {
            isMuted: false,
            audio: null,
            volume: 0.5
          },
          piano: {
            isMuted: false,
            audio: null,
            volume: 0.5
          },
          drum: {
            isMuted: false,
            audio: null,
            volume: 0.5
          },
          vocal: {
            isMuted: false,
            audio: null,
            volume: 0.5
          }
        },
        isLoaded: false,
        isPlaying: false,
        api: {
          muteAudio(key: InstrumentType) {
            set((state) => {
              state.instruments[key].isMuted = true;
            });
          },
          unMuteAudio(key: InstrumentType) {
            set((state) => {
              state.instruments[key].isMuted = false;
            });
          },
          updateVolume(key: InstrumentType, volume: number) {
            set((state) => {
              state.instruments[key].volume = volume;
            });
          },
          initializeAudio(url: string) {
            const audio = new Audio(url);
            set({
              isLoaded: true,
              audio: audio
            });
          },
          playMusic() {
            const audio = get().audio;
            audio?.play();
            set({ isPlaying: true });
          },
          stopMusic() {
            const audio = get().audio;
            audio?.pause();
            set({ isPlaying: false });
          }
        }
      };
    })
  )
);
