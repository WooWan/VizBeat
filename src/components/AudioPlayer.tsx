import React, { useEffect, useRef, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/time';
import { Music } from '@prisma/client';

type Props = {
  musics?: Music[];
  handleMusicSelect: (id: string) => void;
  selectedMusic: Music | null;
};

const AudioPlayer = ({ musics, handleMusicSelect, selectedMusic }: Props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null!);
  const [seekProgress, setSeekProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime * 100) / audio.duration);
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
    };
  }, []);

  useEffect(() => {
    if (selectedMusic === null || !isPlaying) return;
    audioRef.current?.play();
    setIsPlaying(true);
  }, [selectedMusic]);

  const skipToNextMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const nextIndex = index === musics.length - 1 ? 0 : index + 1;
    handleMusicSelect(musics[nextIndex].id);
  };

  const skipToPrevMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const previndex = index === 0 ? musics.length - 1 : index - 1;
    handleMusicSelect(musics[previndex].id);
  };

  const toggleMusic = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playFromClickedPosition = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    audioRef.current.currentTime = (seekProgress * audioRef.current.duration) / 100;
    setProgress(seekProgress);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const seekHover = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    setSeekProgress((event.nativeEvent.offsetX * 100) / event.currentTarget.offsetWidth);
  };

  const seekMouseLeave = () => {
    setSeekProgress(0);
  };

  return (
    <div className={'relative mb-6 mt-36 min-h-[100px] min-w-[430px]'}>
      <div className={'relative z-10 h-full'}>
        <section
          className={cn(
            'absolute left-[15px] right-[15px] top-0 z-10 h-24 rounded-t-xl bg-[#fff7f7] py-3 pl-60 pr-5 transition-transform duration-700',
            {
              '-translate-y-24': isPlaying
            }
          )}
        >
          <h3 className={'text-s3 text-primary-black'}>{selectedMusic?.title}</h3>
          <span className={'text-b2 text-slate-400'}>{selectedMusic?.artist}</span>
          <div className={'flex justify-between'}>
            <div className={'text-b1'}>{formatTime(currentTime)}</div>
            <div className={'text-b1'}>{formatTime(duration)}</div>
          </div>
          <div
            onClick={playFromClickedPosition}
            onMouseMove={seekHover}
            onMouseLeave={seekMouseLeave}
            className={'group relative h-1 cursor-pointer rounded-md bg-[#ffe8ee]'}
          >
            <div className={'b2 absolute -top-7 hidden whitespace-pre rounded-md bg-[#3b3d50] p-1 text-white'} />
            <div
              className={'absolute bottom-0 left-0 top-0 z-10 bg-[#3b3d50] opacity-20'}
              style={{ width: `${seekProgress}%` }}
            />
            <div className={'absolute inset-0 bg-[#fd6d94] group-hover:opacity-40'} style={{ width: `${progress}%` }} />
          </div>
        </section>
        <div
          className={
            'relative z-10 flex h-full items-center justify-end rounded-xl border-[1px] border-gray-200 bg-white'
          }
        >
          <div className={'absolute -top-8 left-1 ml-10 h-28 w-28 overflow-hidden rounded-full '}>
            <Image
              src={selectedMusic?.albumCover || '/images/vinyl_record.png'}
              alt={'album_cover'}
              fill
              className={cn('-z-10 animate-spin-slow object-cover', {
                'z-10': !isPlaying
              })}
            />
          </div>
          <div className={'flex items-center gap-x-8 justify-self-end px-10'}>
            <button
              className={'group flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-300'}
              onClick={skipToPrevMusic}
              disabled={selectedMusic === null}
            >
              <SkipBack
                size={24}
                className={cn('fill-current text-gray-300  group-hover:text-white', {
                  'text-black': selectedMusic !== null
                })}
              />
            </button>
            <button
              className={'group flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-300'}
              onClick={toggleMusic}
              disabled={selectedMusic === null}
            >
              {isPlaying ? (
                <Pause
                  size={24}
                  className={cn('fill-current text-gray-300 group-hover:text-white', {
                    'text-black': selectedMusic !== null
                  })}
                />
              ) : (
                <Play
                  size={24}
                  className={cn('fill-current text-gray-300  group-hover:text-white', {
                    'text-black': selectedMusic !== null
                  })}
                />
              )}
            </button>
            <button
              className={'group flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-300'}
              onClick={skipToNextMusic}
              disabled={selectedMusic === null}
            >
              <SkipForward
                size={24}
                className={cn(
                  'fill-current text-gray-300 transition-[text-color] duration-700 group-hover:text-white',
                  {
                    'text-black': selectedMusic !== null
                  }
                )}
              />
            </button>
          </div>
        </div>
      </div>
      <audio ref={audioRef} src={selectedMusic?.musicUrl} onTimeUpdate={handleTimeUpdate} />
    </div>
  );
};

export default AudioPlayer;
