import React, { useRef } from 'react';
import * as THREE from 'three';
import { useScroll } from '@react-three/drei';
import MusicCard from '@/components/Music';
import { useFrame, useThree } from '@react-three/fiber';
import { lerp } from 'three/src/math/MathUtils';
import { Music } from '@prisma/client';

type Props = {
  handleClick: (idx: number) => void;
  selectedIdx: null | number;
  setSelectedIdx: React.Dispatch<React.SetStateAction<null | number>>;
  musicList: Music[];
};

const MusicList = ({ handleClick, setSelectedIdx, selectedIdx, musicList }: Props) => {
  const groupRef = useRef<THREE.Group>(null!);
  const sphereRef = useRef<THREE.MeshStandardMaterial>(null!);
  const three = useThree();
  const scroll = useScroll();

  useFrame(() => {
    groupRef.current.position.y = scroll.offset * three.viewport.height * 0.25;
  });

  useFrame(() =>{
    if(selectedIdx !== null) {
      sphereRef.current.opacity = lerp(sphereRef.current.opacity, 1, 0.02)
    }
  })



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
      {selectedIdx !== null ? (
        <mesh position={[3,-2-scroll.offset * three.viewport.height * 0.25,-3]}>
          <sphereGeometry args={[2,32,16]}/>
          <meshStandardMaterial ref={sphereRef}color={'blue'} opacity={0} transparent/>
        </mesh>
      ) : null}
    </group>
  );
};

export default MusicList;
