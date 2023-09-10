import { AudioType } from '@/types/instrument';
import { Music } from '@prisma/client';

export type AudioData = {
  source: AudioBufferSourceNode;
  data: Uint8Array;
  gain: number;
};

export type AudioMap = {
  [key in AudioType]: {
    isMuted: boolean;
    volume: number;
  };
};

export type MusicState = {
  musicInfo?: Music;
  audio?: HTMLAudioElement;
  instruments: AudioMap;
  isLoaded: boolean;
  isAudioPlaying: boolean;
};

export type MusicAction = {
  api: {
    initAudio: (music: Music, url: string) => void;
    selectAudio: (music: Music) => void;
    clear: () => void;
    playAudio: () => void;
    stopAudio: () => void;
    muteAudio: (instrument: AudioType) => void;
    unMuteAudio: (instrument: AudioType) => void;
    updateVolume: (instrument: AudioType, volume: number) => void;
  };
};

export type TrackMutedState = {
  isMuted: boolean;
  setIsMuted: (isMusicPlay: boolean) => void;
};
