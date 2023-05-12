import React, { useRef } from 'react';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';
import Music from '@/components/Music';
import { useFrame, useThree } from '@react-three/fiber';

type Props = {
  handleClick: (idx: number) => void;
  selectedIdx: null | number;
  setSelectedIdx: React.Dispatch<React.SetStateAction<null | number>>;
  musicList: string[];
};
const MusicList = ({
  handleClick,
  setSelectedIdx,
  selectedIdx,
  musicList
}: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const three = useThree();
  const scroll = useScroll();

  useFrame(() => {
    groupRef.current.position.y = scroll.offset * three.viewport.height * 0.25;
  });

  return (
    <group ref={groupRef}>
      {musicList.map((url, i) => (
        <Music
          key={i}
          url={url}
          index={i}
          handleClick={handleClick}
          setSelectedIdx={setSelectedIdx}
          selectedIdx={selectedIdx}
        />
      ))}
    </group>
  );
};

export default MusicList;
