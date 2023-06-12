import { SpotLight } from '@react-three/drei';
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

type Props = {
  target: THREE.Vector3;
  position: THREE.Vector3;
  color: number;
  angle: number;
};

export default function StageSpotLight({ target, position, color, angle }: Props) {
  const spotLightRef = useRef<any>(null!);

  useEffect(() => {
    spotLightRef.current.target.position.lerp(target, 0.1);
    spotLightRef.current.target.updateMatrixWorld();
  }, []);

  return (
    <SpotLight
      ref={spotLightRef}
      penumbra={0.1}
      decay={0}
      angle={angle}
      distance={0}
      intensity={5}
      position={position}
      color={color}
    />
  );
}
