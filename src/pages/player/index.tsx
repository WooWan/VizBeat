import React, { ChangeEvent, useEffect, useState } from 'react';
import Multitrack from 'wavesurfer-multitrack';

type Props = {};

export default function index({}: Props) {
  const [ws, setWs] = useState<any>(null);
  const [volumes, setVolumes] = useState<Array<Number>>([0.5, 0.5, 0.5, 0.5, 0.5]);

  useEffect(() => {
    const multitrack = Multitrack.create(
      [
        {
          id: 0,
          url: '/music/mp3/vocal.mp3',
          volume: 0.5,
          //@ts-ignore
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 1,
          url: '/music/mp3/drum.mp3',
          volume: 0.5,
          //@ts-ignore
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 2,
          url: '/music/mp3/guitar.mp3',
          volume: 0.5,
          //@ts-ignore
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 3,
          url: '/music/mp3/bass.mp3',
          volume: 0.5,
          //@ts-ignore
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 4,
          url: '/music/mp3/piano.mp3',
          volume: 0.5,
          //@ts-ignore
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        }
      ],
      {
        container: document.getElementById('playlist'), // required!
        minPxPerSec: 1, // zoom level
        rightButtonDrag: true, // drag tracks with the right mouse button
        cursorWidth: 2,
        cursorColor: '#D72F21', // 진행 바 색상
        trackBorderColor: 'black',
        envelopeOptions: {
          lineWidth: 0,
          dragPointSize: 0
        }
      }
    );
    setWs(multitrack);

    // console.log(multitrack.envelopes.at[0]);
    return () => {
      multitrack.destroy();
    };
  }, []);

  const handleClick = () => {
    console.log(ws);
    console.log(ws.isPlaying());
    ws.isPlaying() ? ws.pause() : ws.play();
  };

  const handleClick1 = () => {
    for (let i = 0; i < ws.envelopes.length; i++) {
      ws.setTrackVolume(i, 0);
    }
  };

  const handleChange = (track: number, event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.valueAsNumber / 100;
    let newVolumes = [...volumes];
    newVolumes[track] = v;
    setVolumes(newVolumes);
    ws.setTrackVolume(track, v);
  };

  const muteBtn = (track: number, event: React.MouseEvent<HTMLElement>) => {
    console.log(volumes[track]);
    if (ws.envelopes[track].volume) {
      console.log('mute');
      ws.setTrackVolume(track, 0);
    } else {
      console.log('unmute');
      ws.setTrackVolume(track, volumes[track]);
    }
  };

  const soloBtn = (track: number, event: React.MouseEvent<HTMLElement>) => {
    console.log('click');
    console.log(ws.envelopes.length);
    for (let i = 0; i < ws.envelopes.length; i++) {
      if (i != track) {
        ws.setTrackVolume(i, 0);
      }
    }
  };

  const tracks = [0, 1, 2, 3, 4];
  return (
    <>
      <div className="flex gap-x-2">
        <label className="block">
          volume: <input type="range" min="0" max="100" />
        </label>
        <button className="rounded bg-blue-500 px-3" onClick={handleClick}>
          pause
        </button>
        <button className="rounded bg-blue-500 px-3" onClick={handleClick1}>
          pause
        </button>
      </div>
      <section className="flex">
        <ul className="flex h-full min-h-[668px] flex-col justify-evenly">
          {tracks.map((track) => {
            return (
              <div className="flex flex-col items-center justify-center" key={track}>
                <label className="block">
                  volume: <input onChange={(e) => handleChange(track, e)} type="range" min="0" max="100" />
                </label>
                <div className="flex gap-x-2">
                  <button className="rounded bg-blue-500 px-3" onClick={(e) => muteBtn(track, e)}>
                    mute
                  </button>
                  <button className="rounded bg-blue-500 px-3" onClick={(e) => soloBtn(track, e)}>
                    solo
                  </button>
                </div>
              </div>
            );
          })}
        </ul>
        <div className="w-full" id="playlist"></div>
      </section>
    </>
  );
}
