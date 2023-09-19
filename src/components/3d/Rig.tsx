import { useFrame } from '@react-three/fiber';
import React, { useRef } from 'react';
import { Vector3, Group } from 'three';

type Props = {
  children: React.ReactNode;
};

export default function Rig({ children }: Props) {
  const groupRef = useRef<Group>(null!);
  const vector = new Vector3();

  useFrame((state) => {
    state.camera.position.lerp(vector.set(-state.mouse.x * 10, 15 + -state.mouse.y * 5, 65), 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
}
