import { useFrame, useThree } from '@react-three/fiber';
import React, { Children, ReactNode, useRef } from 'react';
import * as THREE from 'three';
import { lerp } from 'three/src/math/MathUtils';

type Props = {
  children: ReactNode;
};

export default function Rig({ children }: Props) {
  const groupRef = useRef<any>(null);
  const vector = new THREE.Vector3();
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.lerp(vector.set(mouse.x * 2, 10, 40), 0.05);
    const newVector = new THREE.Vector3(mouse.x * 1, mouse.y * 1, 1);
    groupRef.current.position.lerp(newVector, 0.1);
    groupRef.current.position.y = lerp(groupRef.current.rotation.y, (-mouse.x * Math.PI) / 20, 0.1);
  });

  return <group ref={groupRef}>{children}</group>;
}
