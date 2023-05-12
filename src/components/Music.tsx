import * as THREE from 'three';
import { useFrame, useLoader } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { useRef, useState, useEffect } from 'react';
import { TextureLoader } from 'three';
import { lerp } from 'three/src/math/MathUtils';
import {MeshAxis, YAxis} from "@/types/Axis";

const radian = Math.PI / 180;

type Props = {
  url: string;
  index: number;
  handleClick: (idx: number) => void;
  selectedIdx: null | number;
  setSelectedIdx: (idx: null | number) => void;
};

const LERP_FACTOR = 0.05;

const Music = ({
  url,
  index,
  handleClick,
  selectedIdx,
  setSelectedIdx
}: Props) => {
  const [originalPosition] = useState(2- index * 1.5);
  const [upPosition] = useState(7 - index * 1.5);
  const [downPosition] = useState(-3 - index * 1.5);
  const [rotation, setRotation] = useState(radian * 10 * index);
  const meshRef = useRef<THREE.Mesh>(null!);
  const data = useScroll();
  const cover = useLoader(TextureLoader, url);
  const texture = useLoader(TextureLoader, '/cdtexture.jpg');

  const positionMap = {
    up: upPosition,
    down: downPosition,
    original: originalPosition
  };

  const updateRotation = ({x,y,z}:MeshAxis)  =>{
    meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, x, LERP_FACTOR);
    meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, y, LERP_FACTOR);
    meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, z, LERP_FACTOR);
  }

  const updatePosition = ({y}: YAxis) => {
    meshRef.current.position.y = lerp(meshRef.current.position.y, y, LERP_FACTOR);
  }

  useFrame(() => {
    if (selectedIdx === null) return
    const key = selectedIdx > index ? "up" : "down";
    if (selectedIdx === index) {
      updateRotation({x: radian * 90, y: 0, z: radian * -90});
    } else {
      updatePosition({y: positionMap[key]});
    }
  });

  useFrame(() => {
    if (selectedIdx === null) {
      updatePosition({y: originalPosition});
      updateRotation({x: 0, y: 0, z: 0});
    }
  }, 0 )

  useFrame(() => {
    setRotation((prev) => prev + 0.1 * radian);
    if (selectedIdx !== index) {
      meshRef.current.rotation.y = rotation;
      meshRef.current.rotation.y %= 360 * radian;
    }
  });


  useEffect(() => {
    if (selectedIdx !== null) {
      updatePosition({y: positionMap["original"]});
      updateRotation({x: 0, y: 0, z: 0});
      setSelectedIdx(null);
    }
  }, [data.offset]);

  return (
    <mesh
      ref={meshRef}
      onClick={(e) => {
        e.stopPropagation();
        handleClick(index);
      }}
      position={[0, 2 - index * 1.5, -3]}
      rotation={[0, radian * 10 * index, 0]}
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


