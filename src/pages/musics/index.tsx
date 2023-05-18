import React, { useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { Music } from '@prisma/client';
import clsx from 'clsx';
import Link from 'next/link';
import AudioPlayer from '@/components/AudioPlayer';
import { Play } from 'lucide-react';

const MusicsPage = () => {
  const { data: musics, isLoading, isError } = useMusics();
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const listRefs = useRef<(HTMLLIElement | null)[]>([]);

  const handleMusicSelect = (id: string) => {
    const music = musics?.find((music) => music.id === id);
    if (!music) return;
    if (music.id === selectedMusic?.id) {
      setSelectedMusic(null);
    } else {
      setSelectedMusic(music);
    }
  };

  const skipToNextMusic = () => {
    if (!musics) return;
    const index = musics.findIndex((music) => music.id === selectedMusic?.id);
    const nextIndex = index === musics.length - 1 ? 0 : index + 1;
    setSelectedMusic(musics[nextIndex]);
  };

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <div className={'grid h-screen grid-cols-[480px_minmax(900px,_1fr)]'}>
      <div className={'flex flex-col bg-white bg-opacity-90 px-6'}>
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
      </div>
      <Canvas
        className="h-32 scrollbar scrollbar-thumb-red-400"
        camera={{
          zoom: 1,
          position: [10, 1, 0],
          fov: 100
        }}
      >
        <Environment preset="dawn" background blur={0.6} />
        {/* style for hide scroll bar */}
        <ScrollControls damping={0} style={{ left: '15px' }}>
          <MusicList
            handleClick={handleMusicSelect}
            setSelectedMusic={setSelectedMusic}
            musicList={musics}
            selectedMusic={selectedMusic}
          />
        </ScrollControls>
        <ambientLight />
      </Canvas>
      <button
        className={clsx('absolute right-[26%] top-[45%] z-50 flex h-32 w-32 items-center justify-center rounded-full', {
          'opacity-0': selectedMusic === null
        })}
      >
        <Play size={64} className={'fill-current text-gray-400/[0.5]'} />
      </button>
      <Link href={`/music/${selectedMusic?.id}`}>
        <button
          className={clsx(
            'absolute right-[20%] top-[60%] z-50 flex h-20 w-20 items-center justify-center rounded-full bg-orange-200 p-4 transition-opacity duration-700 hover:scale-110 hover:transition-all',
            {
              'opacity-0': selectedMusic === null
            }
          )}
        >
          View more
        </button>
      </Link>
    </div>
  );
};

export default MusicsPage;
