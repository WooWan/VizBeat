import React, { useEffect, useState } from 'react';
import Multitrack from 'wavesurfer-multitrack';

type Props = {
  tracks: HTMLMediaElement[];
  containerRef: React.MutableRefObject<HTMLDivElement>;
};

const TRACK_HEIGHT = 100;

function useWavesurfer({ tracks, containerRef }: Props) {
  const [wavesurfer, setWavesurfer] = useState<Multitrack>(null!);

  useEffect(() => {
    const multitrack = Multitrack.create(
      [
        {
          id: 0,
          volume: 0.5,
          startPosition: 0,
          options: {
            media: tracks[0],
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 1,
          volume: 0.5,
          startPosition: 0,
          options: {
            media: tracks[1],
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 2,
          volume: 0.5,
          startPosition: 0,
          options: {
            media: tracks[2],
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 3,
          volume: 0.5,
          startPosition: 0,
          options: {
            media: tracks[3],
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 4,
          volume: 0.5,
          startPosition: 0,
          options: {
            media: tracks[4],
            height: 120,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        }
      ],
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
    });

    return () => {
      multitrack.destroy();
    };
  }, [tracks, containerRef]);

  return wavesurfer;
}

export default useWavesurfer;
