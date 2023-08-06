import { AudioData } from '@/store/types';

export const mockData = (): AudioData => ({ gain: 1, data: new Uint8Array(), source: {} as AudioBufferSourceNode });

export const createAudio = async (url: string): Promise<AudioData> => {
  const res = await fetch(url);
  const buffer = await res.arrayBuffer();
  const context = new window.AudioContext();
  const analyser = context.createAnalyser();
  analyser.fftSize = 2048;
  const data = new Uint8Array(analyser.frequencyBinCount);

  const source = context.createBufferSource();
  // decode digital signal to analog signal
  source.buffer = await new Promise((res) => context.decodeAudioData(buffer, res));
  source.loop = true;

  const gainNode = context.createGain();
  gainNode.gain.value = 1;

  source.connect(analyser);
  analyser.connect(gainNode);
  gainNode.connect(context.destination);

  return {
    source,
    data,
    gain: 1
  };
};
