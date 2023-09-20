import React, { useRef } from 'react';
import { useScroll } from '@react-three/drei';
import MusicAlbum from '@/components/Music';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useMusicStore } from '@/store/music';
import { lerp } from 'three/src/math/MathUtils';
import { useMusics } from '@/hooks/queries/music/useMusics';

const MusicList = () => {
  const { data: musicList } = useMusics();
  const groupRef = useRef<Group>(null!);
  const scroll = useScroll();
  const selectedMusic = useMusicStore((state) => state.musicInfo);
  const length = musicList?.length;

  useFrame(() => {
    if (musicList) {
      const selectedIdx = musicList.findIndex((music) => music.id === selectedMusic?.id);
      if (selectedIdx !== -1) {
        groupRef.current.position.y = lerp(groupRef.current.position.y, selectedIdx * 1.5, 0.05);
      } else {
        groupRef.current.position.y = scroll.offset * (musicList.length - 1) * 1.5;
      }
    }
  });

  return (
    <group ref={groupRef} key={length}>
      {musicList?.map((music, index) => (
        <MusicAlbum key={music.id} music={music} index={index} musics={musicList} />
      ))}
    </group>
  );
};

export default MusicList;
