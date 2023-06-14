import React from 'react';
import Model from './Model';
import { stages } from '@/constants/stage';

export default function StageGround() {
  return (
    <group>
      {stages.map((stage, index) => (
        <Model key={index} position={stage.position} rotation={stage.rotation} scale={stage.scale} url={stage.url} />
      ))}
    </group>
  );
}
