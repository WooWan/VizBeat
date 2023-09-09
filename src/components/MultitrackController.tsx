import { useMusicStore } from '@/store/music';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import MusicPlayToggleButton from './MusicPlayToggleButton';
import { Button } from './ui/button';
import { instruments } from '@/constants/music';
import { InstrumentData } from '@/types/instrument';
import { Volume2Icon, VolumeXIcon } from 'lucide-react';
import { calculateIsSolo } from '@/utils/music';
import { cn } from '@/lib/utils';
import useWavesurfer from '@/hooks/useWavesurfer';

type Props = {
  tracks: HTMLAudioElement[];
};

export default function MultitrackController({ tracks }: Props) {
  const playerRef = useRef<HTMLDivElement>(null!);
  const { instrumentState, api } = useMusicStore(
    (state) => ({ instrumentState: state.instruments, api: state.api }),
    shallow
  );
  const wavesurfer = useWavesurfer({
    containerRef: playerRef,
    tracks
  });
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const allMuted = Object.values(instrumentState).every((instrument) => instrument.isMuted);

  useEffect(() => {
    if (!wavesurfer) return;
    for (const instrument of instruments) muteToggle(instrument);
  }, [instrumentState]);

  const updateMasterVolume = (event: ChangeEvent<HTMLInputElement>) => {
    const updatedVolume = event.target.valueAsNumber / 100;
    Object.values(instruments).forEach((instrument, index) => {
      api.updateVolume(instrument.type, updatedVolume);
      wavesurfer.setTrackVolume(index, updatedVolume);
    });
  };

  const pauseAndResumeAll = () => {
    console.log('wavesurfer isplaying', wavesurfer.isPlaying());
    if (wavesurfer?.isPlaying()) {
      console.log('pause');
      console.log(wavesurfer);
      api.stopAudio();
      wavesurfer.pause();
    } else {
      console.log('play');
      api.playAudio();
      wavesurfer?.play();
    }
    console.log('wavesurfer isplaying after', wavesurfer.isPlaying());
  };

  const muteAll = () => {
    Object.values(instruments).forEach((instrument, index) => {
      api.muteAudio(instrument.type);
      wavesurfer.setTrackVolume(index, 0);
    });
  };

  const unmuteAll = () => {
    Object.values(instruments).forEach((instrument, index) => {
      api.unMuteAudio(instrument.type);
      wavesurfer.setTrackVolume(index, instrumentState[instrument.type].volume);
    });
  };

  const updateTrackVolume = (id: string, event: ChangeEvent<HTMLInputElement>) => {
    const updatedVolume = event.target.valueAsNumber / 100;
    const audioIndex = instruments.findIndex((instrument) => instrument.id === id);
    const instrument = instruments[audioIndex];
    api.updateVolume(instrument.type, updatedVolume);
    wavesurfer.setTrackVolume(audioIndex, updatedVolume);
  };

  const muteToggle = (track: InstrumentData) => {
    const isMuted = instrumentState[track.type].isMuted;
    const instrumentIndex = instruments.findIndex((instrument) => instrument.id === track.id);
    const instrument = instrumentState[track.type];
    wavesurfer.setTrackVolume(instrumentIndex, isMuted ? 0 : instrument.volume);
  };

  const soloTrack = (type: string) => {
    Object.values(instruments).forEach((instrument, index) => {
      if (instrument.type === type) {
        api.unMuteAudio(instrument.type);
        wavesurfer.setTrackVolume(index, instrumentState[instrument.type].volume);
      } else {
        api.muteAudio(instrument.type);
        wavesurfer.setTrackVolume(index, 0);
      }
    });
  };

  return (
    <main>
      <div className="absolute right-5 top-4 z-10 flex items-center gap-x-1.5">
        <Button onClick={() => setIsPlayerOpen(!isPlayerOpen)} className="bg-zinc-950 text-base text-zinc-100">
          <span>{isPlayerOpen ? 'Hide Controller' : 'Show Controller'}</span>
        </Button>
        <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative right-0" />
      </div>
      <div
        className={cn('fixed inset-0 bg-background/50 opacity-30 backdrop-blur-sm', {
          hidden: !isPlayerOpen
        })}
        onClick={() => setIsPlayerOpen(false)}
      />
      <section
        className={cn(
          'fixed inset-x-0 bottom-0 z-50 flex w-full flex-col overflow-y-scroll bg-zinc-900/[0.75] pl-5 pt-5 transition-transform duration-200 ease-in',
          {
            'translate-y-[620px]': !isPlayerOpen
          }
        )}
      >
        <div className="flex gap-x-2">
          <label className="flex items-center">
            <input type="range" min="0" max="100" onChange={updateMasterVolume} />
          </label>
          <button className="text-zinc-100" onClick={allMuted ? unmuteAll : muteAll}>
            {allMuted ? <VolumeXIcon /> : <Volume2Icon />}
          </button>
          <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative right-0 top-0" />
        </div>
        <section className="flex gap-x-4">
          <ul className="flex h-full flex-col">
            {instruments.map((instrument) => {
              const { isMuted, volume } = instrumentState[instrument.type];
              const isSolo = calculateIsSolo(instrument.type, instrumentState);
              return (
                <li className="flex h-[102px] flex-col justify-center" key={instrument.type}>
                  <div className="flex items-center justify-start">
                    <button className="rounded bg-gray-500 px-1" onClick={() => soloTrack(instrument.type)}>
                      <span
                        className={cn('text-sm text-zinc-100', {
                          'text-yellow-400': isSolo
                        })}
                      >
                        S
                      </span>
                    </button>
                    <button
                      className="pl-2 text-zinc-200"
                      onClick={() => (isMuted ? api.unMuteAudio(instrument.type) : api.muteAudio(instrument.type))}
                    >
                      {isMuted ? <VolumeXIcon /> : <Volume2Icon />}
                    </button>
                  </div>
                  <label className="block">
                    <input
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
          <div className="w-full pt-2.5" ref={playerRef} />
        </section>
      </section>
    </main>
  );
}
