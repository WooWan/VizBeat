import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import MusicAlbum from '@/components/Music';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useMusicStore } from '@/store/music';
import { lerp } from 'three/src/math/MathUtils';
import { useMusics } from '@/hooks/queries/music/useMusics';

const MusicList = () => {
  const { data: musics } = useMusics();
  const groupRef = useRef<Group>(null!);
  const scroll = useScroll();
  const selectedMusic = useMusicStore((state) => state.musicInfo);
  const length = musics?.length;

  useFrame(() => {
    if (musics) {
      const selectedIdx = musics.findIndex((music) => music.id === selectedMusic?.id);
      if (selectedIdx !== -1) {
        groupRef.current.position.y = lerp(groupRef.current.position.y, selectedIdx * 1.5, 0.05);
      } else {
        groupRef.current.position.y = scroll.offset * (musics.length - 1) * 1.5;
      }
    }
  });

  return (
    <group ref={groupRef} key={length}>
      {musics?.map((music, index) => (
        <MusicAlbum key={music.id} music={music} index={index} musics={musics} />
      ))}
    </group>
  );
};

export default MusicList;
