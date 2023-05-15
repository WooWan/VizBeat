import * as THREE from 'three';
import { TextureLoader } from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { lerp } from 'three/src/math/MathUtils';
import { MeshAxis, YAxis } from '@/types/Axis';
import { Music } from '@prisma/client';

const radian = Math.PI / 180;

type Props = {
  music: Music;
  index: number;
  handleClick: (idx: number) => void;
  selectedIdx: null | number;
  setSelectedIdx: (idx: null | number) => void;
  groupY: number;
};

const LERP_FACTOR = 0.05;

const Music = ({ music, index, handleClick, selectedIdx, setSelectedIdx, groupY }: Props) => {
  const [originalPosition] = useState(2 - index * 1.5);
  const [rotation, setRotation] = useState(radian * 10 * index);
  const meshRef = useRef<THREE.Mesh>(null!);
  const cover = useLoader(TextureLoader, music.albumCover);
  const texture = useLoader(TextureLoader, '/cdtexture.jpg');
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
    if (selectedIdx === null) return; //아무것도 선택 안됬을때
    if (selectedIdx === index) {
      //내가 선택됬을떄
      updateRotation({ x: radian * 90, y: 0, z: radian * -90 });
      updatePosition({ y: -groupY });
    } else {
      //남이 선택됬을때
      const indexGap = index - selectedIdx;
      if (indexGap < 0) {
        updatePosition({ y: 5 - groupY - indexGap * 1.5 });
      } else {
        updatePosition({ y: -5 - groupY - indexGap * 1.5 });
      }
    }
  });

  useFrame(() => {
    if (selectedIdx === null) {
      updatePosition({ y: originalPosition });
      updateRotation({ x: 0, y: 0, z: 0 });
    }
  }, 0);

  useFrame(() => {
    setRotation((prev) => prev + 0.1 * radian);
    if (selectedIdx !== index) {
      meshRef.current.rotation.y = rotation;
      meshRef.current.rotation.y %= 360 * radian;
    }
  });

  useEffect(() => {
    if (selectedIdx !== null) {
      updatePosition({ y: originalPosition });
      updateRotation({ x: 0, y: 0, z: 0 });
      setSelectedIdx(null);
    }
  }, [scroll.offset]);

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        handleClick(index);
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
export default Music;
