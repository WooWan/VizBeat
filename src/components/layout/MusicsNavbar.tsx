import React, { useRef } from 'react';
import AudioPlayer from '@/components/AudioPlayer';
import { Music } from '@prisma/client';
import clsx from 'clsx';

type Props = {
  musics: Music[];
  selectedMusic: Music | null;
  setSelectedMusic: React.Dispatch<React.SetStateAction<Music | null>>;
  handleMusicSelect: (id: string) => void;
};

const MusicsNavbar = ({ selectedMusic, setSelectedMusic, musics, handleMusicSelect }: Props) => {
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);

  const skipToNextMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const nextIndex = index === musics.length - 1 ? 0 : index + 1;
    setSelectedMusic(musics[nextIndex]);
  };

  return (
    <nav className={'flex flex-col bg-white bg-opacity-90 px-6'}>
      <h2 className={'pt-2 text-h1'}>Music</h2>
      <AudioPlayer selectedMusic={selectedMusic} skipNextMusic={skipToNextMusic} />
      <ul
        className={
          'flex h-64 snap-y snap-mandatory flex-col items-center overflow-y-scroll bg-white bg-opacity-90 py-4 scrollbar scrollbar-thumb-red-400'
        }
      >
        {musics?.map((music, index) => {
          return (
            <li
              key={index}
              className={clsx(
                'grid w-full cursor-pointer snap-center grid-cols-[200px_1fr] border-b-[1px] border-y-slate-700 px-4 py-2 hover:bg-slate-100',
                {
                  'bg-slate-100': selectedMusic === music
                }
              )}
              ref={(el) => (listRefs.current[index] = el)}
              onClick={() => handleMusicSelect(music.id)}
            >
              <span>{music.artist}</span>
              <span>{music.title}</span>
            </li>
          );
        })}
      </ul>
      <button>+ add</button>
    </nav>
  );
};

export default MusicsNavbar;
