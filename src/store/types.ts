import { Music } from '@prisma/client';
import { record } from 'zod';

export type AudioData = {
  source: AudioBufferSourceNode;
  data: Uint8Array;
  gain: number;
};

export type MusicState = {
  music?: Music;
  audio: {
    audio: AudioData;
    drums: AudioData;
  };
  isLoaded: boolean;
  isPlaying: boolean;
};

export type MusicAction = {
  api: {
    selectMusic: (music: Music) => void;
    load: (url: string) => Promise<void>;
    playMusic: () => void;
    stop: () => void;
    playInstruments: () => void;
  };
};

export type MusicPlayState = {
  isMusicPlay: boolean;
  setIsMusicPlay: (isMusicPlay: boolean) => void;
};

export type TrackMutedState = {
  isMuted: boolean;
  setIsMuted: (isMusicPlay: boolean) => void;
};

export type Track = 'vocal' | 'guitar' | 'drum' | 'piano' | 'bass';
