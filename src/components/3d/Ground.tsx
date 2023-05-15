import { MeshReflectorMaterial } from '@react-three/drei';
import React from 'react';
import Model from '@/components/Model';

const Ground = () => {
  return (
    <mesh castShadow receiveShadow>
      <Model url="/gltf/drum_kit/scene.gltf" position={[4, 0, 0]} scale={0.0015} />
      <planeGeometry args={[150, 150]} />
      <MeshReflectorMaterial
        mirror={0.4}
        blur={[300, 100]}
        resolution={512}
        mixBlur={1}
        mixStrength={60}
        roughness={1}
        depthScale={1.2}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.4}
        color="#151515"
        metalness={0.5}
      />
    </mesh>
  );
};

export default Ground;
