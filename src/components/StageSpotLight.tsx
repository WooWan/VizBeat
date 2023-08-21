import { SpotLight } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import React, { useEffect, useRef } from 'react';
import { SpotLight as SpotLightType, Vector3 } from 'three';
import { lerp } from 'three/src/math/MathUtils';

type Props = {
  target: Vector3;
  position: Vector3;
  color: number;
  angle: number;
};

export default function StageSpotLight({ target, position, color, angle }: Props) {
  const spotLightRef = useRef<SpotLightType>(null!);

  useEffect(() => {
    spotLightRef.current.target.position.lerp(target, 0.1);
    spotLightRef.current.target.updateMatrixWorld();
    console.log(spotLightRef.current.intensity);
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
