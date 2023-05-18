import React, { SetStateAction, useRef } from 'react';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';
import MusicCard from '@/components/Music';
import { useFrame, useThree } from '@react-three/fiber';
import { Music } from '@prisma/client';

type Props = {
  handleClick: (id: string) => void;
  musicList: Music[];
  selectedMusic: Music | null;
  setSelectedMusic: React.Dispatch<SetStateAction<Music | null>>;
};

const MusicList = ({ handleClick, musicList, selectedMusic, setSelectedMusic }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const three = useThree();
  const scroll = useScroll();

  useFrame(() => {
    groupRef.current.position.y = scroll.offset * three.viewport.height * 0.25;
  });

  return (
    <group ref={groupRef}>
      {musicList?.map((music, i) => (
        <MusicCard
          key={i}
          music={music}
          index={i}
          handleClick={handleClick}
          selectedMusic={selectedMusic}
          setSelectedMusic={setSelectedMusic}
          musics={musicList}
          groupY={scroll.offset * three.viewport.height * 0.25}
        />
      ))}
    </group>
  );
};

export default MusicList;
