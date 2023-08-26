import React, { ChangeEvent, useEffect, useRef, useState, Suspense } from 'react';
import { Button } from './ui/button';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import StageGround from '@/components/StageGround';
import Rig from '@/components/Rig';
import MusicAnalyzer from '@/components/MusicAnalyzer';
import Loading from '@/components/Loading';
import { instruments } from '@/constants/music';
import MusicPlayToggleButton from './MusicPlayToggleButton';
import { useMusicStore } from '@/store/music';
import Instrument from './Instrument';
import { Volume2Icon, VolumeXIcon } from 'lucide-react';
import { InstrumentData } from '@/types/instrument';
import Multitrack from 'wavesurfer-multitrack';
import { shallow } from 'zustand/shallow';

const TRACK_HEIGHT = 100;

export default function MultitrackPlayer() {
  const overlayRef = useRef<any>(null);
  const playerRef = useRef<any>(null);
  const [ws, setWs] = useState<any>(null);
  const { instrumentState, api } = useMusicStore(
    (state) => ({ instrumentState: state.instruments, api: state.api }),
    shallow
  );
  const instrumentRef = useRef(null);
  const allMuted = Object.values(instrumentState).every((instrument) => instrument.isMuted);

  useEffect(() => {
    const multitrack = Multitrack.create(
      [
        {
          id: 0,
          url: '/music/mp3/vocal.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 1,
          url: '/music/mp3/drum.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 2,
          url: '/music/mp3/guitar.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 3,
          url: '/music/mp3/bass.mp3',
          volume: 0.5,
          startPosition: 0,
          //@ts-ignore
          options: {
            height: TRACK_HEIGHT,
            waveColor: 'hsl(46, 87%, 49%)',
            progressColor: 'hsl(46, 87%, 20%)'
          }
        },
        {
          id: 4,
          url: '/music/mp3/piano.mp3',
          volume: 0.5,
          startPosition: 0,
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
          lineWidth: '0',
          dragPointSize: 0
        }
      }
    );
    multitrack.once('canplay', () => {
      setWs(multitrack);
    });

    return () => {
      multitrack.destroy();
    };
  }, []);

  const updateMasterVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedVolume = event.target.valueAsNumber / 100;
    Object.values(instruments).forEach((instrument, index) => {
      api.updateVolume(instrument.type, updatedVolume);
      ws.audios[index].volume = updatedVolume;
    });
  };

  const pauseAndResumeAll = () => {
    if (ws.isPlaying()) {
      api.stopAudio();
      ws.pause();
    } else {
      api.playAudio();
      ws.play();
    }
  };

  const muteAll = () => {
    Object.values(instruments).forEach((instrument, index) => {
      api.muteAudio(instrument.type);
      ws.audios[index].volume = 0;
    });
  };

  const unmuteAll = () => {
    Object.values(instruments).forEach((instrument, index) => {
      api.unMuteAudio(instrument.type);
      ws.audios[index].volume = instrumentState[instrument.type].volume;
    });
  };

  const updateTrackVolume = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const updatedVolume = event.target.valueAsNumber / 100;
    const audioIndex = instruments.findIndex((instrument) => instrument.id === id);
    const instrument = instruments[audioIndex];
    api.updateVolume(instrument.type, updatedVolume);
    ws.audios[audioIndex].volume = updatedVolume;
  };

  const muteToggle = (track: InstrumentData) => {
    const isMuted = instrumentState[track.type].isMuted;
    const instrumentIndex = instruments.findIndex((instrument) => instrument.id === track.id);
    const instrument = instrumentState[track.type];
    ws.audios[instrumentIndex].volume = isMuted ? instrument.volume : 0;
    isMuted ? api.unMuteAudio(track.type) : api.muteAudio(track.type);
  };

  const soloTrack = (type: string) => {
    Object.values(instruments).forEach((instrument, index) => {
      if (instrument.type === type) {
        api.unMuteAudio(instrument.type);
        ws.audios[index].volume = instrumentState[instrument.type].volume;
      } else {
        api.muteAudio(instrument.type);
        ws.audios[index].volume = 0;
      }
    });
  };

  const showController = () => {
    overlayRef.current.style.transform = 'translateY(-50vh)';
    const opacity = document.createElement('div');
    opacity.className = 'fixed w-full min-h-full top-0 bg-gray-200 opacity-50 z-10';
    document.querySelector('main')?.appendChild(opacity);
    opacity.addEventListener('click', (event: MouseEvent) => {
      overlayRef.current.style.transform = 'translateY(80vh)';
      event.stopPropagation();
      opacity.remove();
    });
  };

  return (
    <main>
      <div className="absolute right-5 top-4 z-10 flex items-center gap-x-1.5">
        <Button onClick={showController} className=" bg-zinc-950 text-base text-zinc-100">
          Show Controller
        </Button>
        <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative right-0" />
      </div>
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
              {instruments.map((instrument) => (
                <Instrument key={instrument.type} {...instrument} />
              ))}
              {ws && (
                <>
                  <MusicAnalyzer audio={ws.wavesurfers[0].media} fftSize={128} centerPos={[0, -26, 30]} radius={8} />
                  <MusicAnalyzer audio={ws.wavesurfers[1].media} fftSize={128} centerPos={[32, -26, -10]} radius={18} />
                  <MusicAnalyzer audio={ws.wavesurfers[2].media} fftSize={128} centerPos={[75, -26, 10]} radius={8} />
                  <MusicAnalyzer audio={ws.wavesurfers[3].media} fftSize={128} centerPos={[-75, -26, 10]} radius={4} />
                  <MusicAnalyzer
                    audio={ws.wavesurfers[4].media}
                    fftSize={128}
                    centerPos={[-32, -26, -10]}
                    radius={18}
                  />
                </>
              )}
            </Rig>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
          <ambientLight intensity={0.4} />
        </Canvas>
      </Suspense>
      <div>
        <div
          ref={overlayRef}
          className="fixed top-[100%] z-20 w-full overflow-y-scroll bg-zinc-900/[0.75] p-5 transition-transform duration-300 ease-in-out"
        >
          <div>
            <div className="flex gap-x-2">
              <label className="flex items-center">
                volume: <input type="range" min="0" max="100" onChange={updateMasterVolume} />
              </label>
              <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative right-0 top-0" />
              <button className="text-zinc-100" onClick={allMuted ? unmuteAll : muteAll}>
                {allMuted ? <VolumeXIcon /> : <Volume2Icon />}
              </button>
            </div>
          </div>
          <section className="flex gap-x-4">
            <ul className="flex h-full flex-col">
              {instruments.map((instrument) => {
                const { isMuted, volume } = instrumentState[instrument.type];
                return (
                  <li className="flex h-[102px] flex-col justify-center" key={instrument.type}>
                    <div className="flex items-center justify-start">
                      <button className="rounded bg-gray-500 px-1" onClick={() => soloTrack(instrument.type)}>
                        <span className="text-sm text-zinc-100">S</span>
                      </button>
                      <button className="pl-2 text-zinc-200" onClick={() => muteToggle(instrument)}>
                        {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
                      </button>
                    </div>
                    <label className="block">
                      <input
                        ref={instrumentRef}
                        value={volume * 100}
                        onChange={(e) => updateTrackVolume(instrument.id, e)}
                        type="range"
                        min="0"
                        max="100"
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
            <div className="w-full pt-2.5" ref={playerRef}></div>
          </section>
        </div>
      </div>
    </main>
  );
}
