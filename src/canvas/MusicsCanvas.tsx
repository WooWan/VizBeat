import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';
import { Music } from '@prisma/client';
import { useMediaQuery } from '@/hooks/queries/useMediaQuery';
import { mediaQuery } from '@/utils/mediaQuery';

type Props = {
  handleMusicSelect: (id: string) => void;
  musics: Music[];
  selectedMusic: Music | null;
  setSelectedMusic: React.Dispatch<React.SetStateAction<Music | null>>;
};

const MusicsCanvas = ({ handleMusicSelect, musics, setSelectedMusic, selectedMusic }: Props) => {
  const matches = useMediaQuery(mediaQuery.LG);
  return (
    <Canvas
      className="scrollbar-hide"
      camera={{
        zoom: matches ? 1 : 0.5,
        position: [10, 1, 0],
        fov: 100
      }}
    >
      <Environment files={'/background/dawn.hdr'} background blur={0.6} />
      <ScrollControls damping={0}>
        <MusicList
          handleClick={handleMusicSelect}
          setSelectedMusic={setSelectedMusic}
          musicList={musics}
          selectedMusic={selectedMusic}
        />
      </ScrollControls>
      <ambientLight />
    </Canvas>
  );
};

export default MusicsCanvas;
