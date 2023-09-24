import { useMusicStore } from '@/store/music';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import MusicPlayToggleButton from './MusicPlayToggleButton';
import { Button } from './ui/button';
import { audioTracks } from '@/constants/music';
import { AudioTrack } from '@/types/instrument';
import { Volume2Icon, VolumeXIcon } from 'lucide-react';
import { calculateIsSolo } from '@/utils/music';
import { cn } from '@/lib/utils';
import useWavesurfer from '@/hooks/useWavesurfer';
import { useMusic } from '@/hooks/queries/music/useMusics';
import { useRouter } from 'next/router';
import AudioDropdown from '@/components/AudioDropdown';
import { Slider } from '@/components/ui/slider';

type Props = {
  audios?: HTMLAudioElement[];
};

export default function MultitrackController({ audios }: Props) {
  const router = useRouter();
  const musicId = router.query.slug;
  const { data: music } = useMusic(musicId ? String(musicId) : '');
  const playerRef = useRef<HTMLDivElement>(null!);
  const { audioStates, api } = useMusicStore((state) => ({ audioStates: state.audioTracks, api: state.api }), shallow);
  const wavesurfer = useWavesurfer({
    containerRef: playerRef,
    audios
  });
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const allMuted = Object.values(audioStates).every((audio) => audio.isMuted);

  useEffect(() => {
    if (!wavesurfer) return;
    for (const instrument of audioTracks) muteToggle(instrument);
  }, [audioStates]);

  const updateMasterVolume = (volumes: number[]) => {
    const volume = volumes[0] / 100;
    Object.values(audioTracks).forEach((audio, index) => {
      api.updateVolume(audio.type, volume);
      wavesurfer.setTrackVolume(index, volume);
    });
  };

  const pauseAndResumeAll = () => {
    if (wavesurfer?.isPlaying()) {
      api.stopAudio();
      wavesurfer.pause();
    } else {
      api.playAudio();
      wavesurfer?.play();
    }
  };

  const muteAll = () => {
    Object.values(audioTracks).forEach((audio, index) => {
      api.muteAudio(audio.type);
      wavesurfer.setTrackVolume(index, 0);
    });
  };

  const unmuteAll = () => {
    Object.values(audioTracks).forEach((audio, index) => {
      api.unMuteAudio(audio.type);
      wavesurfer.setTrackVolume(index, audioStates[audio.type].volume);
    });
  };

  const updateTrackVolume = (id: string, volume: number) => {
    const audioIndex = audioTracks.findIndex((audio) => audio.id === id);
    const instrument = audioTracks[audioIndex];
    api.updateVolume(instrument.type, volume);
    wavesurfer.setTrackVolume(audioIndex, volume);
  };

  const muteToggle = (track: AudioTrack) => {
    const isMuted = audioStates[track.type].isMuted;
    const instrumentIndex = audioTracks.findIndex((audio) => audio.id === track.id);
    const instrument = audioStates[track.type];
    wavesurfer.setTrackVolume(instrumentIndex, isMuted ? 0 : instrument.volume);
  };

  const soloTrack = (type: string) => {
    Object.values(audioTracks).forEach((audio, index) => {
      if (audio.type === type) {
        api.unMuteAudio(audio.type);
        wavesurfer.setTrackVolume(index, audioStates[audio.type].volume);
      } else {
        api.muteAudio(audio.type);
        wavesurfer.setTrackVolume(index, 0);
      }
    });
  };

  return (
    <main>
      <div className="absolute right-5 top-4 z-10 flex items-center gap-x-1.5">
        <Button
          onClick={() => setIsPlayerOpen(!isPlayerOpen)}
          className="border-[1px] border-slate-300/[0.3] bg-zinc-950 text-base text-zinc-100"
        >
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
        <div className="flex gap-x-1.5">
          <div className="flex flex-col gap-y-1 pb-2">
            <h4 className="text-base text-zinc-100">Master</h4>
            <Slider className="w-32" onValueChange={updateMasterVolume} defaultValue={[50]} />
          </div>
          <section className="flex items-end gap-x-3 pb-2 pl-2">
            <button className="text-zinc-100" onClick={allMuted ? unmuteAll : muteAll}>
              {allMuted ? <VolumeXIcon className="h-6 w-6" /> : <Volume2Icon className="h-6 w-6" />}
            </button>
            <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative h-6 w-6" />
            {music && <AudioDropdown music={music} />}
          </section>
        </div>
        <section className="flex gap-x-4">
          <ul className="flex h-full flex-col">
            {audioTracks.map((audio) => {
              const { isMuted, volume } = audioStates[audio.type];
              const isSolo = calculateIsSolo(audio.type, audioStates);
              return (
                <li className="flex h-[82px] flex-col justify-center" key={audio.type}>
                  <div className="flex items-center justify-between gap-x-1.5 pb-1">
                    <p className="text-sm text-zinc-100">{audio.type.charAt(0).toUpperCase() + audio.type.slice(1)}</p>
                    <div className="flex items-center gap-x-2">
                      <button className="rounded bg-gray-500 px-1" onClick={() => soloTrack(audio.type)}>
                        <span
                          className={cn('text-sm text-zinc-100', {
                            'text-yellow-400': isSolo
                          })}
                        >
                          S
                        </span>
                      </button>
                      <button
                        className="text-zinc-200"
                        onClick={() => (isMuted ? api.unMuteAudio(audio.type) : api.muteAudio(audio.type))}
                      >
                        {isMuted ? <VolumeXIcon className="h-5 w-5" /> : <Volume2Icon className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <Slider
                    className="w-32"
                    onValueChange={(v) => updateTrackVolume(audio.id, v[0] / 100)}
                    value={[volume * 100]}
                  />
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
