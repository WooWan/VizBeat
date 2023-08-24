import React, { Suspense, useState } from 'react';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { Music } from '@prisma/client';
import MusicsNavbar from '@/components/layout/MusicsNavbar';
import MusicsCanvas from '@/canvas/MusicsCanvas';
import { cn } from '@/lib/utils';
import { PlayIcon } from 'lucide-react';
import Link from 'next/link';
import { useMusicPlayStore } from '@/store/music';

const MusicsPage = () => {
  const { data: musics } = useMusics();
  const [selectedMusic, setSelectedMusic] = useState<Music | null>(null);
  const setIsMusicPlay = useMusicPlayStore((state) => state.setIsMusicPlay);

  const handleMusicSelect = (id: string) => {
    const music = musics?.find((music) => music.id === id);
    if (!music) return;
    if (music.id === selectedMusic?.id) {
      setSelectedMusic(null);
    } else {
      setSelectedMusic(music);
    }
  };

  return (
    <div className={'grid h-full lg:grid-cols-[480px_minmax(900px,_1fr)]'}>
      <MusicsNavbar musics={musics} selectedMusic={selectedMusic} handleMusicSelect={handleMusicSelect} />
      <section className={'relative flex justify-center'}>
        <Link
          href="/stage"
          onClick={() => setIsMusicPlay(true)}
          className={cn(
            'absolute left-1/2 top-1/2 z-50 hidden h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/[0.7] lg:h-20 lg:w-20',
            {
              flex: selectedMusic
            }
          )}
        >
          <PlayIcon className={'h-6 w-6 fill-current text-black/[0.85] lg:h-10 lg:w-10'} />
        </Link>
        <Suspense>
          <MusicsCanvas
            handleMusicSelect={handleMusicSelect}
            musics={musics}
            selectedMusic={selectedMusic}
            setSelectedMusic={setSelectedMusic}
          />
        </Suspense>
      </section>
    </div>
  );
};

export default MusicsPage;
