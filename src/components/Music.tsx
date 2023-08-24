import { Mesh, TextureLoader } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { lerp } from 'three/src/math/MathUtils';
import { MeshAxis, YAxis } from '@/types/Axis';
import { Music } from '@prisma/client';

const radian = Math.PI / 180;

type Props = {
  music: Music;
  index: number;
  handleClick: (id: string) => void;
  groupY: number;
  selectedMusic: Music | null;
  musics?: Music[];
  setSelectedMusic: React.Dispatch<React.SetStateAction<Music | null>>;
};

const LERP_FACTOR = 0.05;

const MusicAlbum = ({ music, index, handleClick, groupY, selectedMusic, musics, setSelectedMusic }: Props) => {
  const [originalPosition] = useState(2 - index * 1.5);
  const [rotation, setRotation] = useState(radian * 10 * index);
  const meshRef = useRef<Mesh>(null!);
  const cover = useLoader(TextureLoader, music.albumCover);
  const texture = useLoader(TextureLoader, '/images/cdtexture.jpg');
  const scroll = useScroll();

  const updateRotation = ({ x, y, z }: MeshAxis) => {
    meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, x, LERP_FACTOR);
    meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, y, LERP_FACTOR);
    meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, z, LERP_FACTOR);
  };

  const updatePosition = ({ y }: YAxis) => {
    meshRef.current.position.y = lerp(meshRef.current.position.y, y, LERP_FACTOR);
  };

  useFrame(() => {
    if (!musics) return;
    if (selectedMusic === null) return; //아무것도 선택 안됬을때
    const selectedIdx = musics.findIndex((music) => music.id === selectedMusic?.id);
    //내가 선택됬을떄
    if (selectedMusic.id === music.id) {
      updateRotation({ x: radian * 90, y: 0, z: radian * -90 });
      updatePosition({ y: -groupY });
    } else {
      //남이 선택됬을때
      const indexGap = index - selectedIdx;
      if (indexGap < 0) {
        updatePosition({ y: 10 - groupY - indexGap * 1.5 });
      } else {
        updatePosition({ y: -10 - groupY - indexGap * 1.5 });
      }
    }
  });

  useFrame(() => {
    if (selectedMusic?.id !== music.id) {
      updatePosition({ y: originalPosition });
      updateRotation({ x: 0, y: 0, z: 0 });
    }
  }, 0);

  useFrame(() => {
    setRotation((prev) => prev + 0.1 * radian);
    if (selectedMusic?.id !== music.id) {
      meshRef.current.rotation.y = rotation;
      meshRef.current.rotation.y %= 360 * radian;
    } else {
      // const speed = 15;
      // meshRef.current.rotation.y = Math.sin(rotation * speed) / 10;
      // meshRef.current.rotation.x = 90 * radian + Math.sin(rotation * speed) / 15;
      // meshRef.current.rotation.z = -90 * radian + Math.cos(rotation * speed) / 15;

      meshRef.current.rotation.y %= 360 * radian;
      meshRef.current.rotation.z %= 360 * radian;
      meshRef.current.rotation.x %= 360 * radian;
    }
  });

  useEffect(() => {
    if (selectedMusic !== null) {
      updatePosition({ y: originalPosition });
      updateRotation({ x: 0, y: 0, z: 0 });
      setSelectedMusic(null);
    }
  }, [scroll.offset]);

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        handleClick(music.id);
        e.stopPropagation();
      }}
    >
      <boxGeometry args={[10, 0.7, 10]} />
      <meshBasicMaterial attach="material-0" map={texture} />
      <meshBasicMaterial attach="material-1" map={texture} />
      <meshBasicMaterial attach="material-2" map={cover} />
      <meshBasicMaterial attach="material-3" map={cover} />
      <meshBasicMaterial attach="material-4" map={texture} />
      <meshBasicMaterial attach="material-5" map={texture} />
    </mesh>
  );
};
export default MusicAlbum;
