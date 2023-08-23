import React, { ChangeEvent, useEffect, useRef, useState, Suspense } from 'react';
import Multitrack from 'wavesurfer-multitrack';
import { Button } from './ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StageGround from '@/components/StageGround';
import Rig from '@/components/Rig';
import StageSpotLight from '@/components/StageSpotLight';
import MusicAnalyzer from '@/components/MusicAnalyzer';
import Instrument from '@/components/Instrumental';
import Loading from '@/components/Loading';
import { instruments } from '@/constants/music';
import { Vector3 } from 'three';
import MusicPlayToggleButton from './MusicPlayToggleButton';

type Props = {};

export default function MultitrackPlayer({}: Props) {
  const overlayRef = useRef<any>(null);
  const playerRef = useRef<any>(null);
  const pauseResumeRef = useRef<any>(null);
  const [ws, setWs] = useState<any>(null);
  const [volumes, setVolumes] = useState<any>([0.5, 0.5, 0.5, 0.5, 0.5]);
  const [vocalAudio, setVocalAudio] = useState<HTMLAudioElement | null>(null);
  const [guitarAudio, setGuitarAudio] = useState<HTMLAudioElement | null>(null);
  const [drumAudio, setDrumAudio] = useState<HTMLAudioElement | null>(null);
  const [pianoAudio, setPianoAudio] = useState<HTMLAudioElement | null>(null);
  const [bassAudio, setBassAudio] = useState<HTMLAudioElement | null>(null);
  const [isReady, setIsReady] = useState(true);

  useEffect(() => {
    const multitrack = Multitrack.create(
      [
        {
          id: 0,
          url: '/music/mp3/vocal.mp3',
          volume: 0.5,
          //@ts-ignore
          options: {
            height: 120,
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
            height: 120,
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
            height: 120,
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
            height: 120,
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
            height: 120,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        }
      ],
      {
        container: playerRef.current, // required!
        minPxPerSec: 5, // zoom level
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
    multitrack.once('canplay', () => {
      const audios = (multitrack as any).audios;
      setVocalAudio(audios[0]);
      setDrumAudio(audios[1]);
      setGuitarAudio(audios[2]);
      setBassAudio(audios[3]);
      setPianoAudio(audios[4]);
      setWs(multitrack);
    });

    return () => {
      multitrack.destroy();
    };
  }, []);

  const setMasterVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.valueAsNumber / 100;
    const newVolumes = [];
    console.log(ws);
    for (let i = 0; i < 5; i++) {
      newVolumes.push(v);
      ws.audios[i].volume = v;
      const id = 'volume' + i;
      (document.getElementById(id) as any).value = event.target.valueAsNumber;
    }
    console.log(newVolumes);
    setVolumes(newVolumes);
  };

  const pauseAndResumeAll = () => {
    console.log(ws.currentTime);
    console.log(ws.isPlaying());
    if (ws.isPlaying()) {
      ws.pause();
      pauseResumeRef.current.textContent = 'play';
    } else {
      ws.play();
      pauseResumeRef.current.textContent = 'pause';
    }
    console.log(ws.isPlaying());
  };

  const muteAll = () => {
    for (let i = 0; i < 5; i++) {
      ws.audios[i].volume = 0;
    }
  };

  const unmuteAll = () => {
    for (let i = 0; i < 5; i++) {
      ws.audios[i].volume = volumes[i];
    }
  };

  const setTrackVolume = (track: number, event: ChangeEvent<HTMLInputElement>) => {
    const v = event.target.valueAsNumber / 100;
    let newVolumes = [...volumes];
    console.log(newVolumes);
    newVolumes[track] = v;
    ws.audios[track].volume = v;
    setVolumes(newVolumes);
  };

  const muteTrack = (track: number, event: React.MouseEvent<HTMLElement>) => {
    if (ws.audios[track].volume) {
      ws.audios[track].volume = 0;
    } else {
      ws.audios[track].volume = volumes[track];
    }
  };

  const soloTrack = (track: number, event: React.MouseEvent<HTMLElement>) => {
    for (let i = 0; i < 5; i++) {
      if (i != track) {
        ws.audios[i].volume = 0;
      } else {
        ws.audios[i].volume = volumes[i];
      }
    }
  };

  const showController = () => {
    overlayRef.current.style.transform = 'translateY(-80vh)';
    const opacity = document.createElement('div');
    opacity.className = 'fixed w-full min-h-full top-0 bg-gray-200 opacity-50 z-10';
    document.querySelector('main')?.appendChild(opacity);
    opacity.addEventListener('click', (event: MouseEvent) => {
      overlayRef.current.style.transform = 'translateY(80vh)';
      event.stopPropagation();
      opacity.remove();
    });
  };

  const tracks = [0, 1, 2, 3, 4];
  return (
    <main>
      {/* <MusicPlayToggleButton /> */}
      <Suspense fallback={<Loading />}>
        <Canvas
          camera={{
            position: [0, 20, 0],
            fov: 80,
            near: 0.1,
            far: 300,
            zoom: 1
          }}
          style={{ width: '100vw', height: '100vh' }}
        >
          <color attach="background" args={['white']} />
          <Suspense fallback={null}>
            <Rig>
              <StageGround />
              {instruments.map((instrument, index) => (
                <Instrument
                  key={index}
                  position={instrument.position}
                  rotation={instrument.rotation}
                  scale={instrument.scale}
                  url={instrument.url}
                  SpotLightTarget={instrument.spotLightTarget}
                  SpotLightPosition={instrument.spotLightPosition}
                  SpotLightAngle={instrument.spotLightAngle}
                />
              ))}
              {guitarAudio && isReady && (
                <MusicAnalyzer audio={guitarAudio} fftSize={128} centerPos={[75, -26, 10]} radius={8} />
              )}
              {vocalAudio && isReady && (
                <MusicAnalyzer audio={vocalAudio} fftSize={128} centerPos={[0, -26, 30]} radius={8} />
              )}
              {bassAudio && isReady && (
                <MusicAnalyzer audio={bassAudio} fftSize={128} centerPos={[-75, -26, 10]} radius={4} />
              )}
              {drumAudio && isReady && (
                <MusicAnalyzer audio={drumAudio} fftSize={128} centerPos={[32, -26, -10]} radius={18} />
              )}
              {pianoAudio && isReady && (
                <MusicAnalyzer audio={pianoAudio} fftSize={128} centerPos={[-32, -26, -10]} radius={18} />
              )}
            </Rig>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          <ambientLight intensity={0.4} />
        </Canvas>
      </Suspense>
      <div>
        <Button onClick={showController} className="fixed bottom-5 right-5 z-10">
          Show Controller
        </Button>
        <div
          ref={overlayRef}
          className="fixed top-[100%] z-20 h-[80%] w-full overflow-y-scroll bg-white p-5 transition-transform duration-300  ease-in-out"
        >
          <div>
            <div className="flex gap-x-2">
              <label className="block">
                volume: <input type="range" min="0" max="100" onChange={setMasterVolume} />
              </label>
              <button ref={pauseResumeRef} className="rounded bg-blue-500 px-3" onClick={pauseAndResumeAll}>
                play
              </button>
              <button className="rounded bg-blue-500 px-3" onClick={muteAll}>
                mute
              </button>
              <button className="rounded bg-blue-500 px-3" onClick={unmuteAll}>
                unmute
              </button>
            </div>
          </div>
          <section className="flex">
            <div>
              <ul className="flex h-full min-h-[600px] flex-col justify-evenly">
                {tracks.map((track) => {
                  return (
                    <div className="flex min-h-[120px] flex-col items-center justify-center" key={track}>
                      <label className="block">
                        volume:{' '}
                        <input
                          id={'volume' + track}
                          onChange={(e) => setTrackVolume(track, e)}
                          type="range"
                          min="0"
                          max="100"
                        />
                      </label>
                      <div className="flex gap-x-2">
                        <button className="rounded bg-blue-500 px-3" onClick={(e) => muteTrack(track, e)}>
                          mute
                        </button>
                        <button className="rounded bg-blue-500 px-3" onClick={(e) => soloTrack(track, e)}>
                          solo
                        </button>
                      </div>
                    </div>
                  );
                })}
              </ul>
            </div>
            <div className="w-full" ref={playerRef}></div>
          </section>
        </div>
      </div>
    </main>
  );
}
