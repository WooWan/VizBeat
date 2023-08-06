import React from 'react';
import WoodFloor from '@/components/3d/stage/WoodFloor';
import Garage from '@/components/3d/stage/Garage';

export default function StageGround() {
  return (
    <group>
      <WoodFloor position={[10, -10, 0]} scale={[0.12, 0.02, 0.04]} />
      <Garage position={[30, -10, 30]} rotation={[0, Math.PI / 2, 0]} scale={[0.02, 0.02, 0.03]} />
    </group>
  );
}
