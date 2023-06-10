import React from 'react';
import Model from './Model';

type Props = {};

export default function StageGround({}: Props) {
  return (
    <group>
      <Model
        position={[10, -10, 0]}
        scale={[0.12, 0.02, 0.04]}
        url="/gltf/substance_wood_floor_material_pbr/scene.gltf"
      />
      <Model
        position={[30, -10, 30]}
        rotation={[0, Math.PI / 2, 0]}
        scale={[0.02, 0.02, 0.03]}
        url="/gltf/old_garage/scene.gltf"
      />
    </group>
  );
}
