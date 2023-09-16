import React, { useEffect, useRef } from 'react';
import Warehouse from '@/components/3d/stage/Warehouse';
import GuitarAmp from '@/components/3d/stage/GuitarAmp';
import BassAmp from '@/components/3d/stage/BassAmp';
import Speaker from '@/components/3d/stage/Speaker';
import MonitorSpeaker from '@/components/3d/stage/MonitorSpeaker';
import { SpotLight as SpotLightType, Vector3 } from 'three';
import { SpotLight } from '@react-three/drei';

export default function StageGround() {
  const rightRef = useRef<SpotLightType>(null!);
  const leftRef = useRef<SpotLightType>(null!);

  useEffect(() => {
    rightRef.current.target.position.lerp(new Vector3(45, -1, 0), 1);
    rightRef.current.target.position.lerp(new Vector3(-45, -1, 0), 1);
  }, []);
  return (
    <group>
      <Warehouse scale={[25, 25, 25]} position={[-20, -70, 40]} />
      <GuitarAmp scale={[40, 40, 40]} position={[80, -10, -20]} rotation={[0, -Math.PI / 6, 0]} />
      <BassAmp scale={[35, 35, 35]} position={[-80, 1, -20]} rotation={[0, Math.PI / 6, 0]} />
      <MonitorSpeaker scale={[0.15, 0.15, 0.15]} position={[40, -7, 40]} rotation={[0, -Math.PI / 2, 0]} />
      <MonitorSpeaker scale={[0.15, 0.15, 0.15]} position={[-40, -7, 40]} rotation={[0, -Math.PI / 2, 0]} />
      <Speaker scale={[0.15, 0.15, 0.15]} position={[50, -1, -55]} rotation={[0, Math.PI, 0]} />
      <Speaker scale={[0.15, 0.15, 0.15]} position={[30, -1, -55]} rotation={[0, Math.PI, 0]} />
      <Speaker scale={[0.15, 0.15, 0.15]} position={[-50, -1, -55]} rotation={[0, Math.PI, 0]} />
      <Speaker scale={[0.15, 0.15, 0.15]} position={[-30, -1, -55]} rotation={[0, Math.PI, 0]} />
      <SpotLight
        ref={rightRef}
        penumbra={0.5}
        decay={1}
        angle={0.8}
        distance={0}
        intensity={0.5}
        position={new Vector3(20, 100, 45)}
        color={0xffffff}
      />
      <SpotLight
        ref={leftRef}
        penumbra={0.5}
        decay={1}
        angle={0.8}
        distance={0}
        intensity={0.5}
        position={new Vector3(-20, 100, 45)}
        color={0xffffff}
      />
    </group>
  );
}
