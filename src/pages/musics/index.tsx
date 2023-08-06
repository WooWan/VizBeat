import React, { Suspense, useState } from 'react';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { Music } from '@prisma/client';
import MusicsNavbar from '@/components/layout/MusicsNavbar';
import MusicsCanvas from '@/canvas/MusicsCanvas';

const MusicsPage = () => {
  const { data: musics } = useMusics();
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

  return (
    <div className={'grid h-full lg:grid-cols-[480px_minmax(900px,_1fr)]'}>
      <MusicsNavbar
        musics={musics}
        selectedMusic={selectedMusic}
        setSelectedMusic={setSelectedMusic}
        handleMusicSelect={handleMusicSelect}
      />
      <section className={'relative flex justify-center'}>
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
