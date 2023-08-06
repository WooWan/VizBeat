import { Music } from '@prisma/client';

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
