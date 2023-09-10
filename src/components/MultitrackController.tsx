import { useMusicStore } from '@/store/music';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import { shallow } from 'zustand/shallow';
import MusicPlayToggleButton from './MusicPlayToggleButton';
import { Button } from './ui/button';
import { audioTracks, instruments } from '@/constants/music';
import { DownloadType, InstrumentData } from '@/types/instrument';
import { DownloadIcon, Volume2Icon, VolumeXIcon } from 'lucide-react';
import { calculateIsSolo } from '@/utils/music';
import { cn } from '@/lib/utils';
import useWavesurfer from '@/hooks/useWavesurfer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Music } from '@prisma/client';
import { fetchAndStoreMusic } from '@/utils/fetchMusicIdb';
import { saveAs } from 'file-saver';
import { mergeAudios } from '@/utils/ffmpeg';

type Props = {
  tracks: HTMLAudioElement[];
  music: Music;
};

export default function MultitrackController({ tracks, music }: Props) {
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
  const messageRef = useRef<HTMLParagraphElement>(null!);
  const [isMusicDownloading, setIsMusicDownloading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

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
    if (wavesurfer?.isPlaying()) {
      api.stopAudio();
      wavesurfer.pause();
    } else {
      api.playAudio();
      wavesurfer?.play();
    }
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

  const musicMap: Record<DownloadType, string | null> = {
    vocal: music.vocalUrl,
    bass: music.bassUrl,
    drum: music.drumUrl,
    guitar: music.guitarUrl,
    piano: music.pianoUrl,
    other: music.otherUrl,
    original: music.musicUrl
  };

  const onProgress = (progress: number) => {
    messageRef.current.innerText = `${progress.toFixed(0)}%`;
  };

  const downloadMixedTrack = async () => {
    setIsMusicDownloading(true);

    const result = [];
    for await (const [key, value] of Object.entries(musicMap)) {
      if (!value) continue;
      const blob = await fetchAndStoreMusic(value, value);
      result.push(blob);
    }

    const buffer = await mergeAudios(result, onProgress);
    saveAs(new Blob([buffer], { type: 'audio/mp3' }), `${music.title}.mp3`);

    setIsMusicDownloading(false);
    setMenuOpen(false);
  };

  const downloadSingleTrack = async (type: DownloadType) => {
    const url = musicMap[type];
    if (!url) return;

    const blob = await fetchAndStoreMusic(url, url);
    saveAs(blob, `${music.title}-${type}.mp3`);
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
        <div className="flex gap-x-1.5">
          <label className="flex items-center pr-2">
            <input type="range" min="0" max="100" onChange={updateMasterVolume} />
          </label>
          <button className="text-zinc-100" onClick={allMuted ? unmuteAll : muteAll}>
            {allMuted ? <VolumeXIcon /> : <Volume2Icon className={'h-5 w-5'} />}
          </button>
          <p ref={messageRef}></p>
          <MusicPlayToggleButton onClick={pauseAndResumeAll} className="relative right-0 top-0" />
          <DropdownMenu open={menuOpen}>
            <DropdownMenuTrigger onClick={() => setMenuOpen(true)}>
              <DownloadIcon className="h-5 w-5 text-zinc-100" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => downloadSingleTrack('original')} className="flex justify-between">
                <span>Original</span>
                <DownloadIcon className="h-3.5 w-3.5" />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={downloadMixedTrack} className="flex justify-between">
                <span>Mixed</span>
                {isMusicDownloading ? (
                  <div className="flex items-center gap-x-1.5">
                    <p ref={messageRef} className="text-xs text-gray-400">
                      0%
                    </p>
                    <span className="animate-bounce">🎸</span>
                  </div>
                ) : (
                  <DownloadIcon className="h-3.5 w-3.5" />
                )}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {audioTracks.map((instrument) => {
                const title = instrument.type;
                return (
                  <DropdownMenuItem
                    onClick={() => downloadSingleTrack(instrument.type)}
                    className="flex justify-between"
                    key={instrument.type}
                  >
                    <span>{title.charAt(0).toUpperCase() + title.slice(1)}</span>
                    <DownloadIcon className="h-3.5 w-3.5" />
                  </DropdownMenuItem>
                );
              })}
            </DropdownMenuContent>
          </DropdownMenu>
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
