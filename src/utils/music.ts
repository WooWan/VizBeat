import { AudioData, Instruments } from '@/store/types';
import { InstrumentData, InstrumentType } from '@/types/instrument';

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

export const calculateIsSolo = (currentType: InstrumentType, instrumentState: Instruments) => {
  if (instrumentState[currentType].isMuted) return false;

  return Object.entries(instrumentState).every(([type, state]) => type === currentType || state.isMuted);
};
