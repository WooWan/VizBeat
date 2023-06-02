import React, { Suspense, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import Model from '@/components/Model';
import { OrbitControls, Stars, TransformControls } from '@react-three/drei';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { KernelSize } from 'postprocessing';
import * as THREE from 'three';
import { create } from 'zustand';
import { useControls } from 'leva';
import StageGround from '@/components/StageGround';
import Rig from '@/components/Rig';
import Triangle from '@/components/Triangle';

type ThreeState = {
  target: THREE.Object3D | null;
  setTarget: (target: THREE.Object3D) => void;
};
export const useStore = create<ThreeState>((set) => ({
  target: null,
  setTarget: (target) => set({ target })
}));

const Index = () => {
  const { target, setTarget } = useStore();
  const spotRef = useRef<THREE.SpotLight>(null!);
  const RADIAN = Math.PI / 180;
  const { mode } = useControls({
    mode: { value: 'translate', options: ['translate', 'rotate', 'scale'] }
  });

  return (
    <Canvas
      camera={{
        position: [0, 50, 0],
        fov: 100,
        near: 0.1,
        far: 3000
      }}
    >
      <color attach="background" args={['black']} />
      <Stars />
      <Rig>
        <Triangle
          color="#ff2060"
          scale={0.3}
          position={new THREE.Vector3(25, -50, -60)}
          rotation={new THREE.Euler(0, 0, Math.PI / 3)}
        />
        <Triangle
          color="cyan"
          scale={0.3}
          position={new THREE.Vector3(85, -50, -80)}
          rotation={new THREE.Euler(0, 0, Math.PI / 3)}
        />
        <Triangle
          color="orange"
          scale={0.3}
          position={new THREE.Vector3(-35, -50, -80)}
          rotation={new THREE.Euler(0, 0, Math.PI / 3)}
        />
        <StageGround />
        <Suspense>
          <Model
            position={[20, -12, 5]}
            rotation={[0, Math.PI / 2, 0]}
            scale={[30, 30, 30]}
            url="/gltf/electric_guitar/scene.gltf"
          />
          <Model
            position={[-14, -10, 10]}
            rotation={[0, Math.PI, 0]}
            scale={[1.5, 1.5, 1.5]}
            url="/gltf/low_poly_mic_stand/scene.gltf"
          />
          <Model position={[30, -15, 0]} scale={[10, 10, 10]} url="/gltf/piano/scene.gltf" />
          <Model position={[30, 5, 8]} scale={[25, 25, 25]} url="/gltf/fender_pj_bass/scene.gltf" />
          <Model position={[22, 0, -20]} scale={[0.015, 0.015, 0.015]} url="/gltf/drum_kit/scene.gltf" />
        </Suspense>
      </Rig>
      <EffectComposer multisampling={8}>
        <Bloom kernelSize={3} luminanceThreshold={0} luminanceSmoothing={0.4} intensity={0.6} />
        <Bloom kernelSize={KernelSize.HUGE} luminanceThreshold={0} luminanceSmoothing={0} intensity={0.5} />
      </EffectComposer>
      {/* <OrbitControls /> */}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      <axesHelper args={[30]} />
      <ambientLight intensity={1} />
      {/* <spotLight penumbra={0} intensity={1} position={[-10, 10, 50]} color={'0xffffff'} /> */}
    </Canvas>
  );
};

export default Index;
