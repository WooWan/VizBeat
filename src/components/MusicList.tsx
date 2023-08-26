import React, { SetStateAction, useRef } from 'react';
import { useScroll } from '@react-three/drei';
import MusicAlbum from '@/components/Music';
import { useFrame, useThree } from '@react-three/fiber';
import { Music } from '@prisma/client';
import { Group } from 'three';

type Props = {
  musicList?: Music[];
};

const MusicList = ({ musicList }: Props) => {
  const groupRef = useRef<Group>(null!);
  const three = useThree();
  const scroll = useScroll();

  useFrame(() => {
    groupRef.current.position.y = scroll.offset * three.viewport.height * 0.25;
  });

  return (
    <group ref={groupRef}>
      {musicList?.map((music, i) => (
        <MusicAlbum
          key={i}
          music={music}
          index={i}
          musics={musicList}
          groupY={scroll.offset * three.viewport.height * 0.25}
        />
      ))}
    </group>
  );
};

export default MusicList;
