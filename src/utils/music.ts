import { AudioTracks } from '@/store/types';
import { AudioType } from '@/types/instrument';

export const calculateIsSolo = (audioType: AudioType, audioMap: AudioTracks) => {
  if (audioMap[audioType].isMuted) return false;

  return Object.entries(audioMap).every(([type, state]) => audioType === type || state.isMuted);
};
