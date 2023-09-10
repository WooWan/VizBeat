import { Music } from '@prisma/client';
import { MusicAction, MusicState } from '@/store/types';
import { AudioType } from '@/types/instrument';
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
            volume: 0.5
          },
          guitar: {
            isMuted: false,
            volume: 0.5
          },
          piano: {
            isMuted: false,
            volume: 0.5
          },
          drum: {
            isMuted: false,
            volume: 0.5
          },
          vocal: {
            isMuted: false,
            volume: 0.5
          },
          other: {
            isMuted: false,
            volume: 0.5
          }
        },
        isLoaded: false,
        isAudioPlaying: false,
        api: {
          async initAudio(music: Music, url: string) {
            const audio = new Audio(url);
            set({
              isLoaded: true,
              audio: audio,
              musicInfo: music
            });
          },
          muteAudio(key: AudioType) {
            set((state) => {
              state.instruments[key].isMuted = true;
            });
          },
          unMuteAudio(key: AudioType) {
            set((state) => {
              state.instruments[key].isMuted = false;
            });
          },
          updateVolume(key: AudioType, volume: number) {
            set((state) => {
              state.instruments[key].volume = volume;
            });
          },
          playAudio() {
            const audio = get().audio;
            audio?.play();
            set({ isAudioPlaying: true });
          },
          selectAudio(updatedMusic: Music) {
            const { musicInfo: music, api } = get();
            if (music?.id === updatedMusic.id) {
              api.stopAudio();
            } else {
              api.clear();
              api.initAudio(updatedMusic, updatedMusic.musicUrl);
              api.playAudio();
            }
          },
          stopAudio() {
            const audio = get().audio;
            audio?.pause();
            set({ isAudioPlaying: false });
          },
          clear() {
            const { audio } = get();
            audio?.pause();
            set({
              musicInfo: undefined,
              audio: undefined,
              isLoaded: false,
              isAudioPlaying: false
            });
          }
        }
      };
    })
  )
);
