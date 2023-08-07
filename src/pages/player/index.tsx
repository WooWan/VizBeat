import React, { ChangeEvent, useEffect, useState } from 'react';
import EventEmitter from 'events';
import Multitrack from 'wavesurfer-multitrack';

type Props = {};

export default function index({}: Props) {
  //   const [ee] = useState(new EventEmitter());

  //   useEffect(() => {
  //     const container = document.getElementById('playlist');
  //     const playlist = WaveformPlaylist(
  //       {
  //         samplesPerPixel: 1000,
  //         mono: true,
  //         waveHeight: 150,
  //         container: container,
  //         timescale: true,
  //         state: 'cursor',
  //         colors: {
  //           waveOutlineColor: 'black',
  //           timeColor: 'gray',
  //           fadeColor: 'blue'
  //         },
  //         controls: {
  //           show: true,
  //           width: 150
  //         },
  //         zoomLevels: [500, 1000, 3000, 5000]
  //       },
  //       ee
  //     );
  //     playlist.load([
  //       {
  //         src: '/music/vocal.aac',
  //         name: 'vocal',
  //         gain: 0.5
  //       },
  //       {
  //         src: '/music/drum.aac',
  //         name: 'drum',
  //         gain: 0.5
  //       },
  //       {
  //         src: '/music/guitar.aac',
  //         name: 'guitar',
  //         gain: 0.5
  //       },
  //       {
  //         src: '/music/bass.aac',
  //         name: 'bass',
  //         gain: 0.5
  //       },
  //       {
  //         src: '/music/piano.aac',
  //         name: 'piano',
  //         gain: 0.5
  //       }
  //     ]);
  //   }, []);
  const [ws, setWs] = useState<any>(null);

  useEffect(() => {
    const multitrack = Multitrack.create(
      [
        {
          id: 0,
          url: '/music/mp3/vocal.mp3',
          volume: 0.5,
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 1,
          url: '/music/mp3/drum.mp3',
          volume: 0.5,
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 2,
          url: '/music/mp3/guitar.mp3',
          volume: 0.5,
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 3,
          url: '/music/mp3/bass.mp3',
          volume: 0.5,
          options: {
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 4,
          url: '/music/mp3/piano.mp3',
          volume: 0.5,
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
    console.log(ws);
    ws.envelopes[0].destroy();
    // ws.audios[0].mute();
  };

  const handleChange = (track: number, event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.valueAsNumber / 100;
    ws.setTrackVolume(track, v);
  };

  const handleVolumeChange = (id: string) => {};
  const tracks = [0, 1, 2, 3, 4];
  return (
    <>
      <button onClick={handleClick}>pause</button>
      <button onClick={handleClick1}>mute</button>
      {/* <label>
        volume: <input onChange={handleChange} type="range" min="0" max="100" />
      </label> */}
      <section className="flex">
        <ul className="flex h-full min-h-[668px] flex-col justify-evenly">
          {tracks.map((track) => {
            return (
              <div className="flex flex-col items-center justify-center" key={track}>
                <label className="block">
                  volume: <input onChange={(e) => handleChange(track, e)} type="range" min="0" max="100" />
                </label>
                <div className="flex gap-x-2">
                  <button className="rounded bg-blue-500 px-3">mute</button>
                  <button className="rounded bg-blue-500 px-3">solo</button>
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
