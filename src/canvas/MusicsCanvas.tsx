import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, ScrollControls } from '@react-three/drei';
import MusicList from '@/components/MusicList';
import { Music } from '@prisma/client';

type Props = {
  handleMusicSelect: (id: string) => void;
  musics: Music[];
  selectedMusic: Music | null;
  setSelectedMusic: React.Dispatch<React.SetStateAction<Music | null>>;
};

const MusicsCanvas = ({ handleMusicSelect, musics, setSelectedMusic, selectedMusic }: Props) => {
  return (
    <Canvas
      className="h-32 scrollbar scrollbar-thumb-red-400"
      camera={{
        zoom: 1,
        position: [10, 1, 0],
        fov: 100
      }}
    >
      <Environment files={'/background/dawn.hdr'} background blur={0.6} />
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
  );
};

export default MusicsCanvas;
