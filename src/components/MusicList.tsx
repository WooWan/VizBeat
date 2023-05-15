import React, { useRef } from 'react';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';
import MusicCard from '@/components/Music';
import { useFrame, useThree } from '@react-three/fiber';
import { Music } from '@prisma/client';

type Props = {
  handleClick: (idx: number) => void;
  selectedIdx: null | number;
  setSelectedIdx: React.Dispatch<React.SetStateAction<null | number>>;
  musicList: Music[];
};

const MusicList = ({ handleClick, setSelectedIdx, selectedIdx, musicList }: Props) => {
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
          music={music}
          key={i}
          index={i}
          handleClick={handleClick}
          setSelectedIdx={setSelectedIdx}
          selectedIdx={selectedIdx}
          groupY={scroll.offset * three.viewport.height * 0.25}
        />
      ))}
    </group>
  );
};

export default MusicList;
