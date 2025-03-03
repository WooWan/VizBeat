import { Mesh, TextureLoader } from 'three';
import { ThreeEvent, useFrame, useLoader } from '@react-three/fiber';
import React, { useRef, useState } from 'react';
import { lerp } from 'three/src/math/MathUtils';
import { MeshAxis, YAxis } from '@/types/Axis';
import { Music } from '@prisma/client';
import { useMusicStore } from '@/store/music';
import { shallow } from 'zustand/shallow';
import { useScroll } from '@react-three/drei';
import { useRouter } from 'next/router';

const radian = Math.PI / 180;

type Props = {
  music: Music;
  index: number;
  musics: Music[];
};

const LERP_FACTOR = 0.05;

const MusicAlbum = ({ music, index, musics }: Props) => {
  const router = useRouter();
  const [originalPosition] = useState(-index * 1.5);
  const rotationRef = useRef(radian * 5 * index);
  const meshRef = useRef<Mesh>(null!);
  const { api, musicInfo } = useMusicStore((state) => ({ api: state.api, musicInfo: state.musicInfo }), shallow);
  const cover = useLoader(TextureLoader, music.albumCover);
  const texture = useLoader(TextureLoader, '/images/cdtexture.jpg');
  const scroll = useScroll();
  const scrollRef = useRef(-1);

  const updateRotation = ({ x, y, z }: MeshAxis) => {
    meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, x, LERP_FACTOR);
    meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, y, LERP_FACTOR);
    meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, z, LERP_FACTOR);
  };

  const updatePosition = ({ y }: YAxis) => {
    meshRef.current.position.y = lerp(meshRef.current.position.y, y, LERP_FACTOR);
  };

  const resetToOriginalState = () => {
    meshRef.current.rotation.y = rotationRef.current;
    updatePosition({ y: originalPosition });
  };

  const adjustPositionRelativeToSelected = (selectedIdx: number) => {
    const indexGap = index - selectedIdx;
    updatePosition({
      y: originalPosition + (indexGap < 0 ? 5 : -5)
    });
  };

  const centerSelectedAlbum = () => {
    updatePosition({ y: originalPosition });
    updateRotation({
      x: Math.PI * 1 + radian * 90,
      y: Math.PI,
      z: Math.PI * 1 + radian * -90
    });
  };
  const isSelectedMusic = (selctedIndex: number, index: number) => selctedIndex === index;

  const handleFrameUpdate = () => {
    rotationRef.current = (rotationRef.current + radian * 0.4) % (Math.PI * 2);
    const selectedIdx = musics.findIndex((m) => m.id === musicInfo?.id);
    if (selectedIdx === -1) return resetToOriginalState();

    if (isSelectedMusic(selectedIdx, index)) {
      centerSelectedAlbum();
    } else {
      meshRef.current.rotation.y = rotationRef.current;
      adjustPositionRelativeToSelected(selectedIdx);
    }
  };

  useFrame(() => {
    handleFrameUpdate();
  });

  useFrame(() => {
    if (scroll.offset !== scrollRef.current && musicInfo) {
      api.clear();
    }
    scrollRef.current = scroll.offset;
  });

  const selectAlbum = (e: ThreeEvent<MouseEvent>) => {
    const selectedIdx = musics.findIndex((music) => music.id === musicInfo?.id);
    api.clear();
    if (selectedIdx !== index) {
      api.selectAudio(music);
      router.prefetch(`/stage/${music.id}`);
    }
    e.stopPropagation();
  };

  return (
    <group
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <mesh
        position={[0, originalPosition, 0]}
        rotation={[0, rotationRef.current, 0]}
        ref={meshRef}
        onClick={selectAlbum}
      >
        <boxGeometry args={[10, 0.7, 10]} />
        <meshBasicMaterial attach="material-0" map={texture} />
        <meshBasicMaterial attach="material-1" map={texture} />
        <meshBasicMaterial attach="material-2" map={cover} />
        <meshBasicMaterial attach="material-3" map={cover} />
        <meshBasicMaterial attach="material-4" map={texture} />
        <meshBasicMaterial attach="material-5" map={texture} />
      </mesh>
    </group>
  );
};
export default MusicAlbum;
