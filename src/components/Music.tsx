import * as THREE from 'three';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { useRef, useState } from 'react';
import { TextureLoader } from 'three';
import { lerp } from 'three/src/math/MathUtils';

const radian = Math.PI / 180;

type Props = {
  url: string;
  index: number;
  handleClick: (idx: number) => void;
  previousIdx: null | number;
  selectedIdx: null | number;
  setPreviousIdx: (idx: null | number) => void;
  // scrollToItem: (idx: number) => void;
};

const Music = ({ url, index, handleClick, previousIdx, selectedIdx, setPreviousIdx }: Props) => {
  const [previous, setPrevious] = useState(0);
  const [originalPos] = useState(2 - index * 1.5);
  const [upPos] = useState(7 - index * 1.5);
  const [downPos] = useState(-3 - index * 1.5);
  const [rotation, setRotation] = useState(radian * 10 * index);
  const { camera } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const data = useScroll();
  // console.log(data);
  const cover = useLoader(TextureLoader, url);
  const texture = useLoader(TextureLoader, '/cdtexture.jpg');

  useFrame((state, delta) => {
    console.log(state.size);
    // console.log(data.offset, delta);
    camera.position.y = -data.offset * 10;
  });
  useFrame(() => {
    // camera.position.y -= data.offset - previous;
    // setPrevious(data.offset);

    if (selectedIdx == index) {
      //내가 선택되면
      meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, radian * 90, 0.05);
      meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, radian * 0, 0.05);
      meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, radian * -90, 0.05);
      camera.position.y = lerp(camera.position.y, originalPos + 5, 0.05);
    } else if (selectedIdx !== null) {
      //남이 선택되면
      if (selectedIdx > index) {
        meshRef.current.position.y = lerp(meshRef.current.position.y, upPos, 0.05);
      } else {
        meshRef.current.position.y = lerp(meshRef.current.position.y, downPos, 0.05);
      }
    } else {
      meshRef.current.position.y = lerp(meshRef.current.position.y, originalPos, 0.05);
      meshRef.current.rotation.x = lerp(meshRef.current.rotation.x, 0, 0.05);
      meshRef.current.rotation.z = lerp(meshRef.current.rotation.z, 0, 0.05);

      if (previousIdx === index) {
        // if(Math.abs(meshRef.current.rotation.y-rotation) < radian*30) meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, rotation, 0.1)
        meshRef.current.rotation.y = lerp(meshRef.current.rotation.y, rotation, 0.05);
        setPreviousIdx(null);
      }
    }
  }, 0);
  //
  useFrame(() => {
    setRotation(rotation + 0.1 * radian);
    if (selectedIdx !== index) {
      meshRef.current.rotation.y = rotation;
      meshRef.current.rotation.y %= 360 * radian;
    }
  });

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
