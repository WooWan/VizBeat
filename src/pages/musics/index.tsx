import React, { useState } from 'react';
import { useMusics } from '@/hooks/queries/music/useMusics';
import { Music } from '@prisma/client';
import Loading from '@/components/Loading';
import MusicsNavbar from '@/components/layout/MusicsNavbar';
import MusicsCanvas from '@/canvas/MusicsCanvas';
import { useGLTF } from '@react-three/drei';
import { instruments } from '@/constants/music';
import { stages } from '@/constants/stage';

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
      <section className={'relative flex justify-center'}>
        <MusicsCanvas
          handleMusicSelect={handleMusicSelect}
          musics={musics}
          selectedMusic={selectedMusic}
          setSelectedMusic={setSelectedMusic}
        />
      </section>
    </div>
  );
};

export default MusicsPage;

useGLTF.preload(instruments.map((instrument) => instrument.url));
useGLTF.preload(stages.map((stage) => stage.url));
