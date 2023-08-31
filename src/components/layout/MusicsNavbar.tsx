import React, { useRef } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { cn } from '@/lib/utils';
import { useMusicStore } from '@/store/music';
import { shallow } from 'zustand/shallow';
import { useMusics } from '@/hooks/queries/music/useMusics';
import MusicUploadModal from '@/components/modal/MusicUploadModal';

const MusicsNavbar = () => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);
  const { data: musics } = useMusics();

  const { api, musicInfo } = useMusicStore(
    (state) => ({
      musicInfo: state.musicInfo,
      api: state.api
    }),
    shallow
  );

  return (
    <nav className={'hidden flex-col bg-white bg-opacity-90 px-6 lg:flex'}>
      <h2 className={'pt-2 text-h1'}>Music</h2>
      <AudioPlayer musics={musics} />
      <ul
        className={
          'flex max-h-[160px] snap-y snap-mandatory flex-col items-center overflow-y-scroll bg-white bg-opacity-90 py-4 scrollbar-thin scrollbar-thumb-gray-900'
        }
      >
        {musics?.map((music, index) => (
          <li
            key={index}
            className={cn(
              'grid w-full cursor-pointer snap-center grid-cols-[200px_1fr] border-b-[1px] border-y-slate-700 px-4 py-2 hover:bg-slate-100',
              {
                'bg-slate-100': musicInfo === music
              }
            )}
            ref={(el) => (listRefs.current[index] = el)}
            onClick={() => api.selectAudio(music)}
          >
            <span>{music.artist}</span>
            <span>{music.title}</span>
          </li>
        ))}
      </ul>
      <MusicUploadModal />
    </nav>
  );
};

export default MusicsNavbar;
