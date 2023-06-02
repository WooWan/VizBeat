import React from 'react';
import { MeshReflectorMaterial, useTexture } from '@react-three/drei';
import { Vector2 } from 'three';

type Props = {};

export default function StageGround({}: Props) {
  // const floor = useTexture('/SurfaceImperfections003_1K_var1.jpg');
  const normal = useTexture('/SurfaceImperfections003_1K_Normal.jpg');
  const floor = useTexture('/wood2.jpeg');

  return (
    <mesh position={[0, -10, 0]} rotation={[(Math.PI / 180) * -90, 0, 0]}>
      <planeGeometry args={[500, 500]} />
      <MeshReflectorMaterial
        blur={[500, 100]}
        mixBlur={12}
        mixStrength={1.5}
        resolution={1024}
        mirror={1}
        metalness={0}
        roughnessMap={floor}
        normalMap={normal}
        normalScale={new Vector2(2, 2)}
      />
    </mesh>
  );
}
