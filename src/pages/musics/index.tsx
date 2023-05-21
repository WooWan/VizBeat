import React, { useState } from 'react';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { Music } from '@prisma/client';
import clsx from 'clsx';
import Link from 'next/link';
import { Play } from 'lucide-react';
import Loading from '@/components/Loading';
import MusicsNavbar from '@/components/layout/MusicsNavbar';
import MusicsCanvas from '@/canvas/MusicsCanvas';

const MusicsPage = () => {
  const { data: musics, isLoading, isError } = useMusics();
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);

  const handleMusicSelect = (id: string) => {
    const music = musics?.find((music) => music.id === id);
    if (!music) return;
    if (music.id === selectedMusic?.id) {
      setSelectedMusic(null);
    } else {
      setSelectedMusic(music);
    }
  };

  if (isLoading) return <Loading />;
  if (isError) return <div>error...</div>;

  return (
    <div className={'grid h-screen grid-cols-[480px_minmax(900px,_1fr)]'}>
      <MusicsNavbar
        musics={musics}
        selectedMusic={selectedMusic}
        setSelectedMusic={setSelectedMusic}
        handleMusicSelect={handleMusicSelect}
      />
      <MusicsCanvas
        handleMusicSelect={handleMusicSelect}
        musics={musics}
        selectedMusic={selectedMusic}
        setSelectedMusic={setSelectedMusic}
      />
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
