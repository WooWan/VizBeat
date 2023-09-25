import React, { useEffect, useState } from 'react';
import { Pause, Play, SkipBack, SkipForward } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { formatTime } from '@/utils/time';
import { Music } from '@prisma/client';
import { useMusicStore } from '@/store/music';
import { shallow } from 'zustand/shallow';

type Props = {
  musics?: Music[];
};

const AudioPlayer = ({ musics }: Props) => {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);
  const [seekProgress, setSeekProgress] = useState(0);
  const {
    api,
    isAudioPlaying,
    music: selectedMusic,
    audio
  } = useMusicStore(
    (state) => ({ api: state.api, isAudioPlaying: state.isAudioPlaying, music: state.musicInfo, audio: state.audio }),
    shallow
  );

  useEffect(() => {
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
  }, [audio]);

  const skipToNextMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const nextIndex = index === musics.length - 1 ? 0 : index + 1;
    api.selectAudio(musics[nextIndex]);
  };

  const skipToPrevMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const previndex = index === 0 ? musics.length - 1 : index - 1;
    api.selectAudio(musics[previndex]);
  };

  const toggleMusic = () => (isAudioPlaying ? api.stopAudio() : api.playAudio());

  const playFromClickedPosition = () => {
    if (!audio) return;
    audio.currentTime = (seekProgress * audio.duration) / 100;
    setProgress(seekProgress);
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
            'absolute left-[15px] right-[5px] top-0 z-10 h-24 rounded-t-xl bg-[#fff7f7] py-4 pl-56 pr-4 transition-transform duration-700',
            {
              '-translate-y-24': selectedMusic
            }
          )}
        >
          <div className="flex flex-col gap-y-0.5 pb-2">
            <h2 className={'font-med line-clamp-1 text-sm text-primary-black'}>
              안녕하세요 프론트엔드 개발자 우창완입니다 궁금한 내용?
            </h2>
            <span className="line-clamp-1 text-xs text-slate-400">{selectedMusic?.artist}</span>
          </div>
          <div className={'flex justify-between pb-1 text-slate-500'}>
            <div className={'text-xs'}>{formatTime(currentTime)}</div>
            <div className={'text-xs'}>{formatTime(duration)}</div>
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
                'z-10': !isAudioPlaying
              })}
            />
          </div>
          <div className={'flex items-center gap-x-8 justify-self-end px-10'}>
            <button
              aria-label="Skip Back"
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
            {isAudioPlaying ? (
              <button
                aria-label="Pause"
                className={'group flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-300'}
                onClick={toggleMusic}
                disabled={selectedMusic === null}
              >
                <Pause
                  size={24}
                  className={cn('fill-current text-gray-300 group-hover:text-white', {
                    'text-black': selectedMusic !== null
                  })}
                />
              </button>
            ) : (
              <button
                aria-label="Play"
                className={'group flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-300'}
                onClick={toggleMusic}
                disabled={selectedMusic === null}
              >
                <Play
                  size={24}
                  className={cn('fill-current text-gray-300  group-hover:text-white', {
                    'text-black': selectedMusic !== null
                  })}
                />
              </button>
            )}
            <button
              aria-label="Skip Forward"
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
    </div>
  );
};

export default AudioPlayer;
