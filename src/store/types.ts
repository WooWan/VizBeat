import { InstrumentType } from '@/types/instrument';
import { Music } from '@prisma/client';

export type AudioData = {
  source: AudioBufferSourceNode;
  data: Uint8Array;
  gain: number;
};

export type MusicState = {
  music?: Music;
  audio?: HTMLAudioElement;
  instruments: {
    [key in InstrumentType]: {
      isMuted: boolean;
      volume: number;
      audio: HTMLAudioElement | null;
    };
  };
  isLoaded: boolean;
  isPlaying: boolean;
};

export type MusicAction = {
  api: {
    initializeAudio: (url: string) => void;
    playMusic: () => void;
    stopMusic: () => void;
    muteAudio: (instrument: InstrumentType) => void;
    unMuteAudio: (instrument: InstrumentType) => void;
    updateVolume: (instrument: InstrumentType, volume: number) => void;
  };
};

export type TrackMutedState = {
  isMuted: boolean;
  setIsMuted: (isMusicPlay: boolean) => void;
};
