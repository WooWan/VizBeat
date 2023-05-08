import React, { useRef } from 'react';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';
import Music from '@/components/Music';
import {useFrame, useThree} from '@react-three/fiber';

const list = [
  '/album/avril.png',
  '/album/blonde.jpeg',
  '/album/daft.jpeg',
  '/album/guns.jpeg',
  '/album/nevermind.jpg.webp',
  '/album/aimyon.jpeg',
  '/album/billie.webp',
  '/album/blackpink.jpeg',
  '/album/breeders.jpeg',
  '/album/damn.jpeg',
  '/album/newjeans.webp',
  '/album/Q.jpeg'
];

type Props = {
  handleClick: (idx: number) => void;
  selectedIdx: null | number;
  setSelectedIdx: React.Dispatch<React.SetStateAction<null | number>>;
}
const MusicList = ({handleClick, setSelectedIdx, selectedIdx} : Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const three = useThree()
  const scroll = useScroll();

  useFrame(() => {
    groupRef.current.position.y =  scroll.offset * three.viewport.height * 0.25;
  });

  return (
    <group ref={groupRef}>
      {list.map((url, i) => (
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
