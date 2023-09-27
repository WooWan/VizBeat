import { useMusicStore } from '@/store/music';
import React, { useEffect, useState } from 'react';
import Multitrack from 'wavesurfer-multitrack';

type Props = {
  containerRef: React.MutableRefObject<HTMLDivElement>;
  audios?: HTMLAudioElement[];
};

const TRACK_HEIGHT = 80;

function useWavesurfer({ containerRef, audios }: Props) {
  const api = useMusicStore((state) => state.api);
  const [wavesurfer, setWavesurfer] = useState<Multitrack>(null!);

  useEffect(() => {
    if (!audios) return;
    const multitrack = Multitrack.create(
      audios.map((audio, index) => ({
        id: index,
        volume: 0.5,
        startPosition: 0,
        options: {
          media: audio,
          height: TRACK_HEIGHT,
          waveColor: 'hsl(46, 87%, 49%)',
          progressColor: 'hsl(46, 87%, 20%)'
        }
      })),
      {
        container: containerRef.current, // required!
        minPxPerSec: 5, // zoom level
        rightButtonDrag: true, // drag tracks with the right mouse button
        cursorWidth: 2,
        cursorColor: '#D72F21', // 진행 바 색상
        trackBorderColor: 'black',
        envelopeOptions: {
          lineWidth: '0',
          dragPointSize: 0
        }
      }
    );

    multitrack.once('canplay', () => {
      setWavesurfer(multitrack);
      api.playAudio();
      multitrack.play();
    });

    return () => {
      multitrack.destroy();
    };
  }, [containerRef, audios]);

  return wavesurfer;
}

export default useWavesurfer;
