import { useFrame, useThree } from '@react-three/fiber';
import React, { ReactNode, useRef } from 'react';
import { Vector3 } from 'three';

type Props = {
  children: ReactNode;
};

export default function Rig({ children }: Props) {
  const groupRef = useRef<any>(null);
  const vector = new Vector3();
  const { camera, mouse } = useThree();

  useFrame(() => {
    camera.position.lerp(vector.set(-mouse.x * 10, 20 + -mouse.y * 5, 70), 0.05);
  });

  return <group ref={groupRef}>{children}</group>;
}
